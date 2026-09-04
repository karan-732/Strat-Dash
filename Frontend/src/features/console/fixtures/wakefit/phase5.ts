import type { PhasePack } from '@/lib/domain/types';

/** Phase 5 — business case and portfolio. Matches PACK_SHAPES[5]. */
export const PHASE5_PACK: PhasePack = {
  totals: { valueAtStake: 'Rs 117 Cr', investment: 'Rs 14.6 Cr', payback: '13 months', hurdle: '20% IRR' },
  cases: [
    { initiative: 'Capacity-aware promise and network planning agent', investment: 'Rs 5.8 Cr', annualValue: 'Rs 34 Cr', payback: '12 months', confidence: 'Medium', basis: 'Rs 20 Cr working capital release plus Rs 11 Cr of released capacity and Rs 4 Cr of expedite avoidance' },
    { initiative: 'First-time-right installation agent', investment: 'Rs 3.2 Cr', annualValue: 'Rs 28 Cr', payback: '7 months', confidence: 'High', basis: '26% failed visits x 148,000 installations x Rs 2,400, plus modelled repeat purchase recovery' },
    { initiative: 'Index-linked buying window', investment: 'Rs 1.1 Cr', annualValue: 'Rs 22 Cr', payback: '4 months', confidence: 'Low', basis: '3.1% of Rs 710 Cr material spend; Procurement disputes the leak and the figure is ours, not theirs' },
    { initiative: 'Return grading and resale channel', investment: 'Rs 2.6 Cr', annualValue: 'Rs 19 Cr', payback: '10 months', confidence: 'Medium', basis: 'Rs 19 Cr of returns at a 55% recovery rate against the current 61% scrap default' },
    { initiative: 'Store assortment signal', investment: 'Rs 1.9 Cr', annualValue: 'Rs 14 Cr', payback: '16 months', confidence: 'Low', basis: '4 points of store conversion on the footfall base; depends on store-level data that is not yet captured' },
  ],
  portfolio: {
    now: ['First-time-right installation agent', 'Return grading and resale channel'],
    next: ['Capacity-aware promise and network planning agent'],
    later: ['Index-linked buying window', 'Store assortment signal'],
    decline: ['Second shift at Hosur', 'SAP APS module revival'],
  },
  sequence: [
    { period: 'Q1', milestone: 'Installation agent live in Bengaluru and Hyderabad', dependency: 'Crew skill matrix built and van stock recorded' },
    { period: 'Q1', milestone: 'Return grading live at both refurbishment centres', dependency: 'Condition grade taxonomy agreed with Service' },
    { period: 'Q2', milestone: 'Installation agent across all 340 crews', dependency: 'Q1 first-time-right holds above 88%' },
    { period: 'Q3', milestone: 'Capacity model live, promise still shown as a range', dependency: 'SAP master data cleaned across all three plants' },
    { period: 'Q4', milestone: 'Capacity-aware date live at checkout', dependency: 'Head of Manufacturing signs off network planning' },
  ],
  kpis: [
    { kpi: 'On-time installation', baseline: '74%', target: '92%', owner: 'Head of Service' },
    { kpi: 'Promised lead time', baseline: '18 days', target: '9 days', owner: 'Head of Manufacturing' },
    { kpi: 'Plant utilisation', baseline: '68%', target: '82%', owner: 'Head of Manufacturing' },
    { kpi: 'Finished-goods inventory', baseline: 'Rs 34 Cr', target: 'Rs 14 Cr', owner: 'Chief Financial Officer' },
    { kpi: 'Return recovery rate', baseline: '18%', target: '55%', owner: 'Head of Service' },
  ],
  bridge: {
    unit: 'Rs Cr',
    items: [
      { k: 'Finished goods built to forecast', current: 34, future: 14 },
      { k: 'Failed installation visits', current: 28, future: 8 },
      { k: 'Material purchase timing', current: 22, future: 14 },
      { k: 'Returns scrapped not recovered', current: 19, future: 8 },
      { k: 'Store assortment mismatch', current: 14, future: 9 },
      { k: 'Idle plant capacity', current: 11, future: 4 },
    ],
  },
  investment: {
    unit: 'Rs Cr',
    items: [
      { k: 'Build', v: 5.4 },
      { k: 'Integration', v: 3.8 },
      { k: 'Infrastructure', v: 1.1 },
      { k: 'Licences', v: 1.2 },
      { k: 'Change management', v: 2.0 },
      { k: 'Ongoing run cost', v: 1.1 },
    ],
  },
  scope: [
    {
      initiative: 'First-time-right installation agent',
      objective: 'Take first-visit completion from 74% to 92% and stop paying twice for a quarter of all installations',
      users: '340 installation crews and the regional service coordinators who currently assign them by availability',
      requirements: ['Crew skill matrix by product configuration', 'Van stock and part visibility', 'Skill-matched assignment at route build', 'Coded failure capture in the delivery app', 'Automatic re-book and re-promise on failure'],
      aiRequirements: ['Crew and skill matching against order configuration', 'Failure prediction before despatch', 'Free-text failure reason classification', 'Route and window optimisation'],
      data: ['12 months of installation outcomes with reasons', 'Crew roster, skill and training records', 'Van stock and part consumption', 'Order configuration and BOM'],
      kpis: ['First-time right 74% → 92%', 'Visits per installation 1.31 → 1.09', 'Failure coded 0% → 95%'],
      timeline: '14 weeks to live in two cities',
      team: '1 FDE, 1 AI engineer, Head of Service as owner, 1 regional coordinator',
      commercial: 'Rs 3.2 Cr build, integration and first-year run',
    },
    {
      initiative: 'Return grading and resale channel',
      objective: 'Stop scrapping 61% of a Rs 19 Cr return pile that is largely re-sellable',
      users: 'Two refurbishment centres and the resale channel team, replacing grading by eye',
      requirements: ['Structured condition grade taxonomy', 'Image-based grading at intake', 'Disposition rules by grade and SKU', 'Resale channel listing and pricing', 'Recovery value reporting'],
      aiRequirements: ['Image-based damage and condition grading', 'Disposition recommendation by expected recovery', 'Resale price setting against the live secondary market'],
      data: ['24 months of return logs with disposition', 'Return intake images', 'Refurbishment cost by activity', 'Secondary market price observations'],
      kpis: ['Recovery rate 18% → 55%', 'Return to disposition 11d → 4d', 'Scrap rate 61% → 24%'],
      timeline: '12 weeks across both centres',
      team: '1 AI engineer, 1 FDE, Head of Service as owner',
      commercial: 'Rs 2.6 Cr build and first-year run',
    },
  ],
};
