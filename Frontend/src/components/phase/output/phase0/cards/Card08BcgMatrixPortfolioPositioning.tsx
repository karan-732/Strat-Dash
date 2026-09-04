'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card08BcgMatrixPortfolioPositioning({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase0-08" data-card-title="BCG MATRIX - PORTFOLIO POSITIONING">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        08 · BCG MATRIX - PORTFOLIO POSITIONING
      </div>
      <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '20px minmax(0,1fr) 230px', gap: '12px' }}>
        <div style={{ display: 'grid', placeItems: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            MARKET GROWTH →
          </div>
        </div>
        <div>
          <div style={{ position: 'relative', height: '320px', overflow: 'hidden', border: '1px solid var(--ln16)', borderRadius: '9px', background: 'var(--bg)' }}>
            <div style={{ position: 'absolute', left: '50%', top: '0', bottom: '0', width: '1px', background: 'var(--ln14)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', background: 'var(--ln14)' }} />
            <div style={{ position: 'absolute', left: '8px', top: '7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg4)' }}>
              STARS
            </div>
            <div style={{ position: 'absolute', right: '8px', top: '7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg4)' }}>
              QUESTION MARKS
            </div>
            <div style={{ position: 'absolute', left: '8px', bottom: '7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg4)' }}>
              CASH COWS
            </div>
            <div style={{ position: 'absolute', right: '8px', bottom: '7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg4)' }}>
              DOGS
            </div>
            {(v.vis.bcg.items ?? []).map((b: any, bIndex: number) => (
              <Fragment key={bIndex}>
                <div role="button" tabIndex={0} onClick={b.on} style={{ position: 'absolute', left: b.l, top: b.t, transform: 'translate(-50%,-50%)', zIndex: b.z, width: b.d, height: b.d, borderRadius: '50%', background: b.c, border: '1.5px solid var(--ok)', boxShadow: b.sh, display: 'grid', placeItems: 'center', cursor: 'pointer', animation: 'ptin .45s ease both', animationDelay: b.dl, transition: 'width .2s ease,height .2s ease,box-shadow .2s ease' }} data-plot-point="" className="hv-8">
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', fontWeight: '700' }}>
                    {b.tag}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)', textAlign: 'center', paddingTop: '7px' }}>
            ← RELATIVE MARKET SHARE
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {(v.vis.bcg.items ?? []).map((b: any, bIndex: number) => (
            <Fragment key={bIndex}>
              <div role="button" tabIndex={0} onClick={b.on} style={{ display: 'grid', gridTemplateColumns: '20px minmax(0,1fr)', gap: '8px', alignItems: 'start', cursor: 'pointer', background: b.lb, borderRadius: '7px', padding: '4px 5px', transition: 'background-color .16s linear' }} className="hv-7">
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', fontWeight: '700', background: b.c, border: '1px solid var(--ok)', textAlign: 'center', padding: '2px 0' }}>
                  {b.tag}
                </span>
                <span style={{ minWidth: '0' }}>
                  <span style={{ display: 'block', fontSize: '12.5px', lineHeight: '1.35', fontWeight: '600' }}>
                    {b.name}
                  </span>
                  <span style={{ display: 'block', marginTop: '2px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
                    {b.meta}
                  </span>
                </span>
              </div>
            </Fragment>
          ))}
          <div style={{ marginTop: '4px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)' }}>
            {v.vis.bcg.none}
          </div>
          {v.picks.bcg0.show ? (
            <>
            <div style={{ border: '1px solid var(--ln20)', background: 'var(--card3)', borderRadius: '8px', padding: '9px 10px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.08em', lineHeight: '1.55', animation: 'rise .2s ease both' }}>
              {v.picks.bcg0.line}
            </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
