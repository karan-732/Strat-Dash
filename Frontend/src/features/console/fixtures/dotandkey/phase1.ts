import type { PhasePack } from '@/lib/domain/types';

/** Phase 1 — leadership alignment. Matches PACK_SHAPES[1]. */
export const PHASE1_PACK: PhasePack = {
  northStar: [
    { metric: 'EBITDA margin', direction: 'up', current: '7.9%', target: '15%', gap: '+7.1 pts', note: 'CEO frames this as the number that decides the next raise' },
    { metric: 'Dark-store availability', direction: 'up', current: '82%', target: '95%', gap: '+13 pts', note: 'Head of Ecommerce: every point is roughly Rs 1.8 Cr of annual revenue' },
    { metric: 'Repeat rate', direction: 'up', current: '27%', target: '40%', gap: '+13 pts', note: 'The only structural answer to a rising CAC' },
    { metric: 'Marketing intensity', direction: 'down', current: '34%', target: '26%', gap: '-8 pts', note: 'CFO wants this in absolute terms, not just as a ratio' },
    { metric: 'Launch cycle time', direction: 'down', current: '34 weeks', target: '20 weeks', gap: '-14 weeks', note: 'Head of Product disputes this is achievable with one lab partner' },
  ],
  benchmark: {
    xLabel: 'Revenue growth (%)',
    yLabel: 'EBITDA margin (%)',
    xMin: 0,
    xMax: 100,
    yMin: -10,
    yMax: 20,
    points: [
      { name: 'Dot & Key', x: 38.4, y: 7.9, self: true, leader: false },
      { name: 'Minimalist', x: 45, y: 14, self: false, leader: true },
      { name: 'The Derma Co', x: 32, y: 11, self: false, leader: false },
      { name: 'Plum', x: 28, y: 5, self: false, leader: false },
      { name: 'Foxtale', x: 88, y: -4, self: false, leader: false },
    ],
    unavailable: [],
  },
  scorecard: {
    competitors: ['Minimalist', 'The Derma Co', 'Plum'],
    rows: [
      { metric: 'Availability', client: 66, scores: [100, 92, 78] },
      { metric: 'Repeat and loyalty', client: 55, scores: [100, 88, 76] },
      { metric: 'Margin', client: 56, scores: [100, 79, 36] },
      { metric: 'Digital maturity', client: 38, scores: [82, 77, 54] },
      { metric: 'Formulation and claims', client: 94, scores: [88, 74, 66] },
    ],
    unavailable: [],
  },
  valueTree: {
    branches: [
      {
        name: 'Revenue',
        drivers: [
          { name: 'Dark-store availability', note: 'Confirmed as the single biggest leak; CEO called it the one that keeps him up' },
          { name: 'Repeat purchase rate', note: 'Agreed, but leadership wants it solved with product, not discounting' },
          { name: 'Offline general trade', note: 'Ambition for FY28; explicitly out of scope for this sprint' },
          { name: 'Average order value', note: 'Regimen bundles agreed as the mechanism' },
        ],
      },
      {
        name: 'Cost',
        drivers: [
          { name: 'Performance marketing efficiency', note: 'Head of Growth disputes the leak is Rs 16 Cr — wants incrementality evidence' },
          { name: 'Contract manufacturing rate', note: 'Four partners; consolidation ruled out this year for capacity reasons' },
          { name: 'Return and RTO cost', note: 'Confirmed at 9.4%; nobody owns the number' },
          { name: 'Platform commission', note: 'Contractual, not addressable in this sprint' },
        ],
      },
      {
        name: 'Capital',
        drivers: [
          { name: 'Finished-goods inventory', note: 'CFO priority; Rs 12 Cr carried against a 42-day lead time' },
          { name: 'Marketplace receivables', note: 'Improving since the platform terms were renegotiated' },
          { name: 'Obsolete and expiring stock', note: 'Rs 3.4 Cr written off last year; treated as a cost of doing business' },
          { name: 'Launch inventory build', note: 'Every launch builds to a forecast nobody trusts' },
        ],
      },
    ],
    unavailable: [],
  },
  valuePools: {
    unit: 'Rs Cr',
    items: [
      { name: 'Quick-commerce availability recovery', value: 24, basis: '13 points of availability x Rs 1.8 Cr a point at current quick-commerce mix' },
      { name: 'Marketing efficiency', value: 16, basis: '8 points of marketing intensity on Rs 412 Cr, net of assumed volume loss' },
      { name: 'Inventory and working capital release', value: 12, basis: 'Rs 12 Cr finished goods at a 40% reduction plus write-off avoidance' },
      { name: 'Return and RTO reduction', value: 6, basis: '9.4% to 6% on the addressable share of orders' },
      { name: 'Launch cycle compression', value: 5, basis: '14 weeks earlier to shelf on 6 launches a year at first-season run rate' },
    ],
    unavailable: [],
  },
  priorityMatrix: {
    items: [
      { name: 'Supply chain and planning', importance: 96, gap: 88 },
      { name: 'Ecommerce and quick commerce', importance: 91, gap: 74 },
      { name: 'Growth and marketing', importance: 88, gap: 66 },
      { name: 'Operations and manufacturing', importance: 71, gap: 62 },
      { name: 'Product and R&D', importance: 82, gap: 48 },
      { name: 'Customer care', importance: 58, gap: 71 },
      { name: 'Finance', importance: 64, gap: 34 },
    ],
    unavailable: [],
  },
  hypotheses: [
    { id: 'H01', title: 'Stockouts are the largest revenue leak', statement: 'Quick-commerce stockouts cost more than any other single failure in the business', signal: 'Availability 82% against 94% for the category leader', validate: 'Lost sales at store-SKU-day level across 40 dark stores', owner: 'Supply Chain', status: 'Confirmed' },
    { id: 'H02', title: 'Marketing buys transactions, not customers', statement: 'Spend is optimised to last-click ROAS and not to cohort contribution', signal: 'CAC Rs 480 against a 27% repeat rate', validate: 'Contribution margin by monthly cohort at 12 months', owner: 'Growth', status: 'To validate' },
    { id: 'H03', title: 'Lead time forces speculative inventory', statement: 'The 42-day production cycle makes every plan a bet', signal: 'Rs 12 Cr of finished goods and Rs 3.4 Cr written off', validate: 'Inventory days and write-off by SKU class', owner: 'Operations', status: 'Confirmed' },
    { id: 'H04', title: 'Launch cycle costs a season', statement: 'Concept to shelf at 34 weeks means missing the trend that prompted it', signal: 'Category norm is 20 weeks; Foxtale runs 16', validate: 'Weeks from brief approval to first dispatch, last 6 launches', owner: 'Product', status: 'Confirmed' },
    { id: 'H05', title: 'Returns hide a product signal', statement: 'Free-text return reasons mean a formulation problem cannot be seen', signal: 'Return and RTO at 9.4% with no coded taxonomy', validate: 'Return rate by SKU against review sentiment', owner: 'Customer Care', status: 'To validate' },
    { id: 'H06', title: 'Contract manufacturer rates are uncompetitive', statement: 'Four partners with no benchmarking means rate leakage', signal: 'Raised in the outside-in pack', validate: 'Rate per unit against category benchmark', owner: 'Operations', status: 'Rejected' },
  ],
  leadership: {
    dimensions: [
      { name: 'Growth', leadership: 'Critical', evidence: 'High', note: 'Leadership wants 60% growth; the evidence says availability caps it at 45%' },
      { name: 'Margin', leadership: 'Critical', evidence: 'Critical', note: 'Fully aligned — the clearest agreement in the session' },
      { name: 'Availability', leadership: 'High', evidence: 'Critical', note: 'Leadership under-weights how much revenue is being lost daily' },
      { name: 'Retention', leadership: 'Medium', evidence: 'High', note: 'Treated as a CRM problem; the data says it is a regimen and product problem' },
      { name: 'Digital and AI', leadership: 'Low', evidence: 'Critical', note: 'The widest divergence in the room by a distance' },
      { name: 'Talent', leadership: 'High', evidence: 'Low', note: 'Leadership wants to hire; the constraint is systems, not people' },
    ],
    unavailable: [],
  },
  ambition: {
    horizon: 'Rs 1,000 Cr revenue at 15% EBITDA by FY29',
    targets: [
      { k: 'Revenue', from: 'Rs 412 Cr', to: 'Rs 1,000 Cr' },
      { k: 'EBITDA margin', from: '7.9%', to: '15%' },
      { k: 'Repeat rate', from: '27%', to: '40%' },
      { k: 'Marketing intensity', from: '34%', to: '26%' },
    ],
    priorities: [
      'Never be out of stock on the top 20 SKUs in quick commerce',
      'Make repeat purchase a product mechanic, not a discount',
      'Halve the time from concept to shelf',
      'Grow contribution faster than revenue',
    ],
    constraints: [
      'No new headcount in supply chain this financial year',
      'Contract manufacturing stays with the four existing partners',
      'No discounting on the sun care line — it is the brand',
      'Technology spend capped at Rs 10 Cr over two years',
    ],
    pastFailures: [
      'A demand planning module bought in 2024 was never adopted — the team went back to the spreadsheet within two months',
      'A loyalty programme launched in 2023 and quietly retired; nobody could show it paid for itself',
    ],
    sensitivities: [
      'Head of Growth reads any attribution work as an audit of their spend',
      'The 2024 planning tool failure is raw — do not open with software',
      'The co-founders disagree publicly on offline; keep it out of scope',
    ],
  },
};
