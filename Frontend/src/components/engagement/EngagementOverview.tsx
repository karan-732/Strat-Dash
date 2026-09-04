'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function EngagementOverview({ v }: { v: any }) {
  return (
    v.projectOverview ? (
      <>
      <main className="eng-overview-scroll">
        <div className="eng-summary">
          <section className="eng-progress-card">
            <div className="eng-progress-top">
              <div>
                <div className="eng-eyebrow">
                  {v.cur.sprintLabel}
                </div>
                <div className="eng-status-line">
                  {v.cur.statusLine}
                </div>
              </div>
              <div className="eng-progress-value">
                {v.cur.pct}%
              </div>
            </div>
            <div className="eng-progress-track" role="progressbar" aria-label="Sprint completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={v.cur.pct}>
              <div className="eng-progress-fill" style={{ width: v.cur.pctw }} />
            </div>
          </section>
          <section className="eng-holdings-card" aria-label="Engagement holdings">
            <div className="eng-holdings">
              {(v.holdings ?? []).map((h: any, hIndex: number) => (
                <Fragment key={hIndex}>
                  <div className="eng-holding">
                    <div className="eng-holding-value">
                      {h.v}
                    </div>
                    <div className="eng-holding-label">
                      {h.k}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </section>
        </div>
        <section>
          <div className="eng-section-head">
            <div>
              <div className="eng-eyebrow">
                SIX-PHASE SPRINT
              </div>
              <h2 className="eng-section-title" tabIndex={-1}>
                Sprint journey
              </h2>
            </div>
            <div className="eng-section-hint">
              SELECT A PHASE · EYE REVEALS THE FULL BRIEF
            </div>
          </div>
          <div className="eng-phase-grid">
            {(v.phases ?? []).map((p: any, pIndex: number) => (
              <Fragment key={pIndex}>
                <article className="eng-phase-card" onClick={p.select} style={{ cursor: p.cardCursor, opacity: p.cardOpacity, borderColor: p.cardBd, background: p.cardBg, boxShadow: p.cardShadow }} aria-labelledby={p.titleId}>
                  <div className="eng-phase-card-top">
                    <div className="eng-phase-number">
                      {p.num}
                    </div>
                    <div className="eng-phase-state" style={{ color: p.pctFg }}>
                      {p.state}
                    </div>
                  </div>
                  <div id={p.titleId} className="eng-phase-title">
                    {p.title}
                  </div>
                  <div className="eng-phase-subtitle">
                    {p.subtitle}
                  </div>
                  <div className="eng-phase-card-bottom">
                    {p.notClosed ? (
                      <>
                      <button onClick={p.select} className="eng-phase-open" aria-label={p.actionLabel}>
                        {p.openLabel}
                      </button>
                      </>
                    ) : null}
                    <div className="eng-mini-progress" role="progressbar" aria-label={p.progressLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={p.pct}>
                      <span style={{ width: p.pctw }} />
                    </div>
                    <div className="eng-details" onMouseEnter={v.openDisclosure} onMouseLeave={v.leaveDisclosure}>
                      <button type="button" className="eng-eye-button" title={`View the full Phase ${p.num} brief`} aria-label={`View the full Phase ${p.num} brief`} aria-expanded="false" aria-controls={p.popoverId} onClick={v.toggleDisclosure} onFocus={v.openDisclosure} onBlur={v.blurDisclosure} onKeyDown={v.closeDisclosure}>
                        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                          <circle cx="12" cy="12" r="2.7" />
                        </svg>
                      </button>
                      <div id={p.popoverId} className="eng-popover" role="tooltip">
                        <div className="eng-eyebrow">
                          PHASE {p.num} · {p.title}
                        </div>
                        <div style={{ marginTop: '8px' }}>
                          {p.intro}
                        </div>
                        <div className="eng-popover-note">
                          {p.note}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Fragment>
            ))}
          </div>
        </section>
      </main>
      </>
    ) : null
  );
}
