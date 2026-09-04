'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card07HypothesisBank({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase1-07" data-card-title="HYPOTHESIS BANK">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
          07 · HYPOTHESIS BANK
        </div>
        <div style={{ display: 'flex', gap: '14px' }}>
          {(v.vis1.hCount ?? []).map((h: any, hIndex: number) => (
            <Fragment key={hIndex}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '15px', fontWeight: '700' }}>
                  {h.v}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.12em', color: 'var(--fg3)' }}>
                  {h.k}
                </span>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '13px', overflowX: 'auto', paddingBottom: '4px' }}>
        <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(340px,1fr)', gridTemplateRows: 'repeat(2,auto)', gap: '10px' }}>
          {(v.vis1.hyps ?? []).map((h: any, hIndex: number) => (
            <Fragment key={hIndex}>
              <div style={{ border: '1px solid var(--ln10)', borderRadius: '9px', borderLeft: `4px solid  ${h.c}`, background: 'var(--bg)', padding: '14px 15px 15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '-.01em', lineHeight: '1.25' }}>
                    {h.id} - {h.title}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.12em', fontWeight: '700', padding: '3px 7px', background: h.c, color: '#0E1015', whiteSpace: 'nowrap' }}>
                    {h.status}
                  </span>
                </div>
                <div style={{ marginTop: '7px', fontSize: '12.5px', lineHeight: '1.5', color: 'var(--fg2)', textWrap: 'pretty' }}>
                  {h.statement}
                </div>
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '66px minmax(0,1fr)', gap: '8px' }}>
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.12em', color: 'var(--fg3)', paddingTop: '2px' }}>
                      SIGNAL
                    </span>
                    <span style={{ fontSize: '12px', lineHeight: '1.4' }}>
                      {h.signal}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '66px minmax(0,1fr)', gap: '8px' }}>
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.12em', color: 'var(--fg3)', paddingTop: '2px' }}>
                      VALIDATE
                    </span>
                    <span style={{ fontSize: '12px', lineHeight: '1.4' }}>
                      {h.validate}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '66px minmax(0,1fr)', gap: '8px' }}>
                    <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.12em', color: 'var(--fg3)', paddingTop: '2px' }}>
                      OWNER
                    </span>
                    <span style={{ fontSize: '12px', lineHeight: '1.4' }}>
                      {h.owner}
                    </span>
                  </div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--fg3)' }}>
        {v.vis1.hypsNone}
      </div>
    </div>
  );
}
