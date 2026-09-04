'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';
import { PhaseHandoff } from '@/features/console/components/PhaseHandoff';

export function PhaseInputs({ v }: { v: any }) {
  return (
    v.tabInputs ? (
      <>
      <PhaseHandoff v={v} />
      <div>
        {v.phaseLocked ? (
          <>
          <div style={{ marginBottom: '20px', border: '1px solid var(--ln14)', borderLeft: '4px solid var(--fg3)', background: 'var(--card0)', borderRadius: '10px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '240px' }}>
              <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', fontWeight: '700', letterSpacing: '.14em', color: 'var(--fg2)' }}>
                {v.phaseLockTitle}
              </div>
              <div style={{ marginTop: '7px', fontSize: '13.5px', lineHeight: '1.55', color: 'var(--fg2)', textWrap: 'pretty' }}>
                {v.phaseLockNote}
              </div>
            </div>
            <button type="button" onClick={v.goPrevPhase} style={{ padding: '10px 15px', border: '1px solid var(--ln38)', background: 'transparent', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '700', letterSpacing: '.13em' }}>
              {v.phaseLockCta}
            </button>
          </div>
          </>
        ) : null}
        {v.isPhase0 ? (
          <>
          <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '16px 17px', marginBottom: '20px' }}>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
              COMPANY URL - PASTED, NEVER UPLOADED
            </div>
            <input onChange={v.onUrl} value={v.curUrl} placeholder="vantagerail.com" style={{ width: '100%', marginTop: '8px', padding: '10px 11px', border: '1px solid var(--ln30)', background: 'var(--bg)', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '13px' }} />
          </div>
          </>
        ) : null}
        <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '16px 17px', marginBottom: '20px' }}>
          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
            OTHER LINKS - REPORTS, FILINGS, SECTOR NOTES
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
            <input onChange={v.onLk} value={v.lk} placeholder="https://…" style={{ flex: '1', minWidth: '220px', padding: '10px 11px', border: '1px solid var(--ln30)', background: 'var(--bg)', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '13px' }} />
            <button onClick={v.addLink} style={{ padding: '10px 14px', border: '2px solid #D26B51', background: 'transparent', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '600', letterSpacing: '.13em' }}>
              ADD
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
            {(v.links ?? []).map((l: any, lIndex: number) => (
              <Fragment key={lIndex}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', padding: '5px 9px', border: '1px solid var(--ln20)', background: 'var(--bg)', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', maxWidth: '100%' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px' }}>
                    {l.url}
                  </span>
                  <button onClick={l.remove} style={{ border: '0', background: 'transparent', padding: '0', color: 'var(--fg3)', fontSize: '11px' }}>
                    ✕
                  </button>
                </span>
              </Fragment>
            ))}
          </div>
        </div>
        <div style={{ border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '16px 17px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.14em', color: 'var(--fg3)' }}>
              ENTER INFORMATION MANUALLY - PHASE {v.ph.num}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.1em', color: 'var(--fg3)' }}>
              {v.manualStatus}
            </div>
          </div>
          <textarea onChange={v.onManual} value={v.manualDraft} placeholder="Interview notes, numbers given verbally, constraints, client language to preserve - anything the documents don't carry." style={{ width: '100%', marginTop: '9px', minHeight: '104px', resize: 'vertical', padding: '11px 12px', border: '1px solid var(--ln30)', background: 'var(--bg)', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '13.5px', lineHeight: '1.55', color: 'var(--fg)' }} />
          <div style={{ marginTop: '9px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={v.saveManual} style={{ padding: '9px 14px', border: '2px solid #D26B51', background: v.manualBg, color: v.manualFg, fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '700', letterSpacing: '.13em' }}>
              SAVE
            </button>
            {v.hasManual ? (
              <>
              <button onClick={v.clearManual} style={{ padding: '9px 12px', border: '1px solid var(--ln34)', background: 'transparent', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', letterSpacing: '.13em' }}>
                CLEAR
              </button>
              </>
            ) : null}
          </div>
        </div>
        <h3 style={{ margin: '0 0 11px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', letterSpacing: '.16em' }}>
          DATA ROOM · PHASE {v.ph.num}
        </h3>
        <div onDragOver={v.onDragOver} onDrop={v.onDrop} style={{ border: '2px dashed var(--ln22)', borderRadius: '10px', background: 'var(--card)', padding: '22px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: 'var(--fg2)' }}>
            Drop files here - questionnaires, exports, transcripts, screenshots
          </div>
          <label style={{ display: 'inline-block', marginTop: '12px', padding: '9px 14px', border: '2px solid #D26B51', background: v.accent, color: '#0E1015', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '600', letterSpacing: '.14em', cursor: 'pointer' }}>
            UPLOAD
            <input type="file" multiple onChange={v.onRoomFiles} style={{ display: 'none' }} />
          </label>
        </div>
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {(v.ph.files ?? []).map((f: any, fIndex: number) => (
            <Fragment key={fIndex}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 12px', border: '1px solid var(--ln12)', background: 'var(--card)' }}>
                <div style={{ width: '7px', height: '7px', background: '#D26B51', flex: '0 0 auto' }} />
                <div style={{ flex: '1', minWidth: '0', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.name}
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', color: 'var(--fg3)' }}>
                  {f.meta}
                </span>
                <button onClick={f.download} style={{ padding: '4px 9px', border: '1px solid var(--ln38)', background: 'transparent', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.12em' }}>
                  DOWNLOAD
                </button>
                <button onClick={f.remove} style={{ padding: '4px 8px', border: '1px solid var(--ln20)', background: 'transparent', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.12em', color: 'var(--fg3)' }}>
                  REMOVE
                </button>
              </div>
            </Fragment>
          ))}
        </div>
        <section className="eng-gen-cta" aria-label="Generate phase deliverables">
          <div className="eng-gen-cta-copy">
            <div className="eng-gen-cta-eyebrow">
              {v.genCtaEyebrow}
            </div>
            <div className="eng-gen-cta-title">
              {v.genCtaTitle}
            </div>
            <div className="eng-gen-cta-note">
              {v.genCtaNote}
            </div>
          </div>
          <button type="button" className="eng-gen-btn" onClick={v.startGenerate} disabled={v.genDisabled} aria-label={v.genAria}>
            {v.genLabel}
          </button>
        </section>
      </div>
      </>
    ) : null
  );
}
