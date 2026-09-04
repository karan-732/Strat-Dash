import type { PhasePack } from '@/lib/domain/types';

/** Phase 1 — leadership alignment. Matches PACK_SHAPES[1]. */
export const PHASE1_PACK: PhasePack = {
  northStar: [
    { metric: 'Project EBITDA margin', direction: 'up', current: '12.8%', target: '18%', gap: '+5.2 pts', note: 'MD frames this as the single number the board watches' },
    { metric: 'Schedule adherence', direction: 'up', current: '68%', target: '90%', gap: '+22 pts', note: 'Liquidated damages exposure of ~Rs 16 Cr sits behind this' },
    { metric: 'Working capital days', direction: 'down', current: '96 days', target: '70 days', gap: '-26 days', note: 'CFO: releases ~Rs 34 Cr of cash at current revenue' },
    { metric: 'Aftermarket attach rate', direction: 'up', current: '41%', target: '65%', gap: '+24 pts', note: 'Sector norm; ~Rs 22 Cr of annuity revenue uncaptured' },
    { metric: 'Engineering cycle time', direction: 'down', current: '34 days', target: '21 days', gap: '-13 days', note: 'Drawing release is the schedule constraint on every project' },
  ],
  benchmark: {
    xLabel: 'Revenue growth (%)',
    yLabel: 'EBITDA margin (%)',
    xMin: 0,
    xMax: 30,
    yMin: 0,
    yMax: 25,
    points: [
      { name: 'Usha Breco', x: 11.4, y: 12.8, self: true, leader: false },
      { name: 'Doppelmayr India', x: 17, y: 19.8, self: false, leader: true },
      { name: 'Leitner India', x: 14, y: 16.2, self: false, leader: false },
      { name: 'Damodar Ropeways', x: 8, y: 9.4, self: false, leader: false },
    ],
    unavailable: [],
  },
  scorecard: {
    competitors: ['Doppelmayr India', 'Leitner India', 'Damodar Ropeways'],
    rows: [
      { metric: 'Project margin', client: 64, scores: [100, 82, 47] },
      { metric: 'Schedule adherence', client: 72, scores: [100, 94, 65] },
      { metric: 'Aftermarket', client: 55, scores: [100, 89, 64] },
      { metric: 'Digital maturity', client: 32, scores: [84, 71, 38] },
      { metric: 'Erection capability', client: 92, scores: [88, 84, 61] },
    ],
    unavailable: [],
  },
  valueTree: {
    branches: [
      {
        name: 'Revenue',
        drivers: [
          { name: 'Tender win rate', note: 'Confirmed at 26%; management wants 35% without cutting price' },
          { name: 'Aftermarket attach rate', note: 'Agreed as the biggest single uncaptured pool' },
          { name: 'Urban transit entry', note: 'Ambition, not yet a line in the plan' },
          { name: 'Export mix', note: 'Deprioritised for this sprint — no bandwidth' },
        ],
      },
      {
        name: 'Cost',
        drivers: [
          { name: 'Engineering rework', note: 'Chief Design Engineer confirms 3–4 weeks per non-standard project' },
          { name: 'Erection productivity', note: 'Crews are the constraint; MD will not outsource' },
          { name: 'Steel procurement timing', note: 'CFO disputes this is a real leak — evidence needed' },
          { name: 'Site logistics', note: 'Hill-site haulage priced flat in the cost model' },
        ],
      },
      {
        name: 'Capital',
        drivers: [
          { name: 'Project WIP', note: 'Confirmed at 96 days, the CFO’s priority' },
          { name: 'Spares inventory', note: 'Held against O&M SLAs; nobody measures turns' },
          { name: 'Retention receivables', note: 'Rs 41 Cr locked in retentions older than a year' },
          { name: 'Advance recovery', note: 'Improving; not a focus' },
        ],
      },
    ],
    unavailable: [],
  },
  valuePools: {
    unit: 'Rs Cr',
    items: [
      { name: 'Aftermarket and spares capture', value: 22, basis: '62 units x ~Rs 35 L a year at sector attach rate, less current capture' },
      { name: 'Schedule adherence and LD avoidance', value: 16, basis: 'Liquidated damages accrued on the last 8 late commissionings' },
      { name: 'Working capital release', value: 34, basis: '26 days at Rs 1.33 Cr of revenue a day' },
      { name: 'Engineering rework elimination', value: 9, basis: '13 days x 6 projects a year x loaded engineering cost' },
      { name: 'Tender pricing accuracy', value: 12, basis: 'Half the current margin variance on the hill-site portfolio' },
    ],
    unavailable: [],
  },
  priorityMatrix: {
    items: [
      { name: 'Projects and erection', importance: 92, gap: 74 },
      { name: 'Engineering', importance: 86, gap: 81 },
      { name: 'Materials and procurement', importance: 71, gap: 68 },
      { name: 'Service and aftermarket', importance: 78, gap: 84 },
      { name: 'Business development', importance: 88, gap: 52 },
      { name: 'Finance', importance: 64, gap: 38 },
      { name: 'Manufacturing', importance: 58, gap: 44 },
    ],
    unavailable: [],
  },
  hypotheses: [
    { id: 'H01', title: 'Erection effort understated at bid', statement: 'Tender cost build-up systematically understates erection effort on hill sites', signal: 'Margin variance 6–18% by site', validate: 'Estimated vs actual man-days across the last 12 projects', owner: 'Business Development', status: 'Confirmed' },
    { id: 'H02', title: 'Engineering rework on custom spans', statement: 'Non-standard spans add 3–4 weeks to every project', signal: 'Drawing release 34 days against 21 planned', validate: 'Drawing revision count per project', owner: 'Engineering', status: 'Confirmed' },
    { id: 'H03', title: 'Early ordering inflates working capital', statement: 'Procurement hedges schedule risk by ordering long-lead items early', signal: 'WIP and spares at 96 days', validate: 'Days between goods receipt and issue to site', owner: 'Materials', status: 'To validate' },
    { id: 'H04', title: 'Aftermarket leaks after warranty', statement: 'Spares revenue moves to local fabricators from year three', signal: 'Attach rate 41% against 65% norm', validate: 'Spares revenue per unit by installation age', owner: 'Service', status: 'Confirmed' },
    { id: 'H05', title: 'Crew idle time is a hidden cost', statement: 'Salaried crews are unbilled between post-monsoon project starts', signal: 'Utilisation 71%', validate: 'Billable crew days as a share of paid days', owner: 'Projects', status: 'To validate' },
    { id: 'H06', title: 'Steel timing is a material leak', statement: 'Buying steel outside the index window costs 2–3% of project cost', signal: 'Raised in the outside-in pack', validate: 'PO dates against steel index movement', owner: 'Materials', status: 'Rejected' },
  ],
  leadership: {
    dimensions: [
      { name: 'Growth', leadership: 'High', evidence: 'Medium', note: 'MD wants urban transit; no bid capability built for it yet' },
      { name: 'Margin', leadership: 'Critical', evidence: 'Critical', note: 'Agreed on both sides as the priority' },
      { name: 'Working capital', leadership: 'High', evidence: 'Critical', note: 'CFO under-weights how much sits in retentions' },
      { name: 'Aftermarket', leadership: 'Medium', evidence: 'High', note: 'Leadership treats service as support; the data says it is a business' },
      { name: 'Digital and AI', leadership: 'Low', evidence: 'High', note: 'The widest divergence in the session' },
      { name: 'Talent', leadership: 'High', evidence: 'Medium', note: 'Erection crews, not engineers, are the real scarcity' },
    ],
    unavailable: [],
  },
  ambition: {
    horizon: 'Rs 900 Cr revenue at 18% EBITDA by FY29',
    targets: [
      { k: 'Revenue', from: 'Rs 486 Cr', to: 'Rs 900 Cr' },
      { k: 'EBITDA margin', from: '12.8%', to: '18%' },
      { k: 'Aftermarket share of revenue', from: '9%', to: '20%' },
      { k: 'Working capital days', from: '96', to: '70' },
    ],
    priorities: [
      'Win the first urban ropeway tender',
      'Make service a profit centre, not a cost of sale',
      'Stop losing margin between the bid and the site',
      'Build a second erection crew without doubling fixed cost',
    ],
    constraints: [
      'No headcount growth in corporate functions',
      'Erection crews stay in-house — non-negotiable',
      'Capex limited to Rs 40 Cr over two years',
      'ERP replacement is off the table this cycle',
    ],
    pastFailures: [
      'ERP module for project costing rolled out 2023, abandoned after nine months — nobody entered site data',
      'A consultant-built tender pricing tool from 2021 is still unused',
    ],
    sensitivities: [
      'Plant Head reads any automation talk as a headcount threat',
      'The 2023 ERP failure is a sore point with the MD; do not lead with systems',
      'Retention receivables involve two disputed government contracts',
    ],
  },
};
