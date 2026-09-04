'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card05EffortAndCycleTimeReduction({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase4-05" data-card-title="EFFORT AND CYCLE-TIME REDUCTION">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        05 · EFFORT AND CYCLE-TIME REDUCTION
      </div>
      <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--fg2)' }}>
        {v.vis4.effortR.title}
      </div>
      <div style={{ marginTop: '16px', display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(0,1fr)', gap: '14px', alignItems: 'end', height: '180px', borderBottom: '1px solid var(--ln16)' }}>
        {(v.vis4.effortR.items ?? []).map((b: any, bIndex: number) => (
          <Fragment key={bIndex}>
            <div style={{ display: 'flex', gap: '7px', alignItems: 'flex-end', justifyContent: 'center', height: '100%' }}>
              <div style={{ flex: '1', maxWidth: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                  {b.cLabel}
                </span>
                <div style={{ marginTop: '5px', width: '100%', height: b.cH, background: '#D26B51' }} />
              </div>
              <div style={{ flex: '1', maxWidth: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', fontWeight: '700', whiteSpace: 'nowrap', color: v.accent }}>
                  {b.fLabel}
                </span>
                <div style={{ marginTop: '5px', width: '100%', height: b.fH, background: v.accent }} />
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(0,1fr)', gap: '14px', marginTop: '7px' }}>
        {(v.vis4.effortR.items ?? []).map((b: any, bIndex: number) => (
          <Fragment key={bIndex}>
            <div style={{ fontSize: '11px', lineHeight: '1.3', color: 'var(--fg2)', textAlign: 'center' }}>
              {b.k}
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '12px', display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
          <span style={{ width: '9px', height: '9px', background: '#D26B51' }} />
          CURRENT STATE
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
          <span style={{ width: '9px', height: '9px', background: v.accent }} />
          FUTURE STATE
        </span>
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)', textWrap: 'pretty' }}>
        {v.vis4.effortR.note}
      </div>
    </div>
  );
}
