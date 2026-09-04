'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card03FunctionalEconomicsScaleEfficiencyQualityBusinessImpact({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase2-03" data-card-title="FUNCTIONAL ECONOMICS — SCALE, EFFICIENCY, QUALITY, BUSINESS IMPACT">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        03 · FUNCTIONAL ECONOMICS — SCALE, EFFICIENCY, QUALITY, BUSINESS IMPACT
      </div>
      <div style={{ marginTop: '13px', overflowX: 'auto', paddingBottom: '4px' }}>
        <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(300px,1fr)', gap: '10px' }}>
          {(v.vis2.econ ?? []).map((e: any, eIndex: number) => (
            <Fragment key={eIndex}>
              <div style={{ border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', padding: '14px 15px 15px' }}>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '.1em' }}>
                  {e.name}
                </div>
                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '12px' }}>
                  {(e.groups ?? []).map((g: any, gIndex: number) => (
                    <Fragment key={gIndex}>
                      <div>
                        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: g.c, paddingBottom: '5px', borderBottom: `2px solid  ${g.c}` }}>
                          {g.k}
                        </div>
                        <div style={{ marginTop: '7px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {(g.rows ?? []).map((m: any, mIndex: number) => (
                            <Fragment key={mIndex}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                                <span style={{ fontSize: '11.5px', lineHeight: '1.3', color: 'var(--fg2)', minWidth: '0' }}>
                                  {m.k}
                                </span>
                                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                                  {m.v}
                                </span>
                              </div>
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
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--fg3)' }}>
        {v.vis2.econNone}
      </div>
    </div>
  );
}
