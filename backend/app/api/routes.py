"""The HTTP surface the console calls."""

from __future__ import annotations

import json
from typing import Any

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.agents import metrics as metrics_agent
from app.agents import runtime as agent_runtime
from app.config import settings
from app.db import repo
from app.domain import playbook
from app.services import ingest, pipeline

router = APIRouter()
Provider = agent_runtime.Provider


def require_phase_index(phase: int) -> None:
    if phase < 0 or phase >= playbook.phase_count():
        raise HTTPException(404, "unknown phase")


async def require_unlocked_phase(engagement_id: str, phase: int) -> None:
    require_phase_index(phase)
    unlocked, why = await pipeline.phase_unlocked(engagement_id, phase)
    if not unlocked:
        raise HTTPException(409, why)


# ------------------------------------------------------------------- credits


@router.get("/providers")
async def providers() -> dict[str, Any]:
    """Non-secret provider metadata for the console's generation switch."""
    cfg = settings()
    return {
        "default": "openrouter",
        "providers": {
            "openrouter": {
                "label": "CLAUDE",
                "model": cfg.model,
                "modelFast": cfg.model_fast,
                "configured": bool(cfg.openrouter_api_key),
                # live reading via OpenRouter's web plugin, on the agents that
                # gather evidence and the peer set
                "webSearch": True,
            },
            "openai": {
                "label": "CHATGPT · LUNA",
                "model": cfg.openai_model,
                "configured": bool(cfg.openai_api_key),
                "webSearch": True,
            },
        },
    }


@router.get("/credits")
async def credits() -> dict[str, Any]:
    """
    What is left to spend, and what this console has spent.

    Surfaced behind the i in the header: a phase costs real money and a run
    that dies halfway because the balance ran out is worse than one that never
    started.
    """
    import httpx

    cfg = settings()
    balance: dict[str, Any] = {"available": None, "limit": None, "used": None}
    if cfg.openrouter_api_key:
        try:
            async with httpx.AsyncClient(timeout=15.0) as http:
                response = await http.get(
                    f"{cfg.openrouter_base_url}/key",
                    headers={"Authorization": f"Bearer {cfg.openrouter_api_key}"},
                )
            if response.status_code < 400:
                data = (response.json() or {}).get("data") or {}
                balance = {
                    "used": data.get("usage"),
                    "limit": data.get("limit"),
                    "available": data.get("limit_remaining"),
                }
        except Exception:  # noqa: BLE001 - the console shows "unknown" rather than failing
            pass

    spent = await repo.total_spend()
    return {
        "provider": "openrouter",
        "model": cfg.model,
        **balance,
        "consoleSpend": spent["cost"],
        "runs": spent["runs"],
        "failedRuns": spent["errors"],
    }


# ------------------------------------------------------------------ playbook


@router.get("/playbook")
async def get_playbook() -> dict[str, Any]:
    """The six phases, so the console and the backend never drift."""
    return {"phases": playbook.phases(), "docStatus": playbook.doc_status()}


# --------------------------------------------------------------- engagements


class NewEngagement(BaseModel):
    name: str
    sector: str = "Sector to confirm"
    url: str = ""
    notes: str = ""
    scope: str = "Department-level sprint"
    brief: str = ""


@router.get("/engagements")
async def list_engagements() -> list[dict[str, Any]]:
    return await repo.list_engagements()


@router.post("/engagements", status_code=201)
async def create_engagement(body: NewEngagement) -> dict[str, Any]:
    if not body.name.strip():
        raise HTTPException(400, "a client name is required")
    return await repo.create_engagement(
        name=body.name.strip(),
        sector=body.sector.strip() or "Sector to confirm",
        url=body.url.strip(),
        notes=body.notes.strip(),
        scope=body.scope,
        brief=body.brief.strip(),
    )


