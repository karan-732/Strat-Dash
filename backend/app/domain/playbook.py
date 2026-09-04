"""
The Altrd Strategy Sprint playbook.

Authored in `src/lib/playbook/phases.ts` and exported to `playbook.json` by
`bun run scripts/export-playbook.ts`. Edit the TypeScript, not the JSON.
"""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

_DATA = Path(__file__).parent / "playbook.json"


@lru_cache
def _load() -> dict[str, Any]:
    return json.loads(_DATA.read_text())


def phases() -> list[dict[str, Any]]:
    return _load()["phases"]


def phase(index: int) -> dict[str, Any]:
    return phases()[index]


def phase_count() -> int:
    return len(phases())


def doc_status() -> list[str]:
    return _load()["docStatus"]


def phase_label(index: int) -> str:
    p = phase(index)
    return f"Phase {p['num']} — {p['title']}"


PACK_KEYS = ["visual", "visual1", "visual2", "visual3", "visual4", "visual5"]
