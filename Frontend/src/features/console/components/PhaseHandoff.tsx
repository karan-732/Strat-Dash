'use client';

/**
 * The top of a phase's INPUTS tab: what this phase asks, the questions the
 * phase before it put to the client, and the two ways an answer arrives.
 *
 * One box per question, because that is how a consultant works through a call
 * afterwards — question by question, in the order they were asked. A whole
 * transcript is the other route, and it is a separate control: it answers
 * several at once and in no order, so the reader decides what it closed and
 * marks each one here with the client's own words.
 *
 * Reaches the tree through `SLOT_INJECTIONS` in `scripts/dc-to-jsx.mjs`.
 */

import {
  QuestionLabel as Label,
  QuestionList,
  QuestionSkeleton,
  QUESTION_MONO as MONO,
  type QuestionRow,
} from '@/features/console/components/QuestionList';

interface Handoff {
  showQuestion: boolean;
  question: string;
  derivation: string;
  bounds: string;
  eyebrow: string;
  show: boolean;
  prevNum: string | number;
  head: string;
  hasAsked: boolean;
  loading: boolean;
  loadingNote: string;
  emptyNote: string;
  items: QuestionRow[];
  fathomLabel: string;
  fathomOpen: boolean;
  fathomToggleAria: string;
  toggleFathom: () => void;
  transcriptNote: string;
  uploadLabel: string;
  uploadNote: string;
  uploadAria: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pasteLabel: string;
  pastePlaceholder: string;
  pasteDraft: string;
  onPaste: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readLabel: string;
  busy: boolean;
  readTranscript: () => void;
}

const BOX: React.CSSProperties = {
  width: '100%',
  padding: '10px 11px',
  border: '1px solid var(--ln20)',
  borderRadius: '7px',
  background: 'var(--bg)',
  color: 'var(--fg)',
  font: 'inherit',
  fontSize: '12.5px',
  lineHeight: 1.55,
  resize: 'vertical',
};

export function PhaseHandoff({ v }: { v: { handoff?: Handoff; phaseLocked?: boolean } }) {
  const h = v.handoff;
  if (!h || v.phaseLocked) return null;

  /*
   * While the questions are still arriving, the rest of the tab is held back.
   *
   * They land last and they are the tallest thing on the tab, so letting the
   * rest render first meant watching the tab assemble in the wrong order: the
   * URL, links and data-room boxes painted near the top, then the questions
   * resolved above them and shoved them a thousand pixels down, off screen.
   * Measured at 0.105 CLS on a cold load of Phase 1 — the boxes were not
   * flashing, they were being pushed.
   *
   * `data-handoff="loading"` is what the stylesheet hides the following
   * sibling on. It has to be done that way round because `PhaseInputs` is
   * generated from the source template and cannot hold the condition itself.
   */
  return (
    <div
      data-handoff={h.loading ? 'loading' : undefined}
      style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}
    >
      {/* the question the phase exists to answer — from Phase 1 on */}
      {h.showQuestion ? (
        <section
          aria-label="What this phase asks"
          style={{
            border: '1px solid var(--ln14)',
            borderLeft: '3px solid #D26B51',
            background: 'var(--card0)',
            borderRadius: '10px',
            padding: '14px 17px 15px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
            <Label>{h.eyebrow}</Label>
            <div style={{ fontFamily: MONO, fontSize: '8.5px', letterSpacing: '.13em', color: 'var(--fg4)' }}>
              {h.bounds}
            </div>
          </div>
          <h3
            style={{
              margin: '8px 0 0',
              fontSize: '16px',
              lineHeight: 1.4,
              letterSpacing: '-.015em',
              textWrap: 'pretty',
            }}
          >
            {h.question}
          </h3>
          {h.derivation ? (
            <p
              style={{
                margin: '6px 0 0',
                fontSize: '12px',
                lineHeight: 1.5,
                color: 'var(--fg3)',
                textWrap: 'pretty',
              }}
            >
              {h.derivation}
            </p>
          ) : null}
        </section>
      ) : null}

      {/* the questions to put to the client, one box each */}
      {h.show ? (
        <section
          aria-label={h.head}
          style={{
            border: '1px solid var(--ln10)',
            background: 'var(--card)',
            borderRadius: '10px',
            boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)',
            padding: '16px 18px 17px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <Label>{h.head}</Label>
            <button
              type="button"
              onClick={h.toggleFathom}
              aria-expanded={h.fathomOpen}
              aria-label={h.fathomToggleAria}
              style={{
                padding: '6px 12px',
                border: '1px solid',
                borderColor: h.fathomOpen ? '#D26B51' : 'var(--ln26)',
                borderRadius: '6px',
                background: h.fathomOpen ? 'var(--card3)' : 'transparent',
                color: h.fathomOpen ? 'var(--fg)' : 'var(--fg2)',
                fontFamily: MONO,
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '.12em',
                cursor: 'pointer',
              }}
            >
              {h.fathomLabel}
            </button>
          </div>

          {/* the transcript route, folded away until asked for */}
          {h.fathomOpen ? (
            <div
              style={{
                marginTop: '13px',
                border: '1px solid var(--ln14)',
                borderLeft: '3px solid #D26B51',
                background: 'var(--card0)',
                borderRadius: '8px',
                padding: '13px 14px 14px',
              }}
            >
              <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.55, color: 'var(--fg2)', textWrap: 'pretty' }}>
                {h.transcriptNote}
              </p>
              <div
                style={{
                  marginTop: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <label
                  style={{
                    padding: '9px 13px',
                    border: '1px solid var(--ln26)',
                    borderRadius: '7px',
                    background: 'var(--card)',
                    fontFamily: MONO,
                    fontSize: '9.5px',
                    fontWeight: 700,
                    letterSpacing: '.12em',
                    color: 'var(--fg)',
                    cursor: h.busy ? 'progress' : 'pointer',
                  }}
                >
                  {h.uploadLabel}
                  <input
                    type="file"
                    accept=".vtt,.txt,.md,.csv,.xlsx"
                    aria-label={h.uploadAria}
                    disabled={h.busy}
                    onChange={h.onUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                <span style={{ fontSize: '11px', lineHeight: 1.4, color: 'var(--fg3)' }}>
                  {h.uploadNote}
                </span>
              </div>

              <div style={{ marginTop: '13px' }}>
                <Label>{h.pasteLabel}</Label>
                <textarea
                  value={h.pasteDraft}
                  onChange={h.onPaste}
                  placeholder={h.pastePlaceholder}
                  aria-label={h.pasteLabel}
                  rows={5}
                  style={{ ...BOX, marginTop: '8px' }}
                />
                <div style={{ marginTop: '9px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={h.readTranscript}
                    disabled={h.busy}
                    className="eng-primary"
                    style={{ minWidth: '200px' }}
                  >
                    {h.readLabel}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/*
            * Waiting beats guessing. While the engagement is still being
            * fetched, or the phase that raises these is still running, the
            * list is unknown rather than empty — so the empty note is only
            * reached once there is nothing left to arrive.
            */}
          {h.hasAsked ? (
            <QuestionList items={h.items} />
          ) : h.loading ? (
            <QuestionSkeleton note={h.loadingNote} />
          ) : (
            <p style={{ margin: '10px 0 0', fontSize: '12.5px', lineHeight: 1.55, color: 'var(--fg3)' }}>
              {h.emptyNote}
            </p>
          )}
        </section>
      ) : null}
    </div>
  );
}
