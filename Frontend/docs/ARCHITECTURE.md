# Architecture — how the port is laid out

The console was a single 5 600-line `Sprint Console.dc.html`: one `<style>` block, one
mustache-style template and one `Component` class holding state, the generation pipeline
and a 1 500-line `renderVals()` derivation. This is where each of those went.

```
src/
├── app/                                  routes only — no logic
│   ├── layout.tsx                        html/body, font link, data-theme
│   ├── page.tsx                          → /dashboard
│   ├── (console)/
│   │   ├── dashboard/page.tsx
│   │   ├── attention/page.tsx
│   │   └── engagements/[engagement]/
│   │       ├── page.tsx                  engagement overview
│   │       └── [phase]/page.tsx          one phase workspace
│   │   └── library/page.tsx              Altrd's reusable knowledge assets
│   ├── (dev)/pack-preview/page.tsx       fixture harness for the output cards
│   └── api/
│       ├── phases/[phase]/generate/              NDJSON stream: stages → pack
│       ├── phases/[phase]/deliverables/[doc]/    one deliverable draft
│       └── research/                             a research brief
│
├── components/                           GENERATED from the source template
│   ├── ConsoleShell.tsx                  the app-root, composes the views
│   ├── layout/Sidebar.tsx
│   ├── dashboard/DashboardView.tsx
│   ├── attention/AttentionView.tsx
│   ├── engagement/                       header, overview, workspace, nav, hero, tabs
│   ├── phase/
│   │   ├── inputs/PhaseInputs.tsx        url, links, notes, data room, generate CTA
│   │   └── output/                       ← the phase output experience
│   │       ├── PhaseOutput.tsx
│   │       ├── OutputStatus.tsx          header, generation ladder, empty state
│   │       ├── DeliverableList.tsx
│   │       ├── ClientQuestions.tsx
│   │       ├── NextMoves.tsx
│   │       └── phase0…phase5/
│   │           ├── PhaseNPack.tsx        the pack's own layout
│   │           └── cards/CardNN….tsx     one component per numbered card
│   ├── modals/                           new engagement, document preview
│   └── feedback/Toast.tsx
│
├── features/console/
│   ├── Console.tsx                       route → store → view model → tree
│   ├── ConsoleSurface.tsx                the tree plus DOM behaviour that measures layout
│   ├── components/                       LibraryView — the one hand-written view
│   ├── hooks/                            use-route-sync, use-console-nav, use-theme,
│   │                                     use-plot-labels
│   ├── fixtures/                         hand-written packs for /pack-preview
│   └── view-model/
│       ├── index.ts                      assembles the object the tree renders from
│       ├── deps.ts                       route, store, nav, theme, settings
│       ├── portfolio.ts                  dashboard, sidebar list, needs-attention
│       ├── phase-nav.ts                  the six phase cards, the workspace rail
│       ├── phase-inputs.ts               checklist, workflow, deliverables, room
│       ├── phase-output.ts               pack header, ladder, questions, next moves
│       ├── output-copy.ts                per-phase framing copy
│       ├── disclosure.ts                 eye-button popovers, scroll reset
│       └── packs/                        GENERATED per-phase pack derivations
│
├── lib/
│   ├── playbook/                         the six phases, step kinds, status ladder
│   ├── domain/                           types, progress, gating, formatting, slugs
│   ├── ai/                               anthropic client, json repair, scrape,
│   │   └── prompts/                      context builder, prompt builders, generated.ts
│   ├── markdown/                         preview blocks, md → html
│   ├── export/                           .doc wrappers, blueprint, questions block
│   ├── api/                              client fetchers + request/response contracts
│   └── browser/                          download helpers
│
├── store/console-store.ts                zustand: engagements + transient UI + actions
└── styles/                               the original stylesheet, split by concern
```

## The three generated trees

Four parts of this repo are produced by scripts and should be regenerated rather than
hand-edited. Each carries a header saying so. The source they are generated from is
vendored at `source/Sprint Console.dc.html`, so a regeneration needs nothing outside
the repo.

| Output | Script | What it does |
| --- | --- | --- |
| `src/components/**` | `scripts/dc-to-jsx.mjs` | template → JSX: `class`→`className`, inline CSS → style objects, `sc-if`/`sc-for` → JSX control flow, `style-hover` → generated `.hv-N:hover` rules in `src/styles/hover.css`. Splits the tree into one file per view, per pack and per numbered card, and applies the editorial tables described below. |
| `src/features/console/view-model/packs/**` | `scripts/extract-view-model.mjs` | lifts the per-phase pack derivations out of `renderVals()` verbatim and wraps each as a module. |
| `src/lib/ai/prompts/generated.ts` | `scripts/extract-prompts.mjs` | extracts every shape, system prompt and playbook brief byte-identically. |
| `backend/app/{agents/prompts,domain/playbook}.json` | `scripts/export-playbook.ts` | re-exports the above as JSON so the Python agents and the console cannot drift. |

