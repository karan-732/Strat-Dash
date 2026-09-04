-- Preserve the complete intake verdict when it is served from cache. These
-- two fields tell the consultant that evidence already exists and where it
-- was found; dropping them made a cached visit look like a new request.
ALTER TABLE phase_intake ADD COLUMN have_already INTEGER NOT NULL DEFAULT 0;
ALTER TABLE phase_intake ADD COLUMN where_from TEXT NOT NULL DEFAULT '';
