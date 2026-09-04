# Backend — Sprint Console on Turso

**Status: built and running.** The Python service is in `backend/`; see its README for the
agents and how to run it. Migration 001 is applied to the live database and the whole
pipeline has been exercised end to end against a real engagement.

This document is the schema and API reference. What changed between the proposal and the
build is recorded in [§10](#10-what-changed-from-the-proposal); the decisions the proposal
asked for were settled as described there.

The console still reads engagements from browser storage — wiring it to this backend is
the remaining step.

---

## 1. Where the data lives today

| Data | Today | After this change |
| --- | --- | --- |
| Engagements, inputs, steps, deliverable status, drafts, notes, links | `localStorage` (`altrd-strat-console`) | Turso |
| Phase output packs (`visual` … `visual5`) | `localStorage` | Turso, one row per generation run |
| Client questions and "what we do next" | `localStorage` | Turso |
| Research briefs | `localStorage` | Turso |
| Uploaded file **bytes** | in-memory only, lost on reload | object storage — see [§9.3](#93-uploaded-files) |
| Uploaded file **extracted text** | in-memory only | Turso (this is what generation actually reads) |
| Prompts, playbook, phase copy | code (`src/lib/playbook`, `src/lib/ai/prompts`) | unchanged — code, not data |

Two consequences of today's setup that this fixes: a sprint only exists on the laptop that
built it, and a generated pack is lost if the browser storage is cleared.

---

## 2. Why Turso

- SQLite semantics, so the schema below is plain SQL and the whole database can be pulled
  down as a file for inspection or backup.
- Edge replicas keep reads fast from the Next.js route handlers without a connection pool.
- Embedded replicas are an option later if the console is ever packaged as a desktop app.
- JSON1 is available, so an output pack can be stored as a validated JSON document and
  still be queried (`json_extract`) for portfolio roll-ups without shredding it into rows.

Client: `@libsql/client` (`createClient({ url, authToken })`), one module-level singleton in
`src/lib/db/client.ts`, imported only from route handlers and server modules.

---

## 3. Schema

SQL lives in `src/lib/db/migrations/NNN_*.sql`, applied in order. Every table carries
`created_at` / `updated_at` as ISO-8601 text (SQLite has no native timestamp, and text
sorts correctly).

### 3.1 Engagements

```sql
CREATE TABLE engagements (
  id            TEXT PRIMARY KEY,            -- 'p' + random, as today
  slug          TEXT NOT NULL UNIQUE,        -- 'usha-breco-ushabreco', the URL segment
  name          TEXT NOT NULL,
  sector        TEXT NOT NULL DEFAULT 'Sector to confirm',
  url           TEXT NOT NULL DEFAULT '',    -- company site, pasted never uploaded
  notes         TEXT NOT NULL DEFAULT '',    -- carried into every generation
  scope         TEXT NOT NULL
                CHECK (scope IN ('Department-level sprint','Single process-level sprint')),
  opened_on     TEXT NOT NULL,               -- yyyy-mm-dd, shown as "opened"
  archived_at   TEXT,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
CREATE INDEX engagements_active ON engagements(archived_at, updated_at DESC);
```

`scope` is a `CHECK` rather than a lookup table because the two values are also branch
conditions in the prompt builder (`src/lib/ai/context.ts`); adding a third value is a code
change either way.

### 3.2 Success metrics captured up front

Called for in the original notes but never built: read the proposal and the client's stated
expectations, extract the success metrics, and measure every later phase against them.

```sql
CREATE TABLE engagement_metrics (
  id            TEXT PRIMARY KEY,
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  metric        TEXT NOT NULL,               -- 'Order-to-delivery cycle time'
  baseline      TEXT,                        -- as stated, unit included
  target        TEXT,
  horizon       TEXT,                        -- 'by FY27'
  source        TEXT NOT NULL,               -- 'proposal' | 'transcript' | 'consultant'
  source_ref    TEXT,                        -- file id or a quote
  derived       INTEGER NOT NULL DEFAULT 0,  -- 1 when inferred rather than stated
  created_at    TEXT NOT NULL
);
CREATE INDEX engagement_metrics_by_engagement ON engagement_metrics(engagement_id);
```

These get appended to `buildContext()` so every phase pack is written against the
destination the client actually asked for.

### 3.3 Per-phase input checklist and workflow steps

Today these are `Record<'pi:i', true|'na'>` maps. Normalised, the portfolio queries
("how many inputs are outstanding across all engagements") become one statement.

```sql
CREATE TABLE phase_inputs (
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase         INTEGER NOT NULL CHECK (phase BETWEEN 0 AND 5),
  input_index   INTEGER NOT NULL,            -- index into PHASES[phase].inputs
  state         TEXT NOT NULL CHECK (state IN ('received','na')),
  updated_at    TEXT NOT NULL,
  PRIMARY KEY (engagement_id, phase, input_index)
);

CREATE TABLE phase_steps (
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase         INTEGER NOT NULL CHECK (phase BETWEEN 0 AND 5),
  step_index    INTEGER NOT NULL,
  done_at       TEXT NOT NULL,
  PRIMARY KEY (engagement_id, phase, step_index)
);
```

The index is positional against the playbook in code. That is fine as long as the playbook
is append-only per phase; reordering `PHASES[n].inputs` would silently re-point rows, so
the migration note in [§7](#7-migrations) covers it.

### 3.4 Manual notes

```sql
CREATE TABLE phase_notes (
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase         INTEGER NOT NULL CHECK (phase BETWEEN 0 AND 5),
  body          TEXT NOT NULL,
  updated_at    TEXT NOT NULL,
  PRIMARY KEY (engagement_id, phase)
);
```

### 3.5 Source links

```sql
CREATE TABLE source_links (
  id            TEXT PRIMARY KEY,
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  url           TEXT NOT NULL,
  label         TEXT,
  added_at      TEXT NOT NULL,
  last_read_at  TEXT,                        -- last successful live scrape
  last_status   TEXT,                        -- 'ok' | 'unreachable' | http status
  UNIQUE (engagement_id, url)
);
```

`last_read_at` / `last_status` are new: the console currently retries a dead link on every
generation with no record of it. Surfacing "read live 3 minutes ago" next to a link is
worth the two columns.

### 3.6 Data room files

```sql
CREATE TABLE room_files (
  id            TEXT PRIMARY KEY,
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase         INTEGER NOT NULL CHECK (phase BETWEEN 0 AND 5),
  input_index   INTEGER NOT NULL DEFAULT -1, -- -1 = general data room
  name          TEXT NOT NULL,
  size_bytes    INTEGER NOT NULL,
  mime          TEXT,
  storage_key   TEXT,                        -- object-storage key, null if text-only
  extracted_text TEXT,                       -- what generation actually reads
  extracted_at  TEXT,
  uploaded_at   TEXT NOT NULL
);
CREATE INDEX room_files_by_phase ON room_files(engagement_id, phase);
```

`extracted_text` is capped at the same 14 000 characters the console already truncates to.

### 3.7 Deliverables

```sql
CREATE TABLE deliverables (
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase         INTEGER NOT NULL CHECK (phase BETWEEN 0 AND 5),
  doc_number    INTEGER NOT NULL,            -- 1-based, matches PHASES[phase].docs[].n
  status        INTEGER NOT NULL DEFAULT 0
                CHECK (status BETWEEN 0 AND 4),  -- indexes DOC_STATUS
  draft         TEXT NOT NULL DEFAULT '',
  word_count    INTEGER NOT NULL DEFAULT 0,
  generated_at  TEXT,
  reviewed_at   TEXT,
  reviewed_by   TEXT,
  updated_at    TEXT NOT NULL,
  PRIMARY KEY (engagement_id, phase, doc_number)
);
CREATE INDEX deliverables_in_review
  ON deliverables(status, updated_at DESC) WHERE draft <> '';
```

The partial index is what the "needs attention" view runs on — drafts written but not yet
marked reviewed.

### 3.8 Phase output packs

One row per generation run, not per phase, so a regenerate keeps the previous pack. The
console reads the newest non-superseded row.

```sql
CREATE TABLE phase_packs (
  id            TEXT PRIMARY KEY,
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase         INTEGER NOT NULL CHECK (phase BETWEEN 0 AND 5),
  pack          TEXT NOT NULL,               -- JSON, the shape in src/lib/ai/prompts
  schema_version INTEGER NOT NULL DEFAULT 1,
  model         TEXT NOT NULL,
  scope         TEXT NOT NULL,               -- scope the pack was built under
  sources_read  TEXT NOT NULL DEFAULT '[]',  -- JSON array of urls actually scraped
  input_digest  TEXT NOT NULL,               -- sha256 of the prompt context
  duration_ms   INTEGER,
  built_at      TEXT NOT NULL,
  superseded_at TEXT,                        -- set when a newer pack replaces it
  CHECK (json_valid(pack))
);
CREATE INDEX phase_packs_current
  ON phase_packs(engagement_id, phase, built_at DESC) WHERE superseded_at IS NULL;
```

Why the extra columns:

- `scope` — a pack built as a department sprint reads differently from a process sprint.
  Recording it means the console can warn when the scope changed after the pack was built.
- `input_digest` — lets REGENERATE say "nothing has changed since the last build" instead
  of spending a generation.
- `sources_read` — the pack badge claims "BUILT FROM LIVE SOURCES"; this is the evidence.

**Pack validation.** The per-phase render code (`src/features/console/view-model/packs/*`)
currently has type checking switched off because the pack is unvalidated JSON. I propose a
zod schema per phase, mirroring the shape strings in
`src/lib/ai/prompts/generated.ts`, applied on write in the generate route. A pack that
fails validation is stored with `schema_version = 0` and surfaced as a build failure rather
than rendering half a pack. That turns the render code back into typed code.

### 3.9 Client questions and next moves

```sql
CREATE TABLE phase_questions (
  id            TEXT PRIMARY KEY,
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase         INTEGER NOT NULL CHECK (phase BETWEEN 0 AND 5),
  kind          TEXT NOT NULL CHECK (kind IN ('open','covered','next_move')),
  position      INTEGER NOT NULL,            -- display order within kind
  body          TEXT NOT NULL,               -- the question, or the imperative
  why           TEXT NOT NULL DEFAULT '',
  who           TEXT NOT NULL DEFAULT '',    -- role that answers / Altrd role that owns
  priority      TEXT,                        -- High | Medium | Low  (open only)
  horizon       TEXT,                        -- 'Before the next session' (next_move only)
  source        TEXT,                        -- where it was already asked (covered only)
  answered_at   TEXT,                        -- new: close a question when it comes back
  answer        TEXT,
  built_at      TEXT NOT NULL
);
CREATE INDEX phase_questions_by_phase ON phase_questions(engagement_id, phase, kind, position);
```

`answered_at` / `answer` are new. Right now a question is regenerated as still-open every
time because nothing records that the client answered it. Storing the answer lets it flow
into `buildContext()` as evidence instead of being re-asked.

### 3.10 Research library

```sql
CREATE TABLE research_briefs (
  id            TEXT PRIMARY KEY,
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase         INTEGER,                     -- phase it was run from, nullable
  query         TEXT NOT NULL,
  body_md       TEXT NOT NULL,
  sources       TEXT NOT NULL DEFAULT '[]',  -- JSON [{u, ok}]
  in_context    INTEGER NOT NULL DEFAULT 1,  -- the IN CONTEXT / NOT IN CONTEXT toggle
  model         TEXT NOT NULL,
  created_at    TEXT NOT NULL,
  CHECK (json_valid(sources))
);
CREATE INDEX research_by_engagement ON research_briefs(engagement_id, created_at DESC);
```

### 3.11 Generation runs (audit)

```sql
CREATE TABLE generation_runs (
  id            TEXT PRIMARY KEY,
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase         INTEGER,
  kind          TEXT NOT NULL,               -- 'pack' | 'peer_rank' | 'questions'
                                             -- | 'deliverable' | 'research'
  status        TEXT NOT NULL,               -- 'running' | 'ok' | 'error'
  model         TEXT NOT NULL,
  input_tokens  INTEGER,
  output_tokens INTEGER,
  error         TEXT,
  started_at    TEXT NOT NULL,
  finished_at   TEXT
);
CREATE INDEX generation_runs_recent ON generation_runs(engagement_id, started_at DESC);
```

This is what makes cost per sprint answerable, and it is where a stuck build shows up.

---

## 4. API surface

All under `src/app/api`. Everything returns JSON; errors are
`{ error: string }` with a real status code.

### 4.1 Engagements

| Method | Route | Body / query | Returns |
| --- | --- | --- | --- |
| `GET` | `/api/engagements` | `?q=&archived=` | list with roll-ups (`sprintPct`, phase pcts, counts) |
| `POST` | `/api/engagements` | `{ name, sector, url, notes, scope }` | the created engagement |
| `GET` | `/api/engagements/[id]` | — | the full engagement the console renders from |
| `PATCH` | `/api/engagements/[id]` | any of `name, sector, url, notes, scope` | updated engagement |
| `DELETE` | `/api/engagements/[id]` | — | archives (sets `archived_at`); hard delete is admin-only |

`GET /api/engagements/[id]` returns the whole aggregate — engagement, inputs, steps, notes,
links, files (metadata + extracted text), deliverables, current packs, questions, research.
One round trip, because the console needs all of it to render a phase.

### 4.2 Phase state

| Method | Route | Body | Notes |
| --- | --- | --- | --- |
| `PUT` | `/api/engagements/[id]/phases/[phase]/inputs/[index]` | `{ state: 'received' \| 'na' \| null }` | `null` clears the row |
| `PUT` | `/api/engagements/[id]/phases/[phase]/steps/[index]` | `{ done: boolean }` | |
| `PUT` | `/api/engagements/[id]/phases/[phase]/notes` | `{ body: string }` | the manual notes box |
| `POST` | `/api/engagements/[id]/links` | `{ url, label? }` | |
| `DELETE` | `/api/engagements/[id]/links/[linkId]` | — | |

### 4.3 Data room

| Method | Route | Notes |
| --- | --- | --- |
| `POST` | `/api/engagements/[id]/files` | multipart; stores bytes, extracts text, returns metadata |
| `GET` | `/api/engagements/[id]/files/[fileId]` | streams the file back (needs object storage) |
| `DELETE` | `/api/engagements/[id]/files/[fileId]` | |

### 4.4 Generation — already built, changes shape

These three routes exist today and take the engagement in the request body, because the
engagement only lives in the browser. Once the tables above are in place they take ids and
the server reads its own copy:

| Now | After |
| --- | --- |
| `POST /api/phases/[phase]/generate` `{ engagement }` | `POST /api/engagements/[id]/phases/[phase]/generate` `{}` |
| `POST /api/phases/[phase]/deliverables/[doc]` `{ engagement }` | `POST /api/engagements/[id]/phases/[phase]/deliverables/[doc]` `{}` |
| `POST /api/research` `{ engagement, … }` | `POST /api/engagements/[id]/research` `{ query, urls, live, includeRoom, includeBenchmarks }` |

The generate route keeps its NDJSON stream (`{type:'stage'}` … `{type:'done'}`) so the
generation ladder in the UI stays live. It also gains:

- `409` when the phase is locked, `409` when a build for that phase is already running
  (checked against `generation_runs`),
- an idempotency check against `input_digest` — same inputs, no new spend, unless
  `?force=1`.

New alongside them:

| Method | Route | Notes |
| --- | --- | --- |
| `DELETE` | `/api/engagements/[id]/phases/[phase]/pack` | the RESET button; marks packs superseded |
| `PATCH` | `/api/engagements/[id]/phases/[phase]/questions/[qid]` | record an answer |
| `PUT` | `/api/engagements/[id]/phases/[phase]/deliverables/[doc]` | save an edited draft / set status |

### 4.5 Exports

Today every export is built in the browser. Moving them server-side means one
implementation for the console and for anything scheduled later:

| Method | Route | Returns |
| --- | --- | --- |
| `GET` | `/api/engagements/[id]/exports/blueprint` | the six-phase blueprint, `.doc` |
| `GET` | `/api/engagements/[id]/phases/[phase]/exports/report` | phase full report, `.doc` |
| `GET` | `/api/engagements/[id]/exports/state` | the engagement as JSON |
| `GET` | `/api/exports/portfolio` | the portfolio JSON the dashboard EXPORT button writes |

---

## 5. Server layout

```
src/lib/db/
  client.ts                 libSQL singleton
  migrations/               001_init.sql, 002_…  (applied in order)
  migrate.ts                runner, invoked by `npm run db:push`
  schema.ts                 row types, one per table
  repositories/
    engagements.ts          load/save the aggregate, roll-ups for the dashboard
    phase-state.ts          inputs, steps, notes, links
    files.ts                metadata + extracted text
    deliverables.ts         status ladder and drafts
    packs.ts                current pack per phase, supersede on regenerate
    questions.ts            open / covered / next moves
    research.ts
    runs.ts                 generation audit
  mappers.ts                rows  <->  the Engagement shape the UI renders from
```

`mappers.ts` is the seam that matters: the UI's `Engagement` type
(`src/lib/domain/types.ts`) stays exactly as it is, and the mapper assembles it from rows.
Nothing in the component tree or the view model changes when this lands.

---

## 6. Repository interface, so the swap is one line

```ts
// src/lib/db/repositories/index.ts
export interface EngagementRepository {
  list(opts?: { q?: string; archived?: boolean }): Promise<EngagementSummary[]>;
  get(id: string): Promise<Engagement | null>;
  create(input: NewEngagement): Promise<Engagement>;
  patch(id: string, input: Partial<NewEngagement>): Promise<Engagement>;
  archive(id: string): Promise<void>;
  // …phase state, packs, questions, research
}
```

Route handlers depend on the interface. That keeps the Turso client out of the handlers and
makes an in-memory repository usable for tests.

---

## 7. Migrations

- Plain `.sql` files, numbered, applied in order, tracked in a `_migrations` table.
- `npm run db:push` runs them against `TURSO_DATABASE_URL`.
- **Playbook coupling:** `phase_inputs.input_index` and `phase_steps.step_index` point at
  positions in `src/lib/playbook/phases.ts`. Appending to a phase's `inputs` or `steps` is
  safe; inserting or reordering is not, and needs a data migration alongside the code
  change. Worth a comment at the top of `phases.ts` once this lands.
- The first migration ships with a one-off importer that takes the JSON the console
  currently keeps in `localStorage` (the EXPORT button already emits it) so existing
  sprints move over rather than being retyped.

---

## 8. Environment

```
TURSO_DATABASE_URL=libsql://<db>-<org>.turso.io
TURSO_AUTH_TOKEN=…
ANTHROPIC_API_KEY=…
ANTHROPIC_MODEL=claude-sonnet-5
SCRAPE_READER_BASE=https://r.jina.ai/
```

`.env.example` in the repo already lists these. The Anthropic key is read only in
`src/lib/ai/anthropic.ts`, which is `server-only`, so it cannot leak into a client bundle.

---

## 9. Decisions, as settled

### 9.1 Who can see what — **single shared workspace**

Settled from the brief: "in the end, this is our internal tool." No `users` table, no row
filtering, no auth. Everyone at Altrd sees every sprint.

The cost of changing this later is one migration adding `owner_id` and a filter in
`repo.list_engagements`, so it is not a trap — but it is a rewrite of every query if the
console is ever pointed at clients.

### 9.2 Do we keep pack history

The schema keeps every generation run (`superseded_at` rather than an update in place).
That is a few KB per pack and makes "what changed when we regenerated" answerable. If you
would rather have one row per phase and overwrite it, say so and I will drop
`superseded_at` and the partial index.

### 9.3 Uploaded files

Turso is not the place for file bytes. Three options:

1. **Metadata + extracted text only** (no `storage_key`). Uploads are read once for their
   text and the bytes are dropped. Cheapest; the DOWNLOAD button on a data-room file goes
   away for anything uploaded in an earlier session — which is already the behaviour today.
2. **Cloudflare R2 / S3** for bytes, key in `storage_key`. DOWNLOAD works forever.
3. **Turso blobs** — possible up to a few MB, not recommended for ERP exports and
   screen recordings.

My recommendation: **(2)** if the data room is meant to be the record of the engagement,
**(1)** if the console is only ever a working surface. Your call — it is one column either
way, so this is not blocking.

### 9.4 Success metrics

`engagement_metrics` ([§3.2](#32-success-metrics-captured-up-front)) is in the schema
because your notes called for it, but nothing extracts them yet. Should the Phase 0 build
also read the proposal and the transcripts and fill this table, or is that a separate step
you want to trigger during onboarding?

### 9.5 Where generation runs — **measured**

A phase runs in **7–10 minutes**, not the 60–180 seconds estimated. Phase 0 with peer
ranking measured 430s, 450s and 583s across three runs. That is six model calls plus live
page reads for the company and up to six peers.

Consequences:
- The generate route streams NDJSON, so the console shows progress rather than hanging.
- This will not run inside a serverless function with a request timeout. The Python
  service wants a long-lived process — a small VM or a container. If it ever needs to go
  serverless, generation moves to a queue and the console polls.

---

## 10. What is deliberately not in scope here

- Prompts, phase copy and the playbook stay in code. They are versioned with the app, not
  edited at runtime.
- The phase output pack rendering is finished and wired; only its **generation logic** is
  open, and you said you would specify that separately.
- No caching layer. Reads are single-engagement and small; add one when there is a measured
  reason.


---

## 10. What changed from the proposal

| Proposed | Built | Why |
| --- | --- | --- |
| Generation in TypeScript route handlers | Python service in `backend/` | Asked for directly. The agents, the prompts and the sprint's judgement now live in one place. |
| Anthropic API directly | **OpenRouter** (`anthropic/claude-sonnet-5`) | The key supplied is an OpenRouter key. Swapping models is a config change. |
| — | **`sprint_brain`** | Not in the proposal. The brief described a running understanding that is rewritten whenever something lands and read by every later agent — the sprint stops re-deriving what it already knows. |
| — | **`phase_intake`** | Not in the proposal. A phase now states what it needs *before* it runs, rather than producing a thin pack and being asked about it afterwards. |
| — | **`engagements.brief`** and `success_metrics.is_primary` | The destination has to be one metric; the brief is the sprint in the consultant's own words, extracted at onboarding. |
| Questions stored flat | `phase_questions.condition` | Records which of the four generation conditions produced each question, so the set can be audited. |
| `generation_runs` | `agent_runs` | One row per agent call, not per phase — cost and failures are attributable to a specific agent. |
| Answers as a `PATCH` on one question | **`/answers` and `/answers/upload`** | The consultant comes back with a spreadsheet, a transcript or an email, not a form. The agent maps the material onto the open questions itself and quotes what it closed each one on. |

### Still open

- **Uploaded file bytes.** `room_files` holds metadata and extracted text; the bytes are
  not stored. Decide R2/S3 if the data room has to be the record of the engagement
  ([§9.3](#93-uploaded-files)).
- **Pack validation with zod/pydantic schemas.** The pack agent now checks a result
  against the top-level sections its own shape declares and asks for anything missing,
  which was the failure that mattered — a truncated pack used to be saved as a stub. Full
  per-field validation is still worth doing.
- **Wiring the console to this backend.** The UI still reads from browser storage.


## Removing an engagement

`DELETE /api/engagements/{id}` archives it: `archived_at` is stamped and the row stops
being listed, loaded or counted. Nothing is destroyed.

That is deliberate. A generated sprint holds phase packs that cost real money to
produce, an evidence ledger, the questions put to the client, the running brain and the
`agent_runs` rows every spend figure is computed from. A mis-click on a dashboard should
not be able to take any of that with it, and the schema carried `archived_at` from the
first migration for exactly this.

The console offers no way back, so to restore one:

```sql
UPDATE engagements SET archived_at = NULL WHERE id = 'p290eb2b4';
```

To purge one permanently — every child table cascades from `engagements(id)`, so this
takes the packs, questions, brain and run history with it:

```sql
DELETE FROM engagements WHERE id = 'p290eb2b4';
```
