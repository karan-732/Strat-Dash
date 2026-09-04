'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Card01CurrentStateProcessTwin } from './cards/Card01CurrentStateProcessTwin';
import { Card03ProcessHealth } from './cards/Card03ProcessHealth';
import { Card02ActiveEffortVsWaitingTime } from './cards/Card02ActiveEffortVsWaitingTime';
import { Card04HandoffAnalysis } from './cards/Card04HandoffAnalysis';
import { Card08PeopleAndSystemsMap } from './cards/Card08PeopleAndSystemsMap';
import { Card05FrictionHeatmap } from './cards/Card05FrictionHeatmap';
import { Card06ReworkAndExceptions } from './cards/Card06ReworkAndExceptions';
import { Card07EconomicImpactByProcessStep } from './cards/Card07EconomicImpactByProcessStep';
import { Card09RootCauseTree } from './cards/Card09RootCauseTree';
import { Card09AStepLevelQuantification } from './cards/Card09AStepLevelQuantification';
import { Card10ProcessOpportunityCards } from './cards/Card10ProcessOpportunityCards';

export function Phase3Pack({ v }: { v: any }) {
  return (
    v.showVisual3 ? (
      <>
      <div style={{ marginTop: '26px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', letterSpacing: '.16em' }}>
            PROCESS FORENSICS VISUAL PACK
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
              {v.vis3Status}
            </span>
          </div>
        </div>
        {v.noVis3 ? (
          <>
          <div style={{ border: '2px dashed var(--ln22)', borderRadius: '10px', background: 'var(--card)', padding: '44px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '11px' }}>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '15px', fontWeight: '700', letterSpacing: '.05em' }}>
              PROCESS TWIN · EFFORT VS WAIT · HANDOFFS · FRICTION HEATMAP · ROOT CAUSE
            </div>
            <div style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--fg2)', maxWidth: '560px' }}>
              Ten forensic views built from the observation log, the traced unit of work and the step quantification table. Every step carries effort, waiting time, systems touched and economic consequence.
            </div>
          </div>
          </>
        ) : null}
        {v.hasVis3 ? (
          <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Card01CurrentStateProcessTwin v={v} />
            <Card03ProcessHealth v={v} />
            <Card02ActiveEffortVsWaitingTime v={v} />
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '14px' }}>
              <Card04HandoffAnalysis v={v} />
              <Card08PeopleAndSystemsMap v={v} />
            </div>
            <Card05FrictionHeatmap v={v} />
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '14px' }}>
              <Card06ReworkAndExceptions v={v} />
              <Card07EconomicImpactByProcessStep v={v} />
            </div>
            <Card09RootCauseTree v={v} />
            {v.xtra.steps.has ? (
              <>
              <Card09AStepLevelQuantification v={v} />
              </>
            ) : null}
            <Card10ProcessOpportunityCards v={v} />
          </div>
          </>
        ) : null}
      </div>
      </>
    ) : null
  );
}
