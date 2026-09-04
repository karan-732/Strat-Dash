'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card03TransformationPortfolio({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase5-03" data-card-title="TRANSFORMATION PORTFOLIO">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        03 · TRANSFORMATION PORTFOLIO
      </div>
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '10px' }}>
        {(v.vis5.port ?? []).map((q: any, qIndex: number) => (
          <Fragment key={qIndex}>
            <div style={{ border: '1px solid var(--ln10)', borderTop: `3px solid  ${q.c}`, background: 'var(--bg)', borderRadius: '9px', padding: '13px 13px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '.12em', color: q.c }}>
                  {q.k}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '15px', fontWeight: '700' }}>
                  {q.count}
                </span>
              </div>
              <div style={{ marginTop: '4px', fontSize: '11px', color: 'var(--fg3)' }}>
                {q.sub}
              </div>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(q.items ?? []).map((i: any, iIndex: number) => (
                  <Fragment key={iIndex}>
                    <div style={{ fontSize: '12.5px', lineHeight: '1.4', paddingLeft: '10px', borderLeft: '2px solid var(--ln20)' }}>
                      {i.t}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
