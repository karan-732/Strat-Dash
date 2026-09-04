-- The intake gate's verdict for a phase, so opening a phase can show what it
-- still needs without paying for another model call every time. `fingerprint`
-- is a digest of everything that would change the answer - the inputs ticked
-- or marked unavailable, the files and links attached, the notes typed, the
-- answers returned and the brain's revision. While it matches, the stored
-- verdict stands. When it moves, the gate runs again.
CREATE TABLE IF NOT EXISTS phase_intake_state (
  engagement_id  TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  phase          INTEGER NOT NULL CHECK (phase BETWEEN 0 AND 5),
  can_run        INTEGER NOT NULL DEFAULT 0,
  confidence     INTEGER NOT NULL DEFAULT 0,
  verdict        TEXT NOT NULL DEFAULT '',
  will_assume    TEXT NOT NULL DEFAULT '[]',   -- json array
  fingerprint    TEXT NOT NULL DEFAULT '',
  created_at     TEXT NOT NULL,
  PRIMARY KEY (engagement_id, phase)
);
