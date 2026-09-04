/**
 * What a toast is, and how long it stays.
 *
 * The console has three things to say and the source template said all of them
 * in the same coral box: a save that worked, a thing the consultant has to go
 * and do, and a phase that failed. Telling them apart at a glance is the whole
 * point of the kind.
 */
export type ToastKind = 'done' | 'note' | 'error';

export interface ToastMessage {
  id: number;
  body: string;
  kind: ToastKind;
  /** ms to live once nothing is hovering the stack; 0 means until dismissed. */
  ttl: number;
}

/*
 * Messages are raised from about thirty call sites, most of them written before
 * there was a kind to pass. Rather than touch every one, the kind is read off
 * the wording, which is consistent enough to classify: failures start by saying
 * they could not do something, and prompts state what is missing.
 */
const ERROR = [
  /^could not\b/i,
  /^not saved\b/i,
  /\bfailed\b/i,
];

/*
 * Checked before ERROR. A message that opens like a failure but names a way
 * forward is a prompt, not a fault: nothing broke, there is just something to
 * do. Without this, "Could not copy - download instead" sat on screen waiting
 * to be dismissed as though a phase had died.
 */
const NOT_REALLY_AN_ERROR = [
  /\binstead\b/i,
  /\bis not configured\b/i,
  /^nothing to read\b/i,
];

const NOTE = [
  /\bis required\b/i,
  /\bfirst\b/i,
  /^wait for\b/i,
  /^paste\b/i,
  /^type something\b/i,
  /\bnot wired to the backend\b/i,
  /\bre-attach it\b/i,
  /\bis locked\b/i,
  /\bhas to be generated\b/i,
];

/** Classify a message written without an explicit kind. */
export function inferToastKind(body: string): ToastKind {
  const text = body.trim();
  if (NOT_REALLY_AN_ERROR.some((re) => re.test(text))) return 'note';
  if (ERROR.some((re) => re.test(text))) return 'error';
  if (NOTE.some((re) => re.test(text))) return 'note';
  return 'done';
}

/**
 * How long to leave it up.
 *
 * A fixed 5.2s was too long for "Questions copied to the clipboard" and far
 * too short for a stack trace, so it scales with how much there is to read —
 * roughly 45ms a character over a 2.6s floor. Errors do not expire at all:
 * losing the reason a phase failed is worse than a toast that needs a click.
 */
export function toastTtl(body: string, kind: ToastKind): number {
  if (kind === 'error') return 0;
  return Math.min(11_000, Math.max(2_600, Math.round(body.trim().length * 45)));
}

/**
 * A toast as the view model hands it to the component: the message plus the
 * colours and mark its kind resolves to, so the component does no theming of
 * its own.
 */
export interface ToastView {
  id: number;
  body: string;
  kind: ToastKind;
  mark: string;
  bg: string;
  fg: string;
  bd: string;
  edge: string;
  markFg: string;
  hint: string;
  dismissAria: string;
  dismiss: () => void;
}
