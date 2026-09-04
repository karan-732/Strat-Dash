'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card09AStepLevelQuantification({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase3-09A" data-card-title="STEP-LEVEL QUANTIFICATION">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        09A · STEP-LEVEL QUANTIFICATION
      </div>
      <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--fg2)' }}>
        Volume, rework, exceptions, data and economic consequence for every step of the process.
      </div>
      <div style={{ marginTop: '13px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)', minWidth: '640px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '26px minmax(0,1.3fr) 96px 96px 96px minmax(0,1.2fr)', gap: '10px', background: 'var(--card3)', padding: '9px 12px' }}>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.13em', color: 'var(--fg3)' }}>
              #
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.13em', color: 'var(--fg3)' }}>
              STEP
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.13em', color: 'var(--fg3)' }}>
              VOLUME
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.13em', color: 'var(--fg3)' }}>
              REWORK
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.13em', color: 'var(--fg3)' }}>
              EXCEPTIONS
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.13em', color: 'var(--fg3)' }}>
              ECONOMIC CONSEQUENCE
            </div>
          </div>
          {(v.xtra.steps.rows ?? []).map((s: any, sIndex: number) => (
            <Fragment key={sIndex}>
              <div style={{ display: 'grid', gridTemplateColumns: '26px minmax(0,1.3fr) 96px 96px 96px minmax(0,1.2fr)', gap: '10px', background: 'var(--bg)', padding: '11px 12px', alignItems: 'center' }}>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', color: 'var(--fg3)' }}>
                  {s.nn}
                </div>
                <div style={{ minWidth: '0' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: '600', lineHeight: '1.3' }}>
                    {s.name}
                  </div>
                  <div style={{ marginTop: '3px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
                    {s.owner} · {s.sys} · {s.data}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10.5px', fontWeight: '700' }}>
                    {s.vol}
                  </div>
                  <div style={{ marginTop: '5px', height: '4px', borderRadius: '3px', background: 'var(--ln12)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: s.volW, background: 'var(--ok)', borderRadius: '3px', transition: 'width .45s ease' }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10.5px', fontWeight: '700', color: 'var(--bad)' }}>
                    {s.rw}
                  </div>
                  <div style={{ marginTop: '5px', height: '4px', borderRadius: '3px', background: 'var(--ln12)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: s.rwW, background: 'var(--bad)', borderRadius: '3px', transition: 'width .45s ease' }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10.5px', fontWeight: '700', color: 'var(--warn)' }}>
                    {s.ex}
                  </div>
                  <div style={{ marginTop: '5px', height: '4px', borderRadius: '3px', background: 'var(--ln12)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: s.exW, background: 'var(--warn)', borderRadius: '3px', transition: 'width .45s ease' }} />
                  </div>
                </div>
                <div style={{ fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg2)', textWrap: 'pretty' }}>
                  {s.impact}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
