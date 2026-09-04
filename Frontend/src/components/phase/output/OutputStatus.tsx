'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';
import { GenerationFound } from '@/features/console/components/GenerationFound';

export function OutputStatus({ v }: { v: any }) {
  return (
    <section className="eng-output-shell" aria-labelledby="phase-output-title">
      <div className="eng-output-head">
        <div>
          <div className="eng-output-eyebrow">
            PHASE {v.ph.num} · OUTPUT
          </div>
          <h3 id="phase-output-title" className="eng-output-title">
            {v.outputTitle}
          </h3>
          <p className="eng-output-summary">
            {v.outputSummary}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '0 0 auto' }}>
          <span className="eng-output-badge" style={{ color: v.outputBadgeFg, borderColor: v.outputBadgeBd }}>
            {v.outputBadge}
          </span>
        </div>
      </div>
      {v.outputBusy ? (
        <>
        <div className="eng-output-processing eng-gen-stage" role="status" aria-live="polite">
          <div className="eng-gen-head">
            <span className="eng-gen-spinner" aria-hidden="true" />
            <div style={{ minWidth: '0', flex: '1' }}>
              <div className="eng-gen-live">
                GENERATING · {v.outputStage}
              </div>
              <div className="eng-gen-detail">
                {v.outputStageDetail}
              </div>
            </div>
            <span className="eng-gen-pct">
              {v.outputProgressValue}%
            </span>
          </div>
          <div className="eng-output-progress" role="progressbar" aria-label="Output progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={v.outputProgressValue}>
            <span style={{ width: v.outputProgress }} />
          </div>
          <div className="eng-gen-steps">
            {(v.genSteps ?? []).map((g: any, gIndex: number) => (
              <Fragment key={gIndex}>
                <div className="eng-gen-step" style={{ color: g.fg }}>
                  <span className="eng-gen-step-dot" style={{ background: g.dotBg, color: g.dotFg }}>
                    {g.mark}
                  </span>
                  <span>
                    {g.label}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
          <GenerationFound v={v} />
        </div>
        </>
      ) : null}
      {v.outputEmpty ? (
        <>
        <div className="eng-output-empty">
          <div className="eng-output-empty-mark" aria-hidden="true">
            ✦
          </div>
          <div className="eng-output-empty-title">
            NOTHING GENERATED YET
          </div>
          <p>
            Load what you have on the INPUTS tab, then press GENERATE at the bottom of it.
          </p>
        </div>
        </>
      ) : null}
    </section>
  );
}
