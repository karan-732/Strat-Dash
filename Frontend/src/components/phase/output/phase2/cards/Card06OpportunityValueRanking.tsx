'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card06OpportunityValueRanking({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase2-06" data-card-title="OPPORTUNITY VALUE RANKING">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
          06 · OPPORTUNITY VALUE RANKING
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', fontWeight: '700' }}>
          TOTAL POTENTIAL · {v.vis2.rank.total}
        </div>
      </div>
      <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column' }}>
        {(v.vis2.rank.items ?? []).map((v: any, vIndex: number) => (
          <Fragment key={vIndex}>
            <div style={{ padding: '9px 0', borderBottom: '1px solid var(--ln09)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>
                  {v.name}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12.5px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                  {v.val}
                </span>
              </div>
              <div style={{ marginTop: '7px', height: '11px', background: 'var(--card3)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: v.w, background: v.c }} />
              </div>
              <div style={{ marginTop: '6px', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg3)', textWrap: 'pretty' }}>
                {v.basis}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--fg3)' }}>
        {v.vis2.rank.none}
      </div>
    </div>
  );
}
