"""Apply pending migrations: `uv run python scripts/migrate.py`."""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.db.migrate import migrate  # noqa: E402

applied = asyncio.run(migrate())
print("applied:", applied or "(already up to date)")
