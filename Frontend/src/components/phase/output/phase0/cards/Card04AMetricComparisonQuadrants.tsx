'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Card04AMetricComparisonQuadrants({ v }: { v: any }) {
  return (
    <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }} data-card="phase0-04A" data-card-title="METRIC COMPARISON QUADRANTS">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
          04A · METRIC COMPARISON QUADRANTS
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.11em', color: 'var(--fg3)' }}>
          {v.xtra.quads.head}
        </div>
      </div>
      <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))', gap: '14px' }}>
        {(v.xtra.quads.items ?? []).map((q: any, qIndex: number) => (
          <Fragment key={qIndex}>
            <div style={{ border: '1px solid var(--ln10)', background: 'var(--bg)', borderRadius: '11px', padding: '15px 16px 16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
                <div style={{ flex: '0 0 auto', marginTop: '1px', width: '24px', height: '19px', display: 'grid', placeItems: 'center', border: '1px solid var(--ln20)', borderRadius: '4px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', fontWeight: '700', letterSpacing: '.06em', color: 'var(--fg3)' }}>
                  {q.n}
                </div>
                <div style={{ minWidth: '0' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.13em', fontWeight: '600', lineHeight: '1.35' }}>
                    {q.title}
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg3)', textWrap: 'pretty' }}>
                    {q.why}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: '14px 38px minmax(0,1fr)', gridTemplateRows: 'auto auto auto', columnGap: '7px' }}>
                <div style={{ gridRow: '1', display: 'grid', placeItems: 'center' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8px', letterSpacing: '.14em', color: 'var(--fg3)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: '250px' }}>
                    {q.yLab}
                  </div>
                </div>
                <div style={{ gridRow: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', padding: '1px 0 1px' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8px', fontVariantNumeric: 'tabular-nums', color: 'var(--fg3)' }}>
                    {q.y1}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8px', fontVariantNumeric: 'tabular-nums', color: 'var(--fg4)' }}>
                    {q.ym}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8px', fontVariantNumeric: 'tabular-nums', color: 'var(--fg3)' }}>
                    {q.y0}
                  </span>
                </div>
                <div style={{ gridRow: '1', position: 'relative', height: '256px', overflow: 'hidden', border: '1px solid var(--ln16)', borderRadius: '10px', background: 'var(--card0)', backgroundImage: 'repeating-linear-gradient(to right,var(--ln10) 0 1px,transparent 1px 12.5%),repeating-linear-gradient(to bottom,var(--ln10) 0 1px,transparent 1px 12.5%)', boxShadow: 'inset 0 1px 2px var(--sh50)' }}>
                  <div style={{ position: 'absolute', left: '0', right: '0', top: '0', height: '50%', background: 'linear-gradient(180deg,rgba(210,107,81,.045),transparent)' }} />
                  <div style={{ position: 'absolute', left: '50%', top: '0', bottom: '0', width: '0', borderLeft: '1px dashed var(--ln20)' }} />
                  <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '0', borderTop: '1px dashed var(--ln20)' }} />
                  {q.crossShow ? (
                    <>
                    <div style={{ position: 'absolute', top: '0', bottom: '0', width: '0', left: q.crossL, borderLeft: '1px dashed rgba(210,107,81,.5)', zIndex: '1' }} />
                    </>
                  ) : null}
                  {q.crossShow ? (
                    <>
                    <div style={{ position: 'absolute', left: '0', right: '0', height: '0', top: q.crossT, borderTop: '1px dashed rgba(210,107,81,.5)', zIndex: '1' }} />
                    </>
                  ) : null}
                  <div style={{ position: 'absolute', left: '8px', top: '7px', maxWidth: '43%', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '7.5px', letterSpacing: '.11em', lineHeight: '1.35', color: 'var(--fg3)', background: 'var(--card0)', padding: '2px 4px', borderRadius: '4px' }}>
                    {q.tl}
                  </div>
                  <div style={{ position: 'absolute', right: '8px', top: '7px', maxWidth: '43%', textAlign: 'right', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '7.5px', letterSpacing: '.11em', lineHeight: '1.35', color: 'var(--fg3)', background: 'var(--card0)', padding: '2px 4px', borderRadius: '4px' }}>
                    {q.tr}
                  </div>
                  <div style={{ position: 'absolute', left: '8px', bottom: '7px', maxWidth: '43%', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '7.5px', letterSpacing: '.11em', lineHeight: '1.35', color: 'var(--fg3)', background: 'var(--card0)', padding: '2px 4px', borderRadius: '4px' }}>
                    {q.bl}
                  </div>
                  <div style={{ position: 'absolute', right: '8px', bottom: '7px', maxWidth: '43%', textAlign: 'right', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '7.5px', letterSpacing: '.11em', lineHeight: '1.35', color: 'var(--fg3)', background: 'var(--card0)', padding: '2px 4px', borderRadius: '4px' }}>
                    {q.br}
                  </div>
                  {(q.pts ?? []).map((pt: any, ptIndex: number) => (
                    <Fragment key={ptIndex}>
                      <div role="button" tabIndex={0} onClick={pt.on} style={{ position: 'absolute', left: pt.l, top: pt.t, transform: 'translate(-50%,-50%)', zIndex: pt.z, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer', opacity: pt.op, transition: 'opacity .16s linear', animation: 'ptin .45s ease both', animationDelay: pt.dl }} data-plot-point="" className="hv-9">
                        <div style={{ width: pt.d, height: pt.d, borderRadius: '50%', background: pt.c, border: `2px solid  ${pt.ring}`, boxShadow: pt.sh, transition: 'width .18s ease,height .18s ease,box-shadow .18s ease' }} />
                        <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', letterSpacing: '.04em', fontWeight: pt.w, lineHeight: '1.25', textAlign: 'center', maxWidth: '92px', background: pt.nb, color: pt.nf, border: `1px solid  ${pt.nbd}`, padding: '1px 5px', borderRadius: '6px', transition: 'background-color .16s linear,color .16s linear' }}>
                          {pt.name}
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ gridRow: '2', gridColumn: '3', display: 'flex', justifyContent: 'space-between', paddingTop: '6px' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8px', fontVariantNumeric: 'tabular-nums', color: 'var(--fg3)' }}>
                    {q.x0}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8px', fontVariantNumeric: 'tabular-nums', color: 'var(--fg4)' }}>
                    {q.xm}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8px', fontVariantNumeric: 'tabular-nums', color: 'var(--fg3)' }}>
                    {q.x1}
                  </span>
                </div>
                <div style={{ gridRow: '3', gridColumn: '3', paddingTop: '5px', textAlign: 'center', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                  {q.xLab}
                </div>
              </div>
              {q.pickShow ? (
                <>
                <div style={{ marginTop: '11px', border: '1px solid rgba(210,107,81,.3)', borderLeft: '3px solid #D26B51', background: 'var(--card3)', borderRadius: '8px', padding: '9px 11px', animation: 'rise .2s ease both' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.08em', lineHeight: '1.55', fontVariantNumeric: 'tabular-nums' }}>
                    {q.pickLine}
                  </div>
                  <div style={{ marginTop: '5px', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg3)', textWrap: 'pretty' }}>
                    {q.pickNote}
                  </div>
                </div>
                </>
              ) : null}
              <div style={{ marginTop: '9px', fontSize: '11px', lineHeight: '1.45', color: 'var(--fg3)' }}>
                {q.none}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
