'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card01FunctionalKpiCards({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase2-01" data-card-title="FUNCTIONAL KPI CARDS">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        01 · FUNCTIONAL KPI CARDS
      </div>
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '10px' }}>
        {(v.vis2.kpi ?? []).map((f: any, fIndex: number) => (
          <Fragment key={fIndex}>
            <div style={{ border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', borderLeft: '4px solid #D26B51', padding: '13px 14px 14px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '.1em' }}>
                {f.name}
              </div>
              <div style={{ marginTop: '11px', display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '11px' }}>
                {(f.metrics ?? []).map((m: any, mIndex: number) => (
                  <Fragment key={mIndex}>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '16px', fontWeight: '700', letterSpacing: '-.01em' }}>
                        {m.v}
                      </div>
                      <div style={{ marginTop: '3px', fontSize: '11px', lineHeight: '1.35', color: 'var(--fg3)' }}>
                        {m.k}
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ marginTop: '11px', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg3)', textWrap: 'pretty' }}>
                {f.note}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--fg3)' }}>
        {v.vis2.kpiNone}
      </div>
    </div>
  );
}
