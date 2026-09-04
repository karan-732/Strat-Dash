'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card09RootCauseTree({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase3-09" data-card-title="ROOT CAUSE TREE">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        09 · ROOT CAUSE TREE
      </div>
      <div style={{ marginTop: '11px', fontSize: '14.5px', fontWeight: '600', lineHeight: '1.35' }}>
        {v.vis3.root.question}
      </div>
      <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {(v.vis3.root.branches ?? []).map((b: any, bIndex: number) => (
            <Fragment key={bIndex}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '9px', border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '8px', padding: '10px 12px' }}>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', color: '#D26B51' }}>
                  →
                </span>
                <span style={{ fontSize: '12.5px', lineHeight: '1.4' }}>
                  {b.t}
                </span>
              </div>
            </Fragment>
          ))}
        </div>
        <div style={{ border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', borderLeft: `3px solid  ${v.accent}`, padding: '13px 14px 14px' }}>
          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
            DRILLING INTO
          </div>
          <div style={{ marginTop: '6px', fontSize: '13.5px', fontWeight: '600', lineHeight: '1.35' }}>
            {v.vis3.root.drillCause}
          </div>
          <div style={{ marginTop: '11px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {(v.vis3.root.drill ?? []).map((d: any, dIndex: number) => (
              <Fragment key={dIndex}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '9px' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', color: v.accent }}>
                    →
                  </span>
                  <span style={{ fontSize: '12.5px', lineHeight: '1.4', color: 'var(--fg2)' }}>
                    {d.t}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--fg3)' }}>
        {v.vis3.root.none}
      </div>
    </div>
  );
}
