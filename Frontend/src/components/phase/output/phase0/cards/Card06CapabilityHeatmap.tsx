'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card06CapabilityHeatmap({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase0-06" data-card-title="CAPABILITY HEATMAP">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        06 · CAPABILITY HEATMAP
      </div>
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: v.vis.heat.cols, gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)' }}>
        <div style={{ background: 'var(--card3)', padding: '11px 13px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
          CAPABILITY
        </div>
        <div style={{ background: 'var(--card3)', padding: '11px 13px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', fontWeight: '700', textAlign: 'center' }}>
          {v.cur.name}
        </div>
        {(v.vis.heat.comps ?? []).map((c: any, cIndex: number) => (
          <Fragment key={cIndex}>
            <div style={{ background: 'var(--card3)', padding: '11px 13px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg2)', textAlign: 'center', lineHeight: '1.3' }}>
              {c.n}
            </div>
          </Fragment>
        ))}
        {(v.vis.heat.rows ?? []).map((r: any, rIndex: number) => (
          <Fragment key={rIndex}>
            <div role="button" tabIndex={0} onClick={r.on} style={{ display: 'grid', gridColumn: '1 / -1', gridTemplateColumns: v.vis.heat.cols, gap: '1px', background: 'var(--ln12)', cursor: 'pointer' }}>
              <div style={{ background: r.bg, padding: '11px 12px', fontSize: '13px', lineHeight: '1.35', fontWeight: '600', borderLeft: `3px solid  ${r.mk}`, transition: 'background-color .16s linear' }}>
                {r.cap}
              </div>
              {(r.cells ?? []).map((cell: any, cellIndex: number) => (
                <Fragment key={cellIndex}>
                  <div style={{ background: r.bg, padding: '11px 12px', display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center', transition: 'background-color .16s linear' }}>
                    {(cell.dots ?? []).map((d: any, dIndex: number) => (
                      <Fragment key={dIndex}>
                        <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: d.c, border: `1px solid  ${d.b}`, transition: 'background-color .16s linear' }} />
                      </Fragment>
                    ))}
                    {r.sel ? (
                      <>
                      <span style={{ marginLeft: '4px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.06em', color: 'var(--fg2)' }}>
                        {cell.num}
                      </span>
                      </>
                    ) : null}
                  </div>
                </Fragment>
              ))}
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.12em', color: 'var(--fg3)' }}>
          ●○○○ LAGGARD → ●●●● LEADER
        </div>
        <div style={{ fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)' }}>
          {v.vis.heat.none}
        </div>
      </div>
    </div>
  );
}
