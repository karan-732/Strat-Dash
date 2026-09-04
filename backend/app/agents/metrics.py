"""
The success-metric agent — the destination, captured before any phase runs.

From the brief: the proposal and the client's stated expectations set the
success metrics, and once those are set "we know the destination, we just want
to know the direction". Every later phase is measured against them, so they are
extracted at onboarding and stored with the engagement rather than rediscovered.
"""

from __future__ import annotations

from typing import Any

from app.agents.runtime import complete_json
from app.agents.skills import HOUSE_STYLE
from app.config import settings

_SHAPE = """{
  "brief": "",
  "scopeRead": "Department-level sprint|Single process-level sprint",
  "metrics": [
    {"metric": "", "baseline": "", "target": "", "horizon": "", "isPrimary": false, "source": "proposal|transcript|consultant", "sourceRef": "", "derived": false}
  ],
  "missing": [""]
}"""

_SYSTEM = f"""
{HOUSE_STYLE}

You read the proposal and whatever the client has said about what they expect,
and you extract the destination this sprint is measured against.

Return ONLY valid JSON — no prose, no fences.

Rules:
(1) A metric needs a name, and wherever the material supports it, a baseline, a
    target and a date. Where the material states an ambition without a number,
    still record the metric and leave baseline or target empty rather than
    inventing one — mark derived true only if you inferred a value.
(2) Exactly one metric may be primary. If the material names several benefits,
    choose the one the client themselves emphasised and say so in the brief; if
    it is genuinely ambiguous, mark none primary and put the choice in
    "missing".
(3) "brief" is one paragraph in plain words: what this sprint is and what it has
    to achieve — the sentence the consultant would say if asked. Use the
    client's own framing.
(4) "scopeRead" is your read of whether this is scoped to a whole department or
    to one named process, from the material. Say which the material supports.
(5) "missing" is what a proper success-metric set still needs — the numbers or
    the decision the consultant has to go back for.
""".strip()


async def extract(*, name: str, sector: str, material: str) -> dict[str, Any]:
    prompt = (
        f"Client: {name}\nSector: {sector}\n\n"
        f"PROPOSAL AND STATED EXPECTATIONS:\n{material[:20000]}\n\n"
        f"Return JSON matching exactly this shape:\n{_SHAPE}"
    )
    result = await complete_json(system=_SYSTEM, prompt=prompt, max_tokens=3000, model=settings().model_fast)
    data = result.json()
    return {
        "brief": str(data.get("brief") or ""),
        "scope_read": str(data.get("scopeRead") or ""),
        "metrics": [m for m in (data.get("metrics") or []) if isinstance(m, dict) and m.get("metric")][:8],
        "missing": [str(x) for x in (data.get("missing") or []) if x][:6],
        "usage": result.usage,
        "model": result.model,
    }
