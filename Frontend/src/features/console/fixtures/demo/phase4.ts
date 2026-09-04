import type { PhasePack } from '@/lib/domain/types';

/** Phase 4 — AI-native redesign of the procurement process. Matches PACK_SHAPES[4]. */
export const PHASE4_PACK: PhasePack = {
  process: {
    name: 'Purchase order to goods release',
    currentSteps: [
      { name: 'Indent raised', actor: 'Human', handoffs: 1, approvals: 0, cycleTime: '1 day', effort: '25 min' },
      { name: 'Indent approval', actor: 'Human', handoffs: 1, approvals: 1, cycleTime: '2 days', effort: '10 min' },
      { name: 'RFQ to vendors', actor: 'Human', handoffs: 2, approvals: 0, cycleTime: '4 days', effort: '55 min' },
      { name: 'Quote comparison', actor: 'Human', handoffs: 1, approvals: 0, cycleTime: '0.3 days', effort: '70 min' },
      { name: 'PO release', actor: 'Human', handoffs: 1, approvals: 1, cycleTime: '1.5 days', effort: '20 min' },
      { name: 'Expediting', actor: 'Human', handoffs: 2, approvals: 0, cycleTime: '14 days', effort: '90 min' },
      { name: 'Goods receipt and issue', actor: 'Human', handoffs: 1, approvals: 0, cycleTime: '24 days', effort: '45 min' },
    ],
    futureSteps: [
      { name: 'Demand signal from frozen BOM', actor: 'AI Agent', handoffs: 0, approvals: 0, cycleTime: '0 days', effort: '0 min' },
      { name: 'Agent-drafted RFQ pack', actor: 'AI Agent', handoffs: 0, approvals: 0, cycleTime: '0.2 days', effort: '5 min' },
      { name: 'Buyer reviews the recommendation', actor: 'AI + Human', handoffs: 1, approvals: 1, cycleTime: '0.5 days', effort: '20 min' },
      { name: 'Autonomous PO release under threshold', actor: 'AI Agent', handoffs: 0, approvals: 0, cycleTime: '0 days', effort: '0 min' },
      { name: 'Agent expediting with vendor portal', actor: 'AI Agent', handoffs: 1, approvals: 0, cycleTime: '9 days', effort: '10 min' },
      { name: 'Release scheduled to site readiness', actor: 'AI + Human', handoffs: 1, approvals: 0, cycleTime: '4 days', effort: '15 min' },
    ],
  },
  transformation: {
    activities: [
      { current: 'Raise indent from BOM', treatment: 'Automate' },
      { current: 'Approve indent', treatment: 'Eliminate' },
      { current: 'Assemble vendor list', treatment: 'Agentify' },
      { current: 'Send RFQ and chase quotes', treatment: 'Agentify' },
      { current: 'Build comparative statement', treatment: 'Automate' },
      { current: 'Select vendor', treatment: 'Augment' },
      { current: 'Release PO', treatment: 'Automate' },
      { current: 'Second approval above Rs 5 L', treatment: 'Retain' },
      { current: 'Expedite by phone', treatment: 'Agentify' },
      { current: 'Book goods receipt', treatment: 'Automate' },
      { current: 'Decide issue-to-site timing', treatment: 'Augment' },
    ],
    unavailable: [],
  },
  responsibility: {
    lanes: [
      { step: 'Demand signal from frozen BOM', actor: 'AI Agent', note: 'Watches the drawing release and raises the indent when the BOM freezes' },
      { step: 'Agent-drafted RFQ pack', actor: 'AI Agent', note: 'Assembles vendor list, specification and historic rates into a ready RFQ' },
      { step: 'Quote normalisation', actor: 'AI', note: 'Reads returned quotes and builds the comparative statement' },
      { step: 'Vendor selection', actor: 'AI + Human', note: 'Agent recommends with a reason; the buyer accepts or overrides' },
      { step: 'PO release under Rs 5 L', actor: 'AI Agent', note: 'Releases autonomously inside the rate band' },
      { step: 'PO release above Rs 5 L', actor: 'Human', note: 'Head of Materials retains the signature' },
      { step: 'Expediting', actor: 'AI Agent', note: 'Chases vendor commitments and escalates on slip' },
      { step: 'Issue-to-site timing', actor: 'AI + Human', note: 'Agent proposes against site readiness; the PM confirms' },
    ],
  },
  handoffReduction: {
    items: [
      { k: 'Handoffs', current: 9, future: 3 },
      { k: 'Approvals', current: 2, future: 1 },
      { k: 'System transfers', current: 6, future: 1 },
    ],
    note: 'Email and Excel leave the process entirely; the ERP becomes the only system of record',
  },
  effortReduction: {
    items: [
      { k: 'Total cycle time', unit: 'days', current: 46, future: 14, currentLabel: '46 days', futureLabel: '14 days' },
      { k: 'Active effort', unit: 'minutes', current: 315, future: 50, currentLabel: '5.3 hours', futureLabel: '50 min' },
      { k: 'Waiting time', unit: 'days', current: 45.8, future: 13.2, currentLabel: '45.8 days', futureLabel: '13.2 days' },
      { k: 'Manual effort', unit: 'hours', current: 5.3, future: 0.8, currentLabel: '5.3 h per line', futureLabel: '0.8 h per line' },
      { k: 'People involved', unit: 'people', current: 6, future: 3, currentLabel: '6', futureLabel: '3' },
    ],
    note: 'The 24-day issue-to-site wait is where two-thirds of the saving sits',
  },
  kpis: [
    { k: 'PO cycle time', from: '46 days', to: '14 days' },
    { k: 'Buyer effort per line', from: '5.3 h', to: '0.8 h' },
    { k: 'Early-order WIP', from: 'Rs 12 Cr', to: 'Rs 4 Cr' },
    { k: 'Expedite premium', from: 'Rs 3 Cr', to: 'Rs 0.9 Cr' },
  ],
  decisionRights: {
    rows: [
      { decision: 'When to raise an indent', current: 'Project Engineer', future: 'AI agent on BOM freeze' },
      { decision: 'Whether an indent is approved', current: 'Project Manager', future: 'Removed — the frozen BOM is the approval' },
      { decision: 'Which vendors are invited', current: 'Buyer', future: 'AI agent, buyer may add' },
      { decision: 'Which quote wins', current: 'Buyer', future: 'AI recommends, buyer decides' },
      { decision: 'PO release under Rs 5 L', current: 'Head of Materials', future: 'AI agent inside the rate band' },
      { decision: 'PO release above Rs 5 L', current: 'Head of Materials', future: 'Head of Materials' },
      { decision: 'When material goes to site', current: 'Store Keeper by default', future: 'AI proposes, Project Manager confirms' },
    ],
    unavailable: [],
  },
  architecture: {
    layers: [
      { name: 'ERP (purchase, inventory, projects)', note: 'System of record; the agent reads and writes here' },
      { name: 'Engineering PDM', note: 'Emits the BOM-freeze event that starts the process' },
      { name: 'Vendor portal', note: 'New; replaces email RFQ and phone expediting' },
      { name: 'Procurement agent runtime', note: 'Drafting, normalisation, recommendation, escalation' },
      { name: 'Buyer console', note: 'Where a human accepts, overrides or escalates' },
    ],
    cards: [
      { k: 'Required data', items: ['BOM with revision state', 'Vendor master and rate history', 'Project schedule and site readiness', 'Goods receipt history'] },
      { k: 'Integrations', items: ['PDM → agent (BOM freeze event)', 'Agent ↔ ERP (indent, PO, GRN)', 'Agent ↔ vendor portal', 'Agent → project schedule'] },
      { k: 'AI models and agents', items: ['Quote extraction from PDF and email', 'Vendor recommendation with rationale', 'Expediting and escalation agent', 'Release-timing planner'] },
      { k: 'Human touchpoints', items: ['Vendor selection review', 'Above-threshold PO signature', 'Issue-to-site confirmation', 'Exception queue'] },
      { k: 'Workflow systems', items: ['Agent runtime with audit log', 'Escalation rules', 'Approval thresholds', 'Exception dashboard'] },
    ],
  },
  economics: {
    items: [
      { k: 'Cost reduction', v: '~Rs 4.2 Cr', basis: 'Buyer effort, rework and expedite premium at redesigned rates' },
      { k: 'Capacity released', v: '~4.5 FTE', basis: '315 to 50 minutes per line across 4,100 lines a year' },
      { k: 'Cycle time reduction', v: '32 days', basis: '46 days to 14 days on the traced unit of work' },
      { k: 'Revenue or margin impact', v: '~Rs 2 Cr', basis: 'Schedule recovery reducing liquidated damages exposure' },
      { k: 'Working capital impact', v: '~Rs 8 Cr', basis: 'Early-order WIP from Rs 12 Cr to Rs 4 Cr' },
    ],
    unavailable: [],
  },
  scorecard: [
    { process: 'Purchase order to goods release', eliminated: 1, automated: 4, agentified: 4, augmented: 2, retained: 1, handoffs: '9 to 3', cycleTime: '46d to 14d', manualEffort: '5.3h to 0.8h' },
  ],
  roles: {
    ai: [
      { verb: 'Monitors', what: 'The PDM for a BOM reaching frozen state on a live project' },
      { verb: 'Retrieves', what: 'Vendor master, last three order rates and lead times for each BOM line' },
      { verb: 'Reasons', what: 'Which vendor wins on landed cost against required-by date, and why' },
      { verb: 'Generates', what: 'The RFQ pack and the comparative statement the buyer used to build by hand' },
      { verb: 'Executes', what: 'PO release under Rs 5 L inside the agreed rate band' },
      { verb: 'Coordinates', what: 'Vendor commitments against the site readiness date in the project schedule' },
      { verb: 'Escalates', what: 'A vendor slipping more than three days, or a quote outside the rate band' },
    ],
    human: [
      { verb: 'Decides', what: 'Which vendor wins where the agent flags a genuine trade-off' },
      { verb: 'Approves', what: 'Any purchase order above Rs 5 L' },
      { verb: 'Negotiates', what: 'Annual rate contracts for rope, gearboxes and structural steel' },
      { verb: 'Reviews', what: 'The weekly exception queue and the agent’s override log' },
      { verb: 'Handles exceptions', what: 'Single-source items and disputed goods receipts' },
    ],
  },
};
