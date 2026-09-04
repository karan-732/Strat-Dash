'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function DeliverableList({ v }: { v: any }) {
  return (
    v.legacyOutput ? (
      <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '11px' }}>
        <h3 style={{ margin: '0', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '12px', letterSpacing: '.16em' }}>
          DELIVERABLES
        </h3>
        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', color: 'var(--fg3)' }}>
          {v.ph.docsSummary}
        </span>
      </div>
      {v.notBuilt ? (
        <>
        <div style={{ border: '2px dashed var(--ln22)', borderRadius: '10px', background: 'var(--card)', padding: '52px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '20px', fontWeight: '700', letterSpacing: '.04em' }}>
            NO DRAFTS YET
          </div>
          <div style={{ fontSize: '13.5px', lineHeight: '1.55', color: 'var(--fg2)', maxWidth: '420px' }}>
            The {v.ph.docCount} deliverables of this phase appear once the package is built. Load what you have into the data room first.
          </div>
        </div>
        </>
      ) : null}
      {v.builtPlain ? (
        <>
        <div style={{ border: '1px solid var(--ln10)', borderLeft: '4px solid #D26B51', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '20px 22px', display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '240px' }}>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '13px', fontWeight: '700', letterSpacing: '.06em' }}>
              {v.builtTitle}
            </div>
            <div style={{ marginTop: '6px', fontSize: '13px', lineHeight: '1.55', color: 'var(--fg2)' }}>
              {v.builtLine}
            </div>
          </div>
          {v.showMissingDrafts ? (
            <>
            <button type="button" className="eng-doc-action" onClick={v.buildPackage}>
              {v.missingDraftsLabel}
            </button>
            </>
          ) : null}
        </div>
        <div className="eng-doc-list" aria-label={`Phase ${v.ph.num} deliverables`}>
          {(v.ph.docs ?? []).map((d: any, dIndex: number) => (
            <Fragment key={dIndex}>
              <article className="eng-doc-row" style={{ borderLeftColor: d.edge }} aria-labelledby={d.titleId}>
                <div className="eng-doc-summary">
                  <div className="eng-doc-number">
                    {d.nn}
                  </div>
                  <div className="eng-doc-copy">
                    <div id={d.titleId} className="eng-doc-name">
                      {d.name}
                    </div>
                    <div className="eng-doc-meta">
                      {d.wordCount}
                    </div>
                  </div>
                  <div className="eng-doc-actions">
                    <div className="eng-details eng-doc-scope" onMouseEnter={v.openDisclosure} onMouseLeave={v.leaveDisclosure}>
                      <button type="button" className="eng-eye-button" title={d.scopeLabel} aria-label={d.scopeLabel} aria-expanded="false" aria-controls={d.briefId} onClick={v.toggleDisclosure} onFocus={v.openDisclosure} onBlur={v.blurDisclosure} onKeyDown={v.closeDisclosure}>
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                          <circle cx="12" cy="12" r="2.7" />
                        </svg>
                      </button>
                      <div id={d.briefId} className="eng-popover" role="tooltip">
                        <div>
                          {d.desc}
                        </div>
                        <div className="eng-doc-outline">
                          {(d.sections ?? []).map((s: any, sIndex: number) => (
                            <Fragment key={sIndex}>
                              <div className="eng-doc-outline-row">
                                <span className="eng-popover-key">
                                  {s.n}
                                </span>
                                <span>
                                  {s.t}
                                </span>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button type="button" className="eng-doc-action" onClick={d.toggleTpl} aria-label={d.tplAria} aria-expanded={d.tplExpanded} aria-controls={d.outlineId}>
                      {d.tplLabel}
                    </button>
                    <button type="button" className="eng-doc-action eng-doc-action-primary" onClick={d.gen} aria-label={d.genAria} style={{ background: d.genBg }}>
                      {d.genLabel}
                    </button>
                    <button type="button" className="eng-doc-action" onClick={d.toggleOpen} aria-label={d.openAria} aria-expanded={d.openExpanded} aria-controls={d.draftId}>
                      {d.openLabel}
                    </button>
                  </div>
                </div>
                {d.tplOpen ? (
                  <>
                  <div id={d.outlineId} className="eng-doc-expanded">
                    <div className="eng-doc-expanded-head">
                      <div className="eng-doc-expanded-label">
                        TEMPLATE SECTIONS
                      </div>
                      <div className="eng-doc-downloads">
                        <button type="button" className="eng-doc-action" onClick={d.preview} aria-label={d.previewAria}>
                          PREVIEW
                        </button>
                        <button type="button" className="eng-doc-action" onClick={d.dlTpl} aria-label={d.tplDownloadAria}>
                          ↓ BLANK TEMPLATE
                        </button>
                      </div>
                    </div>
                    <div className="eng-doc-sections">
                      {(d.sections ?? []).map((s: any, sIndex: number) => (
                        <Fragment key={sIndex}>
                          <div className="eng-doc-section">
                            <span className="eng-popover-key">
                              {s.n}
                            </span>
                            <span>
                              {s.t}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  </>
                ) : null}
                {d.open ? (
                  <>
                  <div id={d.draftId} className="eng-doc-expanded">
                    <div className="eng-doc-expanded-head">
                      <div className="eng-doc-expanded-label">
                        DRAFT & STATUS
                      </div>
                      <div className="eng-doc-statuses">
                        {(d.chips ?? []).map((c: any, cIndex: number) => (
                          <Fragment key={cIndex}>
                            <button type="button" className="eng-doc-status" onClick={c.set} aria-label={c.aria} aria-pressed={c.pressed} style={{ background: c.bg, color: c.fg, borderColor: c.bd }}>
                              {c.label}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <textarea className="eng-doc-editor" onChange={d.onEdit} value={d.draft} aria-label={d.editorLabel} />
                    <div className="eng-doc-footer">
                      <div className="eng-doc-meta">
                        {d.wordCount}
                      </div>
                      <div className="eng-doc-downloads">
                        <button type="button" className="eng-doc-action" onClick={d.preview} aria-label={d.previewAria}>
                          PREVIEW
                        </button>
                        <button type="button" className="eng-doc-action" onClick={d.dlMd} aria-label={d.mdDownloadAria}>
                          ↓ .MD
                        </button>
                        <button type="button" className="eng-doc-action" onClick={d.dlDoc} aria-label={d.docDownloadAria}>
                          ↓ .DOC
                        </button>
                      </div>
                    </div>
                  </div>
                  </>
                ) : null}
              </article>
            </Fragment>
          ))}
        </div>
        </>
      ) : null}
      </>
    ) : null
  );
}
