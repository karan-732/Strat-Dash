'use client';

/*
 * Keeping your place when the INPUTS/OUTPUTS tab changes.
 *
 * Both tabs live inside one `.eng-workspace-scroll`, and only one renders at a
 * time, so the container's height collapses on every switch — measured 8,755px
 * on a generated OUTPUTS down to 1,171px on INPUTS. The browser then clamps
 * `scrollTop` to whatever still fits, and the clamped value is what you come
 * back to: scrolled to 1,500 on OUTPUTS, switching to INPUTS and back landed
 * at 374. That is the movement, and it loses your place in a thirteen-card
 * pack.
 *
 * Handled in the DOM rather than the store, like the popovers in
 * `disclosure.ts`: remembering a scroll offset should not re-render a phase
 * pack behind it.
 */

const SCROLLER = '.eng-overview-scroll,.eng-workspace-scroll';

/** Offsets by `<engagement>:<phase>:<tab>`, for this session only. */
const positions = new Map<string, number>();

const scroller = () => (typeof document === 'undefined' ? null : document.querySelector<HTMLElement>(SCROLLER));

/**
 * Save where the outgoing tab was, and put the incoming one back where it was
 * left.
 *
 * The restore waits two frames: the first is React committing the swapped
 * subtree, the second is the browser having laid it out. Setting `scrollTop`
 * any earlier writes it against the old height and gets clamped again — the
 * exact thing this exists to stop.
 */
export function rememberTabScroll(fromKey: string, toKey: string): void {
  const el = scroller();
  if (!el) return;
  positions.set(fromKey, el.scrollTop);

  const wanted = positions.get(toKey) ?? 0;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const target = scroller();
      if (target) target.scrollTop = wanted;
    });
  });
}

/**
 * Forget a tab's offset, so the next visit starts at the top.
 *
 * Used when a phase is generated: the run replaces what was on screen, and
 * returning to the middle of the previous pack would be meaningless.
 */
export function forgetTabScroll(key: string): void {
  positions.delete(key);
}
