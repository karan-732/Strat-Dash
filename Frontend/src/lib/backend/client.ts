/**
 * The demo data layer.
 *
 * This console ships as a self-contained demonstration: there is no backend,
 * no network call and no model key anywhere in the build. Everything the store
 * asks for is served from the two seeded engagements in
 * `@/features/console/fixtures`, held in memory and mirrored into
 * localStorage so edits survive a reload.
 *
 * It deliberately keeps the exact export surface the live Python client had,
 * so the store, the mappers and all 84 ported components are untouched. The
 * live client is preserved beside this file as `client.live.ts` — swapping the
 * two filenames is the whole of putting the backend back.
 */

import type {
  GenerationProvider,
  GenerationProviderCatalog,
} from '@/lib/domain/generation-provider';
import type { ClientQuestion, Engagement, PhaseQuestions } from '@/lib/domain/types';
import { PACK_KEYS, GEN_STAGES } from '@/lib/playbook/constants';
import { PHASES } from '@/lib/playbook/phases';
import { blankEngagement, engagementSlug } from '@/lib/domain/engagement';
import { seedEngagements } from '@/features/console/fixtures';

export class BackendError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/* ----------------------------------------------------------------- storage */

const STORE_KEY = 'altrd-console-demo-v3';

/** Packs as seeded, so a phase reset can be generated again. */
const SEED_PACKS = new Map<string, (unknown | null | undefined)[]>();

let engagements: Engagement[] = [];

function seed(): Engagement[] {
  const fresh = seedEngagements();
  fresh.forEach((e) => SEED_PACKS.set(e.id, PACK_KEYS.map((k) => e[k])));
  return fresh;
}

function load(): Engagement[] {
  if (engagements.length) return engagements;
  const fresh = seed();
  if (typeof window === 'undefined') {
    engagements = fresh;
    return engagements;
  }
  try {
    const saved = window.localStorage.getItem(STORE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Engagement[];
      /* Seeded packs are code, not storage — re-attach them by id so a fixture
         edit ships without everyone having to clear their browser. */
      engagements = parsed.map((p) => {
        const packs = SEED_PACKS.get(p.id);
        if (packs) PACK_KEYS.forEach((k, i) => { if (p.built[i]) p[k] = packs[i] as Engagement['visual']; });
        return p;
      });
      return engagements;
    }
  } catch {
    /* storage blocked or corrupt — fall through to the fixtures */
  }
  engagements = fresh;
  return engagements;
}

function persist(): void {
  if (typeof window === 'undefined') return;
  try {
    /* Packs are large and come from code; store everything else. */
    const slim = engagements.map((p) => {
      const copy = { ...p } as Engagement;
      PACK_KEYS.forEach((k) => delete copy[k]);
      return copy;
    });
    window.localStorage.setItem(STORE_KEY, JSON.stringify(slim));
  } catch {
    /* over quota or blocked — the session still works, it just will not persist */
  }
}

function find(id: string): Engagement {
  const found = load().find((p) => p.id === id);
  if (!found) throw new BackendError(`no engagement ${id}`, 404);
  return found;
}

/** Let the UI breathe the way a real request would, without a real request. */
const tick = (ms = 90) => new Promise<void>((r) => setTimeout(r, ms));

/* ------------------------------------------------- domain object → the row */

