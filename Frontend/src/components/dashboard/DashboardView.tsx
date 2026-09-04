'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';
import { GenerationProviderSwitch } from '@/features/console/components/GenerationProviderSwitch';
import { PortfolioCardRemove } from '@/features/console/components/PortfolioCardRemove';

export function DashboardView({ v }: { v: any }) {
  return (
    v.isDash ? (
      <>
      <div className="app-view-shell dash-shell" style={{ flex: '1', minWidth: '0', display: 'grid', gridTemplateRows: 'auto minmax(0,1fr)', overflow: 'hidden', margin: '10px 10px 10px 0', border: '1px solid var(--ln09)', borderRadius: '20px', background: 'rgba(255,255,255,.022)', boxShadow: '0 30px 70px -50px rgba(0,0,0,1)' }}>
        <header className="app-main-header" style={{ padding: '20px 28px 18px', borderBottom: '1px solid var(--ln12)', background: 'var(--card)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '28px', flexWrap: 'wrap' }}>
          <GenerationProviderSwitch
            provider={v.generationProvider}
            providers={v.generationProviders}
            disabled={v.generationProviderBusy}
            onChange={v.setGenerationProvider}
          />
          <div style={{ minWidth: '0' }}>
            <h1 style={{ margin: '0', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '34px', fontWeight: '600', letterSpacing: '-.02em', lineHeight: '1.02' }}>
              Sprint Dashboard
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={v.exportPortfolio} style={{ padding: '12px 15px', border: '1px solid #D26B51', background: 'transparent', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '600', letterSpacing: '.13em', whiteSpace: 'nowrap' }}>
              EXPORT
            </button>
            <button onClick={v.toggleTheme} title={v.themeTitle} aria-label={v.themeTitle} style={{ width: '28px', height: '28px', padding: '0', border: '1px solid var(--ln22)', background: 'transparent', borderRadius: '50%', display: 'grid', placeItems: 'center', overflow: 'hidden' }} className="hv-2">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: 'var(--fg2)', transition: 'transform .3s ease,opacity .3s ease', transform: v.themeSunTransform, opacity: v.themeSunOpacity }}>
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
              </svg>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: 'var(--fg2)', position: 'absolute', transition: 'transform .3s ease,opacity .3s ease', transform: v.themeMoonTransform, opacity: v.themeMoonOpacity }}>
                <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
              </svg>
            </button>
          </div>
        </header>
        <div className="app-main-scroll" style={{ overflow: 'auto' }}>
          <div className="app-main-content" style={{ padding: '22px 28px 40px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: '12px' }}>
              {(v.kpis ?? []).map((k: any, kIndex: number) => (
                <Fragment key={kIndex}>
                  <div className="kpi-card" style={{ position: 'relative', border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', borderTop: '3px solid #D26B51', padding: '15px 16px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', minHeight: '3.1em' }}>
                      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', lineHeight: '1.35', letterSpacing: '.16em', color: 'var(--fg3)' }}>
                        {k.label}
                      </div>
                      <button onMouseEnter={k.over} onMouseLeave={k.out} onClick={k.over} style={{ flex: '0 0 auto', width: '17px', height: '17px', padding: '0', border: '1px solid var(--ln26)', borderRadius: '50%', background: 'transparent', color: 'var(--fg3)', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', fontWeight: '700', lineHeight: '1', display: 'grid', placeItems: 'center' }}>
                        i
                      </button>
                    </div>
                    <div style={{ marginTop: '9px', display: 'flex', alignItems: 'baseline', gap: '5px', flexWrap: 'wrap', minWidth: '0' }}>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '38px', fontWeight: '600', letterSpacing: '-.03em', lineHeight: '.9' }}>
                        {k.value}
                      </span>
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '13px', color: 'var(--fg3)', minWidth: '0', overflowWrap: 'anywhere' }}>
                        {k.unit}
                      </span>
                    </div>
                    {k.tipOn ? (
                      <>
                      <div style={{ position: 'absolute', left: '12px', right: '12px', top: 'calc(100% + 8px)', zIndex: '30', padding: '10px 12px', background: 'var(--outer)', border: '1px solid var(--ln22)', borderRadius: '8px', boxShadow: '0 14px 30px -10px var(--sh95)', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg)', textWrap: 'pretty' }}>
                        {k.sub}
                      </div>
                      </>
                    ) : null}
                  </div>
                </Fragment>
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '11px', flexWrap: 'wrap' }}>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em' }}>
                  ENGAGEMENTS
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input onChange={v.onQ} value={v.q} placeholder="Search client or sector" style={{ width: '230px', padding: '7px 10px', border: '1px solid var(--ln22)', background: 'var(--card0)', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11.5px' }} />
                  <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', color: 'var(--fg3)', whiteSpace: 'nowrap' }}>
                    {v.searchCount}
                  </div>
                </div>
              </div>
              <div className="engagement-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(232px,1fr))', gridAutoRows: '1fr', gap: '9px' }}>
                {(v.cards ?? []).map((c: any, cIndex: number) => (
                  <Fragment key={cIndex}>
                    <div className={`portfolio-card hv-3`} onClick={c.open} title="Open sprint" style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '9px', boxShadow: '0 1px 2px var(--sh50)', borderLeft: '3px solid #D26B51', padding: '12px 13px 11px', display: 'flex', flexDirection: 'column', gap: '9px', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                        <div style={{ minWidth: '0' }}>
                          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '14px', fontWeight: '600', letterSpacing: '-.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.name}
                          </div>
                          <div style={{ marginTop: '3px', fontSize: '10.5px', color: 'var(--fg3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.sector}
                          </div>
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', fontWeight: '600', color: 'var(--fg2)' }}>
                          {c.pct}%
                        </div>
                      </div>
                      <div style={{ marginTop: 'auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: '3px' }}>
                          {(c.segs ?? []).map((s: any, sIndex: number) => (
                            <Fragment key={sIndex}>
                              <div style={{ height: '6px', background: 'var(--card2)', border: '1px solid var(--ln12)' }}>
                                <div style={{ height: '100%', width: s.w, background: s.fill }} />
                              </div>
                            </Fragment>
                          ))}
                        </div>
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <div style={{ minWidth: '0', fontSize: '10.5px', color: 'var(--fg3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.stage}
                          </div>
                          <button onClick={c.blueprint} title="Download blueprint" style={{ flex: '0 0 auto', padding: '4px 7px', border: '1px solid var(--ln22)', background: 'transparent', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.1em', color: 'var(--fg3)', whiteSpace: 'nowrap' }} className="hv-4">
                            BLUEPRINT
                          </button>
                        </div>
                      </div>
                      <PortfolioCardRemove card={c} />
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
            <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: '16px' }}>
              <div className="analytics-card" style={{ position: 'relative', border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em' }}>
                    SPRINT PROGRESS BY ENGAGEMENT
                  </div>
                  <button onMouseEnter={v.barsOver} onMouseLeave={v.barsOut} onClick={v.barsOver} style={{ flex: '0 0 auto', width: '17px', height: '17px', padding: '0', border: '1px solid var(--ln26)', borderRadius: '50%', background: 'transparent', color: 'var(--fg3)', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', fontWeight: '700', lineHeight: '1', display: 'grid', placeItems: 'center' }}>
                    i
                  </button>
                </div>
                {v.barsTipOn ? (
                  <>
                  <div style={{ position: 'absolute', right: '16px', top: '40px', zIndex: '8', maxWidth: '290px', padding: '10px 12px', background: 'var(--card2)', border: '1px solid var(--ln22)', borderRadius: '8px', boxShadow: '0 14px 30px -10px var(--sh95)', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg)', textWrap: 'pretty' }}>
                    Completion tracks generated current packs across all six phases. Click any bar to open that engagement.
                  </div>
                  </>
                ) : null}
                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column' }}>
                  {(v.bars ?? []).map((b: any, bIndex: number) => (
                    <Fragment key={bIndex}>
                      <button onClick={b.open} style={{ width: '100%', textAlign: 'left', display: 'grid', gridTemplateColumns: '160px minmax(0,1fr) 44px', gap: '12px', alignItems: 'center', padding: '9px 2px', border: '0', borderBottom: '1px solid var(--ln09)', background: 'transparent' }}>
                        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {b.name}
                        </span>
                        <span style={{ display: 'block', height: '15px', background: 'var(--card2)', border: '1px solid var(--ln14)' }}>
                          <span style={{ display: 'block', height: '100%', width: b.pctw, background: v.accent }} />
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', fontWeight: '600', textAlign: 'right' }}>
                          {b.pct}%
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div className="analytics-card" style={{ position: 'relative', border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em' }}>
                    AVERAGE COMPLETION BY PHASE
                  </div>
                  <button onMouseEnter={v.phaseOver} onMouseLeave={v.phaseOut} onClick={v.phaseOver} style={{ flex: '0 0 auto', width: '17px', height: '17px', padding: '0', border: '1px solid var(--ln26)', borderRadius: '50%', background: 'transparent', color: 'var(--fg3)', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', fontWeight: '700', lineHeight: '1', display: 'grid', placeItems: 'center' }}>
                    i
                  </button>
                </div>
                {v.phaseTipOn ? (
                  <>
                  <div style={{ position: 'absolute', right: '16px', top: '40px', zIndex: '8', maxWidth: '270px', padding: '10px 12px', background: 'var(--card2)', border: '1px solid var(--ln22)', borderRadius: '8px', boxShadow: '0 14px 30px -10px var(--sh95)', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg)', textWrap: 'pretty' }}>
                    Each column is the mean completion of that phase across every engagement. The line below shows how many clients sit in that phase right now.
                  </div>
                  </>
                ) : null}
                <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: '8px', alignItems: 'end', height: '132px' }}>
                  {(v.cols ?? []).map((c: any, cIndex: number) => (
                    <Fragment key={cIndex}>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', gap: '6px' }}>
                        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10.5px', fontWeight: '600', textAlign: 'center' }}>
                          {c.pct}
                        </div>
                        <div style={{ height: c.h, background: c.fill, border: '1px solid var(--ok)' }} />
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: '8px', borderTop: '1px solid var(--ln14)', paddingTop: '8px' }}>
                  {(v.cols ?? []).map((c: any, cIndex: number) => (
                    <Fragment key={cIndex}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
                          P{c.num}
                        </div>
                        <div style={{ marginTop: '3px', fontSize: '10px', lineHeight: '1.25', color: 'var(--fg2)' }}>
                          {c.here}
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    ) : null
  );
}
