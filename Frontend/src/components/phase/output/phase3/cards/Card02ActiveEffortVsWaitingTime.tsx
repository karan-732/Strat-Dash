'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card02ActiveEffortVsWaitingTime({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase3-02" data-card-title="ACTIVE EFFORT VS WAITING TIME">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        02 · ACTIVE EFFORT VS WAITING TIME
      </div>
      <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--fg2)' }}>
        {v.vis3.effort.title}
      </div>
      <div style={{ marginTop: '16px', display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(0,1fr)', gap: '16px', alignItems: 'end', height: '210px', borderBottom: '1px solid var(--ln16)' }}>
        {(v.vis3.effort.items ?? []).map((e: any, eIndex: number) => (
          <Fragment key={eIndex}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
              <div style={{ width: '64%', maxWidth: '70px', flex: '1 1 auto', minHeight: '0', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                <span style={{ flex: '0 0 auto', marginBottom: '5px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                  {e.total}
                </span>
                <div style={{ flex: '0 0 auto', width: '100%', height: e.wH, background: v.accent }} title={e.waitT} />
                <div style={{ flex: '0 0 auto', width: '100%', height: e.aH, background: '#D26B51' }} title={e.actT} />
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(0,1fr)', gap: '16px', marginTop: '7px' }}>
        {(v.vis3.effort.items ?? []).map((e: any, eIndex: number) => (
          <Fragment key={eIndex}>
            <div style={{ fontSize: '11px', lineHeight: '1.3', color: 'var(--fg2)', textAlign: 'center' }}>
              {e.name}
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '12px', display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
          <span style={{ width: '9px', height: '9px', background: '#D26B51' }} />
          ACTIVE EFFORT
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
          <span style={{ width: '9px', height: '9px', background: v.accent }} />
          WAITING TIME
        </span>
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)' }}>
        {v.vis3.effort.none}
      </div>
    </div>
  );
}
