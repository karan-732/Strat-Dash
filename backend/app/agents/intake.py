"""
The intake agent — the gate in front of every phase.

The brief: "if phase 0 is done and we are moving to phase 1, it should ask
questions if it needs anything before generating the output." So a phase does
not simply run when told. It first reads what the sprint holds, states what it
still needs, and says whether it can produce something worth reading without it.

This is deliberately not a fixed checklist. The playbook's input list is the
starting point; what the agent actually asks for is decided against what the
brain already knows, what the earlier phases produced, and what this phase will
have to assert.
"""

from __future__ import annotations

from typing import Any

from app.agents.runtime import complete_json
from app.agents.skills import skill
from app.config import settings
from app.domain import playbook

_SHAPE = """{
  "readiness": {"canRun": true, "confidence": 0, "verdict": ""},
  "needs": [
    {"ask": "", "why": "", "who": "", "severity": "blocking|needed|nice", "haveAlready": false, "whereFrom": ""}
  ],
  "willAssume": [{"assumption": "", "ifWrong": ""}]
}"""

_SYSTEM = """
You are the intake gate for one phase of an Altrd Strategy Sprint. You run
BEFORE the phase generates anything.

Your job is to say what this phase needs from the consultant before it can
produce something worth putting in front of a client, and to be honest about
what it will have to assume if it runs without those things.

Return ONLY valid JSON — no prose, no fences.

Rules:
(1) Read what the sprint already holds. Never ask for something the uploaded
    material, the earlier phase packs or the brain already answers — if it is
    there, do not list it as a need.
(2) Ask only for what changes an output. For each need, "why" states in one
    clause what it unblocks or what figure it replaces. If nothing downstream
    moves, leave it out.
(3) "severity" is blocking when the phase cannot produce a defensible output at
    all without it; needed when the output will carry a benchmarked figure in
    its place; nice when it only sharpens a recommendation.
(4) "who" is the role that can supply it — CFO, Head of Stores, plant head — not
    a name.
(5) "haveAlready" is true when the material is present but not yet marked as
    received; "whereFrom" then names the file or phase it is in. This is how the
    consultant is told they can proceed rather than chase.
(6) "willAssume" lists what the phase will benchmark or infer if it runs as it
    stands, each with the consequence of the assumption being wrong. Keep it to
    what actually matters.
(7) canRun is false only when a blocking need is unmet. A phase that would
    produce an entirely benchmarked pack can still run — say so in "verdict",
    which is one plain sentence to the consultant.
(8) At most eight needs. Order by consequence.
""".strip()


async def run(
    *,
    phase: int,
    engagement: dict[str, Any],
    context: str,
    brain: dict[str, Any] | None,
    open_questions: list[dict[str, Any]],
) -> dict[str, Any]:
    ph = playbook.phase(phase)

    brain_block = ""
    if brain:
        brain_block = (
            "\n\nWHAT THE SPRINT ALREADY UNDERSTANDS (the running brain):\n"
            f"{brain.get('narrative', '')}\n"
            f"Settled: {_bullets(brain.get('understood'))}\n"
            f"Assumed but unproven: {_bullets(brain.get('assumed'))}\n"
            f"Named holes: {_bullets(brain.get('unknown'))}"
        )

    open_block = ""
    if open_questions:
        open_block = (
            "\n\nQUESTIONS ALREADY PUT TO THE CLIENT AND STILL UNANSWERED — do not repeat these, but say if this phase is blocked on one:\n"
            + "\n".join(f"- [P{q['phase']}] {q['body']}" for q in open_questions[:12])
        )

    prompt = (
        f"Client: {engagement['name']}\n"
        f"Sector: {engagement['sector']}\n"
        f"Sprint scope: {engagement['scope']}\n"
        f"What this sprint is for: {engagement.get('brief') or 'not stated'}\n\n"
        f"PHASE ABOUT TO RUN: {playbook.phase_label(phase)} — {ph['subtitle']}\n"
        f"What it has to establish: {ph['intro']}\n\n"
        "What the playbook says this phase normally needs:\n"
        + "\n".join(f"- {x}" for x in ph["inputs"])
        + f"\n\nWHAT THE SPRINT HOLDS RIGHT NOW:\n{context}"
        + brain_block
        + open_block
        + f"\n\nReturn JSON matching exactly this shape:\n{_SHAPE}"
    )

    result = await complete_json(
        system=f"{skill(phase)}\n\n{_SYSTEM}",
        prompt=prompt,
        # 4000 was not enough: the gate ran to the ceiling and the needs list
        # arrived truncated, so the last thing it wanted to ask was cut off.
        max_tokens=6000,
        model=settings().model_fast,
    )
    data = result.json()

    needs = [n for n in (data.get("needs") or []) if isinstance(n, dict) and n.get("ask")][:8]
    readiness = data.get("readiness") or {}
    blocking = [n for n in needs if n.get("severity") == "blocking" and not n.get("haveAlready")]

    return {
        "canRun": bool(readiness.get("canRun", True)) and not blocking,
        "confidence": int(readiness.get("confidence") or 0),
        "verdict": str(readiness.get("verdict") or ""),
        "needs": needs,
        "willAssume": [a for a in (data.get("willAssume") or []) if isinstance(a, dict)][:6],
        "usage": result.usage,
        "model": result.model,
    }


def _bullets(items: Any) -> str:
    if not items:
        return "none recorded"
    out = []
    for item in items[:10]:
        if isinstance(item, dict):
            out.append(str(item.get("point") or item.get("text") or item))
        else:
            out.append(str(item))
    return "; ".join(out)
