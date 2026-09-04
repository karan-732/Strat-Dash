import type { PhasePack } from '@/lib/domain/types';

/** Phase 1 — leadership alignment. Matches PACK_SHAPES[1]. */
export const PHASE1_PACK: PhasePack = {
  northStar: [
    { metric: 'EBITDA margin', direction: 'up', current: '3.2%', target: '10%', gap: '+6.8 pts', note: 'CEO frames this as the condition of the next funding round' },
    { metric: 'On-time installation', direction: 'up', current: '74%', target: '92%', gap: '+18 pts', note: 'Head of Service: every failed visit costs roughly Rs 2,400 and a review' },
    { metric: 'Promised lead time', direction: 'down', current: '18 days', target: '9 days', gap: '-9 days', note: 'The single largest reason a customer chooses a competitor at the store' },
    { metric: 'Inventory days', direction: 'down', current: '78 days', target: '52 days', gap: '-26 days', note: 'CFO: releases about Rs 62 Cr at current cost of sales' },
    { metric: 'Plant utilisation', direction: 'up', current: '68%', target: '82%', gap: '+14 pts', note: 'Head of Manufacturing disputes this without a second shift' },
  ],
  benchmark: {
    xLabel: 'Revenue growth (%)',
    yLabel: 'EBITDA margin (%)',
    xMin: -10,
    xMax: 70,
    yMin: -10,
    yMax: 18,
    points: [
      { name: 'Wakefit', x: 24.6, y: 3.2, self: true, leader: false },
      { name: 'Sheela Foam', x: 9, y: 12, self: false, leader: true },
      { name: 'Duroflex', x: 18, y: 7, self: false, leader: false },
      { name: 'The Sleep Company', x: 62, y: -2, self: false, leader: false },
      { name: 'Pepperfry', x: 4, y: -6, self: false, leader: false },
    ],
    unavailable: [],
  },
  scorecard: {
    competitors: ['Sheela Foam', 'Duroflex', 'The Sleep Company'],
    rows: [
      { metric: 'Margin', client: 27, scores: [100, 58, 0] },
      { metric: 'Delivery reliability', client: 63, scores: [100, 90, 94] },
      { metric: 'Inventory efficiency', client: 49, scores: [100, 74, 58] },
      { metric: 'Digital maturity', client: 44, scores: [61, 39, 58] },
      { metric: 'Brand and direct channel', client: 88, scores: [64, 61, 79] },
    ],
    unavailable: [],
  },
  valueTree: {
    branches: [
      {
        name: 'Revenue',
        drivers: [
          { name: 'Store conversion rate', note: 'Confirmed at 22%; leadership believes lead time is the main objection' },
          { name: 'Furniture attach on mattress buyers', note: 'Agreed as the largest untapped revenue mechanic' },
          { name: 'Institutional and hospitality', note: 'Ambition for FY28; out of scope for this sprint' },
          { name: 'Average order value', note: 'Rising already; not a focus' },
        ],
      },
      {
        name: 'Cost',
        drivers: [
          { name: 'Failed installation visits', note: 'Confirmed at 26% of first visits; nobody currently owns the number' },
          { name: 'Foam and timber purchase timing', note: 'Head of Procurement disputes there is a leak — wants index evidence' },
          { name: 'Plant labour productivity', note: 'Second shift ruled out this year; must come from sequencing' },
          { name: 'Return and refurbishment', note: 'Confirmed; re-sellable stock is being scrapped by default' },
        ],
      },
      {
        name: 'Capital',
        drivers: [
          { name: 'Finished-goods inventory', note: 'CFO priority; Rs 34 Cr built to a forecast the plants do not trust' },
          { name: 'Raw material stock', note: '46 days held against crude-linked foam pricing' },
          { name: 'Work in progress across three plants', note: 'Never consolidated into a single view' },
          { name: 'Store display inventory', note: '120 stores, each holding its own; not measured centrally' },
        ],
      },
    ],
    unavailable: [],
  },
  valuePools: {
    unit: 'Rs Cr',
    items: [
      { name: 'Demand-led production planning', value: 34, basis: 'Rs 34 Cr finished goods at a 60% reduction plus utilisation gain on the released capacity' },
      { name: 'First-time-right installation', value: 28, basis: '26% failed visits x 148,000 installations x Rs 2,400, plus modelled repeat loss' },
      { name: 'Foam and timber purchase timing', value: 22, basis: '3.1% of a Rs 710 Cr material spend, at the observed index swing across the buying calendar' },
      { name: 'Return recovery and refurbishment', value: 19, basis: 'Rs 19 Cr of returns at a 55% recovery rate against the current scrap default' },
      { name: 'Store assortment optimisation', value: 14, basis: '4 points of store conversion on the footfall base at current AOV' },
    ],
    unavailable: [],
  },
  priorityMatrix: {
    items: [
      { name: 'Manufacturing and planning', importance: 94, gap: 86 },
      { name: 'Service, last mile and installation', importance: 91, gap: 82 },
      { name: 'Procurement', importance: 78, gap: 64 },
      { name: 'Retail and stores', importance: 74, gap: 58 },
      { name: 'Growth and marketing', importance: 66, gap: 41 },
      { name: 'Product development', importance: 62, gap: 38 },
      { name: 'Finance', importance: 58, gap: 31 },
    ],
    unavailable: [],
  },
  hypotheses: [
    { id: 'H01', title: 'The delivery date is promised blind', statement: 'The POS quotes 18 days regardless of what the plants are actually carrying', signal: 'On-time installation 74%', validate: 'Promised vs actual date across 12 months of orders', owner: 'Manufacturing', status: 'Confirmed' },
    { id: 'H02', title: 'Production runs to forecast, not to order', statement: 'Three plants plan independently on a monthly forecast nobody trusts', signal: 'Rs 34 Cr finished goods at 68% utilisation', validate: 'Finished-goods days by SKU class against order book', owner: 'Manufacturing', status: 'Confirmed' },
    { id: 'H03', title: 'Failed first visits are the largest hidden cost', statement: 'A quarter of installations need a second visit', signal: '26% of first visits do not complete', validate: 'First-time-right rate with coded failure reasons', owner: 'Service', status: 'Confirmed' },
    { id: 'H04', title: 'Re-sellable returns are scrapped', statement: 'Grading by eye means the safe default is to scrap', signal: 'Rs 19 Cr returned, recovery not measured', validate: 'Recovery value per returned unit by condition', owner: 'Service', status: 'To validate' },
    { id: 'H05', title: 'Foam buying is administrative, not commercial', statement: 'Purchase timing follows a calendar rather than the index', signal: 'Raw material 46 days, crude-linked pricing', validate: 'Purchase price against index at each buying window', owner: 'Procurement', status: 'To validate' },
    { id: 'H06', title: 'Store display inventory is a hidden pool', statement: '120 stores each hold uncounted display stock', signal: 'Raised in the outside-in pack', validate: 'Physical count against system stock', owner: 'Retail', status: 'Rejected' },
  ],
  leadership: {
    dimensions: [
      { name: 'Growth', leadership: 'High', evidence: 'Medium', note: 'Leadership wants 40%; the delivery system caps it well below that' },
      { name: 'Margin', leadership: 'Critical', evidence: 'Critical', note: 'The clearest agreement in the room' },
      { name: 'Delivery reliability', leadership: 'Medium', evidence: 'Critical', note: 'Treated as a service issue; the evidence says it is a planning issue' },
      { name: 'Working capital', leadership: 'High', evidence: 'Critical', note: 'CFO under-weights how much sits in raw material rather than finished goods' },
      { name: 'Digital and AI', leadership: 'Medium', evidence: 'High', note: 'More open here than most; SAP is already in place' },
      { name: 'Talent', leadership: 'High', evidence: 'Low', note: 'Leadership wants planners; the constraint is that three plants plan separately' },
    ],
    unavailable: [],
  },
  ambition: {
    horizon: 'Rs 2,200 Cr revenue at 10% EBITDA by FY29',
    targets: [
      { k: 'Revenue', from: 'Rs 1,142 Cr', to: 'Rs 2,200 Cr' },
      { k: 'EBITDA margin', from: '3.2%', to: '10%' },
      { k: 'On-time installation', from: '74%', to: '92%' },
      { k: 'Inventory days', from: '78', to: '52' },
    ],
    priorities: [
      'Promise a date the plants can actually meet',
      'Make the first installation visit the only visit',
      'Plan three plants as one network, not three businesses',
      'Turn the return pile into a resale channel',
    ],
    constraints: [
      'No second shift at any plant this financial year',
      'No new manufacturing capex until margin reaches 6%',
      'The 100-night trial policy is not negotiable — it is the brand',
      'SAP stays; no core system replacement',
    ],
    pastFailures: [
      'An APS planning module was licensed with SAP in 2023 and never went live — the master data was never cleaned',
      'A third-party last-mile partner was trialled in 2024 and dropped after installation quality fell further',
    ],
    sensitivities: [
      'Head of Manufacturing reads planning centralisation as losing control of his plants',
      'The 2023 APS failure is well known internally — do not present this as an planning system',
      'Installation crews are contracted, and the CEO is sensitive about how that is described externally',
    ],
  },
};