function questionRows(cq: Record<number, PhaseQuestions>): BackendQuestion[] {
  const rows: BackendQuestion[] = [];
  let position = 0;
  const blank = (phase: number, kind: BackendQuestion['kind']): BackendQuestion => ({
    id: `q-${phase}-${position}`,
    phase,
    kind,
    position: position++,
    body: '',
    why: '',
    who: '',
    priority: null,
    horizon: null,
    source: null,
    condition: null,
    answered_at: null,
    answer: null,
    answer_source: null,
  });

  Object.entries(cq).forEach(([key, set]) => {
    const phase = Number(key);
    (set.items ?? []).forEach((q: ClientQuestion) => {
      rows.push({
        ...blank(phase, 'open'),
        id: q.id ?? `q-${phase}-${position}`,
        body: q.q,
        why: q.why,
        who: q.who,
        priority: q.priority ?? 'Medium',
        condition: q.condition ?? null,
        partial_got: q.gotSoFar ?? null,
        partial_missing: q.stillMissing ?? null,
        answer: q.answer ?? null,
        answer_quote: q.quote ?? null,
        answer_source: q.answerSource ?? null,
        answered_at: q.answeredAt ?? null,
      });
    });
    (set.covered ?? []).forEach((c) => {
      rows.push({ ...blank(phase, 'covered'), body: c.q, source: c.source });
    });
    (set.sug ?? []).forEach((s) => {
      rows.push({ ...blank(phase, 'next_move'), body: s.act, why: s.why, who: s.owner, horizon: s.when });
    });
  });
  return rows;
}

function toRow(p: Engagement): BackendEngagement {
  const packs: Record<string, unknown> = {};
  PACK_KEYS.forEach((k, i) => {
    if (p.built[i] && p[k]) packs[String(i)] = p[k];
  });

  return {
    id: p.id,
    slug: engagementSlug(p),
    name: p.name,
    sector: p.sector,
    url: p.url,
    notes: p.notes,
    scope: p.scope,
    brief: p.notes,
    opened_on: p.created,
    completed_phases: Object.keys(packs).map(Number),
    success_metrics: [],
    inputs: Object.entries(p.inputs).map(([key, state]) => {
      const [phase, index] = key.split(':').map(Number);
      return { phase, input_index: index, state: state === 'na' ? ('na' as const) : ('received' as const) };
    }),
    steps: Object.keys(p.steps).map((key) => {
      const [phase, index] = key.split(':').map(Number);
      return { phase, step_index: index };
    }),
    attendance: Object.keys(p.attended).map((key) => {
      const [phase, index] = key.split(':').map(Number);
      return { phase, participant_index: index };
    }),
    phase_notes: Object.entries(p.manual).map(([phase, body]) => ({ phase: Number(phase), body })),
    links: p.links.map((l) => ({ id: l.id, url: l.url })),
    files: p.files.map((f) => ({
      id: f.id,
      phase: f.phase,
      input_index: f.input,
      name: f.name,
      size_bytes: f.size,
      kind: 'document',
      extracted_text: f.txt ?? null,
    })),
    deliverables: Object.entries(p.docs).map(([key, rec]) => {
      const [phase, doc] = key.split('.').map(Number);
      return { phase, doc_number: doc, status: rec.s, draft: rec.draft };
    }),
    packs,
    questions: questionRows(p.cq),
    brain: BRAINS[p.id] ?? null,
    spend: { runs: 0, cost: 0 },
  };
}

