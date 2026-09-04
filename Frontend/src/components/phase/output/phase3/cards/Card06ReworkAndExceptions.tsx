'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card06ReworkAndExceptions({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase3-06" data-card-title="REWORK AND EXCEPTIONS">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        06 · REWORK AND EXCEPTIONS
      </div>
      <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--fg2)' }}>
        {v.vis3.rework.title}
      </div>
      <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '11px' }}>
        {(v.vis3.rework.items ?? []).map((r: any, rIndex: number) => (
          <Fragment key={rIndex}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '12.5px', lineHeight: '1.3' }}>
                  {r.label}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11.5px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                  {r.val}
                </span>
              </div>
              <div style={{ marginTop: '6px', height: '9px', background: 'var(--card2)', border: '1px solid var(--ln12)' }}>
                <div style={{ height: '100%', width: r.w, background: r.c }} />
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '12px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)', textWrap: 'pretty' }}>
        {v.vis3.rework.none}
      </div>
    </div>
  );
}
