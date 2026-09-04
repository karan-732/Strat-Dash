import { PACK_KEYS } from '@/lib/playbook/constants';
import { PHASES } from '@/lib/playbook/phases';
import type { Engagement } from './types';

/**
 * Completion of one phase.
 *
 * The generated current pack is the phase checkpoint. Deliverable records are
 * legacy working state and cannot complete a phase or unlock the next one.
 */
export function phasePct(p: Engagement, pi: number): number {
  return phaseDone(p, pi) ? 100 : 0;
}

export type Weighting = 'Equal phases' | 'Weight by deliverable count';

/** Whole-sprint completion under the configured progress model. */
export function sprintPct(p: Engagement, weighting: Weighting = 'Equal phases'): number {
  const byDocs = weighting === 'Weight by deliverable count';
  let num = 0;
  let den = 0;
  PHASES.forEach((ph, pi) => {
    const w = byDocs ? ph.docs.length : 1;
    num += phasePct(p, pi) * w;
    den += w;
  });
  return Math.round(num / den);
}

/** The phase the engagement is currently sitting in. */
export function curPhaseIdx(p: Engagement): number {
  for (let i = 0; i < PHASES.length; i++) if (phasePct(p, i) < 100) return i;
  return PHASES.length - 1;
}

/** A phase is done only when its generated current pack exists. */
export function phaseDone(p: Engagement, pi: number): boolean {
  return !!p[PACK_KEYS[pi]];
}

/** Cumulative gating: a phase opens only when every earlier phase is done. */
export function phaseUnlocked(p: Engagement, pi: number): boolean {
  if (pi === 0) return true;
  for (let i = 0; i < pi; i++) if (!phaseDone(p, i)) return false;
  return true;
}

export function firstOpenPhase(p: Engagement): number {
  for (let i = 0; i < PHASES.length; i++) if (!phaseDone(p, i) && phaseUnlocked(p, i)) return i;
  return PHASES.length - 1;
}

export function firstMissingPhase(p: Engagement, pi: number): number {
  for (let i = 0; i < pi; i++) if (!phaseDone(p, i)) return i;
  return Math.max(0, pi - 1);
}

/** Why a phase is locked, phrased for the lock banner and the toast. */
export function lockNote(p: Engagement, pi: number): string {
  const miss: string[] = [];
  for (let i = 0; i < pi; i++) {
    if (!phaseDone(p, i)) miss.push('Phase ' + PHASES[i].num + ' - ' + PHASES[i].title);
  }
  if (!miss.length) return 'Phase ' + PHASES[pi].num + ' is open.';
  return (
    'Phase ' +
    PHASES[pi].num +
    ' is locked. ' +
    miss.join(', then ') +
    ' has to be generated first; every phase is built on the one before it.'
  );
}
