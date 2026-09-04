'use client';

import { useState } from 'react';
import type { ToastView } from '@/lib/domain/toast';

/**
 * The toast stack.
 *
 * Replaces the source template's single coral box, which said everything in
 * the same voice, expired after a fixed 5.2 seconds whether it was two words
 * or a stack trace, could not be dismissed, and was overwritten the moment a
 * second message arrived — so a failure reported while the console refreshed
 * was often never seen at all.
 *
 * What it does instead: three kinds told apart by edge and mark, a stack of up
 * to three rather than a clobber, expiry that scales with the reading, errors
 * that wait to be dismissed, and a hover that holds the stack still while it
 * is being read.
 *
 * Registered in `scripts/dc-to-jsx.mjs` as the replacement for the template's
 * `{{#toast}}` block, so regenerating the port keeps it.
 */
export function Toast({ v }: { v: { toasts?: ToastView[] } }) {
  const toasts = v.toasts ?? [];

  /*
   * Hovering holds the stack still. The expiry timers live in the store, so
   * rather than reaching in to stop them the stack keeps the list it had when
   * the pointer arrived and goes on showing that until it leaves — a message
   * that expires under the cursor stays readable. Captured in the event
   * handler, never during render.
   */
  const [held, setHeld] = useState<ToastView[] | null>(null);
  const shown = held ?? toasts;

  if (!shown.length) return null;

  /* dismissing while held has to remove it from the held copy too */
  const dismiss = (t: ToastView) => {
    setHeld((prev) => (prev ? prev.filter((x) => x.id !== t.id) : null));
    t.dismiss();
  };

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => setHeld(toasts)}
      onMouseLeave={() => setHeld(null)}
      style={{
        position: 'fixed',
        left: '24px',
        bottom: '22px',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: 'min(520px, calc(100vw - 48px))',
      }}
    >
      {shown.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismiss(t)}
          aria-label={t.dismissAria}
          className="toast-item"
          style={{
            display: 'grid',
            gridTemplateColumns: '3px 14px minmax(0,1fr)',
            gap: '0 10px',
            alignItems: 'start',
            padding: '0 15px 0 0',
            border: '1px solid',
            borderColor: t.bd,
            background: t.bg,
            color: t.fg,
            textAlign: 'left',
            cursor: 'pointer',
            boxShadow: '0 1px 2px var(--sh50),0 18px 34px -22px var(--sh90)',
            font: 'inherit',
          }}
        >
          {/* the kind, as a colour, readable before the words are */}
          <span aria-hidden="true" style={{ alignSelf: 'stretch', background: t.edge }} />
          <span
            aria-hidden="true"
            style={{
              marginTop: '12px',
              fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace",
              fontSize: '11px',
              fontWeight: 700,
              lineHeight: 1,
              color: t.markFg,
              textAlign: 'center',
            }}
          >
            {t.mark}
          </span>
          <span style={{ padding: '11px 0 12px', minWidth: 0 }}>
            <span
              style={{
                display: 'block',
                fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace",
                fontSize: '11.5px',
                letterSpacing: '.03em',
                lineHeight: 1.55,
                textWrap: 'pretty',
                overflowWrap: 'anywhere',
              }}
            >
              {t.body}
            </span>
            {t.hint ? (
              <span
                style={{
                  display: 'block',
                  marginTop: '6px',
                  fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace",
                  fontSize: '8.5px',
                  letterSpacing: '.14em',
                  opacity: 0.72,
                }}
              >
                {t.hint}
              </span>
            ) : null}
          </span>
        </button>
      ))}
    </div>
  );
}