Taking a newer export of the source console:

```bash
bun run port:unbundle "~/Downloads/Sprint Console.html" "source/Sprint Console.dc.html"
bun run port                 # jsx → view model → prompts → playbook
```

The design tool exports a self-extracting "bundled page" — a loader plus the real
template as a JSON payload. `port:unbundle` pulls the template back out; it passes a
plain template through untouched, so either export shape is a valid input.

Nothing in the three extractors keys off a line number. An export shifts every offset
in the file, so each locates what it needs by anchor instead — the enclosing method
name for a prompt, `let visN = null;` for a pack derivation, the `renderVals()` header
for the block that holds them. `dc-to-jsx` also clears its output directory first, so a
card the source renumbered or removed cannot survive as an orphan that nothing imports.

`dc-to-jsx` writes `hover.css` into its output directory; move it to `src/styles/hover.css`.

### Hand-written components, and how they reach the tree

Nothing under `src/components` is hand-written — every file there carries a generated
header, and `dc-to-jsx` wipes the directory before each run. A hand-written component
kept there does not survive: an earlier copy of `GenerationProviderSwitch` lived in
`src/components/layout/` and was destroyed by exactly that.

Hand-written components live in `src/features/console/components/` and reach the tree
one of two ways:

| Table | What it does |
| --- | --- |
| `SLOT_INJECTIONS` | renders a component inside a matched element, first child or last. `GenerationProviderSwitch` into the app header and the engagement actions row; `PeerRankingSources` at the foot of phase 0's peer ranking card; `PortfolioCardRemove` at the foot of each dashboard card. |
| `REPLACEMENTS` | takes over a matched node entirely — the subtree is never generated. `Toast` replaces the template's `{{#toast}}` block; `ClientQuestions` replaces the question list the template repeated on a phase's OUTPUTS, keeping the count and the send-to-client actions there and leaving the list itself on the next phase's INPUTS, where the answers land. |

`ASSETS` maps the bundler's asset uuids back to real paths, so `src="73ad6bee-…"` on the
logo becomes `/altrd-logo.png` instead of a 404.

A regeneration is idempotent: running `bun run port:jsx` twice produces byte-identical
output, which is the check that no hand-edit has crept back in.

### Editorial decisions the codemod applies

These live as tables at the top of `scripts/dc-to-jsx.mjs`, so re-running the port
keeps them rather than reintroducing what was removed:

| Table | What it does |
| --- | --- |
| `DROPPED_CARDS` | empty. The source template now ships the de-duplicated set — Phase 1's competitive benchmark quadrant and scorecard, and Phase 4's future-state KPI cards and economic impact, were removed upstream — so dropping anything here would put the port out of step with the file it is generated from. |
| `RENUMBERED_CARDS` | empty, for the same reason: the source numbers each pack 01, 02, 03… around its own removals. |
| `TEXT_REWRITES` | copy the source left stale when those cards went. Phase 1 still advertised "Eight validation views" and named two that no longer render; Phase 4 still counted ten. Phases 0 and 3 are internally consistent and untouched. |
| `TEXT_TO_BINDING` | a literal button label swapped for a view-model value, so DOWNLOAD FULL REPORT can report progress. |
| `SLOT_INJECTIONS` / `REPLACEMENTS` | the two ways a hand-written component reaches the tree — see above. The console otherwise shows exactly what the source shows: the agent loop has no panels of its own, so outstanding intake needs are listed with the questions for the client, and material coming back arrives through the manual-entry box on the INPUTS tab. |

A wrapper whose every child was dropped is skipped too, so no empty grid rows
are left behind. Two stamps are added to the markup: each card root carries
`data-card="phase0-07A"` and `data-card-title`, which is how the report finds
and captions it, and each scatter-chart point carries `data-plot-point`, which
is how the label layout finds it.

### Scatter-chart labels

Quadrant charts place a dot at `left: x%, top: y%` with its label centred
underneath. Where points cluster — four leadership roles in one corner of the
stakeholder map, two small peers stacked at the bottom of the benchmark
quadrant — those labels land on each other.

`use-plot-labels.ts` separates them after paint. It measures rather than
predicts, because the panels are a fixed height but their width follows the
grid column and the viewport, and the label height depends on where the text
wraps; a computed layout is right at one width and wrong at every other. Each
label is offered a series of vertical offsets — below its dot as authored, then
above, then a label-height further out each way — and takes the one with the
least overlap against the labels already placed, the dots, and the quadrant
captions, nearest to its own dot. It re-runs on resize through a
`ResizeObserver`.

