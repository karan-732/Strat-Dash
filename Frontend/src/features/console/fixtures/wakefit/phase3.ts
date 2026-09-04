import type { PhasePack } from '@/lib/domain/types';

/** Phase 3 — process intelligence, on order promise to installation. Matches PACK_SHAPES[3]. */
export const PHASE3_PACK: PhasePack = {
  twin: {
    name: 'Order promise to installation',
    steps: [
      { name: 'Order taken and date promised', owner: 'Store Manager', system: 'POS', activeMin: 20, waitMin: 0, friction: 'high', note: 'POS quotes a fixed 18 days with no view of plant load', volume: 412000, reworkPct: 3, exceptionPct: 11, data: 'SKU, configuration, delivery pin code', impact: 'A promise the plants have not agreed to' },
      { name: 'Order lands in the plant queue', owner: 'Planning Executive', system: 'SAP', activeMin: 15, waitMin: 2880, friction: 'medium', note: 'Allocated to a plant by pin code, not by load', volume: 412000, reworkPct: 8, exceptionPct: 14, data: 'Order line, plant code', impact: 'One plant at 84% while another sits at 51%' },
      { name: 'Monthly production plan built', owner: 'Head of Manufacturing', system: 'Excel', activeMin: 720, waitMin: 7200, friction: 'high', note: 'Three plants each build their own plan in their own sheet', volume: 12, reworkPct: 71, exceptionPct: 44, data: 'Order book, forecast, capacity', impact: '~Rs 34 Cr built to a forecast at 58% accuracy' },
      { name: 'Material indent and staging', owner: 'Plant Materials Officer', system: 'SAP', activeMin: 60, waitMin: 4320, friction: 'medium', note: 'Shortages discovered at staging, not at planning', volume: 412000, reworkPct: 16, exceptionPct: 22, data: 'BOM, on-hand stock', impact: '14% of orders wait on a material the plan assumed was there' },
      { name: 'Production and quality release', owner: 'Plant Manager', system: 'SAP', activeMin: 240, waitMin: 8640, friction: 'medium', note: 'Sequenced by hand each week against the monthly plan', volume: 412000, reworkPct: 6, exceptionPct: 12, data: 'Job card, QC record', impact: 'Schedule adherence 64% against the promised date' },
      { name: 'Despatch and route planning', owner: 'Logistics Coordinator', system: 'Delivery app', activeMin: 45, waitMin: 2880, friction: 'high', note: 'Routes built the evening before, crews assigned by availability', volume: 412000, reworkPct: 12, exceptionPct: 26, data: 'Route, crew roster', impact: 'Crew skill is not matched to what the order needs' },
      { name: 'Delivery and installation', owner: 'Installation Crew', system: 'Delivery app', activeMin: 95, waitMin: 1440, friction: 'high', note: 'A quarter of first visits cannot complete', volume: 148000, reworkPct: 26, exceptionPct: 26, data: 'Proof of delivery, photo', impact: '~Rs 28 Cr in failed visits and the repeat purchase behind them' },
    ],
  },
  health: { totalCycle: '18.4 days', activeEffort: '31.6 hours', waitingTime: '18.1 days', people: 7, systems: 4, handoffs: 11 },
  handoffs: {
    chain: ['Store Manager', 'POS', 'Planning Executive', 'SAP', 'Head of Manufacturing', 'Excel', 'Plant Materials Officer', 'Plant Manager', 'Logistics Coordinator', 'Installation Crew', 'Customer'],
    totalHandoffs: 11,
    approvalPoints: 2,
    systemTransfers: 7,
    note: 'The promise is made in the POS and the capacity lives in three separate spreadsheets that the POS has never seen',
  },
  friction: {
    dimensions: ['Search', 'Data entry', 'Approval', 'Rework', 'Waiting'],
    rows: [
      { step: 'Order taken and date promised', levels: ['low', 'medium', 'low', 'low', 'low'] },
      { step: 'Order lands in the plant queue', levels: ['medium', 'low', 'low', 'medium', 'high'] },
      { step: 'Monthly production plan built', levels: ['high', 'high', 'high', 'high', 'high'] },
      { step: 'Material indent and staging', levels: ['high', 'medium', 'low', 'high', 'high'] },
      { step: 'Production and quality release', levels: ['low', 'medium', 'medium', 'low', 'high'] },
      { step: 'Despatch and route planning', levels: ['high', 'high', 'low', 'medium', 'medium'] },
      { step: 'Delivery and installation', levels: ['medium', 'high', 'low', 'high', 'medium'] },
    ],
    unavailable: [],
  },
  rework: {
    unit: '% of cases',
    causes: [
      { name: 'Material not available at staging', pct: 29 },
      { name: 'Plan changed after the order was promised', pct: 24 },
      { name: 'Crew lacked the skill or part for the configuration', pct: 21 },
      { name: 'Customer not available in the promised window', pct: 15 },
      { name: 'Damage found on delivery', pct: 11 },
    ],
    note: 'Half the rework is decided before production starts, in a plan the store never saw',
  },
  cost: {
    unit: 'Rs Cr',
    items: [
      { activity: 'Finished goods built to forecast', value: 34, basis: 'Rs 34 Cr average finished goods against a 58% accurate forecast' },
      { activity: 'Failed installation visits', value: 28, basis: '26% of 148,000 visits x Rs 2,400, plus modelled repeat purchase loss' },
      { activity: 'Idle plant capacity', value: 11, basis: '32% idle across three plants at loaded conversion cost' },
      { activity: 'Expedited despatch and re-routing', value: 4, basis: 'Orders despatched outside the planned route to recover a promised date' },
      { activity: 'Planning and coordination effort', value: 1.8, basis: '31.6 hours per plan cycle across 7 roles and 3 plants' },
    ],
    unavailable: [],
  },
  peopleSystems: {
    people: 7,
    systems: 4,
    departments: 5,
    chain: [
      { name: 'Store Manager', kind: 'person' },
      { name: 'POS', kind: 'system' },
      { name: 'Planning Executive', kind: 'person' },
      { name: 'SAP', kind: 'system' },
      { name: 'Head of Manufacturing', kind: 'person' },
      { name: 'Excel', kind: 'system' },
      { name: 'Plant Manager', kind: 'person' },
      { name: 'Logistics Coordinator', kind: 'person' },
      { name: 'Delivery app', kind: 'system' },
      { name: 'Installation Crew', kind: 'person' },
    ],
  },
  rootCause: {
    question: 'Why is on-time installation 74% when the promised lead time is already twice the category norm?',
    branches: [
      'The date is promised by a system that cannot see plant capacity',
      'Three plants plan independently, so load is never balanced',
      'Material shortages surface at staging rather than at planning',
      'Crews are assigned by availability, not by what the order needs',
    ],
    drill: {
      cause: 'The date is promised by a system that cannot see plant capacity',
      reasons: [
        'The POS was built to quote a fixed lead time, and nobody has changed it',
        'Capacity lives in three separate monthly spreadsheets',
        'By the time the plan is built, the customer has already been promised',
        'A missed date is handled by Service, so Manufacturing never feels it',
      ],
    },
  },
  opportunities: [
    { rank: 1, name: 'Capacity-aware date at the point of promise', severity: 'high', metrics: [{ k: 'Lead time', v: '18 days to 9' }, { k: 'Share of the pool', v: '29%' }, { k: 'Annual impact', v: '~Rs 34 Cr' }], note: 'Fixes the inventory and the delivery problem with one change' },
    { rank: 2, name: 'Skill-matched crew and part assignment', severity: 'high', metrics: [{ k: 'First-time right', v: '74% to 92%' }, { k: 'Share of the pool', v: '24%' }, { k: 'Annual impact', v: '~Rs 28 Cr' }], note: 'The customer-visible number, and the cleanest data in the process' },
    { rank: 3, name: 'Three-plant load balancing', severity: 'high', metrics: [{ k: 'Utilisation', v: '68% to 82%' }, { k: 'Share of cycle', v: '39%' }, { k: 'Annual impact', v: '~Rs 11 Cr' }], note: 'One plant at 84% while another sits at 51% on the same order book' },
    { rank: 4, name: 'Material availability at plan time', severity: 'medium', metrics: [{ k: 'Rework removed', v: '29%' }, { k: 'Time released', v: '3 days' }, { k: 'Annual impact', v: '~Rs 4 Cr' }], note: 'Shortages should be a planning input, not a staging surprise' },
  ],
};
