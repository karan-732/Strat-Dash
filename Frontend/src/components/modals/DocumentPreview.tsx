'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function DocumentPreview({ v }: { v: any }) {
  return (
    v.previewOpen ? (
      <>
      <div style={{ position: 'fixed', inset: '0', background: 'var(--scrim)', zIndex: '45', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '22px 22px 0' }}>
        <div style={{ width: '900px', maxWidth: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', paddingBottom: '12px' }}>
          <div style={{ minWidth: '0' }}>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.16em', color: 'var(--card2)' }}>
              DOCUMENT PREVIEW
            </div>
            <div style={{ marginTop: '5px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '17px', fontWeight: '600', color: 'var(--card)' }}>
              {v.preview.name}
            </div>
            <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--fg3)' }}>
              {v.preview.meta}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '7px', flex: '0 0 auto' }}>
            <button onClick={v.preview.dlDoc} style={{ padding: '9px 13px', border: '2px solid var(--card)', background: v.accent, color: '#0E1015', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '600', letterSpacing: '.13em' }}>
              ↓ DOWNLOAD .DOC
            </button>
            <button onClick={v.preview.dlMd} style={{ padding: '9px 13px', border: '1px solid var(--fg3)', background: 'transparent', color: 'var(--card)', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.13em' }}>
              ↓ .MD
            </button>
            <button onClick={v.closePreview} style={{ padding: '9px 13px', border: '1px solid var(--fg3)', background: 'transparent', color: 'var(--card)', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.13em' }}>
              CLOSE
            </button>
          </div>
        </div>
        <div style={{ width: '900px', maxWidth: '100%', flex: '1', minHeight: '0', overflow: 'auto', background: 'var(--card)', borderTop: '3px solid #D26B51' }}>
          <div style={{ padding: '52px 64px 80px' }}>
            {(v.preview.blocks ?? []).map((b: any, bIndex: number) => (
              <Fragment key={bIndex}>
                <div>
                  {b.isH1 ? (
                    <>
                    <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '27px', fontWeight: '700', letterSpacing: '-.025em', lineHeight: '1.15', margin: '0 0 18px', paddingBottom: '12px', borderBottom: '2px solid #D26B51' }}>
                      {b.text}
                    </div>
                    </>
                  ) : null}
                  {b.isH2 ? (
                    <>
                    <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '17px', fontWeight: '600', letterSpacing: '-.01em', margin: '30px 0 10px' }}>
                      {b.text}
                    </div>
                    </>
                  ) : null}
                  {b.isH3 ? (
                    <>
                    <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '13px', fontWeight: '600', letterSpacing: '.06em', textTransform: 'uppercase', color: '#D26B51', margin: '22px 0 8px' }}>
                      {b.text}
                    </div>
                    </>
                  ) : null}
                  {b.isLi ? (
                    <>
                    <div style={{ display: 'flex', gap: '11px', margin: '5px 0 5px 2px' }}>
                      <span style={{ color: 'var(--fg3)' }}>
                        ·
                      </span>
                      <span style={{ flex: '1', minWidth: '0', fontSize: '14.5px', lineHeight: '1.6', color: 'var(--fg)', textWrap: 'pretty' }}>
                        {b.text}
                      </span>
                    </div>
                    </>
                  ) : null}
                  {b.isRow ? (
                    <>
                    <div style={{ display: 'flex', borderTop: '1px solid var(--ln14)', background: 'var(--bg)' }}>
                      {(b.cells ?? []).map((c: any, cIndex: number) => (
                        <Fragment key={cIndex}>
                          <div style={{ flex: '1', minWidth: '0', padding: '8px 11px', fontSize: '13px', lineHeight: '1.5', color: 'var(--fg)', borderRight: '1px solid var(--ln11)', overflowWrap: 'anywhere' }}>
                            {c.t}
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    </>
                  ) : null}
                  {b.isP ? (
                    <>
                    <div style={{ fontSize: '14.5px', lineHeight: '1.65', color: 'var(--fg2)', margin: '11px 0', textWrap: 'pretty' }}>
                      {b.text}
                    </div>
                    </>
                  ) : null}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      </>
    ) : null
  );
}
