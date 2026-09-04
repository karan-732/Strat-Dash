'use client';

import { QUESTION_MONO as MONO } from '@/features/console/components/QuestionList';

/**
 * What a run has actually found, shown while it is still running.
 *
 * A phase takes minutes and the ladder said only which of eight stages it was
 * on — eight dots and a percentage, for seven minutes. Meanwhile the stream was
 * already carrying the pages read live, the count of figures the evidence pass
 * could quote against a source versus the ones it had to derive, the score the
 * check gave the output, and every warning raised along the way. All of it was
 * either dropped or compressed into a single toast after the fact.
 *
 * So this is not new instrumentation. It is the run saying what it is finding
 * as it finds it, out of data that was already arriving.
 *
 * Reaches the tree through `SLOT_INJECTIONS` in `scripts/dc-to-jsx.mjs`.
 */
export function GenerationFound({
  v,
}: {
  v: {
    outputBusy?: boolean;
    genFound?: {
      has: boolean;
      lines: { label: string; value: string }[];
      warnings: string[];
    };
  };
}) {
  const found = v.genFound;
  if (!v.outputBusy || !found) return null;
  if (!found.has && !found.warnings.length) return null;

  return (
    <div
      aria-live="polite"
      style={{
        marginTop: '16px',
        paddingTop: '14px',
        borderTop: '1px solid var(--ln12)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        textAlign: 'left',
        width: '100%',
        maxWidth: '560px',
      }}
    >
      {found.lines.map((line) => (
        <div
          key={line.label}
          style={{ display: 'grid', gridTemplateColumns: '76px minmax(0,1fr)', gap: '10px' }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: '8.5px',
              fontWeight: 700,
              letterSpacing: '.13em',
              color: 'var(--fg3)',
              paddingTop: '2px',
            }}
          >
            {line.label}
          </span>
          <span style={{ fontSize: '12px', lineHeight: 1.45, color: 'var(--fg2)', textWrap: 'pretty' }}>
            {line.value}
          </span>
        </div>
      ))}

      {/*
       * Warnings were being collected and never rendered, so "no peer site
       * could be read live — the ranking is desk-derived" reached nobody, and
       * the pack that followed looked as solid as one built on real pages.
       */}
      {found.warnings.map((warning, i) => (
        <div
          key={i}
          style={{ display: 'grid', gridTemplateColumns: '76px minmax(0,1fr)', gap: '10px' }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: '8.5px',
              fontWeight: 700,
              letterSpacing: '.13em',
              color: '#D26B51',
              paddingTop: '2px',
            }}
          >
            NOTE
          </span>
          <span style={{ fontSize: '12px', lineHeight: 1.45, color: 'var(--fg2)', textWrap: 'pretty' }}>
            {warning}
          </span>
        </div>
      ))}
    </div>
  );
}
