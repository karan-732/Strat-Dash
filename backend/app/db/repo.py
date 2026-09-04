"""Reads and writes against the sprint tables."""

from __future__ import annotations

import json
import secrets
from collections.abc import Iterable
from datetime import UTC, datetime
from typing import Any

from app.db.client import batch, execute, one


class PhaseSequenceChanged(RuntimeError):
    """A phase lost one of its prerequisite packs before its result was saved."""


def now() -> str:
    return datetime.now(UTC).isoformat()


def rid(prefix: str) -> str:
    return f"{prefix}{secrets.token_hex(4)}"


def slugify(text: str) -> str:
    out = "".join(c.lower() if c.isalnum() else "-" for c in text)
    return "-".join(p for p in out.split("-") if p) or "engagement"


# --------------------------------------------------------------- engagements


async def create_engagement(
    *, name: str, sector: str, url: str, notes: str, scope: str, brief: str = ""
) -> dict[str, Any]:
    eid = rid("p")
    stamp = now()
    await execute(
        """INSERT INTO engagements (id, slug, name, sector, url, notes, scope, brief, opened_on,
                                    created_at, updated_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
        [eid, f"{slugify(name)}-{eid}", name, sector, url, notes, scope, brief, stamp[:10], stamp, stamp],
    )
    return await get_engagement(eid)  # type: ignore[return-value]


async def get_engagement(engagement_id: str) -> dict[str, Any] | None:
    row = await one("SELECT * FROM engagements WHERE id = ?", [engagement_id])
    if not row:
        row = await one("SELECT * FROM engagements WHERE slug = ?", [engagement_id])
    if not row:
        return None
    row["success_metrics"] = await execute(
        "SELECT * FROM success_metrics WHERE engagement_id = ? ORDER BY is_primary DESC, created_at",
        [row["id"]],
    )
    return row


async def list_engagements() -> list[dict[str, Any]]:
    rows = await execute(
        """SELECT e.*,
                  (SELECT GROUP_CONCAT(DISTINCT p.phase)
                     FROM phase_packs AS p
                    WHERE p.engagement_id=e.id AND p.superseded_at IS NULL)
                    AS _current_pack_phases
             FROM engagements AS e
            WHERE e.archived_at IS NULL
            ORDER BY e.updated_at DESC"""
    )
    for row in rows:
        raw_phases = row.pop("_current_pack_phases", "") or ""
        phases = (int(value) for value in str(raw_phases).split(",") if value)
        row["completed_phases"] = _contiguous_phases(phases)
    return rows


async def archive_engagement(engagement_id: str) -> bool:
    """
    Take an engagement off the portfolio.

    Archived rather than deleted, which is what `archived_at` and the list
    query's filter were always for. A sprint holds packs that cost real money
    to generate and an `agent_runs` history the spend figures are computed
    from; a mis-click should not be able to destroy either. The row stops being
    listed, loaded or counted, and can be brought back with one UPDATE.
    """
    rows = await execute(
        "UPDATE engagements SET archived_at=?, updated_at=? WHERE id=? AND archived_at IS NULL RETURNING id",
        [now(), now(), engagement_id],
    )
    return bool(rows)


async def touch(engagement_id: str) -> None:
    await execute("UPDATE engagements SET updated_at = ? WHERE id = ?", [now(), engagement_id])


async def set_brief(engagement_id: str, brief: str) -> None:
    await execute(
        "UPDATE engagements SET brief = ?, updated_at = ? WHERE id = ?", [brief, now(), engagement_id]
    )


async def save_success_metrics(engagement_id: str, metrics: list[dict[str, Any]]) -> None:
    statements: list[tuple[str, list[Any]]] = [
        ("DELETE FROM success_metrics WHERE engagement_id = ?", [engagement_id])
    ]
    for m in metrics:
        statements.append(
            (
                """INSERT INTO success_metrics (id, engagement_id, metric, baseline, target, horizon,
                                                is_primary, source, source_ref, derived, created_at)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
                [
                    rid("sm"),
                    engagement_id,
                    m.get("metric", ""),
                    m.get("baseline"),
                    m.get("target"),
                    m.get("horizon"),
                    1 if m.get("isPrimary") else 0,
                    m.get("source", "consultant"),
                    m.get("sourceRef"),
                    1 if m.get("derived") else 0,
                    now(),
                ],
            )
        )
    await batch(statements)


# ---------------------------------------------------------------- phase state


