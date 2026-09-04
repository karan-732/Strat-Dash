'use client';

/**
 * A phase's questions for the client, rendered the same way wherever they
 * appear — on the OUTPUTS of the phase that raised them, and on the next
 * phase's INPUTS where the answers land.
 *
 * The shape is driven by one observation: an answered question and an
 * unanswered one are different things and should not look the same. The first
 * version gave every question a three-row textarea and a button on its own
 * line, so seven questions ran to two thousand pixels and a recorded answer
 * was indistinguishable from an empty form.
 *
 * So an answered question renders as text, with the client's own words under it
 * where a transcript supplied them, and an EDIT that opens a box only when
 * something needs changing. An unanswered one gets the box, because there the
 * box is the point. Owner and priority sit on the question's own meta line
 * rather than in a narrow right-hand column that wrapped every job title onto
 * three ragged lines.
 */

export const QUESTION_MONO = "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace";

export interface QuestionRow {
  id: string;
  nn: string;
  q: string;
  why: string;
  who: string;
  pri: string;
  priClass: string;
  condition: string;
  answered: boolean;
  answer: string;
  fromTranscript: boolean;
  sourceNote: string;
  quote: string;
  partial: boolean;
  gotSoFar: string;
  stillMissing: string;
  editing: boolean;
  draft: string;
  busy: boolean;
  placeholder: string;
  boxAria: string;
  editAria: string;
  saveLabel: string;
  onDraft: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  beginEdit: () => void;
  cancel: () => void;
  save: () => void;
}

export function QuestionLabel({ children, fg }: { children: React.ReactNode; fg?: string }) {
  return (
    <div
      style={{
        fontFamily: QUESTION_MONO,
        fontSize: '9px',
        fontWeight: 700,
        letterSpacing: '.14em',
        color: fg ?? 'var(--fg3)',
      }}
    >
      {children}
    </div>
  );
}

