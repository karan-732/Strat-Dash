'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card04FunctionalPriorityMatrix({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase1-04" data-card-title="FUNCTIONAL PRIORITY MATRIX">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        04 · FUNCTIONAL PRIORITY MATRIX
      </div>
      <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '20px minmax(0,1fr)', gap: '8px' }}>
        <div style={{ display: 'grid', placeItems: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            PERFORMANCE GAP →
          </div>
        </div>
        <div style={{ position: 'relative', height: '300px', overflow: 'hidden', border: '1px solid var(--ln16)', borderRadius: '9px', background: 'var(--bg)' }}>
          <div style={{ position: 'absolute', left: '50%', top: '0', bottom: '0', width: '1px', background: 'var(--ln13)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', background: 'var(--ln13)' }} />
          <div style={{ position: 'absolute', right: '8px', top: '7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: '#D26B51', fontWeight: '700' }}>
            DEEP DIVE
          </div>
          <div style={{ position: 'absolute', left: '8px', top: '7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg4)' }}>
            SELECTIVE REVIEW
          </div>
          <div style={{ position: 'absolute', right: '8px', bottom: '7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg4)' }}>
            MONITOR
          </div>
          <div style={{ position: 'absolute', left: '8px', bottom: '7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg4)' }}>
            LOW PRIORITY
          </div>
          {(v.vis1.matrix.items ?? []).map((m: any, mIndex: number) => (
            <Fragment key={mIndex}>
              <div style={{ position: 'absolute', left: m.l, top: m.t, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }} data-plot-point="">
                <div style={{ width: '13px', height: '13px', background: m.c, border: '1.5px solid var(--ln40)', transform: 'rotate(45deg)' }} />
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', fontWeight: '600', lineHeight: '1.2', textAlign: 'center', maxWidth: '84px', background: 'var(--bg)', padding: '0 2px', marginTop: m.mt }}>
                  {m.name}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
        <div/>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)', textAlign: 'center', paddingTop: '7px' }}>
          STRATEGIC IMPORTANCE →
        </div>
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)' }}>
        {v.vis1.matrix.none}
      </div>
    </div>
  );
}
