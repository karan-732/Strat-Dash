import type { PhasePack } from '@/lib/domain/types';

/** Phase 2 — functional value diagnosis. Matches PACK_SHAPES[2]. */
export const PHASE2_PACK: PhasePack = {
  functions: [
    { name: 'Engineering', spend: 'Rs 38 Cr', cycleTime: '34 days', costPerTxn: 'Rs 4.2 L per drawing set', exceptionRate: '31%', note: 'Every project passes through here; revisions drive the exception rate' },
    { name: 'Procurement', spend: 'Rs 214 Cr', cycleTime: '19 days', costPerTxn: 'Rs 8,400 per PO', exceptionRate: '18%', note: 'Long-lead items ordered early to hedge schedule risk' },
    { name: 'Projects and erection', spend: 'Rs 96 Cr', cycleTime: '11 months', costPerTxn: 'Rs 62 L per site', exceptionRate: '26%', note: 'Crew productivity varies 40% between hill and plain sites' },
    { name: 'Service and aftermarket', spend: 'Rs 21 Cr', cycleTime: '6 days', costPerTxn: 'Rs 18,000 per call', exceptionRate: '22%', note: 'Reactive; no planned contact after warranty expiry' },
    { name: 'Manufacturing', spend: 'Rs 74 Cr', cycleTime: '42 days', costPerTxn: 'Rs 2.1 L per tower', exceptionRate: '9%', note: 'Utilisation 71%, sequencing set by hand each week' },
  ],
  benchmark: {
    metric: 'Cycle time',
    unit: 'days',
    items: [
      { function: 'Engineering', actual: 34, benchmark: 21 },
      { function: 'Procurement', actual: 19, benchmark: 12 },
      { function: 'Service', actual: 6, benchmark: 3 },
      { function: 'Manufacturing', actual: 42, benchmark: 38 },
    ],
    unavailable: [],
  },
  economics: [
    {
      function: 'Engineering',
      scale: [{ k: 'Engineers', v: '46' }, { k: 'Drawing sets a year', v: '~180' }, { k: 'Annual cost', v: 'Rs 38 Cr' }],
      efficiency: [{ k: 'Cycle time', v: '34 days' }, { k: 'Sets per engineer', v: '3.9' }, { k: 'Cost per set', v: 'Rs 4.2 L' }],
      quality: [{ k: 'Revisions per set', v: '4.6' }, { k: 'Site-raised errors', v: '31%' }, { k: 'Rework effort', v: '~22%' }],
      impact: [{ k: 'Schedule days added', v: '13' }, { k: 'Annual rework cost', v: '~Rs 9 Cr' }],
    },
    {
      function: 'Procurement',
      scale: [{ k: 'Buyers', v: '11' }, { k: 'POs a year', v: '4,100' }, { k: 'Spend', v: 'Rs 214 Cr' }],
      efficiency: [{ k: 'PO cycle', v: '19 days' }, { k: 'POs per buyer', v: '373' }, { k: 'Cost per PO', v: 'Rs 8,400' }],
      quality: [{ k: 'Price variance', v: '±7%' }, { k: 'Expedites', v: '18%' }, { k: 'Rejections', v: '3.1%' }],
      impact: [{ k: 'Early-order WIP', v: '~Rs 12 Cr' }, { k: 'Expedite premium', v: '~Rs 3 Cr' }],
    },
    {
      function: 'Projects and erection',
      scale: [{ k: 'Crews', v: '4' }, { k: 'Sites a year', v: '6' }, { k: 'Annual cost', v: 'Rs 96 Cr' }],
      efficiency: [{ k: 'Schedule adherence', v: '68%' }, { k: 'Billable crew days', v: '71%' }, { k: 'Cost per site', v: 'Rs 62 L' }],
      quality: [{ k: 'Snag list per site', v: '38 items' }, { k: 'Trial re-runs', v: '26%' }],
      impact: [{ k: 'LD exposure', v: '~Rs 16 Cr' }, { k: 'Idle crew cost', v: '~Rs 6 Cr' }],
    },
    {
      function: 'Service and aftermarket',
      scale: [{ k: 'Installed units', v: '62' }, { k: 'Units under contract', v: '25' }, { k: 'Revenue', v: 'Rs 44 Cr' }],
      efficiency: [{ k: 'Response time', v: '6 days' }, { k: 'First-time fix', v: '61%' }],
      quality: [{ k: 'Repeat calls', v: '22%' }, { k: 'SLA breaches', v: '14%' }],
      impact: [{ k: 'Uncaptured revenue', v: '~Rs 22 Cr' }, { k: 'Attach rate', v: '41%' }],
    },
  ],
  painHeatmap: {
    dimensions: ['Cycle time', 'Manual effort', 'Errors', 'Rework', 'Exceptions', 'Cost'],
    rows: [
      { function: 'Engineering', levels: ['high', 'high', 'high', 'high', 'high', 'medium'] },
      { function: 'Procurement', levels: ['high', 'high', 'medium', 'low', 'medium', 'high'] },
      { function: 'Projects and erection', levels: ['high', 'medium', 'medium', 'high', 'high', 'high'] },
      { function: 'Service and aftermarket', levels: ['medium', 'high', 'medium', 'medium', 'high', 'low'] },
      { function: 'Manufacturing', levels: ['medium', 'medium', 'low', 'low', 'low', 'medium'] },
    ],
    unavailable: [],
  },
  opportunityMap: {
    unit: 'Rs Cr',
    items: [
      { name: 'Parametric engineering library', pain: 88, value: 74, atStake: 9 },
      { name: 'Aftermarket contact engine', pain: 62, value: 91, atStake: 22 },
      { name: 'Bid cost model rebuild', pain: 71, value: 68, atStake: 12 },
      { name: 'Materials release discipline', pain: 58, value: 79, atStake: 12 },
      { name: 'Crew scheduling optimiser', pain: 66, value: 54, atStake: 6 },
      { name: 'Site progress capture', pain: 84, value: 46, atStake: 4 },
      { name: 'Retention recovery workflow', pain: 44, value: 62, atStake: 8 },
    ],
    unavailable: [],
  },
  valueRanking: {
    unit: 'Rs Cr',
    items: [
      { name: 'Aftermarket contact engine', value: 22, basis: '37 units off contract x ~Rs 35 L a year at 65% conversion' },
      { name: 'Bid cost model rebuild', value: 12, basis: 'Half the observed margin variance on 4 hill sites a year' },
      { name: 'Materials release discipline', value: 12, basis: '26 days of WIP at Rs 1.33 Cr revenue a day, procurement share' },
      { name: 'Parametric engineering library', value: 9, basis: '13 days x 6 projects x loaded engineering day rate' },
      { name: 'Retention recovery workflow', value: 8, basis: 'Rs 41 Cr ageing retentions at a 20% annual recovery uplift' },
      { name: 'Crew scheduling optimiser', value: 6, basis: '29% idle crew days x 4 crews x loaded crew cost' },
    ],
    unavailable: [],
  },
  scoring: {
    dimensions: ['Business value', 'Process pain', 'AI suitability', 'Feasibility', 'Change complexity'],
    items: [
      { name: 'Aftermarket contact engine', scores: [9, 6, 9, 8, 4] },
      { name: 'Parametric engineering library', scores: [7, 9, 8, 6, 6] },
      { name: 'Bid cost model rebuild', scores: [8, 7, 7, 7, 5] },
      { name: 'Materials release discipline', scores: [8, 6, 6, 8, 7] },
      { name: 'Crew scheduling optimiser', scores: [5, 7, 8, 5, 8] },
      { name: 'Site progress capture', scores: [4, 8, 7, 9, 3] },
    ],
    unavailable: [],
  },
  priorityMatrix: {
    items: [
      { name: 'Aftermarket contact engine', feasibility: 82, value: 91 },
      { name: 'Parametric engineering library', feasibility: 61, value: 74 },
      { name: 'Bid cost model rebuild', feasibility: 72, value: 68 },
      { name: 'Materials release discipline', feasibility: 79, value: 79 },
      { name: 'Crew scheduling optimiser', feasibility: 51, value: 54 },
      { name: 'Site progress capture', feasibility: 88, value: 46 },
    ],
    unavailable: [],
  },
  leakage: {
    unit: 'Rs Cr',
    base: { label: 'Current functional cost', value: 443 },
    steps: [
      { name: 'Engineering rework', value: 9 },
      { name: 'Schedule slip and LDs', value: 16 },
      { name: 'Early-order working capital', value: 12 },
      { name: 'Idle crew days', value: 6 },
      { name: 'Expedite premiums', value: 3 },
    ],
    recoverable: { label: 'Potential value pool', value: 46 },
    unavailable: [],
  },
  topOpportunities: [
    { rank: 1, name: 'Aftermarket contact and quotation', valuePool: 'Rs 22 Cr', pain: 'Medium', aiSuitability: 'High', feasibility: 'High', next: 'Forensic analysis', note: 'Largest pool, least political, and the installed base data already exists' },
    { rank: 2, name: 'Purchase order to goods release', valuePool: 'Rs 12 Cr', pain: 'High', aiSuitability: 'Medium', feasibility: 'High', next: 'Forensic analysis', note: 'The working capital lever the CFO has already committed to' },
    { rank: 3, name: 'Drawing release for non-standard spans', valuePool: 'Rs 9 Cr', pain: 'High', aiSuitability: 'High', feasibility: 'Medium', next: 'Forensic analysis', note: 'Sits on the critical path of every project' },
    { rank: 4, name: 'Tender cost build-up', valuePool: 'Rs 12 Cr', pain: 'High', aiSuitability: 'Medium', feasibility: 'Medium', next: 'Parked for Phase 5', note: 'High value but a 2021 tool already failed here; needs the bid team on side first' },
  ],
};
