'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card03ValuePoolAnalysis({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase1-03" data-card-title="VALUE POOL ANALYSIS">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
          03 · VALUE POOL ANALYSIS
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', fontWeight: '700' }}>
          TOTAL AT STAKE · {v.vis1.pools.total}
        </div>
      </div>
      {v.vis1.pools.has ? (
        <>
        <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: '18px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {(v.vis1.pools.items ?? []).map((v: any, vIndex: number) => (
              <Fragment key={vIndex}>
                <div style={{ padding: '9px 0', borderBottom: '1px solid var(--ln09)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
                      {v.name}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                      {v.val}
                    </span>
                  </div>
                  <div style={{ marginTop: '7px', height: '11px', background: 'var(--ln09)' }}>
                    <div style={{ height: '100%', width: v.w, background: v.c }} />
                  </div>
                  <div style={{ marginTop: '5px', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg2)' }}>
                    {v.basis}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', padding: '6px 0' }}>
            {(v.vis1.pools.items ?? []).map((v: any, vIndex: number) => (
              <Fragment key={vIndex}>
                <div style={{ width: v.bub, height: v.bub, borderRadius: '50%', background: v.c, border: '1.5px solid var(--ln30)', display: 'grid', placeItems: 'center', textAlign: 'center', padding: '4px' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', fontWeight: '700', color: '#0E1015', lineHeight: '1.15' }}>
                    {v.val}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        </>
      ) : null}
      <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--fg3)' }}>
        {v.vis1.pools.none}
      </div>
    </div>
  );
}
