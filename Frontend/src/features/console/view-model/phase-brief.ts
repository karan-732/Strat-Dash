/*
 * What each phase asks, what it produces, and what it is allowed to know.
 *
 * Two things live here. The `action` and `output` names are what the console
 * calls a phase's work: the source console said "generate the pack", which is
 * prototype vocabulary — a consultant runs a diagnosis or builds a view, they
 * do not generate packs. So the button names the thing you get.
 *
 * The `question` and `derivation` are the chain made visible: a phase asks
 * what it asks because of what the phase before it produced. They are shown
 * from Phase 1 on and deliberately not on Phase 0, which has nothing handed to
 * it — leading a brand-new engagement with a rhetorical question and a note
 * that there is no prior call is three paragraphs of our own philosophy before
 * the consultant can paste a URL.
 *
 * Kept short on purpose. This copy sits above the work, so every extra clause
 * is read before anything can be done.
 */

export interface PhaseBrief {
  /** The button: what pressing it does, in the phase's own terms. */
  action: string;
  /** The thing produced, for "the outside-in view is built". */
  output: string;
  /** The one question the phase exists to answer. Empty on Phase 0. */
  question: string;
  /** What in the previous phase produced that question. One clause. */
  derivation: string;
  /** What the phase is allowed to know. */
  bounds: string;
}

export const PHASE_BRIEF: readonly PhaseBrief[] = [
  {
    action: 'BUILD THE OUTSIDE-IN VIEW',
    output: 'the outside-in view',
    question: '',
    derivation: '',
    bounds: 'Desk research only',
  },
  {
    action: 'BUILD THE LEADERSHIP VIEW',
    output: 'the leadership view',
    question:
      'Does leadership recognise the picture the outside-in view produced — and which of its hypotheses do they kill?',
    derivation: 'Phase 0 produced hypotheses built from outside the building, not facts.',
    bounds: 'What leadership believes',
  },
  {
    action: 'RUN THE VALUE DIAGNOSIS',
    output: 'the value diagnosis',
    question:
      'Inside the function leadership named, what actually goes wrong — and what does each of those things cost?',
    derivation: 'Leadership confirmed the area but could not describe its contents.',
    bounds: 'What the department states',
  },
  {
    action: 'RUN THE PROCESS FORENSICS',
    output: 'the process forensics',
    question:
      'Trace one unit of work end to end: where does the time go, and at which step is the truth lost?',
    derivation: 'The problems were stated from memory, and nobody described the sequence.',
    bounds: 'Observed, not stated',
  },
  {
    action: 'DESIGN THE FUTURE STATE',
    output: 'the future-state design',
    question: 'What can a system watch, what may it decide on its own, and who does it tell?',
    derivation: 'The trace found a signal that exists earlier than anyone uses it.',
    bounds: 'What the systems permit',
  },
  {
    action: 'BUILD THE BUSINESS CASE',
    output: 'the business case',
    question: 'What is this worth, what does it cost, and what has to be true for the benefit to land?',
    derivation: 'The design is buildable, with three dependencies named.',
    bounds: 'What the money supports',
  },
];

export const phaseBrief = (phase: number): PhaseBrief => PHASE_BRIEF[phase] ?? PHASE_BRIEF[0];
