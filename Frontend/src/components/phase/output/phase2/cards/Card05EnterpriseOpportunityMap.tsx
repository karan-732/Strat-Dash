'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card05EnterpriseOpportunityMap({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase2-05" data-card-title="ENTERPRISE OPPORTUNITY MAP">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        05 · ENTERPRISE OPPORTUNITY MAP
      </div>
      <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '20px minmax(0,1fr)', gap: '8px' }}>
        <div style={{ display: 'grid', placeItems: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            BUSINESS VALUE →
          </div>
        </div>
        <div style={{ position: 'relative', height: '300px', overflow: 'hidden', border: '1px solid var(--ln16)', borderRadius: '9px', background: 'var(--bg)' }}>
          <div style={{ position: 'absolute', left: '50%', top: '0', bottom: '0', width: '1px', background: 'var(--ln12)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', background: 'var(--ln12)' }} />
          <div style={{ position: 'absolute', right: '8px', top: '7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg4)' }}>
            PRIORITY
          </div>
          {(v.vis2.map.items ?? []).map((m: any, mIndex: number) => (
            <Fragment key={mIndex}>
              <div style={{ position: 'absolute', left: m.l, top: m.t, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }} data-plot-point="">
                <div style={{ width: m.d, height: m.d, borderRadius: '50%', background: m.c, border: '1.5px solid var(--ln30)', display: 'grid', placeItems: 'center' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', fontWeight: '700', color: '#0E1015' }}>
                    {m.val}
                  </span>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.05em', color: 'var(--fg2)', whiteSpace: 'nowrap', marginTop: m.mt }}>
                  {m.name}
                </span>
              </div>
            </Fragment>
          ))}
        </div>
        <div/>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)', textAlign: 'center', paddingTop: '7px' }}>
          PROCESS PAIN →
        </div>
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)' }}>
        Bubble size is value at stake ({v.vis2.map.unit}). {v.vis2.map.none}
      </div>
    </div>
  );
}