It lives in `ConsoleSurface`, not in a route component, so it cannot be lost by
rendering `ConsoleShell` directly — which is exactly how the preview harness
first slipped past it.

## Data flow

```
URL  ──► useRouteSync ──► ConsoleRoute { view, engagementId, phase, projectHome }
                              │
zustand store (engagements, transient UI, actions)
                              │
                    buildViewModel(deps) ──► v
                              │
                        ConsoleShell v={v}
                              │
        Sidebar · DashboardView · AttentionView · EngagementView
                                                      │
                                    EngagementOverview / PhaseWorkspace
                                                      │
                                          PhaseInputs / PhaseOutput
                                                      │
                                          PhaseNPack ──► CardNN…
```

The URL is the source of truth for **which view is on screen**. `useRouteSync` resolves it
synchronously and also pushes it into the store so actions (`patch`, `generatePhase`,
`addFiles`) write against the engagement being shown. Because the route is resolved before
render, the first server-rendered paint is already the right view.

Everything the tree reads comes from the single `v` object. That is what let the markup be
ported mechanically — the components never touch the store.

## Styles

The original stylesheet is kept verbatim, split by concern and re-imported in the original
cascade order (`src/styles/globals.css`):

`tokens` → `base` → `console` → `output` → `theme` → `responsive` → `hover`

Two things depend on that being verbatim:

- **Attribute selectors.** Rules like `div[style*="var(--card)"]` and
  `button[style*="2px solid #D26B51"]` match on the serialised inline style. React
  serialises style objects to the same text, so the port keeps every inline value as a
  string rather than a number — `fontWeight: '700'`, not `700`.
- **`body[data-theme]`.** Light and dark are attribute-scoped, so the theme is written to
  `body` (see `use-theme.ts`) rather than held only in React state.

## Generation

Generation runs server-side because the API key must not reach the browser.

```
store.generatePhase(pi)
  → POST /api/phases/[phase]/generate         (NDJSON stream)
      scrape company site + pasted links      → {stage:1}
      build the phase pack                    → {stage:2}
      phase 0 only: peer parameters → scrape peers → rank   → {stage:3}
      questions + next moves, read off the pack             → {stage:4}
      → {type:'done', pack, questions}
  → patch the engagement, mark the phase built
```

Prompt assembly lives in `src/lib/ai/prompts/index.ts` and the accumulated sprint context in
`src/lib/ai/context.ts` — which is what makes each phase read the ones before it: inputs the
client could not supply, notes typed by hand, the data room, research, earlier deliverables,
the two previous output packs and every question already put to the client.

## The full report

DOWNLOAD FULL REPORT produces a `.docx`, assembled client-side in three steps:

```
src/lib/export/report/
  index.ts        orchestration; imports the two heavy modules lazily so ~750 KB
                  of rasteriser and document writer stay out of the first load
  capture.ts      rasterises every [data-card] on screen with html-to-image,
                  forcing light theme and unclipping horizontal scrollers first
  captions.ts     one line per card — what that image is showing
  build-docx.ts   cover page, executive summary, contents, every captured view
                  with its caption, the deliverable drafts (markdown reused
                  through lib/markdown/blocks), then questions and next moves
                  as tables, with a page footer
```

Because the charts are captured from the live DOM, the button only works from
the OUTPUTS tab of a phase whose pack has been generated — which is where it
sits. `bun run verify:report` drives the whole path in Chrome against
`/pack-preview` and checks the document that comes back.

Captured images use the system sans rather than Inter: the webfonts come from a
cross-origin stylesheet whose rules cannot be read back and inlined. Self-hosting
the two families would fix it if the report ever needs exact typography.

## Where the work happens now

Generation moved to `backend/` (Python, FastAPI, Turso). The console holds no
generation logic: it reads and writes through `src/lib/backend/client.ts`, and
`mappers.ts` is the only place that knows both the normalised rows and the keyed
maps the ported tree renders from.

```
URL ──► useRouteSync ──► store ──► buildViewModel ──► ConsoleSurface ──► the tree
                           │
                           └──► lib/backend/client ──► Python API ──► Turso
                                                            │
                                                            └──► the phase agents
```

Mutations are optimistic: the local edit lands immediately, the write-through
follows, and a failed write falls back to the server's truth and says so.

## What is still open

- **Persistence.** Engagements live in `localStorage` today; `docs/BACKEND.md` is the Turso
  proposal, awaiting approval.
- **Pack validation.** `view-model/packs/*` has type checking off because packs are
  unvalidated model JSON. Validating on write (zod, one schema per phase) turns those files
  back into typed code — covered in `docs/BACKEND.md` §3.8.
- **Phase output generation logic.** The rendering is complete; the generation rules are
  being specified separately.
