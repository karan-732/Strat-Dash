'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card07CInitialHypothesisBank({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase0-07C" data-card-title="INITIAL HYPOTHESIS BANK">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        07C · INITIAL HYPOTHESIS BANK
      </div>
      <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--fg2)' }}>
        Carried into the leadership session to validate or disprove. Tap a hypothesis for its signal and validation metric.
      </div>
      <div style={{ marginTop: '13px', display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)' }}>
        {(v.xtra.hyp.rows ?? []).map((h: any, hIndex: number) => (
          <Fragment key={hIndex}>
            <div style={{ background: h.bg, transition: 'background-color .16s linear' }}>
              <div role="button" tabIndex={0} onClick={h.on} style={{ display: 'grid', gridTemplateColumns: '44px minmax(0,1fr) 132px 18px', gap: '11px', alignItems: 'center', padding: '11px 13px', cursor: 'pointer' }} className="hv-7">
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', fontWeight: '700', color: '#D26B51' }}>
                  {h.id}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', lineHeight: '1.4', textWrap: 'pretty' }}>
                  {h.hyp}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.11em', color: 'var(--fg3)', textAlign: 'right', lineHeight: '1.4' }}>
                  {h.fn}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '13px', color: 'var(--fg3)', textAlign: 'center' }}>
                  {h.caret}
                </div>
              </div>
              {h.sel ? (
                <>
                <div style={{ padding: '2px 13px 15px', animation: 'rise .2s ease both', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '12px' }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                      EXTERNAL SIGNAL
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '12px', lineHeight: '1.5', textWrap: 'pretty' }}>
                      {h.signal}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                      SUSPECTED CAUSE
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '12px', lineHeight: '1.5', textWrap: 'pretty' }}>
                      {h.cause}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                      VALIDATION METRIC
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '12px', lineHeight: '1.5', fontWeight: '600', textWrap: 'pretty' }}>
                      {h.metric}
                    </div>
                  </div>
                </div>
                </>
              ) : null}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
