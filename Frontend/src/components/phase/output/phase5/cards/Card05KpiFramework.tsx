'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card05KpiFramework({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase5-05" data-card-title="KPI FRAMEWORK">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        05 · KPI FRAMEWORK
      </div>
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,.8fr) minmax(0,.8fr) minmax(0,1fr)', gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)' }}>
        <div style={{ background: 'var(--card3)', padding: '9px 11px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg2)' }}>
          KPI
        </div>
        <div style={{ background: 'var(--card3)', padding: '9px 11px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg2)' }}>
          BASELINE
        </div>
        <div style={{ background: 'var(--card3)', padding: '9px 11px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg2)' }}>
          TARGET
        </div>
        <div style={{ background: 'var(--card3)', padding: '9px 11px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg2)' }}>
          OWNER
        </div>
        {(v.vis5.kpis ?? []).map((k: any, kIndex: number) => (
          <Fragment key={kIndex}>
            <div style={{ display: 'grid', gridColumn: '1 / -1', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,.8fr) minmax(0,.8fr) minmax(0,1fr)', gap: '1px', background: 'var(--ln12)' }}>
              <div style={{ background: 'var(--bg)', padding: '11px', fontSize: '12.5px', fontWeight: '600', lineHeight: '1.35' }}>
                {k.kpi}
              </div>
              <div style={{ background: 'var(--bg)', padding: '11px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px' }}>
                {k.base}
              </div>
              <div style={{ background: 'var(--bg)', padding: '11px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', color: '#D26B51', fontWeight: '700' }}>
                {k.target}
              </div>
              <div style={{ background: 'var(--bg)', padding: '11px', fontSize: '12px', color: 'var(--fg2)' }}>
                {k.owner}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--fg3)' }}>
        {v.vis5.kpiNone}
      </div>
    </div>
  );
}