@router.get("/engagements/{engagement_id}")
async def get_engagement(engagement_id: str) -> dict[str, Any]:
    engagement = await repo.get_engagement(engagement_id)
    if not engagement:
        raise HTTPException(404, "unknown engagement")
    state = await repo.phase_state(engagement["id"])
    # ``engagements.notes`` is the engagement-level brief entered at
    # onboarding.  ``phase_state`` also calls its phase-note rows ``notes``;
    # flattening both dictionaries used to replace the former with a list.
    # Keep the two concepts distinct on the wire.
    phase_notes = state.pop("notes", [])
    return {
        **engagement,
        **state,
        "phase_notes": phase_notes,
        "packs": await repo.current_packs(engagement["id"]),
        "questions": await repo.questions_for(engagement["id"]),
        "brain": await repo.current_brain(engagement["id"]),
        # what returned material said that belonged to no question
        "answer_findings": await repo.answer_findings(engagement["id"]),
        "spend": await repo.spend(engagement["id"]),
    }


# ------------------------------------------------------- destination, up front


class MetricsRequest(BaseModel):
    material: str = Field(..., description="proposal text and what the client said they expect")
    provider: Provider = "openrouter"


@router.post("/engagements/{engagement_id}/success-metrics")
async def set_success_metrics(engagement_id: str, body: MetricsRequest) -> dict[str, Any]:
    """
    Read the proposal and the client's stated expectations, and store the
    destination the whole sprint is then measured against.
    """
    engagement = await repo.get_engagement(engagement_id)
    if not engagement:
        raise HTTPException(404, "unknown engagement")

    with agent_runtime.provider_context(body.provider):
        result = await metrics_agent.extract(
            name=engagement["name"], sector=engagement["sector"], material=body.material
        )
    await repo.save_success_metrics(engagement["id"], result["metrics"])
    if result["brief"]:
        await repo.set_brief(engagement["id"], result["brief"])
    await repo.log_run(
        engagement_id=engagement["id"],
        phase=None,
        agent="metrics",
        status="ok",
        model=result["model"],
        usage=result["usage"],
    )
    return {
        "brief": result["brief"],
        "scopeRead": result["scope_read"],
        "metrics": result["metrics"],
        "missing": result["missing"],
    }


# -------------------------------------------------------------- phase inputs


class InputState(BaseModel):
    state: str | None = None


@router.put("/engagements/{engagement_id}/phases/{phase}/inputs/{index}")
async def set_input(engagement_id: str, phase: int, index: int, body: InputState) -> dict[str, str]:
    await require_unlocked_phase(engagement_id, phase)
    if body.state not in (None, "received", "na"):
        raise HTTPException(400, "state must be received, na or null")
    await repo.set_input(engagement_id, phase, index, body.state)
    return {"ok": "true"}


class StepBody(BaseModel):
    done: bool = True


@router.put("/engagements/{engagement_id}/phases/{phase}/steps/{index}")
async def set_step(engagement_id: str, phase: int, index: int, body: StepBody) -> dict[str, str]:
    await require_unlocked_phase(engagement_id, phase)
    await repo.set_step(engagement_id, phase, index, body.done)
    return {"ok": "true"}


class AttendanceBody(BaseModel):
    present: bool = True


@router.put("/engagements/{engagement_id}/phases/{phase}/attendance/{index}")
async def set_attendance(engagement_id: str, phase: int, index: int, body: AttendanceBody) -> dict[str, str]:
    """Who was actually in the room — carried into every later generation."""
    await require_unlocked_phase(engagement_id, phase)
    await repo.set_attendance(engagement_id, phase, index, body.present)
    return {"ok": "true"}


class DeliverableBody(BaseModel):
    status: int | None = None
    draft: str | None = None


@router.put("/engagements/{engagement_id}/phases/{phase}/deliverables/{doc}")
async def set_deliverable(engagement_id: str, phase: int, doc: int, body: DeliverableBody) -> dict[str, str]:
    await require_unlocked_phase(engagement_id, phase)
    if body.status is not None and not 0 <= body.status <= 4:
        raise HTTPException(400, "status must be 0-4")
    await repo.set_deliverable(engagement_id, phase, doc, status=body.status, draft=body.draft)
    return {"ok": "true"}


class EngagementPatch(BaseModel):
    name: str | None = None
    sector: str | None = None
    url: str | None = None
    notes: str | None = None
    scope: str | None = None
    brief: str | None = None


@router.delete("/engagements/{engagement_id}")
async def remove_engagement(engagement_id: str) -> dict[str, str]:
    """
    Remove an engagement from the portfolio.

    Archives it. The packs, questions, brain and run history stay in the
    database — the spend figures are derived from `agent_runs`, and a sprint
    that has been generated represents real money — so this is reversible even
    though the console offers no way back.
    """
    if not await repo.archive_engagement(engagement_id):
        raise HTTPException(404, "unknown engagement")
    return {"ok": "true"}


