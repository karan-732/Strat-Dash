# Keeping the output the same

From the brief: the same engagement generated twice should not read differently.
A partner comparing two runs of the same client should see the same conclusions,
not a rephrased essay. Here is what was taken from the advice you sent, what was
already in place, and what was rejected.

## Taken

**Temperature 0.** `backend/app/config.py`. Was 0.2. Determinism costs nothing
here because the structure is fixed by the JSON shape and the prose around it is
rendered by the console, not written by the model. Configurable if a phase ever
needs slack.

**Extraction separated from rendering.** The single biggest change, and the one
the advice called the two-step agent. Asking one call to read fifty pages *and*
lay out an eleven-section pack is where figures get invented — the model is
composing structure and recalling facts in the same breath, and under that load
a plausible number is cheaper to produce than a real one.

So `agents/evidence.py` runs first and alone. It reads the live pages, the data
room and the notes and returns a flat ledger: fact, value, unit, period, source,
and the words it was taken from. A fact with no quotable source does not enter
the ledger. The pack agent is then handed the ledger and told that a figure
marked `reported` may be stated as fact, and anything else must be prefixed `~`
with its basis shown. The ledger is stored with the pack, so any reported figure
traces back to a quote in a named document.

**An evaluation function.** The chess analogy is the right one: search proposes,
evaluation scores, and a bad position is discarded rather than played. So the
pack is scored before it is saved — `agents/verify.py`, two passes:

- *deterministic*, in Python, for what code can see: an empty section, a `~`
  figure with no basis anywhere near it, a peer set of one;
- *model*, for what code cannot: a figure stated as fact that the ledger does
  not contain, a conclusion contradicting an earlier phase, an issue asserted
  with no quantity, a recommendation that could have been written for any
  company in the sector.

Violations are reported with the phase and stored on the pack row with a score.
The console shows them rather than hiding them.

**Structural output the backend renders.** Already how it worked, and worth
naming: the model returns JSON only, and every header, label and legal line in
the report is written by the console. That is why two runs differ in figures and
findings but never in layout or phrasing of the frame.

**Pruning before generating.** Also already in place, and exactly alpha-beta's
logic: the intake gate runs *before* the pack and stops a blocking run rather
than spending eight minutes producing something against a hole the consultant
could have filled in five minutes.

## Already in place

| Idea | Where |
| --- | --- |
| JSON schema output, no prose | every agent declares a shape and is told to return only JSON |
| Backend owns formatting | `src/lib/export/report` builds the .docx; the model never writes a header |
| Only company documents | `services/context.py` — the pack reads the sprint's own material; live pages are cited as `[S1]`, `[S2]` |
| Look-ahead before writing | the intake gate, and the brain the pack is handed |

## Not taken

**Mad-libs sentence templates.** Fixing the grammar of every sentence would make
the packs consistent and useless: the value of a phase pack is that it says
something specific about this client. The JSON shape already fixes the
structure, which is the part that should not vary. Template-filling is the right
answer for a one-page summary and the wrong one for a diagnosis.

**Temperature 0.1 for "a little creativity".** Nothing in a sprint pack benefits
from sampling variance. Where judgement is genuinely wanted — the Phase 4
redesign — it comes from the skill and the evidence, not from the sampler.

## What is still not deterministic

Two runs on the same engagement can still differ, honestly:

- **live pages change.** The company site and the peer sites are read at
  generation time. The URLs read are stored on the pack row so a difference can
  be traced.
- **the ledger can differ** if a page was unreachable on one run. The pack then
  says so, and every affected figure carries `~`.
- **truncation recovery.** A pack that runs to the token ceiling is repaired
  back to its last complete element and the missing sections are asked for
  separately, so the second attempt's wording is its own.

The fix for all three is the same and it is already in place: the pack records
what it read, what it was told, and what it had to assume.
