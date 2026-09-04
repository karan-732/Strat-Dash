'use client';

/**
 * DOWNLOAD FULL REPORT, at the foot of the outputs.
 *
 * The template puts this button above the pack, which offers the report before
 * the reader has met anything that goes in it — and offered it even when
 * nothing had been generated at all. Here it is the last thing on the page,
 * after the cards, the questions and the next moves: you read the phase, then
 * you take it away.
 *
 * `.eng-output-action` is the template's own action-row class
 * (`src/styles/output.css`), which had been left orphaned — the button
 * re-implemented it with inline styles instead.
 */
export function ReportAction({
  v,
}: {
  v: { canDownloadReport?: boolean; reportLabel?: string; downloadFullReport?: () => void };
}) {
  if (!v.canDownloadReport) return null;

  return (
    <div className="eng-output-action">
      <button
        type="button"
        className="eng-primary"
        onClick={v.downloadFullReport}
        style={{ minWidth: '230px' }}
      >
        {v.reportLabel}
      </button>
    </div>
  );
}