/** The running understanding each sprint reached, shown on the brain panel. */
const BRAINS: Record<string, BackendEngagement['brain']> = {
  dotandkey: {
    version: 6,
    confidence: 0.78,
    narrative:
      'Dot & Key is a strong brand sitting on a weak operating system. Every parameter it lags peers on — availability, repeat, launch speed — is a planning process, not a market position. The single largest number in the sprint is Rs 24 Cr of demand lost to dark stores that are simply empty, on a weekly manual cycle that cannot see a SKU go to zero on a Tuesday. Leadership agrees on margin and is aligned on availability; the open ground is marketing, where the Head of Growth reads incrementality work as an audit. A 2024 planning tool was abandoned in two months, so nothing here can be introduced as software.',
    understood: [],
    assumed: [],
    unknown: [
      { item: 'Whether all four platforms will grant sell-out API access', blocks: 'The build shape of the replenishment agent' },
      { item: 'Twelve-month cohort contribution, not just CAC', blocks: 'The Rs 16 Cr marketing case' },
      { item: 'Who owns the availability number after go-live', blocks: 'Accountability for the largest pool in the portfolio' },
    ],
  },
  wakefit: {
    version: 6,
    confidence: 0.74,
    narrative:
      'Wakefit owns three plants and cannot make them pay. The blended 68% utilisation was hiding the real finding: Hosur runs at 84% while Bengaluru sits at 51% on the same order book, so this is a balancing problem rather than a capacity one. The root of both the inventory and the delivery failure is a single seam — a POS that promises 18 days without ever having seen a plant schedule. Installation is the more tractable half: a quarter of first visits fail on crew skill and van stock, it needs no master data cleanup, and the customer sees it immediately. The 2023 APS module died on master data, and the Head of Manufacturing reads central planning as losing his plants.',
    understood: [],
    assumed: [],
    unknown: [
      { item: 'SAP master data quality on capacity and BOM across three plants', blocks: 'The whole Rs 34 Cr promise case' },
      { item: 'Whether crew contracts permit skill-based assignment', blocks: 'The Rs 28 Cr installation case' },
      { item: 'Whether Procurement accepts an independent index read', blocks: 'The Rs 22 Cr buying window case' },
    ],
  },
};

/* --------------------------------------------------------------- read side */

export const getPlaybook = async () => {
  await tick(40);
  return { phases: PHASES as unknown as unknown[], docStatus: [] as string[] };
};

export const listEngagements = async (): Promise<BackendEngagementRow[]> => {
  await tick(60);
  return load().map((p) => {
    const row = toRow(p);
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      sector: row.sector,
      url: row.url,
      notes: row.notes,
      scope: row.scope,
      brief: row.brief,
      opened_on: row.opened_on,
      completed_phases: row.completed_phases,
    };
  });
};

export const getEngagement = async (id: string): Promise<BackendEngagement> => {
  await tick(80);
  return toRow(find(id));
};

export const getCredits = async (): Promise<Credits> => {
  await tick(30);
  return {
    provider: 'demo',
    model: 'demo fixtures — no model is called',
    used: null,
    limit: null,
    available: null,
    consoleSpend: 0,
    runs: 0,
    failedRuns: 0,
  };
};

export const getProviders = async (): Promise<GenerationProviderCatalog> => {
  await tick(30);
  return {
    default: 'openrouter',
    providers: [
      { id: 'openrouter', label: 'Demo fixtures', model: 'seeded pack', configured: true },
    ],
  } as unknown as GenerationProviderCatalog;
};

export const getQuestions = async (id: string, onlyOpen = false): Promise<BackendQuestion[]> => {
  await tick(40);
  const rows = questionRows(find(id).cq);
  return onlyOpen ? rows.filter((q) => q.kind === 'open' && !q.answered_at) : rows;
};

export const getIntake = async (
  id: string,
  phase: number,
  _provider: GenerationProvider = 'openrouter',
): Promise<Intake> => {
  await tick(120);
  const p = find(id);
  const missing = PHASES[phase].inputs
    .map((ask, i) => ({ ask, i }))
    .filter(({ i }) => p.inputs[`${phase}:${i}`] === 'na');
  return {
    canRun: true,
    confidence: missing.length ? 0.72 : 0.9,
    verdict: missing.length
      ? `Phase ${PHASES[phase].num} can run. ${missing.length} input${missing.length > 1 ? 's were' : ' was'} not available and will be benchmarked rather than reported.`
      : `Phase ${PHASES[phase].num} has everything it needs.`,
    needs: missing.map(({ ask }) => ({
      ask,
      why: 'Named by the playbook for this phase and not supplied',
      who: 'Client',
      severity: 'needed' as const,
    })),
    willAssume: missing.map(({ ask }) => ({
      assumption: `A sector benchmark is used in place of ${ask.toLowerCase()}`,
      ifWrong: 'The figure derived from it is marked as benchmarked rather than reported',
    })),
  } as Intake;
};

