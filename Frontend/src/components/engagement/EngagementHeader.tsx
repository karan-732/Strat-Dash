'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';
import { GenerationProviderSwitch } from '@/features/console/components/GenerationProviderSwitch';

export function EngagementHeader({ v }: { v: any }) {
  return (
    <header className="eng-header">
      <div className="eng-header-main">
        <div className="eng-breadcrumb">
          {v.phaseWorkspace ? (
            <>
            <button onClick={v.goProjectHome} className="eng-phase-nav-back">
              ← OVERVIEW
            </button>
            </>
          ) : null}
          {v.projectOverview ? (
            <>
            <button onClick={v.goDash} className="eng-phase-nav-back">
              ← DASHBOARD
            </button>
            </>
          ) : null}
          <span className="eng-eyebrow">
            CLIENT ENGAGEMENT
          </span>
        </div>
        <h1 className="eng-title" tabIndex={-1}>
          {v.cur.name}
        </h1>
      </div>
      <div className="eng-actions">
        <GenerationProviderSwitch
          provider={v.generationProvider}
          providers={v.generationProviders}
          disabled={v.generationProviderBusy}
          onChange={v.setGenerationProvider}
        />
        <button onClick={v.exportJson} className="eng-secondary">
          EXPORT
        </button>
        <div className="eng-details eng-header-details" onMouseEnter={v.openDisclosure} onMouseLeave={v.leaveDisclosure}>
          <button type="button" className="eng-eye-button" title="View engagement details" aria-label="View engagement details" aria-expanded="false" aria-controls="engagement-details-popover" onClick={v.toggleDisclosure} onFocus={v.openDisclosure} onBlur={v.blurDisclosure} onKeyDown={v.closeDisclosure}>
            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
              <circle cx="12" cy="12" r="2.7" />
            </svg>
          </button>
          <div id="engagement-details-popover" className="eng-popover" role="tooltip">
            <div className="eng-eyebrow" style={{ marginBottom: '5px' }}>
              ENGAGEMENT DETAIL
            </div>
            {(v.detail ?? []).map((d: any, dIndex: number) => (
              <Fragment key={dIndex}>
                <div className="eng-popover-row">
                  <div className="eng-popover-key">
                    {d.k}
                  </div>
                  <div className="eng-popover-value">
                    {d.v}
                  </div>
                </div>
              </Fragment>
            ))}
            <div className="eng-popover-row">
              <div className="eng-popover-key">
                GENERATION MODEL
              </div>
              <div className="eng-popover-value">
                {v.modelLabel}
              </div>
            </div>
          </div>
        </div>
        <button onClick={v.toggleTheme} title={v.themeTitle} aria-label={v.themeTitle} className="eng-icon-button" style={{ position: 'relative', overflow: 'hidden' }}>
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
  );
}
