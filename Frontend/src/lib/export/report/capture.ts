'use client';

import { toPng } from 'html-to-image';

export interface CapturedCard {
  /** `phase0-07A` — the `data-card` stamped on the card root. */
  id: string;
  title: string;
  /** PNG bytes, ready for the document. */
  bytes: Uint8Array;
  width: number;
  height: number;
}

/** Rendered page width of the report body, in px at 96dpi (A4 with 1in margins). */
const REPORT_WIDTH_PX = 624;

/**
 * Rasterise every output card currently on screen.
 *
 * Three things are forced for the duration of the capture and put back
 * afterwards, so the images are legible in a printed document no matter how
 * the console was being used:
 *
 *   - light theme, because a dark card on white paper reads badly;
 *   - every scroller scrolled to its origin, so nothing is captured mid-scroll;
 *   - `overflow: visible` on horizontal scrollers, so a wide table or value
 *     chain is captured whole instead of clipped to the viewport.
 */
/**
 * A sortable position for a card, from `data-card="phase2-07A"`.
 *
 * The number carries the order and the letter suffix breaks ties within it, so
 * 07 comes before 07A which comes before 08. Anything unparseable sorts last
 * rather than to the front, where it would displace a real view.
 */
function cardOrder(el: HTMLElement): number {
  const id = el.dataset.card ?? '';
  const match = /-(\d+)([A-Z]*)$/.exec(id);
  if (!match) return Number.MAX_SAFE_INTEGER;
  const suffix = match[2] ? match[2].charCodeAt(0) - 64 : 0;
  return Number(match[1]) * 100 + suffix;
}

export async function captureOutputCards(
  onProgress?: (done: number, total: number) => void,
): Promise<CapturedCard[]> {
  /*
   * Numeric order, not DOM order.
   *
   * `querySelectorAll` returns document order, and several packs do not emit
   * their cards in sequence — phase 2 renders 01, 02, 04, 03, 05, 08, 06, 07,
   * 09, 10 because two of them sit side by side in a grid. The report was
   * listing its views in that order and numbering them accordingly, so a
   * reader following the contents page found 04 before 03.
   *
   * The sort is on the number in `data-card`, with a letter suffix ordering
   * after its base: 07, 07A, 07B, 08. The zoom control the cards now carry is
   * not captured — it is a button appended after the content, and
   * `forceCaptureStyling` hides it.
   */
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-card]')).sort(
    (a, b) => cardOrder(a) - cardOrder(b),
  );
  if (!cards.length) return [];

  const restore = forceCaptureStyling();
  const out: CapturedCard[] = [];

  try {
    for (let i = 0; i < cards.length; i++) {
      const el = cards[i];
      onProgress?.(i, cards.length);
      try {
        const scale = Math.min(2, Math.max(1, REPORT_WIDTH_PX / Math.max(1, el.offsetWidth)) * 2);
        const dataUrl = await toPng(el, {
          pixelRatio: scale,
          backgroundColor: '#FFFFFF',
          cacheBust: true,
          /*
           * The webfonts come from a cross-origin stylesheet, so their rules
           * cannot be read back and inlined. Asking for them only costs a
           * failed fetch per card; the capture falls back to the system sans,
           * which is what a printed report wants anyway.
           */
          skipFonts: true,
          style: { margin: '0', boxShadow: 'none' },
        });
        const bytes = dataUrlToBytes(dataUrl);
        if (!bytes.length) continue;
        out.push({
          id: el.dataset.card || 'card-' + i,
          title: el.dataset.cardTitle || '',
          bytes,
          width: el.offsetWidth,
          height: el.offsetHeight,
        });
      } catch {
        /* one unrenderable card must not lose the whole report */
      }
    }
  } finally {
    restore();
  }

  onProgress?.(cards.length, cards.length);
  return out;
}

function forceCaptureStyling(): () => void {
  const body = document.body;
  const previousTheme = body.getAttribute('data-theme');
  body.setAttribute('data-theme', 'light');

  const scrollers = Array.from(
    document.querySelectorAll<HTMLElement>('[data-card] [style*="overflow-x"], [data-card] [style*="overflow:auto"]'),
  );
  const previous = scrollers.map((el) => ({
    el,
    overflow: el.style.overflow,
    overflowX: el.style.overflowX,
    left: el.scrollLeft,
  }));
  previous.forEach(({ el }) => {
    el.scrollLeft = 0;
    el.style.overflow = 'visible';
    el.style.overflowX = 'visible';
  });

  /*
   * The full-screen control each card carries is hidden while capturing. It is
   * already `opacity: 0` unless the card is hovered, and nothing hovers during
   * a capture, but relying on that would put a stray button in a client's
   * document the day someone changes the hover rule.
   */
  const controls = Array.from(document.querySelectorAll<HTMLElement>('.output-zoom-button'));
  const controlDisplay = controls.map((el) => el.style.display);
  controls.forEach((el) => {
    el.style.display = 'none';
  });

  /*
   * Cards carry `content-visibility: auto` so the OUTPUTS tab does not lay out
   * all seven at once. An off-screen card under that rule has no layout, and
   * html-to-image would rasterise it as an empty box — so for the duration of
   * the capture every card is forced to render whether it is in view or not.
   */
  const skipped = Array.from(document.querySelectorAll<HTMLElement>('[data-card]'));
  const skippedPrevious = skipped.map((el) => el.style.contentVisibility);
  skipped.forEach((el) => {
    el.style.contentVisibility = 'visible';
  });

  return () => {
    if (previousTheme) body.setAttribute('data-theme', previousTheme);
    else body.removeAttribute('data-theme');
    previous.forEach(({ el, overflow, overflowX, left }) => {
      el.style.overflow = overflow;
      el.style.overflowX = overflowX;
      el.scrollLeft = left;
    });
    controls.forEach((el, i) => {
      el.style.display = controlDisplay[i];
    });
    skipped.forEach((el, i) => {
      el.style.contentVisibility = skippedPrevious[i];
    });
  };
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const comma = dataUrl.indexOf(',');
  if (comma < 0) return new Uint8Array();
  const binary = atob(dataUrl.slice(comma + 1));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Fit a captured card to the report's text column, preserving aspect. */
export function fitToPage(card: CapturedCard): { width: number; height: number } {
  const ratio = card.height / Math.max(1, card.width);
  const width = Math.min(REPORT_WIDTH_PX, card.width);
  return { width: Math.round(width), height: Math.round(width * ratio) };
}
