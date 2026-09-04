'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card05LeadershipPriorityHeatmap({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase1-05" data-card-title="LEADERSHIP PRIORITY HEATMAP">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        05 · LEADERSHIP PRIORITY HEATMAP
      </div>
      <div style={{ marginTop: '13px', display: 'flex', flexDirection: 'column' }}>
        {(v.vis1.lead.rows ?? []).map((l: any, lIndex: number) => (
          <Fragment key={lIndex}>
            <div style={{ padding: '11px 0', borderBottom: '1px solid var(--ln09)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
                  {l.name}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.13em', fontWeight: '700', color: l.flagC }}>
                  {l.flag}
                </span>
              </div>
              <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '74px minmax(0,1fr) 66px', gap: '9px', alignItems: 'center' }}>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.12em', color: 'var(--fg3)' }}>
                  SAYS
                </span>
                <span style={{ display: 'flex', gap: '4px' }}>
                  {l.hasSays ? (
                    <>
                    {(l.saysSteps ?? []).map((s: any, sIndex: number) => (
                      <Fragment key={sIndex}>
                        <span style={{ flex: '1', height: '10px', background: s.c, border: '1px solid var(--ln18)' }} />
                      </Fragment>
                    ))}
                    </>
                  ) : null}
                  {l.noSays ? (
                    <>
                    <span style={{ flex: '1', height: '10px', borderTop: '1px dashed var(--ln26)' }} />
                    </>
                  ) : null}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '600', textAlign: 'right' }}>
                  {l.says}
                </span>
              </div>
              <div style={{ marginTop: '5px', display: 'grid', gridTemplateColumns: '74px minmax(0,1fr) 66px', gap: '9px', alignItems: 'center' }}>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.12em', color: 'var(--fg3)' }}>
                  DATA SHOWS
                </span>
                <span style={{ display: 'flex', gap: '4px' }}>
                  {l.hasShows ? (
                    <>
                    {(l.showsSteps ?? []).map((s: any, sIndex: number) => (
                      <Fragment key={sIndex}>
                        <span style={{ flex: '1', height: '10px', background: s.c, border: '1px solid var(--ln18)' }} />
                      </Fragment>
                    ))}
                    </>
                  ) : null}
                  {l.noShows ? (
                    <>
                    <span style={{ flex: '1', height: '10px', borderTop: '1px dashed var(--ln26)' }} />
                    </>
                  ) : null}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '600', textAlign: 'right' }}>
                  {l.shows}
                </span>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '10px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.12em', color: 'var(--fg3)' }}>
        LOW → MEDIUM → HIGH → CRITICAL
      </div>
      <div style={{ marginTop: '6px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)' }}>
        {v.vis1.lead.none}
      </div>
    </div>
  );
}