@router.patch("/engagements/{engagement_id}")
async def patch_engagement(engagement_id: str, body: EngagementPatch) -> dict[str, str]:
    await repo.patch_engagement(engagement_id, body.model_dump(exclude_none=True))
    return {"ok": "true"}


@router.delete("/engagements/{engagement_id}/links/{link_id}")
async def remove_link(engagement_id: str, link_id: str) -> dict[str, str]:
    await repo.remove_link(engagement_id, link_id)
    return {"ok": "true"}


@router.delete("/engagements/{engagement_id}/files/{file_id}")
async def remove_file(engagement_id: str, file_id: str) -> dict[str, str]:
    await repo.remove_file(engagement_id, file_id)
    return {"ok": "true"}


class NoteBody(BaseModel):
    body: str = ""


@router.put("/engagements/{engagement_id}/phases/{phase}/notes")
async def set_note(engagement_id: str, phase: int, body: NoteBody) -> dict[str, str]:
    await require_unlocked_phase(engagement_id, phase)
    await repo.set_note(engagement_id, phase, body.body)
    return {"ok": "true"}


class LinkBody(BaseModel):
    url: str
    label: str | None = None


@router.post("/engagements/{engagement_id}/links", status_code=201)
async def add_link(engagement_id: str, body: LinkBody) -> dict[str, str]:
    if not body.url.strip():
        raise HTTPException(400, "a url is required")
    await repo.add_link(engagement_id, body.url.strip(), body.label)
    return {"ok": "true"}


@router.post("/engagements/{engagement_id}/phases/{phase}/files", status_code=201)
async def upload_file(
    engagement_id: str,
    phase: int,
    file: UploadFile = File(...),
    kind: str = Form("document"),
    input_index: int = Form(-1),
) -> dict[str, Any]:
    """A data-room upload. Text-bearing files are read so generation can use them."""
    await require_unlocked_phase(engagement_id, phase)
    if input_index < -1 or input_index >= len(playbook.phase(phase)["inputs"]):
        raise HTTPException(400, "input_index must identify an input in this phase, or be -1")
    data = await file.read()
    text = ingest.extract_text(file.filename or "upload", data, file.content_type)
    file_id = await repo.add_file(
        engagement_id=engagement_id,
        phase=phase,
        name=file.filename or "upload",
        size=len(data),
        mime=file.content_type,
        kind=kind,
        text=text,
        input_index=input_index,
    )
    return {"id": file_id, "textExtracted": bool(text), "characters": len(text or "")}


# ------------------------------------------------------------- running a phase


@router.get("/engagements/{engagement_id}/phases/{phase}/intake")
async def phase_intake(
    engagement_id: str,
    phase: int,
    refresh: bool = False,
    provider: Provider = "openrouter",
) -> dict[str, Any]:
    """
    What this phase needs before it will run.

    Called when the consultant opens a phase, so the ask arrives before the
    generate button rather than after a disappointing pack. The answer is
    cached against a digest of the material it was derived from, so opening the
    same phase twice costs nothing; `?refresh=true` forces a fresh reading.
    """
    await require_unlocked_phase(engagement_id, phase)
    with agent_runtime.provider_context(provider):
        result = await pipeline.run_intake(engagement_id, phase, refresh=refresh)
    result.pop("usage", None)
    return result


@router.post("/engagements/{engagement_id}/phases/{phase}/generate")
async def generate_phase(
    engagement_id: str,
    phase: int,
    force: bool = False,
    provider: Provider = "openrouter",
) -> StreamingResponse:
    """Run the phase, streaming a line of NDJSON per stage."""
    require_phase_index(phase)

    async def stream():
        with agent_runtime.provider_context(provider):
            try:
                async for event in pipeline.run_phase(engagement_id, phase, force=force):
                    yield json.dumps(event) + "\n"
            except Exception as exc:  # noqa: BLE001 - surfaced to the console as an event
                yield json.dumps({"type": "error", "message": str(exc)}) + "\n"

    return StreamingResponse(
        stream(), media_type="application/x-ndjson", headers={"Cache-Control": "no-store"}
    )