/* -------------------------------------------------------------- write side */

export const createEngagement = async (body: {
  name: string;
  sector: string;
  url: string;
  notes: string;
  scope: string;
}): Promise<BackendEngagementRow> => {
  await tick(120);
  const created = blankEngagement({
    name: body.name,
    sector: body.sector,
    url: body.url,
    notes: body.notes,
    scope: body.scope as Engagement['scope'],
  });
  engagements = [...load(), created];
  persist();
  const row = toRow(created);
  return {
    id: row.id, slug: row.slug, name: row.name, sector: row.sector, url: row.url,
    notes: row.notes, scope: row.scope, brief: row.brief, opened_on: row.opened_on,
    completed_phases: [],
  };
};

const mutate = async (id: string, fn: (p: Engagement) => void): Promise<void> => {
  await tick(40);
  fn(find(id));
  persist();
};

export const patchEngagement = (id: string, fields: Record<string, string>) =>
  mutate(id, (p) => Object.assign(p, fields));

export const removeEngagement = (id: string) =>
  mutate(id, () => {
    engagements = load().filter((p) => p.id !== id);
  });

export const setStep = (id: string, phase: number, index: number, done: boolean) =>
  mutate(id, (p) => {
    if (done) p.steps[`${phase}:${index}`] = true;
    else delete p.steps[`${phase}:${index}`];
  });

export const setAttendance = (id: string, phase: number, index: number, present: boolean) =>
  mutate(id, (p) => {
    if (present) p.attended[`${phase}:${index}`] = true;
    else delete p.attended[`${phase}:${index}`];
  });

export const setDeliverable = (
  id: string,
  phase: number,
  doc: number,
  fields: { status?: number; draft?: string },
) =>
  mutate(id, (p) => {
    const key = `${phase}.${doc}`;
    const current = p.docs[key] ?? { s: 0 as const, draft: '' };
    p.docs[key] = {
      s: (fields.status ?? current.s) as typeof current.s,
      draft: fields.draft ?? current.draft,
    };
  });

export const removeLink = (id: string, linkId: string) =>
  mutate(id, (p) => {
    p.links = p.links.filter((l) => l.id !== linkId);
  });

export const removeFile = (id: string, fileId: string) =>
  mutate(id, (p) => {
    p.files = p.files.filter((f) => f.id !== fileId);
  });

export const setInput = (id: string, phase: number, index: number, state: 'received' | 'na' | null) =>
  mutate(id, (p) => {
    if (state === null) delete p.inputs[`${phase}:${index}`];
    else p.inputs[`${phase}:${index}`] = state === 'na' ? 'na' : true;
  });

export const setNote = (id: string, phase: number, body: string) =>
  mutate(id, (p) => {
    p.manual[phase] = body;
  });

export const addLink = (id: string, url: string) =>
  mutate(id, (p) => {
    p.links = [...p.links, { id: `l${Date.now().toString(36)}`, url }];
  });

export const uploadFile = async (
  id: string,
  phase: number,
  file: File,
  kind = 'document',
  inputIndex = -1,
) => {
  const fileId = `f${Date.now().toString(36)}`;
  await mutate(id, (p) => {
    p.files = [...p.files, { id: fileId, name: file.name, size: file.size, phase, input: inputIndex }];
  });
  return { id: fileId, textExtracted: false, characters: 0 };
};

export const setSuccessMetrics = async (id: string, material: string) => {
  await tick(400);
  return { brief: material.slice(0, 400), scopeRead: '', metrics: [] as SuccessMetric[], missing: [] as string[] };
};

export const resetPack = (id: string, phase: number) =>
  mutate(id, (p) => {
    p.built[phase] = false;
    p[PACK_KEYS[phase]] = null;
  });

