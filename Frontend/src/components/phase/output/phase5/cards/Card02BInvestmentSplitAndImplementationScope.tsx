'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card02BInvestmentSplitAndImplementationScope({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase5-02B" data-card-title="INVESTMENT SPLIT AND IMPLEMENTATION SCOPE">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        02B · INVESTMENT SPLIT AND IMPLEMENTATION SCOPE
      </div>
      {v.xtra.invest.has ? (
        <>
        <div>
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
              INVESTMENT SPLIT
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', fontWeight: '700' }}>
              {v.xtra.invest.total}{v.xtra.invest.unit}
            </div>
          </div>
          <div style={{ marginTop: '9px', display: 'flex', height: '12px', borderRadius: '7px', overflow: 'hidden', border: '1px solid var(--ln12)' }}>
            {(v.xtra.invest.items ?? []).map((v: any, vIndex: number) => (
              <Fragment key={vIndex}>
                <div style={{ width: v.pct, background: v.c, transition: 'width .5s cubic-bezier(.2,.7,.3,1)' }} />
              </Fragment>
            ))}
          </div>
          <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '9px' }}>
            {(v.xtra.invest.items ?? []).map((v: any, vIndex: number) => (
              <Fragment key={vIndex}>
                <div style={{ display: 'grid', gridTemplateColumns: '10px minmax(0,1fr)', gap: '8px', alignItems: 'start' }}>
                  <span style={{ width: '10px', height: '10px', marginTop: '4px', borderRadius: '3px', background: v.c }} />
                  <div style={{ minWidth: '0' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', lineHeight: '1.3' }}>
                      {v.k}
                    </div>
                    <div style={{ marginTop: '2px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.08em', color: 'var(--fg3)' }}>
                      {v.v} · {v.pct}
                    </div>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        </>
      ) : null}
      <div style={{ marginTop: '15px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
        IMPLEMENTATION-READY SCOPE · NOW INITIATIVES · TAP TO OPEN
      </div>
      <div style={{ marginTop: '9px', display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)' }}>
        {(v.xtra.scope.rows ?? []).map((s: any, sIndex: number) => (
          <Fragment key={sIndex}>
            <div style={{ background: s.bg, transition: 'background-color .16s linear' }}>
              <div role="button" tabIndex={0} onClick={s.on} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1.4fr) 96px 18px', gap: '11px', alignItems: 'center', padding: '12px 13px', cursor: 'pointer' }} className="hv-7">
                <div style={{ fontSize: '13px', fontWeight: '600', lineHeight: '1.35' }}>
                  {s.init}
                </div>
                <div style={{ fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg2)', textWrap: 'pretty' }}>
                  {s.obj}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg3)', textAlign: 'right' }}>
                  {s.timeline}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '13px', color: 'var(--fg3)', textAlign: 'center' }}>
                  {s.caret}
                </div>
              </div>
              {s.sel ? (
                <>
                <div style={{ padding: '2px 13px 15px', animation: 'rise .2s ease both' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '12px' }}>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                        FUNCTIONAL REQUIREMENTS
                      </div>
                      <div style={{ marginTop: '7px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {(s.reqs ?? []).map((a: any, aIndex: number) => (
                          <Fragment key={aIndex}>
                            <div style={{ fontSize: '12px', lineHeight: '1.4', paddingLeft: '9px', borderLeft: '2px solid var(--ln26)' }}>
                              {a.t}
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                        AI REQUIREMENTS
                      </div>
                      <div style={{ marginTop: '7px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {(s.airs ?? []).map((a: any, aIndex: number) => (
                          <Fragment key={aIndex}>
                            <div style={{ fontSize: '12px', lineHeight: '1.4', paddingLeft: '9px', borderLeft: '2px solid #D26B51' }}>
                              {a.t}
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                        DATA AND INTEGRATIONS
                      </div>
                      <div style={{ marginTop: '7px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {(s.datas ?? []).map((a: any, aIndex: number) => (
                          <Fragment key={aIndex}>
                            <span style={{ border: '1px solid var(--ln22)', borderRadius: '16px', padding: '3px 9px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px' }}>
                              {a.t}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                      <div style={{ marginTop: '10px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                        KPIS
                      </div>
                      <div style={{ marginTop: '7px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {(s.kpis ?? []).map((a: any, aIndex: number) => (
                          <Fragment key={aIndex}>
                            <span style={{ border: '1px dashed var(--ln26)', borderRadius: '16px', padding: '3px 9px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', color: 'var(--fg2)' }}>
                              {a.t}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                        USERS AND WORKFLOW
                      </div>
                      <div style={{ marginTop: '6px', fontSize: '12px', lineHeight: '1.45', textWrap: 'pretty' }}>
                        {s.users}
                      </div>
                      <div style={{ marginTop: '10px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                        TEAM
                      </div>
                      <div style={{ marginTop: '6px', fontSize: '12px', lineHeight: '1.45' }}>
                        {s.team}
                      </div>
                      <div style={{ marginTop: '10px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                        INDICATIVE COMMERCIAL
                      </div>
                      <div style={{ marginTop: '6px', fontSize: '12.5px', fontWeight: '700' }}>
                        {s.comm}
                      </div>
                    </div>
                  </div>
                </div>
                </>
              ) : null}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
