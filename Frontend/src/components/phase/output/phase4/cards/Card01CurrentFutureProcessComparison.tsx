'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card01CurrentFutureProcessComparison({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase4-01" data-card-title="CURRENT → FUTURE PROCESS COMPARISON">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
          01 · CURRENT → FUTURE PROCESS COMPARISON
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.1em', color: 'var(--fg2)' }}>
          {v.vis4.compare.name}
        </div>
      </div>
      <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '14px' }}>
        {(v.vis4.compare.cols ?? []).map((col: any, colIndex: number) => (
          <Fragment key={colIndex}>
            <div style={{ border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', padding: '13px 14px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10.5px', fontWeight: '700', letterSpacing: '.14em', color: col.c }}>
                  {col.title}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
                  {col.summary}
                </span>
              </div>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {(col.steps ?? []).map((s: any, sIndex: number) => (
                  <Fragment key={sIndex}>
                    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '8px', borderLeft: `3px solid  ${s.c}`, padding: '10px 12px 11px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '9px' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: '600', lineHeight: '1.3' }}>
                          {s.name}
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', fontWeight: '700', letterSpacing: '.08em', color: s.c, whiteSpace: 'nowrap' }}>
                          {s.actor}
                        </span>
                      </div>
                      <div style={{ marginTop: '7px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {(s.chips ?? []).map((ch: any, chIndex: number) => (
                          <Fragment key={chIndex}>
                            <span style={{ border: '1px solid var(--ln12)', background: 'var(--card2)', padding: '3px 7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.05em', color: 'var(--fg3)' }}>
                              {ch.t}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '10px' }}>
        {(v.vis4.compare.deltas ?? []).map((d: any, dIndex: number) => (
          <Fragment key={dIndex}>
            <div style={{ border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', padding: '12px 13px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '16px', fontWeight: '700' }}>
                {d.v}
              </div>
              <div style={{ marginTop: '4px', fontSize: '11px', color: 'var(--fg3)' }}>
                {d.k}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)' }}>
        {v.vis4.compare.none}
      </div>
    </div>
  );
}
