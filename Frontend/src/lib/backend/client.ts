/**
 * The Python backend.
 *
 * Everything that needs judgement — the phase agents, the sprint brain, the
 * evidence ledger — lives server-side. The console reads and writes through
 * here and holds no generation logic of its own.
 */

import type {
  GenerationProvider,
  GenerationProviderCatalog,
} from '@/lib/domain/generation-provider';

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export class BackendError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE}/api${path}`, {
      ...init,
      headers: { ...(init?.body instanceof FormData ? {} : { 'content-type': 'application/json' }), ...init?.headers },
    });
  } catch {
    throw new BackendError(`the backend is not reachable at ${BASE} — is it running?`, 0);
  }
  const text = await response.text();
  const body = text ? safeParse(text) : null;
  if (!response.ok) {
    throw new BackendError(
      (body as { detail?: string } | null)?.detail || `request failed (${response.status})`,
      response.status,
    );
  }
  return body as T;
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return { detail: text.slice(0, 300) };
  }
}

/* --------------------------------------------------------------- read side */

export const getPlaybook = () => call<{ phases: unknown[]; docStatus: string[] }>('/playbook');

export const listEngagements = () => call<BackendEngagementRow[]>('/engagements');

export const getEngagement = (id: string) => call<BackendEngagement>(`/engagements/${id}`);

export const getCredits = () => call<Credits>('/credits');

export const getProviders = () => call<GenerationProviderCatalog>('/providers');

export const getQuestions = (id: string, onlyOpen = false) =>
  call<BackendQuestion[]>(`/engagements/${id}/questions?only_open=${onlyOpen}`);

/* -------------------------------------------------------------- write side */

export const createEngagement = (body: {
  name: string;
  sector: string;
  url: string;
  notes: string;
  scope: string;
}) => call<BackendEngagementRow>('/engagements', { method: 'POST', body: JSON.stringify(body) });

export const patchEngagement = (id: string, fields: Record<string, string>) =>
  call<void>(`/engagements/${id}`, { method: 'PATCH', body: JSON.stringify(fields) });

/** Take an engagement off the portfolio. Archived, so the packs and the spend
 *  history behind them survive. */
export const removeEngagement = (id: string) =>
  call<void>(`/engagements/${id}`, { method: 'DELETE' });

export const setStep = (id: string, phase: number, index: number, done: boolean) =>
  call<void>(`/engagements/${id}/phases/${phase}/steps/${index}`, {
    method: 'PUT',
    body: JSON.stringify({ done }),
  });

export const setAttendance = (id: string, phase: number, index: number, present: boolean) =>
  call<void>(`/engagements/${id}/phases/${phase}/attendance/${index}`, {
    method: 'PUT',
    body: JSON.stringify({ present }),
  });

export const setDeliverable = (
  id: string,
  phase: number,
  doc: number,
  fields: { status?: number; draft?: string },
) =>
  call<void>(`/engagements/${id}/phases/${phase}/deliverables/${doc}`, {
    method: 'PUT',
    body: JSON.stringify(fields),
  });

export const removeLink = (id: string, linkId: string) =>
  call<void>(`/engagements/${id}/links/${linkId}`, { method: 'DELETE' });

export const removeFile = (id: string, fileId: string) =>
  call<void>(`/engagements/${id}/files/${fileId}`, { method: 'DELETE' });

export const setInput = (id: string, phase: number, index: number, state: 'received' | 'na' | null) =>
  call<void>(`/engagements/${id}/phases/${phase}/inputs/${index}`, {
    method: 'PUT',
    body: JSON.stringify({ state }),
  });

export const setNote = (id: string, phase: number, body: string) =>
  call<void>(`/engagements/${id}/phases/${phase}/notes`, { method: 'PUT', body: JSON.stringify({ body }) });

export const addLink = (id: string, url: string) =>
  call<void>(`/engagements/${id}/links`, { method: 'POST', body: JSON.stringify({ url }) });

export const uploadFile = (
  id: string,
  phase: number,
  file: File,
  kind = 'document',
  inputIndex = -1,
) => {
  const form = new FormData();
  form.append('file', file);
  form.append('kind', kind);
  form.append('input_index', String(inputIndex));
  return call<{ id: string; textExtracted: boolean; characters: number }>(
    `/engagements/${id}/phases/${phase}/files`,
    { method: 'POST', body: form },
  );
};

export const setSuccessMetrics = (
  id: string,
  material: string,
  provider: GenerationProvider = 'openrouter',
) =>
  call<{ brief: string; scopeRead: string; metrics: SuccessMetric[]; missing: string[] }>(
    `/engagements/${id}/success-metrics`,
    { method: 'POST', body: JSON.stringify({ material, provider }) },
  );

export const resetPack = (id: string, phase: number) =>
  call<void>(`/engagements/${id}/phases/${phase}/pack`, { method: 'DELETE' });

export const getIntake = (
  id: string,
  phase: number,
  provider: GenerationProvider = 'openrouter',
) =>
  call<Intake>(`/engagements/${id}/phases/${phase}/intake?provider=${encodeURIComponent(provider)}`);

/**
 * Answer one question by hand. No model runs — which question was meant is not
 * in doubt when the consultant typed into the box beside it. An empty string
 * reopens it.
 */
export const answerQuestion = (id: string, questionId: string, answer: string) =>
  call<{ ok: string; answered: boolean }>(`/engagements/${id}/questions/${questionId}/answer`, {
    method: 'PUT',
    body: JSON.stringify({ answer }),
  });

export const postAnswers = (
  id: string,
  material: string,
  name: string,
  phase: number,
  provider: GenerationProvider = 'openrouter',
) =>
  call<AnswerResult & { fileId: string }>(`/engagements/${id}/answers`, {
    method: 'POST',
    /* `phase` is where the material is filed, the same as an uploaded one */
    body: JSON.stringify({ material, name, phase, provider }),
  });

export const uploadAnswers = (
  id: string,
  file: File,
  phase: number,
  provider: GenerationProvider = 'openrouter',
) => {
  const form = new FormData();
  form.append('file', file);
  form.append('phase', String(phase));
  form.append('provider', provider);
  return call<AnswerResult & { fileId: string }>(`/engagements/${id}/answers/upload`, {
    method: 'POST',
    body: form,
  });
};

/**
 * Run a phase. The route streams a line of NDJSON per stage, so `onEvent` is
 * called as the run moves rather than once at the end — a phase takes minutes.
 */
export async function generatePhase(
  id: string,
  phase: number,
  onEvent: (event: PhaseEvent) => void,
  opts: { force?: boolean; provider?: GenerationProvider } = {},
): Promise<void> {
  const provider = opts.provider ?? 'openrouter';
  const response = await fetch(
    `${BASE}/api/engagements/${id}/phases/${phase}/generate?force=${opts.force ? 'true' : 'false'}&provider=${encodeURIComponent(provider)}`,
    { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' },
  );
  if (!response.ok || !response.body) {
    const detail = (safeParse(await response.text()) as { detail?: string } | null)?.detail;
    throw new BackendError(detail || `generation failed (${response.status})`, response.status);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (value) buffer += decoder.decode(value, { stream: true });
    let nl = buffer.indexOf('\n');
    while (nl >= 0) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      nl = buffer.indexOf('\n');
      if (line) onEvent(JSON.parse(line) as PhaseEvent);
    }
    if (done) break;
  }
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

export interface BackendPhaseNote {
  phase: number;
  body: string;
  updated_at: string;
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
  /** Compact current Phase 0 -> N pack chain returned by the list endpoint. */
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

export interface AnswerResult {
  answered: { id: string; answer: string; quote: string; confidence: string }[];
  partial: { id: string; gotSoFar?: string; stillMissing?: string }[];
  unprompted: { finding: string; why?: string; phase?: number }[];
  contradictions: { finding: string; contradicts?: string }[];
  stillOpen: number;
  brain: { version: number; narrative: string; confidence: number };
}

export interface ReviewFinding {
  rule: string;
  where: string;
  detail: string;
  severity?: string;
}
