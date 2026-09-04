'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';
import { GenerationProviderSwitch } from '@/features/console/components/GenerationProviderSwitch';

export function AttentionView({ v }: { v: any }) {
  return (
    v.isAttn ? (
      <>
      <div className="app-view-shell attention-shell" style={{ flex: '1', minWidth: '0', display: 'grid', gridTemplateRows: 'auto minmax(0,1fr)', overflow: 'hidden', margin: '10px 10px 10px 0', border: '1px solid var(--ln09)', borderRadius: '20px', background: 'rgba(255,255,255,.022)', boxShadow: '0 30px 70px -50px rgba(0,0,0,1)' }}>
        <header className="app-main-header" style={{ padding: '20px 28px 18px', borderBottom: '1px solid var(--ln12)', background: 'var(--card)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '28px', flexWrap: 'wrap' }}>
          <GenerationProviderSwitch
            provider={v.generationProvider}
            providers={v.generationProviders}
            disabled={v.generationProviderBusy}
            onChange={v.setGenerationProvider}
          />
          <div style={{ minWidth: '0' }}>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
              PORTFOLIO
            </div>
            <h1 style={{ margin: '8px 0 0', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '34px', fontWeight: '600', letterSpacing: '-.02em', lineHeight: '1.02' }}>
              Needs attention
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={v.goDash} style={{ padding: '12px 15px', whiteSpace: 'nowrap', border: '1px solid var(--ln30)', background: 'transparent', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '600', letterSpacing: '.13em' }}>
              ← DASHBOARD
            </button>
            <button onClick={v.openNew} style={{ padding: '12px 16px', border: '2px solid #D26B51', background: v.accent, color: '#0E1015', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '700', letterSpacing: '.13em' }}>
              NEW
            </button>
          </div>
        </header>
        <div style={{ overflow: 'auto' }}>
          <div style={{ padding: '22px 28px 40px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '12px' }}>
              {(v.attnKpis ?? []).map((k: any, kIndex: number) => (
                <Fragment key={kIndex}>
                  <button onClick={k.set} style={{ textAlign: 'left', border: '1px solid var(--ln10)', background: k.bg, padding: '16px 17px 17px', display: 'block', width: '100%' }} className="hv-5">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', minHeight: '2.35em' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: k.c, flex: '0 0 auto', marginTop: '.35em' }} />
                      <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
                        {k.label}
                      </span>
                    </div>
                    <div style={{ marginTop: '11px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                      <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '38px', fontWeight: '600', letterSpacing: '-.03em', lineHeight: '.85', color: k.c }}>
                        {k.value}
                      </div>
                    </div>
                    <div style={{ marginTop: '11px', fontSize: '11.5px', lineHeight: '1.4', color: 'var(--fg2)', textWrap: 'pretty' }}>
                      {k.sub}
                    </div>
                  </button>
                </Fragment>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap', marginTop: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
                {(v.attnChips ?? []).map((c: any, cIndex: number) => (
                  <Fragment key={cIndex}>
                    <button onClick={c.set} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 12px', border: `1px solid  ${c.bd}`, background: c.bg, color: c.fg, fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', fontWeight: '700', letterSpacing: '.13em', whiteSpace: 'nowrap', borderRadius: '999px' }} className="hv-6">
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.dot, opacity: c.dotOp }} />
                      <span>
                        {c.label}
                      </span>
                      <span style={{ opacity: '.62' }}>
                        {c.n}
                      </span>
                    </button>
                  </Fragment>
                ))}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                {v.attnFilterLabel}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {(v.attention ?? []).map((a: any, aIndex: number) => (
                <Fragment key={aIndex}>
                  <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', padding: '0', display: 'grid', gridTemplateColumns: '4px minmax(0,1fr) auto', gap: '0', alignItems: 'stretch', overflow: 'hidden' }}>
                    <div style={{ background: a.dot }} />
                    <div style={{ minWidth: '0', padding: '15px 18px', background: a.tint }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexWrap: 'wrap' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '999px', background: a.dot, color: '#0C0916', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '8.5px', fontWeight: '700', letterSpacing: '.13em' }}>
                          {a.kindLabel}
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                          {a.client}
                        </span>
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '15px', fontWeight: '600', lineHeight: '1.3', textWrap: 'pretty' }}>
                        {a.head}
                      </div>
                      <div style={{ marginTop: '6px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.12em', color: 'var(--fg3)', lineHeight: '1.4' }}>
                        {a.meta}
                      </div>
                    </div>
                    <div style={{ display: 'grid', placeItems: 'center', padding: '15px 18px', background: a.tint }}>
                      <button onClick={a.go} style={{ padding: '10px 14px', border: `1px solid  ${a.dot}`, background: 'transparent', color: a.dot, fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '700', letterSpacing: '.13em', whiteSpace: 'nowrap' }}>
                        {a.cta}
                      </button>
                    </div>
                  </div>
                </Fragment>
              ))}
              {v.attnEmpty ? (
                <>
                <div style={{ border: '1px dashed var(--ln20)', background: 'var(--card0)', padding: '34px 20px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
                    NO ITEMS IN THIS FILTER
                  </div>
                  <button onClick={v.attnClearFilter} style={{ marginTop: '14px', padding: '9px 14px', border: '1px solid var(--ln28)', background: 'transparent', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', fontWeight: '700', letterSpacing: '.13em' }}>
                    RESET
                  </button>
                </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      </>
    ) : null
  );
}
