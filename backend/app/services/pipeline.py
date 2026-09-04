"""
Running a phase.

The brief described the sprint as a back-and-forth rather than a pipeline, so a
phase is not one call. It is a gate, a build and a handoff:

  1. INTAKE   the phase says what it still needs and what it will have to assume.
              A blocking need stops the run here — nothing is generated against
              a hole the consultant could have filled in five minutes.
  2. SOURCES  the company site and the pasted links are read live.
  3. BUILD    the output pack, written by an agent that holds the phase's skill
              and the sprint's running brain.
  4. PEERS    phase 0 only — the parameters that decide the winner, then the
              peer set scraped and ranked against them.
  5. ASK      what the phase leaves open for the client, and our own next moves.
  6. BRAIN    the running understanding is rewritten with what just landed.

Each step emits an event so the console can show where the run is.
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import time
from collections.abc import AsyncIterator
from typing import Any

from app.agents import brain as brain_agent
from app.agents import evidence as evidence_agent
from app.agents import intake as intake_agent
from app.agents import pack as pack_agent
from app.agents import peers as peer_agent
from app.agents import questions as question_agent
from app.agents import runtime as agent_runtime
from app.agents import verify as verify_agent
from app.db import repo
from app.domain import playbook
from app.services import context as context_service
from app.services import scrape

STAGES = [
    ("INTAKE", "Working out what this phase still needs before it can run."),
    ("READING SOURCES", "Pulling the company site, filings and the links supplied."),
    ("EXTRACTING EVIDENCE", "Pulling every quotable figure out of the material, before anything is written."),
    ("BUILDING THE PACK", "Turning the evidence into the views this phase needs."),
    (
        "BENCHMARKING PEERS",
        "Setting the parameters that decide the winner, reading the peers, ranking the client.",
    ),
    ("CHECKING THE PACK", "Scoring it against the house rules before it is saved."),
    ("FRAMING QUESTIONS", "Working out what is still open, then our own next moves."),
    ("UPDATING THE BRAIN", "Folding what this phase learned into the sprint's understanding."),
]

_ENGAGEMENT_LOCKS: dict[str, asyncio.Lock] = {}


def engagement_run_lock(engagement_id: str) -> asyncio.Lock:
    """Serialize phase generation and destructive resets for one engagement."""
    lock = _ENGAGEMENT_LOCKS.get(engagement_id)
    if lock is None:
        lock = asyncio.Lock()
        _ENGAGEMENT_LOCKS[engagement_id] = lock
    return lock


async def phase_unlocked(engagement_id: str, phase: int) -> tuple[bool, str]:
    """Cumulative gating: a phase opens only when every earlier one has a pack."""
    if phase < 0 or phase >= playbook.phase_count():
        return False, "unknown phase"
    if phase == 0:
        return True, ""
    packs = await repo.current_packs(engagement_id)
    missing = [i for i in range(phase) if i not in packs]
    if not missing:
        return True, ""
    names = ", then ".join(playbook.phase_label(i) for i in missing)
    return False, (
        f"{playbook.phase_label(phase)} is locked. {names} has to be generated first; "
        "every phase is built on the one before it."
    )


async def gather(engagement_id: str, phase: int) -> dict[str, Any]:
    """Everything the agents for this phase read."""
    engagement = await repo.get_engagement(engagement_id)
    if not engagement:
        raise ValueError("unknown engagement")
    state = await repo.phase_state(engagement["id"])
    packs = await repo.current_packs(engagement["id"])
    questions = await repo.questions_for(engagement["id"])
    ctx = context_service.build(
        engagement=engagement, phase=phase, state=state, packs=packs, questions=questions
    )
    return {
        "engagement": engagement,
        "state": state,
        "packs": packs,
        "questions": questions,
        "context": ctx,
        "brain": await repo.current_brain(engagement["id"]),
    }


def _intake_fingerprint(context: str, open_questions: list[dict], brain: dict | None) -> str:
    """
    A digest of everything the gate reads.

    The context string is already assembled from every input that would change
    the answer - what was ticked, what was marked unavailable, who was in the
    room, the notes, the data room, the earlier packs - so hashing it costs
    nothing and cannot drift from what the agent actually saw.
    """
    payload = json.dumps(
        {
            "provider": agent_runtime.current_provider(),
            "context": context,
            "open": sorted(q.get("body", "") for q in open_questions),
            "brain": (brain or {}).get("version"),
        },
        sort_keys=True,
    )
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


async def run_intake(engagement_id: str, phase: int, *, refresh: bool = False) -> dict[str, Any]:
    """
    The gate in front of a phase, run on its own so the console can show it.

    Opening a phase asks for this, and re-asking on every visit would spend a
    model call to re-derive an answer that cannot have changed. So the verdict
    is cached against a digest of what it was derived from, and only recomputed
    when that moves - or when the caller asks for a fresh one.
    """
    data = await gather(engagement_id, phase)
    open_questions = [q for q in data["questions"] if q["kind"] == "open" and not q.get("answered_at")]
    fingerprint = _intake_fingerprint(data["context"], open_questions, data["brain"])

    if not refresh:
        cached = await repo.intake_state(engagement_id, phase)
        if cached and cached["fingerprint"] == fingerprint:
            needs = await repo.open_intake(engagement_id, phase)
            return {
                "canRun": bool(cached["can_run"]),
                "confidence": int(cached["confidence"] or 0),
                "verdict": cached["verdict"] or "",
                "needs": [
                    {
                        "ask": n["ask"],
                        "why": n["why"],
                        "who": n["who"],
                        "severity": n["severity"],
                        "haveAlready": bool(n.get("have_already")),
                        "whereFrom": n.get("where_from") or "",
                    }
                    for n in needs
                ],
                "willAssume": json.loads(cached["will_assume"] or "[]"),
                "usage": {},
                "model": "",
                "cached": True,
            }

    try:
        result = await intake_agent.run(
            phase=phase,
            engagement=data["engagement"],
            context=data["context"],
            brain=data["brain"],
            open_questions=open_questions,
        )
    except Exception as exc:
        await repo.log_run(
            engagement_id=engagement_id,
            phase=phase,
            agent="intake",
            status="error",
            model="",
            error=str(exc),
        )
        raise
    await repo.log_run(
        engagement_id=engagement_id,
        phase=phase,
        agent="intake",
        status="ok",
        model=result["model"],
        usage=result["usage"],
    )
    await repo.save_intake(engagement_id, phase, result["needs"])
    await repo.save_intake_state(
        engagement_id,
        phase,
        readiness=result,
        will_assume=result["willAssume"],
        fingerprint=fingerprint,
    )
    return result


async def run_phase(engagement_id: str, phase: int, *, force: bool = False) -> AsyncIterator[dict]:
    """Run one phase while preventing a concurrent reset from changing its prerequisites."""
    async with engagement_run_lock(engagement_id):
        async for event in _run_phase(engagement_id, phase, force=force):
            yield event


async def _run_phase(engagement_id: str, phase: int, *, force: bool = False) -> AsyncIterator[dict]:
    """Run a phase end to end, emitting an event per stage."""
    started = time.monotonic()

    unlocked, why = await phase_unlocked(engagement_id, phase)
    if not unlocked:
        yield {"type": "error", "message": why}
        return

    data = await gather(engagement_id, phase)
    engagement = data["engagement"]
    ctx = data["context"]

    # 1 — intake
    yield {"type": "stage", "stage": 0, "label": STAGES[0][0], "detail": STAGES[0][1]}
    intake = await run_intake(engagement_id, phase)
    if not intake["canRun"] and not force:
        yield {
            "type": "blocked",
            "verdict": intake["verdict"],
            "needs": intake["needs"],
            "willAssume": intake["willAssume"],
        }
        return
    yield {
        "type": "intake",
        "needs": intake["needs"],
        "willAssume": intake["willAssume"],
        "verdict": intake["verdict"],
    }

    """
    2 — live sources. Phase 0 only.

    Phase 0 is the outside-in view: it works from the public record, so the
    company site and any pasted links are the material. Every phase after it
    works from what the client gave us - the call, the uploads, the notes - and
    re-reading the corporate website six times tells a process diagnosis
    nothing. Pasted links stay available to later phases through the data room.
    """
    outside_in = phase == 0
    yield {"type": "stage", "stage": 1, "label": STAGES[1][0], "detail": STAGES[1][1]}
    sources: list[dict[str, str]] = []
    if outside_in:
        urls = ([engagement["url"]] if engagement.get("url") else []) + [
            x["url"] for x in data["state"].get("links", [])
        ]
        sources = await scrape.scrape_urls(urls, cap=4, chars=5000)

    # 3 — extraction, before anything is written
    yield {"type": "stage", "stage": 2, "label": STAGES[2][0], "detail": STAGES[2][1]}
    ledger: dict[str, Any] = {"facts": [], "absent": []}
    try:
        ledger = await evidence_agent.extract(
            engagement=engagement,
            phase=phase,
            sources_block=scrape.source_block(sources, outside_in=outside_in),
            held=ctx,
            # searching the open web for a client's own internal figures finds
            # nothing, at roughly $0.09 and 35,000 injected tokens a call
            web_search=outside_in,
        )
        await repo.log_run(
            engagement_id=engagement_id,
            phase=phase,
            agent="evidence",
            status="ok",
            model=ledger["model"],
            usage=ledger["usage"],
        )
        yield {
            "type": "evidence",
            "reported": sum(1 for f in ledger["facts"] if f.get("kind") == "reported"),
            "derived": sum(1 for f in ledger["facts"] if f.get("kind") != "reported"),
            "absent": len(ledger["absent"]),
        }
    except Exception as exc:
        await repo.log_run(
            engagement_id=engagement_id,
            phase=phase,
            agent="evidence",
            status="error",
            model="",
            error=str(exc),
        )
        yield {
            "type": "warning",
            "message": "the evidence pass failed, so the pack is written without a ledger — "
            "every figure in it should be treated as derived",
        }
    ledger_block = evidence_agent.as_block(ledger)

    # 4 — the pack, rendered from the ledger
    yield {"type": "stage", "stage": 3, "label": STAGES[3][0], "detail": STAGES[3][1]}
    try:
        built = await pack_agent.build(
            phase=phase,
            engagement=engagement,
            context=ctx,
            brain=data["brain"],
            sources_block=scrape.source_block(sources, outside_in=outside_in) + ledger_block,
        )
    except Exception as exc:
        await repo.log_run(
            engagement_id=engagement_id, phase=phase, agent="pack", status="error", model="", error=str(exc)
        )
        yield {"type": "error", "message": f"could not build the pack: {exc}"}
        return
    await repo.log_run(
        engagement_id=engagement_id,
        phase=phase,
        agent="pack",
        status="ok",
        model=built["model"],
        usage=built["usage"],
    )
    pack = built["pack"]

    # 5 — peer ranking, phase 0 only
    if phase == 0:
        yield {"type": "stage", "stage": 4, "label": STAGES[4][0], "detail": STAGES[4][1]}
        ranking = await peer_agent.rank(engagement=engagement, context=ctx, sources=sources)
        if ranking:
            # what the two passes cost, stripped off before the ranking is stored
            peer_usage = ranking.pop("_usage", None)
            peer_model = ranking.pop("_model", "") or ""
            peer_sites_read = ranking.pop("_peer_sites_read", ranking.get("read") or [])
            pack["peerRank"] = ranking
            if not peer_sites_read:
                yield {
                    "type": "warning",
                    "message": "no peer site could be read live — the ranking is desk-derived, "
                    "so every peer figure in it is an estimate",
                }
            await repo.log_run(
                engagement_id=engagement_id,
                phase=phase,
                agent="peers",
                status="ok",
                model=peer_model,
                usage=peer_usage,
            )
        else:
            await repo.log_run(
                engagement_id=engagement_id,
                phase=phase,
                agent="peers",
                status="error",
                model=built["model"],
                error="peer ranking did not complete",
            )
            yield {
                "type": "warning",
                "message": "the peer ranking did not complete — the outside-in pack still stands without it",
            }

    # 6 — the evaluation pass, before it is saved
    yield {"type": "stage", "stage": 5, "label": STAGES[5][0], "detail": STAGES[5][1]}
    findings = verify_agent.check_structure(pack)
    review: dict[str, Any] = {"violations": [], "verdict": "", "score": 0}
    try:
        earlier = (
            "\n\n".join(
                f"[Phase {playbook.phase(i)['num']} pack]\n{json.dumps(data['packs'][i])[:2000]}"
                for i in range(phase)
                if i in data["packs"]
            )
            or "No earlier phase has been built."
        )
        review = await verify_agent.check_claims(
            engagement=engagement,
            phase=phase,
            pack=pack,
            ledger_block=ledger_block,
            earlier_packs="EARLIER PHASE PACKS, for contradiction checking:\n" + earlier,
        )
        await repo.log_run(
            engagement_id=engagement_id,
            phase=phase,
            agent="verify",
            status="ok",
            model=review["model"],
            usage=review["usage"],
        )
    except Exception as exc:
        await repo.log_run(
            engagement_id=engagement_id,
            phase=phase,
            agent="verify",
            status="error",
            model="",
            error=str(exc),
        )

    checks = findings + [
        {
            "rule": v.get("rule", "unsupported"),
            "where": v.get("where", ""),
            "detail": v.get("detail", ""),
            "severity": v.get("severity", "medium"),
        }
        for v in review["violations"]
    ]
    if checks:
        yield {
            "type": "review",
            "score": review["score"],
            "verdict": review["verdict"],
            "findings": checks,
        }

    # Generation can take minutes. Re-read the authoritative pack chain before
    # publishing so a reset performed by another server process cannot leave a
    # later phase current without its prerequisite. save_pack repeats the same
    # condition inside its INSERT to close the final check/write race.
    unlocked, why = await phase_unlocked(engagement_id, phase)
    if not unlocked:
        yield {"type": "error", "message": why}
        return
    try:
        pack_id = await repo.save_pack(
            engagement_id=engagement["id"],
            phase=phase,
            pack=pack,
            model=built["model"],
            scope=engagement.get("scope", ""),
            sources=[s["u"] for s in sources],
            digest=context_service.digest(ctx),
            duration_ms=int((time.monotonic() - started) * 1000),
            review={"score": review["score"], "verdict": review["verdict"], "findings": checks},
            evidence=ledger.get("facts"),
        )
    except repo.PhaseSequenceChanged as exc:
        yield {"type": "error", "message": str(exc)}
        return

    # 7 — what the phase leaves open
    yield {"type": "stage", "stage": 6, "label": STAGES[6][0], "detail": STAGES[6][1]}
    note = next((r["body"] for r in data["state"].get("notes", []) if r["phase"] == phase), "")
    not_supplied = [
        playbook.phase(phase)["inputs"][r["input_index"]]
        for r in data["state"].get("inputs", [])
        if r["phase"] == phase
        and r["state"] == "na"
        and r["input_index"] < len(playbook.phase(phase)["inputs"])
    ]
    transcripts = [f for f in data["state"].get("files", []) if f.get("extracted_text")]
    asked: dict[str, Any] = {"questions": [], "covered": [], "suggestions": []}
    try:
        asked = await question_agent.run(
            phase=phase,
            engagement=engagement,
            context=ctx,
            pack=pack,
            brain=data["brain"],
            manual_note=note,
            not_supplied=not_supplied,
            transcripts=transcripts,
            prior_questions=data["questions"],
        )
        await repo.log_run(
            engagement_id=engagement_id,
            phase=phase,
            agent="questions",
            status="ok",
            model=asked["model"],
            usage=asked["usage"],
        )
        await repo.save_questions(
            engagement["id"], phase, asked["questions"], asked["covered"], asked["suggestions"]
        )
    except Exception as exc:
        await repo.log_run(
            engagement_id=engagement_id,
            phase=phase,
            agent="questions",
            status="error",
            model="",
            error=str(exc),
        )

    # 8 — the running brain
    yield {"type": "stage", "stage": 7, "label": STAGES[7][0], "detail": STAGES[7][1]}
    try:
        landed = f"THE PACK {playbook.phase_label(phase)} JUST PRODUCED:\n{json.dumps(pack)[:9000]}\n\n" + (
            "QUESTIONS IT LEFT OPEN:\n"
            + "\n".join(f"- {q['q']} ({q.get('priority')})" for q in asked["questions"])
            if asked["questions"]
            else "This phase left no questions open."
        )
        revised = await brain_agent.revise(
            engagement=engagement,
            previous=data["brain"],
            reason="phase_built",
            phase=phase,
            landed=landed,
        )
        version = await repo.save_brain(
            engagement_id=engagement["id"], reason="phase_built", phase=phase, brain=revised
        )
        await repo.log_run(
            engagement_id=engagement_id,
            phase=phase,
            agent="brain",
            status="ok",
            model=revised["model"],
            usage=revised["usage"],
        )
    except Exception as exc:
        revised, version = {}, 0
        await repo.log_run(
            engagement_id=engagement_id, phase=phase, agent="brain", status="error", model="", error=str(exc)
        )

    await repo.touch(engagement["id"])

    yield {
        "type": "done",
        "packId": pack_id,
        "pack": pack,
        "questions": asked["questions"],
        "covered": asked["covered"],
        "nextMoves": asked["suggestions"],
        "brain": {
            "version": version,
            "narrative": revised.get("narrative", ""),
            "confidence": revised.get("confidence", 0),
            "unknown": revised.get("unknown", []),
        },
        "sourcesRead": [s["u"] for s in sources],
        "evidence": {
            "reported": sum(1 for f in ledger["facts"] if f.get("kind") == "reported"),
            "derived": sum(1 for f in ledger["facts"] if f.get("kind") != "reported"),
            "absent": ledger["absent"],
        },
        "review": {"score": review["score"], "verdict": review["verdict"], "findings": checks},
        "durationMs": int((time.monotonic() - started) * 1000),
    }
