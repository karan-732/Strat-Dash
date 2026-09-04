'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card02ActivityTransformationMatrix({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase4-02" data-card-title="ACTIVITY TRANSFORMATION MATRIX">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        02 · ACTIVITY TRANSFORMATION MATRIX
      </div>
      <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--fg2)' }}>
        {v.vis4.transform.title}
      </div>
      <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: '10px' }}>
        {(v.vis4.transform.cols ?? []).map((t: any, tIndex: number) => (
          <Fragment key={tIndex}>
            <div style={{ border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', borderTop: `3px solid  ${t.c}`, padding: '12px 12px 13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', fontWeight: '700', letterSpacing: '.12em', color: t.c }}>
                  {t.k}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '15px', fontWeight: '700' }}>
                  {t.n}
                </span>
              </div>
              <div style={{ marginTop: '11px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {(t.items ?? []).map((a: any, aIndex: number) => (
                  <Fragment key={aIndex}>
                    <div style={{ fontSize: '11.5px', lineHeight: '1.35', color: 'var(--fg2)', textWrap: 'pretty' }}>
                      {a.t}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '10px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)' }}>
        {v.vis4.transform.none}
      </div>
    </div>
  );
}
