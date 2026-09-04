'use client';

import { QuestionLabel, QUESTION_MONO as MONO } from '@/features/console/components/QuestionList';

/**
 * That a phase raised questions, on the OUTPUTS of the phase that raised them —
 * and only that.
 *
 * The list itself lives on the next phase's INPUTS, where the answers land and
 * where the transcript reader sits beside it. It used to render in full on both
 * surfaces, each question with its reason and its own answer box, which put two
 * editable copies of one set of questions two clicks apart and made a finished
 * pack read as a form to fill in.
 *
 * What is left is what only belongs here: the count, where they are worked, and
 * COPY and DOWNLOAD, because this is the surface you send the client from.
 *
 * Replaces the generated component through `REPLACEMENTS` in
 * `scripts/dc-to-jsx.mjs`.
 */
export function ClientQuestions({
  v,
}: {
  v: {
    cq?: {
      show: boolean;
      loading: boolean;
      loadingNote: string;
      head: string;
      has: boolean;
      countLabel: string;
      answeredLabel: string;
      whereNote: string;
      openLabel: string;
      openAria: string;
      openNext: () => void;
      emptyNote: string;
      copy: () => void;
      download: () => void;
    };
  };
}) {
  const cq = v.cq;
  if (!cq?.show) return null;

  const action: React.CSSProperties = {
    padding: '6px 11px',
    border: '1px solid var(--ln38)',
    borderRadius: '6px',
    background: 'transparent',
    color: 'var(--fg2)',
    fontFamily: MONO,
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '.12em',
    cursor: 'pointer',
  };

  return (
    <section
      aria-label={cq.head}
      style={{
        marginTop: '14px',
        border: '1px solid var(--ln10)',
        background: 'var(--card)',
        borderRadius: '10px',
        boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)',
        padding: '16px 18px 17px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <QuestionLabel>{cq.head}</QuestionLabel>
        {cq.has ? (
          <div style={{ display: 'flex', gap: '7px', flex: '0 0 auto' }}>
            <button type="button" onClick={cq.copy} style={action}>
              COPY
            </button>
            <button type="button" onClick={cq.download} style={action}>
              DOWNLOAD
            </button>
          </div>
        ) : null}
      </div>

      {/*
        * Questions are the pipeline's last stage, so on a running phase there
        * is a real wait here. Saying so beats an empty box that fills without
        * warning.
        */}
      {cq.loading ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            fontFamily: MONO,
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '.12em',
            color: 'var(--fg3)',
          }}
        >
          <span className="q-skel-spinner" aria-hidden="true" />
          {cq.loadingNote}
        </div>
      ) : cq.has ? (
        <div
          style={{
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '8px',
              fontFamily: MONO,
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '.12em',
              color: 'var(--fg)',
            }}
          >
            <span>{cq.countLabel}</span>
            {cq.answeredLabel ? (
              <>
                <span style={{ color: 'var(--ln40)' }}>·</span>
                <span style={{ color: 'var(--fg3)' }}>{cq.answeredLabel}</span>
              </>
            ) : null}
          </div>
          <p
            style={{
              flex: '1 1 220px',
              margin: 0,
              fontSize: '12.5px',
              lineHeight: 1.5,
              color: 'var(--fg3)',
              textWrap: 'pretty',
            }}
          >
            {cq.whereNote}
          </p>
          {cq.openLabel ? (
            <button
              type="button"
              onClick={cq.openNext}
              aria-label={cq.openAria}
              style={{ ...action, borderColor: '#D26B51', color: 'var(--fg)', flex: '0 0 auto' }}
            >
              {cq.openLabel}
            </button>
          ) : null}
        </div>
      ) : (
        <p style={{ margin: '10px 0 0', fontSize: '12.5px', lineHeight: 1.55, color: 'var(--fg3)' }}>
          {cq.emptyNote}
        </p>
      )}
    </section>
  );
}
