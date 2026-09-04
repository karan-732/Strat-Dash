'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card02FunctionPerformanceVsBenchmark({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase2-02" data-card-title="FUNCTION PERFORMANCE VS BENCHMARK">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        02 · FUNCTION PERFORMANCE VS BENCHMARK
      </div>
      <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--fg2)' }}>
        {v.vis2.bench.title}
      </div>
      <div style={{ marginTop: '16px', display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(0,1fr)', gap: '14px', alignItems: 'end', height: '190px', borderBottom: '1px solid var(--ln16)' }}>
        {(v.vis2.bench.items ?? []).map((b: any, bIndex: number) => (
          <Fragment key={bIndex}>
            <div role="button" tabIndex={0} onClick={b.on} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', gap: '5px', background: b.bg, borderRadius: '8px', padding: '3px 3px 0', cursor: 'pointer', transition: 'background-color .16s linear' }} className="hv-7">
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '100%' }}>
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', height: '100%' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', fontWeight: '700' }}>
                    {b.aLabel}
                  </span>
                  <div style={{ width: '100%', height: b.aH, background: '#D26B51', borderRadius: '4px 4px 0 0', transformOrigin: 'bottom', animation: 'bargrow .55s cubic-bezier(.2,.7,.3,1) both', animationDelay: b.dl, transition: 'height .35s ease' }} />
                </div>
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', height: '100%' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', color: 'var(--fg3)' }}>
                    {b.bLabel}
                  </span>
                  <div style={{ width: '100%', height: b.bH, background: v.accent, borderRadius: '4px 4px 0 0', transformOrigin: 'bottom', animation: 'bargrow .55s cubic-bezier(.2,.7,.3,1) both', animationDelay: b.dl, transition: 'height .35s ease' }} />
                </div>
              </div>
              {b.sel ? (
                <>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8px', letterSpacing: '.07em', textAlign: 'center', lineHeight: '1.3', color: b.gapFg }}>
                  {b.gap}
                </div>
                </>
              ) : null}
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(0,1fr)', gap: '14px', marginTop: '7px' }}>
        {(v.vis2.bench.items ?? []).map((b: any, bIndex: number) => (
          <Fragment key={bIndex}>
            <div style={{ fontSize: '11px', lineHeight: '1.3', color: 'var(--fg2)', textAlign: 'center' }}>
              {b.name}
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '12px', display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
          <span style={{ width: '9px', height: '9px', background: '#D26B51' }} />
          ACTUAL
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
          <span style={{ width: '9px', height: '9px', background: v.accent }} />
          BENCHMARK
        </span>
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)' }}>
        {v.vis2.bench.none}
      </div>
    </div>
  );
}
