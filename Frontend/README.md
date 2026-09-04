# Sprint Console

The Altrd Strategy Sprint console, rebuilt in Next.js from the single-file
`Sprint Console.dc.html` prototype. Same UI, same phase copy, same generation prompts —
now a routed app with a server-side generation pipeline.

Six phases, each with its own inputs and its own generated output pack:

| Phase | | |
| --- | --- | --- |
| 0 | Outside-In View | Arrive already understanding the industry |
| 1 | Leadership Alignment | Reconcile our view with management's |
| 2 | Functional Value Diagnosis | Replace anecdote with numbers |
| 3 | Process Intelligence | Understand the work as it is actually done |
| 4 | AI-Native Redesign | Rebuild the process from first principles |
| 5 | Business Case & Portfolio | Turn design into an investment decision |

## Running it

```bash
bun install
cp .env.example .env.local     # add ANTHROPIC_API_KEY to generate
bun run dev                    # http://localhost:3000
```

| Script | |
| --- | --- |
| `bun dev` | dev server |
| `bun run build` | production build |
| `bun run lint` | eslint |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run verify:report` | drives DOWNLOAD FULL REPORT in Chrome and checks the .docx |
| `bun run verify:flow` | drives onboarding → intake → persistence → outputs in Chrome against a live backend |

## Routes

| Route | |
| --- | --- |
| `/dashboard` | portfolio: KPIs, engagement cards, progress by engagement and by phase |
| `/attention` | what is blocked, in review or waiting on inputs |
| `/engagements/[name-id]` | engagement overview — the six-phase sprint journey |
| `/engagements/[name-id]/[n-phase-title]` | one phase: INPUTS and OUTPUTS |
| `/library` | Altrd's reusable knowledge assets, kept out of finished phases |
| `/pack-preview?phase=N` | dev harness: renders any phase's output pack from the demo fixture |

## Where things are

`docs/ARCHITECTURE.md` — the full layout, the three generated trees and how data flows
from the URL through the store and the view model into the component tree.

`backend/README.md` — the agents, the four conditions a question must meet, and
the loop that takes the client's answers back in.

`docs/DETERMINISM.md` — what was done so two runs of the same engagement read
the same, and what still is not deterministic.

`docs/PLAYBOOK-ALIGNMENT.md` — what the console implements from
`Altrd_Strategy_Sprint_Playbook.pdf`, what was corrected against it, and where it
deliberately differs.

`docs/BACKEND.md` — **the Turso schema and API proposal, awaiting approval.** Engagements
currently live in browser storage; that document is the plan for moving them server-side,
and it ends with the decisions that need your call.

## The two seeded engagements

The console opens with two, both from `src/features/console/fixtures/demo`:

| | |
| --- | --- |
| **Usha Breco** — ropeways and material handling | a sprint run end to end. All six phases generated, every output card populated in the shape the model returns, inputs received (a few marked not available), workflow steps closed, deliverables delivered, and the questions and next moves each phase left behind. |
| **Titagarh** — rail rolling stock | onboarded, nothing run. Phase 0 open, phases 1–5 locked behind it. |

They are fixtures, not data — delete the import in `src/store/console-store.ts` once
engagements are persisted.

## State of play

Built and working: every view, all six phase output packs card for card, the input
checklists and data room, deliverable drafting and status, the questions a phase
leaves for the client — raised on its OUTPUTS, worked on the next phase's INPUTS —
and the "what we do next" blocks, the `.doc` and `.md` exports, the blueprint assembly, the full
phase report as a `.docx` (cover page, executive summary, every generated view as a
captioned image, the deliverables, then questions and next moves), light and dark themes,
and the server-side generation pipeline (pack → peer ranking → questions) streaming its
stages back to the generation ladder.

The console shows exactly what the source template shows — nothing added, nothing left
out. The source is vendored at `source/Sprint Console.dc.html` and `bun run port`
regenerates the whole tree from it; see `docs/ARCHITECTURE.md`. Outputs that used to
appear in two phases now appear once, de-duplicated upstream in the template itself.

Checked against the playbook and corrected where it had drifted — see
`docs/PLAYBOOK-ALIGNMENT.md`.

The back-and-forth runs through the channels the template already has rather than panels
of its own: what a phase still needs before it will run is listed with the questions for
the client, and material coming back arrives through the manual-entry box on the INPUTS
tab, which reads it against the open questions and revises the running brain.

What a phase costs and what was done about it is in `docs/COST.md`.

Everything is now server-side: engagements, packs, questions, the evidence ledger and the
running brain all live in Turso, and the console reads and writes through the Python API.

Not yet wired to the backend: deliverable drafting and the research desk (the phase packs
are). File bytes are not stored — metadata and extracted text are.
