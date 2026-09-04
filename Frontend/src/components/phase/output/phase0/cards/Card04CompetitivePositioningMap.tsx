'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card04CompetitivePositioningMap({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase0-04" data-card-title="COMPETITIVE POSITIONING MAP">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        04 · COMPETITIVE POSITIONING MAP
      </div>
      <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '20px minmax(0,1fr)', gap: '8px' }}>
        <div style={{ display: 'grid', placeItems: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            INNOVATION →
          </div>
        </div>
        <div style={{ position: 'relative', height: '290px', overflow: 'hidden', border: '1px solid var(--ln16)', borderRadius: '9px', background: 'var(--bg)' }}>
          <div style={{ position: 'absolute', left: '50%', top: '0', bottom: '0', width: '1px', background: 'var(--ln14)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', background: 'var(--ln14)' }} />
          <div style={{ position: 'absolute', left: '8px', top: '7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg4)' }}>
            DISRUPTORS
          </div>
          <div style={{ position: 'absolute', right: '8px', top: '7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg4)' }}>
            PREMIUM INNOVATORS
          </div>
          <div style={{ position: 'absolute', left: '8px', bottom: '7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg4)' }}>
            VALUE PLAYERS
          </div>
          <div style={{ position: 'absolute', right: '8px', bottom: '7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg4)' }}>
            VULNERABLE
          </div>
          {(v.vis.pos.pts ?? []).map((pt: any, ptIndex: number) => (
            <Fragment key={ptIndex}>
              <div role="button" tabIndex={0} onClick={pt.on} style={{ position: 'absolute', left: pt.l, top: pt.t, transform: 'translate(-50%,-50%)', zIndex: pt.z, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', animation: 'ptin .45s ease both', animationDelay: pt.dl }} data-plot-point="" className="hv-8">
                <div style={{ width: pt.d, height: pt.d, background: pt.c, border: '1.5px solid var(--ok)', boxShadow: pt.sh, transition: 'width .18s ease,height .18s ease,box-shadow .18s ease' }} />
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', fontWeight: pt.w, lineHeight: '1.25', textAlign: 'center', maxWidth: '88px', background: pt.nb, color: pt.nf, padding: '1px 4px', borderRadius: '5px', marginTop: pt.mt, transition: 'background-color .16s linear,color .16s linear' }}>
                  {pt.name}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
        <div/>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)', textAlign: 'center', paddingTop: '7px' }}>
          PRICE POSITION →
        </div>
      </div>
      {v.picks.pos0.show ? (
        <>
        <div style={{ marginTop: '9px', border: '1px solid var(--ln20)', background: 'var(--card3)', borderRadius: '8px', padding: '9px 11px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.09em', lineHeight: '1.5', animation: 'rise .2s ease both' }}>
          {v.picks.pos0.line}
        </div>
        </>
      ) : null}
      <div style={{ marginTop: '10px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)' }}>
        {v.vis.pos.none}
      </div>
    </div>
  );
}
