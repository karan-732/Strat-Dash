'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card02ACurrentStateVsFutureState({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase5-02A" data-card-title="CURRENT STATE VS FUTURE STATE">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
          02A · CURRENT STATE VS FUTURE STATE
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.11em', color: 'var(--fg3)' }}>
          {v.xtra.bridge.unit}
        </div>
      </div>
      <div style={{ marginTop: '13px', display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)' }}>
        {(v.xtra.bridge.rows ?? []).map((b: any, bIndex: number) => (
          <Fragment key={bIndex}>
            <div style={{ background: 'var(--bg)', padding: '12px 13px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr) 74px', gap: '12px', alignItems: 'center' }}>
              <div style={{ fontSize: '12.5px', fontWeight: '600', lineHeight: '1.35', textWrap: 'pretty' }}>
                {b.k}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 52px', gap: '8px', alignItems: 'center' }}>
                  <div style={{ height: '8px', borderRadius: '5px', background: 'var(--ln12)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: b.curW, background: '#D26B51', borderRadius: '5px', transition: 'width .45s cubic-bezier(.2,.7,.3,1)' }} />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', color: 'var(--fg2)', textAlign: 'right' }}>
                    {b.cur}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 52px', gap: '8px', alignItems: 'center' }}>
                  <div style={{ height: '8px', borderRadius: '5px', background: 'var(--ln12)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: b.futW, background: 'var(--ok)', borderRadius: '5px', transition: 'width .45s cubic-bezier(.2,.7,.3,1)' }} />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', color: 'var(--fg2)', textAlign: 'right' }}>
                    {b.fut}
                  </span>
                </div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '13px', fontWeight: '700', letterSpacing: '-.02em', textAlign: 'right', color: b.dFg }}>
                {b.delta}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '11px', display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
          <span style={{ width: '9px', height: '9px', background: '#D26B51', borderRadius: '2px' }} />
          CURRENT STATE
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
          <span style={{ width: '9px', height: '9px', background: 'var(--ok)', borderRadius: '2px' }} />
          FUTURE STATE
        </span>
      </div>
    </div>
  );
}
