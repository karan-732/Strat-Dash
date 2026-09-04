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
import { PHASE_QUESTIONS } from './questions';

const PACKS = [PHASE0_PACK, PHASE1_PACK, PHASE2_PACK, PHASE3_PACK, PHASE4_PACK, PHASE5_PACK];

/**
 * A beauty and personal care sprint run end to end. Every phase generated,
 * every input either received or marked not available, every workflow step
 * closed, and the questions and next moves each phase left behind.
 */
export function dotAndKeyEngagement(): Engagement {
  const p = blankEngagement({
    id: 'dotandkey',
    name: 'Dot & Key',
    sector: 'Beauty and personal care D2C',
    url: 'dotandkey.com',
    notes:
      'Founder-led, 96 active SKUs, a third of revenue now through quick commerce. ' +
      'CEO wants Rs 1,000 Cr at 15% by FY29. A 2024 demand planning tool was abandoned ' +
      'inside two months — do not lead with software.',
    scope: 'Department-level sprint',
    created: '2026-08-14',
  });

  PHASES.forEach((ph, pi) => {
    ph.inputs.forEach((_, i) => {
      p.inputs[pi + ':' + i] = i % 6 === 4 ? 'na' : true;
    });
    ph.steps.forEach((_, i) => {
      p.steps[pi + ':' + i] = true;
    });
    ph.participants.forEach((who, i) => {
      if (!/^No broad/.test(who)) p.attended[pi + ':' + i] = true;
    });
    ph.docs.forEach((d) => {
      p.docs[pi + '.' + d.n] = { s: 4, draft: '' };
    });
    p.built[pi] = true;
    p[PACK_KEYS[pi]] = PACKS[pi];
    p.cq[pi] = PHASE_QUESTIONS[pi];
  });

  p.manual[1] =
    'Leadership session, 19 Aug. CEO named availability as the thing that keeps him up — ' +
    'said he has watched his own SKU go out of stock on Zepto while an ad for it was running. ' +
    'CFO put the technology cap at Rs 10 Cr firmly. Head of Growth defensive the moment ' +
    'attribution came up; frame incrementality as their experiment, not our audit.';
  p.manual[2] =
    'Planning cycle observed at Bhiwandi, 26 Aug. Four platform exports, four different formats, ' +
    'reconciled into one tab by hand. Took the executive most of Monday. The forecast is the ' +
    'last four weeks averaged and then adjusted by feel.';
  p.manual[3] =
    'Followed one replenishment cycle end to end, 28 Aug. Nine and a half days from the first ' +
    'portal download to stock landing in a dark store. Roughly a third of stores had their ' +
    'allocation overridden after the sheet was built, mostly on a phone call.';

  p.links = [
    { id: 'l1', url: 'https://dotandkey.com/collections/sunscreen' },
    { id: 'l2', url: 'https://www.nykaa.com/brands/dot-and-key/c/6474' },
  ];

  p.files = [
    { id: 'f1', name: 'availability-sample-40-stores.csv', size: 184320, phase: 0, input: -1 },
    { id: 'f2', name: 'FY26-investor-update.pdf', size: 2411008, phase: 0, input: 2 },
    { id: 'f3', name: 'cohort-contribution-12m.xlsx', size: 512000, phase: 2, input: -1 },
    { id: 'f4', name: 'replenishment-planning-sheet.xlsx', size: 1048576, phase: 3, input: -1 },
  ];

  return p;
}

/** The six packs in phase order, for the pack-preview dev harness. */
export const DOTANDKEY_PACKS = PACKS;
