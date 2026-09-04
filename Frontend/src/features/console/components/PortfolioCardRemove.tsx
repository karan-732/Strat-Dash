'use client';

/**
 * Removing an engagement from the portfolio.
 *
 * Two presses, not a dialog. The card is itself a button that opens the
 * sprint, so a native `confirm()` would block the page and a modal is more
 * furniture than a tidy-up deserves: the first press arms the card and turns
 * it into a question, the second does it. Every handler stops the event, or
 * the click reaches the card and navigates away mid-decision.
 *
 * The engagement is archived rather than deleted. A generated sprint holds
 * packs that cost real money and the run history the spend figures come from,
 * so nothing is destroyed — the row simply stops being listed.
 */
export function PortfolioCardRemove({
  card,
}: {
  card: {
    name: string;
    removeArmed: boolean;
    removeBusy: boolean;
    removeAria: string;
    removeLabel: string;
    arm: (e?: { stopPropagation?: () => void }) => void;
    cancelRemove: (e?: { stopPropagation?: () => void }) => void;
    confirmRemove: (e?: { stopPropagation?: () => void }) => void;
  };
}) {
  const mono = "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace";

  if (card.removeArmed) {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          marginTop: '10px',
          paddingTop: '10px',
          borderTop: '1px solid var(--ln12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '.12em', color: 'var(--fg3)' }}>
          REMOVE FROM THE PORTFOLIO?
        </span>
        <span style={{ display: 'inline-flex', gap: '6px' }}>
          <button
            type="button"
            onClick={card.cancelRemove}
            disabled={card.removeBusy}
            style={{
              padding: '5px 10px',
              border: '1px solid var(--ln26)',
              background: 'transparent',
              color: 'var(--fg2)',
              fontFamily: mono,
              fontSize: '9px',
              letterSpacing: '.12em',
              cursor: 'pointer',
            }}
          >
            KEEP
          </button>
          <button
            type="button"
            onClick={card.confirmRemove}
            disabled={card.removeBusy}
            aria-label={card.removeAria}
            style={{
              padding: '5px 10px',
              border: '1px solid #D26B51',
              background: '#D26B51',
              color: '#FFFFFF',
              fontFamily: mono,
              fontSize: '9px',
              letterSpacing: '.12em',
              fontWeight: 700,
              cursor: card.removeBusy ? 'progress' : 'pointer',
            }}
          >
            {card.removeLabel}
          </button>
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={card.arm}
      aria-label={card.removeAria}
      className="portfolio-card-remove"
      title={card.removeAria}
      /*
       * Floated on the corner rather than tucked inside it: the card's own
       * header already puts the completion percentage top-right, and an inset
       * control landed on top of it.
       */
      style={{
        position: 'absolute',
        top: '-9px',
        right: '-9px',
        width: '22px',
        height: '22px',
        display: 'grid',
        placeItems: 'center',
        border: '1px solid var(--ln26)',
        borderRadius: '999px',
        background: 'var(--card)',
        color: 'var(--fg3)',
        fontFamily: mono,
        fontSize: '10px',
        lineHeight: 1,
        cursor: 'pointer',
        boxShadow: '0 2px 6px -2px var(--sh50)',
      }}
    >
      ✕
    </button>
  );
}
