'use client';

/**
 * A standing marker that this build runs on fixtures.
 *
 * The two seeded engagements carry realistic but invented figures. They were
 * written to demonstrate the console, not researched, and nothing in them
 * should be quoted as a finding about a real company. The badge is dismissible
 * per browser so it does not sit over a screenshot, and it lives here rather
 * than in the ported components so `bun run port` cannot remove it.
 */
import { useSyncExternalStore } from 'react';

const KEY = 'altrd-demo-badge-dismissed';

/*
 * localStorage is an external store, so it is read through
 * useSyncExternalStore rather than an effect: the server snapshot hides the
 * badge, and the client swaps in the real value on hydration without a
 * cascading render.
 */
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const isDismissed = () => {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};

function dismiss() {
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    /* storage blocked — the badge stays until the next reload */
  }
  listeners.forEach((fn) => fn());
}

export function DemoBadge() {
  const hidden = useSyncExternalStore(subscribe, isDismissed, () => true);

  if (hidden) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 14,
        right: 14,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        borderRadius: 10,
        border: '1px solid var(--ln28, rgba(0,0,0,.16))',
        background: 'var(--bg2, #fff)',
        boxShadow: '0 6px 24px rgba(0,0,0,.10)',
        fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace",
        fontSize: 9,
        letterSpacing: '.13em',
        color: 'var(--fg3, #666)',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D26B51', flex: '0 0 auto' }} />
      <span>DEMO DATA — ILLUSTRATIVE FIGURES, NOT RESEARCH</span>
      <button
        type="button"
        aria-label="Dismiss demo notice"
        onClick={dismiss}
        style={{
          border: 0,
          background: 'transparent',
          color: 'inherit',
          cursor: 'pointer',
          fontSize: 12,
          lineHeight: 1,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}