@router.delete("/engagements/{engagement_id}/phases/{phase}/pack")
async def reset_phase(engagement_id: str, phase: int) -> dict[str, str]:
    require_phase_index(phase)
    async with pipeline.engagement_run_lock(engagement_id):
        await repo.clear_pack(engagement_id, phase)
    return {"ok": "true"}


# ------------------------------------------------------- answers coming back


class AnswerText(BaseModel):
    material: str
    name: str = "typed by the consultant"
    phase: int = 0
    provider: Provider = "openrouter"


@router.post("/engagements/{engagement_id}/answers")
async def post_answers(engagement_id: str, body: AnswerText) -> dict[str, Any]:
    """Answers typed or pasted in."""
    if not body.material.strip():
        raise HTTPException(400, "nothing to read")
    require_phase_index(body.phase)

    """
    Kept as a file, the same as an uploaded answer sheet.

    What the client actually said is the evidence behind every answer extracted
    from it, and the typed path used to drop it - only the upload path stored
    anything. So a pasted transcript produced four closed questions and no
    record of the words that closed them.
    """
    material = body.material.strip()
    file_id = await repo.add_file(
        engagement_id=engagement_id,
        phase=body.phase,
        name=body.name,
        size=len(material.encode("utf-8")),
        mime="text/plain",
        kind="answers",
        text=material,
    )
    with agent_runtime.provider_context(body.provider):
        result = await ingest.ingest_answers(
            engagement_id=engagement_id,
            material=material,
            material_name=body.name,
            source_ref=file_id,
        )
    return {"fileId": file_id, **result}


@router.post("/engagements/{engagement_id}/answers/upload")
async def upload_answers(
    engagement_id: str,
    file: UploadFile = File(...),
    phase: int = Form(0),
    provider: Provider = Form("openrouter"),
) -> dict[str, Any]:
    """A filled answer sheet, a transcript or an email thread."""
    await require_unlocked_phase(engagement_id, phase)
    data = await file.read()
    text = ingest.extract_text(file.filename or "upload", data, file.content_type)
    if not text:
        raise HTTPException(400, "could not read that file as text — xlsx, csv, txt, md or vtt")
    file_id = await repo.add_file(
        engagement_id=engagement_id,
        phase=phase,
        name=file.filename or "upload",
        size=len(data),
        mime=file.content_type,
        kind="answers",
        text=text,
    )
    with agent_runtime.provider_context(provider):
        result = await ingest.ingest_answers(
            engagement_id=engagement_id,
            material=text,
            material_name=file.filename or "upload",
            source_ref=file_id,
        )
    return {"fileId": file_id, **result}


# --------------------------------------------------------------------- brain


@router.get("/engagements/{engagement_id}/brain")
async def get_brain(engagement_id: str) -> dict[str, Any]:
    """Where the sprint has got to: what is settled, assumed and still unknown."""
    brain = await repo.current_brain(engagement_id)
    if not brain:
        raise HTTPException(404, "nothing understood yet — run a phase first")
    return brain


class TypedAnswer(BaseModel):
    answer: str


@router.put("/engagements/{engagement_id}/questions/{question_id}/answer")
async def answer_one_question(engagement_id: str, question_id: str, body: TypedAnswer) -> dict[str, Any]:
    """
    Answer one question by hand.

    No model runs. When the consultant types into the box beside a question,
    which question they meant is not in doubt — inferring it from a blob of
    material is what the answer reader is for, and paying for that here would
    be spending a call to learn something already known. An empty body reopens
    the question, so a mistyped answer can be taken back.
    """
    row = await repo.question(engagement_id, question_id)
    if not row:
        raise HTTPException(404, "unknown question")

    answer = body.answer.strip()
    if answer:
        await repo.answer_question(question_id, answer, "consultant")
    else:
        await repo.reopen_question(question_id)
    await repo.touch(engagement_id)
    return {"ok": "true", "answered": bool(answer)}


@router.get("/engagements/{engagement_id}/questions")
async def get_questions(engagement_id: str, only_open: bool = False) -> list[dict[str, Any]]:
    if only_open:
        return await repo.open_questions(engagement_id)
    return await repo.questions_for(engagement_id)
