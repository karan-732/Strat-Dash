'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card01CurrentStateProcessTwin({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase3-01" data-card-title="CURRENT-STATE PROCESS TWIN">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
          01 · CURRENT-STATE PROCESS TWIN
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.1em', color: 'var(--fg2)' }}>
          {v.vis3.twin.name}
        </div>
      </div>
      <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '0' }}>
        {(v.vis3.twin.steps ?? []).map((s: any, sIndex: number) => (
          <Fragment key={sIndex}>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '34px minmax(0,1fr)', gap: '12px', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: s.c, color: '#0E1015', display: 'grid', placeItems: 'center', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '700' }}>
                    {s.i}
                  </div>
                  <div style={{ flex: '1', width: '1px', background: 'var(--ln16)', minHeight: '14px' }} />
                </div>
                <div style={{ border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', borderLeft: `3px solid  ${s.c}`, padding: '11px 13px 12px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: '600', lineHeight: '1.3' }}>
                      {s.name}
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.12em', color: s.c }}>
                      {s.fr}
                    </div>
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(s.chips ?? []).map((ch: any, chIndex: number) => (
                      <Fragment key={chIndex}>
                        <span style={{ border: '1px solid var(--ln16)', background: 'var(--card2)', padding: '4px 8px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.06em', color: 'var(--fg2)', whiteSpace: 'nowrap' }}>
                          {ch.t}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ marginTop: '9px', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg3)', textWrap: 'pretty' }}>
                    {s.note}
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '8px', fontSize: '11.5px', color: 'var(--fg3)' }}>
        {v.vis3.twin.none}
      </div>
    </div>
  );
}
