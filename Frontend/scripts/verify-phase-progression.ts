import assert from 'node:assert/strict';
import { blankEngagement } from '@/lib/domain/engagement';
import {
  curPhaseIdx,
  firstMissingPhase,
  firstOpenPhase,
  lockNote,
  phaseDone,
  phasePct,
  phaseUnlocked,
  sprintPct,
} from '@/lib/domain/progress';
import { PACK_KEYS } from '@/lib/playbook/constants';
import { PHASES } from '@/lib/playbook/phases';
import type { Engagement } from '@/lib/domain/types';

const fresh = (): Engagement =>
  blankEngagement({
    id: 'progress-check',
    name: 'Progress Check',
    created: '2026-09-04',
  });

const putPack = (engagement: Engagement, phase: number) => {
  engagement[PACK_KEYS[phase]] = { phase, generated: true };
  engagement.built[phase] = true;
};

const empty = fresh();
assert.equal(phasePct(empty, 0), 0, 'an ungenerated phase starts at 0%');
assert.equal(phaseDone(empty, 0), false, 'an ungenerated phase is not complete');
assert.equal(phaseUnlocked(empty, 0), true, 'Phase 0 is always open');
assert.equal(phaseUnlocked(empty, 1), false, 'Phase 1 waits for the Phase 0 pack');

for (const doc of PHASES[0].docs) {
  empty.docs[`0.${doc.n}`] = { s: 4, draft: 'Legacy delivered draft' };
}
assert.equal(phasePct(empty, 0), 0, 'legacy delivered documents do not complete a phase');
assert.equal(phaseDone(empty, 0), false, 'legacy document status cannot replace the current pack');
assert.equal(phaseUnlocked(empty, 1), false, 'legacy document status cannot unlock Phase 1');

putPack(empty, 0);
assert.equal(phasePct(empty, 0), 100, 'a generated current pack completes its phase');
assert.equal(phaseDone(empty, 0), true, 'the generated Phase 0 pack is complete');
assert.equal(phaseUnlocked(empty, 1), true, 'Phase 1 opens after the Phase 0 pack exists');
assert.equal(phaseUnlocked(empty, 2), false, 'Phase 2 still waits for the Phase 1 pack');
assert.equal(firstOpenPhase(empty), 1, 'the first missing sequential phase is next');
assert.equal(curPhaseIdx(empty), 1, 'the engagement sits at the first missing pack');
assert.equal(sprintPct(empty), 17, 'one of six equal phases is reflected in sprint progress');

putPack(empty, 2);
assert.equal(phaseDone(empty, 2), true, 'an existing current pack is still recorded as complete');
assert.equal(phaseUnlocked(empty, 2), false, 'an orphaned later pack does not bypass a missing prerequisite');
assert.equal(firstMissingPhase(empty, 2), 1, 'the lock points to the earliest missing prerequisite');
assert.match(lockNote(empty, 2), /Phase 1 - Leadership Alignment/, 'the lock explains which pack must be generated');

putPack(empty, 1);
assert.equal(phaseUnlocked(empty, 2), true, 'Phase 2 opens only after both earlier packs exist');
assert.equal(firstOpenPhase(empty), 3, 'the next phase follows the complete sequential run');

for (let phase = 3; phase < PHASES.length; phase++) putPack(empty, phase);
assert.equal(sprintPct(empty), 100, 'all six current packs complete the sprint');
assert.equal(curPhaseIdx(empty), PHASES.length - 1, 'a complete sprint resolves to its final phase');
for (let phase = 0; phase < PHASES.length; phase++) {
  assert.equal(phaseUnlocked(empty, phase), true, `Phase ${phase} remains open after all prerequisites exist`);
}

console.log('Phase progression verified: generated packs are the only completion and unlock checkpoints.');
