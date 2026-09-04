"""Altrd Sprint Console — the phase agents, the sprint brain and Turso."""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.config import settings
from app.db.migrate import migrate


@asynccontextmanager
async def lifespan(app: FastAPI):
    applied = await migrate()
    if applied:
        print(f"migrations applied: {', '.join(applied)}")
    yield


app = FastAPI(
    title="Altrd Sprint Console",
    version="0.1.0",
    description="Phase agents, the sprint brain and Turso persistence for the Strategy Sprint.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings().origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
