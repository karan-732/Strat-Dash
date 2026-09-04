'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card07ValueTreeAndValueChain({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase0-07" data-card-title="VALUE TREE AND VALUE CHAIN">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        07 · VALUE TREE AND VALUE CHAIN
      </div>
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)' }}>
        {(v.vis.tree ?? []).map((t: any, tIndex: number) => (
          <Fragment key={tIndex}>
            <div style={{ background: 'var(--bg)', padding: '13px 14px 15px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.14em', fontWeight: '600', color: t.c }}>
                {t.k}
              </div>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(t.items ?? []).map((i: any, iIndex: number) => (
                  <Fragment key={iIndex}>
                    <div style={{ display: 'grid', gridTemplateColumns: '14px minmax(0,1fr)', gap: '7px', alignItems: 'start' }}>
                      <span style={{ height: '1px', marginTop: '9px', background: t.c }} />
                      <span style={{ fontSize: '12.5px', lineHeight: '1.45', textWrap: 'pretty' }}>
                        {i.t}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '16px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
        VALUE CHAIN
      </div>
      <div style={{ marginTop: '9px', overflowX: 'auto', paddingBottom: '4px' }}>
        <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(168px,1fr)', gap: '6px' }}>
          {(v.vis.chain ?? []).map((c: any, cIndex: number) => (
            <Fragment key={cIndex}>
              <div style={{ border: '1px solid var(--ln20)', background: 'var(--bg)', borderBottom: '3px solid #D26B51', padding: '11px 12px 12px' }}>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                  {c.n}
                </div>
                <div style={{ marginTop: '5px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', fontWeight: '600', letterSpacing: '-.01em', lineHeight: '1.3' }}>
                  {c.stage}
                </div>
                <div style={{ marginTop: '5px', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg2)', textWrap: 'pretty' }}>
                  {c.note}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
