import type { PhasePack } from '@/lib/domain/types';

/** Phase 3 — process intelligence, on demand signal to dark-store availability. Matches PACK_SHAPES[3]. */
export const PHASE3_PACK: PhasePack = {
  twin: {
    name: 'Demand signal to dark-store availability',
    steps: [
      { name: 'Pull sell-out from four platform portals', owner: 'Supply Chain Executive', system: 'Platform portals', activeMin: 180, waitMin: 0, friction: 'high', note: 'Downloaded by hand every Monday, one city at a time', volume: 52, reworkPct: 12, exceptionPct: 22, data: 'Sell-out by dark store and SKU', impact: '~Rs 0.9 Cr a year of planner effort' },
      { name: 'Consolidate into the planning sheet', owner: 'Supply Chain Executive', system: 'Excel', activeMin: 240, waitMin: 480, friction: 'high', note: 'Four export formats reconciled into one tab by hand', volume: 52, reworkPct: 26, exceptionPct: 31, data: '176,000 SKU-store rows', impact: 'Errors here propagate to every downstream decision' },
      { name: 'Build the forecast', owner: 'Head of Supply Chain', system: 'Excel', activeMin: 300, waitMin: 1440, friction: 'high', note: 'Last four weeks averaged, then adjusted by feel', volume: 52, reworkPct: 18, exceptionPct: 34, data: 'Historic sell-out, promo calendar', impact: 'Forecast accuracy 61%; the single largest cause of stockout' },
      { name: 'Allocate stock to dark stores', owner: 'Head of Supply Chain', system: 'Excel', activeMin: 210, waitMin: 960, friction: 'high', note: 'Pro-rata by last week, overridden for whoever shouted loudest', volume: 52, reworkPct: 22, exceptionPct: 38, data: 'On-hand, in-transit, forecast', impact: '~Rs 24 Cr of demand lost to misallocation and stockouts' },
      { name: 'Raise the replenishment order', owner: 'Supply Chain Executive', system: 'Unicommerce', activeMin: 90, waitMin: 720, friction: 'medium', note: 'Re-keyed from the sheet into the OMS', volume: 52, reworkPct: 9, exceptionPct: 14, data: 'Order lines by store', impact: 'Re-keying errors reach the warehouse unchecked' },
      { name: 'Book the platform appointment', owner: 'Warehouse Coordinator', system: 'Platform portals', activeMin: 120, waitMin: 4320, friction: 'high', note: 'Slots compete with every other brand; no forward booking', volume: 52, reworkPct: 14, exceptionPct: 41, data: 'Appointment confirmation', impact: '~3 days added to every replenishment cycle' },
      { name: 'Dispatch and platform receipt', owner: 'Warehouse Coordinator', system: 'Unicommerce', activeMin: 150, waitMin: 5760, friction: 'medium', note: 'Short-receipts disputed weeks later, if at all', volume: 52, reworkPct: 11, exceptionPct: 19, data: 'Dispatch note, GRN', impact: '~Rs 1.4 Cr a year of unreconciled short receipts' },
    ],
  },
  health: { totalCycle: '9.6 days', activeEffort: '21.5 hours', waitingTime: '9.3 days', people: 4, systems: 5, handoffs: 8 },
  handoffs: {
    chain: ['Platform portals', 'Supply Chain Executive', 'Excel', 'Head of Supply Chain', 'Unicommerce', 'Warehouse Coordinator', 'Platform portals', 'Dark store'],
    totalHandoffs: 8,
    approvalPoints: 1,
    systemTransfers: 6,
    note: 'Every one of the six system transfers is a human copying numbers between a portal and a spreadsheet',
  },
  friction: {
    dimensions: ['Search', 'Data entry', 'Approval', 'Rework', 'Waiting'],
    rows: [
      { step: 'Pull sell-out from portals', levels: ['high', 'high', 'low', 'medium', 'low'] },
      { step: 'Consolidate into the sheet', levels: ['medium', 'high', 'low', 'high', 'medium'] },
      { step: 'Build the forecast', levels: ['medium', 'high', 'medium', 'high', 'high'] },
      { step: 'Allocate to dark stores', levels: ['high', 'high', 'medium', 'high', 'medium'] },
      { step: 'Raise the replenishment order', levels: ['low', 'high', 'low', 'medium', 'medium'] },
      { step: 'Book the appointment', levels: ['high', 'medium', 'low', 'medium', 'high'] },
      { step: 'Dispatch and receipt', levels: ['medium', 'medium', 'low', 'medium', 'high'] },
    ],
    unavailable: [],
  },
  rework: {
    unit: '% of cases',
    causes: [
      { name: 'Platform export format changed', pct: 28 },
      { name: 'Forecast overridden after allocation', pct: 24 },
      { name: 'Appointment slot lost or rescheduled', pct: 21 },
      { name: 'SKU mapping mismatch across platforms', pct: 16 },
      { name: 'Short receipt at the dark store', pct: 11 },
    ],
    note: 'Over half the rework comes from the four platforms being treated as four separate manual processes',
  },
  cost: {
    unit: 'Rs Cr',
    items: [
      { activity: 'Revenue lost to stockouts', value: 24, basis: '18% stockout on 31% of revenue, at contribution margin' },
      { activity: 'Excess and expiring inventory', value: 8, basis: '23% of SKUs overstocked against a 14-month shelf life' },
      { activity: 'Planner and coordinator effort', value: 0.9, basis: '21.5 hours x 52 cycles x loaded cost across 4 people' },
      { activity: 'Unreconciled short receipts', value: 1.4, basis: 'Disputed receipts written off after 90 days' },
      { activity: 'Expedited dispatch premium', value: 0.6, basis: 'Emergency top-ups outside the planned cycle' },
    ],
    unavailable: [],
  },
  peopleSystems: {
    people: 4,
    systems: 5,
    departments: 3,
    chain: [
      { name: 'Platform portals', kind: 'system' },
      { name: 'Supply Chain Executive', kind: 'person' },
      { name: 'Excel', kind: 'system' },
      { name: 'Head of Supply Chain', kind: 'person' },
      { name: 'Unicommerce', kind: 'system' },
      { name: 'Warehouse Coordinator', kind: 'person' },
      { name: 'Platform portals', kind: 'system' },
      { name: 'Dark store', kind: 'person' },
    ],
  },
  rootCause: {
    question: 'Why is dark-store availability 82% when the warehouse is holding Rs 12 Cr of finished goods?',
    branches: [
      'The forecast is weekly and the demand it forecasts is daily',
      'Allocation is pro-rata rather than demand-weighted',
      'Appointment slots are booked reactively, after the order exists',
      'Four platforms are handled as four manual processes',
    ],
    drill: {
      cause: 'The forecast is weekly and the demand it forecasts is daily',
      reasons: [
        'Sell-out data can only be pulled by hand, so it is pulled once a week',
        'A weekly cycle cannot see a SKU going to zero on day three',
        'By the time the plan runs, the store has been empty for four days',
        'Nobody has ever measured lost sales, so the loss is invisible in the P&L',
      ],
    },
  },
  opportunities: [
    { rank: 1, name: 'Daily automated sell-out ingestion', severity: 'high', metrics: [{ k: 'Effort released', v: '7 h per cycle' }, { k: 'Cycle compression', v: '7 days to 1' }, { k: 'Annual impact', v: '~Rs 0.9 Cr' }], note: 'The precondition for everything else in the process' },
    { rank: 2, name: 'Demand-weighted allocation agent', severity: 'high', metrics: [{ k: 'Availability gain', v: '+13 pts' }, { k: 'Share of the pool', v: '76%' }, { k: 'Annual impact', v: '~Rs 24 Cr' }], note: 'The single largest number anywhere in this sprint' },
    { rank: 3, name: 'Forward appointment booking', severity: 'medium', metrics: [{ k: 'Time released', v: '3 days' }, { k: 'Share of cycle', v: '31%' }, { k: 'Annual impact', v: '~Rs 0.6 Cr' }], note: 'A scheduling rule rather than a system; cheapest win in the process' },
    { rank: 4, name: 'Automated receipt reconciliation', severity: 'medium', metrics: [{ k: 'Effort released', v: '2.5 h per cycle' }, { k: 'Recovery', v: '~Rs 1.4 Cr' }, { k: 'Annual impact', v: '~Rs 1.4 Cr' }], note: 'Short receipts currently expire undisputed at 90 days' },
  ],
};
