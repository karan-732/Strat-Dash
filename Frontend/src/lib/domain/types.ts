/** Domain model for the Strategy Sprint console. */

/* ----------------------------------------------------------- the playbook */

export type StepKind = 'blue' | 'orange' | 'green' | 'grey';

/** One workflow step: the kind of work it is, and what it is. */
export type PhaseStep = readonly [StepKind, string];

export interface DeliverableDefinition {
  /** 1-based number inside its phase — part of the `phase.doc` document key. */
  n: number;
  name: string;
  desc: string;
  sections: string[];
}

export interface PhaseDefinition {
  /** Display number, '0' … '5'. The array index is the phase index. */
  num: string;
  title: string;
  subtitle: string;
  intro: string;
  note: string;
  /** The room this phase needs, from the playbook's "Who participates". */
  participants: string[];
  inputs: string[];
  steps: PhaseStep[];
  docs: DeliverableDefinition[];
}

/* -------------------------------------------------------- engagement state */

export type SprintScope = 'Department-level sprint' | 'Single process-level sprint';

/** 0 = not started … 4 = delivered; indexes into `DOC_STATUS`. */
export type DocStatus = 0 | 1 | 2 | 3 | 4;

export interface DocumentRecord {
  /** status index */
  s: DocStatus;
  draft: string;
}

export interface RoomFile {
  id: string;
  name: string;
  size: number;
  /** phase index the file was dropped into */
  phase: number;
  /** input row it was attached to, or -1 for the general data room */
  input: number;
  /** extracted text for parseable uploads (transcripts, csv, md …) */
  txt?: string;
}

export interface SourceLink {
  id: string;
  url: string;
}

export interface ResearchBrief {
  id: string;
  q: string;
  md: string;
  when: string;
  srcs: { u: string; ok: boolean }[];
  /** false excludes the brief from generation context */
  use?: boolean;
}

export interface ClientQuestion {
  /**
   * The row's own id, where the question has one. Needed because a question is
   * answerable one at a time from the next phase's inputs, which writes
   * straight to that row rather than asking a model to work out which question
   * was meant. Absent on synthetic questions — the ones derived from the
   * intake gate's needs have no row behind them.
   */
  id?: string;
  q: string;
  why: string;
  who: string;
  priority: string;
  /**
   * Which of the four conditions produced it — `benchmarked`, `assumption`,
   * `no-owner` or `next-phase-input`. The agent only asks where one of them
   * holds, so this is the answer to "why am I being asked this", and it is
   * what tells the consultant whether a question is worth the client's time.
   */
  condition?: string;
  /**
   * What the material said when it only half answered. The question stays
   * open — the consultant still needs the rest — but blank is the wrong way to
   * show it: they go back with what is missing, not with the whole question.
   */
  gotSoFar?: string;
  stillMissing?: string;

  /** What closed it, once something has. */
  answer?: string;
  /** The client's own words behind that answer, when a transcript supplied it. */
  quote?: string;
  /** `consultant` when typed in by hand, otherwise the id of the material. */
  answerSource?: string;
  answeredAt?: string;
}

export interface CoveredQuestion {
  q: string;
  source: string;
}

/** "What we do next" — Altrd's own move into the following phase. */
export interface NextMove {
  act: string;
  why: string;
  owner: string;
  when: string;
}

export interface PhaseQuestions {
  items: ClientQuestion[];
  covered: CoveredQuestion[];
  sug: NextMove[];
  /**
   * Every question the phase put to the client, answered or not, in the order
   * it asked them. `items` and `covered` split the same rows by state, which
   * suits the OUTPUTS tab — the list you send the client, and a note of what
   * was already covered. The next phase's INPUTS needs them whole and in
   * order, each carrying its own answer, so it can show one box per question.
   *
   * Optional: the demo fixtures and the legacy client-side pipeline build a
   * `PhaseQuestions` without it, and the inputs surface falls back to `items`
   * — which is the same rows minus the answered ones.
   */
  all?: ClientQuestion[];
  ts: string;
}

/** Generated phase output packs are model JSON; each phase has its own shape. */
export type PhasePack = Record<string, unknown>;

export interface Engagement {
  id: string;
  name: string;
  sector: string;
  url: string;
  notes: string;
  scope: SprintScope;
  /** ISO date, yyyy-mm-dd */
  created: string;

  /** `${phaseIndex}:${inputIndex}` -> true (received) | 'na' (not available) */
  inputs: Record<string, true | 'na'>;
  /** `${phaseIndex}:${stepIndex}` -> true */
  steps: Record<string, true>;
  /** `${phaseIndex}:${participantIndex}` -> true, who was actually in the room */
  attended: Record<string, true>;
  /** `${phaseIndex}.${docNumber}` -> record */
  docs: Record<string, DocumentRecord>;
  /** phaseIndex -> package built */
  built: Record<number, boolean>;
  /** phaseIndex -> consultant's manual notes */
  manual: Record<number, string>;
  /** phaseIndex -> client questions + next moves */
  cq: Record<number, PhaseQuestions>;

  files: RoomFile[];
  links: SourceLink[];
  research: ResearchBrief[];

  /** Output packs, one per phase, keyed by the legacy pack field names. */
  visual?: PhasePack | null;
  visual1?: PhasePack | null;
  visual2?: PhasePack | null;
  visual3?: PhasePack | null;
  visual4?: PhasePack | null;
  visual5?: PhasePack | null;
}

/** The pack field that belongs to each phase index. */
export type PackKey = 'visual' | 'visual1' | 'visual2' | 'visual3' | 'visual4' | 'visual5';
