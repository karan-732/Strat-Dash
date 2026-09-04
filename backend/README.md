# Sprint Console — backend

Python. FastAPI, Turso, and one agent per job. This is where the sprint's
judgement lives; the Next.js console is the surface.

## Running it

```bash
uv sync
cp .env.example .env        # Turso + at least one configured model provider
uv run uvicorn app.main:app --reload --port 8000
```

Migrations run on start. `http://localhost:8000/docs` for the API.

## Model providers

OpenRouter/Claude remains the default. Phase intake and generation accept an
explicit `provider=openrouter|openai` query parameter. Success metrics and
typed answers carry `provider` in their JSON bodies; answer-file uploads use
the same name as a multipart form field. Direct OpenAI calls use the Responses API and
`OPENAI_MODEL` (default `gpt-5.6-luna`). The OpenAI web-search tool is enabled
only for Phase 0 peer discovery; the rest of the workflow continues to use the
sources supplied to the sprint and the existing page reader.

`GET /api/providers` reports provider availability and model labels without
returning credentials. Put keys only in the local `.env`; never send them from
the browser.

## Why agents rather than one call

The brief was that talking to this tool should feel like a Claude *project*, not
Claude chat. A chat takes an upload and answers. A project knows the method. So
each phase is run by agents that hold the method, and a phase is a conversation
rather than a button:

```
INTAKE      what this phase still needs, and what it will assume without it
   ↓        a blocking need stops the run here
SOURCES     the company site and pasted links, read live
   ↓
PACK        the phase output, written against the phase's skill and the brain
   ↓        checked against its own declared shape; missing sections asked for
PEERS       phase 0 only — the parameters that decide the winner, then the
   ↓        peer set scraped and ranked against them
QUESTIONS   what the phase leaves open for the client, and our own next moves
   ↓
BRAIN       the running understanding, rewritten with what just landed
```

| Agent | `app/agents/` | What it is for |
| --- | --- | --- |
| **skills** | `skills.py` | The SOP per phase — what the phase is for, where to press, what it must not do. Every other agent for a phase is handed it. |
| **metrics** | `metrics.py` | Reads the proposal and what the client said they expect, and fixes the destination the whole sprint is measured against. Runs once, at onboarding. |
| **intake** | `intake.py` | The gate in front of a phase. States what it needs, from whom, why, and what it will benchmark if it runs without it. |
| **pack** | `pack.py` | The phase output. Validates against the shape it declared and asks for anything missing rather than returning a stub. |
| **peers** | `peers.py` | Two passes: decide the parameters that decide the winner in this sector and name a real peer set, then read those peers and rank everyone. |
| **questions** | `questions.py` | What to put to the client, generated only where one of four conditions holds — see below. |
| **answers** | `answers.py` | Reads returned material against the open questions, closes what it genuinely answers, and surfaces what contradicts the sprint. |
| **brain** | `brain.py` | The running understanding: what is settled with its evidence, what is assumed with what would settle it, what is unknown and what it blocks. |

## The four conditions for a question

The generator never asks from a checklist. It reads the pack the phase just
produced, the notes typed against it and the inputs that were not supplied, and
emits a question only where one of these holds — recorded on the row:

1. **benchmarked** — a figure is derived rather than reported; the question
   replaces our estimate with their number.
2. **assumption** — a conclusion rests on an assumption; the question tests the
   assumption the conclusion would fail on.
3. **no-owner** — a decision has no owner, and the next phase must route to one.
4. **next-phase-input** — the next phase needs something this phase could not
   produce, raised now so it is not blocked later.

Anything the uploaded transcripts already answer is suppressed and recorded as
covered. If nothing meets a condition, the phase produces no questions — an
empty set is a valid answer.

## The loop

```
run a phase  →  questions come back  →  consultant asks the client
                                              ↓
        brain rewritten  ←  answers ingested  ←  xlsx / transcript / email / typed
                ↓
        next phase's intake reads the new brain
```

`POST /api/engagements/{id}/answers` for typed answers,
`/answers/upload` for a filled sheet, a call transcript or an email thread.
Nothing is marked answered on a guess: a question closes only when the material
contains the answer, and the answer is quoted back so the consultant can see
what it closed on.

## Layout

```
app/
├── main.py              FastAPI, CORS, migrations on start
├── config.py            environment
├── api/routes.py        the HTTP surface
├── agents/              the agents above, plus runtime.py and prompts.json
├── domain/              playbook.json (exported from the TypeScript) and its reader
├── services/
│   ├── pipeline.py      running a phase, stage by stage
│   ├── context.py       everything the sprint holds, in weighing order
│   ├── ingest.py        answers coming back; xlsx/transcript extraction
│   └── scrape.py        live page reads
└── db/
    ├── client.py        Turso over the HTTP pipeline API
    ├── repo.py          reads and writes
    └── migrations/      numbered SQL, applied in order
```

The playbook and the pack prompts are authored in the TypeScript console and
exported here by `bun run scripts/export-playbook.ts`, so the two cannot drift.

## Cost

Every model call is written to `agent_runs` with its tokens and cost. OpenRouter
returns its billed cost; direct OpenAI cost is estimated from the configurable
Luna token rates and any web-search calls reported in the response.
`GET /api/engagements/{id}` returns the running total for that sprint. A full
six-phase run is several dollars — check the balance before a long session.
