"""Apply the numbered migrations in order, tracked in `_migrations`."""

from __future__ import annotations

import re
from datetime import UTC, datetime
from pathlib import Path

from app.db.client import execute

MIGRATIONS = Path(__file__).parent / "migrations"


def _statements(sql: str) -> list[str]:
    """
    Split a migration into statements.

    Comments are stripped *before* the split, not after: a `--` comment is free
    to contain a semicolon, and splitting first would cut the file mid-sentence
    and hand the tail of an English clause to the database as SQL.
    """
    bare = re.sub(r"--[^\n]*", "", sql)
    return [s.strip() for s in bare.split(";") if s.strip()]


async def migrate() -> list[str]:
    await execute("CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)")
    done = {r["name"] for r in await execute("SELECT name FROM _migrations")}

    applied: list[str] = []
    for path in sorted(MIGRATIONS.glob("*.sql")):
        if path.name in done:
            continue
        for statement in _statements(path.read_text()):
            await execute(statement)
        await execute(
            "INSERT INTO _migrations (name, applied_at) VALUES (?, ?)",
            [path.name, datetime.now(UTC).isoformat()],
        )
        applied.append(path.name)
    return applied
