"""
The answer agent — closing the loop the brief described.

The consultant asks the client the questions a phase raised, then comes back
with whatever they got: a filled spreadsheet, a call transcript, an email thread,
or something typed in. This agent reads that material against the open questions
and works out which are now answered, in the client's own words, and what the
material says that nobody thought to ask about.

Nothing is marked answered on a guess: a question is only closed when the
material actually contains the answer, and the answer is quoted back so the
consultant can see what it was closed on.
"""

from __future__ import annotations

from typing import Any

from app.agents.runtime import complete_json
from app.agents.skills import HOUSE_STYLE
from app.config import settings

_SHAPE = """{
  "answered": [{"id": "", "answer": "", "quote": "", "confidence": "high|medium|low"}],
  "partial": [{"id": "", "gotSoFar": "", "stillMissing": ""}],
  "unprompted": [{"finding": "", "why": "", "phase": 0}],
  "contradictions": [{"finding": "", "contradicts": ""}]
}"""

_SYSTEM = f"""
{HOUSE_STYLE}

The consultant has come back from the client with material — a filled
spreadsheet, a call transcript, an email, or notes. You read it against the
questions the sprint has open and decide what it actually settles.

Return ONLY valid JSON — no prose, no fences.

Rules:
(1) Only mark a question answered when the material genuinely answers it. A
    related sentence is not an answer. When in doubt it is partial, not answered.
(2) "answer" is the answer in the client's own terms, with the figure and its
    unit. "quote" is the words from the material you closed it on — verbatim,
    short. If you cannot quote it, it is not answered.
(3) "confidence" is low when the answer is implied rather than stated.
(4) "partial" is for questions the material moves but does not close: say what
    was learned and what is still missing, so the follow-up is precise.
(5) "unprompted" is what the material says that nobody asked about but that
    changes something — a constraint, a number, a name, a contradiction of a
    benchmark. Give the phase it bears on. Do not pad this.
(6) "contradictions" is where the material contradicts something the sprint
    currently believes. These matter more than confirmations — surface them.
(7) Use the question ids exactly as given. Never invent an id.
""".strip()


async def ingest(
    *,
    engagement: dict[str, Any],
    material: str,
    material_name: str,
    open_questions: list[dict[str, Any]],
    brain: dict[str, Any] | None,
) -> dict[str, Any]:
    if not open_questions:
        listing = "There are no open questions. Report only what the material adds."
    else:
        listing = "OPEN QUESTIONS, with their ids:\n" + "\n".join(
            f"[{q['id']}] (Phase {q['phase']}, {q.get('priority', 'Medium')}) {q['body']}"
            f"  — asked because: {q.get('why', '')}"
            for q in open_questions[:40]
        )

    brain_block = ""
    if brain and brain.get("narrative"):
        brain_block = (
            "\n\nWHAT THE SPRINT CURRENTLY BELIEVES — flag anything the material contradicts:\n"
            + brain["narrative"]
        )

    prompt = (
        f"Client: {engagement['name']} ({engagement['sector']})\n"
        f"Sprint scope: {engagement['scope']}\n\n"
        f"{listing}{brain_block}\n\n"
        f"MATERIAL THE CONSULTANT BROUGHT BACK — [{material_name}]:\n{material[:24000]}\n\n"
        f"Return JSON matching exactly this shape:\n{_SHAPE}"
    )

    result = await complete_json(system=_SYSTEM, prompt=prompt, max_tokens=6000, model=settings().model_fast)
    data = result.json()

    valid = {q["id"] for q in open_questions}
    return {
        "answered": [
            {
                "id": a["id"],
                "answer": str(a.get("answer") or ""),
                "quote": str(a.get("quote") or ""),
                "confidence": str(a.get("confidence") or "medium"),
            }
            for a in (data.get("answered") or [])
            if isinstance(a, dict) and a.get("id") in valid and a.get("answer")
        ],
        "partial": [p for p in (data.get("partial") or []) if isinstance(p, dict) and p.get("id") in valid],
        "unprompted": [u for u in (data.get("unprompted") or []) if isinstance(u, dict) and u.get("finding")][
            :10
        ],
        "contradictions": [
            c for c in (data.get("contradictions") or []) if isinstance(c, dict) and c.get("finding")
        ][:6],
        "usage": result.usage,
        "model": result.model,
    }