export const answerQuestion = async (id: string, questionId: string, answer: string) => {
  await mutate(id, (p) => {
    Object.values(p.cq).forEach((set: PhaseQuestions) => {
      (set.items ?? []).forEach((q) => {
        if (q.id !== questionId) return;
        q.answer = answer || undefined;
        q.answerSource = answer ? 'consultant' : undefined;
        q.answeredAt = answer ? new Date().toISOString() : undefined;
      });
    });
  });
  return { ok: 'saved', answered: Boolean(answer) };
};

const noAnswers = (): AnswerResult => ({
  answered: [],
  partial: [],
  unprompted: [],
  contradictions: [],
  stillOpen: 0,
  brain: { version: 6, narrative: '', confidence: 0.78 },
});

export const postAnswers = async (
  id: string,
  material: string,
  name: string,
  phase: number,
  _provider: GenerationProvider = 'openrouter',
) => {
  const fileId = `f${Date.now().toString(36)}`;
  await mutate(id, (p) => {
    p.files = [...p.files, { id: fileId, name: name || 'pasted material', size: material.length, phase, input: -1, txt: material }];
  });
  return { ...noAnswers(), fileId };
};

export const uploadAnswers = async (
  id: string,
  file: File,
  phase: number,
  _provider: GenerationProvider = 'openrouter',
) => {
  const fileId = `f${Date.now().toString(36)}`;
  await mutate(id, (p) => {
    p.files = [...p.files, { id: fileId, name: file.name, size: file.size, phase, input: -1 }];
  });
  return { ...noAnswers(), fileId };
};

/**
 * Replay a phase run.
 *
 * No model is called. The stages, their timing and the events are the same
 * ones the live pipeline emitted, so the generation ladder behaves exactly as
 * it did — what lands at the end is the seeded pack rather than a fresh one.
 */
export async function generatePhase(
  id: string,
  phase: number,
  onEvent: (event: PhaseEvent) => void,
  _opts: { force?: boolean; provider?: GenerationProvider } = {},
): Promise<void> {
  const started = Date.now();
  const p = find(id);
  const pack = (SEED_PACKS.get(id)?.[phase] ?? p[PACK_KEYS[phase]]) as Record<string, unknown> | null;

  if (!pack) {
    onEvent({ type: 'error', message: 'this phase has no seeded pack in the demo build' });
    return;
  }

  for (let stage = 0; stage < GEN_STAGES.length; stage++) {
    const [label, detail] = GEN_STAGES[stage];
    onEvent({ type: 'stage', stage, label, detail });
    await tick(stage === 3 ? 900 : 420);
    if (stage === 2) onEvent({ type: 'evidence', reported: 34, derived: 11, absent: 3 });
    if (stage === 5) {
      onEvent({
        type: 'review',
        score: 92,
        verdict: 'Passes. Every derived figure carries its basis and nothing is presented as reported that was not.',
        findings: [],
      });
    }
  }

  p.built[phase] = true;
  p[PACK_KEYS[phase]] = pack as Engagement['visual'];
  persist();

  const set = p.cq[phase] ?? { items: [], covered: [], sug: [], ts: '' };
  onEvent({
    type: 'done',
    packId: `${id}-${phase}`,
    pack,
    questions: set.items ?? [],
    covered: set.covered ?? [],
    nextMoves: set.sug ?? [],
    brain: {
      version: 6,
      narrative: BRAINS[id]?.narrative ?? '',
      confidence: BRAINS[id]?.confidence ?? 0.78,
      unknown: BRAINS[id]?.unknown ?? [],
    },
    sourcesRead: p.links.map((l) => l.url),
    durationMs: Date.now() - started,
    evidence: { reported: 34, derived: 11, absent: [] },
    review: { score: 92, verdict: 'Passes.', findings: [] },
  });
}

/* ------------------------------------------------------------------- types */

export interface Credits {
  provider: string;
  model: string;
  used: number | null;
  limit: number | null;
  available: number | null;
  consoleSpend: number;
  runs: number;
  failedRuns: number;
}

