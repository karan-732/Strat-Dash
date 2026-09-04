"""Zero-I/O regression tests for cumulative phase sequencing and context."""

from __future__ import annotations

from unittest.mock import AsyncMock

import httpx
import pytest
from fastapi import HTTPException

from app.agents import runtime
from app.api import routes
from app.db import repo
from app.domain import playbook
from app.services import context, pipeline


@pytest.fixture(autouse=True)
def forbid_external_io(monkeypatch: pytest.MonkeyPatch) -> None:
    """Fail immediately if these unit tests cross a real external boundary."""

    async def unexpected_io(*args: object, **kwargs: object) -> None:
        raise AssertionError("unit test attempted model, network, or database I/O")

    def unexpected_http_client(*args: object, **kwargs: object) -> None:
        raise AssertionError("unit test attempted network I/O")

    monkeypatch.setattr(repo, "execute", unexpected_io)
    monkeypatch.setattr(repo, "batch", unexpected_io)
    monkeypatch.setattr(repo, "one", unexpected_io)
    monkeypatch.setattr(runtime, "complete", unexpected_io)
    monkeypatch.setattr(runtime, "complete_json", unexpected_io)
    monkeypatch.setattr(httpx, "AsyncClient", unexpected_http_client)


async def test_phase_zero_is_unlocked_without_reading_the_repository(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    current_packs = AsyncMock(side_effect=AssertionError("phase zero must not read packs"))
    monkeypatch.setattr(pipeline.repo, "current_packs", current_packs)

    assert await pipeline.phase_unlocked("engagement-1", 0) == (True, "")
    current_packs.assert_not_awaited()


@pytest.mark.parametrize("phase", [-1, playbook.phase_count()])
async def test_intake_rejects_an_unknown_phase_before_any_model_call(
    monkeypatch: pytest.MonkeyPatch, phase: int
) -> None:
    model_run = AsyncMock(side_effect=AssertionError("invalid intake must not call the model"))
    monkeypatch.setattr(routes.pipeline, "run_intake", model_run)

    with pytest.raises(HTTPException) as exc:
        await routes.phase_intake("engagement-1", phase)

    assert exc.value.status_code == 404
    model_run.assert_not_awaited()


@pytest.mark.parametrize("phase", [-1, playbook.phase_count()])
async def test_every_phase_scoped_mutation_rejects_an_unknown_phase(phase: int) -> None:
    calls = [
        routes.set_input("engagement-1", phase, 0, routes.InputState()),
        routes.set_step("engagement-1", phase, 0, routes.StepBody()),
        routes.set_attendance("engagement-1", phase, 0, routes.AttendanceBody()),
        routes.set_deliverable("engagement-1", phase, 1, routes.DeliverableBody()),
        routes.set_note("engagement-1", phase, routes.NoteBody()),
        routes.upload_file("engagement-1", phase, None, "document", -1),
        routes.upload_answers("engagement-1", None, phase, "openrouter"),
        routes.generate_phase("engagement-1", phase),
        routes.reset_phase("engagement-1", phase),
    ]

    for call in calls:
        with pytest.raises(HTTPException) as exc:
            await call
        assert exc.value.status_code == 404


@pytest.mark.parametrize(
    ("available", "missing"),
    [
        ({0, 1, 2}, []),
        ({1, 2}, [0]),
        ({0, 2}, [1]),
        ({0, 1}, [2]),
        ({1}, [0, 2]),
    ],
)
async def test_phase_unlocked_requires_every_earlier_current_pack(
    monkeypatch: pytest.MonkeyPatch,
    available: set[int],
    missing: list[int],
) -> None:
    current_packs = AsyncMock(return_value={phase: {"phase": phase} for phase in available})
    monkeypatch.setattr(pipeline.repo, "current_packs", current_packs)

    unlocked, reason = await pipeline.phase_unlocked("engagement-1", 3)

    assert unlocked == (not missing)
    current_packs.assert_awaited_once_with("engagement-1")
    if not missing:
        assert reason == ""
        return

    assert playbook.phase_label(3) in reason
    for phase in missing:
        assert playbook.phase_label(phase) in reason
    for phase in available & {0, 1, 2}:
        assert playbook.phase_label(phase) not in reason


async def test_cached_intake_preserves_existing_evidence_provenance(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    questions = [
        {
            "phase": 1,
            "kind": "open",
            "body": "Which baseline is approved?",
            "answered_at": None,
        }
    ]
    gathered = {
        "engagement": {"id": "engagement-1"},
        "questions": questions,
        "context": "stable cumulative context",
        "brain": {"version": 7},
    }
    fingerprint = pipeline._intake_fingerprint(gathered["context"], questions, gathered["brain"])
    gather = AsyncMock(return_value=gathered)
    intake_state = AsyncMock(
        return_value={
            "fingerprint": fingerprint,
            "can_run": 1,
            "confidence": 88,
            "verdict": "Ready using evidence already supplied.",
            "will_assume": '[{"assumption":"Use the reported range"}]',
        }
    )
    open_intake = AsyncMock(
        return_value=[
            {
                "ask": "Confirm the approved baseline",
                "why": "The source contains two values",
                "who": "Finance lead",
                "severity": "helpful",
                "have_already": 1,
                "where_from": "Phase 0 output pack",
            },
            {
                "ask": "Name the accountable owner",
                "why": "Ownership is not recorded",
                "who": "Sponsor",
                "severity": "needed",
                "have_already": 0,
                "where_from": "",
            },
        ]
    )
    model_run = AsyncMock(side_effect=AssertionError("cached intake must not call the model"))
    monkeypatch.setattr(pipeline, "gather", gather)
    monkeypatch.setattr(pipeline.repo, "intake_state", intake_state)
    monkeypatch.setattr(pipeline.repo, "open_intake", open_intake)
    monkeypatch.setattr(pipeline.intake_agent, "run", model_run)

    result = await pipeline.run_intake("engagement-1", 2)

    assert result["cached"] is True
    assert result["needs"] == [
        {
            "ask": "Confirm the approved baseline",
            "why": "The source contains two values",
            "who": "Finance lead",
            "severity": "helpful",
            "haveAlready": True,
            "whereFrom": "Phase 0 output pack",
        },
        {
            "ask": "Name the accountable owner",
            "why": "Ownership is not recorded",
            "who": "Sponsor",
            "severity": "needed",
            "haveAlready": False,
            "whereFrom": "",
        },
    ]
    assert result["willAssume"] == [{"assumption": "Use the reported range"}]
    gather.assert_awaited_once_with("engagement-1", 2)
    intake_state.assert_awaited_once_with("engagement-1", 2)
    open_intake.assert_awaited_once_with("engagement-1", 2)
    model_run.assert_not_awaited()


async def test_save_intake_persists_existing_evidence_provenance(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    write_batch = AsyncMock(return_value=[])
    ids = iter(["need-0", "need-1"])
    monkeypatch.setattr(repo, "batch", write_batch)
    monkeypatch.setattr(repo, "rid", lambda prefix: next(ids))
    monkeypatch.setattr(repo, "now", lambda: "2026-09-04T00:00:00Z")

    await repo.save_intake(
        "engagement-1",
        2,
        [
            {
                "ask": "Confirm the approved baseline",
                "why": "Two values are present",
                "who": "Finance lead",
                "severity": "helpful",
                "haveAlready": True,
                "whereFrom": "Phase 0 output pack",
            },
            {
                "ask": "Name the owner",
                "why": "Ownership is absent",
                "who": "Sponsor",
            },
        ],
    )

    write_batch.assert_awaited_once()
    statements = write_batch.await_args.args[0]
    assert statements[0][1] == ["engagement-1", 2]
    assert "have_already" in statements[1][0]
    assert "where_from" in statements[1][0]
    assert statements[1][1] == [
        "need-0",
        "engagement-1",
        2,
        0,
        "Confirm the approved baseline",
        "Two values are present",
        "Finance lead",
        "helpful",
        1,
        "Phase 0 output pack",
        "2026-09-04T00:00:00Z",
    ]
    assert statements[2][1] == [
        "need-1",
        "engagement-1",
        2,
        1,
        "Name the owner",
        "Ownership is absent",
        "Sponsor",
        "needed",
        0,
        "",
        "2026-09-04T00:00:00Z",
    ]


async def test_clear_pack_invalidates_every_dependent_generated_artifact(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    cutoff = AsyncMock(return_value={"cutoff": "2026-09-04T01:00:00Z"})
    write_batch = AsyncMock(return_value=[])
    monkeypatch.setattr(repo, "one", cutoff)
    monkeypatch.setattr(repo, "batch", write_batch)
    monkeypatch.setattr(repo, "now", lambda: "2026-09-04T02:00:00Z")

    await repo.clear_pack("engagement-1", 2)

    cutoff.assert_awaited_once()
    assert cutoff.await_args.args[1] == ["engagement-1", 2, "engagement-1", 2]
    write_batch.assert_awaited_once()
    statements = write_batch.await_args.args[0]
    sql = "\n".join(statement for statement, _ in statements)
    assert "UPDATE phase_packs" in sql
    assert "phase>=?" in sql
    assert "DELETE FROM phase_questions" in sql
    assert "DELETE FROM phase_intake " in sql
    assert "DELETE FROM phase_intake_state" in sql
    assert "DELETE FROM sprint_brain" in sql
    assert statements[-1][1] == ["engagement-1", "2026-09-04T01:00:00Z"]


@pytest.mark.parametrize(
    ("rows", "expected"),
    [
        ([], {}),
        ([{"phase": 1, "pack": '{"phase":1}'}], {}),
        (
            [
                {"phase": 0, "pack": '{"phase":0}'},
                {"phase": 2, "pack": '{"phase":2}'},
                {"phase": 3, "pack": '{"phase":3}'},
            ],
            {0: {"phase": 0}},
        ),
        (
            [
                {"phase": 0, "pack": '{"phase":0}'},
                {"phase": 1, "pack": '{"phase":1}'},
                {"phase": 2, "pack": '{"phase":2}'},
            ],
            {0: {"phase": 0}, 1: {"phase": 1}, 2: {"phase": 2}},
        ),
    ],
)
async def test_current_packs_returns_only_the_contiguous_phase_chain(
    monkeypatch: pytest.MonkeyPatch,
    rows: list[dict[str, object]],
    expected: dict[int, dict[str, int]],
) -> None:
    read = AsyncMock(return_value=rows)
    monkeypatch.setattr(repo, "execute", read)

    assert await repo.current_packs("engagement-1") == expected
    read.assert_awaited_once()


async def test_engagement_list_returns_compact_contiguous_pack_summaries(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    read = AsyncMock(
        return_value=[
            {"id": "engagement-a", "_current_pack_phases": "3,1,0"},
            {"id": "engagement-b", "_current_pack_phases": None},
            {"id": "engagement-c", "_current_pack_phases": "2,0"},
        ]
    )
    monkeypatch.setattr(repo, "execute", read)

    assert await repo.list_engagements() == [
        {"id": "engagement-a", "completed_phases": [0, 1]},
        {"id": "engagement-b", "completed_phases": []},
        {"id": "engagement-c", "completed_phases": [0]},
    ]
    sql = read.await_args.args[0]
    assert "GROUP_CONCAT(DISTINCT p.phase)" in sql
    assert "p.pack" not in sql


async def test_save_pack_has_an_atomic_prerequisite_condition(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    write = AsyncMock(return_value=[[], [{"id": "pack-2"}]])
    monkeypatch.setattr(repo, "batch", write)
    monkeypatch.setattr(repo, "rid", lambda prefix: "pack-2")
    monkeypatch.setattr(repo, "now", lambda: "2026-09-04T03:00:00Z")

    result = await repo.save_pack(
        engagement_id="engagement-1",
        phase=2,
        pack={"phase": 2},
        model="test-model",
        scope="department",
        sources=[],
        digest="digest",
        duration_ms=1,
    )

    assert result == "pack-2"
    statements = write.await_args.args[0]
    update_sql, update_args = statements[0]
    insert_sql, insert_args = statements[1]
    assert "COUNT(DISTINCT phase)" in update_sql
    assert "COUNT(DISTINCT phase)" in insert_sql
    assert "RETURNING id" in insert_sql
    assert update_args[-4:] == [2, "engagement-1", 2, 2]
    assert insert_args[-4:] == [2, "engagement-1", 2, 2]


async def test_save_pack_refuses_to_publish_after_a_prerequisite_disappears(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(repo, "batch", AsyncMock(return_value=[[], []]))
    monkeypatch.setattr(repo, "rid", lambda prefix: "pack-2")

    with pytest.raises(repo.PhaseSequenceChanged, match="earlier phase was reset"):
        await repo.save_pack(
            engagement_id="engagement-1",
            phase=2,
            pack={"phase": 2},
            model="test-model",
            scope="department",
            sources=[],
            digest="digest",
            duration_ms=1,
        )


async def test_run_phase_rechecks_prerequisites_before_publishing(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    gate = AsyncMock(side_effect=[(True, ""), (False, "Phase 1 was reset during generation")])
    save_pack = AsyncMock(side_effect=AssertionError("a stale pack must not be saved"))
    monkeypatch.setattr(pipeline, "phase_unlocked", gate)
    monkeypatch.setattr(
        pipeline,
        "gather",
        AsyncMock(
            return_value={
                "engagement": {
                    "id": "engagement-1",
                    "name": "Example",
                    "sector": "Industry",
                    "url": "",
                    "scope": "department",
                },
                "state": {"links": [], "notes": [], "inputs": [], "files": []},
                "packs": {0: {"phase": 0}},
                "questions": [],
                "context": "cumulative context",
                "brain": None,
            }
        ),
    )
    monkeypatch.setattr(
        pipeline,
        "run_intake",
        AsyncMock(
            return_value={
                "canRun": True,
                "needs": [],
                "willAssume": [],
                "verdict": "ready",
            }
        ),
    )
    monkeypatch.setattr(pipeline.scrape, "scrape_urls", AsyncMock(return_value=[]))
    monkeypatch.setattr(
        pipeline.evidence_agent,
        "extract",
        AsyncMock(return_value={"facts": [], "absent": [], "model": "test", "usage": {}}),
    )
    monkeypatch.setattr(pipeline.evidence_agent, "as_block", lambda ledger: "")
    monkeypatch.setattr(
        pipeline.pack_agent,
        "build",
        AsyncMock(return_value={"pack": {"phase": 1}, "model": "test", "usage": {}}),
    )
    monkeypatch.setattr(pipeline.verify_agent, "check_structure", lambda pack: [])
    monkeypatch.setattr(
        pipeline.verify_agent,
        "check_claims",
        AsyncMock(
            return_value={
                "violations": [],
                "verdict": "clean",
                "score": 100,
                "model": "test",
                "usage": {},
            }
        ),
    )
    monkeypatch.setattr(pipeline.repo, "log_run", AsyncMock())
    monkeypatch.setattr(pipeline.repo, "save_pack", save_pack)

    events = [event async for event in pipeline._run_phase("engagement-1", 1)]

    assert events[-1] == {"type": "error", "message": "Phase 1 was reset during generation"}
    assert gate.await_count == 2
    save_pack.assert_not_awaited()


def test_later_phase_context_carries_the_whole_prior_chain_oldest_first() -> None:
    engagement = {
        "name": "Example Client",
        "sector": "Industrial services",
        "url": "https://example.invalid",
        "scope": "department",
        "notes": "Engagement-level note",
        "brief": "Find and sequence the highest-value opportunities.",
        "success_metrics": [],
    }
    state = {
        "inputs": [],
        "steps": [],
        "attendance": [],
        "links": [],
        "files": [],
        "deliverables": [],
        # Deliberately unordered; build() must restore chronological phase order.
        "notes": [
            {"phase": 4, "body": "CURRENT-PHASE-NOTE"},
            {"phase": 5, "body": "FUTURE-NOTE"},
            {"phase": 2, "body": "EARLIER-NOTE-TWO"},
            {"phase": 0, "body": "EARLIER-NOTE-ZERO"},
        ],
    }
    # Deliberately reverse/mixed insertion order, with current and future packs
    # present to prove only every earlier pack is carried.
    packs = {
        3: {"sentinel": "PACK-THREE"},
        1: {"sentinel": "PACK-ONE"},
        5: {"sentinel": "PACK-FUTURE"},
        0: {"sentinel": "PACK-ZERO"},
        4: {"sentinel": "PACK-CURRENT"},
        2: {"sentinel": "PACK-TWO"},
    }
    questions = [
        {
            "phase": 0,
            "kind": "open",
            "body": "ANSWERED-EARLIER-QUESTION",
            "answer": "FIRST-HAND-ANSWER",
            "answered_at": "2026-09-01T10:00:00Z",
        },
        {
            "phase": 1,
            "kind": "open",
            "body": "STILL-OPEN-EARLIER-QUESTION",
            "answer": "",
            "answered_at": None,
        },
        {
            "phase": 0,
            "kind": "next",
            "body": "INTERNAL-NEXT-MOVE",
            "answer": "",
            "answered_at": None,
        },
        {
            "phase": 4,
            "kind": "open",
            "body": "CURRENT-PHASE-QUESTION",
            "answer": "",
            "answered_at": None,
        },
        {
            "phase": 5,
            "kind": "open",
            "body": "FUTURE-QUESTION",
            "answer": "",
            "answered_at": None,
        },
    ]

    built = context.build(
        engagement=engagement,
        phase=4,
        state=state,
        packs=packs,
        questions=questions,
        include_room=False,
    )

    pack_markers = [f"PACK-{name}" for name in ("ZERO", "ONE", "TWO", "THREE")]
    pack_positions = [built.index(marker) for marker in pack_markers]
    assert pack_positions == sorted(pack_positions)
    assert "PACK-CURRENT" not in built
    assert "PACK-FUTURE" not in built

    note_markers = ["EARLIER-NOTE-ZERO", "EARLIER-NOTE-TWO", "CURRENT-PHASE-NOTE"]
    note_positions = [built.index(marker) for marker in note_markers]
    assert note_positions == sorted(note_positions)
    assert "FUTURE-NOTE" not in built

    assert "ANSWERED-EARLIER-QUESTION" in built
    assert "FIRST-HAND-ANSWER" in built
    assert "STILL-OPEN-EARLIER-QUESTION" in built
    assert "INTERNAL-NEXT-MOVE" not in built
    assert "CURRENT-PHASE-QUESTION" not in built
    assert "FUTURE-QUESTION" not in built

    answered_section = built.index("Answers the client has given to earlier questions")
    open_section = built.index("still unanswered")
    assert answered_section < built.index("ANSWERED-EARLIER-QUESTION") < open_section
    assert open_section < built.index("STILL-OPEN-EARLIER-QUESTION")


async def test_clearing_a_pack_keeps_what_the_client_answered(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """
    An answer cost a real conversation to get and every later phase reads it as
    first-hand evidence. Regeneration already preserved answered rows; clearing
    a pack was the one path that deleted them.
    """
    sent: list[tuple[str, list[object]]] = []

    async def fake_batch(statements: list[tuple[str, list[object]]]) -> list[object]:
        sent.extend(statements)
        return []

    async def fake_one(*_a: object, **_k: object) -> dict[str, object] | None:
        return None

    monkeypatch.setattr(repo, "batch", fake_batch)
    monkeypatch.setattr(repo, "one", fake_one)

    await repo.clear_pack("e1", 2)

    questions = [sql for sql, _ in sent if "phase_questions" in sql]
    assert questions, "clear_pack no longer touches phase_questions"
    assert all("answered_at IS NULL" in sql for sql in questions)
