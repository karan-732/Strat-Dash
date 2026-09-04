'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card08PeopleAndSystemsMap({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase3-08" data-card-title="PEOPLE AND SYSTEMS MAP">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        08 · PEOPLE AND SYSTEMS MAP
      </div>
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '10px' }}>
        {(v.vis3.people.stats ?? []).map((h: any, hIndex: number) => (
          <Fragment key={hIndex}>
            <div style={{ border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '9px', padding: '12px 13px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '18px', fontWeight: '700' }}>
                {h.v}
              </div>
              <div style={{ marginTop: '4px', fontSize: '11px', lineHeight: '1.35', color: 'var(--fg3)' }}>
                {h.k}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '7px' }}>
        {(v.vis3.people.chain ?? []).map((n: any, nIndex: number) => (
          <Fragment key={nIndex}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ border: `1px solid  ${n.c}`, background: 'var(--card2)', padding: '6px 10px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10.5px', fontWeight: '600', color: n.c, whiteSpace: 'nowrap' }}>
                {n.name}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', color: 'var(--fg3)' }}>
                {n.arrow}
              </span>
            </span>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '12px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.12em', color: 'var(--fg3)' }}>
          <span style={{ width: '10px', height: '10px', background: '#D26B51' }} />
          PERSON OR TEAM
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.12em', color: 'var(--fg3)' }}>
          <span style={{ width: '10px', height: '10px', background: v.accent }} />
          SYSTEM
        </span>
      </div>
    </div>
  );
}
