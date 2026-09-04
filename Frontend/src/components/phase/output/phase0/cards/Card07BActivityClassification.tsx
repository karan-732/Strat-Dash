'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card07BActivityClassification({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase0-07B" data-card-title="ACTIVITY CLASSIFICATION">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        07B · ACTIVITY CLASSIFICATION
      </div>
      <div style={{ marginTop: '13px', display: 'flex', height: '10px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--ln12)' }}>
        {(v.xtra.cls.lanes ?? []).map((l: any, lIndex: number) => (
          <Fragment key={lIndex}>
            <div style={{ width: l.pct, background: l.c, transition: 'width .5s cubic-bezier(.2,.7,.3,1)' }} />
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)' }}>
        {(v.xtra.cls.lanes ?? []).map((l: any, lIndex: number) => (
          <Fragment key={lIndex}>
            <div style={{ background: 'var(--bg)', padding: '14px 15px 15px', borderTop: `3px solid  ${l.c}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '9px' }}>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.14em', fontWeight: '600', color: l.c }}>
                  {l.k}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '15px', fontWeight: '700', letterSpacing: '-.02em' }}>
                  {l.count}
                </div>
              </div>
              <div style={{ marginTop: '5px', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg3)', textWrap: 'pretty' }}>
                {l.d}
              </div>
              <div style={{ marginTop: '11px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(l.items ?? []).map((a: any, aIndex: number) => (
                  <Fragment key={aIndex}>
                    <div style={{ display: 'grid', gridTemplateColumns: '6px minmax(0,1fr)', gap: '9px', alignItems: 'start' }}>
                      <span style={{ width: '6px', height: '6px', marginTop: '6px', borderRadius: '50%', background: l.c }} />
                      <div style={{ minWidth: '0' }}>
                        <div style={{ fontSize: '12.5px', fontWeight: '600', lineHeight: '1.35', textWrap: 'pretty' }}>
                          {a.n}
                        </div>
                        <div style={{ marginTop: '3px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.11em', color: l.c }}>
                          {a.tag}
                        </div>
                        <div style={{ marginTop: '3px', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg2)', textWrap: 'pretty' }}>
                          {a.note}
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ marginTop: '11px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.12em', color: 'var(--fg3)' }}>
                {l.share}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
