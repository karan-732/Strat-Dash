'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card03ProcessHealth({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase3-03" data-card-title="PROCESS HEALTH">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        03 · PROCESS HEALTH
      </div>
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '10px' }}>
        {(v.vis3.health ?? []).map((h: any, hIndex: number) => (
          <Fragment key={hIndex}>
            <div style={{ border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', borderTop: `3px solid  ${h.c}`, padding: '13px 14px 14px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '19px', fontWeight: '700', letterSpacing: '-.02em' }}>
                {h.v}
              </div>
              <div style={{ marginTop: '5px', fontSize: '11.5px', lineHeight: '1.35', color: 'var(--fg3)' }}>
                {h.k}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
