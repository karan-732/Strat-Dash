'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card05FrictionHeatmap({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase3-05" data-card-title="FRICTION HEATMAP">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        05 · FRICTION HEATMAP
      </div>
      <div style={{ marginTop: '13px', overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: v.vis3.friction.cols, gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)', minWidth: '560px' }}>
          <div style={{ background: 'var(--card3)', padding: '9px 11px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg2)' }}>
            PROCESS STEP
          </div>
          {(v.vis3.friction.dims ?? []).map((d: any, dIndex: number) => (
            <Fragment key={dIndex}>
              <div style={{ background: 'var(--card3)', padding: '9px 8px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.12em', color: 'var(--fg2)', textAlign: 'center' }}>
                {d.n}
              </div>
            </Fragment>
          ))}
          {(v.vis3.friction.rows ?? []).map((r: any, rIndex: number) => (
            <Fragment key={rIndex}>
              <div style={{ display: 'grid', gridColumn: '1 / -1', gridTemplateColumns: v.vis3.friction.cols, gap: '1px', background: 'var(--ln12)' }}>
                <div style={{ background: 'var(--bg)', padding: '10px 11px', fontSize: '12.5px', lineHeight: '1.3', fontWeight: '600' }}>
                  {r.name}
                </div>
                {(r.cells ?? []).map((c: any, cIndex: number) => (
                  <Fragment key={cIndex}>
                    <div style={{ background: 'var(--bg)', padding: '10px 8px', display: 'grid', placeItems: 'center' }}>
                      <span title={c.title} style={{ width: '15px', height: '15px', borderRadius: '50%', background: c.c, border: '1px solid var(--ln20)' }} />
                    </div>
                  </Fragment>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '11px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        {(v.vis3.friction.legend ?? []).map((l: any, lIndex: number) => (
          <Fragment key={lIndex}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.12em', color: 'var(--fg3)' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: l.c }} />
              {l.k}
            </span>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '8px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)' }}>
        {v.vis3.friction.none}
      </div>
    </div>
  );
}
