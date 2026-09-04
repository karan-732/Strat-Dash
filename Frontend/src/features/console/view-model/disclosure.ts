'use client';

/*
 * The eye-button popovers. They are driven straight off the DOM rather than
 * React state: hovering opens one, clicking pins it, Escape or a blur closes
 * it, and opening one closes every other. Keeping it out of the store means a
 * popover never re-renders the phase pack behind it.
 */

function wrap(e: { currentTarget?: EventTarget | null } | null): HTMLElement | null {
  const el = e?.currentTarget as HTMLElement | null;
  if (!el) return null;
  return el.classList?.contains('eng-details') ? el : (el.closest?.('.eng-details') ?? null);
}

function setOpen(target: HTMLElement | null, open: boolean): void {
  if (!target) return;
  target.classList.toggle('is-open', open);
  const btn = target.querySelector?.('.eng-eye-button');
  if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function closeOthers(keep: HTMLElement | null): void {
  document.querySelectorAll<HTMLElement>('.eng-details.is-open').forEach((el) => {
    if (el === keep) return;
    delete el.dataset.pinned;
    setOpen(el, false);
  });
}

export const disclosure = {
  open(e: React.SyntheticEvent) {
    const target = wrap(e);
    closeOthers(target);
    setOpen(target, true);
  },
  leave(e: React.SyntheticEvent) {
    const target = wrap(e);
    if (target && target.dataset.pinned !== 'true') setOpen(target, false);
  },
  blur(e: React.FocusEvent) {
    const target = wrap(e);
    if (!target || target.dataset.pinned === 'true') return;
    if (e.relatedTarget && target.contains?.(e.relatedTarget as Node)) return;
    setOpen(target, false);
  },
  toggle(e: React.SyntheticEvent) {
    e.preventDefault?.();
    e.stopPropagation?.();
    const target = wrap(e);
    if (!target) return;
    const pin = target.dataset.pinned !== 'true';
    closeOthers(target);
    if (pin) {
      target.dataset.pinned = 'true';
      setOpen(target, true);
    } else {
      delete target.dataset.pinned;
      setOpen(target, false);
    }
  },
  close(e: React.KeyboardEvent) {
    if (!e || e.key !== 'Escape') return;
    e.preventDefault?.();
    e.stopPropagation?.();
    const target = wrap(e);
    if (target) {
      delete target.dataset.pinned;
      setOpen(target, false);
    }
  },
};

/** Send the engagement scroller back to the top, then move focus. */
export function resetEngagementScroll(focusSelector?: string): void {
  setTimeout(() => {
    const el = document.querySelector<HTMLElement>('.eng-overview-scroll,.eng-workspace-scroll');
    if (el) el.scrollTop = 0;
    const focusTarget = focusSelector ? document.querySelector<HTMLElement>(focusSelector) : null;
    focusTarget?.focus?.();
  }, 0);
}
