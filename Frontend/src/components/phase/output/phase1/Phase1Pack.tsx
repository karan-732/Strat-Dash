'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Card01StrategicNorthStar } from './cards/Card01StrategicNorthStar';
import { Card02ClientValueTree } from './cards/Card02ClientValueTree';
import { Card03ValuePoolAnalysis } from './cards/Card03ValuePoolAnalysis';
import { Card04FunctionalPriorityMatrix } from './cards/Card04FunctionalPriorityMatrix';
import { Card05LeadershipPriorityHeatmap } from './cards/Card05LeadershipPriorityHeatmap';
import { Card06ManagementAmbitionAndConstraints } from './cards/Card06ManagementAmbitionAndConstraints';
import { Card07HypothesisBank } from './cards/Card07HypothesisBank';

export function Phase1Pack({ v }: { v: any }) {
  return (
    v.showVisual1 ? (
      <>
      <div style={{ marginTop: '26px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', letterSpacing: '.16em' }}>
            VALIDATION VISUAL PACK
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
              {v.vis1Status}
            </span>
          </div>
        </div>
        {v.noVis1 ? (
          <>
          <div style={{ border: '2px dashed var(--ln22)', borderRadius: '10px', background: 'var(--card)', padding: '34px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '11px' }}>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '15px', fontWeight: '700', letterSpacing: '.05em' }}>
              NORTH STAR · VALUE TREE · VALUE POOLS · PRIORITY MATRIX · LEADERSHIP HEATMAP · AMBITION · HYPOTHESIS BANK
            </div>
            <div style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--fg2)', maxWidth: '560px' }}>
              Seven validation views built from leadership input, the data room and the Phase 0 outside-in work. Anything unreported is benchmarked against the sector and marked ~ with its basis.
            </div>
          </div>
          </>
        ) : null}
        {v.hasVis1 ? (
          <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Card01StrategicNorthStar v={v} />
            <Card02ClientValueTree v={v} />
            <Card03ValuePoolAnalysis v={v} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(400px,1fr))', gap: '14px' }}>
              <Card04FunctionalPriorityMatrix v={v} />
              <Card05LeadershipPriorityHeatmap v={v} />
            </div>
            {v.xtra.amb.has ? (
              <>
              <Card06ManagementAmbitionAndConstraints v={v} />
              </>
            ) : null}
            <Card07HypothesisBank v={v} />
          </div>
          </>
        ) : null}
      </div>
      </>
    ) : null
  );
}