async def phase_state(engagement_id: str) -> dict[str, Any]:
    rows = await batch(
        [
            ("SELECT * FROM phase_inputs WHERE engagement_id = ?", [engagement_id]),
            ("SELECT * FROM phase_steps WHERE engagement_id = ?", [engagement_id]),
            ("SELECT * FROM phase_attendance WHERE engagement_id = ?", [engagement_id]),
            ("SELECT * FROM phase_notes WHERE engagement_id = ?", [engagement_id]),
            ("SELECT * FROM source_links WHERE engagement_id = ? ORDER BY added_at", [engagement_id]),
            (
                "SELECT id, phase, input_index, name, size_bytes, mime, kind, extracted_text, uploaded_at "
                "FROM room_files WHERE engagement_id = ? ORDER BY uploaded_at",
                [engagement_id],
            ),
            ("SELECT * FROM deliverables WHERE engagement_id = ?", [engagement_id]),
        ]
    )
    return {
        "inputs": rows[0],
        "steps": rows[1],
        "attendance": rows[2],
        "notes": rows[3],
        "links": rows[4],
        "files": rows[5],
        "deliverables": rows[6],
    }


async def set_input(engagement_id: str, phase: int, index: int, state: str | None) -> None:
    if state is None:
        await execute(
            "DELETE FROM phase_inputs WHERE engagement_id=? AND phase=? AND input_index=?",
            [engagement_id, phase, index],
        )
        return
    await execute(
        """INSERT INTO phase_inputs (engagement_id, phase, input_index, state, updated_at)
           VALUES (?,?,?,?,?)
           ON CONFLICT(engagement_id, phase, input_index)
           DO UPDATE SET state=excluded.state, updated_at=excluded.updated_at""",
        [engagement_id, phase, index, state, now()],
    )


async def set_step(engagement_id: str, phase: int, index: int, done: bool) -> None:
    if not done:
        await execute(
            "DELETE FROM phase_steps WHERE engagement_id=? AND phase=? AND step_index=?",
            [engagement_id, phase, index],
        )
        return
    await execute(
        """INSERT OR REPLACE INTO phase_steps (engagement_id, phase, step_index, done_at)
           VALUES (?,?,?,?)""",
        [engagement_id, phase, index, now()],
    )


async def set_attendance(engagement_id: str, phase: int, index: int, present: bool) -> None:
    if not present:
        await execute(
            "DELETE FROM phase_attendance WHERE engagement_id=? AND phase=? AND participant_index=?",
            [engagement_id, phase, index],
        )
        return
    await execute(
        """INSERT OR REPLACE INTO phase_attendance (engagement_id, phase, participant_index, present_at)
           VALUES (?,?,?,?)""",
        [engagement_id, phase, index, now()],
    )


async def set_deliverable(
    engagement_id: str, phase: int, doc_number: int, *, status: int | None, draft: str | None
) -> None:
    existing = await one(
        "SELECT status, draft FROM deliverables WHERE engagement_id=? AND phase=? AND doc_number=?",
        [engagement_id, phase, doc_number],
    )
    new_status = status if status is not None else (existing or {}).get("status", 0)
    new_draft = draft if draft is not None else (existing or {}).get("draft", "")
    words = len((new_draft or "").split())
    await execute(
        """INSERT INTO deliverables (engagement_id, phase, doc_number, status, draft, word_count,
                                     updated_at)
           VALUES (?,?,?,?,?,?,?)
           ON CONFLICT(engagement_id, phase, doc_number)
           DO UPDATE SET status=excluded.status, draft=excluded.draft,
                         word_count=excluded.word_count, updated_at=excluded.updated_at""",
        [engagement_id, phase, doc_number, new_status, new_draft, words, now()],
    )


async def remove_link(engagement_id: str, link_id: str) -> None:
    await execute("DELETE FROM source_links WHERE engagement_id=? AND id=?", [engagement_id, link_id])


async def remove_file(engagement_id: str, file_id: str) -> None:
    await execute("DELETE FROM room_files WHERE engagement_id=? AND id=?", [engagement_id, file_id])


async def patch_engagement(engagement_id: str, fields: dict[str, Any]) -> None:
    allowed = {"name", "sector", "url", "notes", "scope", "brief"}
    sets = {k: v for k, v in fields.items() if k in allowed and v is not None}
    if not sets:
        return
    clause = ", ".join(f"{k} = ?" for k in sets)
    await execute(
        f"UPDATE engagements SET {clause}, updated_at = ? WHERE id = ?",
        [*sets.values(), now(), engagement_id],
    )


