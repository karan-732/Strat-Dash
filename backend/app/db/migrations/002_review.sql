-- The evaluation pass's verdict, kept with the pack it judged.
ALTER TABLE phase_packs ADD COLUMN review TEXT;
ALTER TABLE phase_packs ADD COLUMN review_score INTEGER;
-- The evidence ledger the pack was rendered from, so a reported figure can be
-- traced back to the words it came from.
ALTER TABLE phase_packs ADD COLUMN evidence TEXT;
