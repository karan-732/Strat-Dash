-- What the answer reader works out, kept.
--
-- It returns four things per submission and only one of them was being saved.
-- The answers landed on phase_questions; the verbatim words behind each one,
-- the half-answers, the findings the client volunteered unasked and the
-- contradictions all reached the brain's prompt and then existed nowhere -- so
-- a page refresh lost them, and a partly-answered question was
-- indistinguishable from one nobody had touched.

-- The words the answer came from. The agent already refuses to mark anything
-- answered without a verbatim quote, so this is evidence that was being thrown
-- away rather than something new to ask for.
ALTER TABLE phase_questions ADD COLUMN answer_quote TEXT;

-- A question the material half answers stays open, but not blank: what came
-- back and what is still missing are what the consultant needs to go back with.
ALTER TABLE phase_questions ADD COLUMN partial_got TEXT;
ALTER TABLE phase_questions ADD COLUMN partial_missing TEXT;
ALTER TABLE phase_questions ADD COLUMN partial_at TEXT;

-- Findings that belong to no question: what the client said that nobody asked,
-- and what it contradicts. Both change a sprint's direction and both were
-- surviving only as sentences inside a brain narrative.
CREATE TABLE IF NOT EXISTS answer_findings (
  id             TEXT PRIMARY KEY,
  engagement_id  TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  kind           TEXT NOT NULL CHECK (kind IN ('unprompted','contradiction')),
  finding        TEXT NOT NULL,
  why            TEXT NOT NULL DEFAULT '',       -- unprompted: why it matters
  contradicts    TEXT NOT NULL DEFAULT '',       -- contradiction: what it disagrees with
  phase          INTEGER,                        -- the phase it bears on, when named
  source_ref     TEXT NOT NULL DEFAULT '',       -- 'consultant' or a room_files id
  created_at     TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS answer_findings_recent
  ON answer_findings(engagement_id, created_at);
