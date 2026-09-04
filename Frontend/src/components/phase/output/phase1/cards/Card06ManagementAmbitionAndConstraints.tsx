'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card06ManagementAmbitionAndConstraints({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase1-06" data-card-title="MANAGEMENT AMBITION AND CONSTRAINTS">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
          06 · MANAGEMENT AMBITION AND CONSTRAINTS
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.1em', fontWeight: '700' }}>
          {v.xtra.amb.horizon}
        </div>
      </div>
      {v.xtra.amb.hasTargets ? (
        <>
        <div style={{ marginTop: '13px', overflowX: 'auto', paddingBottom: '4px' }}>
          <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(212px,1fr)', gap: '10px' }}>
            {(v.xtra.amb.targets ?? []).map((t: any, tIndex: number) => (
              <Fragment key={tIndex}>
                <div style={{ border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', borderTop: '3px solid #D26B51', padding: '13px 14px 14px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                    {t.k}
                  </div>
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'baseline', gap: '9px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--fg2)' }}>
                      {t.from}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '13px', color: '#D26B51' }}>
                      →
                    </span>
                    <span style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '-.02em' }}>
                      {t.to}
                    </span>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        </>
      ) : null}
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)' }}>
        {(v.xtra.amb.cols ?? []).map((q: any, qIndex: number) => (
          <Fragment key={qIndex}>
            <div style={{ background: 'var(--bg)', padding: '13px 14px 15px', borderTop: `3px solid  ${q.c}` }}>
              <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.14em', fontWeight: '600', color: q.c }}>
                {q.k}
              </div>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {(q.items ?? []).map((i: any, iIndex: number) => (
                  <Fragment key={iIndex}>
                    <div style={{ display: 'grid', gridTemplateColumns: '5px minmax(0,1fr)', gap: '9px', alignItems: 'start' }}>
                      <span style={{ width: '5px', height: '5px', marginTop: '6px', background: q.c }} />
                      <span style={{ fontSize: '12.5px', lineHeight: '1.45', textWrap: 'pretty' }}>
                        {i.t}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
