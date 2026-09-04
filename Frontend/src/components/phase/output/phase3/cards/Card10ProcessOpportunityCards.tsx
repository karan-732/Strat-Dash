'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card10ProcessOpportunityCards({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase3-10" data-card-title="PROCESS OPPORTUNITY CARDS">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        10 · PROCESS OPPORTUNITY CARDS
      </div>
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '10px' }}>
        {(v.vis3.opps ?? []).map((o: any, oIndex: number) => (
          <Fragment key={oIndex}>
            <div style={{ border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', borderLeft: `4px solid  ${o.c}`, padding: '14px 15px 15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: o.c, flex: '0 0 auto' }} />
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '700', letterSpacing: '.1em', color: 'var(--fg3)' }}>
                  {o.rank}
                </span>
              </div>
              <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: '600', lineHeight: '1.3' }}>
                {o.name}
              </div>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {(o.metrics ?? []).map((m: any, mIndex: number) => (
                  <Fragment key={mIndex}>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '15px', fontWeight: '700' }}>
                        {m.v}
                      </div>
                      <div style={{ marginTop: '2px', fontSize: '11px', color: 'var(--fg3)' }}>
                        {m.k}
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ marginTop: '12px', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg2)', textWrap: 'pretty' }}>
                {o.note}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--fg3)' }}>
        {v.vis3.oppsNone}
      </div>
    </div>
  );
}
