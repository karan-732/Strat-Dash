'use client';

import { useEffect } from 'react';

/**
 * Opening one output full screen.
 *
 * A pack is thirteen charts and tables in a column, several of them scatter
 * plots with a dozen labelled points, and at column width the dense ones are
 * legible rather than readable. This gives every one of them a control that
 * takes it to the whole viewport.
 *
 * Done in the DOM rather than in React, for one reason: the card must stay the
 * same element. There are fifty-seven card components, all generated per
 * phase, and the alternatives are worse — a registry of all of them, or a
 * cloned copy in a dialog, which would render the chart dead. Its points would
 * no longer respond, which is the only reason to want it bigger. Promoting the
 * live element keeps every handler it already has.
 *
 * A spacer of the same height takes the card's place while it is promoted, so
 * the pack behind it does not collapse and reflow — otherwise closing the
 * dialog would land you somewhere else in a long scroll.
 *
 * `[data-card]` and `[data-card-title]` are stamped by
 * `scripts/dc-to-jsx.mjs`, the same attributes the report capture uses to find
 * and caption each view, so nothing here changes what the `.docx` sees. Only
 * one phase's pack renders at a time (`showVisualN: pi === n`), so the id is
 * unique on the page.
 */

const CARD = '[data-card]';
const ZOOM_CLASS = 'is-zoomed';
const BUTTON_CLASS = 'output-zoom-button';
const SPACER_CLASS = 'output-zoom-spacer';

/** The card currently promoted, and what to put back when it closes. */
let open: {
  card: HTMLElement;
  spacer: HTMLElement;
  opener: HTMLElement | null;
  scroller: HTMLElement | null;
  scrollTop: number;
} | null = null;

const scrollerOf = (el: HTMLElement) =>
  el.closest<HTMLElement>('.eng-workspace-scroll,.eng-overview-scroll');

/*
 * The scatter labels are placed by measuring real geometry after paint
 * (`use-plot-labels`), and promoting a card changes that geometry completely -
 * a card that was one column wide becomes the viewport, so five quadrants go
 * from stacked to three across. The hook already re-runs on resize, and a
 * DOM-only promotion is not a resize, so tell it.
 */
function relayoutPlots(): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  });
}

function close(): void {
  if (!open) return;
  const { card, spacer, opener, scroller, scrollTop } = open;
  open = null;

  card.classList.remove(ZOOM_CLASS);
  card.removeAttribute('role');
  card.removeAttribute('aria-modal');
  card.removeAttribute('aria-label');
  card.removeAttribute('tabindex');
  spacer.remove();
  delete document.body.dataset.zoom;

  /*
   * Put the reader back exactly where they were. Returning focus to the
   * control is right - it is where their attention was - but focusing an
   * element inside a scroller makes the browser scroll it into view, which
   * moved a reader 1,700px up a thirteen-card pack. `preventScroll` stops
   * that, and the offset is restored anyway in case the promotion itself
   * nudged it.
   */
  opener?.focus?.({ preventScroll: true });
  if (scroller) scroller.scrollTop = scrollTop;
  relayoutPlots();
}

function zoom(card: HTMLElement, opener: HTMLElement): void {
  if (open) close();

  /*
   * Hold the card's place. `position: fixed` takes it out of flow, and without
   * a stand-in of the same height the column shortens by that much and every
   * card below it jumps up.
   */
  const scroller = scrollerOf(card);
  const scrollTop = scroller ? scroller.scrollTop : 0;

  const rect = card.getBoundingClientRect();
  const spacer = document.createElement('div');
  spacer.className = SPACER_CLASS;
  spacer.style.height = `${Math.round(rect.height)}px`;
  card.parentNode?.insertBefore(spacer, card);

  card.classList.add(ZOOM_CLASS);
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-modal', 'true');
  card.setAttribute('aria-label', card.dataset.cardTitle || 'Output');
  card.setAttribute('tabindex', '-1');
  document.body.dataset.zoom = card.dataset.card || 'on';
  card.scrollTop = 0;
  card.focus?.({ preventScroll: true });

  open = { card, spacer, opener, scroller, scrollTop };
  relayoutPlots();
}

/** Give every card a control, once. */
function attach(): void {
  document.querySelectorAll<HTMLElement>(CARD).forEach((card) => {
    if (card.querySelector(`:scope > .${BUTTON_CLASS}`)) return;

    const title = card.dataset.cardTitle || 'this output';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = BUTTON_CLASS;
    button.setAttribute('aria-label', `Open ${title} full screen`);
    button.title = 'Open full screen';
    /* an expand glyph, and a close cross once this card is the one promoted */
    button.innerHTML = '<span aria-hidden="true"></span>';
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      if (open?.card === card) close();
      else zoom(card, button);
    });
    card.appendChild(button);
  });
}

export function useOutputZoom(): void {
  useEffect(() => {
    /* after paint, so the cards for the phase on screen exist */
    let raf = requestAnimationFrame(attach);

    /* cards come and go with the tab, the phase and a finished generation */
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        /* a promoted card that has been unmounted must not leave a scrim */
        if (open && !document.body.contains(open.card)) {
          open.spacer.remove();
          delete document.body.dataset.zoom;
          open = null;
        }
        attach();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener('keydown', onKey);
      close();
    };
  }, []);
}
