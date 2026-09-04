'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function NewEngagementModal({ v }: { v: any }) {
  return (
    v.modal ? (
      <>
      <div style={{ position: 'fixed', inset: '0', background: 'var(--scrim)', display: 'grid', placeItems: 'center', zIndex: '40', padding: '24px', overflow: 'auto' }}>
        <div style={{ width: '520px', maxWidth: '100%', maxHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', background: 'var(--outer)', border: '1px solid var(--ln14)', borderRadius: '14px', boxShadow: '0 40px 90px -30px var(--sh85)', animation: 'rise .18s cubic-bezier(.2,.7,.3,1)' }}>
          <div style={{ flex: '0 0 auto', padding: '18px 20px', borderBottom: '1px solid var(--ln12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '14px', fontWeight: '700', letterSpacing: '.02em' }}>
              NEW PROJECT
            </div>
            <button onClick={v.closeNew} style={{ border: '0', background: 'transparent', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '16px', padding: '0 4px' }}>
              ✕
            </button>
          </div>
          <div style={{ flex: '1 1 auto', minHeight: '0', overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'block' }}>
              <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                CLIENT NAME
              </span>
              <input onChange={v.fName} value={v.form.name} placeholder="Vantage Rail Systems" style={{ width: '100%', marginTop: '6px', padding: '10px', border: '1px solid var(--ln30)', background: 'var(--bg)', fontSize: '14px' }} />
            </label>
            <label style={{ display: 'block' }}>
              <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                SECTOR
              </span>
              <input onChange={v.fSector} value={v.form.sector} placeholder="Rail rolling stock manufacturing" style={{ width: '100%', marginTop: '6px', padding: '10px', border: '1px solid var(--ln30)', background: 'var(--bg)', fontSize: '14px' }} />
            </label>
            <div>
              <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                TYPE OF SPRINT
              </span>
              <div style={{ marginTop: '7px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {(v.scopeOptions ?? []).map((o: any, oIndex: number) => (
                  <Fragment key={oIndex}>
                    <button type="button" onClick={o.pick} style={{ display: 'flex', alignItems: 'flex-start', gap: '11px', width: '100%', textAlign: 'left', padding: '11px 12px', border: `1px solid ${o.bd}`, background: o.bg, cursor: 'pointer' }}>
                      <span style={{ flex: '0 0 auto', width: '11px', height: '11px', marginTop: '2px', border: '1px solid var(--ln38)', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: o.dot }} />
                      </span>
                      <span style={{ minWidth: '0' }}>
                        <span style={{ display: 'block', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '700', letterSpacing: '.13em' }}>
                          {o.label}
                        </span>
                        <span style={{ display: 'block', marginTop: '5px', fontSize: '12px', lineHeight: '1.45', color: 'var(--fg2)', textWrap: 'pretty' }}>
                          {o.note}
                        </span>
                      </span>
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
            <label style={{ display: 'block' }}>
              <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
                NOTES CARRIED INTO EVERY GENERATION
              </span>
              <textarea onChange={v.fNotes} value={v.form.notes} placeholder="Segments, geographies, known constraints, who we are talking to first." style={{ width: '100%', minHeight: '78px', marginTop: '6px', padding: '10px', border: '1px solid var(--ln30)', background: 'var(--bg)', fontSize: '13.5px', lineHeight: '1.5' }} />
            </label>
          </div>
          <div style={{ flex: '0 0 auto', padding: '16px 20px', borderTop: '1px solid var(--ln12)', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={v.closeNew} style={{ padding: '11px 15px', border: '1px solid var(--ln38)', background: 'transparent', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.12em' }}>
              CANCEL
            </button>
            <button onClick={v.createProject} style={{ padding: '11px 18px', border: '2px solid #D26B51', background: v.accent, color: '#FFFFFF', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '.12em' }}>
              CREATE
            </button>
          </div>
        </div>
      </div>
      </>
    ) : null
  );
}
