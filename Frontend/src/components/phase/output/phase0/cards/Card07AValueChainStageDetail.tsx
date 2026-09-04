'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card07AValueChainStageDetail({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase0-07A" data-card-title="VALUE CHAIN STAGE DETAIL">
      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
        07A · VALUE CHAIN STAGE DETAIL
      </div>
      <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--fg2)' }}>
        Activities, decisions, people, systems, data, KPI and economic impact for each stage. Tap a stage.
      </div>
      <div style={{ marginTop: '13px', display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)' }}>
        {(v.xtra.chain.rows ?? []).map((c: any, cIndex: number) => (
          <Fragment key={cIndex}>
            <div style={{ background: c.bg, transition: 'background-color .16s linear' }}>
              <div role="button" tabIndex={0} onClick={c.on} style={{ display: 'grid', gridTemplateColumns: '28px minmax(0,1.1fr) minmax(0,1fr) minmax(0,1.2fr) 18px', gap: '11px', alignItems: 'center', padding: '11px 13px', cursor: 'pointer', borderLeft: `3px solid  ${c.mk}` }} className="hv-7">
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', color: 'var(--fg3)' }}>
                  {c.nn}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', lineHeight: '1.3' }}>
                  {c.stage}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.1em', color: 'var(--fg3)', lineHeight: '1.4' }}>
                  {c.kpi}
                </div>
                <div style={{ fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg2)', textWrap: 'pretty' }}>
                  {c.impact}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '13px', color: 'var(--fg3)', textAlign: 'center' }}>
                  {c.caret}
                </div>
              </div>
              {c.sel ? (
                <>
                <div style={{ padding: '2px 13px 15px', animation: 'rise .2s ease both', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '12px' }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                      ACTIVITIES
                    </div>
                    <div style={{ marginTop: '7px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {(c.acts ?? []).map((a: any, aIndex: number) => (
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
                      DECISIONS
                    </div>
                    <div style={{ marginTop: '7px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {(c.decs ?? []).map((a: any, aIndex: number) => (
                        <Fragment key={aIndex}>
                          <div style={{ fontSize: '12px', lineHeight: '1.4', paddingLeft: '9px', borderLeft: '2px solid var(--ok)' }}>
                            {a.t}
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                      SYSTEMS
                    </div>
                    <div style={{ marginTop: '7px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {(c.syss ?? []).map((a: any, aIndex: number) => (
                        <Fragment key={aIndex}>
                          <span style={{ border: '1px solid var(--ln22)', borderRadius: '16px', padding: '3px 9px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.06em' }}>
                            {a.t}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ marginTop: '10px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                      DATA
                    </div>
                    <div style={{ marginTop: '7px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {(c.datas ?? []).map((a: any, aIndex: number) => (
                        <Fragment key={aIndex}>
                          <span style={{ border: '1px dashed var(--ln26)', borderRadius: '16px', padding: '3px 9px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.06em', color: 'var(--fg2)' }}>
                            {a.t}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                      PEOPLE
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '12.5px', fontWeight: '600', lineHeight: '1.35' }}>
                      {c.people}
                    </div>
                    <div style={{ marginTop: '10px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)', textWrap: 'pretty' }}>
                      {c.note}
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