/** A small mono caps run, for the meta line and the source notes. */
function Meta({ children, fg }: { children: React.ReactNode; fg?: string }) {
  return (
    <span
      style={{
        fontFamily: QUESTION_MONO,
        fontSize: '8.5px',
        letterSpacing: '.13em',
        color: fg ?? 'var(--fg3)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

const BUTTON: React.CSSProperties = {
  padding: '6px 11px',
  border: '1px solid var(--ln26)',
  borderRadius: '6px',
  background: 'transparent',
  color: 'var(--fg2)',
  fontFamily: QUESTION_MONO,
  fontSize: '9px',
  fontWeight: 700,
  letterSpacing: '.12em',
  cursor: 'pointer',
  flex: '0 0 auto',
};

function Question({ q, last }: { q: QuestionRow; last: boolean }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '26px minmax(0,1fr)',
        columnGap: '11px',
        padding: '14px 2px 15px',
        borderBottom: last ? 'none' : '1px solid var(--ln12)',
      }}
    >
      <div
        style={{
          paddingTop: '2px',
          fontFamily: QUESTION_MONO,
          fontSize: '10px',
          color: 'var(--fg4)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {q.nn}
      </div>

      <div style={{ minWidth: 0 }}>
        {/* the question, with its priority alongside rather than in a column */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <div
            style={{
              flex: '1 1 auto',
              minWidth: 0,
              fontSize: '13.5px',
              fontWeight: 600,
              lineHeight: 1.45,
              textWrap: 'pretty',
            }}
          >
            {q.q}
          </div>
          {q.pri ? (
            <span className={`q-chip ${q.priClass}`} style={{ flex: '0 0 auto' }}>
              {q.pri}
            </span>
          ) : null}
        </div>

        {/*
          * Why it is being asked, folded away.
          *
          * The reason runs to two or three lines of the agent's own reasoning
          * and every question carries one, so seven questions read as seven
          * paragraphs with the questions buried between them. It is worth
          * having — it is what stops the list looking like a form — but it is
          * not what you scan. A native disclosure keeps it one click away and
          * needs no state.
          */}
        {q.why ? (
          <details className="q-why">
            <summary>WHY THIS IS ASKED</summary>
            <div>{q.why}</div>
          </details>
        ) : null}

        {/* who can answer it, and why it is being asked — one line, not three labels */}
        {q.who || q.condition ? (
          <div
            style={{
              marginTop: '6px',
              display: 'flex',
              alignItems: 'baseline',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {q.who ? <Meta fg="var(--fg2)">{q.who.toUpperCase()}</Meta> : null}
            {q.who && q.condition ? <Meta fg="var(--ln40)">·</Meta> : null}
            {q.condition ? <Meta>{q.condition}</Meta> : null}
          </div>
        ) : null}

        {/* half answered: still to ask, but not from scratch */}
        {q.partial ? (
          <div
            style={{
              marginTop: '9px',
              borderLeft: '2px solid var(--ln26)',
              paddingLeft: '9px',
              fontSize: '11.5px',
              lineHeight: 1.5,
              color: 'var(--fg3)',
              textWrap: 'pretty',
            }}
          >
            {q.gotSoFar}
            <div style={{ marginTop: '3px', color: 'var(--fg2)' }}>
              <Meta>STILL NEEDED · </Meta>
              {q.stillMissing}
            </div>
          </div>
        ) : null}

        {/* the answer: text when it is settled, a box when it is being written */}
        {q.answered && !q.editing ? (
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div
              style={{
                flex: '1 1 auto',
                minWidth: 0,
                borderLeft: '2px solid #D26B51',
                paddingLeft: '10px',
              }}
            >
              <div style={{ fontSize: '13px', lineHeight: 1.5, textWrap: 'pretty' }}>{q.answer}</div>
              <div style={{ marginTop: '4px' }}>
                <Meta fg="var(--fg4)">{q.sourceNote}</Meta>
              </div>
              {q.quote ? (
                <div
                  style={{
                    marginTop: '5px',
                    fontSize: '11.5px',
                    lineHeight: 1.5,
                    color: 'var(--fg3)',
                    fontStyle: 'italic',
                    textWrap: 'pretty',
                  }}
                >
                  “{q.quote}”
                </div>
              ) : null}
            </div>
            <button type="button" onClick={q.beginEdit} aria-label={q.editAria} style={BUTTON}>
              EDIT
            </button>
          </div>
        ) : (
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <textarea
              value={q.draft}
              onChange={q.onDraft}
              placeholder={q.placeholder}
              aria-label={q.boxAria}
              rows={2}
              style={{
                flex: '1 1 auto',
                minWidth: 0,
                padding: '9px 11px',
                border: '1px solid var(--ln20)',
                borderRadius: '7px',
                background: 'var(--bg)',
                color: 'var(--fg)',
                font: 'inherit',
                fontSize: '12.5px',
                lineHeight: 1.5,
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button type="button" onClick={q.save} disabled={q.busy} style={BUTTON}>
                {q.saveLabel}
              </button>
              {q.editing ? (
                <button type="button" onClick={q.cancel} style={{ ...BUTTON, borderColor: 'transparent' }}>
                  CANCEL
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function QuestionList({ items }: { items: QuestionRow[] }) {
  if (!items.length) return null;
  return (
    <div style={{ marginTop: '10px' }}>
      {items.map((q, i) => (
        <Question key={q.id || q.nn} q={q} last={i === items.length - 1} />
      ))}
    </div>
  );
}

/**
 * The questions while they are still on their way.
 *
 * Two things arrive late and used to arrive silently: the open engagement,
 * which is fetched in full after the portfolio has painted its shells, and a
 * phase's own questions, which are the pipeline's last stage. In both cases
 * the block rendered its empty note — "raised nothing that needs the client" —
 * which reads as an answer rather than a wait, and then questions appeared
 * over the top of it.
 *
 * So it says what it is doing, in the shape of the thing it is waiting for:
 * three rows the size of a question row, with a line for the number, the
 * question and its meta.
 */
export function QuestionSkeleton({ note, rows = 3 }: { note: string; rows?: number }) {
  return (
    <div style={{ marginTop: '10px' }} role="status" aria-live="polite">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '9px',
          paddingBottom: '12px',
          fontFamily: QUESTION_MONO,
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '.12em',
          color: 'var(--fg3)',
        }}
      >
        <span className="q-skel-spinner" aria-hidden="true" />
        {note}
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            display: 'grid',
            gridTemplateColumns: '26px minmax(0,1fr)',
            columnGap: '11px',
            padding: '14px 2px 15px',
            borderBottom: i === rows - 1 ? 'none' : '1px solid var(--ln12)',
          }}
        >
          <span className="q-skel" style={{ height: '10px', marginTop: '4px', width: '18px' }} />
          <div style={{ minWidth: 0 }}>
            <span className="q-skel" style={{ height: '13px', width: i % 2 ? '64%' : '86%' }} />
            <span className="q-skel" style={{ height: '10px', width: '38%', marginTop: '9px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