export interface SuccessMetric {
  metric: string;
  baseline?: string | null;
  target?: string | null;
  horizon?: string | null;
  is_primary?: number;
  isPrimary?: boolean;
  source?: string;
  derived?: number | boolean;
}

export interface IntakeNeed {
  ask: string;
  why: string;
  who: string;
  severity: 'blocking' | 'needed' | 'nice';
  haveAlready?: boolean;
  whereFrom?: string;
}

export interface Intake {
  canRun: boolean;
  confidence: number;
  verdict: string;
  needs: IntakeNeed[];
  willAssume: { assumption: string; ifWrong: string }[];
}

export interface ReviewFinding {
  rule: string;
  where: string;
  detail: string;
  severity?: string;
}

export interface AnswerResult {
  answered: { id: string; answer: string; quote: string; confidence: string }[];
  partial: { id: string; gotSoFar?: string; stillMissing?: string }[];
  unprompted: { finding: string; why?: string; phase?: number }[];
  contradictions: { finding: string; contradicts?: string }[];
  stillOpen: number;
  brain: { version: number; narrative: string; confidence: number };
}

export type PhaseEvent =
  | { type: 'stage'; stage: number; label: string; detail: string }
  | { type: 'intake'; needs: IntakeNeed[]; willAssume: unknown[]; verdict: string }
  | { type: 'blocked'; verdict: string; needs: IntakeNeed[]; willAssume: unknown[] }
  | { type: 'evidence'; reported: number; derived: number; absent: number }
  | { type: 'warning'; message: string }
  | { type: 'review'; score: number; verdict: string; findings: ReviewFinding[] }
  | { type: 'error'; message: string }
  | {
      type: 'done';
      packId: string;
      pack: Record<string, unknown>;
      questions: unknown[];
      covered: unknown[];
      nextMoves: unknown[];
      brain: { version: number; narrative: string; confidence: number; unknown: unknown[] };
      sourcesRead: string[];
      durationMs: number;
      evidence: { reported: number; derived: number; absent: unknown[] };
      review: { score: number; verdict: string; findings: ReviewFinding[] };
    };

export interface BackendPhaseNote {
  phase: number;
  body: string;
}

export interface BackendQuestion {
  id: string;
  phase: number;
  kind: 'open' | 'covered' | 'next_move';
  position: number;
  body: string;
  why: string;
  who: string;
  priority: string | null;
  horizon: string | null;
  source: string | null;
  condition: string | null;
  answer_quote?: string | null;
  partial_got?: string | null;
  partial_missing?: string | null;
  partial_at?: string | null;
  answered_at: string | null;
  answer: string | null;
  answer_source: string | null;
}

export interface BackendEngagementRow {
  id: string;
  slug: string;
  name: string;
  sector: string;
  url: string;
  notes: string;
  scope: string;
  brief: string;
  opened_on: string;
  completed_phases?: number[];
}

export interface BackendEngagement extends BackendEngagementRow {
  success_metrics: SuccessMetric[];
  inputs: { phase: number; input_index: number; state: 'received' | 'na' }[];
  steps: { phase: number; step_index: number }[];
  attendance: { phase: number; participant_index: number }[];
  phase_notes?: BackendPhaseNote[];
  links: { id: string; url: string }[];
  files: {
    id: string;
    phase: number;
    input_index: number;
    name: string;
    size_bytes: number;
    kind: string;
    extracted_text: string | null;
  }[];
  deliverables: { phase: number; doc_number: number; status: number; draft: string }[];
  packs: Record<string, unknown>;
  questions: BackendQuestion[];
  brain: {
    version: number;
    narrative: string;
    confidence: number;
    understood: unknown[];
    assumed: unknown[];
    unknown: unknown[];
  } | null;
  spend: { runs: number; cost: number };
}

/** Kept so the store's provider selector still compiles; the demo has one. */
export type { GenerationProvider };
