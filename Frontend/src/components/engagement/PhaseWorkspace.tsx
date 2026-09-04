'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { PhaseNav } from './PhaseNav';
import { PhaseHero } from './PhaseHero';
import { PhaseTabs } from './PhaseTabs';
import { PhaseInputs } from '../phase/inputs/PhaseInputs';
import { PhaseOutput } from '../phase/output/PhaseOutput';

export function PhaseWorkspace({ v }: { v: any }) {
  return (
    v.phaseWorkspace ? (
      <>
      <PhaseNav v={v} />
      <div className="eng-workspace-scroll">
        <PhaseHero v={v} />
        <PhaseTabs v={v} />
        <div className="eng-content">
          <PhaseInputs v={v} />
          <PhaseOutput v={v} />
        </div>
      </div>
      </>
    ) : null
  );
}
