'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card04SequenceAndDependencies({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase5-04" data-card-title="SEQUENCE AND DEPENDENCIES">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        04 · SEQUENCE AND DEPENDENCIES
      </div>
      <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {(v.vis5.seq ?? []).map((s: any, sIndex: number) => (
          <Fragment key={sIndex}>
            <div style={{ display: 'grid', gridTemplateColumns: '26px minmax(0,1fr)', gap: '10px', alignItems: 'start' }}>
              <span style={{ width: '26px', height: '26px', borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'rgba(210,107,81,.14)', color: '#D26B51', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', fontWeight: '700' }}>
                {s.n}
              </span>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.13em', color: 'var(--fg3)' }}>
                  {s.period}
                </div>
                <div style={{ marginTop: '4px', fontSize: '13.5px', fontWeight: '600', lineHeight: '1.35' }}>
                  {s.milestone}
                </div>
                <div style={{ marginTop: '4px', fontSize: '11.5px', color: 'var(--fg2)' }}>
                  {s.dep}
                </div>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
