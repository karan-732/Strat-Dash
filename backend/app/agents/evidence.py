"""
The evidence ledger — extraction, separated from rendering.

Asking one call to read fifty pages of source material *and* lay out an
eleven-section pack at the same time is where figures get invented: the model is
composing structure and recalling facts in the same breath, and under that load
a plausible number is cheaper to produce than a real one.

So extraction runs first and on its own. This agent reads the live pages, the
data room and the consultant's notes and returns a flat ledger of facts, each
with its unit, its source and the words it was taken from. The pack agent is
then handed the ledger and told that a figure marked `reported` may be stated as
fact, and anything else must be prefixed ~ with its basis shown.

It also makes the sprint auditable: every reported figure in a pack can be
traced to a quote in a named document.
"""

from __future__ import annotations

from typing import Any

from app.agents.runtime import complete_json
from app.agents.skills import HOUSE_STYLE

_SHAPE = """{
  "facts": [
    {"fact": "", "value": "", "unit": "", "period": "", "kind": "reported|derived",
     "source": "", "quote": "", "confidence": "high|medium|low"}
  ],
  "absent": [{"wanted": "", "whyItMatters": ""}]
}"""

_SYSTEM = f"""
{HOUSE_STYLE}

You are the extraction pass. You do not write reports, draw conclusions or
structure anything. You read what the sprint holds and pull out the facts.

Return ONLY valid JSON — no prose, no fences.

Rules:
(1) A fact goes in the ledger ONLY if the material actually contains it. If you
    cannot quote it, it does not exist. This is the whole point of this pass.
(2) "quote" is the words you took it from, verbatim and short. "source" names
    the document, page or URL.
(3) "kind" is reported when the material states it. Use derived ONLY for a
    figure you computed from two stated figures — and then "quote" holds the
    inputs and "fact" states the arithmetic. Never mark a sector benchmark or a
    recollection as reported.
(4) "value" and "unit" are separate. "period" is the year, quarter or date the
    figure belongs to, where the material says.
(5) "confidence" is low where the material is ambiguous about what the figure
    measures.
(6) "absent" is what a reader of this material would expect to find and cannot
    — the gaps that will have to be benchmarked. Name what it blocks.
(7) Do not editorialise. No conclusions, no recommendations, no adjectives.
""".strip()


async def extract(
    *,
    engagement: dict[str, Any],
    phase: int,
    sources_block: str,
    held: str,
    web_search: bool = False,
) -> dict[str, Any]:
    """
    Pull every quotable figure out of the material, before anything is written.

    `web_search` is the caller's decision, not this agent's. This is the one
    agent whose output the pack may state as fact, so on Phase 0 - the only
    phase that works from the public record - it is worth a live search: real
    reported figures with real sources enter the ledger, and the pack can only
    assert what the ledger holds. A Phase 0 run without it invented a 2015
    Firema acquisition and an RDSO certification and cited both as reported.

    From Phase 1 on there is nothing to search for. The evidence is the client's
    own material - the call, the uploads, the notes - and searching the open web
    for it costs about $0.09 and 35,000 injected tokens to find nothing. This
    used to be hard-coded true and ran on all six phases.
    """
    prompt = (
        f"Client: {engagement['name']} ({engagement['sector']})\n"
        f"Extracting for: phase {phase}\n\n"
        f"WHAT THE SPRINT HOLDS:\n{held}\n"
        f"{sources_block}\n\n"
        f"Return JSON matching exactly this shape:\n{_SHAPE}"
    )
    result = await complete_json(system=_SYSTEM, prompt=prompt, max_tokens=8000, web_search=web_search)
    data = result.json()

    facts = [
        f for f in (data.get("facts") or []) if isinstance(f, dict) and f.get("fact") and f.get("quote")
    ][:80]
    return {
        "facts": facts,
        "absent": [a for a in (data.get("absent") or []) if isinstance(a, dict) and a.get("wanted")][:20],
        "usage": result.usage,
        "model": result.model,
    }


def as_block(ledger: dict[str, Any]) -> str:
    """The ledger, formatted for the pack agent."""
    facts = ledger.get("facts") or []
    if not facts:
        return (
            "\n\nEVIDENCE LEDGER: empty. Nothing in the material could be quoted, so EVERY figure "
            "in this pack is benchmark-derived. Prefix every one with ~ and state its basis."
        )

    reported = [f for f in facts if f.get("kind") == "reported"]
    derived = [f for f in facts if f.get("kind") != "reported"]

    out = [
        "\n\nEVIDENCE LEDGER — extracted from the material before this pack was written.",
        "A figure below marked REPORTED may be stated as fact and attributed to its source.",
        "ANY figure not in this ledger must be prefixed ~ and carry its basis. Do not restate a",
        "ledger figure with a different value, and do not promote a derived figure to reported.",
        "",
    ]
    for f in reported:
        out.append(
            f"REPORTED · {f['fact']}: {f.get('value', '')} {f.get('unit', '')}".rstrip()
            + (f" [{f['period']}]" if f.get("period") else "")
            + f'\n    source: {f.get("source", "unnamed")} — "{str(f.get("quote"))[:160]}"'
        )
    for f in derived:
        out.append(
            f"DERIVED  · {f['fact']}: {f.get('value', '')} {f.get('unit', '')}".rstrip()
            + f"\n    from: {str(f.get('quote'))[:160]}"
        )
    absent = ledger.get("absent") or []
    if absent:
        out.append("")
        out.append("NOT IN THE MATERIAL — these have to be benchmarked and marked ~:")
        out.extend(f"  - {a['wanted']} (blocks: {a.get('whyItMatters', 'unstated')})" for a in absent)
    return "\n".join(out)
