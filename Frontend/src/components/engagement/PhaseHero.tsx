'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */

export function PhaseHero({ v }: { v: any }) {
  return (
    <div className="eng-phase-hero">
      <div className="eng-phase-identity">
        <div className="eng-phase-hero-number">
          {v.ph.num}
        </div>
        <div style={{ minWidth: '0' }}>
          <h2 className="eng-phase-hero-title" tabIndex={-1}>
            {v.ph.title}
          </h2>
          <div className="eng-phase-hero-subtitle">
            {v.ph.subtitle}
          </div>
        </div>
      </div>
      <div className="eng-phase-hero-actions">
        <div className="eng-details" onMouseEnter={v.openDisclosure} onMouseLeave={v.leaveDisclosure}>
          <button type="button" className="eng-eye-button" title="View the full phase brief" aria-label="View the full phase brief" aria-expanded="false" aria-controls="workspace-phase-brief" onClick={v.toggleDisclosure} onFocus={v.openDisclosure} onBlur={v.blurDisclosure} onKeyDown={v.closeDisclosure}>
            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
              <circle cx="12" cy="12" r="2.7" />
            </svg>
          </button>
          <div id="workspace-phase-brief" className="eng-popover" role="tooltip">
            <div className="eng-eyebrow">
              PHASE BRIEF
            </div>
            <div style={{ marginTop: '8px' }}>
              {v.ph.intro}
            </div>
            <div className="eng-popover-note">
              {v.ph.note}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
