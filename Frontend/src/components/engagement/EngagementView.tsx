'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { EngagementHeader } from './EngagementHeader';
import { EngagementOverview } from './EngagementOverview';
import { PhaseWorkspace } from './PhaseWorkspace';

export function EngagementView({ v }: { v: any }) {
  return (
    v.isProj ? (
      <>
      <div className="eng-shell">
        <EngagementHeader v={v} />
        <EngagementOverview v={v} />
        <PhaseWorkspace v={v} />
      </div>
      </>
    ) : null
  );
}
