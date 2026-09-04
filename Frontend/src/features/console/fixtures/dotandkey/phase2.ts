import type { PhasePack } from '@/lib/domain/types';

/** Phase 2 — functional value diagnosis. Matches PACK_SHAPES[2]. */
export const PHASE2_PACK: PhasePack = {
  functions: [
    { name: 'Supply chain and planning', spend: 'Rs 18 Cr', cycleTime: '7 days', costPerTxn: 'Rs 2,100 per replenishment cycle', exceptionRate: '34%', note: 'One weekly spreadsheet allocates every SKU to every dark store' },
    { name: 'Ecommerce and quick commerce', spend: 'Rs 26 Cr', cycleTime: '2 days', costPerTxn: 'Rs 61 per order', exceptionRate: '18%', note: 'Availability is read from four platform portals by hand' },
    { name: 'Growth and marketing', spend: 'Rs 140 Cr', cycleTime: '1 day', costPerTxn: 'Rs 480 CAC', exceptionRate: '—', note: 'The largest cost line, allocated on platform-reported ROAS' },
    { name: 'Operations and manufacturing', spend: 'Rs 132 Cr', cycleTime: '42 days', costPerTxn: 'Rs 84 per unit', exceptionRate: '11%', note: 'Four partners, none integrated; POs by email' },
    { name: 'Customer care and returns', spend: 'Rs 9 Cr', cycleTime: '3 days', costPerTxn: 'Rs 140 per ticket', exceptionRate: '26%', note: 'Return reasons captured as free text and never analysed' },
  ],
  benchmark: {
    metric: 'Cycle time',
    unit: 'days',
    items: [
      { function: 'Replenishment planning', actual: 7, benchmark: 1 },
      { function: 'Production lead time', actual: 42, benchmark: 28 },
      { function: 'Return resolution', actual: 3, benchmark: 1 },
      { function: 'Marketplace reconciliation', actual: 5, benchmark: 1 },
    ],
    unavailable: [],
  },
  economics: [
    {
      function: 'Supply chain and planning',
      scale: [{ k: 'Planners', v: '4' }, { k: 'Active SKUs', v: '96' }, { k: 'Dark stores served', v: '1,840' }],
      efficiency: [{ k: 'Planning cycle', v: '7 days' }, { k: 'SKU-store combinations', v: '~176,000' }, { k: 'Forecast accuracy', v: '61%' }],
      quality: [{ k: 'Stockout rate', v: '18%' }, { k: 'Overstock SKUs', v: '23%' }, { k: 'Plan overridden', v: '34%' }],
      impact: [{ k: 'Lost revenue', v: '~Rs 24 Cr' }, { k: 'Excess inventory', v: '~Rs 12 Cr' }],
    },
    {
      function: 'Growth and marketing',
      scale: [{ k: 'Marketers', v: '11' }, { k: 'Annual spend', v: 'Rs 140 Cr' }, { k: 'Active campaigns', v: '~220' }],
      efficiency: [{ k: 'Blended CAC', v: 'Rs 480' }, { k: 'Marketing intensity', v: '34%' }, { k: 'AOV', v: 'Rs 745' }],
      quality: [{ k: 'Repeat rate', v: '27%' }, { k: 'Attribution', v: 'Last click only' }, { k: 'Creative tested', v: '~8%' }],
      impact: [{ k: 'Spend with no incremental read', v: '~Rs 16 Cr' }, { k: '12-month cohort contribution', v: 'Rs 310' }],
    },
    {
      function: 'Operations and manufacturing',
      scale: [{ k: 'Co-manufacturers', v: '4' }, { k: 'Batches a year', v: '410' }, { k: 'Units a year', v: '15.7 M' }],
      efficiency: [{ k: 'Lead time', v: '42 days' }, { k: 'Batches on time', v: '68%' }, { k: 'Cost per unit', v: 'Rs 84' }],
      quality: [{ k: 'QC rejection', v: '2.4%' }, { k: 'Batch rework', v: '5.1%' }],
      impact: [{ k: 'Inventory carried', v: '~Rs 12 Cr' }, { k: 'Write-off', v: '~Rs 3.4 Cr' }],
    },
    {
      function: 'Customer care and returns',
      scale: [{ k: 'Agents', v: '14' }, { k: 'Tickets a month', v: '11,400' }, { k: 'Returns a month', v: '4,900' }],
      efficiency: [{ k: 'Resolution time', v: '3 days' }, { k: 'First contact resolution', v: '58%' }],
      quality: [{ k: 'Return and RTO', v: '9.4%' }, { k: 'Reason coded', v: '0%' }],
      impact: [{ k: 'Returned stock value', v: '~Rs 6 Cr' }, { k: 'Product signal lost', v: 'Not quantified' }],
    },
  ],
  painHeatmap: {
    dimensions: ['Cycle time', 'Manual effort', 'Errors', 'Rework', 'Exceptions', 'Cost'],
    rows: [
      { function: 'Supply chain and planning', levels: ['high', 'high', 'high', 'high', 'high', 'medium'] },
      { function: 'Ecommerce and quick commerce', levels: ['medium', 'high', 'medium', 'medium', 'high', 'medium'] },
      { function: 'Growth and marketing', levels: ['low', 'high', 'medium', 'medium', 'low', 'high'] },
      { function: 'Operations and manufacturing', levels: ['high', 'medium', 'low', 'medium', 'medium', 'high'] },
      { function: 'Customer care and returns', levels: ['medium', 'high', 'medium', 'high', 'high', 'low'] },
    ],
    unavailable: [],
  },
  opportunityMap: {
    unit: 'Rs Cr',
    items: [
      { name: 'Dark-store replenishment agent', pain: 92, value: 96, atStake: 24 },
      { name: 'Marketing incrementality engine', pain: 64, value: 82, atStake: 16 },
      { name: 'Demand-linked production planning', pain: 78, value: 71, atStake: 12 },
      { name: 'Return reason intelligence', pain: 71, value: 54, atStake: 6 },
      { name: 'Parallel launch workflow', pain: 66, value: 48, atStake: 5 },
      { name: 'Marketplace reconciliation automation', pain: 81, value: 34, atStake: 2 },
      { name: 'Regimen and repeat engine', pain: 44, value: 68, atStake: 9 },
    ],
    unavailable: [],
  },
  valueRanking: {
    unit: 'Rs Cr',
    items: [
      { name: 'Dark-store replenishment agent', value: 24, basis: '13 points of availability x Rs 1.8 Cr a point at current quick-commerce mix' },
      { name: 'Marketing incrementality engine', value: 16, basis: '8 points of marketing intensity on Rs 412 Cr, net of assumed volume loss' },
      { name: 'Demand-linked production planning', value: 12, basis: 'Rs 12 Cr finished goods at 40% reduction plus Rs 3.4 Cr write-off avoidance' },
      { name: 'Regimen and repeat engine', value: 9, basis: '13 points of repeat on the active base at current AOV and gross margin' },
      { name: 'Return reason intelligence', value: 6, basis: '9.4% to 6% return rate on the addressable share of orders' },
      { name: 'Parallel launch workflow', value: 5, basis: '14 weeks earlier to shelf on 6 launches a year at first-season run rate' },
    ],
    unavailable: [],
  },
  scoring: {
    dimensions: ['Business value', 'Process pain', 'AI suitability', 'Feasibility', 'Change complexity'],
    items: [
      { name: 'Dark-store replenishment agent', scores: [10, 9, 9, 8, 5] },
      { name: 'Marketing incrementality engine', scores: [8, 6, 8, 6, 8] },
      { name: 'Demand-linked production planning', scores: [7, 8, 8, 6, 6] },
      { name: 'Return reason intelligence', scores: [6, 7, 9, 9, 3] },
      { name: 'Regimen and repeat engine', scores: [7, 4, 7, 7, 5] },
      { name: 'Marketplace reconciliation automation', scores: [3, 8, 6, 9, 2] },
    ],
    unavailable: [],
  },
  priorityMatrix: {
    items: [
      { name: 'Dark-store replenishment agent', feasibility: 81, value: 96 },
      { name: 'Marketing incrementality engine', feasibility: 58, value: 82 },
      { name: 'Demand-linked production planning', feasibility: 62, value: 71 },
      { name: 'Return reason intelligence', feasibility: 91, value: 54 },
      { name: 'Regimen and repeat engine', feasibility: 72, value: 68 },
      { name: 'Marketplace reconciliation automation', feasibility: 94, value: 34 },
    ],
    unavailable: [],
  },
  leakage: {
    unit: 'Rs Cr',
    base: { label: 'Current functional cost', value: 325 },
    steps: [
      { name: 'Stockout revenue loss', value: 24 },
      { name: 'Non-incremental marketing spend', value: 16 },
      { name: 'Excess and obsolete inventory', value: 12 },
      { name: 'Return and RTO cost', value: 6 },
      { name: 'Deferred launch revenue', value: 5 },
    ],
    recoverable: { label: 'Potential value pool', value: 63 },
    unavailable: [],
  },
  topOpportunities: [
    { rank: 1, name: 'Dark-store replenishment planning', valuePool: 'Rs 24 Cr', pain: 'High', aiSuitability: 'High', feasibility: 'High', next: 'Forensic analysis', note: 'Largest pool, cleanest data, and the CEO has already named it the priority' },
    { rank: 2, name: 'Marketing spend allocation', valuePool: 'Rs 16 Cr', pain: 'Medium', aiSuitability: 'High', feasibility: 'Medium', next: 'Parked for Phase 5', note: 'High value but the Head of Growth reads it as an audit; needs sequencing after a win' },
    { rank: 3, name: 'Production planning to co-manufacturer', valuePool: 'Rs 12 Cr', pain: 'High', aiSuitability: 'Medium', feasibility: 'Medium', next: 'Forensic analysis', note: 'Downstream of replenishment — the same forecast drives both' },
    { rank: 4, name: 'Return reason coding', valuePool: 'Rs 6 Cr', pain: 'High', aiSuitability: 'High', feasibility: 'High', next: 'Forensic analysis', note: 'Smallest pool but the cheapest build in the portfolio and it feeds product' },
  ],
};
