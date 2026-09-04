'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card06DecisionRightsMatrix({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase4-06" data-card-title="DECISION RIGHTS MATRIX">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        06 · DECISION RIGHTS MATRIX
      </div>
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr)', gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)' }}>
        <div style={{ background: 'var(--card3)', padding: '9px 12px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg2)' }}>
          DECISION
        </div>
        <div style={{ background: 'var(--card3)', padding: '9px 12px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg2)' }}>
          CURRENT OWNER
        </div>
        <div style={{ background: 'var(--card3)', padding: '9px 12px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg2)' }}>
          FUTURE OWNER
        </div>
        {(v.vis4.decision.rows ?? []).map((r: any, rIndex: number) => (
          <Fragment key={rIndex}>
            <div style={{ display: 'grid', gridColumn: '1 / -1', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr)', gap: '1px', background: 'var(--ln12)' }}>
              <div style={{ background: 'var(--bg)', padding: '11px 12px', fontSize: '12.5px', lineHeight: '1.3', fontWeight: '600' }}>
                {r.d}
              </div>
              <div style={{ background: 'var(--bg)', padding: '11px 12px', fontSize: '12px', lineHeight: '1.3', color: 'var(--fg2)' }}>
                {r.cur}
              </div>
              <div style={{ background: 'var(--bg)', padding: '11px 12px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10.5px', fontWeight: '700', letterSpacing: '.06em', color: r.c }}>
                {r.fut}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)' }}>
        {v.vis4.decision.none}
      </div>
    </div>
  );
}
