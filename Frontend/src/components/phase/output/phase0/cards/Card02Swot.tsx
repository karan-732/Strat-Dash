'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card02Swot({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase0-02" data-card-title="SWOT">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        02 · SWOT
      </div>
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)' }}>
        {(v.vis.swot ?? []).map((q: any, qIndex: number) => (
          <Fragment key={qIndex}>
            <div style={{ background: 'var(--bg)', padding: '14px 15px 15px', borderTop: `3px solid  ${q.c}` }}>
              <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.16em', fontWeight: '600' }}>
                {q.t}
              </div>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {(q.items ?? []).map((i: any, iIndex: number) => (
                  <Fragment key={iIndex}>
                    <div style={{ display: 'flex', gap: '9px' }}>
                      <span style={{ width: '5px', height: '5px', marginTop: '6px', flex: '0 0 auto', background: q.c }} />
                      <span style={{ flex: '1', minWidth: '0', fontSize: '13px', lineHeight: '1.5', color: 'var(--fg)', textWrap: 'pretty' }}>
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
    </div>
  );
}
