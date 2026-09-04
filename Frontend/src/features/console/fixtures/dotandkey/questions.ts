import type { PhaseQuestions } from '@/lib/domain/types';

const ts = '2026-08-24T09:00:00.000Z';

/** The questions each phase left open, and the moves it implied. */
export const PHASE_QUESTIONS: Record<number, PhaseQuestions> = {
  0: {
    items: [
      { q: 'What is your actual availability on Blinkit and Zepto, measured at store level rather than city level?', why: 'Our 82% is sampled from 40 dark stores; the whole availability case rests on the real number', who: 'Head of Ecommerce', priority: 'High', condition: 'benchmarked' },
      { q: 'What share of revenue now comes from quick commerce, and how fast is that share moving?', why: 'Sizes the availability pool before Phase 1 commits to it as the priority', who: 'Chief Financial Officer', priority: 'High', condition: 'benchmarked' },
      { q: 'Which brand do you actually lose the shelf to when a customer does not find you?', why: 'Our peer set is inferred from category data, not from your own sell-out', who: 'Co-founder and CEO', priority: 'Medium', condition: 'assumption' },
    ],
    covered: [
      { q: 'What is the current revenue and growth rate?', source: 'FY26 investor update, page 4' },
      { q: 'How many active SKUs are there?', source: 'company website and marketplace listings' },
    ],
    sug: [
      { act: 'Pull 14 days of store-level availability across 40 dark stores before the leadership session', why: 'The 18% stockout rate is the largest single number in the pack and it is currently ours, not theirs', owner: 'Analyst', when: 'Before the leadership session' },
      { act: 'Open with the peer ranking, not the SWOT', why: 'Fourth of five, with every lagging parameter operational rather than brand, is the fact that will hold the room', owner: 'Engagement lead', when: 'Before the leadership session' },
    ],
    ts,
  },
  1: {
    items: [
      { q: 'Can we have 12 months of cohort data with contribution margin, not just CAC and ROAS?', why: 'Phase 2 cannot size the marketing pool without knowing what a cohort is actually worth at 12 months', who: 'Head of Growth', priority: 'High', condition: 'next-phase-input' },
      { q: 'Who owns the availability number today — supply chain, ecommerce, or nobody?', why: 'The largest pool in the sprint has no accountable owner, and Phase 2 needs to route to one', who: 'Co-founder and CEO', priority: 'High', condition: 'no-owner' },
    ],
    covered: [
      { q: 'What is the three-year ambition?', source: 'leadership session, 19 Aug' },
      { q: 'What happened to the 2024 demand planning tool?', source: 'leadership session, 19 Aug' },
      { q: 'Is offline distribution in scope for this sprint?', source: 'leadership session — ruled out by both founders' },
    ],
    sug: [
      { act: 'Scope Phase 2 to supply chain, ecommerce and growth only', why: 'Those three carry Rs 52 Cr of the Rs 63 Cr identified; product and finance do not earn the time', owner: 'Engagement lead', when: 'This week' },
      { act: 'Lead every conversation with lost revenue, never with software', why: 'The 2024 planning tool failure is raw and the team went back to the spreadsheet within two months', owner: 'Engagement lead', when: 'Before Phase 2 interviews' },
      { act: 'Bring the Head of Growth into the incrementality design rather than presenting a finding', why: 'They read attribution work as an audit of their spend, and their cooperation decides whether Rs 16 Cr is reachable', owner: 'Strategy lead', when: 'Before Phase 2' },
    ],
    ts,
  },
  2: {
    items: [
      { q: 'Can we sit with a planner through one full replenishment cycle, start to finish?', why: 'Phase 3 needs a traced unit of work, not a description of one', who: 'Head of Supply Chain', priority: 'High', condition: 'next-phase-input' },
      { q: 'Do the four platforms give you API access to sell-out, or only the portal export?', why: 'Decides whether the replenishment agent is a 16-week build or a 40-week negotiation', who: 'Head of Ecommerce', priority: 'High', condition: 'assumption' },
    ],
    covered: [{ q: 'How many SKU-store combinations are planned each week?', source: 'planning sheet shared 26 Aug — about 176,000' }],
    sug: [
      { act: 'Observe a full Monday planning cycle at the Bhiwandi warehouse', why: 'Rs 24 Cr sits on a process nobody outside the team has ever watched run', owner: 'FDE', when: 'This week' },
      { act: 'Get written confirmation of platform API scope before Phase 4 costs anything', why: 'Every future-state step assumes continuous ingestion; without it the whole case changes shape', owner: 'Solution architect', when: 'Before Phase 3 closes' },
    ],
    ts,
  },
  3: {
    items: [
      { q: 'What service level are you willing to commit to per SKU class, and who signs it off?', why: 'The allocation agent needs a target to optimise against; without one it has no objective function', who: 'Head of Supply Chain', priority: 'High', condition: 'no-owner' },
      { q: 'How much stock is the business willing to let the agent commit without a human seeing it?', why: 'Sets the cover band for autonomous release in the future state', who: 'Chief Financial Officer', priority: 'High', condition: 'next-phase-input' },
    ],
    covered: [
      { q: 'How many systems does one replenishment cycle touch?', source: 'observed at Bhiwandi, 28 Aug — five' },
      { q: 'How often is the allocation overridden?', source: 'observed and confirmed by the planner — about a third of stores' },
    ],
    sug: [
      { act: 'Design the future state around the top 20 SKUs on two platforms', why: 'That is 71% of quick-commerce revenue and the cleanest data — the safe place to prove the agent', owner: 'Solution architect', when: 'Before the design session' },
      { act: 'Take lost-sales measurement to the CFO as a standalone metric', why: 'Rs 24 Cr is currently invisible in the P&L, and nothing gets funded that nobody can see', owner: 'Engagement lead', when: 'This week' },
    ],
    ts,
  },
  4: {
    items: [
      { q: 'Will the co-manufacturers accept a rolling schedule feed rather than a monthly PO?', why: 'The production planning case depends on it, and it is the only external dependency in the portfolio', who: 'Head of Operations', priority: 'High', condition: 'assumption' },
    ],
    covered: [
      { q: 'Can Unicommerce accept a programmatic order write?', source: 'design session, 31 Aug — confirmed by the vendor' },
      { q: 'Do the platforms allow forward appointment booking?', source: 'design session — two of four do today' },
    ],
    sug: [
      { act: 'Cost the platform integration separately from the agent', why: 'It is the only piece with an external dependency and the only one that could slip the Q1 date', owner: 'FDE', when: 'Before Phase 5' },
      { act: 'Write the override log into the design as a first-class feature, not an afterthought', why: 'The 2024 tool failed because planners had no way to disagree with it and simply stopped using it', owner: 'Solution architect', when: 'Before Phase 5' },
    ],
    ts,
  },
  5: {
    items: [
      { q: 'Is Rs 9.2 Cr inside the Rs 10 Cr technology cap, or does it compete with the ERP migration?', why: 'Decides whether the two NOW initiatives start together or are sequenced across two years', who: 'Chief Financial Officer', priority: 'High', condition: 'next-phase-input' },
      { q: 'Who owns availability once the agent is live — and does that person sit in supply chain or ecommerce?', why: 'The Rs 24 Cr case still has no accountable owner, and it is the same gap Phase 1 raised', who: 'Co-founder and CEO', priority: 'High', condition: 'no-owner' },
    ],
    covered: [{ q: 'What hurdle rate should the cases be tested against?', source: 'CFO review, 2 Sep — 22% IRR' }],
    sug: [
      { act: 'Take the replenishment agent to the board on its own', why: 'Five-month payback on Rs 3.1 Cr is the easiest yes in the portfolio and it buys room for everything behind it', owner: 'Engagement lead', when: 'At the closing session' },
      { act: 'Make lost-sales reporting a condition of funding, not a deliverable of it', why: 'If the baseline is not measured before go-live, the Rs 24 Cr can never be proven afterwards', owner: 'Strategy lead', when: 'At the closing session' },
    ],
    ts,
  },
};
