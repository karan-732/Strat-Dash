'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card03HumanVsAiResponsibilityMap({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase4-03" data-card-title="HUMAN VS AI RESPONSIBILITY MAP">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        03 · HUMAN VS AI RESPONSIBILITY MAP
      </div>
      <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '96px minmax(0,1fr)', gap: '12px', alignItems: 'stretch' }}>
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', fontWeight: '700', letterSpacing: '.12em', color: v.accent }}>
            AI / AGENT
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', fontWeight: '700', letterSpacing: '.12em', color: '#D26B51' }}>
            HUMAN
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(160px,1fr)', gap: '10px', minWidth: '100%' }}>
            {(v.vis4.resp.steps ?? []).map((s: any, sIndex: number) => (
              <Fragment key={sIndex}>
                <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '10px', minHeight: '150px' }}>
                  <div style={{ display: 'flex', alignItems: 'stretch' }}>
                    {s.ai ? (
                      <>
                      <div style={{ flex: '1', border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', borderTop: `3px solid  ${s.c}`, padding: '11px 12px 12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', fontWeight: '700', color: 'var(--fg3)' }}>
                            {s.i}
                          </span>
                          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', fontWeight: '700', letterSpacing: '.08em', color: s.c }}>
                            {s.actor}
                          </span>
                        </div>
                        <div style={{ marginTop: '7px', fontSize: '12.5px', fontWeight: '600', lineHeight: '1.3' }}>
                          {s.name}
                        </div>
                        <div style={{ marginTop: '6px', fontSize: '11px', lineHeight: '1.4', color: 'var(--fg3)', textWrap: 'pretty' }}>
                          {s.note}
                        </div>
                      </div>
                      </>
                    ) : null}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'stretch' }}>
                    {s.human ? (
                      <>
                      <div style={{ flex: '1', border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', borderTop: `3px solid  ${s.c}`, padding: '11px 12px 12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', fontWeight: '700', color: 'var(--fg3)' }}>
                            {s.i}
                          </span>
                          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', fontWeight: '700', letterSpacing: '.08em', color: s.c }}>
                            {s.actor}
                          </span>
                        </div>
                        <div style={{ marginTop: '7px', fontSize: '12.5px', fontWeight: '600', lineHeight: '1.3' }}>
                          {s.name}
                        </div>
                        <div style={{ marginTop: '6px', fontSize: '11px', lineHeight: '1.4', color: 'var(--fg3)', textWrap: 'pretty' }}>
                          {s.note}
                        </div>
                      </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: '11px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.12em', color: 'var(--fg3)' }}>
          <span style={{ width: '10px', height: '10px', background: v.accent }} />
          AI OR AGENT OWNS THE STEP
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.12em', color: 'var(--fg3)' }}>
          <span style={{ width: '10px', height: '10px', background: '#D26B51' }} />
          HUMAN OWNS THE STEP
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.12em', color: 'var(--fg3)' }}>
          <span style={{ width: '10px', height: '10px', background: 'var(--warn)' }} />
          JOINT - SHOWN IN BOTH LANES
        </span>
      </div>
      <div style={{ marginTop: '8px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)' }}>
        {v.vis4.resp.none}
      </div>
    </div>
  );
}
