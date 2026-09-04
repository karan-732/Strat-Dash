import type { PhasePack } from '@/lib/domain/types';

/** Phase 3 — process intelligence, on purchase order to goods release. Matches PACK_SHAPES[3]. */
export const PHASE3_PACK: PhasePack = {
  twin: {
    name: 'Purchase order to goods release',
    steps: [
      { name: 'Indent raised', owner: 'Project Engineer', system: 'ERP', activeMin: 25, waitMin: 1440, friction: 'medium', note: 'Raised against a BOM that may still be revised', volume: 340, reworkPct: 14, exceptionPct: 9, data: 'BOM line, project code, required-by date', impact: '~Rs 1.2 Cr a year of premature commitment' },
      { name: 'Indent approval', owner: 'Project Manager', system: 'Email', activeMin: 10, waitMin: 2880, friction: 'high', note: 'Sits in an inbox; no escalation rule', volume: 340, reworkPct: 4, exceptionPct: 12, data: 'Approval mail thread', impact: '~2 days added to every line' },
      { name: 'RFQ to vendors', owner: 'Buyer', system: 'Email', activeMin: 55, waitMin: 5760, friction: 'high', note: 'Three quotes re-requested by hand each time', volume: 290, reworkPct: 22, exceptionPct: 18, data: 'Vendor list, drawings, specification', impact: '~Rs 2.4 Cr of buyer effort a year' },
      { name: 'Quote comparison', owner: 'Buyer', system: 'Excel', activeMin: 70, waitMin: 480, friction: 'high', note: 'Comparative statement rebuilt from scratch per RFQ', volume: 290, reworkPct: 17, exceptionPct: 11, data: 'Quotes, historic rates', impact: 'Price variance of ±7% against the last order' },
      { name: 'PO release', owner: 'Head of Materials', system: 'ERP', activeMin: 20, waitMin: 2160, friction: 'medium', note: 'Second approval gate above Rs 5 L', volume: 290, reworkPct: 6, exceptionPct: 8, data: 'PO document', impact: '1.5 days on high-value long-lead items' },
      { name: 'Expediting', owner: 'Buyer', system: 'Phone', activeMin: 90, waitMin: 20160, friction: 'high', note: 'Chased manually; no vendor visibility', volume: 210, reworkPct: 12, exceptionPct: 31, data: 'Vendor promises, none recorded in ERP', impact: '~Rs 3 Cr a year of expedite premium' },
      { name: 'Goods receipt and issue to site', owner: 'Store Keeper', system: 'ERP', activeMin: 45, waitMin: 34560, friction: 'high', note: 'Material lands weeks before the site can take it', volume: 290, reworkPct: 3, exceptionPct: 7, data: 'GRN, issue slip', impact: '~Rs 12 Cr held as WIP across live projects' },
    ],
  },
  health: { totalCycle: '46 days', activeEffort: '5.3 hours', waitingTime: '45.8 days', people: 6, systems: 4, handoffs: 9 },
  handoffs: {
    chain: ['Project Engineer', 'Project Manager', 'Buyer', 'Vendor', 'Head of Materials', 'Vendor', 'Store Keeper', 'Site'],
    totalHandoffs: 9,
    approvalPoints: 2,
    systemTransfers: 6,
    note: 'Six of the nine handoffs move data between ERP, Excel, email and phone with no integration',
  },
  friction: {
    dimensions: ['Search', 'Data entry', 'Approval', 'Rework', 'Waiting'],
    rows: [
      { step: 'Indent raised', levels: ['medium', 'high', 'low', 'medium', 'high'] },
      { step: 'Indent approval', levels: ['low', 'low', 'high', 'low', 'high'] },
      { step: 'RFQ to vendors', levels: ['high', 'high', 'low', 'high', 'high'] },
      { step: 'Quote comparison', levels: ['high', 'high', 'low', 'high', 'medium'] },
      { step: 'PO release', levels: ['low', 'medium', 'high', 'low', 'high'] },
      { step: 'Expediting', levels: ['high', 'medium', 'low', 'medium', 'high'] },
      { step: 'Goods receipt and issue', levels: ['medium', 'medium', 'low', 'low', 'high'] },
    ],
    unavailable: [],
  },
  rework: {
    unit: '% of cases',
    causes: [
      { name: 'BOM revised after indent', pct: 31 },
      { name: 'Specification incomplete in RFQ', pct: 24 },
      { name: 'Vendor quote missing a line', pct: 18 },
      { name: 'Wrong project code', pct: 14 },
      { name: 'Duplicate indent', pct: 13 },
    ],
    note: 'Two-thirds of rework originates upstream of procurement, in engineering',
  },
  cost: {
    unit: 'Rs Cr',
    items: [
      { activity: 'Goods held as WIP', value: 12, basis: '290 receipts x average 24 days early x carrying cost' },
      { activity: 'Expedite premium', value: 3, basis: '210 expedited lines x average 4.6% premium' },
      { activity: 'Buyer effort on RFQ and comparison', value: 2.4, basis: '290 RFQs x 2.1 hours x loaded buyer cost' },
      { activity: 'Rework across the chain', value: 1.8, basis: '17% of lines reworked x average 1.4 hours' },
      { activity: 'Approval waiting', value: 1.2, basis: '3.5 days average delay x schedule cost per day' },
    ],
    unavailable: [],
  },
  peopleSystems: {
    people: 6,
    systems: 4,
    departments: 4,
    chain: [
      { name: 'Project Engineer', kind: 'person' },
      { name: 'ERP', kind: 'system' },
      { name: 'Project Manager', kind: 'person' },
      { name: 'Email', kind: 'system' },
      { name: 'Buyer', kind: 'person' },
      { name: 'Excel', kind: 'system' },
      { name: 'Head of Materials', kind: 'person' },
      { name: 'ERP', kind: 'system' },
      { name: 'Store Keeper', kind: 'person' },
      { name: 'Site', kind: 'person' },
    ],
  },
  rootCause: {
    question: 'Why does purchase order to goods release take 46 days when the active effort is 5.3 hours?',
    branches: [
      'Approvals sit in inboxes with no escalation',
      'RFQ and comparison are rebuilt by hand every time',
      'Expediting depends on phone calls with nothing recorded',
      'Material is ordered against a BOM that is still moving',
    ],
    drill: {
      cause: 'Material is ordered against a BOM that is still moving',
      reasons: [
        'Engineering releases drawings in stages, not as one pack',
        'Procurement hedges schedule risk by starting on the first release',
        'A revision after order means either rework or scrap',
        'Nobody owns the point at which a BOM is frozen',
      ],
    },
  },
  opportunities: [
    { rank: 1, name: 'Freeze the BOM before the first RFQ', severity: 'high', metrics: [{ k: 'Effort released', v: '1.4 h per line' }, { k: 'Share of rework', v: '31%' }, { k: 'Annual impact', v: '~Rs 4 Cr' }], note: 'Fixes procurement rework at its engineering source' },
    { rank: 2, name: 'Agent-drafted RFQ and comparative statement', severity: 'high', metrics: [{ k: 'Effort released', v: '2.1 h per RFQ' }, { k: 'Share of cycle', v: '18%' }, { k: 'Annual impact', v: '~Rs 2.4 Cr' }], note: 'Vendor list, spec and historic rates all already exist in the ERP' },
    { rank: 3, name: 'Auto-escalating approvals', severity: 'medium', metrics: [{ k: 'Time released', v: '3.5 days' }, { k: 'Share of cycle', v: '8%' }, { k: 'Annual impact', v: '~Rs 1.2 Cr' }], note: 'A rule, not a system — the cheapest win in the process' },
    { rank: 4, name: 'Release-to-site scheduling', severity: 'high', metrics: [{ k: 'WIP released', v: '24 days' }, { k: 'Share of cycle', v: '52%' }, { k: 'Annual impact', v: '~Rs 12 Cr' }], note: 'The single largest number in the process' },
  ],
};
