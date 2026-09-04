"""
The evaluation function — the pack is scored against the house rules before it
is saved.

Borrowed from how a chess engine works: search proposes, an evaluation function
scores, and a position that scores badly is discarded rather than played. The
pack agent proposes; this scores what it produced against rules that can
actually be checked, and anything it fails is reported with the phase rather
than shipped silently.

Two passes, cheapest first:

  - a deterministic pass in Python for what code can see — a figure with no
    number, a ~ figure with no basis, an empty section, a peer set of one;
  - a model pass for what code cannot — a claim the evidence ledger does not
    support, a conclusion that contradicts an earlier phase.
"""

from __future__ import annotations

import json
import re
from typing import Any

from app.agents.runtime import complete_json
from app.agents.skills import HOUSE_STYLE
from app.config import settings

# a derived figure: ~ then a number, a currency symbol, or a currency word.
# "~Rs 320 Cr" is the common Indian form and must match as readily as "~$4m".
_TILDE = re.compile(r"~\s*(?:[\d.£$₹€¥]|Rs\b|INR\b|USD\b|EUR\b|GBP\b|Cr\b|Lakh\b)", re.I)
_BASIS_KEYS = ("basis", "note", "why", "impact", "whyItMatters")


def check_structure(pack: dict[str, Any]) -> list[dict[str, str]]:
    """What can be judged without asking the model."""
    findings: list[dict[str, str]] = []

    for key, section in pack.items():
        if section in (None, "", [], {}):
            findings.append({"rule": "empty-section", "where": key, "detail": f"'{key}' came back empty"})

    # a derived figure with nothing next to it explaining where it came from
    def walk(node: Any, path: str) -> None:
        if isinstance(node, dict):
            has_tilde = any(isinstance(v, str) and _TILDE.search(v) for v in node.values())
            has_basis = any(k in node and isinstance(node[k], str) and node[k].strip() for k in _BASIS_KEYS)
            if has_tilde and not has_basis:
                findings.append(
                    {
                        "rule": "derived-without-basis",
                        "where": path,
                        "detail": "carries a ~ figure but states no basis for it",
                    }
                )
            for k, v in node.items():
                walk(v, f"{path}.{k}" if path else k)
        elif isinstance(node, list):
            for i, v in enumerate(node[:40]):
                walk(v, f"{path}[{i}]")

    walk(pack, "")

    peers = (pack.get("peerRank") or {}).get("peerSet")
    if isinstance(peers, list) and 0 < len(peers) < 3:
        findings.append(
            {
                "rule": "thin-peer-set",
                "where": "peerRank.peerSet",
                "detail": f"only {len(peers)} peer(s) — a ranking needs at least three to mean anything",
            }
        )
    return findings[:40]


_SHAPE = """{
  "violations": [{"rule": "unsupported|contradiction|no-number|vague", "where": "", "detail": "", "severity": "high|medium|low"}],
  "verdict": "",
  "score": 0
}"""

_SYSTEM = f"""
{HOUSE_STYLE}

You are the evaluation pass. A pack has been produced and you score it against
the rules before it is saved. You do not rewrite it and you do not improve it —
you find what breaks the rules.

Return ONLY valid JSON — no prose, no fences.

Check, in this order:
  unsupported   — a figure stated as fact that the evidence ledger does not
                  contain. This is the one that matters most.
  contradiction — a figure or conclusion that contradicts an earlier phase's
                  pack without saying which new evidence moved it.
  no-number     — an issue, opportunity or gap asserted with no quantity
                  attached at all.
  vague         — a recommendation or note so general it could have been
                  written for any company in the sector.

Rules:
(1) Report only what you can point at. "where" is the JSON path or the section
    and row. "detail" quotes the offending text.
(2) Do not report a figure as unsupported when it is prefixed ~ and carries a
    basis — that is the pack behaving correctly.
(3) "severity" is high when a partner would be embarrassed by it in front of the
    client.
(4) "score" is 0-100: how defensible this pack is as it stands. Be hard.
(5) "verdict" is one sentence the consultant reads before showing the pack.
(6) An empty violations array is a valid and welcome answer.
""".strip()


async def check_claims(
    *,
    engagement: dict[str, Any],
    phase: int,
    pack: dict[str, Any],
    ledger_block: str,
    earlier_packs: str,
) -> dict[str, Any]:
    prompt = (
        f"Client: {engagement['name']} ({engagement['sector']})\n"
        f"Phase just produced: {phase}\n"
        f"{ledger_block}\n\n"
        f"{earlier_packs}\n\n"
        f"THE PACK TO EVALUATE:\n{json.dumps(pack)[:22000]}\n\n"
        f"Return JSON matching exactly this shape:\n{_SHAPE}"
    )
    result = await complete_json(system=_SYSTEM, prompt=prompt, max_tokens=6000, model=settings().model_fast)
    data = result.json()
    return {
        "violations": [v for v in (data.get("violations") or []) if isinstance(v, dict) and v.get("detail")][
            :30
        ],
        "verdict": str(data.get("verdict") or ""),
        "score": max(0, min(100, int(data.get("score") or 0))),
        "usage": result.usage,
        "model": result.model,
    }
