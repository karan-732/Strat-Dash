"""
Turso over the HTTP pipeline API.

A thin client rather than a driver: the API is one POST of a statement list,
and going direct keeps the dependency surface small and the failure modes
readable.
"""

from __future__ import annotations

import json
from typing import Any

import httpx

from app.config import settings

_TIMEOUT = httpx.Timeout(30.0, connect=10.0)


class TursoError(RuntimeError):
    pass


def _argument(value: Any) -> dict[str, Any]:
    if value is None:
        return {"type": "null", "value": None}
    if isinstance(value, bool):
        return {"type": "integer", "value": str(int(value))}
    if isinstance(value, int):
        return {"type": "integer", "value": str(value)}
    if isinstance(value, float):
        return {"type": "float", "value": value}
    if isinstance(value, (dict, list)):
        return {"type": "text", "value": json.dumps(value)}
    return {"type": "text", "value": str(value)}


def _value(cell: dict[str, Any]) -> Any:
    kind = cell.get("type")
    if kind == "null":
        return None
    if kind == "integer":
        return int(cell["value"])
    if kind == "float":
        return float(cell["value"])
    return cell.get("value")


async def execute(sql: str, args: list[Any] | None = None) -> list[dict[str, Any]]:
    """Run one statement and return its rows as dicts."""
    rows = await batch([(sql, args or [])])
    return rows[0]


async def batch(statements: list[tuple[str, list[Any]]]) -> list[list[dict[str, Any]]]:
    """Run several statements in order, in one round trip."""
    cfg = settings()
    if not cfg.turso_http_url or not cfg.turso_auth_token:
        raise TursoError("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are not configured")

    requests = [
        {"type": "execute", "stmt": {"sql": sql, "args": [_argument(a) for a in args]}}
        for sql, args in statements
    ]
    requests.append({"type": "close"})

    async with httpx.AsyncClient(timeout=_TIMEOUT) as http:
        response = await http.post(
            f"{cfg.turso_http_url}/v2/pipeline",
            headers={"Authorization": f"Bearer {cfg.turso_auth_token}"},
            json={"requests": requests},
        )
    if response.status_code >= 400:
        raise TursoError(f"turso {response.status_code}: {response.text[:300]}")

    payload = response.json()
    out: list[list[dict[str, Any]]] = []
    for result in payload.get("results", []):
        if result.get("type") == "error":
            raise TursoError(result["error"].get("message", "unknown error"))
        if result.get("type") != "ok":
            continue
        body = result.get("response", {})
        if body.get("type") != "execute":
            continue
        table = body["result"]
        columns = [c["name"] for c in table["cols"]]
        out.append([dict(zip(columns, (_value(c) for c in row), strict=False)) for row in table["rows"]])
    return out


async def one(sql: str, args: list[Any] | None = None) -> dict[str, Any] | None:
    rows = await execute(sql, args)
    return rows[0] if rows else None
