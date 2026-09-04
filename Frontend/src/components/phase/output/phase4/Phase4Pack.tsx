'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Card01CurrentFutureProcessComparison } from './cards/Card01CurrentFutureProcessComparison';
import { Card02ActivityTransformationMatrix } from './cards/Card02ActivityTransformationMatrix';
import { Card03HumanVsAiResponsibilityMap } from './cards/Card03HumanVsAiResponsibilityMap';
import { Card04HandoffReduction } from './cards/Card04HandoffReduction';
import { Card05EffortAndCycleTimeReduction } from './cards/Card05EffortAndCycleTimeReduction';
import { Card06DecisionRightsMatrix } from './cards/Card06DecisionRightsMatrix';
import { Card07FutureStateArchitectureAndIntegrationMap } from './cards/Card07FutureStateArchitectureAndIntegrationMap';
import { Card08HumanAndAiRoleSplit } from './cards/Card08HumanAndAiRoleSplit';
import { Card09AiNativeRedesignScorecard } from './cards/Card09AiNativeRedesignScorecard';

export function Phase4Pack({ v }: { v: any }) {
  return (
    v.showVisual4 ? (
      <>
      <div style={{ marginTop: '26px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', letterSpacing: '.16em' }}>
            AI-NATIVE REDESIGN VISUAL PACK
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
              {v.vis4Status}
            </span>
          </div>
        </div>
        {v.noVis4 ? (
          <>
          <div style={{ border: '2px dashed var(--ln22)', borderRadius: '10px', background: 'var(--card)', padding: '44px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '11px' }}>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '15px', fontWeight: '700', letterSpacing: '.05em' }}>
              CURRENT → FUTURE · TRANSFORMATION MATRIX · HUMAN VS AI · DECISION RIGHTS · SCORECARD
            </div>
            <div style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--fg2)', maxWidth: '560px' }}>
              Nine redesign views built from the Phase 3 process twin and the design sessions. Every activity carries a disposition, every decision an owner, and every measure a before and an after.
            </div>
          </div>
          </>
        ) : null}
        {v.hasVis4 ? (
          <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Card01CurrentFutureProcessComparison v={v} />
            <Card02ActivityTransformationMatrix v={v} />
            <Card03HumanVsAiResponsibilityMap v={v} />
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '14px' }}>
              <Card04HandoffReduction v={v} />
              <Card05EffortAndCycleTimeReduction v={v} />
            </div>
            <Card06DecisionRightsMatrix v={v} />
            <Card07FutureStateArchitectureAndIntegrationMap v={v} />
            {v.xtra.roles.has ? (
              <>
              <Card08HumanAndAiRoleSplit v={v} />
              </>
            ) : null}
            <Card09AiNativeRedesignScorecard v={v} />
          </div>
          </>
        ) : null}
      </div>
      </>
    ) : null
  );
}
