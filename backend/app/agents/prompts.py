"""Prompts exported from the TypeScript console (see scripts/export-playbook.ts)."""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

_DATA = Path(__file__).parent / "prompts.json"


@lru_cache
def _load() -> dict[str, Any]:
    return json.loads(_DATA.read_text())


def pack_shape(phase: int) -> str:
    return _load()["packShapes"][phase]


def pack_system(phase: int) -> str:
    return _load()["packSystems"][phase]


def pack_brief(phase: int) -> str:
    return _load()["packBriefs"][phase]


def phase2_scope_brief(scope: str) -> str:
    briefs = _load()["phase2ScopeBrief"]
    return briefs["process"] if "process" in (scope or "").lower() else briefs["department"]


def peer_rank() -> dict[str, str]:
    return _load()["peerRank"]


def deliverable_system() -> str:
    return _load()["deliverable"]["system"]


def research() -> dict[str, str]:
    return _load()["research"]
