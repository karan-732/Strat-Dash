import type { PhasePack } from '@/lib/domain/types';

/** Phase 4 — AI-native redesign of order promise to installation. Matches PACK_SHAPES[4]. */
export const PHASE4_PACK: PhasePack = {
  process: {
    name: 'Order promise to installation',
    currentSteps: [
      { name: 'Order taken, fixed date promised', actor: 'Human', handoffs: 1, approvals: 0, cycleTime: '0 days', effort: '20 min' },
      { name: 'Order lands in the plant queue', actor: 'Human', handoffs: 2, approvals: 0, cycleTime: '2 days', effort: '15 min' },
      { name: 'Monthly production plan built', actor: 'Human', handoffs: 2, approvals: 1, cycleTime: '5 days', effort: '1440 min' },
      { name: 'Material indent and staging', actor: 'Human', handoffs: 2, approvals: 0, cycleTime: '3 days', effort: '60 min' },
      { name: 'Production and quality release', actor: 'Human', handoffs: 1, approvals: 1, cycleTime: '6 days', effort: '240 min' },
      { name: 'Despatch and route planning', actor: 'Human', handoffs: 2, approvals: 0, cycleTime: '2 days', effort: '45 min' },
      { name: 'Delivery and installation', actor: 'Human', handoffs: 1, approvals: 0, cycleTime: '1 day', effort: '95 min' },
    ],
    futureSteps: [
      { name: 'Capacity-aware date quoted at checkout', actor: 'AI Agent', handoffs: 0, approvals: 0, cycleTime: '0 days', effort: '0 min' },
      { name: 'Order routed to the plant that can build it soonest', actor: 'AI Agent', handoffs: 0, approvals: 0, cycleTime: '0 days', effort: '0 min' },
      { name: 'Rolling daily plan across three plants', actor: 'AI Agent', handoffs: 0, approvals: 0, cycleTime: '0.2 days', effort: '0 min' },
      { name: 'Planner reviews constrained orders only', actor: 'AI + Human', handoffs: 1, approvals: 1, cycleTime: '0.3 days', effort: '45 min' },
      { name: 'Material shortfall resolved at plan time', actor: 'AI Agent', handoffs: 1, approvals: 0, cycleTime: '0.5 days', effort: '10 min' },
      { name: 'Production and quality release', actor: 'AI + Human', handoffs: 1, approvals: 1, cycleTime: '5 days', effort: '180 min' },
      { name: 'Skill-matched crew and route assignment', actor: 'AI Agent', handoffs: 1, approvals: 0, cycleTime: '1 day', effort: '5 min' },
      { name: 'Delivery and installation', actor: 'Human', handoffs: 1, approvals: 0, cycleTime: '1 day', effort: '85 min' },
    ],
  },
  transformation: {
    activities: [
      { current: 'Quote a fixed 18-day lead time', treatment: 'Agentify' },
      { current: 'Allocate the order to a plant by pin code', treatment: 'Agentify' },
      { current: 'Build a monthly plan per plant', treatment: 'Eliminate' },
      { current: 'Reconcile three plant spreadsheets', treatment: 'Eliminate' },
      { current: 'Sequence the line by hand each week', treatment: 'Automate' },
      { current: 'Discover material shortages at staging', treatment: 'Automate' },
      { current: 'Approve the production plan', treatment: 'Retain' },
      { current: 'Release quality', treatment: 'Retain' },
      { current: 'Build routes the evening before', treatment: 'Agentify' },
      { current: 'Assign crews by availability', treatment: 'Agentify' },
      { current: 'Decide reschedule or refuse on site', treatment: 'Augment' },
    ],
    unavailable: [],
  },
  responsibility: {
    lanes: [
      { step: 'Date promising', actor: 'AI Agent', note: 'Quotes a date the network can actually meet, at the moment of sale' },
      { step: 'Plant routing', actor: 'AI Agent', note: 'Chooses the plant on load, material and distance, not on pin code' },
      { step: 'Rolling plan', actor: 'AI Agent', note: 'Re-plans all three plants daily against the live order book' },
      { step: 'Constrained order review', actor: 'AI + Human', note: 'Planner sees only orders the agent cannot place inside the promise' },
      { step: 'Material shortfall', actor: 'AI Agent', note: 'Raises the indent at plan time and re-dates the order if it cannot be covered' },
      { step: 'Quality release', actor: 'Human', note: 'Plant Manager retains the release; this is a safety and warranty gate' },
      { step: 'Crew and route assignment', actor: 'AI Agent', note: 'Matches crew skill and van stock to what the configuration needs' },
      { step: 'On-site exception', actor: 'AI + Human', note: 'Crew decides; the agent re-books and re-promises immediately' },
    ],
  },
  handoffReduction: {
    items: [
      { k: 'Handoffs', current: 11, future: 5 },
      { k: 'Approvals', current: 2, future: 2 },
      { k: 'System transfers', current: 7, future: 1 },
    ],
    note: 'Excel leaves the process; SAP and the delivery app become the only two systems of record',
  },
  effortReduction: {
    items: [
      { k: 'Order to installation', unit: 'days', current: 18.4, future: 8.2, currentLabel: '18.4 days', futureLabel: '8.2 days' },
      { k: 'Active effort', unit: 'minutes', current: 1915, future: 325, currentLabel: '31.6 hours', futureLabel: '5.4 hours' },
      { k: 'Plan frequency', unit: 'per month', current: 1, future: 30, currentLabel: 'Monthly', futureLabel: 'Daily' },
      { k: 'First-time-right installation', unit: '%', current: 74, future: 92, currentLabel: '74%', futureLabel: '92%' },
      { k: 'People involved', unit: 'people', current: 7, future: 4, currentLabel: '7', futureLabel: '4' },
    ],
    note: 'The change is that the promise and the plan become the same decision instead of two decisions weeks apart',
  },
  kpis: [
    { k: 'Promised lead time', from: '18 days', to: '9 days' },
    { k: 'On-time installation', from: '74%', to: '92%' },
    { k: 'Plant utilisation', from: '68%', to: '82%' },
    { k: 'Finished-goods inventory', from: 'Rs 34 Cr', to: 'Rs 14 Cr' },
  ],
  decisionRights: {
    rows: [
      { decision: 'What date the customer is promised', current: 'POS, fixed at 18 days', future: 'AI agent on live network capacity' },
      { decision: 'Which plant builds the order', current: 'Pin code mapping', future: 'AI agent on load, material and distance' },
      { decision: 'What the plants build this month', current: 'Head of Manufacturing, per plant', future: 'AI agent, daily, across the network' },
      { decision: 'Whether to override the plan', current: 'Plant Manager, informally', future: 'Head of Manufacturing, on a logged reason' },
      { decision: 'When to raise a material indent', current: 'At staging, when short', future: 'AI agent at plan time' },
      { decision: 'Whether quality releases a unit', current: 'Plant Manager', future: 'Plant Manager' },
      { decision: 'Which crew installs which order', current: 'Whoever is available', future: 'AI agent on skill and van stock' },
      { decision: 'Reschedule or refuse on site', current: 'Installation crew', future: 'Installation crew, agent re-promises' },
    ],
    unavailable: [],
  },
  architecture: {
    layers: [
      { name: 'POS and website', note: 'Calls the promise agent before showing a date at checkout' },
      { name: 'SAP (production, materials, inventory)', note: 'System of record; the agent reads capacity and writes the plan' },
      { name: 'Planning and promise agent runtime', note: 'Capacity model, routing, daily re-plan and re-promise' },
      { name: 'Delivery and installation app', note: 'Receives skill-matched assignments and returns coded outcomes' },
      { name: 'Planner and plant console', note: 'Exception queue, override log and network utilisation view' },
    ],
    cards: [
      { k: 'Required data', items: ['Live order book by SKU and configuration', 'Plant capacity and shift calendar', 'BOM and material on-hand across three plants', 'Crew skill matrix and van stock', 'Historic promised vs actual dates'] },
      { k: 'Integrations', items: ['POS → promise agent (synchronous)', 'Agent ↔ SAP (plan, indent, order)', 'Agent → delivery app (assignment)', 'Delivery app → agent (coded outcome)'] },
      { k: 'AI models and agents', items: ['Available-to-promise capacity model', 'Multi-plant scheduling optimiser', 'Material shortfall prediction', 'Crew and skill matching'] },
      { k: 'Human touchpoints', items: ['Constrained order review', 'Plan override with logged reason', 'Quality release', 'On-site exception handling'] },
      { k: 'Workflow systems', items: ['Agent runtime with audit log', 'Service-level targets by SKU class', 'Override thresholds', 'Network utilisation dashboard'] },
    ],
  },
  economics: {
    items: [
      { k: 'Working capital impact', v: '~Rs 20 Cr', basis: 'Finished goods from Rs 34 Cr to Rs 14 Cr on a daily plan against a live order book' },
      { k: 'Cost reduction', v: '~Rs 19 Cr', basis: 'Failed visits, idle capacity and expedited despatch at redesigned rates' },
      { k: 'Capacity released', v: '~Rs 11 Cr', basis: '68% to 82% utilisation across three plants without a second shift' },
      { k: 'Cycle time reduction', v: '10.2 days', basis: '18.4 days to 8.2 days on the traced unit of work' },
      { k: 'Revenue or margin impact', v: '~Rs 12 Cr', basis: 'Modelled repeat and referral recovery from a 92% first-visit completion rate' },
    ],
    unavailable: [],
  },
  scorecard: [
    { process: 'Order promise to installation', eliminated: 2, automated: 3, agentified: 4, augmented: 1, retained: 2, handoffs: '11 to 5', cycleTime: '18.4d to 8.2d', manualEffort: '31.6h to 5.4h' },
  ],
  roles: {
    ai: [
      { verb: 'Monitors', what: 'The live order book, plant load and material position across three plants, continuously' },
      { verb: 'Retrieves', what: 'Capacity, shift calendar, BOM coverage and crew skill for every promise it makes' },
      { verb: 'Reasons', what: 'Which plant can build this configuration soonest, and what date that makes deliverable' },
      { verb: 'Generates', what: 'A daily production plan across the network, and the date shown at checkout' },
      { verb: 'Executes', what: 'Plant routing, material indents at plan time and crew assignment against skill' },
      { verb: 'Coordinates', what: 'Despatch routes against installation windows and crew van stock' },
      { verb: 'Escalates', what: 'Orders it cannot place inside the promise, and material it cannot cover' },
    ],
    human: [
      { verb: 'Decides', what: 'How to place an order the agent has flagged as unplaceable inside the promise' },
      { verb: 'Approves', what: 'Overrides to the network plan, against a logged reason' },
      { verb: 'Negotiates', what: 'Foam and timber rate contracts and contracted crew capacity' },
      { verb: 'Reviews', what: 'The daily network utilisation view and the agent override log' },
      { verb: 'Handles exceptions', what: 'Quality holds, damage claims and on-site installation refusals' },
    ],
  },
};
