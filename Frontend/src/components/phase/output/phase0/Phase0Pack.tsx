'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Card01CompanySnapshot } from './cards/Card01CompanySnapshot';
import { Card02Swot } from './cards/Card02Swot';
import { Card03CompetitiveBenchmarkQuadrant } from './cards/Card03CompetitiveBenchmarkQuadrant';
import { Card04CompetitivePositioningMap } from './cards/Card04CompetitivePositioningMap';
import { Card04AMetricComparisonQuadrants } from './cards/Card04AMetricComparisonQuadrants';
import { Card05PeerRankingByParameter } from './cards/Card05PeerRankingByParameter';
import { Card06CapabilityHeatmap } from './cards/Card06CapabilityHeatmap';
import { Card07ValueTreeAndValueChain } from './cards/Card07ValueTreeAndValueChain';
import { Card07AValueChainStageDetail } from './cards/Card07AValueChainStageDetail';
import { Card07BActivityClassification } from './cards/Card07BActivityClassification';
import { Card07CInitialHypothesisBank } from './cards/Card07CInitialHypothesisBank';
import { Card07DStakeholderMapAndDataRequestList } from './cards/Card07DStakeholderMapAndDataRequestList';
import { Card08BcgMatrixPortfolioPositioning } from './cards/Card08BcgMatrixPortfolioPositioning';

export function Phase0Pack({ v }: { v: any }) {
  return (
    v.showVisual ? (
      <>
      <div style={{ marginTop: '26px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', letterSpacing: '.16em' }}>
            OUTSIDE-IN VISUAL PACK
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
              {v.visStatus}
            </span>
          </div>
        </div>
        {v.noVis ? (
          <>
          <div style={{ border: '2px dashed var(--ln22)', borderRadius: '10px', background: 'var(--card)', padding: '34px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '11px' }}>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '15px', fontWeight: '700', letterSpacing: '.05em' }}>
              SNAPSHOT · SWOT · BENCHMARK · POSITIONING · CAPABILITY HEATMAP · VALUE TREE · BCG
            </div>
            <div style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--fg2)', maxWidth: '520px' }}>
              Seven outside-in views on {v.cur.name}. Public figures where they exist; anything unreported is benchmarked against the sector and marked ~ with its basis.
            </div>
          </div>
          </>
        ) : null}
        {v.hasVis ? (
          <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Card01CompanySnapshot v={v} />
            <Card02Swot v={v} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(400px,1fr))', gap: '14px' }}>
              <Card03CompetitiveBenchmarkQuadrant v={v} />
              <Card04CompetitivePositioningMap v={v} />
            </div>
            {v.xtra.quads.has ? (
              <>
              <Card04AMetricComparisonQuadrants v={v} />
              </>
            ) : null}
            {v.vis.rank.has ? (
              <>
              <Card05PeerRankingByParameter v={v} />
              </>
            ) : null}
            <Card06CapabilityHeatmap v={v} />
            <Card07ValueTreeAndValueChain v={v} />
            {v.xtra.chain.has ? (
              <>
              <Card07AValueChainStageDetail v={v} />
              </>
            ) : null}
            {v.xtra.cls.has ? (
              <>
              <Card07BActivityClassification v={v} />
              </>
            ) : null}
            {v.xtra.hyp.has ? (
              <>
              <Card07CInitialHypothesisBank v={v} />
              </>
            ) : null}
            {v.xtra.stk.has ? (
              <>
              <Card07DStakeholderMapAndDataRequestList v={v} />
              </>
            ) : null}
            <Card08BcgMatrixPortfolioPositioning v={v} />
          </div>
          </>
        ) : null}
      </div>
      </>
    ) : null
  );
}
