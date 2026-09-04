"""
The sprint brain — the running understanding the whole engagement carries.

The brief described the sprint as a back-and-forth, not a pipeline: the tool
says what it has understood so far, what is still missing, asks for it, takes
the answers, "updates the larger brain and updates the report", and moves on.
This is that brain.

It is rewritten whenever something material lands — a phase is built, answers
are ingested, the engagement is onboarded — and every later agent reads it, so
the sprint stops re-deriving what it already knows.
"""

from __future__ import annotations

from typing import Any

from app.agents.runtime import complete_json
from app.agents.skills import HOUSE_STYLE
from app.config import settings
from app.domain import playbook

_SHAPE = """{
  "narrative": "",
  "confidence": 0,
  "understood": [{"point": "", "evidence": "", "phase": 0}],
  "assumed": [{"point": "", "basis": "", "settledBy": ""}],
  "unknown": [{"point": "", "blocks": "", "phase": 0}]
}"""

_SYSTEM = f"""
{HOUSE_STYLE}

You maintain the running understanding of one Strategy Sprint. You are handed
the previous understanding and whatever has just landed, and you rewrite it.

Return ONLY valid JSON — no prose, no fences.

Rules:
(1) "narrative" is what you would say if the engagement lead asked "where are we
    on this client?" — six to ten sentences, specific, naming figures and the
    phase each came from. No preamble, no restating the method.
(2) "understood" is what is settled, each with the evidence that settles it and
    the phase it came from. A figure the client supplied or confirmed is
    understood. A figure you benchmarked is NOT — that is assumed.
(3) "assumed" is what the sprint currently believes but has not proved, each
    with its basis and what would settle it. Every ~ figure lives here.
(4) "unknown" is the named holes: what the sprint does not know, and what it
    blocks. Do not pad this — a hole that blocks nothing is not worth carrying.
(5) "confidence" is 0-100: how much of what the sprint asserts rests on client
    evidence rather than benchmark. Be hard about this. A sprint whose numbers
    are mostly derived is not at 80.
(6) Carry forward what is still true and drop what has been superseded. When new
    evidence contradicts an earlier point, keep the new one and say so in the
    narrative.
(7) Never invent. If the material does not support a point, it does not go in.
""".strip()


async def revise(
    *,
    engagement: dict[str, Any],
    previous: dict[str, Any] | None,
    reason: str,
    phase: int | None,
    landed: str,
) -> dict[str, Any]:
    """Rewrite the brain after something material landed."""
    previous_block = "This is the first revision — there is no previous understanding."
    if previous:
        previous_block = (
            f"PREVIOUS UNDERSTANDING (version {previous.get('version')}):\n"
            f"{previous.get('narrative', '')}\n\n"
            f"Settled: {_lines(previous.get('understood'))}\n"
            f"Assumed: {_lines(previous.get('assumed'))}\n"
            f"Unknown: {_lines(previous.get('unknown'))}"
        )

    # built lazily: phase_label is only valid when a phase is actually in play
    if reason == "phase_built" and phase is not None:
        what = f"{playbook.phase_label(phase)} has just produced its output pack."
    elif reason == "answers_ingested":
        what = "The client has answered questions the sprint had open."
    elif reason == "onboarding":
        what = "The engagement has just been opened."
    else:
        what = reason

    prompt = (
        f"Client: {engagement['name']} ({engagement['sector']})\n"
        f"Sprint scope: {engagement['scope']}\n"
        f"What this sprint is for: {engagement.get('brief') or 'not stated'}\n\n"
        f"{previous_block}\n\n"
        f"WHAT HAS JUST LANDED: {what}\n\n"
        f"{landed}\n\n"
        f"Rewrite the understanding. Return JSON matching exactly this shape:\n{_SHAPE}"
    )

    result = await complete_json(system=_SYSTEM, prompt=prompt, max_tokens=8000, model=settings().model_fast)
    data = result.json()

    return {
        "narrative": str(data.get("narrative") or ""),
        "confidence": max(0, min(100, int(data.get("confidence") or 0))),
        "understood": _clean(data.get("understood"), "point"),
        "assumed": _clean(data.get("assumed"), "point"),
        "unknown": _clean(data.get("unknown"), "point"),
        "usage": result.usage,
        "model": result.model,
    }


def _clean(items: Any, key: str) -> list[dict[str, Any]]:
    if not isinstance(items, list):
        return []
    return [x for x in items if isinstance(x, dict) and x.get(key)][:20]


def _lines(items: Any) -> str:
    if not items:
        return "none"
    return "; ".join(str(x.get("point", x)) if isinstance(x, dict) else str(x) for x in items[:12])
