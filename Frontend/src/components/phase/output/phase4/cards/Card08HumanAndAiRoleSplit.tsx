'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card08HumanAndAiRoleSplit({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase4-08" data-card-title="HUMAN AND AI ROLE SPLIT">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
          08 · HUMAN AND AI ROLE SPLIT
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.11em', color: 'var(--fg3)' }}>
          {v.xtra.roles.split}
        </div>
      </div>
      <div style={{ marginTop: '13px', display: 'flex', height: '10px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--ln12)' }}>
        <div style={{ width: v.xtra.roles.aiPct, background: '#D26B51', transition: 'width .5s cubic-bezier(.2,.7,.3,1)' }} />
        <div style={{ width: v.xtra.roles.huPct, background: 'var(--ok)', transition: 'width .5s cubic-bezier(.2,.7,.3,1)' }} />
      </div>
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)' }}>
        <div style={{ background: 'var(--bg)', padding: '14px 15px 15px', borderTop: '3px solid #D26B51' }}>
          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.14em', fontWeight: '600', color: '#D26B51' }}>
            AI AND AGENTS · {v.xtra.roles.aiPct}
          </div>
          <div style={{ marginTop: '11px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {(v.xtra.roles.ai ?? []).map((a: any, aIndex: number) => (
              <Fragment key={aIndex}>
                <div style={{ display: 'grid', gridTemplateColumns: '104px minmax(0,1fr)', gap: '10px', alignItems: 'start' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', fontWeight: '700', background: 'var(--card2)', border: '1px solid var(--card4)', borderRadius: '16px', padding: '4px 8px', textAlign: 'center' }}>
                    {a.verb}
                  </span>
                  <span style={{ fontSize: '12.5px', lineHeight: '1.45', textWrap: 'pretty' }}>
                    {a.what}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        <div style={{ background: 'var(--bg)', padding: '14px 15px 15px', borderTop: '3px solid var(--ok)' }}>
          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.14em', fontWeight: '600', color: 'var(--ok)' }}>
            HUMANS · {v.xtra.roles.huPct}
          </div>
          <div style={{ marginTop: '11px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {(v.xtra.roles.human ?? []).map((a: any, aIndex: number) => (
              <Fragment key={aIndex}>
                <div style={{ display: 'grid', gridTemplateColumns: '104px minmax(0,1fr)', gap: '10px', alignItems: 'start' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', fontWeight: '700', border: '1px solid var(--ln26)', borderRadius: '16px', padding: '4px 8px', textAlign: 'center', color: 'var(--fg2)' }}>
                    {a.verb}
                  </span>
                  <span style={{ fontSize: '12.5px', lineHeight: '1.45', textWrap: 'pretty' }}>
                    {a.what}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
