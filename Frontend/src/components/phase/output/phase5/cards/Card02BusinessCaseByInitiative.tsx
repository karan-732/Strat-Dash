'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card02BusinessCaseByInitiative({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase5-02" data-card-title="BUSINESS CASE BY INITIATIVE">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        02 · BUSINESS CASE BY INITIATIVE
      </div>
      <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(v.vis5.cases ?? []).map((c: any, cIndex: number) => (
          <Fragment key={cIndex}>
            <div style={{ border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', padding: '12px 13px 13px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', color: 'var(--fg3)' }}>
                  {c.n}
                </span>
                <span style={{ flex: '1', minWidth: '180px', fontSize: '14px', fontWeight: '700', letterSpacing: '-.01em' }}>
                  {c.name}
                </span>
                <span style={{ padding: '4px 9px', borderRadius: '999px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', fontWeight: '700', letterSpacing: '.1em', background: c.confBg, color: c.confFg }}>
                  {c.conf}
                </span>
              </div>
              <div style={{ marginTop: '10px', height: '7px', borderRadius: '999px', background: 'var(--card3)', overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '100%', width: c.w, background: '#D26B51' }} />
              </div>
              <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '8px' }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                    INVESTMENT
                  </div>
                  <div style={{ marginTop: '3px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12.5px', fontWeight: '600' }}>
                    {c.investment}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                    ANNUAL VALUE
                  </div>
                  <div style={{ marginTop: '3px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12.5px', fontWeight: '700', color: '#D26B51' }}>
                    {c.value}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                    PAYBACK
                  </div>
                  <div style={{ marginTop: '3px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12.5px', fontWeight: '600' }}>
                    {c.payback}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '9px', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg2)', textWrap: 'pretty' }}>
                {c.basis}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--fg3)' }}>
        {v.vis5.caseNone}
      </div>
    </div>
  );
}
