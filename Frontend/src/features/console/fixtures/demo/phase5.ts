import type { PhasePack } from '@/lib/domain/types';

/** Phase 5 — business case and portfolio. Matches PACK_SHAPES[5]. */
export const PHASE5_PACK: PhasePack = {
  totals: { valueAtStake: 'Rs 46 Cr', investment: 'Rs 8.4 Cr', payback: '14 months', hurdle: '18% IRR' },
  cases: [
    { initiative: 'Aftermarket contact and quotation agent', investment: 'Rs 1.9 Cr', annualValue: 'Rs 22 Cr', payback: '4 months', confidence: 'High', basis: '37 units off contract x ~Rs 35 L a year at 65% conversion, against build and integration cost' },
    { initiative: 'Procurement agent, PO to release', investment: 'Rs 2.4 Cr', annualValue: 'Rs 12 Cr', payback: '9 months', confidence: 'High', basis: 'Rs 8 Cr working capital release plus Rs 4.2 Cr of effort and premium' },
    { initiative: 'Parametric engineering library', investment: 'Rs 2.6 Cr', annualValue: 'Rs 9 Cr', payback: '17 months', confidence: 'Medium', basis: '13 days x 6 projects x loaded engineering day rate, less library build' },
    { initiative: 'Retention recovery workflow', investment: 'Rs 0.6 Cr', annualValue: 'Rs 8 Cr', payback: '5 months', confidence: 'Medium', basis: 'Rs 41 Cr ageing retentions at a 20% annual recovery uplift' },
    { initiative: 'Crew scheduling optimiser', investment: 'Rs 0.9 Cr', annualValue: 'Rs 6 Cr', payback: '11 months', confidence: 'Low', basis: '29% idle crew days x 4 crews; depends on project starts smoothing' },
  ],
  portfolio: {
    now: ['Aftermarket contact and quotation agent', 'Procurement agent, PO to release', 'Retention recovery workflow'],
    next: ['Parametric engineering library', 'Site progress capture'],
    later: ['Crew scheduling optimiser', 'Condition monitoring on installed base'],
    decline: ['Tender pricing tool rebuild', 'ERP replacement'],
  },
  sequence: [
    { period: 'Q1', milestone: 'Aftermarket agent live on 20 off-contract units', dependency: 'Installed base data cleaned and owned by Service' },
    { period: 'Q2', milestone: 'Procurement agent live under the Rs 5 L threshold', dependency: 'BOM freeze rule agreed between Engineering and Materials' },
    { period: 'Q2', milestone: 'Retention recovery workflow in Finance', dependency: 'Two disputed government contracts settled or ring-fenced' },
    { period: 'Q3', milestone: 'Vendor portal replaces email RFQ', dependency: 'Top 40 vendors onboarded' },
    { period: 'Q4', milestone: 'Parametric library covering 80% of span types', dependency: 'Drawing history digitised' },
  ],
  kpis: [
    { kpi: 'Aftermarket attach rate', baseline: '41%', target: '65%', owner: 'Head of Service' },
    { kpi: 'PO cycle time', baseline: '46 days', target: '14 days', owner: 'Head of Materials' },
    { kpi: 'Working capital days', baseline: '96 days', target: '70 days', owner: 'Chief Financial Officer' },
    { kpi: 'Drawing release cycle', baseline: '34 days', target: '21 days', owner: 'Chief Design Engineer' },
    { kpi: 'Schedule adherence', baseline: '68%', target: '90%', owner: 'Head of Projects' },
  ],
  bridge: {
    unit: 'Rs Cr',
    items: [
      { k: 'Manual effort', current: 9.4, future: 4.1 },
      { k: 'Delay and liquidated damages', current: 16, future: 6 },
      { k: 'Rework', current: 9, future: 2.7 },
      { k: 'Expedite and error cost', current: 3, future: 0.9 },
      { k: 'Working capital carried', current: 12, future: 4 },
      { k: 'Uncaptured aftermarket', current: 22, future: 6 },
    ],
  },
  investment: {
    unit: 'Rs Cr',
    items: [
      { k: 'Build', v: 3.2 },
      { k: 'Integration', v: 2.1 },
      { k: 'Infrastructure', v: 0.6 },
      { k: 'Licences', v: 0.8 },
      { k: 'Change management', v: 1.1 },
      { k: 'Ongoing run cost', v: 0.6 },
    ],
  },
  scope: [
    {
      initiative: 'Aftermarket contact and quotation agent',
      objective: 'Turn the installed base of 62 ropeways into a managed annuity rather than a reactive call queue',
      users: 'Service coordinators and regional service engineers, replacing the reactive call-log workflow',
      requirements: ['Installed-base register with contract state', 'Scheduled contact triggers by installation age', 'Quotation drafting from the spares catalogue', 'Contract renewal pipeline view'],
      aiRequirements: ['Breakdown-history summarisation per unit', 'Spares recommendation from failure patterns', 'Quotation drafting with rate-card pricing', 'Escalation on non-response'],
      data: ['Commissioning records for all 62 units', 'Warranty and breakdown log', 'Spares catalogue and rate card', 'O&M contract register'],
      kpis: ['Attach rate 41% → 65%', 'Spares revenue per unit', 'Quote-to-order conversion'],
      timeline: '14 weeks to first live cohort of 20 units',
      team: '1 FDE, 1 AI engineer, Head of Service as owner, 0.5 service coordinator',
      commercial: 'Rs 1.9 Cr build and first-year run',
    },
    {
      initiative: 'Procurement agent, PO to release',
      objective: 'Cut the 46-day purchase order cycle to 14 days and release Rs 8 Cr of early-order working capital',
      users: 'Buyers and the Head of Materials, with project managers confirming issue-to-site timing',
      requirements: ['BOM-freeze event from the PDM', 'Agent-drafted RFQ pack', 'Comparative statement generation', 'Autonomous release under Rs 5 L', 'Exception queue with audit log'],
      aiRequirements: ['Quote extraction from PDF and email', 'Vendor recommendation with stated rationale', 'Expediting and escalation agent', 'Release-timing planner against site readiness'],
      data: ['BOM with revision state', 'Vendor master and three-order rate history', 'Project schedule and site readiness dates', 'Goods receipt history'],
      kpis: ['PO cycle 46d → 14d', 'Buyer effort 5.3h → 0.8h per line', 'Early-order WIP Rs 12 Cr → Rs 4 Cr'],
      timeline: '18 weeks, live under threshold at week 12',
      team: '1 FDE, 1 AI engineer, 1 solution architect, Head of Materials as owner',
      commercial: 'Rs 2.4 Cr build, integration and first-year run',
    },
  ],
};
