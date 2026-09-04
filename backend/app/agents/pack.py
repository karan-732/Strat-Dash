"""
The phase pack agent — the output every phase produces.

The prompts are the ones the console has always used, exported from the
TypeScript so the two stay identical. What is added here is the skill for the
phase and the sprint brain, so the pack is written by something that knows the
method and remembers the engagement rather than by a cold call.
"""

from __future__ import annotations

import json as _json
from typing import Any

from app.agents import prompts
from app.agents.runtime import complete, complete_json
from app.agents.skills import skill
from app.domain import playbook


def _required_keys(phase: int) -> list[str]:
    """The top-level sections the phase's shape declares."""
    try:
        return list(_json.loads(prompts.pack_shape(phase)).keys())
    except Exception:  # noqa: BLE001 - the shape is a literal, but never fail a build on it
        return []


async def build(
    *,
    phase: int,
    engagement: dict[str, Any],
    context: str,
    brain: dict[str, Any] | None,
    sources_block: str,
) -> dict[str, Any]:
    header = (
        f"Company: {engagement['name']}\n"
        f"Sector: {engagement['sector']}\n"
        f"Website: {engagement.get('url') or 'not supplied'}"
    )

    if phase == 0:
        body = f"{header}\nEngagement notes: {engagement.get('notes') or 'none'}{prompts.pack_brief(0)}"
    else:
        brief = (
            prompts.phase2_scope_brief(engagement.get("scope", ""))
            if phase == 2
            else prompts.pack_brief(phase)
        )
        body = f"{header}\n\nProject context:\n{context}{brief}"

    if brain and brain.get("narrative"):
        body += (
            "\n\nWHAT THE SPRINT ALREADY UNDERSTANDS. This is the running brain of the "
            "engagement — build on it, do not re-derive it, and do not contradict a settled "
            "point without saying which new evidence moved it:\n"
            f"{brain['narrative']}\n"
            f"Still assumed rather than proved: {_points(brain.get('assumed'))}\n"
            f"Known holes: {_points(brain.get('unknown'))}"
        )

    if engagement.get("success_metrics"):
        body += (
            "\n\nTHE DESTINATION THIS SPRINT IS MEASURED AGAINST, captured before any phase ran. "
            "Every figure and every priority in this pack must be relatable to one of these:\n"
            + "\n".join(
                f"- {m['metric']}: {m.get('baseline') or '?'} → {m.get('target') or '?'}"
                f"{' (primary)' if m.get('is_primary') else ''}"
                for m in engagement["success_metrics"]
            )
        )

    body += f"\n\nReturn JSON matching exactly this shape:\n{prompts.pack_shape(phase)}"

    system = f"{skill(phase)}\n\n{prompts.pack_system(phase)}"

    """
    Everything above is sent twice whenever a pack needs topping up, and again
    on a parse retry — the context, the evidence ledger, the brain, the sources
    and the shape run to thousands of tokens. Passing it as the cacheable
    prefix means the second and third calls pay a tenth of the input price for
    it instead of full freight.
    """
    shared = body + sources_block
    """
    32k, not 24k. Phase 0 grew a twelfth section - the metric comparison
    quadrants, five or six charts of plotted peers - and the pack started
    finishing exactly on the old ceiling, which means truncated. A ceiling is
    not a reservation: nothing is paid for tokens that are not produced, while
    a truncated pack costs a whole second call to top up. So it is set high
    enough that a full pack finishes inside it.
    """
    result = await complete_json(system=system, prompt="", cache=shared, max_tokens=32000)
    pack = result.json()

    """
    A pack that ran to the token ceiling arrives truncated, and the JSON repair
    will happily hand back the two sections that completed. That is worse than
    an error, because it looks like a pack. So the result is checked against the
    sections its own shape declares, and anything missing is asked for in a
    second call and merged, rather than regenerating what already came back.
    """
    usage = result.usage
    missing = [k for k in _required_keys(phase) if k not in pack]
    if missing:
        top_up = await complete_json(
            system=system,
            cache=shared,
            prompt=(
                "\n\nYou have already produced these sections, which are correct and must NOT be "
                f"repeated: {', '.join(k for k in pack)}.\n"
                f"Return ONLY the sections still missing: {', '.join(missing)}.\n"
                "Same rules, same shapes, one JSON object containing only those keys."
            ),
            max_tokens=32000,
        )
        for key, value in (top_up.json() or {}).items():
            if key in missing:
                pack[key] = value
        usage.prompt_tokens += top_up.usage.prompt_tokens
        usage.output_tokens += top_up.usage.output_tokens
        usage.cost_usd += top_up.usage.cost_usd

    return {
        "pack": pack,
        "usage": usage,
        "model": result.model,
        "missing": [k for k in _required_keys(phase) if k not in pack],
    }


async def deliverable(
    *,
    phase: int,
    doc_number: int,
    engagement: dict[str, Any],
    context: str,
) -> dict[str, Any]:
    """One deliverable draft, for the human review pass."""
    ph = playbook.phase(phase)
    doc = next(d for d in ph["docs"] if d["n"] == doc_number)
    prompt = (
        f"Deliverable: {doc['name']}\n"
        f"Phase {ph['num']} - {ph['title']} ({ph['subtitle']})\n"
        f"Purpose: {doc['desc']}\n\n"
        "Required sections, in order:\n"
        + "\n".join(f"{i + 1}. {s}" for i, s in enumerate(doc["sections"]))
        + f"\n\nProject context:\n{context}\n\n"
        "Write the full deliverable now. Start with an H1 title line, then a 3-line context "
        "block, then the sections."
    )
    result = await complete(
        system=f"{skill(phase)}\n\n{prompts.deliverable_system()}",
        prompt=prompt,
        max_tokens=5000,
    )
    return {"text": result.text, "usage": result.usage, "model": result.model}


def _points(items: Any) -> str:
    if not items:
        return "none recorded"
    return "; ".join(str(x.get("point", x)) if isinstance(x, dict) else str(x) for x in items[:10])
