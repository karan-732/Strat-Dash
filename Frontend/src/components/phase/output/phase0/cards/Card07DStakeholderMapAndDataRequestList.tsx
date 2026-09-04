'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card07DStakeholderMapAndDataRequestList({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase0-07D" data-card-title="STAKEHOLDER MAP AND DATA REQUEST LIST">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        07D · STAKEHOLDER MAP AND DATA REQUEST LIST
      </div>
      <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '14px' }}>
        <div>
          {v.xtra.stk.hasPts ? (
            <>
            <div style={{ display: 'grid', gridTemplateColumns: '20px minmax(0,1fr)', gap: '8px' }}>
              <div style={{ display: 'grid', placeItems: 'center' }}>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                  KNOWLEDGE OF THE WORK →
                </div>
              </div>
              <div style={{ position: 'relative', height: '250px', overflow: 'hidden', border: '1px solid var(--ln16)', borderRadius: '9px', background: 'var(--bg)' }}>
                <div style={{ position: 'absolute', left: '50%', top: '0', bottom: '0', width: '1px', background: 'var(--ln14)' }} />
                <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', background: 'var(--ln14)' }} />
                <div style={{ position: 'absolute', left: '8px', top: '7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg4)' }}>
                  INTERVIEW FIRST
                </div>
                <div style={{ position: 'absolute', right: '8px', top: '7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg4)' }}>
                  CRITICAL - ALIGN AND INTERVIEW
                </div>
                <div style={{ position: 'absolute', left: '8px', bottom: '7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg4)' }}>
                  KEEP INFORMED
                </div>
                <div style={{ position: 'absolute', right: '8px', bottom: '7px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg4)' }}>
                  SPONSOR - ALIGN
                </div>
                {(v.xtra.stk.pts ?? []).map((s: any, sIndex: number) => (
                  <Fragment key={sIndex}>
                    <div role="button" tabIndex={0} onClick={s.on} style={{ position: 'absolute', left: s.l, top: s.t, transform: 'translate(-50%,-50%)', zIndex: s.z, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', animation: 'ptin .45s ease both', animationDelay: s.dl }} data-plot-point="" className="hv-8">
                      <div style={{ width: s.d, height: s.d, borderRadius: '50%', background: s.c, border: '1.5px solid var(--ok)', boxShadow: s.sh, transition: 'width .18s ease,height .18s ease,box-shadow .18s ease' }} />
                      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', lineHeight: '1.25', textAlign: 'center', maxWidth: '92px', background: s.nb, color: s.nf, padding: '1px 4px', borderRadius: '5px', transition: 'background-color .16s linear,color .16s linear' }}>
                        {s.name}
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div/>
              <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)', textAlign: 'center', paddingTop: '7px' }}>
                INFLUENCE OVER THE TRANSFORMATION →
              </div>
            </div>
            {v.xtra.stk.pickShow ? (
              <>
              <div style={{ marginTop: '9px', border: '1px solid var(--ln20)', background: 'var(--card3)', borderRadius: '8px', padding: '9px 11px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.08em', lineHeight: '1.55', animation: 'rise .2s ease both' }}>
                {v.xtra.stk.pickLine}
              </div>
              </>
            ) : null}
            </>
          ) : null}
        </div>
        <div>
          {v.xtra.stk.hasReqs ? (
            <>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                {v.xtra.stk.reqHead}
              </div>
              <div style={{ marginTop: '9px', display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)' }}>
                {(v.xtra.stk.reqs ?? []).map((d: any, dIndex: number) => (
                  <Fragment key={dIndex}>
                    <div style={{ background: 'var(--bg)', padding: '10px 12px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 74px', gap: '10px', alignItems: 'center' }}>
                      <div style={{ minWidth: '0' }}>
                        <div style={{ fontSize: '12.5px', fontWeight: '600', lineHeight: '1.35', textWrap: 'pretty' }}>
                          {d.item}
                        </div>
                        <div style={{ marginTop: '3px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
                          {d.owner} · {d.fmt}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.11em', textAlign: 'right', color: d.priFg }}>
                          {d.pri}
                        </div>
                        <div style={{ marginTop: '5px', height: '4px', borderRadius: '3px', background: 'var(--ln12)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: d.w, background: d.priFg, borderRadius: '3px', transition: 'width .45s ease' }} />
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
