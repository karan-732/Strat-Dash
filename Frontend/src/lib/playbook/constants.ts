import type { PackKey, StepKind } from '@/lib/domain/types';

/** Workflow step kinds and how they read on a step row. */
export const STEP_KINDS: Record<StepKind, { c: string; l: string }> = {
  blue: { c: 'var(--ok)', l: 'DESK WORK' },
  orange: { c: 'var(--ok)', l: 'WITH CLIENT' },
  green: { c: '#D26B51', l: 'CHECKPOINT' },
  grey: { c: 'var(--fg3)', l: 'BOUNDARY' },
};

/** Deliverable status ladder; the index is the stored status. */
export const DOC_STATUS = ['NOT STARTED', 'DRAFTING', 'DRAFT READY', 'REVIEWED', 'DELIVERED'] as const;

/** Which engagement field holds each phase's output pack. */
export const PACK_KEYS: readonly PackKey[] = ['visual', 'visual1', 'visual2', 'visual3', 'visual4', 'visual5'];

/** Stages reported while a phase pack is being generated. */
export const GEN_STAGES: readonly (readonly [string, string])[] = [
  ['INTAKE', 'Working out what this phase still needs before it can run.'],
  ['READING SOURCES', 'Pulling the company site, filings and the links supplied.'],
  ['EXTRACTING EVIDENCE', 'Pulling every quotable figure out of the material, before anything is written.'],
  ['BUILDING THE PACK', 'Turning the evidence into the views this phase needs.'],
  ['BENCHMARKING PEERS', 'Setting the parameters that decide the winner, reading the peers, ranking the client.'],
  ['CHECKING THE PACK', 'Scoring it against the house rules before it is saved.'],
  ['FRAMING QUESTIONS', 'Working out what is still open, then our own next moves.'],
  ['UPDATING THE BRAIN', "Folding what this phase learned into the sprint's understanding."],
];

export const SPRINT_SCOPES = [
  {
    key: 'Department-level sprint',
    label: 'DEPARTMENT-LEVEL SPRINT',
    note: 'A whole function or department, diagnosed across the processes it owns.',
  },
  {
    key: 'Single process-level sprint',
    label: 'SINGLE PROCESS-LEVEL SPRINT',
    note: 'One process, diagnosed end to end, step by step.',
  },
] as const;

export const ACCENT = '#D26B51';
