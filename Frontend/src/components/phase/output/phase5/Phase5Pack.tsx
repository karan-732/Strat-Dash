'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Card01ValueAtStake } from './cards/Card01ValueAtStake';
import { Card02BusinessCaseByInitiative } from './cards/Card02BusinessCaseByInitiative';
import { Card02ACurrentStateVsFutureState } from './cards/Card02ACurrentStateVsFutureState';
import { Card02BInvestmentSplitAndImplementationScope } from './cards/Card02BInvestmentSplitAndImplementationScope';
import { Card03TransformationPortfolio } from './cards/Card03TransformationPortfolio';
import { Card04SequenceAndDependencies } from './cards/Card04SequenceAndDependencies';
import { Card05KpiFramework } from './cards/Card05KpiFramework';

export function Phase5Pack({ v }: { v: any }) {
  return (
    v.showVisual5 ? (
      <>
      <div style={{ marginTop: '26px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', letterSpacing: '.16em' }}>
            BUSINESS CASE & PORTFOLIO PACK
          </div>
          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
            {v.vis5Status}
          </span>
        </div>
        {v.noVis5 ? (
          <>
          <div style={{ border: '2px dashed var(--ln22)', borderRadius: '10px', background: 'var(--card)', padding: '34px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '11px' }}>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '15px', fontWeight: '700', letterSpacing: '.05em' }}>
              VALUE AT STAKE · BUSINESS CASES · PORTFOLIO · SEQUENCE · KPI FRAMEWORK
            </div>
            <div style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--fg2)', maxWidth: '520px' }}>
              Five investment views on {v.cur.name}. Press GENERATE at the bottom of the INPUTS tab.
            </div>
          </div>
          </>
        ) : null}
        {v.hasVis5 ? (
          <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Card01ValueAtStake v={v} />
            <Card02BusinessCaseByInitiative v={v} />
            {v.xtra.bridge.has ? (
              <>
              <Card02ACurrentStateVsFutureState v={v} />
              </>
            ) : null}
            {v.xtra.scope.has ? (
              <>
              <Card02BInvestmentSplitAndImplementationScope v={v} />
              </>
            ) : null}
            <Card03TransformationPortfolio v={v} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(400px,1fr))', gap: '14px' }}>
              <Card04SequenceAndDependencies v={v} />
              <Card05KpiFramework v={v} />
            </div>
          </div>
          </>
        ) : null}
      </div>
      </>
    ) : null
  );
}
