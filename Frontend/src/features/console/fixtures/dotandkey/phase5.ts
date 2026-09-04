import type { PhasePack } from '@/lib/domain/types';

/** Phase 5 — business case and portfolio. Matches PACK_SHAPES[5]. */
export const PHASE5_PACK: PhasePack = {
  totals: { valueAtStake: 'Rs 63 Cr', investment: 'Rs 9.2 Cr', payback: '11 months', hurdle: '22% IRR' },
  cases: [
    { initiative: 'Dark-store replenishment agent', investment: 'Rs 3.1 Cr', annualValue: 'Rs 24 Cr', payback: '5 months', confidence: 'High', basis: '13 points of availability x Rs 1.8 Cr a point, against build, platform integration and first-year run' },
    { initiative: 'Marketing incrementality engine', investment: 'Rs 2.2 Cr', annualValue: 'Rs 16 Cr', payback: '12 months', confidence: 'Medium', basis: '8 points of marketing intensity on Rs 412 Cr, net of assumed volume loss on withdrawn spend' },
    { initiative: 'Demand-linked production planning', investment: 'Rs 1.8 Cr', annualValue: 'Rs 12 Cr', payback: '10 months', confidence: 'High', basis: 'Rs 5 Cr working capital release plus Rs 3.4 Cr write-off avoidance and Rs 3.6 Cr of expedite and rate benefit' },
    { initiative: 'Regimen and repeat engine', investment: 'Rs 1.4 Cr', annualValue: 'Rs 9 Cr', payback: '14 months', confidence: 'Low', basis: '13 points of repeat on the active base; depends on a product mechanic leadership has not yet chosen' },
    { initiative: 'Return reason intelligence', investment: 'Rs 0.7 Cr', annualValue: 'Rs 6 Cr', payback: '7 months', confidence: 'Medium', basis: '9.4% to 6% return rate on the addressable share of orders' },
  ],
  portfolio: {
    now: ['Dark-store replenishment agent', 'Return reason intelligence'],
    next: ['Demand-linked production planning', 'Marketing incrementality engine'],
    later: ['Regimen and repeat engine', 'Parallel launch workflow'],
    decline: ['Marketplace reconciliation automation', 'Contract manufacturer consolidation'],
  },
  sequence: [
    { period: 'Q1', milestone: 'Replenishment agent live on Blinkit and Zepto, top 20 SKUs', dependency: 'Platform API access granted and SKU master mapped' },
    { period: 'Q1', milestone: 'Return reason taxonomy live in Freshdesk', dependency: 'Customer care agrees the coding scheme' },
    { period: 'Q2', milestone: 'Replenishment agent extended to all four platforms and 96 SKUs', dependency: 'Q1 service level holds above 92%' },
    { period: 'Q3', milestone: 'Production plan driven by the same forecast', dependency: 'Co-manufacturers accept a rolling schedule feed' },
    { period: 'Q4', milestone: 'Incrementality testing framework in market', dependency: 'Head of Growth co-owns the design, not just the result' },
  ],
  kpis: [
    { kpi: 'Dark-store availability', baseline: '82%', target: '95%', owner: 'Head of Ecommerce' },
    { kpi: 'Forecast accuracy', baseline: '61%', target: '84%', owner: 'Head of Supply Chain' },
    { kpi: 'Finished-goods inventory', baseline: 'Rs 12 Cr', target: 'Rs 7 Cr', owner: 'Chief Financial Officer' },
    { kpi: 'Return and RTO rate', baseline: '9.4%', target: '6%', owner: 'Customer Care Lead' },
    { kpi: 'Marketing intensity', baseline: '34%', target: '26%', owner: 'Head of Growth' },
  ],
  bridge: {
    unit: 'Rs Cr',
    items: [
      { k: 'Revenue lost to stockouts', current: 24, future: 4 },
      { k: 'Non-incremental marketing spend', current: 16, future: 6 },
      { k: 'Excess and obsolete inventory', current: 12, future: 5 },
      { k: 'Return and RTO cost', current: 6, future: 2.4 },
      { k: 'Deferred launch revenue', current: 5, future: 2 },
      { k: 'Manual planning effort', current: 0.9, future: 0.2 },
    ],
  },
  investment: {
    unit: 'Rs Cr',
    items: [
      { k: 'Build', v: 3.6 },
      { k: 'Integration', v: 2.4 },
      { k: 'Infrastructure', v: 0.7 },
      { k: 'Licences', v: 0.9 },
      { k: 'Change management', v: 0.9 },
      { k: 'Ongoing run cost', v: 0.7 },
    ],
  },
  scope: [
    {
      initiative: 'Dark-store replenishment agent',
      objective: 'Take dark-store availability from 82% to 95% and stop losing Rs 24 Cr a year to stores that are simply empty',
      users: 'Four supply chain planners and the warehouse coordination team, replacing the weekly spreadsheet cycle entirely',
      requirements: ['Continuous sell-out ingestion across four platforms', 'Daily forecast per store-SKU', 'Demand-weighted allocation with stated reasoning', 'Autonomous order release inside a cover band', 'Forward appointment booking', 'Exception queue with override logging'],
      aiRequirements: ['Per store-SKU demand forecasting on short, sparse history', 'Constrained allocation optimisation across 176,000 combinations', 'Anomaly and cannibalisation detection at launch', 'Short-receipt dispute drafting'],
      data: ['Sell-out by store, SKU and day, 6 months minimum', 'On-hand and in-transit by dark store', 'Promo and campaign calendar', 'SKU master mapped across all four platforms'],
      kpis: ['Availability 82% → 95%', 'Forecast accuracy 61% → 84%', 'Planning cycle 9.6d → 1.2d', 'Finished goods Rs 12 Cr → Rs 7 Cr'],
      timeline: '16 weeks to live on two platforms and the top 20 SKUs',
      team: '1 FDE, 1 AI engineer, 1 data engineer, Head of Supply Chain as owner',
      commercial: 'Rs 3.1 Cr build, integration and first-year run',
    },
    {
      initiative: 'Return reason intelligence',
      objective: 'Turn 4,900 free-text returns a month into a coded product signal, and cut the return rate from 9.4% to 6%',
      users: 'Customer care agents and the product team, who currently receive nothing back from returns at all',
      requirements: ['Return reason taxonomy', 'Automatic coding of free-text and ticket history', 'SKU-level return dashboard', 'Monthly signal pack into product review'],
      aiRequirements: ['Free-text classification into the taxonomy', 'Review and ticket sentiment linkage by SKU', 'Emerging-issue detection before it reaches scale'],
      data: ['24 months of return and RTO logs', 'Freshdesk ticket history', 'Marketplace and site review text', 'SKU and batch master'],
      kpis: ['Return and RTO 9.4% → 6%', 'Reason coded 0% → 95%', 'Time to detect a product issue'],
      timeline: '9 weeks, with the taxonomy live at week 4',
      team: '1 AI engineer, 0.5 FDE, Customer Care Lead as owner',
      commercial: 'Rs 0.7 Cr build and first-year run',
    },
  ],
};
