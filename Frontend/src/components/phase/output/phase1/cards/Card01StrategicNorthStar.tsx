'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card01StrategicNorthStar({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase1-01" data-card-title="STRATEGIC NORTH STAR">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        01 · STRATEGIC NORTH STAR
      </div>
      <div style={{ marginTop: '13px', overflowX: 'auto', paddingBottom: '4px' }}>
        <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(232px,1fr)', gap: '10px' }}>
          {(v.vis1.north ?? []).map((n: any, nIndex: number) => (
            <Fragment key={nIndex}>
              <div style={{ border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', borderLeft: `4px solid  ${n.dirFg}`, padding: '13px 14px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
                  <span style={{ fontSize: '17px', fontWeight: '700', color: n.dirFg, lineHeight: '1' }}>
                    {n.arrow}
                  </span>
                  <span style={{ fontSize: '14.5px', fontWeight: '700', letterSpacing: '-.01em', lineHeight: '1.25' }}>
                    {n.metric}
                  </span>
                </div>
                <div style={{ marginTop: '11px', display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '6px' }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                      CURRENT
                    </div>
                    <div style={{ marginTop: '3px', fontSize: '13px', fontWeight: '600', lineHeight: '1.3' }}>
                      {n.current}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                      TARGET
                    </div>
                    <div style={{ marginTop: '3px', fontSize: '13px', fontWeight: '600', lineHeight: '1.3' }}>
                      {n.target}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                      GAP
                    </div>
                    <div style={{ marginTop: '3px', fontSize: '13px', fontWeight: '700', lineHeight: '1.3', color: n.dirFg }}>
                      {n.gap}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '9px', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg2)', textWrap: 'pretty' }}>
                  {n.note}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--fg3)' }}>
        {v.vis1.northNone}
      </div>
    </div>
  );
}
