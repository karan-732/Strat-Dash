"""
The question agent — what the consultant puts to the client after a phase.

Built to the rules in the sprint question bank: the generator never asks from a
fixed checklist. It reads what the phase just produced, the manual notes
typed against it and the inputs that were not supplied, and emits a question
only where one of four conditions holds. Anything the transcripts already answer
is suppressed and listed as covered instead.
"""

from __future__ import annotations

from typing import Any

from app.agents.runtime import complete_json
from app.agents.skills import skill
from app.config import settings
from app.domain import playbook

_SHAPE = """{
  "questions": [{"q": "", "why": "", "who": "", "priority": "High|Medium|Low", "condition": "benchmarked|assumption|no-owner|next-phase-input"}],
  "alreadyAsked": [{"q": "", "source": ""}],
  "suggestions": [{"do": "", "why": "", "owner": "", "when": ""}]
}"""

_SYSTEM = """
You are the engagement lead on an Altrd Strategy Sprint. The phase pack has just
been built and you decide what still has to be put to the client before the next
phase can move.

Return ONLY valid JSON — no prose, no fences.

Write for the client, not for us. Refer to what an earlier phase produced by
what it is - "the outside-in view", "the leadership view", "the value
diagnosis" - never as "the pack", which means nothing outside this tool and was
reaching clients verbatim in the question text.

A question is generated ONLY where one of four conditions holds. Name which one
in "condition":
  benchmarked      — a figure in the output is derived rather than reported; the
                     question replaces our estimate with their number.
  assumption       — a conclusion rests on an assumption; the question tests the
                     assumption the conclusion would fail on.
  no-owner         — a decision in the output has no owner; the next phase has to
                     route to someone.
  next-phase-input — the next phase needs an input this phase could not produce;
                     raising it now stops the next phase being blocked.

Rules:
(1) If nothing meets one of the four conditions, return an empty "questions"
    array. An empty set is a correct and useful answer; padding it is a failure.
(2) NEVER repeat a question already put to the client in the supplied
    transcripts, notes or earlier question lists, and never ask what the material
    already answers. Put those in "alreadyAsked" with the source you saw it in.
(3) At most seven questions, ordered by consequence, no two asking the same
    thing.
(4) "q" is one sentence of plain business English the client can answer in a
    meeting, specific to this company, naming the figure, process or decision at
    issue. Never a generic consulting prompt.
(5) "why" is one short clause on what the answer unblocks or which figure it
    replaces — quote the figure from the output where there is one.
(6) "who" is the role that can answer: CFO, Head of Stores, plant head.
(7) "priority" is High where an unanswered question would change a figure or a
    conclusion in the FOLLOWING phase, Medium where it only sharpens a
    recommendation, Low otherwise.

Then, separately, "suggestions": one to three pointers on what WE — the Altrd
sprint team — do next, aimed at the next phase. Not advice for the client and
not actions the client would carry. Read them off THIS phase's own pack: name
the figure, function, process, stage or gap that makes the move necessary, so
the pointer could not have been written for any other client. "do" is an
imperative of at most 14 words describing our work; "why" quotes the number
behind it; "owner" is the Altrd role (engagement lead, strategy lead, FDE, AI
engineer, solution architect, analyst); "when" is a short horizon.
""".strip()


async def run(
    *,
    phase: int,
    engagement: dict[str, Any],
    context: str,
    pack: Any,
    brain: dict[str, Any] | None,
    manual_note: str,
    not_supplied: list[str],
    transcripts: list[dict[str, Any]],
    prior_questions: list[dict[str, Any]],
) -> dict[str, Any]:
    ph = playbook.phase(phase)
    nxt = playbook.phase(phase + 1) if phase + 1 < playbook.phase_count() else None

    prompt = (
        f"Client: {engagement['name']}\nSector: {engagement['sector']}\n"
        f"Sprint scope: {engagement['scope']}\n"
        f"Phase just completed: {playbook.phase_label(phase)} ({ph['subtitle']})\n"
        f"What this phase had to establish: {ph['intro']}\n"
    )
    if nxt:
        prompt += (
            f"\nTHE NEXT PHASE IS {playbook.phase_label(phase + 1)}. It needs: "
            + "; ".join(nxt["inputs"][:6])
            + "\nAnything it needs that this phase could not produce is a question now, not later.\n"
        )

    prompt += f"\nProject context:\n{context}"

    if pack:
        import json as _json

        prompt += (
            "\n\nTHE OUTPUT PACK THIS PHASE JUST PRODUCED — its own figures, rankings, rows and "
            "charts. This is the primary material: anchor every question and every suggestion to "
            "something specific inside it and quote the figure or the name you are reacting to. "
            "Figures prefixed ~ are benchmarked rather than reported, which is condition one:\n"
            + _json.dumps(pack)[:9000]
        )

    if brain and brain.get("assumed"):
        prompt += (
            "\n\nWHAT THE SPRINT ASSUMES BUT HAS NOT PROVED — each of these is a candidate question:\n"
            + "\n".join(
                f"- {a.get('point')} (basis: {a.get('basis', 'unstated')}; settled by: {a.get('settledBy', 'unknown')})"  # noqa: E501
                for a in brain["assumed"][:10]
            )
        )

    if manual_note:
        prompt += f"\n\nWhat the consultant entered by hand for this phase:\n{manual_note[:4000]}"

    if not_supplied:
        prompt += (
            "\n\nInputs the client could not supply for this phase, so the phase benchmarked them — "
            "a question here is only worth asking if the real figure would move a conclusion:\n"
            + "\n".join(f"- {x}" for x in not_supplied)
        )

    if transcripts:
        prompt += (
            "\n\nMeeting transcripts and text files uploaded to this sprint. Questions we have "
            "already asked the client appear inside these — read them closely and do not ask any "
            "of them again:\n"
            + "\n\n".join(f"[{f['name']}]\n{(f.get('extracted_text') or '')[:8000]}" for f in transcripts[:4])
        )

    if prior_questions:
        prompt += "\n\nQuestions already raised on this sprint — do not repeat them:\n" + "\n".join(
            f"- [P{q['phase']}] {q['body']}" + (f"  ANSWERED: {q['answer'][:200]}" if q.get("answer") else "")
            for q in prior_questions[:30]
        )

    prompt += f"\n\nReturn JSON matching exactly this shape:\n{_SHAPE}"

    result = await complete_json(
        system=f"{skill(phase)}\n\n{_SYSTEM}",
        prompt=prompt,
        max_tokens=3500,
        model=settings().model_fast,
    )
    data = result.json()

    return {
        "questions": [
            {
                "q": str(q["q"]),
                "why": str(q.get("why") or ""),
                "who": str(q.get("who") or "To assign"),
                "priority": str(q.get("priority") or "Medium"),
                "condition": str(q.get("condition") or ""),
            }
            for q in (data.get("questions") or [])
            if isinstance(q, dict) and q.get("q")
        ][:7],
        "covered": [
            {"q": str(c["q"]), "source": str(c.get("source") or "earlier in the sprint")}
            for c in (data.get("alreadyAsked") or [])
            if isinstance(c, dict) and c.get("q")
        ][:8],
        "suggestions": [
            {
                "act": str(s["do"]),
                "why": str(s.get("why") or ""),
                "owner": str(s.get("owner") or "Engagement lead"),
                "when": str(s.get("when") or "Next"),
            }
            for s in (data.get("suggestions") or [])
            if isinstance(s, dict) and s.get("do")
        ][:3],
        "usage": result.usage,
        "model": result.model,
    }
