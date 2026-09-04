import { PHASES } from '@/lib/playbook/phases';
import { PACK_KEYS } from '@/lib/playbook/constants';
import { blankEngagement } from '@/lib/domain/engagement';
import type { Engagement } from '@/lib/domain/types';
import { PHASE0_PACK } from './phase0';
import { PHASE1_PACK } from './phase1';
import { PHASE2_PACK } from './phase2';
import { PHASE3_PACK } from './phase3';
import { PHASE4_PACK } from './phase4';
import { PHASE5_PACK } from './phase5';
import { DEMO_QUESTIONS } from './questions';

export { PHASE0_PACK, PHASE1_PACK, PHASE2_PACK, PHASE3_PACK, PHASE4_PACK, PHASE5_PACK, DEMO_QUESTIONS };

/** The six packs in phase order, each in the shape the generator returns. */
export const DEMO_PACKS = [PHASE0_PACK, PHASE1_PACK, PHASE2_PACK, PHASE3_PACK, PHASE4_PACK, PHASE5_PACK];

/**
 * A sprint that has run end to end: every phase generated, every input either
 * received or marked not available, every workflow step closed and every
 * deliverable delivered, with the questions and next moves each phase left.
 *
 * This is the worked example the console opens with. Replace it — or drop it —
 * once real engagements are being persisted.
 */
export function demoEngagement(): Engagement {
  const p = blankEngagement({
    id: 'ushabreco',
    name: 'Usha Breco',
    sector: 'Ropeways and material handling',
    url: 'ushabreco.com',
    notes:
      'Family-run, three plants, 62 commissioned ropeways. MD wants Rs 900 Cr at 18% by FY29. ' +
      'A 2023 ERP costing rollout was abandoned — do not lead with systems.',
    scope: 'Department-level sprint',
    created: '2026-08-11',
  });

  PHASES.forEach((ph, pi) => {
    /* inputs: mostly received, a couple the client could not supply */
    ph.inputs.forEach((_, i) => {
      p.inputs[pi + ':' + i] = i % 7 === 5 ? 'na' : true;
    });
    ph.steps.forEach((_, i) => {
      p.steps[pi + ':' + i] = true;
    });
    /* everyone the playbook asks for was in the room, bar the trailing notes */
    ph.participants.forEach((who, i) => {
      if (!/^No broad/.test(who)) p.attended[pi + ':' + i] = true;
    });
    ph.docs.forEach((d) => {
      p.docs[pi + '.' + d.n] = { s: 4, draft: '' };
    });
    p.built[pi] = true;
    p[PACK_KEYS[pi]] = DEMO_PACKS[pi];
    p.cq[pi] = DEMO_QUESTIONS[pi];
  });

  p.manual[1] =
    'Leadership session, 21 Aug. MD framed 18% EBITDA as the number the board watches. ' +
    'CFO put working capital at 96 days and committed to 70. Plant Head visibly uncomfortable ' +
    'whenever automation came up — frame everything as crew capacity, not headcount.';
  p.manual[3] =
    'Site observation at Bhopal, 29 Aug. Watched one PO from indent to issue. Four systems, ' +
    'nine handoffs, and the material sat 24 days in the store before the site could take it.';

  p.links = [
    { id: 'l1', url: 'https://ushabreco.com/projects' },
    { id: 'l2', url: 'https://www.bseindia.com/annual-report-usha-breco-fy26.pdf' },
  ];

  return p;
}

/** A second engagement, onboarded but not started — nothing generated yet. */
export function freshEngagement(): Engagement {
  return blankEngagement({
    id: 'titagarh',
    name: 'Titagarh',
    sector: 'Rail rolling stock manufacturing',
    url: 'titagarh.in',
    notes: 'Onboarded 3 September. Phase 0 not yet run.',
    scope: 'Single process-level sprint',
    created: '2026-09-03',
  });
}
