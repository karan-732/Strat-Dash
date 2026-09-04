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
 * A sleep and home furniture sprint run end to end — owned manufacturing,
 * three plants and a last mile that is judged at the customer door.
 */
export function wakefitEngagement(): Engagement {
  const p = blankEngagement({
    id: 'wakefit',
    name: 'Wakefit',
    sector: 'Sleep and home furniture D2C',
    url: 'wakefit.co',
    notes:
      'Owned manufacturing across three plants, 120 experience stores, direct to consumer only. ' +
      'CEO wants Rs 2,200 Cr at 10% by FY29. A SAP APS module licensed in 2023 never went live ' +
      'because the master data was never cleaned — that history is well known internally.',
    scope: 'Single process-level sprint',
    created: '2026-08-17',
  });

  PHASES.forEach((ph, pi) => {
    ph.inputs.forEach((_, i) => {
      p.inputs[pi + ':' + i] = i % 5 === 3 ? 'na' : true;
    });
    ph.steps.forEach((_, i) => {
      p.steps[pi + ':' + i] = true;
    });
    ph.participants.forEach((who, i) => {
      if (!/^No broad/.test(who)) p.attended[pi + ':' + i] = true;
    });
    ph.docs.forEach((d) => {
      p.docs[pi + '.' + d.n] = { s: d.n <= 4 ? 4 : 3, draft: '' };
    });
    p.built[pi] = true;
    p[PACK_KEYS[pi]] = PACKS[pi];
    p.cq[pi] = PHASE_QUESTIONS[pi];
  });

  p.manual[1] =
    'Leadership session, 20 Aug. CEO opened on growth, CFO moved it to margin within ten minutes ' +
    'and it stayed there. Head of Manufacturing visibly tightened whenever central planning came ' +
    'up — he has three plants and reads this as losing them. Second shift ruled out for the year.';
  p.manual[2] =
    'Plant-level utilisation finally shared, 27 Aug. Hosur 84%, Jaipur 69%, Bengaluru 51% on the ' +
    'same order book. The blended 68% had been hiding the entire opportunity — this is a ' +
    'balancing problem, not a capacity one.';
  p.manual[3] =
    'Traced one made-to-order sofa from a Bengaluru store to installation, 30 Aug. Eighteen days, ' +
    'eleven handoffs, four systems. The date was promised at checkout by a POS that has never ' +
    'seen a plant schedule. The crew arrived without the bracket set the configuration needed.';

  p.links = [
    { id: 'l1', url: 'https://www.wakefit.co/mattress' },
    { id: 'l2', url: 'https://www.sheelafoam.com/investors/annual-reports' },
  ];

  p.files = [
    { id: 'f1', name: 'plant-utilisation-by-unit.xlsx', size: 327680, phase: 0, input: -1 },
    { id: 'f2', name: 'promised-vs-actual-12m.csv', size: 4194304, phase: 1, input: -1 },
    { id: 'f3', name: 'installation-failure-log.csv', size: 2097152, phase: 2, input: 1 },
    { id: 'f4', name: 'order-trace-bengaluru-hosur.pdf', size: 892928, phase: 3, input: -1 },
    { id: 'f5', name: 'return-disposition-24m.xlsx', size: 655360, phase: 2, input: -1 },
  ];

  return p;
}
