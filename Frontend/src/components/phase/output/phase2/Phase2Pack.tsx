'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Card01FunctionalKpiCards } from './cards/Card01FunctionalKpiCards';
import { Card02FunctionPerformanceVsBenchmark } from './cards/Card02FunctionPerformanceVsBenchmark';
import { Card04FunctionalPainHeatmap } from './cards/Card04FunctionalPainHeatmap';
import { Card03FunctionalEconomicsScaleEfficiencyQualityBusinessImpact } from './cards/Card03FunctionalEconomicsScaleEfficiencyQualityBusinessImpact';
import { Card05EnterpriseOpportunityMap } from './cards/Card05EnterpriseOpportunityMap';
import { Card08PriorityMatrixFeasibilityVsBusinessValue } from './cards/Card08PriorityMatrixFeasibilityVsBusinessValue';
import { Card06OpportunityValueRanking } from './cards/Card06OpportunityValueRanking';
import { Card07OpportunityScoring } from './cards/Card07OpportunityScoring';
import { Card09ValueLeakage } from './cards/Card09ValueLeakage';
import { Card10TopOpportunitiesSelectedForForensicAnalysis } from './cards/Card10TopOpportunitiesSelectedForForensicAnalysis';

export function Phase2Pack({ v }: { v: any }) {
  return (
    v.showVisual2 ? (
      <>
      <div style={{ marginTop: '26px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', letterSpacing: '.16em' }}>
            FUNCTIONAL DIAGNOSTIC VISUAL PACK
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
              {v.vis2Status}
            </span>
          </div>
        </div>
        {v.noVis2 ? (
          <>
          <div style={{ border: '2px dashed var(--ln22)', borderRadius: '10px', background: 'var(--card)', padding: '34px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '11px' }}>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '15px', fontWeight: '700', letterSpacing: '.05em' }}>
              KPI CARDS · BENCHMARK · PAIN HEATMAP · OPPORTUNITY MAP · PRIORITY MATRIX · LEAKAGE
            </div>
            <div style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--fg2)', maxWidth: '560px' }}>
              Ten functional-diagnostic views built from the questionnaires, interviews and data room. Every issue carries a number and a value pool; benchmark-derived figures are marked ~ with the basis shown.
            </div>
          </div>
          </>
        ) : null}
        {v.hasVis2 ? (
          <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Card01FunctionalKpiCards v={v} />
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '14px' }}>
              <Card02FunctionPerformanceVsBenchmark v={v} />
              <Card04FunctionalPainHeatmap v={v} />
            </div>
            <Card03FunctionalEconomicsScaleEfficiencyQualityBusinessImpact v={v} />
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '14px' }}>
              <Card05EnterpriseOpportunityMap v={v} />
              <Card08PriorityMatrixFeasibilityVsBusinessValue v={v} />
            </div>
            <Card06OpportunityValueRanking v={v} />
            <Card07OpportunityScoring v={v} />
            <Card09ValueLeakage v={v} />
            <Card10TopOpportunitiesSelectedForForensicAnalysis v={v} />
          </div>
          </>
        ) : null}
      </div>
      </>
    ) : null
  );
}
