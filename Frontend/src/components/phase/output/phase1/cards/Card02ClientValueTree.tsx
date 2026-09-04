'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card02ClientValueTree({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase1-02" data-card-title="CLIENT VALUE TREE">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        02 · CLIENT VALUE TREE
      </div>
      <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ padding: '10px 20px', border: '2px solid #D26B51', background: v.accent, color: '#0E1015', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', fontWeight: '700', letterSpacing: '.14em' }}>
          ENTERPRISE VALUE
        </div>
      </div>
      <div style={{ height: '16px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '1px', background: 'var(--ln26)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '14px' }}>
        {(v.vis1.tree.branches ?? []).map((b: any, bIndex: number) => (
          <Fragment key={bIndex}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '9px 12px', border: `1px solid  ${b.c}`, borderBottom: `3px solid  ${b.c}`, background: 'var(--bg)', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '.13em', textAlign: 'center' }}>
                {b.name}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {(b.drivers ?? []).map((d: any, dIndex: number) => (
                  <Fragment key={dIndex}>
                    <div style={{ display: 'grid', gridTemplateColumns: '18px minmax(0,1fr)', gap: '8px', alignItems: 'start', padding: '9px 2px', borderBottom: '1px solid var(--ln09)' }}>
                      <span style={{ height: '1px', marginTop: '9px', background: b.c }} />
                      <span style={{ minWidth: '0' }}>
                        <span style={{ display: 'block', fontSize: '13px', fontWeight: '600', lineHeight: '1.3' }}>
                          {d.name}
                        </span>
                        <span style={{ display: 'block', marginTop: '3px', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg2)', textWrap: 'pretty' }}>
                          {d.note}
                        </span>
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
        {v.vis1.tree.none}
      </div>
    </div>
  );
}
