'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card09AiNativeRedesignScorecard({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase4-09" data-card-title="AI-NATIVE REDESIGN SCORECARD">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        09 · AI-NATIVE REDESIGN SCORECARD
      </div>
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '12px' }}>
        {(v.vis4.score ?? []).map((s: any, sIndex: number) => (
          <Fragment key={sIndex}>
            <div style={{ border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', padding: '15px 16px 16px' }}>
              <div style={{ fontSize: '14.5px', fontWeight: '600', lineHeight: '1.3' }}>
                {s.name}
              </div>
              <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: '8px' }}>
                {(s.mix ?? []).map((m: any, mIndex: number) => (
                  <Fragment key={mIndex}>
                    <div style={{ borderTop: `2px solid  ${m.c}`, paddingTop: '8px' }}>
                      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '17px', fontWeight: '700' }}>
                        {m.v}
                      </div>
                      <div style={{ marginTop: '3px', fontSize: '10px', lineHeight: '1.25', color: 'var(--fg3)' }}>
                        {m.k}
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '7px', borderTop: '1px solid var(--ln16)', paddingTop: '11px' }}>
                {(s.rows ?? []).map((r: any, rIndex: number) => (
                  <Fragment key={rIndex}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                      <span style={{ fontSize: '11.5px', color: 'var(--fg3)' }}>
                        {r.k}
                      </span>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '.05em' }}>
                        {r.v}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--fg3)' }}>
        {v.vis4.scoreNone}
      </div>
    </div>
  );
}
