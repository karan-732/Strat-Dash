import type { PhasePack } from '@/lib/domain/types';

/** Phase 2 — functional value diagnosis. Matches PACK_SHAPES[2]. */
export const PHASE2_PACK: PhasePack = {
  functions: [
    { name: 'Manufacturing and planning', spend: 'Rs 386 Cr', cycleTime: '18 days', costPerTxn: 'Rs 4,900 per order', exceptionRate: '29%', note: 'Three plants planning independently on a monthly forecast' },
    { name: 'Procurement', spend: 'Rs 710 Cr', cycleTime: '46 days', costPerTxn: 'Rs 11,200 per PO', exceptionRate: '14%', note: 'Foam is crude-linked and bought on a fixed calendar' },
    { name: 'Service, last mile and installation', spend: 'Rs 124 Cr', cycleTime: '4 days', costPerTxn: 'Rs 840 per installation', exceptionRate: '26%', note: 'A quarter of first visits do not complete' },
    { name: 'Retail and stores', spend: 'Rs 98 Cr', cycleTime: '—', costPerTxn: 'Rs 1,340 per conversion', exceptionRate: '9%', note: '120 stores, assortment set centrally with no local signal' },
    { name: 'Returns and refurbishment', spend: 'Rs 31 Cr', cycleTime: '11 days', costPerTxn: 'Rs 1,900 per return', exceptionRate: '38%', note: 'Condition graded by eye; scrap is the default disposition' },
  ],
  benchmark: {
    metric: 'Cycle time',
    unit: 'days',
    items: [
      { function: 'Order to installation', actual: 18, benchmark: 9 },
      { function: 'Raw material holding', actual: 46, benchmark: 28 },
      { function: 'Return to disposition', actual: 11, benchmark: 4 },
      { function: 'Production plan cycle', actual: 30, benchmark: 7 },
    ],
    unavailable: [],
  },
  economics: [
    {
      function: 'Manufacturing and planning',
      scale: [{ k: 'Plants', v: '3' }, { k: 'Orders a year', v: '412,000' }, { k: 'Annual cost', v: 'Rs 386 Cr' }],
      efficiency: [{ k: 'Plant utilisation', v: '68%' }, { k: 'Plan cycle', v: 'Monthly' }, { k: 'Cost per order', v: 'Rs 4,900' }],
      quality: [{ k: 'Forecast accuracy', v: '58%' }, { k: 'Plan changed mid-month', v: '71%' }, { k: 'Schedule adherence', v: '64%' }],
      impact: [{ k: 'Finished goods carried', v: '~Rs 34 Cr' }, { k: 'Idle capacity cost', v: '~Rs 11 Cr' }],
    },
    {
      function: 'Service, last mile and installation',
      scale: [{ k: 'Installation crews', v: '340' }, { k: 'Installations a year', v: '148,000' }, { k: 'Annual cost', v: 'Rs 124 Cr' }],
      efficiency: [{ k: 'First-time right', v: '74%' }, { k: 'Visits per installation', v: '1.31' }, { k: 'Cost per visit', v: 'Rs 840' }],
      quality: [{ k: 'Failure coded', v: '0%' }, { k: 'Escalated to service', v: '18%' }],
      impact: [{ k: 'Failed visit cost', v: '~Rs 9 Cr' }, { k: 'Modelled repeat loss', v: '~Rs 19 Cr' }],
    },
    {
      function: 'Procurement',
      scale: [{ k: 'Buyers', v: '18' }, { k: 'Material spend', v: 'Rs 710 Cr' }, { k: 'Foam share', v: '46%' }],
      efficiency: [{ k: 'Raw material days', v: '46' }, { k: 'PO cycle', v: '12 days' }, { k: 'Cost per PO', v: 'Rs 11,200' }],
      quality: [{ k: 'Price vs index', v: '+3.1%' }, { k: 'Emergency buys', v: '14%' }],
      impact: [{ k: 'Timing cost', v: '~Rs 22 Cr' }, { k: 'Raw material held', v: '~Rs 28 Cr' }],
    },
    {
      function: 'Returns and refurbishment',
      scale: [{ k: 'Returns a year', v: '25,100' }, { k: 'Return value', v: 'Rs 19 Cr' }, { k: 'Refurb centres', v: '2' }],
      efficiency: [{ k: 'Return to disposition', v: '11 days' }, { k: 'Refurbished', v: '18%' }],
      quality: [{ k: 'Graded by eye', v: '100%' }, { k: 'Scrapped', v: '61%' }],
      impact: [{ k: 'Recoverable value forgone', v: '~Rs 19 Cr' }, { k: 'Reverse logistics cost', v: '~Rs 5 Cr' }],
    },
  ],
  painHeatmap: {
    dimensions: ['Cycle time', 'Manual effort', 'Errors', 'Rework', 'Exceptions', 'Cost'],
    rows: [
      { function: 'Manufacturing and planning', levels: ['high', 'high', 'high', 'high', 'high', 'high'] },
      { function: 'Service and installation', levels: ['medium', 'high', 'high', 'high', 'high', 'high'] },
      { function: 'Procurement', levels: ['high', 'medium', 'low', 'low', 'medium', 'high'] },
      { function: 'Returns and refurbishment', levels: ['high', 'high', 'medium', 'medium', 'high', 'medium'] },
      { function: 'Retail and stores', levels: ['low', 'medium', 'low', 'low', 'low', 'medium'] },
    ],
    unavailable: [],
  },
  opportunityMap: {
    unit: 'Rs Cr',
    items: [
      { name: 'Capacity-aware date promising', pain: 91, value: 94, atStake: 34 },
      { name: 'First-time-right installation agent', pain: 86, value: 88, atStake: 28 },
      { name: 'Index-linked buying window', pain: 54, value: 76, atStake: 22 },
      { name: 'Return grading and resale', pain: 74, value: 71, atStake: 19 },
      { name: 'Store assortment signal', pain: 48, value: 58, atStake: 14 },
      { name: 'Three-plant network planning', pain: 88, value: 81, atStake: 11 },
    ],
    unavailable: [],
  },
  valueRanking: {
    unit: 'Rs Cr',
    items: [
      { name: 'Capacity-aware date promising', value: 34, basis: 'Rs 34 Cr finished goods at a 60% reduction plus utilisation gain on released capacity' },
      { name: 'First-time-right installation agent', value: 28, basis: '26% failed visits x 148,000 installations x Rs 2,400, plus modelled repeat loss' },
      { name: 'Index-linked buying window', value: 22, basis: '3.1% of Rs 710 Cr material spend at the observed index swing' },
      { name: 'Return grading and resale', value: 19, basis: 'Rs 19 Cr of returns at a 55% recovery rate against the current scrap default' },
      { name: 'Store assortment signal', value: 14, basis: '4 points of store conversion on the footfall base at current AOV' },
    ],
    unavailable: [],
  },
  scoring: {
    dimensions: ['Business value', 'Process pain', 'AI suitability', 'Feasibility', 'Change complexity'],
    items: [
      { name: 'Capacity-aware date promising', scores: [10, 9, 8, 7, 7] },
      { name: 'First-time-right installation agent', scores: [9, 9, 9, 8, 5] },
      { name: 'Index-linked buying window', scores: [8, 5, 7, 8, 4] },
      { name: 'Return grading and resale', scores: [7, 7, 9, 8, 4] },
      { name: 'Three-plant network planning', scores: [6, 9, 8, 5, 9] },
      { name: 'Store assortment signal', scores: [5, 5, 7, 7, 4] },
    ],
    unavailable: [],
  },
  priorityMatrix: {
    items: [
      { name: 'Capacity-aware date promising', feasibility: 68, value: 94 },
      { name: 'First-time-right installation agent', feasibility: 81, value: 88 },
      { name: 'Index-linked buying window', feasibility: 84, value: 76 },
      { name: 'Return grading and resale', feasibility: 79, value: 71 },
      { name: 'Three-plant network planning', feasibility: 46, value: 81 },
      { name: 'Store assortment signal', feasibility: 72, value: 58 },
    ],
    unavailable: [],
  },
  leakage: {
    unit: 'Rs Cr',
    base: { label: 'Current functional cost', value: 1349 },
    steps: [
      { name: 'Finished goods built to forecast', value: 34 },
      { name: 'Failed installation visits', value: 28 },
      { name: 'Material purchase timing', value: 22 },
      { name: 'Returns scrapped rather than recovered', value: 19 },
      { name: 'Store assortment mismatch', value: 14 },
    ],
    recoverable: { label: 'Potential value pool', value: 117 },
    unavailable: [],
  },
  topOpportunities: [
    { rank: 1, name: 'Order promise to production plan', valuePool: 'Rs 34 Cr', pain: 'High', aiSuitability: 'High', feasibility: 'Medium', next: 'Forensic analysis', note: 'Largest pool and the root of both the inventory and the delivery problem' },
    { rank: 2, name: 'Installation first-visit completion', valuePool: 'Rs 28 Cr', pain: 'High', aiSuitability: 'High', feasibility: 'High', next: 'Forensic analysis', note: 'Second largest, cleanest to build, and the customer sees it immediately' },
    { rank: 3, name: 'Foam and timber buying window', valuePool: 'Rs 22 Cr', pain: 'Medium', aiSuitability: 'Medium', feasibility: 'High', next: 'Parked for Phase 5', note: 'High value and easy to build, but Procurement disputes the leak exists' },
    { rank: 4, name: 'Return grading and disposition', valuePool: 'Rs 19 Cr', pain: 'High', aiSuitability: 'High', feasibility: 'High', next: 'Forensic analysis', note: 'Vision grading is a solved problem and the return pile already exists in two centres' },
  ],
};
