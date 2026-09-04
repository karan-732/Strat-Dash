'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card07FutureStateArchitectureAndIntegrationMap({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase4-07" data-card-title="FUTURE-STATE ARCHITECTURE AND INTEGRATION MAP">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        07 · FUTURE-STATE ARCHITECTURE AND INTEGRATION MAP
      </div>
      <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.15fr)', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '0' }}>
          {(v.vis4.arch.layers ?? []).map((l: any, lIndex: number) => (
            <Fragment key={lIndex}>
              <div>
                <div style={{ border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', borderLeft: `3px solid  ${l.c}`, padding: '12px 14px 13px' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: '600', lineHeight: '1.3' }}>
                    {l.name}
                  </div>
                  <div style={{ marginTop: '5px', fontSize: '11px', lineHeight: '1.4', color: 'var(--fg3)', textWrap: 'pretty' }}>
                    {l.note}
                  </div>
                </div>
                <div style={{ height: '18px', display: 'grid', placeItems: 'center', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', color: '#D26B51' }}>
                  {l.arrow}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '10px', alignContent: 'start' }}>
          {(v.vis4.arch.cards ?? []).map((c: any, cIndex: number) => (
            <Fragment key={cIndex}>
              <div style={{ border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', padding: '12px 13px 13px' }}>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', fontWeight: '700', letterSpacing: '.12em', color: 'var(--fg3)' }}>
                  {c.k}
                </div>
                <div style={{ marginTop: '9px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(c.items ?? []).map((it: any, itIndex: number) => (
                    <Fragment key={itIndex}>
                      <div style={{ fontSize: '11.5px', lineHeight: '1.35', color: 'var(--fg2)', textWrap: 'pretty' }}>
                        {it.t}
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)' }}>
        {v.vis4.arch.none}
      </div>
    </div>
  );
}