async def set_note(engagement_id: str, phase: int, body: str) -> None:
    await execute(
        """INSERT INTO phase_notes (engagement_id, phase, body, updated_at) VALUES (?,?,?,?)
           ON CONFLICT(engagement_id, phase)
           DO UPDATE SET body=excluded.body, updated_at=excluded.updated_at""",
        [engagement_id, phase, body, now()],
    )


async def add_file(
    *,
    engagement_id: str,
    phase: int,
    name: str,
    size: int,
    mime: str | None,
    kind: str,
    text: str | None,
    input_index: int = -1,
) -> str:
    fid = rid("f")
    await execute(
        """INSERT INTO room_files (id, engagement_id, phase, input_index, name, size_bytes, mime,
                                   kind, extracted_text, extracted_at, uploaded_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
        [
            fid,
            engagement_id,
            phase,
            input_index,
            name,
            size,
            mime,
            kind,
            text,
            now() if text else None,
            now(),
        ],
    )
    return fid


async def add_link(engagement_id: str, url: str, label: str | None = None) -> None:
    await execute(
        "INSERT OR IGNORE INTO source_links (id, engagement_id, url, label, added_at) VALUES (?,?,?,?,?)",
        [rid("l"), engagement_id, url, label, now()],
    )


# --------------------------------------------------------------------- packs


def _contiguous_phases(phases: Iterable[int]) -> list[int]:
    """Return the current Phase 0 -> N chain from an unordered phase set."""
    found = set(phases)
    current: list[int] = []
    phase = 0
    while phase in found:
        current.append(phase)
        phase += 1
    return current


async def current_pack(engagement_id: str, phase: int) -> dict[str, Any] | None:
    row = await one(
        """SELECT * FROM phase_packs WHERE engagement_id=? AND phase=? AND superseded_at IS NULL
           ORDER BY built_at DESC LIMIT 1""",
        [engagement_id, phase],
    )
    if row:
        row["pack"] = json.loads(row["pack"])
    return row


async def current_packs(engagement_id: str) -> dict[int, Any]:
    rows = await execute(
        """SELECT phase, pack FROM phase_packs WHERE engagement_id=? AND superseded_at IS NULL
           ORDER BY built_at""",
        [engagement_id],
    )
    found = {int(r["phase"]): json.loads(r["pack"]) for r in rows}

    # Only a contiguous Phase 0 -> N chain is current. This keeps historical or
    # externally-created orphan packs from reappearing in the API, exports or a
    # later phase's context when one of their prerequisites is absent.
    return {phase: found[phase] for phase in _contiguous_phases(found)}


async def save_pack(
    *,
    engagement_id: str,
    phase: int,
    pack: Any,
    model: str,
    scope: str,
    sources: list[str],
    digest: str,
    duration_ms: int,
    review: Any = None,
    evidence: Any = None,
) -> str:
    pid = rid("pk")
    stamp = now()
    results = await batch(
        [
            (
                "UPDATE phase_packs SET superseded_at=? WHERE engagement_id=? AND phase=?"
                " AND superseded_at IS NULL"
                " AND (?=0 OR (SELECT COUNT(DISTINCT phase) FROM phase_packs"
                " WHERE engagement_id=? AND phase>=0 AND phase<? AND superseded_at IS NULL)=?)",
                [stamp, engagement_id, phase, phase, engagement_id, phase, phase],
            ),
            (
                """INSERT INTO phase_packs (id, engagement_id, phase, pack, model, scope,
                                            sources_read, input_digest, duration_ms, built_at,
                                            review, review_score, evidence)
                   SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?
                    WHERE ?=0 OR (SELECT COUNT(DISTINCT phase) FROM phase_packs
                                   WHERE engagement_id=? AND phase>=0 AND phase<?
                                     AND superseded_at IS NULL)=?
                   RETURNING id""",
                [
                    pid,
                    engagement_id,
                    phase,
                    json.dumps(pack),
                    model,
                    scope,
                    json.dumps(sources),
                    digest,
                    duration_ms,
                    stamp,
                    json.dumps(review) if review is not None else None,
                    (review or {}).get("score") if isinstance(review, dict) else None,
                    json.dumps(evidence) if evidence is not None else None,
                    phase,
                    engagement_id,
                    phase,
                    phase,
                ],
            ),
        ]
    )
    if not any(row.get("id") == pid for rows in results for row in rows):
        raise PhaseSequenceChanged(
            "an earlier phase was reset while this phase was running; generate the missing phase first"
        )
    return pid


async def clear_pack(engagement_id: str, phase: int) -> None:
    """Reset a phase and every generated artifact that depends on it."""
    cutoff = await one(
        """SELECT MIN(stamp) AS cutoff FROM (
             SELECT built_at AS stamp FROM phase_packs
              WHERE engagement_id=? AND phase>=? AND superseded_at IS NULL
             UNION ALL
             SELECT created_at AS stamp FROM sprint_brain
              WHERE engagement_id=? AND phase>=?
           )""",
        [engagement_id, phase, engagement_id, phase],
    )
    stamp = now()
    statements: list[tuple[str, list[Any]]] = [
        (
            "UPDATE phase_packs SET superseded_at=?"
            " WHERE engagement_id=? AND phase>=? AND superseded_at IS NULL",
            [stamp, engagement_id, phase],
        ),
        (
            # What the client answered survives. It cost a real conversation to
            # get, it is first-hand evidence every later phase reads, and a
            # regenerate already preserves it (`save_questions` deletes only
            # unanswered rows) - clearing a pack should not be the one path
            # that throws it away.
            "DELETE FROM phase_questions WHERE engagement_id=? AND phase>=? AND answered_at IS NULL",
            [engagement_id, phase],
        ),
        (
            "DELETE FROM phase_intake WHERE engagement_id=? AND phase>=?",
            [engagement_id, phase],
        ),
        (
            "DELETE FROM phase_intake_state WHERE engagement_id=? AND phase>=?",
            [engagement_id, phase],
        ),
    ]
    if cutoff and cutoff.get("cutoff"):
        statements.append(
            (
                "DELETE FROM sprint_brain WHERE engagement_id=? AND created_at>=?",
                [engagement_id, cutoff["cutoff"]],
            )
        )
    await batch(statements)


# --------------------------------------------------------------------- brain


async def current_brain(engagement_id: str) -> dict[str, Any] | None:
    row = await one(
        "SELECT * FROM sprint_brain WHERE engagement_id=? ORDER BY version DESC LIMIT 1",
        [engagement_id],
    )
    if not row:
        return None
    for key in ("understood", "assumed", "unknown"):
        row[key] = json.loads(row[key] or "[]")
    return row


async def save_brain(*, engagement_id: str, reason: str, phase: int | None, brain: dict[str, Any]) -> int:
    previous = await current_brain(engagement_id)
    version = (previous["version"] + 1) if previous else 1
    await execute(
        """INSERT INTO sprint_brain (id, engagement_id, version, reason, phase, understood, assumed,
                                     unknown, confidence, narrative, created_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
        [
            rid("br"),
            engagement_id,
            version,
            reason,
            phase,
            json.dumps(brain.get("understood", [])),
            json.dumps(brain.get("assumed", [])),
            json.dumps(brain.get("unknown", [])),
            brain.get("confidence", 0),
            brain.get("narrative", ""),
            now(),
        ],
    )
    return version


# -------------------------------------------------------------------- intake


async def save_intake(engagement_id: str, phase: int, needs: list[dict[str, Any]]) -> None:
    statements: list[tuple[str, list[Any]]] = [
        (
            "DELETE FROM phase_intake WHERE engagement_id=? AND phase=? AND satisfied_at IS NULL",
            [engagement_id, phase],
        )
    ]
    for i, need in enumerate(needs):
        statements.append(
            (
                """INSERT INTO phase_intake (id, engagement_id, phase, position, ask, why, who,
                                             severity, have_already, where_from, created_at)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
                [
                    rid("in"),
                    engagement_id,
                    phase,
                    i,
                    need.get("ask", ""),
                    need.get("why", ""),
                    need.get("who", ""),
                    need.get("severity", "needed"),
                    1 if need.get("haveAlready") else 0,
                    need.get("whereFrom", ""),
                    now(),
                ],
            )
        )
    await batch(statements)


async def open_intake(engagement_id: str, phase: int) -> list[dict[str, Any]]:
    return await execute(
        "SELECT * FROM phase_intake WHERE engagement_id=? AND phase=? AND satisfied_at IS NULL"
        " ORDER BY position",
        [engagement_id, phase],
    )


async def save_intake_state(
    engagement_id: str,
    phase: int,
    *,
    readiness: dict[str, Any],
    will_assume: list[dict[str, Any]],
    fingerprint: str,
) -> None:
    """Keep the gate's verdict alongside its needs, tagged with what it read."""
    await execute(
        """INSERT INTO phase_intake_state
             (engagement_id, phase, can_run, confidence, verdict, will_assume, fingerprint, created_at)
           VALUES (?,?,?,?,?,?,?,?)
           ON CONFLICT (engagement_id, phase) DO UPDATE SET
             can_run=excluded.can_run, confidence=excluded.confidence, verdict=excluded.verdict,
             will_assume=excluded.will_assume, fingerprint=excluded.fingerprint,
             created_at=excluded.created_at""",
        [
            engagement_id,
            phase,
            1 if readiness.get("canRun") else 0,
            int(readiness.get("confidence") or 0),
            readiness.get("verdict", ""),
            json.dumps(will_assume),
            fingerprint,
            now(),
        ],
    )


async def intake_state(engagement_id: str, phase: int) -> dict[str, Any] | None:
    rows = await execute(
        "SELECT * FROM phase_intake_state WHERE engagement_id=? AND phase=?",
        [engagement_id, phase],
    )
    return rows[0] if rows else None


# ----------------------------------------------------------------- questions


async def save_questions(
    engagement_id: str, phase: int, questions: list[dict], covered: list[dict], moves: list[dict]
) -> None:
    statements: list[tuple[str, list[Any]]] = [
        (
            "DELETE FROM phase_questions WHERE engagement_id=? AND phase=? AND answered_at IS NULL",
            [engagement_id, phase],
        )
    ]
    stamp = now()
    for i, q in enumerate(questions):
        statements.append(
            (
                """INSERT INTO phase_questions (id, engagement_id, phase, kind, position, body, why,
                                                who, priority, condition, built_at)
                   VALUES (?,?,?,'open',?,?,?,?,?,?,?)""",
                [
                    rid("q"),
                    engagement_id,
                    phase,
                    i,
                    q["q"],
                    q.get("why", ""),
                    q.get("who", ""),
                    q.get("priority", "Medium"),
                    q.get("condition", ""),
                    stamp,
                ],
            )
        )
    for i, c in enumerate(covered):
        statements.append(
            (
                """INSERT INTO phase_questions (id, engagement_id, phase, kind, position, body,
                                                source, built_at)
                   VALUES (?,?,?,'covered',?,?,?,?)""",
                [rid("q"), engagement_id, phase, i, c["q"], c.get("source", ""), stamp],
            )
        )
    for i, m in enumerate(moves):
        statements.append(
            (
                """INSERT INTO phase_questions (id, engagement_id, phase, kind, position, body, why,
                                                who, horizon, built_at)
                   VALUES (?,?,?,'next_move',?,?,?,?,?,?)""",
                [
                    rid("q"),
                    engagement_id,
                    phase,
                    i,
                    m["act"],
                    m.get("why", ""),
                    m.get("owner", ""),
                    m.get("when", ""),
                    stamp,
                ],
            )
        )
    await batch(statements)


async def questions_for(engagement_id: str, phase: int | None = None) -> list[dict[str, Any]]:
    if phase is None:
        return await execute(
            "SELECT * FROM phase_questions WHERE engagement_id=? ORDER BY phase, kind, position",
            [engagement_id],
        )
    return await execute(
        "SELECT * FROM phase_questions WHERE engagement_id=? AND phase=? ORDER BY kind, position",
        [engagement_id, phase],
    )


async def open_questions(engagement_id: str) -> list[dict[str, Any]]:
    return await execute(
        """SELECT * FROM phase_questions WHERE engagement_id=? AND kind='open' AND answered_at IS NULL
           ORDER BY phase, position""",
        [engagement_id],
    )


async def answer_question(question_id: str, answer: str, source: str, quote: str = "") -> None:
    """
    Close a question.

    `quote` is the client's own words that closed it. The reader refuses to mark
    anything answered without one, so keeping it costs nothing and is the only
    way to see later what was actually said rather than what was summarised.
    """
    await execute(
        "UPDATE phase_questions SET answered_at=?, answer=?, answer_source=?, answer_quote=? WHERE id=?",
        [now(), answer, source, quote, question_id],
    )


async def question(engagement_id: str, question_id: str) -> dict[str, Any] | None:
    """One question row, scoped to its engagement so an id cannot cross one."""
    rows = await execute(
        "SELECT * FROM phase_questions WHERE id=? AND engagement_id=?",
        [question_id, engagement_id],
    )
    return rows[0] if rows else None


async def reopen_question(question_id: str) -> None:
    """
    Undo an answer.

    Clears the partial record too: a question being reopened means what was
    recorded against it was wrong, and leaving "still missing" behind would
    describe an answer that no longer exists.
    """
    await execute(
        "UPDATE phase_questions SET answered_at=NULL, answer=NULL, answer_source=NULL,"
        " answer_quote=NULL, partial_got=NULL, partial_missing=NULL, partial_at=NULL"
        " WHERE id=?",
        [question_id],
    )


async def mark_partial(question_id: str, got: str, missing: str, source: str) -> None:
    """
    Record a half answer without closing the question.

    The material said something but not enough. The question stays open - it has
    to, the consultant still needs the rest - but blank is the wrong way to show
    it: what came back and what is still missing is what they go back with.
    """
    await execute(
        "UPDATE phase_questions SET partial_got=?, partial_missing=?, partial_at=?,"
        " answer_source=COALESCE(answer_source, ?) WHERE id=? AND answered_at IS NULL",
        [got, missing, now(), source, question_id],
    )


async def save_answer_findings(
    engagement_id: str,
    *,
    unprompted: list[dict[str, Any]],
    contradictions: list[dict[str, Any]],
    source_ref: str,
) -> int:
    """
    Keep what the material said that belonged to no question.

    Both of these redirect a sprint - a figure the client volunteered, or one
    that disagrees with what an earlier phase concluded - and both were reaching
    the brain's prompt and then existing nowhere.
    """
    statements: list[tuple[str, list[Any]]] = []
    for item in unprompted:
        statements.append(
            (
                """INSERT INTO answer_findings (id, engagement_id, kind, finding, why, phase,
                                                source_ref, created_at)
                   VALUES (?,?,'unprompted',?,?,?,?,?)""",
                [
                    rid("af"),
                    engagement_id,
                    str(item.get("finding") or ""),
                    str(item.get("why") or ""),
                    item.get("phase"),
                    source_ref,
                    now(),
                ],
            )
        )
    for item in contradictions:
        statements.append(
            (
                """INSERT INTO answer_findings (id, engagement_id, kind, finding, contradicts,
                                                source_ref, created_at)
                   VALUES (?,?,'contradiction',?,?,?,?)""",
                [
                    rid("af"),
                    engagement_id,
                    str(item.get("finding") or ""),
                    str(item.get("contradicts") or ""),
                    source_ref,
                    now(),
                ],
            )
        )
    if statements:
        await batch(statements)
    return len(statements)


async def answer_findings(engagement_id: str) -> list[dict[str, Any]]:
    return await execute(
        "SELECT * FROM answer_findings WHERE engagement_id=? ORDER BY created_at, kind",
        [engagement_id],
    )


# ------------------------------------------------------------------ agent log


async def log_run(
    *,
    engagement_id: str | None,
    phase: int | None,
    agent: str,
    status: str,
    model: str,
    usage: Any = None,
    error: str | None = None,
) -> None:
    await execute(
        """INSERT INTO agent_runs (id, engagement_id, phase, agent, status, model, prompt_tokens,
                                   output_tokens, cost_usd, error, started_at, finished_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
        [
            rid("ar"),
            engagement_id,
            phase,
            agent,
            status,
            model,
            getattr(usage, "prompt_tokens", None),
            getattr(usage, "output_tokens", None),
            getattr(usage, "cost_usd", None),
            error,
            now(),
            now(),
        ],
    )


async def total_spend() -> dict[str, Any]:
    """What the console has spent across every engagement."""
    row = await one(
        """SELECT COUNT(*) AS runs, COALESCE(SUM(cost_usd),0) AS cost,
                  COALESCE(SUM(status='error'),0) AS errors
           FROM agent_runs"""
    )
    return row or {"runs": 0, "cost": 0.0, "errors": 0}


async def spend(engagement_id: str) -> dict[str, Any]:
    row = await one(
        """SELECT COUNT(*) AS runs, COALESCE(SUM(cost_usd),0) AS cost,
                  COALESCE(SUM(output_tokens),0) AS out_tokens
           FROM agent_runs WHERE engagement_id=?""",
        [engagement_id],
    )
    return row or {"runs": 0, "cost": 0, "out_tokens": 0}
