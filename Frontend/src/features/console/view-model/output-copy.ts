/*
 * The per-phase framing shown above a generated pack — the title, the summary
 * line, the KPI tiles, the bars, the posture matrix and the insight lines that
 * caption each deliverable. Ported verbatim from the source console.
 */

export interface PhaseOutputCopy {
  title: string;
  summary: string;
  chart: string;
  matrixTitle: string;
  kpis: [string, string, string][];
  bars: [string, number][];
  matrix: [string, string, string][];
  insights: string[];
}

export const PHASE_OUTPUT_COPY: readonly PhaseOutputCopy[] = [
  {
title: 'Market position and value pools',
summary: 'Where value sits, how the market is moving, and what to validate first.',
chart: 'RELATIVE OPPORTUNITY', matrixTitle: 'STRATEGIC POSTURE',
kpis: [['Revenue potential', '~18%', 'Illustrative upside range'], ['Benchmark gap', '12 pts', 'Versus sector reference'], ['Priority pools', '04', 'Shortlist for validation']],
bars: [['Growth runway', 82], ['Margin headroom', 64], ['Digital leverage', 48], ['Retention strength', 71]],
matrix: [['PRIORITIZE', '04', 'High value · strong signal'], ['VALIDATE', '06', 'Evidence required'], ['MONITOR', '03', 'Track sector movement'], ['DEFER', '02', 'Limited near-term value']],
insights: ['Executive position reduced to the signals that affect the next decision.', 'Value-chain pressure points grouped by materiality, not volume.', 'Competitive evidence converted into a clear benchmark view.']
  },
  {
title: 'Leadership alignment and hypotheses',
summary: 'Leadership priorities against the evidence, and which hypotheses move forward.',
chart: 'ALIGNMENT SIGNAL', matrixTitle: 'HYPOTHESIS STATUS',
kpis: [['Alignment', '86%', 'Across leadership inputs'], ['Hypotheses', '14', 'Structured for validation'], ['Priorities', '05', 'Agreed decision themes']],
bars: [['Leadership clarity', 92], ['Value-pool evidence', 78], ['Data confidence', 61], ['Execution readiness', 73]],
matrix: [['CONFIRMED', '05', 'Evidence supports'], ['VALIDATE', '06', 'Next sprint focus'], ['REFRAME', '02', 'Assumption changed'], ['REJECTED', '01', 'Insufficient value']],
insights: ['North-star outcomes translated into measurable validation criteria.', 'Leadership claims compared with the outside-in evidence base.', 'Each hypothesis framed around a decision and a disconfirming signal.']
  },
  {
title: 'Enterprise opportunity landscape',
summary: 'Where AI can create value across functions, and which opportunities earn deeper work.',
chart: 'FUNCTIONAL POTENTIAL', matrixTitle: 'OPPORTUNITY MIX',
kpis: [['Value signal', '₹8.4 Cr', 'Illustrative annual range'], ['Functions', '06', 'Mapped end to end'], ['Shortlist', '04', 'Advanced for diagnosis']],
bars: [['Operations', 88], ['Commercial', 76], ['Finance', 67], ['People', 52]],
matrix: [['ADVANCE', '04', 'Value and feasibility'], ['EXPLORE', '07', 'Promising, needs data'], ['ENABLE', '03', 'Foundational capability'], ['HOLD', '05', 'Weak current case']],
insights: ['Function-level pain points grouped into coherent value themes.', 'Opportunity inventory scored consistently across value and feasibility.', 'Shortlist explains why each item moves into process diagnosis.']
  },
  {
title: 'Process diagnosis and root causes',
summary: 'Cycle time, friction and handoffs — and the causes that must change before automation.',
chart: 'PROCESS FRICTION', matrixTitle: 'INTERVENTION FIT',
kpis: [['Cycle-time gap', '-42%', 'Illustrative target state'], ['Handoffs', '11', 'Across priority flow'], ['Automation fit', '68%', 'Steps with credible potential']],
bars: [['Waiting time', 84], ['Manual rework', 72], ['Decision latency', 63], ['Control burden', 55]],
matrix: [['REDESIGN', '05', 'Flow must change'], ['AUTOMATE', '09', 'Stable repeatable steps'], ['ASSIST', '07', 'Human-led judgement'], ['REMOVE', '03', 'Non-value activity']],
insights: ['Process twin shows the few moments creating most of the delay.', 'Root causes separate workflow defects from data and policy constraints.', 'Automation candidates remain tied to a specific process outcome.']
  },
  {
title: 'AI-native future state',
summary: 'What AI handles, where people stay accountable, and the controls that make it safe.',
chart: 'OPERATING SHIFT', matrixTitle: 'ROLE DESIGN',
kpis: [['Effort released', '36%', 'Illustrative capacity'], ['AI-owned steps', '09', 'Bounded and auditable'], ['Human controls', '06', 'Judgement and exceptions']],
bars: [['Agent execution', 79], ['Human judgement', 68], ['Data readiness', 61], ['Control maturity', 74]],
matrix: [['AUTONOMOUS', '09', 'Bounded execution'], ['COPILOTED', '12', 'Human decision'], ['SUPERVISED', '06', 'Control intensive'], ['MANUAL', '04', 'No viable AI role']],
insights: ['Future-state journeys clarify the handoff between agents and people.', 'Agent roles are bounded by data access, authority and control.', 'Governance is embedded in the workflow rather than added later.']
  },
  {
title: 'Investment case and transformation sequence',
summary: 'Value at stake, payback and sequencing — what starts now, and what waits.',
chart: 'PORTFOLIO READINESS', matrixTitle: 'DELIVERY HORIZON',
kpis: [['Value at stake', '₹12.8 Cr', 'Illustrative annual value'], ['Payback', '14 mo', 'Blended portfolio case'], ['Now initiatives', '04', 'Ready for mobilisation']],
bars: [['Business value', 91], ['Delivery feasibility', 72], ['Data readiness', 66], ['Change readiness', 58]],
matrix: [['NOW', '04', 'Fund and mobilise'], ['NEXT', '05', 'Unlock dependencies'], ['LATER', '06', 'Retain in portfolio'], ['DECLINE', '03', 'Case does not clear']],
insights: ['Business cases keep benefit, cost and confidence visible together.', 'Portfolio view makes sequencing and trade-offs explicit.', 'Blueprint assembles the approved decisions into one executive narrative.']
  }
];
