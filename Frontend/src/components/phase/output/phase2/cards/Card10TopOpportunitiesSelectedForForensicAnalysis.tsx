'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card10TopOpportunitiesSelectedForForensicAnalysis({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase2-10" data-card-title="TOP OPPORTUNITIES SELECTED FOR FORENSIC ANALYSIS">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        10 · TOP OPPORTUNITIES SELECTED FOR FORENSIC ANALYSIS
      </div>
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(258px,1fr))', gap: '10px' }}>
        {(v.vis2.top ?? []).map((t: any, tIndex: number) => (
          <Fragment key={tIndex}>
            <div style={{ border: '1px solid var(--ln10)', borderLeft: '4px solid #D26B51', background: 'var(--bg)', borderRadius: '9px', padding: '14px 15px 15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                  {t.rank}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', fontWeight: '700' }}>
                  {t.pool}
                </span>
              </div>
              <div style={{ marginTop: '7px', fontSize: '15px', fontWeight: '600', lineHeight: '1.25' }}>
                {t.name}
              </div>
              <div style={{ marginTop: '11px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {(t.rows ?? []).map((r: any, rIndex: number) => (
                  <Fragment key={rIndex}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                      <span style={{ fontSize: '11.5px', color: 'var(--fg3)' }}>
                        {r.k}
                      </span>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '700', letterSpacing: '.08em', color: r.c }}>
                        {r.v}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ marginTop: '11px', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg2)', textWrap: 'pretty' }}>
                {t.note}
              </div>
              <div style={{ marginTop: '11px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '700', letterSpacing: '.1em', color: '#D26B51' }}>
                → {t.next}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--fg3)' }}>
        {v.vis2.topNone}
      </div>
    </div>
  );
}
