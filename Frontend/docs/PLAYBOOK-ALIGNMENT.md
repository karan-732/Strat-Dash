# Playbook alignment

Checked against `Altrd_Strategy_Sprint_Playbook.pdf` (14 pages) on 4 September 2026.
This records what the console implements, and every place it deliberately differs.

## Implemented

| Playbook | Where |
| --- | --- |
| Six phases, objectives and phase outputs | `src/lib/playbook/phases.ts` — the 36 deliverables are the playbook's phase outputs, one for one |
| 0.2 value tree · 0.3 value chain | Phase 0 pack: revenue/cost/capital drivers, stages with activities, decisions, people, systems, data, KPI, economic impact |
| 0.4 activity classification | differentiating / table stakes (eliminate, automate, agentify, standardise) / value-added services |
| 0.5 competitive intelligence, ≈5–6 comparables, best performer per metric | peer ranking: 6–9 weighted parameters, 4–6 named peers scraped and scored, leader named per parameter |
| 0.6 hypothesis bank | signal, suspected cause, validation metric, owning function |
| 0.7 diagnostic pack | leadership and department questionnaires, data request list, stakeholder map |
| 1.1–1.4 | ambition and constraints, north star, validated value tree, value pools, hypothesis disposition, functional priorities |
| 2.1–2.5 | functional economics on scale / efficiency / quality / business impact; scoring on business value, process pain, AI suitability, feasibility, change complexity; 3–5 processes to forensics |
| 3.1–3.5 | observation, unit-of-work trace, all nine step counts, current-state twin, 15-type friction taxonomy |
| 4.1–4.5 | eliminate / automate / agentify / augment / retain; handoff removal; decision rights; human and AI verbs; future-state flow |
| 5.1–5.5 | business case, KPI framework, NOW / NEXT / LATER / DO NOT BUILD, sequence with dependencies, implementation scope |
| Final deliverable | the 13-section Altrd AI Transformation Blueprint |
| "Who participates" | `participants` on each phase; attendance recorded on the INPUTS tab and carried into the generation context |
| Internal IP (p.12) | the library: value trees, benchmarks, process patterns, ROI and scoring models, captured out of finished phases |

## Corrected during the check

| | |
| --- | --- |
| Phase 3 friction taxonomy was 13 of 15 | added **forecasting** and **monitoring** — `SYSTEM_CORRECTIONS` in `src/lib/ai/prompts/index.ts` |
| Portfolio bucket read "DECLINE" | now **DO NOT BUILD**, the playbook's term — `REWRITES` in `scripts/extract-view-model.mjs` |
| Phase 4 KPI cards and economic impact had been dropped as duplicates of Phase 5 | **restored.** The playbook lists "new decision rights and KPIs" and "expected economic impact" as Phase 4 outputs in their own right: Phase 4 states what the redesigned process will move and what it is worth, Phase 5 turns that into a measured framework with baselines and owners, and a costed business case |

## Deliberate differences

- **Phase 1's competitive benchmark quadrant and scorecard are not shown.** Phase 0 owns
  competitive benchmarking — quadrant, positioning map, peer ranking and capability
  heatmap — and repeating it in Phase 1 showed the same figures twice. The playbook's
  Phase 1 output "confirmed competitive gaps and key value pools" is carried by the value
  pool analysis card and the Phase 1 deliverable of the same name. Reverse it by removing
  `phase1:02` and `phase1:03` from `DROPPED_CARDS` in `scripts/dc-to-jsx.mjs`.
- **Phase titles are shortened** for the phase rail: "Leadership Alignment" rather than
  "Leadership Alignment + Enterprise Diagnosis", "AI-Native Redesign" rather than
  "AI-Native Process Redesign".
- **The six framing questions on page 2 do not appear in the UI.** They are the argument
  for the method, not an artefact of a sprint.
- **"IMPLEMENT", the eighth step of the consulting model, is out of scope.** The sprint
  ends at the blueprint; the build is a separate engagement.
