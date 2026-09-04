/**
 * One line per output card, printed under its image in the full report so a
 * reader who was not in the room knows what they are looking at.
 *
 * Keyed by the `data-card` stamped on each card by scripts/dc-to-jsx.mjs.
 * A card with no entry still appears in the report, captioned with its title.
 */
export const CARD_CAPTIONS: Record<string, string> = {
  /* Phase 0 — Outside-In View */
  'phase0-01': 'What the company is and how it performs today: revenue, growth, headcount, footprint, share and profitability. A ~ prefix marks a figure derived from sector benchmarks rather than reported.',
  'phase0-02': 'Strengths, weaknesses, opportunities and threats read off public information, before any client conversation.',
  'phase0-03': 'Where the client sits against named comparables on the two axes that decide the sector. Top right leads; bottom left is at risk. The highlighted point is the client.',
  'phase0-04': 'The same peer set placed on innovation against price, showing which end of the market each player competes at.',
  'phase0-04A':
    'Four to six pairs of real, unit-bearing metrics, the same peer set plotted on every one, with the client marked. Where a company does not report a metric it is derived from sector benchmarks and prefixed ~.',
  'phase0-05': 'The 6–9 parameters that actually decide who wins in this sector, each weighted, with the client and every peer scored and ranked. The verdict line states where the client stands overall and where it leads.',
  'phase0-06': 'Capability by capability, the client scored 1–4 against named competitors — where it is a leader and where it is a laggard.',
  'phase0-07': 'How the industry makes money: the revenue, cost and capital drivers, and the value chain stages value moves through.',
  'phase0-07A': 'Each value chain stage opened up — the activities in it, the decisions taken there, who owns it, the systems and data it touches, its KPI and its economic impact.',
  'phase0-07B': 'Every activity sorted into what differentiates, what is table stakes (and its treatment: eliminate, automate, agentify, standardise) and what could become a paid service.',
  'phase0-07C': 'The hypotheses we hold before entering: the external signal that prompted each, the suspected cause, the metric that would settle it and the function that owns it.',
  'phase0-07D': 'Who to interview, plotted by influence over the transformation against knowledge of the actual work, plus the data to request from each function.',
  'phase0-08': 'The portfolio on market growth against relative share — stars, cash cows, question marks and dogs, sized by share of revenue.',

  /* Phase 1 — Leadership Alignment */
  'phase1-01': 'The enterprise outcomes leadership is steering to, each with where the business is now, where it needs to get to, and the gap between.',
  'phase1-02': 'The value tree corrected by management: the revenue, cost and capital drivers they confirm matter for this specific business.',
  'phase1-03': 'Where the money is, ranked by value at stake, with the basis of each estimate shown.',
  'phase1-04': 'Functions plotted on strategic importance against performance gap. Top right is where Phase 2 goes deep; bottom left is deliberately left alone.',
  'phase1-05': 'What leadership says matters against what the outside-in evidence shows, dimension by dimension. A divergence is a conversation to have.',
  'phase1-06': "Management's stated ambition: the numeric targets, the growth priorities in their own words, the constraints they named, prior transformation attempts and the sensitive areas to handle carefully.",
  'phase1-07': 'Every hypothesis resolved into confirmed, rejected or still to validate, with what would settle the open ones.',

  /* Phase 2 — Functional Value Diagnosis */
  'phase2-01': 'The priority functions at a glance: annual spend, cycle time, cost per transaction and exception rate for each.',
  'phase2-02': 'Each function measured against the sector benchmark on the metric that matters most for it — the size of the bar gap is the size of the problem.',
  'phase2-03': 'The numbers behind each function across four lenses: scale, efficiency, quality and business impact.',
  'phase2-04': 'Where the pain is, function by function, across cycle time, manual effort, errors, rework, exceptions and cost.',
  'phase2-05': 'Every enterprise opportunity placed on process pain against business value, with the value at stake attached to each.',
  'phase2-06': 'Opportunities ranked by the annual value they could release, each with the arithmetic behind the figure.',
  'phase2-07': 'How each opportunity scored on business value, process pain, AI suitability, feasibility and change complexity.',
  'phase2-08': 'The same opportunities on feasibility against business value — the top right corner is what to start on.',
  'phase2-09': 'Where the current functional cost leaks away, step by step, down to the value pool that could be recovered.',
  'phase2-10': 'The three to five processes selected for forensic analysis in Phase 3, with the value pool, pain, AI suitability and feasibility that justified each.',

  /* Phase 3 — Process Intelligence */
  'phase3-01': 'The process as it actually runs, step by step, with the owner, the system used, active effort and waiting time at each step.',
  'phase3-02': 'Active effort against waiting time per step — the gap between the two is where cycle time is really lost.',
  'phase3-03': 'The process at a glance: total cycle time, active effort, waiting time, and how many people, systems and handoffs it involves.',
  'phase3-04': 'The chain of handoffs from trigger to completion, with the count of handoffs, approval points and system transfers.',
  'phase3-05': 'Friction classified per step using the standard taxonomy — search, data entry, approval, rework, waiting — at low, medium or high.',
  'phase3-06': 'What drives rework and exceptions in this process, and what share of cases each cause accounts for.',
  'phase3-07': 'The annualised cost carried by each activity in the process, so effort and money line up.',
  'phase3-08': 'Every person and system the work passes through, in the order it actually moves.',
  'phase3-09': 'The causes of high cycle time taken down a level, from symptom to root cause.',
  'phase3-09A': 'Every step quantified on all nine counts the playbook requires: volume, effort, waiting, people, systems, data, rework rate, exception rate and economic consequence.',
  'phase3-10': 'The three to five interventions this process analysis points to, ranked, each with its effort, share of cycle time and annual impact.',

  /* Phase 4 — AI-Native Redesign */
  'phase4-01': 'The current flow beside the redesigned one, step for step, with the handoffs, approvals, cycle time and effort each carries.',
  'phase4-02': 'Every current activity and what happens to it: eliminate, automate, agentify, augment or retain.',
  'phase4-03': 'Who does what in the new process, lane by lane — where AI acts, where a human acts, and where they act together.',
  'phase4-04': 'Handoffs, approvals and system transfers before against after — the structural simplification the redesign buys.',
  'phase4-05': 'Cycle time, active effort, waiting time, manual effort and people involved, current against future.',
  'phase4-06': 'Every decision in the process and where authority sits after the redesign — AI, human, or joint.',
  'phase4-07': 'The stack the future state runs on, from source systems up to the human decision maker, with the data, integrations, models, touchpoints and workflow systems it needs.',
  'phase4-08': 'What AI does and what people do, stated verb by verb — monitors, retrieves, reasons, generates, executes, coordinates, escalates against decides, approves, negotiates, reviews and handles exceptions.',
  'phase4-09': 'Per redesigned process: how many activities were eliminated, automated, agentified, augmented or retained, and the before-and-after on handoffs, cycle time and manual effort.',

  /* Phase 5 — Business Case & Portfolio */
  'phase5-01': 'The headline numbers: total value at stake, the investment required, the blended payback and the hurdle it is measured against.',
  'phase5-02': 'Each initiative costed — investment, annual value, payback and how confident the estimate is, with the basis stated.',
  'phase5-02A': 'Current state against future state on the counts the playbook names: effort, cost, delay, rework, errors, leakage, working capital and capacity.',
  'phase5-02B': 'Where the money goes — build, integration, infrastructure, licences, change management and run cost — alongside implementation-ready scope for the initiatives starting now.',
  'phase5-03': 'Every initiative sorted into NOW, NEXT, LATER or DO NOT BUILD, with the reason each qualifies.',
  'phase5-04': 'The order things have to happen in, with the dependency that gates each milestone and the critical path through them.',
  'phase5-05': 'How success is measured after go-live: each KPI with its baseline, its target and the role accountable for it.',
};

/** The caption for a card, falling back to its own title. */
export function captionFor(cardId: string, title: string): string {
  return CARD_CAPTIONS[cardId] ?? title;
}
