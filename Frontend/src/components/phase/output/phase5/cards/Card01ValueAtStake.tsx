'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card01ValueAtStake({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase5-01" data-card-title="VALUE AT STAKE">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        01 · VALUE AT STAKE
      </div>
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)' }}>
        {(v.vis5.totals ?? []).map((t: any, tIndex: number) => (
          <Fragment key={tIndex}>
            <div style={{ background: 'var(--bg)', padding: '13px 12px 14px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                {t.k}
              </div>
              <div style={{ marginTop: '8px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '17px', fontWeight: '700', letterSpacing: '-.02em', lineHeight: '1.3', color: '#D26B51', overflowWrap: 'anywhere' }}>
                {t.v}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
