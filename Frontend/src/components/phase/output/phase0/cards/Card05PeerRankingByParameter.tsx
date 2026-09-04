'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';
import { PeerRankingSources } from '@/features/console/components/PeerRankingSources';

export function Card05PeerRankingByParameter({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase0-05" data-card-title="PEER RANKING BY PARAMETER">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
          05 · PEER RANKING BY PARAMETER
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.11em', color: 'var(--fg3)' }}>
          {v.vis.rank.meta}
        </div>
      </div>
      <div style={{ marginTop: '9px', fontSize: '13.5px', lineHeight: '1.5', fontWeight: '600', letterSpacing: '-.01em', textWrap: 'pretty' }}>
        {v.vis.rank.verdict}
      </div>
      <div style={{ marginTop: '14px', overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: 'minmax(132px,1fr)', gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)' }}>
          {(v.vis.rank.table ?? []).map((t: any, tIndex: number) => (
            <Fragment key={tIndex}>
              <div style={{ background: t.bg, padding: '12px 12px 13px', borderTop: `3px solid  ${t.mk}` }}>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                  {t.rank} OVERALL
                </div>
                <div style={{ marginTop: '6px', fontSize: '13px', fontWeight: t.fw, lineHeight: '1.3', color: t.fg }}>
                  {t.name}
                </div>
                <div style={{ marginTop: '9px', height: '5px', borderRadius: '3px', background: 'var(--ln16)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: t.pct, background: t.mk2, borderRadius: '3px', transition: 'width .5s cubic-bezier(.2,.7,.3,1)' }} />
                </div>
                <div style={{ marginTop: '6px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
                  {t.score} WEIGHTED
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '13px', display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--ln12)', border: '1px solid var(--ln12)' }}>
        {(v.vis.rank.rows ?? []).map((r: any, rIndex: number) => (
          <Fragment key={rIndex}>
            <div style={{ background: r.bg, transition: 'background-color .16s linear' }}>
              <div role="button" tabIndex={0} onClick={r.on} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) 54px minmax(0,1fr) 116px 18px', gap: '11px', alignItems: 'center', padding: '11px 13px', cursor: 'pointer' }} className="hv-7">
                <div style={{ minWidth: '0' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', lineHeight: '1.3' }}>
                    {r.name}
                  </div>
                  <div style={{ marginTop: '3px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.12em', color: 'var(--fg3)' }}>
                    {r.unit} · WEIGHT {r.weight}
                  </div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '16px', fontWeight: '700', letterSpacing: '-.02em', color: r.rankFg }}>
                  {r.rankTag}
                </div>
                <div style={{ minWidth: '0' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: '600', lineHeight: '1.3', overflowWrap: 'anywhere' }}>
                    {r.clientValue}
                  </div>
                  <div style={{ marginTop: '5px', height: '6px', borderRadius: '4px', background: 'var(--ln12)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: r.pct, background: r.barC, borderRadius: '4px', transition: 'width .45s cubic-bezier(.2,.7,.3,1)' }} />
                  </div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.1em', color: 'var(--fg3)', textAlign: 'right', lineHeight: '1.4' }}>
                  {r.leaderTag}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '13px', color: 'var(--fg3)', textAlign: 'center' }}>
                  {r.caret}
                </div>
              </div>
              {r.sel ? (
                <>
                <div style={{ padding: '2px 13px 15px', animation: 'rise .2s ease both' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {(r.bars ?? []).map((b: any, bIndex: number) => (
                      <Fragment key={bIndex}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(90px,.85fr) minmax(0,2fr) 104px', gap: '11px', alignItems: 'center' }}>
                          <div style={{ fontSize: '11.5px', fontWeight: b.fw, color: b.fg, lineHeight: '1.3' }}>
                            {b.name}
                          </div>
                          <div style={{ height: '9px', borderRadius: '5px', background: 'var(--ln12)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: b.pct, background: b.c, borderRadius: '5px', transition: 'width .45s cubic-bezier(.2,.7,.3,1)' }} />
                          </div>
                          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', textAlign: 'right', color: 'var(--fg2)', overflowWrap: 'anywhere' }}>
                            {b.value}
                          </div>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ marginTop: '11px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)', textWrap: 'pretty' }}>
                    {r.basis}
                  </div>
                </div>
                </>
              ) : null}
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '11px' }}>
        {v.vis.rank.hasLeads ? (
          <>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
              LEADS THE PEER SET IN
            </div>
            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {(v.vis.rank.leads ?? []).map((l: any, lIndex: number) => (
                <Fragment key={lIndex}>
                  <span style={{ border: '1px solid var(--card4)', background: 'var(--card3)', borderRadius: '20px', padding: '4px 10px', fontSize: '11.5px', fontWeight: '600' }}>
                    {l.t}
                  </span>
                </Fragment>
              ))}
            </div>
          </div>
          </>
        ) : null}
        {v.vis.rank.hasLags ? (
          <>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
              FALLS BEHIND IN
            </div>
            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {(v.vis.rank.lags ?? []).map((l: any, lIndex: number) => (
                <Fragment key={lIndex}>
                  <span style={{ border: '1px dashed var(--ln30)', borderRadius: '20px', padding: '4px 10px', fontSize: '11.5px', color: 'var(--fg2)' }}>
                    {l.t}
                  </span>
                </Fragment>
              ))}
            </div>
          </div>
          </>
        ) : null}
      </div>
      <div style={{ marginTop: '11px', fontSize: '11.5px', lineHeight: '1.5', color: 'var(--fg3)', textWrap: 'pretty' }}>
        {v.vis.rank.note}
      </div>
      <PeerRankingSources v={v} />
    </div>
  );
}
