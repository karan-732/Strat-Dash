'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card07OpportunityScoring({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase2-07" data-card-title="OPPORTUNITY SCORING">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        07 · OPPORTUNITY SCORING
      </div>
      <div style={{ marginTop: '13px', overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: v.vis2.score.cols, gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)', minWidth: '620px' }}>
          <div style={{ background: 'var(--card3)', padding: '10px 12px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg2)' }}>
            OPPORTUNITY
          </div>
          {(v.vis2.score.dims ?? []).map((d: any, dIndex: number) => (
            <Fragment key={dIndex}>
              <div style={{ background: 'var(--card3)', padding: '10px 9px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.12em', color: 'var(--fg2)', textAlign: 'center' }}>
                {d.n}
              </div>
            </Fragment>
          ))}
          {(v.vis2.score.rows ?? []).map((r: any, rIndex: number) => (
            <Fragment key={rIndex}>
              <div style={{ display: 'grid', gridColumn: '1 / -1', gridTemplateColumns: v.vis2.score.cols, gap: '1px', background: 'var(--ln12)' }}>
                <div style={{ background: 'var(--bg)', padding: '10px 11px', fontSize: '12.5px', lineHeight: '1.3', fontWeight: '600' }}>
                  {r.name}
                </div>
                {(r.cells ?? []).map((c: any, cIndex: number) => (
                  <Fragment key={cIndex}>
                    <div style={{ background: 'var(--bg)', padding: '9px 9px', display: 'flex', flexDirection: 'column', gap: '5px', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', fontWeight: '700', textAlign: 'center' }}>
                        {c.v}
                      </span>
                      <div style={{ height: '5px', background: 'var(--card3)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: c.w, background: c.c }} />
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)' }}>
        Scored out of 10 on the five sprint dimensions. {v.vis2.score.none}
      </div>
    </div>
  );
}
