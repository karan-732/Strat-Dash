'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card07EconomicImpactByProcessStep({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase3-07" data-card-title="ECONOMIC IMPACT BY PROCESS STEP">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        07 · ECONOMIC IMPACT BY PROCESS STEP
      </div>
      <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--fg2)' }}>
        {v.vis3.cost.title}
      </div>
      <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '11px' }}>
        {(v.vis3.cost.items ?? []).map((c: any, cIndex: number) => (
          <Fragment key={cIndex}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '12.5px', lineHeight: '1.3' }}>
                  {c.name}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11.5px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                  {c.val}
                </span>
              </div>
              <div style={{ marginTop: '6px', height: '9px', background: 'var(--card2)', border: '1px solid var(--ln12)' }}>
                <div style={{ height: '100%', width: c.w, background: '#D26B51' }} />
              </div>
              <div style={{ marginTop: '5px', fontSize: '11px', lineHeight: '1.4', color: 'var(--fg3)' }}>
                {c.basis}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px', borderTop: '1px solid var(--ln16)', paddingTop: '11px' }}>
        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
          TOTAL ANNUAL COST OF THE PROCESS AS IT RUNS
        </span>
        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '14px', fontWeight: '700' }}>
          {v.vis3.cost.total}
        </span>
      </div>
      <div style={{ marginTop: '9px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)' }}>
        {v.vis3.cost.none}
      </div>
    </div>
  );
}
