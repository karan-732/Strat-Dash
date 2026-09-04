'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function PhaseTabs({ v }: { v: any }) {
  return (
    <div className="eng-tabs" aria-label="Phase workspace views">
      {(v.tabs ?? []).map((t: any, tIndex: number) => (
        <Fragment key={tIndex}>
          <button onClick={t.go} className="eng-tab" style={{ borderBottomColor: t.edge, color: t.fg }} aria-pressed={t.selected}>
            {t.label}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
