-- Sprint Console — initial schema.
-- Single shared workspace: the console is an internal Altrd tool, so there is
-- no per-user ownership. Add an owner column here if that ever changes.

CREATE TABLE IF NOT EXISTS engagements (
  id            TEXT PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  sector        TEXT NOT NULL DEFAULT 'Sector to confirm',
  url           TEXT NOT NULL DEFAULT '',
  notes         TEXT NOT NULL DEFAULT '',
  scope         TEXT NOT NULL CHECK (scope IN ('Department-level sprint','Single process-level sprint')),
  -- one paragraph, in the consultant's words: what this sprint is and what it must achieve
  brief         TEXT NOT NULL DEFAULT '',
  opened_on     TEXT NOT NULL,
  archived_at   TEXT,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS engagements_active ON engagements(archived_at, updated_at DESC);

-- The destination, captured before any phase runs, from the proposal and what
-- the client said they expect. Every later phase is measured against these.
CREATE TABLE IF NOT EXISTS success_metrics (
  id            TEXT PRIMARY KEY,
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  metric        TEXT NOT NULL,
  baseline      TEXT,
  target        TEXT,
  horizon       TEXT,
  is_primary    INTEGER NOT NULL DEFAULT 0,
  source        TEXT NOT NULL,               -- proposal | transcript | consultant
  source_ref    TEXT,
  derived       INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS success_metrics_by_engagement ON success_metrics(engagement_id, is_primary DESC);

CREATE TABLE IF NOT EXISTS phase_inputs (
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase         INTEGER NOT NULL CHECK (phase BETWEEN 0 AND 5),
  input_index   INTEGER NOT NULL,
  state         TEXT NOT NULL CHECK (state IN ('received','na')),
  updated_at    TEXT NOT NULL,
  PRIMARY KEY (engagement_id, phase, input_index)
);

CREATE TABLE IF NOT EXISTS phase_steps (
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase         INTEGER NOT NULL CHECK (phase BETWEEN 0 AND 5),
  step_index    INTEGER NOT NULL,
  done_at       TEXT NOT NULL,
  PRIMARY KEY (engagement_id, phase, step_index)
);

-- Who the playbook asks for, and who was actually in the room.
CREATE TABLE IF NOT EXISTS phase_attendance (
  engagement_id     TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase             INTEGER NOT NULL CHECK (phase BETWEEN 0 AND 5),
  participant_index INTEGER NOT NULL,
  present_at        TEXT NOT NULL,
  PRIMARY KEY (engagement_id, phase, participant_index)
);

CREATE TABLE IF NOT EXISTS phase_notes (
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase         INTEGER NOT NULL CHECK (phase BETWEEN 0 AND 5),
  body          TEXT NOT NULL,
  updated_at    TEXT NOT NULL,
  PRIMARY KEY (engagement_id, phase)
);

CREATE TABLE IF NOT EXISTS source_links (
  id            TEXT PRIMARY KEY,
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  url           TEXT NOT NULL,
  label         TEXT,
  added_at      TEXT NOT NULL,
  last_read_at  TEXT,
  last_status   TEXT,
  UNIQUE (engagement_id, url)
);

CREATE TABLE IF NOT EXISTS room_files (
  id             TEXT PRIMARY KEY,
  engagement_id  TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase          INTEGER NOT NULL CHECK (phase BETWEEN 0 AND 5),
  input_index    INTEGER NOT NULL DEFAULT -1,
  name           TEXT NOT NULL,
  size_bytes     INTEGER NOT NULL,
  mime           TEXT,
  kind           TEXT NOT NULL DEFAULT 'document',  -- transcript | answers | document
  extracted_text TEXT,
  extracted_at   TEXT,
  uploaded_at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS room_files_by_phase ON room_files(engagement_id, phase);

CREATE TABLE IF NOT EXISTS deliverables (
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase         INTEGER NOT NULL CHECK (phase BETWEEN 0 AND 5),
  doc_number    INTEGER NOT NULL,
  status        INTEGER NOT NULL DEFAULT 0 CHECK (status BETWEEN 0 AND 4),
  draft         TEXT NOT NULL DEFAULT '',
  word_count    INTEGER NOT NULL DEFAULT 0,
  generated_at  TEXT,
  reviewed_at   TEXT,
  updated_at    TEXT NOT NULL,
  PRIMARY KEY (engagement_id, phase, doc_number)
);
CREATE INDEX IF NOT EXISTS deliverables_in_review ON deliverables(status, updated_at DESC);

-- One row per generation run, so a regenerate keeps what came before.
CREATE TABLE IF NOT EXISTS phase_packs (
  id             TEXT PRIMARY KEY,
  engagement_id  TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase          INTEGER NOT NULL CHECK (phase BETWEEN 0 AND 5),
  pack           TEXT NOT NULL,
  schema_version INTEGER NOT NULL DEFAULT 1,
  model          TEXT NOT NULL,
  scope          TEXT NOT NULL,
  sources_read   TEXT NOT NULL DEFAULT '[]',
  input_digest   TEXT NOT NULL,
  duration_ms    INTEGER,
  built_at       TEXT NOT NULL,
  superseded_at  TEXT,
  CHECK (json_valid(pack))
);
CREATE INDEX IF NOT EXISTS phase_packs_current ON phase_packs(engagement_id, phase, built_at DESC);

-- The cumulative understanding, rewritten after every phase and every answer.
-- This is the "larger brain" the sprint carries forward.
CREATE TABLE IF NOT EXISTS sprint_brain (
  id             TEXT PRIMARY KEY,
  engagement_id  TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  version        INTEGER NOT NULL,
  -- what triggered this revision
  reason         TEXT NOT NULL,               -- phase_built | answers_ingested | onboarding
  phase          INTEGER,
  understood     TEXT NOT NULL DEFAULT '[]',  -- settled, with the evidence
  assumed        TEXT NOT NULL DEFAULT '[]',  -- believed but unproven, with what would settle it
  unknown        TEXT NOT NULL DEFAULT '[]',  -- named holes
  confidence     INTEGER NOT NULL DEFAULT 0,  -- 0-100, how much of the sprint is evidenced
  narrative      TEXT NOT NULL DEFAULT '',    -- "this is what I understand so far"
  created_at     TEXT NOT NULL,
  CHECK (json_valid(understood) AND json_valid(assumed) AND json_valid(unknown))
);
CREATE INDEX IF NOT EXISTS sprint_brain_current ON sprint_brain(engagement_id, version DESC);

-- What a phase needs before it can run, produced by the intake agent.
CREATE TABLE IF NOT EXISTS phase_intake (
  id             TEXT PRIMARY KEY,
  engagement_id  TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase          INTEGER NOT NULL CHECK (phase BETWEEN 0 AND 5),
  position       INTEGER NOT NULL,
  ask            TEXT NOT NULL,               -- what the agent needs
  why            TEXT NOT NULL DEFAULT '',    -- what it unblocks
  who            TEXT NOT NULL DEFAULT '',
  severity       TEXT NOT NULL DEFAULT 'needed',  -- blocking | needed | nice
  satisfied_at   TEXT,
  satisfied_by   TEXT,                        -- file id, or 'consultant'
  created_at     TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS phase_intake_open ON phase_intake(engagement_id, phase, satisfied_at);

-- Questions put to the client after a phase, and our own next moves.
CREATE TABLE IF NOT EXISTS phase_questions (
  id             TEXT PRIMARY KEY,
  engagement_id  TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase          INTEGER NOT NULL CHECK (phase BETWEEN 0 AND 5),
  kind           TEXT NOT NULL CHECK (kind IN ('open','covered','next_move')),
  position       INTEGER NOT NULL,
  body           TEXT NOT NULL,
  why            TEXT NOT NULL DEFAULT '',
  who            TEXT NOT NULL DEFAULT '',
  priority       TEXT,
  horizon        TEXT,
  source         TEXT,
  -- which of the four generation conditions produced it
  condition      TEXT,
  answered_at    TEXT,
  answer         TEXT,
  answer_source  TEXT,
  built_at       TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS phase_questions_by_phase ON phase_questions(engagement_id, phase, kind, position);
CREATE INDEX IF NOT EXISTS phase_questions_open ON phase_questions(engagement_id, answered_at);

CREATE TABLE IF NOT EXISTS research_briefs (
  id            TEXT PRIMARY KEY,
  engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase         INTEGER,
  query         TEXT NOT NULL,
  body_md       TEXT NOT NULL,
  sources       TEXT NOT NULL DEFAULT '[]',
  in_context    INTEGER NOT NULL DEFAULT 1,
  model         TEXT NOT NULL,
  created_at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS research_by_engagement ON research_briefs(engagement_id, created_at DESC);

-- Altrd's reusable knowledge asset, the playbook's second deliverable.
CREATE TABLE IF NOT EXISTS library_entries (
  id            TEXT PRIMARY KEY,
  kind          TEXT NOT NULL CHECK (kind IN ('value-tree','benchmark','process-pattern','commercial')),
  title         TEXT NOT NULL,
  sector        TEXT NOT NULL,
  engagement_id TEXT REFERENCES engagements(id) ON DELETE SET NULL,
  engagement_name TEXT NOT NULL DEFAULT '',
  phase         INTEGER,
  summary       TEXT NOT NULL DEFAULT '[]',
  payload       TEXT NOT NULL,
  captured_at   TEXT NOT NULL,
  CHECK (json_valid(payload))
);
CREATE INDEX IF NOT EXISTS library_by_kind ON library_entries(kind, captured_at DESC);

-- Every model call, so cost per sprint is answerable and a stuck run is visible.
CREATE TABLE IF NOT EXISTS agent_runs (
  id            TEXT PRIMARY KEY,
  engagement_id TEXT REFERENCES engagements(id) ON DELETE CASCADE,
  phase         INTEGER,
  agent         TEXT NOT NULL,
  status        TEXT NOT NULL,
  model         TEXT NOT NULL,
  prompt_tokens INTEGER,
  output_tokens INTEGER,
  cost_usd      REAL,
  error         TEXT,
  started_at    TEXT NOT NULL,
  finished_at   TEXT
);
CREATE INDEX IF NOT EXISTS agent_runs_recent ON agent_runs(engagement_id, started_at DESC);
