'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card09ValueLeakage({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase2-09" data-card-title="VALUE LEAKAGE">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        09 · VALUE LEAKAGE
      </div>
      <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', paddingBottom: '9px', borderBottom: '1px solid var(--ln12)' }}>
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {v.vis2.leak.baseLabel}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '14px', fontWeight: '700' }}>
            {v.vis2.leak.baseVal}
          </span>
        </div>
        {(v.vis2.leak.steps ?? []).map((l: any, lIndex: number) => (
          <Fragment key={lIndex}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 120px auto', gap: '12px', alignItems: 'center', padding: '5px 0' }}>
              <span style={{ fontSize: '12.5px', color: 'var(--fg2)' }}>
                ↓ {l.name}
              </span>
              <div style={{ height: '10px', background: 'var(--card3)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: l.w, background: 'var(--bad)' }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                {l.val}
              </span>
            </div>
          </Fragment>
        ))}
        <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', padding: '11px 13px', border: '2px solid #D26B51', borderRadius: '8px', background: 'var(--card0)' }}>
          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', fontWeight: '700', letterSpacing: '.1em' }}>
            {v.vis2.leak.recLabel}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '17px', fontWeight: '700' }}>
            {v.vis2.leak.recVal}
          </span>
        </div>
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)' }}>
        {v.vis2.leak.none}
      </div>
    </div>
  );
}
