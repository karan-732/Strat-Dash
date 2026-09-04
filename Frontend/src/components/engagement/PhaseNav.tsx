'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function PhaseNav({ v }: { v: any }) {
  return (
    <nav className="eng-phase-nav" aria-label="Sprint phases">
      <div className="eng-phase-nav-track">
        {(v.phases ?? []).map((p: any, pIndex: number) => (
          <Fragment key={pIndex}>
            <button onClick={p.select} className="eng-phase-nav-item" style={{ borderColor: p.cardBd, background: p.bg, opacity: p.cardOpacity, cursor: p.cardCursor }} aria-current={p.ariaCurrent}>
              <span className="eng-phase-nav-label">
                <span>
                  PHASE {p.num}
                </span>
                <span style={{ color: p.pctFg }}>
                  {p.badge}
                </span>
              </span>
              <span className="eng-phase-nav-title">
                {p.title}
              </span>
            </button>
          </Fragment>
        ))}
      </div>
    </nav>
  );
}
