import type { PhaseQuestions } from '@/lib/domain/types';

const ts = '2026-08-28T09:00:00.000Z';

/** The questions each phase left open, and the moves it implied. */
export const DEMO_QUESTIONS: Record<number, PhaseQuestions> = {
  0: {
    items: [
      { q: 'What was the actual erection man-day count on the last four hill-site ropeways against what was bid?', why: 'Settles whether the 6–18% margin variance is a pricing problem or an execution one', who: 'Head of Business Development', priority: 'High' },
      { q: 'How many of the 62 commissioned units are still under a live O&M contract?', why: 'Sizes the aftermarket pool before Phase 1 commits to it', who: 'Head of Service', priority: 'High' },
      { q: 'Which competitor do you actually lose tenders to, and on what?', why: 'Our peer set is inferred from public sources, not from your bid history', who: 'Managing Director', priority: 'Medium' },
    ],
    covered: [
      { q: 'What is the current order book?', source: 'FY26 investor presentation, page 11' },
      { q: 'How many plants are operating?', source: 'company website, operations page' },
    ],
    sug: [
      { act: 'Pull the tender log and reconcile bid against actual on the four hill sites', why: 'The 6–18% margin variance is the largest unexplained number in the pack', owner: 'Analyst', when: 'Before the leadership session' },
      { act: 'Prepare the peer ranking as the opening slide, not an appendix', why: 'Third overall behind Doppelmayr and Leitner is the fact that will hold the room', owner: 'Engagement lead', when: 'Before the leadership session' },
    ],
    ts,
  },
  1: {
    items: [
      { q: 'What triggers a BOM being treated as final today, and who decides it?', why: 'Phase 2 cannot size the procurement leak without knowing where the freeze point is', who: 'Chief Design Engineer', priority: 'High' },
      { q: 'Of the Rs 41 Cr in retentions, how much sits behind the two disputed government contracts?', why: 'Determines whether working capital release is a process fix or a legal one', who: 'Chief Financial Officer', priority: 'High' },
    ],
    covered: [
      { q: 'What is the three-year ambition?', source: 'leadership session, 21 Aug' },
      { q: 'What happened to the 2023 ERP costing rollout?', source: 'leadership session, 21 Aug' },
      { q: 'Are erection crews open to being outsourced?', source: 'leadership session — ruled out by the MD' },
    ],
    sug: [
      { act: 'Scope Phase 2 to procurement, engineering and service only', why: 'Those three carry Rs 43 Cr of the Rs 46 Cr identified; manufacturing does not earn the time', owner: 'Engagement lead', when: 'This week' },
      { act: 'Frame every automation conversation around crew capacity, not headcount', why: 'The Plant Head reads automation as a headcount threat and the MD has ruled out crew outsourcing', owner: 'Engagement lead', when: 'Before Phase 2 interviews' },
      { act: 'Build the working-capital model on the 26-day gap the CFO named', why: 'Rs 34 Cr is the largest single pool and the CFO has already committed to it publicly', owner: 'Strategy lead', when: 'Before Phase 2' },
    ],
    ts,
  },
  2: {
    items: [
      { q: 'Can we observe a live purchase order from indent to site issue, on a project running now?', why: 'Phase 3 needs a traced unit of work, not a reconstruction', who: 'Head of Materials', priority: 'High' },
      { q: 'Why does the bid team still not use the 2021 pricing tool?', why: 'Decides whether the tender opportunity is parked or reframed', who: 'Head of Business Development', priority: 'Medium' },
    ],
    covered: [{ q: 'What is the PO volume per year?', source: 'ERP purchase register, shared 26 Aug' }],
    sug: [
      { act: 'Trace one live PO end to end at the Bhopal site next week', why: 'The Rs 12 Cr early-order WIP is the top-ranked pool and needs step-level evidence', owner: 'FDE', when: 'This week' },
      { act: 'Park the tender cost model until the bid team is on side', why: 'A 2021 tool already failed there; a second unused tool would cost us credibility', owner: 'Engagement lead', when: 'Before Phase 3' },
    ],
    ts,
  },
  3: {
    items: [
      { q: 'Would Engineering accept a hard BOM-freeze gate before the first RFQ goes out?', why: 'Two-thirds of procurement rework originates upstream; the redesign depends on this answer', who: 'Chief Design Engineer', priority: 'High' },
      { q: 'What is the real approval threshold the Head of Materials is willing to give up?', why: 'Sets where autonomous PO release can sit in the future state', who: 'Head of Materials', priority: 'High' },
    ],
    covered: [{ q: 'How many systems does a PO touch?', source: 'observed on site, 29 Aug — four' }],
    sug: [
      { act: 'Design the future state around a Rs 5 L autonomous release band', why: 'Below it is 71% of lines and 12% of value — the safe place to start', owner: 'Solution architect', when: 'Before the design session' },
      { act: 'Take the 24-day issue-to-site wait to the CFO separately', why: 'It is 52% of the cycle and Rs 12 Cr, and it is a scheduling decision, not a procurement one', owner: 'Engagement lead', when: 'This week' },
    ],
    ts,
  },
  4: {
    items: [
      { q: 'Will the top 40 vendors accept a portal in place of email RFQ?', why: 'The expediting agent has no data source without it', who: 'Head of Materials', priority: 'High' },
    ],
    covered: [
      { q: 'Can the ERP accept a programmatic PO release?', source: 'IT confirmed in the design session, 1 Sep' },
      { q: 'Does the PDM emit a BOM-freeze event?', source: 'design session — it can, with a small change' },
    ],
    sug: [
      { act: 'Get IT to confirm the PDM freeze event in writing before costing', why: 'Every future-state step hangs off it and the whole Rs 12 Cr case with it', owner: 'Solution architect', when: 'Before Phase 5' },
      { act: 'Cost the vendor portal separately from the agent', why: 'It is the only piece with an external dependency and could slip the sequence', owner: 'FDE', when: 'Before Phase 5' },
    ],
    ts,
  },
  5: {
    items: [
      { q: 'Is Rs 8.4 Cr over two years inside the Rs 40 Cr capex envelope, or does it compete with plant spend?', why: 'Decides whether the NOW initiatives can start together or must be sequenced', who: 'Chief Financial Officer', priority: 'High' },
      { q: 'Who owns the aftermarket P&L once it becomes a profit centre?', why: 'The Rs 22 Cr case has no accountable owner in the current structure', who: 'Managing Director', priority: 'High' },
    ],
    covered: [{ q: 'What hurdle rate should we use?', source: 'CFO review, 2 Sep — 18% IRR' }],
    sug: [
      { act: 'Take the aftermarket agent to the board first, alone', why: 'Four-month payback on Rs 1.9 Cr is the easiest yes and buys room for the rest', owner: 'Engagement lead', when: 'At the closing session' },
      { act: 'Make the BOM-freeze rule a condition of funding the procurement agent', why: 'Without it the Rs 12 Cr case does not hold, and it costs nothing to implement', owner: 'Strategy lead', when: 'At the closing session' },
    ],
    ts,
  },
};
