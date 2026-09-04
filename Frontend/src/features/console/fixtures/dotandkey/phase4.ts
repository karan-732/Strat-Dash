import type { PhasePack } from '@/lib/domain/types';

/** Phase 4 — AI-native redesign of the replenishment process. Matches PACK_SHAPES[4]. */
export const PHASE4_PACK: PhasePack = {
  process: {
    name: 'Demand signal to dark-store availability',
    currentSteps: [
      { name: 'Pull sell-out from four portals', actor: 'Human', handoffs: 1, approvals: 0, cycleTime: '0.5 days', effort: '180 min' },
      { name: 'Consolidate into the planning sheet', actor: 'Human', handoffs: 1, approvals: 0, cycleTime: '0.8 days', effort: '240 min' },
      { name: 'Build the forecast', actor: 'Human', handoffs: 1, approvals: 1, cycleTime: '1.5 days', effort: '300 min' },
      { name: 'Allocate stock to dark stores', actor: 'Human', handoffs: 1, approvals: 0, cycleTime: '1 day', effort: '210 min' },
      { name: 'Raise the replenishment order', actor: 'Human', handoffs: 1, approvals: 0, cycleTime: '0.5 days', effort: '90 min' },
      { name: 'Book the platform appointment', actor: 'Human', handoffs: 2, approvals: 0, cycleTime: '3 days', effort: '120 min' },
      { name: 'Dispatch and platform receipt', actor: 'Human', handoffs: 1, approvals: 0, cycleTime: '4 days', effort: '150 min' },
    ],
    futureSteps: [
      { name: 'Continuous sell-out ingestion', actor: 'AI Agent', handoffs: 0, approvals: 0, cycleTime: '0 days', effort: '0 min' },
      { name: 'Daily demand forecast per store-SKU', actor: 'AI Agent', handoffs: 0, approvals: 0, cycleTime: '0 days', effort: '0 min' },
      { name: 'Demand-weighted allocation proposal', actor: 'AI Agent', handoffs: 0, approvals: 0, cycleTime: '0.1 days', effort: '0 min' },
      { name: 'Planner reviews exceptions only', actor: 'AI + Human', handoffs: 1, approvals: 1, cycleTime: '0.3 days', effort: '30 min' },
      { name: 'Autonomous order and forward slot booking', actor: 'AI Agent', handoffs: 1, approvals: 0, cycleTime: '0.5 days', effort: '0 min' },
      { name: 'Dispatch with automated receipt matching', actor: 'AI + Human', handoffs: 1, approvals: 0, cycleTime: '2 days', effort: '20 min' },
    ],
  },
  transformation: {
    activities: [
      { current: 'Download sell-out from each portal', treatment: 'Automate' },
      { current: 'Reconcile four export formats', treatment: 'Eliminate' },
      { current: 'Map SKUs across platforms', treatment: 'Automate' },
      { current: 'Average the last four weeks', treatment: 'Agentify' },
      { current: 'Adjust the forecast by feel', treatment: 'Augment' },
      { current: 'Allocate pro-rata to stores', treatment: 'Agentify' },
      { current: 'Override the allocation on request', treatment: 'Retain' },
      { current: 'Re-key the order into the OMS', treatment: 'Eliminate' },
      { current: 'Book the appointment slot', treatment: 'Agentify' },
      { current: 'Match dispatch against receipt', treatment: 'Automate' },
      { current: 'Dispute short receipts', treatment: 'Agentify' },
    ],
    unavailable: [],
  },
  responsibility: {
    lanes: [
      { step: 'Sell-out ingestion', actor: 'AI Agent', note: 'Reads all four platform APIs continuously and normalises SKU codes' },
      { step: 'Daily forecast', actor: 'AI Agent', note: 'Forecasts each store-SKU on its own history, promo calendar and local seasonality' },
      { step: 'Allocation proposal', actor: 'AI Agent', note: 'Weights available stock by forecast demand and days of cover, not by last week' },
      { step: 'Exception review', actor: 'AI + Human', note: 'Planner sees only stores the agent flags as constrained or anomalous' },
      { step: 'New SKU and launch allocation', actor: 'Human', note: 'No history to forecast on; the planner still decides' },
      { step: 'Order release', actor: 'AI Agent', note: 'Writes directly to the OMS inside the agreed cover band' },
      { step: 'Appointment booking', actor: 'AI Agent', note: 'Books forward slots against the forecast rather than reacting to the order' },
      { step: 'Receipt reconciliation', actor: 'AI Agent', note: 'Matches dispatch to GRN and raises the dispute inside the platform window' },
    ],
  },
  handoffReduction: {
    items: [
      { k: 'Handoffs', current: 8, future: 3 },
      { k: 'Approvals', current: 1, future: 1 },
      { k: 'System transfers', current: 6, future: 0 },
    ],
    note: 'Excel leaves the process entirely; the OMS becomes the only place an order exists',
  },
  effortReduction: {
    items: [
      { k: 'Planning cycle', unit: 'days', current: 9.6, future: 1.2, currentLabel: '9.6 days', futureLabel: '1.2 days' },
      { k: 'Active effort', unit: 'minutes', current: 1290, future: 50, currentLabel: '21.5 hours', futureLabel: '50 min' },
      { k: 'Forecast frequency', unit: 'per week', current: 1, future: 7, currentLabel: 'Weekly', futureLabel: 'Daily' },
      { k: 'Manual effort', unit: 'hours', current: 21.5, future: 0.8, currentLabel: '21.5 h per cycle', futureLabel: '0.8 h per cycle' },
      { k: 'People involved', unit: 'people', current: 4, future: 2, currentLabel: '4', futureLabel: '2' },
    ],
    note: 'The step change is frequency, not effort — a daily forecast is what closes the availability gap',
  },
  kpis: [
    { k: 'Dark-store availability', from: '82%', to: '95%' },
    { k: 'Forecast accuracy', from: '61%', to: '84%' },
    { k: 'Planning cycle', from: '9.6 days', to: '1.2 days' },
    { k: 'Finished-goods inventory', from: 'Rs 12 Cr', to: 'Rs 7 Cr' },
  ],
  decisionRights: {
    rows: [
      { decision: 'What demand will be next week', current: 'Head of Supply Chain, by feel', future: 'AI agent, per store-SKU, daily' },
      { decision: 'Which store gets constrained stock', current: 'Pro-rata, then overridden', future: 'AI agent on forecast and days of cover' },
      { decision: 'Whether to override an allocation', current: 'Whoever asks first', future: 'Head of Supply Chain, on a logged reason' },
      { decision: 'How much to hold as safety stock', current: 'Not explicitly decided', future: 'AI agent against a service-level target' },
      { decision: 'When to book a platform slot', current: 'After the order is raised', future: 'AI agent, forward, against the forecast' },
      { decision: 'Allocation for a new SKU', current: 'Head of Supply Chain', future: 'Head of Supply Chain' },
      { decision: 'Whether to dispute a short receipt', current: 'Rarely, if noticed', future: 'AI agent, automatically, inside the window' },
    ],
    unavailable: [],
  },
  architecture: {
    layers: [
      { name: 'Platform APIs (Blinkit, Zepto, Instamart, BigBasket)', note: 'Continuous sell-out and on-hand, replacing manual portal exports' },
      { name: 'Unicommerce OMS', note: 'System of record; the agent writes replenishment orders here' },
      { name: 'Demand and allocation agent runtime', note: 'Forecasting, allocation, slot booking and dispute raising' },
      { name: 'Planner console', note: 'Exception queue, override log and service-level dashboard' },
      { name: 'Co-manufacturer schedule feed', note: 'Phase 2 dependency; makes the forecast actionable upstream' },
    ],
    cards: [
      { k: 'Required data', items: ['Sell-out by store, SKU and day', 'On-hand and in-transit by dark store', 'Promo and campaign calendar', 'SKU master mapped across four platforms'] },
      { k: 'Integrations', items: ['Platform APIs → agent', 'Agent ↔ Unicommerce OMS', 'Agent → platform appointment booking', 'Agent → co-manufacturer schedule'] },
      { k: 'AI models and agents', items: ['Per store-SKU demand forecasting', 'Constrained allocation optimiser', 'Anomaly and cannibalisation detection', 'Short-receipt dispute agent'] },
      { k: 'Human touchpoints', items: ['Exception queue review', 'New SKU and launch allocation', 'Override with logged reason', 'Weekly service-level review'] },
      { k: 'Workflow systems', items: ['Agent runtime with audit log', 'Service-level targets by SKU class', 'Override thresholds', 'Availability dashboard'] },
    ],
  },
  economics: {
    items: [
      { k: 'Revenue recovered', v: '~Rs 24 Cr', basis: '13 points of availability at current quick-commerce mix and contribution margin' },
      { k: 'Cost reduction', v: '~Rs 2.9 Cr', basis: 'Planner effort, expedite premium and recovered short receipts' },
      { k: 'Capacity released', v: '~2.5 FTE', basis: '21.5 hours to 50 minutes per cycle across 52 cycles' },
      { k: 'Cycle time reduction', v: '8.4 days', basis: '9.6 days to 1.2 days on the traced unit of work' },
      { k: 'Working capital impact', v: '~Rs 5 Cr', basis: 'Finished goods from Rs 12 Cr to Rs 7 Cr on a daily plan' },
    ],
    unavailable: [],
  },
  scorecard: [
    { process: 'Demand signal to dark-store availability', eliminated: 2, automated: 4, agentified: 4, augmented: 1, retained: 1, handoffs: '8 to 3', cycleTime: '9.6d to 1.2d', manualEffort: '21.5h to 0.8h' },
  ],
  roles: {
    ai: [
      { verb: 'Monitors', what: 'Sell-out and on-hand across 1,840 dark stores on four platforms, continuously' },
      { verb: 'Retrieves', what: 'Promo calendar, launch plan and co-manufacturer schedule for every planning run' },
      { verb: 'Reasons', what: 'Which stores will go to zero first, and what the cost of each stockout would be' },
      { verb: 'Generates', what: 'A demand-weighted allocation with the reason each store got what it got' },
      { verb: 'Executes', what: 'Replenishment orders inside the agreed days-of-cover band, and forward slot bookings' },
      { verb: 'Coordinates', what: 'Dispatch against platform appointment windows and warehouse capacity' },
      { verb: 'Escalates', what: 'Constrained SKUs, forecast anomalies and short receipts outside tolerance' },
    ],
    human: [
      { verb: 'Decides', what: 'Allocation for any SKU with no sales history, including every launch' },
      { verb: 'Approves', what: 'Overrides to the agent allocation, against a logged reason' },
      { verb: 'Negotiates', what: 'Platform commercial terms, slot capacity and joint business plans' },
      { verb: 'Reviews', what: 'The weekly service-level report and the agent override log' },
      { verb: 'Handles exceptions', what: 'Quality holds, recalls and platform-side listing failures' },
    ],
  },
};
