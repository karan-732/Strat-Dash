'use client';

import { create } from 'zustand';
import { PHASES } from '@/lib/playbook/phases';
import { PACK_KEYS } from '@/lib/playbook/constants';
import { lockNote, phaseUnlocked } from '@/lib/domain/progress';
import { inferToastKind, toastTtl, type ToastKind, type ToastMessage } from '@/lib/domain/toast';
import type { DocStatus, Engagement, SprintScope } from '@/lib/domain/types';
import {
  DEFAULT_GENERATION_PROVIDER,
  generationProviderLabel,
  isGenerationProvider,
  type GenerationProvider,
  type GenerationProviderCatalog,
} from '@/lib/domain/generation-provider';
import type { LibraryEntry } from '@/lib/library/types';
import { captureFromPhase } from '@/lib/library/capture';
import * as backend from '@/lib/backend/client';
import type { Credits, Intake, PhaseEvent, ReviewFinding } from '@/lib/backend/client';
import { toEngagement } from '@/lib/backend/mappers';

export type ConsoleView = 'dashboard' | 'project' | 'attention';
export type PhaseTab = 'inputs' | 'docs';

export interface NewEngagementForm {
  name: string;
  sector: string;
  url: string;
  notes: string;
  scope: SprintScope;
}

/** What a phase run is doing right now, for the generation ladder. */
export interface RunState {
  phase: number;
  stage: number;
  label: string;
  detail: string;
  warnings: string[];
  evidence?: { reported: number; derived: number; absent: number };
  review?: { score: number; verdict: string; findings: ReviewFinding[] };
  blocked?: Intake;
  /**
   * The pages actually read live, as the run reports them. The stream has
   * always carried this and the `done` handler dropped it, so a run that read
   * six sources looked identical to one that read none.
   */
  sources?: string[];
}

export interface ConsoleState {
  /* server state, held locally for the view model to render from */
  projects: Engagement[];
  cur: string;
  phase: number;
  loading: boolean;
  loadError: string;
  /*
   * Which engagements have been fetched in full, and whether a fetch is in
   * flight.
   *
   * The portfolio loads as shells — name, sector, which phases are complete —
   * and the open engagement is then fetched whole. Without this the two are
   * indistinguishable, so a shell rendered as a finished read: a phase whose
   * questions had simply not arrived yet said the phase before it "raised
   * nothing that needs the client", which is a statement, not a wait.
   */
  hydrated: Record<string, boolean>;
  hydrating: Record<string, boolean>;
  credits: Credits | null;
  brain: { version: number; narrative: string; confidence: number; unknown: unknown[] } | null;
  intake: Record<number, Intake>;
  intakeBusy: Record<number, boolean>;
  run: RunState | null;
  library: LibraryEntry[];
  generationProvider: GenerationProvider;
  generationProviders: GenerationProviderCatalog | null;
  generationProvidersBusy: boolean;

  /* session-only UI */
  view: ConsoleView;
  projectHome: boolean;
  tab: PhaseTab;
  modal: boolean;
  toasts: ToastMessage[];
  form: NewEngagementForm;

  busy: Record<string, boolean>;
  open: Record<string, boolean>;
  tpl: Record<string, boolean>;
  ropen: Record<string, boolean>;

  inputPanel: boolean;
  workflowPanel: boolean;
  researchPanel: boolean;

  rq: string;
  rurls: string;
  live: boolean;
  useRoom: boolean;
  bench: boolean;
  rbusy: boolean;

  lk: string;
  pv: string;
  md: string;
  /**
   * Per-question answer boxes on a phase's INPUTS tab, keyed by question id,
   * holding what has been typed but not yet saved.
   */
  /**
   * The pasted transcript on a phase's INPUTS tab. Separate from `md`, which
   * is the manual-notes box on the same tab — sharing one field meant typing a
   * transcript silently overwrote the note draft.
   */
  transcript: string;
  answerDrafts: Record<string, string>;
  answerSaving: Record<string, boolean>;
  /** Whether the Fathom transcript control has been opened. */
  fathomOpen: boolean;
  mdFor: string;

  packBusy: [boolean, boolean, boolean, boolean, boolean, boolean];
  genStage: number;

  reportBusy: boolean;
  reportStage: string;

  answersBusy: boolean;

  tip: string | null;
  pick: string;
  af: string;
  q: string;
  /**
   * The engagement whose remove control is armed, if any.
   *
   * Removal is two presses rather than a dialog: the first arms the card, the
   * second does it. A native confirm() would block the page, and a modal is
   * more furniture than a portfolio tidy-up deserves.
   */
  removeArmed: string | null;
  removeBusy: boolean;
  engListOpen: boolean;
}

export interface ConsoleActions {
  set: (partial: Partial<ConsoleState> | ((s: ConsoleState) => Partial<ConsoleState>)) => void;
  say: (msg: string, kind?: ToastKind) => void;
  dismissToast: (id: number) => void;
  current: () => Engagement | undefined;

  loadPortfolio: () => Promise<void>;
  refresh: (engagementId?: string) => Promise<void>;
  loadCredits: () => Promise<void>;
  loadGenerationProviders: () => Promise<void>;
  setGenerationProvider: (provider: GenerationProvider) => void;

  /** Optimistic local edit; the write-through that persists it follows. */
  patchLocal: (fn: (p: Engagement) => void) => void;

  toggleInput: (phase: number, index: number) => void;
  markInputNa: (phase: number, index: number) => void;
  toggleStep: (phase: number, index: number) => void;
  toggleAttendance: (phase: number, index: number) => void;
  saveNote: (phase: number, body: string) => void;
  setUrl: (url: string) => void;
  addLink: (url: string) => void;
  removeLink: (linkId: string) => void;
  setDocStatus: (phase: number, doc: number, status: DocStatus) => void;
  setDocDraft: (phase: number, doc: number, draft: string) => void;
  addFiles: (list: FileList | File[] | null, phase: number, inputIdx: number | null) => void;
  removeFile: (fileId: string) => void;

  /** Returns the new engagement's id so the caller can navigate to it. */
  createEngagement: () => Promise<string | null>;
  syncManualDraft: (projectId: string, pi: number) => void;

  loadIntake: (phase: number) => Promise<void>;
  generatePhase: (phase?: number, opts?: { force?: boolean }) => Promise<void>;
  resetPhaseOutputs: (phase: number) => Promise<void>;
  setAnswerDraft: (questionId: string, text: string) => void;
  cancelAnswerDraft: (questionId: string) => void;
  saveAnswer: (questionId: string) => Promise<void>;
  armRemove: (engagementId: string | null) => void;
  removeEngagement: (engagementId: string) => Promise<void>;

  submitAnswers: (material: string, name: string, phase: number) => Promise<void>;
  uploadAnswers: (file: File, phase: number) => Promise<void>;

  captureToLibrary: (phase: number) => number;
  removeFromLibrary: (id: string) => void;

  /* kept so the ported tree still compiles; not yet backend-backed */
  generateDoc: (phase: number, docNumber: number, quiet?: boolean) => Promise<void>;
  runResearch: () => Promise<void>;
  fileBlob: (id: string) => File | undefined;
}

export type ConsoleStore = ConsoleState & ConsoleActions;

/** Uploaded File handles, so the download button works within a session. */
const blobs = new Map<string, File>();

const emptyForm = (): NewEngagementForm => ({
  name: '',
  sector: '',
  url: '',
  notes: '',
  scope: 'Department-level sprint',
});

const initial = (): ConsoleState => ({
  projects: [],
  cur: '',
  phase: 0,
  loading: true,
  loadError: '',
  hydrated: {},
  hydrating: {},
  credits: null,
  brain: null,
  intake: {},
  intakeBusy: {},
  run: null,
  library: [],
  generationProvider: DEFAULT_GENERATION_PROVIDER,
  generationProviders: null,
  generationProvidersBusy: false,
  view: 'dashboard',
  projectHome: true,
  tab: 'inputs',
  modal: false,
  toasts: [],
  form: emptyForm(),
  busy: {},
  open: {},
  tpl: {},
  ropen: {},
  inputPanel: false,
  workflowPanel: false,
  researchPanel: false,
  rq: '',
  rurls: '',
  live: true,
  useRoom: true,
  bench: true,
  rbusy: false,
  lk: '',
  pv: '',
  md: '',
  transcript: '',
  answerDrafts: {},
  answerSaving: {},
  fathomOpen: false,
  mdFor: '',
  packBusy: [false, false, false, false, false, false],
  genStage: 0,
  reportBusy: false,
  reportStage: '',
  answersBusy: false,
  tip: null,
  pick: '',
  af: 'ALL',
  q: '',
  removeArmed: null,
  removeBusy: false,
  engListOpen: true,
});

let loadingPortfolio = false;

/*
 * Toast identity and expiry live outside the store: the id only has to be
 * unique for the session, and each message owns its own timer so a new one
 * cannot cut short the one before it. The old implementation held a single
 * string and one shared timeout, so two messages in quick succession meant the
 * first was overwritten before it could be read - which is what happened every
 * time a write failed and the store then refreshed.
 */
let nextToastId = 1;
const toastTimers = new Map<number, ReturnType<typeof setTimeout>>();

/** At most this many on screen; the oldest is dropped to make room. */
const TOAST_LIMIT = 3;

export const useConsoleStore = create<ConsoleStore>()((set, get) => ({
  ...initial(),

  set: (partial) => set(partial as never),

  say: (msg, kind) => {
    const body = msg.trim();
    if (!body) return;
    const resolved = kind ?? inferToastKind(body);
    const id = nextToastId++;
    const ttl = toastTtl(body, resolved);

    set((s) => {
      /*
       * The same message twice running is one event as far as the reader is
       * concerned - a failed write followed by the refresh that reports it
       * again, say. Refresh the existing one rather than stacking a duplicate.
       */
      const duplicate = s.toasts.find((t) => t.body === body && t.kind === resolved);
      if (duplicate) return { toasts: s.toasts };
      return { toasts: [...s.toasts, { id, body, kind: resolved, ttl }].slice(-TOAST_LIMIT) };
    });

    if (ttl > 0) {
      toastTimers.set(
        id,
        setTimeout(() => {
          toastTimers.delete(id);
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
        }, ttl),
      );
    }
  },

  dismissToast: (id) => {
    const timer = toastTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimers.delete(id);
    }
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },

  current: () => {
    const s = get();
    return s.projects.find((p) => p.id === s.cur) ?? s.projects[0];
  },

  /* ------------------------------------------------------------- loading */

  loadPortfolio: async () => {
    /* one at a time: several mounts race on first paint otherwise */
    if (loadingPortfolio) return;
    loadingPortfolio = true;
    set({ loading: true, loadError: '' });
    try {
      const rows = await backend.listEngagements();
      /*
       * The list view only needs names and sectors, so the portfolio loads as
       * shells and the open engagement is then fetched in full. A dashboard of
       * twenty sprints does not need twenty packs in memory.
       */
      const shells = rows.map((r) =>
        toEngagement({
          ...r,
          success_metrics: [],
          inputs: [],
          steps: [],
          attendance: [],
          links: [],
          files: [],
          deliverables: [],
          /*
           * Summary shells do not need full generated packs, but progress and
           * phase gating still need to see the compact current pack chain.
           * The open engagement replaces these placeholders on refresh.
           */
          packs: Object.fromEntries((r.completed_phases ?? []).map((phase) => [phase, {}])),
          questions: [],
          brain: null,
          spend: { runs: 0, cost: 0 },
        }),
      );
      set((s) => ({ projects: shells, cur: s.cur || shells[0]?.id || '', loading: false }));
      const open = get().cur;
      if (open) await get().refresh(open);
      void get().loadCredits();
    } catch (e) {
      set({ loading: false, loadError: errText(e) });
    } finally {
      loadingPortfolio = false;
    }
  },

  refresh: async (engagementId) => {
    const id = engagementId || get().cur;
    if (!id) return;
    set((s) => ({ hydrating: { ...s.hydrating, [id]: true } }));
    try {
      const row = await backend.getEngagement(id);
      const engagement = toEngagement(row);
      set((s) => ({
        projects: s.projects.some((p) => p.id === engagement.id)
          ? s.projects.map((p) => (p.id === engagement.id ? engagement : p))
          : [...s.projects, engagement],
        brain: row.brain
          ? {
              version: row.brain.version,
              narrative: row.brain.narrative,
              confidence: row.brain.confidence,
              unknown: row.brain.unknown ?? [],
            }
          : null,
        hydrated: { ...s.hydrated, [engagement.id]: true },
        loadError: '',
      }));
    } catch (e) {
      set({ loadError: errText(e) });
    } finally {
      set((s) => ({ hydrating: { ...s.hydrating, [id]: false } }));
    }
  },

  loadCredits: async () => {
    try {
      set({ credits: await backend.getCredits() });
    } catch {
      /* the header shows nothing rather than erroring */
    }
  },

  loadGenerationProviders: async () => {
    if (get().generationProvidersBusy || get().generationProviders) return;
    set({ generationProvidersBusy: true });
    try {
      const catalog = await backend.getProviders();
      let saved: string | null = null;
      try {
        saved = localStorage.getItem('altrd-generation-provider');
      } catch {
        /* storage blocked */
      }
      const preferred = isGenerationProvider(saved) ? saved : catalog.default;
      const state = get();
      const modelBusy =
        state.packBusy.some(Boolean) || state.answersBusy || Object.values(state.intakeBusy).some(Boolean);
      const provider = modelBusy
        ? state.generationProvider
        : catalog.providers[preferred]?.configured
          ? preferred
          : catalog.providers[catalog.default]?.configured
            ? catalog.default
            : DEFAULT_GENERATION_PROVIDER;
      if (provider !== preferred) {
        try {
          localStorage.setItem('altrd-generation-provider', provider);
        } catch {
          /* storage blocked */
        }
      }
      set({ generationProviders: catalog, generationProvider: provider });
    } catch {
      /* OpenRouter remains the safe default; unavailable choices stay disabled. */
    } finally {
      set({ generationProvidersBusy: false });
    }
  },

  setGenerationProvider: (provider) => {
    const state = get();
    const modelBusy =
      state.packBusy.some(Boolean) || state.answersBusy || Object.values(state.intakeBusy).some(Boolean);
    if (modelBusy) {
      state.say('Wait for the current model task to finish before switching provider.');
      return;
    }
    if (state.generationProvider === provider) return;
    if (!state.generationProviders?.providers[provider]?.configured) {
      state.say(`${generationProviderLabel(provider)} is not configured on the backend.`);
      return;
    }
    try {
      localStorage.setItem('altrd-generation-provider', provider);
    } catch {
      /* the selection still applies for this session */
    }
    set({ generationProvider: provider, intake: {} });
    state.say(`${generationProviderLabel(provider)} selected for the next model task.`);
  },

  /* ------------------------------------------------------------ mutations */

  patchLocal: (fn) =>
    set((s) => ({
      projects: s.projects.map((p) => {
        if (p.id !== s.cur) return p;
        const copy: Engagement = {
          ...p,
          inputs: { ...p.inputs },
          steps: { ...p.steps },
          attended: { ...(p.attended ?? {}) },
          docs: { ...p.docs },
          built: { ...p.built },
          manual: { ...p.manual },
          cq: { ...p.cq },
          files: p.files.slice(),
          research: p.research.slice(),
          links: (p.links || []).slice(),
        };
        fn(copy);
        return copy;
      }),
    })),

  toggleInput: (phase, index) => {
    const key = `${phase}:${index}`;
    const held = get().current()?.inputs[key];
    const next = held === true ? null : ('received' as const);
    get().patchLocal((p) => {
      if (next) p.inputs[key] = true;
      else delete p.inputs[key];
    });
    set({ intake: {} });
    void write(get, () => backend.setInput(get().cur, phase, index, next));
  },

  markInputNa: (phase, index) => {
    const key = `${phase}:${index}`;
    const held = get().current()?.inputs[key];
    const next = held === 'na' ? null : ('na' as const);
    get().patchLocal((p) => {
      if (next) p.inputs[key] = 'na';
      else delete p.inputs[key];
    });
    set({ intake: {} });
    void write(get, () => backend.setInput(get().cur, phase, index, next));
  },

  toggleStep: (phase, index) => {
    const key = `${phase}:${index}`;
    const done = get().current()?.steps[key] === true;
    get().patchLocal((p) => {
      if (done) delete p.steps[key];
      else p.steps[key] = true;
    });
    void write(get, () => backend.setStep(get().cur, phase, index, !done));
  },

  toggleAttendance: (phase, index) => {
    const key = `${phase}:${index}`;
    const present = get().current()?.attended?.[key] === true;
    get().patchLocal((p) => {
      p.attended = { ...(p.attended ?? {}) };
      if (present) delete p.attended[key];
      else p.attended[key] = true;
    });
    set({ intake: {} });
    void write(get, () => backend.setAttendance(get().cur, phase, index, !present));
  },

  saveNote: (phase, body) => {
    get().patchLocal((p) => {
      p.manual = { ...p.manual, [phase]: body };
    });
    set({ intake: {} });
    void write(get, () => backend.setNote(get().cur, phase, body));
  },

  setUrl: (url) => {
    get().patchLocal((p) => {
      p.url = url;
    });
    set({ intake: {} });
    void write(get, () => backend.patchEngagement(get().cur, { url }));
  },

  addLink: (url) => {
    set({ intake: {} });
    void (async () => {
      try {
        await backend.addLink(get().cur, url);
        await get().refresh();
      } catch (e) {
        get().say(errText(e));
      }
    })();
  },

  removeLink: (linkId) => {
    get().patchLocal((p) => {
      p.links = (p.links || []).filter((l) => l.id !== linkId);
    });
    set({ intake: {} });
    void write(get, () => backend.removeLink(get().cur, linkId));
  },

  setDocStatus: (phase, doc, status) => {
    const key = `${phase}.${doc}`;
    get().patchLocal((p) => {
      const r = p.docs[key] || { s: 0 as DocStatus, draft: '' };
      p.docs[key] = { s: status, draft: r.draft };
    });
    void write(get, () => backend.setDeliverable(get().cur, phase, doc, { status }));
  },

  setDocDraft: (phase, doc, draft) => {
    const key = `${phase}.${doc}`;
    get().patchLocal((p) => {
      const r = p.docs[key] || { s: 0 as DocStatus, draft: '' };
      p.docs[key] = { s: Math.max(1, r.s) as DocStatus, draft };
    });
    void write(get, () => backend.setDeliverable(get().cur, phase, doc, { draft }));
  },

  addFiles: (list, phase, inputIdx) => {
    const files = Array.prototype.slice.call(list || []) as File[];
    if (!files.length) return;
    void (async () => {
      let read = 0;
      for (const file of files) {
        try {
          const result = await backend.uploadFile(get().cur, phase, file, 'document', inputIdx ?? -1);
          blobs.set(result.id, file);
          if (result.textExtracted) read++;
        } catch (e) {
          get().say(`could not upload ${file.name}: ${errText(e)}`);
        }
      }
      set({ intake: {} });
      await get().refresh();
      get().say(
        `${files.length} file${files.length > 1 ? 's' : ''} added to the Phase ${PHASES[phase].num} data room` +
          (read ? ` — ${read} read as text and fed to generation` : ''),
      );
    })();
  },

  removeFile: (fileId) => {
    get().patchLocal((p) => {
      p.files = p.files.filter((f) => f.id !== fileId);
    });
    set({ intake: {} });
    void write(get, () => backend.removeFile(get().cur, fileId));
  },

  fileBlob: (id) => blobs.get(id),

  createEngagement: async () => {
    const f = get().form;
    if (!f.name.trim()) {
      get().say('A client name is required.');
      return null;
    }
    try {
      const created = await backend.createEngagement({
        name: f.name.trim(),
        sector: f.sector.trim() || 'Sector to confirm',
        url: f.url.trim(),
        notes: f.notes.trim(),
        scope: f.scope,
      });
      await get().loadPortfolio();
      set({ modal: false, view: 'project', cur: created.id, phase: 0, tab: 'inputs', projectHome: true });
      await get().refresh(created.id);
      get().say(`${created.name} opened at Phase 0 — outside-in view · ${created.scope}`);
      return created.id;
    } catch (e) {
      get().say(`could not create the engagement: ${errText(e)}`);
      return null;
    }
  },

  syncManualDraft: (projectId, pi) => {
    const key = `${projectId}:${pi}`;
    if (get().mdFor === key) return;
    const p = get().projects.find((x) => x.id === projectId);
    set({ md: (p?.manual || {})[pi] || '', mdFor: key });
  },

  /* ----------------------------------------------------- running a phase */

  loadIntake: async (phase) => {
    if (get().intakeBusy[phase] || !get().cur) return;
    set((s) => ({ intakeBusy: { ...s.intakeBusy, [phase]: true } }));
    try {
      const intake = await backend.getIntake(get().cur, phase, get().generationProvider);
      set((s) => ({ intake: { ...s.intake, [phase]: intake } }));
    } catch (e) {
      get().say(`could not work out what Phase ${PHASES[phase].num} needs: ${errText(e)}`);
    } finally {
      set((s) => ({ intakeBusy: { ...s.intakeBusy, [phase]: false } }));
    }
  },

  generatePhase: async (phaseIndex, opts = {}) => {
    const phase = phaseIndex ?? get().phase;
    const engagement = get().current();
    if (!engagement) return;
    if (!phaseUnlocked(engagement, phase)) {
      get().say(lockNote(engagement, phase));
      return;
    }
    /*
     * No readiness precondition. The intake gate is the pipeline's first
     * stage: it reports what the phase is missing and what it will assume, and
     * the run continues. `force` is what carries that through to the backend.
     */
    if (get().packBusy[phase]) return;

    const busy = get().packBusy.slice() as ConsoleState['packBusy'];
    busy[phase] = true;
    set({
      tab: 'docs',
      packBusy: busy,
      genStage: 0,
      run: { phase, stage: 0, label: 'STARTING', detail: '', warnings: [] },
    });

    let completed = false;
    try {
      await backend.generatePhase(
        get().cur,
        phase,
        (event: PhaseEvent) => {
          if (event.type === 'stage') {
            set((s) => ({
              genStage: event.stage,
              run: s.run ? { ...s.run, stage: event.stage, label: event.label, detail: event.detail } : s.run,
            }));
          } else if (event.type === 'warning') {
            set((s) => ({
              run: s.run ? { ...s.run, warnings: [...s.run.warnings, event.message] } : s.run,
            }));
          } else if (event.type === 'evidence') {
            set((s) => ({
              run: s.run
                ? {
                    ...s.run,
                    evidence: { reported: event.reported, derived: event.derived, absent: event.absent },
                  }
                : s.run,
            }));
          } else if (event.type === 'review') {
            set((s) => ({
              run: s.run
                ? { ...s.run, review: { score: event.score, verdict: event.verdict, findings: event.findings } }
                : s.run,
            }));
          } else if (event.type === 'blocked') {
            const blocked = { ...event, canRun: false, confidence: 0 } as unknown as Intake;
            set((s) => ({
              intake: { ...s.intake, [phase]: blocked },
              run: s.run ? { ...s.run, blocked } : s.run,
            }));
            get().say(`Phase ${PHASES[phase].num} needs something first — ${event.verdict}`);
          } else if (event.type === 'error') {
            get().say(`Phase ${PHASES[phase].num} failed: ${event.message}`);
          } else if (event.type === 'done') {
            completed = true;
            set((s) => ({
              run: s.run ? { ...s.run, sources: event.sourcesRead ?? [] } : s.run,
            }));
            get().say(
              `Phase ${PHASES[phase].num} built in ${Math.round(event.durationMs / 1000)}s — ` +
                `${event.evidence.reported} reported figures, ${event.evidence.derived} derived, ` +
                `pack scored ${event.review.score}/100.`,
            );
          }
        },
        { ...opts, provider: get().generationProvider },
      );
      await get().refresh();
      if (completed) set({ intake: {} });
      void get().loadCredits();
    } catch (e) {
      get().say(`could not build Phase ${PHASES[phase].num}: ${errText(e)}`);
    } finally {
      const done = get().packBusy.slice() as ConsoleState['packBusy'];
      done[phase] = false;
      set({ packBusy: done });
    }
  },

  resetPhaseOutputs: async (phase) => {
    try {
      await backend.resetPack(get().cur, phase);
      await get().refresh();
      set({ intake: {} });
      const later = phase < PHASES.length - 1 ? ' and all later dependent phase outputs' : '';
      get().say(`Phase ${PHASES[phase].num}${later} cleared. Generate again when you are ready.`);
    } catch (e) {
      get().say(errText(e));
    }
  },

  /*
   * A question is in edit mode exactly while it holds a draft. That is what
   * lets an answered question render as read-only text - which is most of
   * them, most of the time - instead of a permanently open textarea.
   */
  setAnswerDraft: (questionId, text) =>
    set((s) => ({ answerDrafts: { ...s.answerDrafts, [questionId]: text } })),

  cancelAnswerDraft: (questionId) =>
    set((s) => {
      const drafts = { ...s.answerDrafts };
      delete drafts[questionId];
      return { answerDrafts: drafts };
    }),

  /*
   * Save one answer. Straight to the row - no model call, because which
   * question was meant is not in doubt. An empty box reopens the question, so
   * a wrong answer can be taken back.
   */
  saveAnswer: async (questionId) => {
    if (get().answerSaving[questionId]) return;
    const text = (get().answerDrafts[questionId] ?? '').trim();
    set((s) => ({ answerSaving: { ...s.answerSaving, [questionId]: true } }));
    try {
      await backend.answerQuestion(get().cur, questionId, text);
      await get().refresh();
      set((s) => {
        const drafts = { ...s.answerDrafts };
        delete drafts[questionId];
        return { answerDrafts: drafts };
      });
      get().say(text ? 'Answer saved against the question.' : 'Answer cleared — the question is open again.');
    } catch (e) {
      get().say(`could not save that answer: ${errText(e)}`);
    } finally {
      set((s) => {
        const saving = { ...s.answerSaving };
        delete saving[questionId];
        return { answerSaving: saving };
      });
    }
  },

  armRemove: (engagementId) => set({ removeArmed: engagementId }),

  removeEngagement: async (engagementId) => {
    if (get().removeBusy) return;
    const project = get().projects.find((x) => x.id === engagementId);
    set({ removeBusy: true });
    try {
      await backend.removeEngagement(engagementId);
      /*
       * If the engagement being removed is the one on screen, the URL is now
       * pointing at something that is no longer listed, so go back to the
       * portfolio before reloading it.
       */
      const wasOpen = get().cur === engagementId;
      /*
       * Dropped from local state rather than waiting on a reload: the reload
       * self-guards against concurrent calls, so if one is already in flight
       * this one is skipped and the card would sit there looking undeleted.
       */
      set((s) => ({
        removeArmed: null,
        cur: wasOpen ? '' : s.cur,
        projects: s.projects.filter((x) => x.id !== engagementId),
      }));
      void get().loadPortfolio();
      get().say(
        `${project?.name ?? 'The engagement'} removed from the portfolio. Its packs and spend history are kept.`,
      );
    } catch (e) {
      get().say(`could not remove it: ${errText(e)}`);
    } finally {
      set({ removeBusy: false });
    }
  },

  /* -------------------------------------------------- answers coming back */

  submitAnswers: async (material, name, phase) => {
    if (!material.trim()) {
      get().say('Nothing to read — paste what the client sent back.');
      return;
    }
    set({ answersBusy: true });
    try {
      const result = await backend.postAnswers(get().cur, material, name, phase, get().generationProvider);
      await get().refresh();
      set({ intake: {} });
      void get().loadCredits();
      get().say(answerSummary(result));
    } catch (e) {
      get().say(`could not read those answers: ${errText(e)}`);
    } finally {
      set({ answersBusy: false });
    }
  },

  uploadAnswers: async (file, phase) => {
    set({ answersBusy: true });
    try {
      const result = await backend.uploadAnswers(get().cur, file, phase, get().generationProvider);
      await get().refresh();
      set({ intake: {} });
      void get().loadCredits();
      get().say(answerSummary(result));
    } catch (e) {
      get().say(`could not read ${file.name}: ${errText(e)}`);
    } finally {
      set({ answersBusy: false });
    }
  },

  /* -------------------------------------------------------------- library */

  captureToLibrary: (phase) => {
    const p = get().current();
    if (!p) return 0;
    const entries = captureFromPhase(p, phase);
    if (!entries.length) {
      get().say('Nothing in this phase generalises yet — generate the pack first.');
      return 0;
    }
    set((s) => ({
      library: [
        ...entries,
        ...s.library.filter((e) => !(e.source.engagementId === p.id && e.source.phase === phase)),
      ],
    }));
    get().say(
      `${entries.length} asset${entries.length === 1 ? '' : 's'} kept in the library from Phase ${PHASES[phase].num}.`,
    );
    return entries.length;
  },

  removeFromLibrary: (id) => set((s) => ({ library: s.library.filter((e) => e.id !== id) })),

  /* ------------------------------------------------------- not yet wired */

  generateDoc: async (phase) => {
    get().say(
      `Deliverable drafting is not wired to the backend yet — the Phase ${PHASES[phase].num} pack is.`,
    );
  },

  runResearch: async () => {
    get().say('The research desk is not wired to the backend yet.');
  },
}));

/** Fire a write-through, and fall back to the server's truth if it fails. */
async function write(get: () => ConsoleStore, call: () => Promise<unknown>): Promise<void> {
  try {
    await call();
  } catch (e) {
    get().say(`not saved: ${errText(e)}`);
    await get().refresh();
  }
}

function answerSummary(result: {
  answered: unknown[];
  partial: unknown[];
  unprompted: unknown[];
  contradictions: unknown[];
  stillOpen: number;
  brain: { confidence: number };
}): string {
  const bits = [`${result.answered.length} question${result.answered.length === 1 ? '' : 's'} closed`];
  if (result.partial.length) bits.push(`${result.partial.length} partly answered`);
  if (result.unprompted.length) bits.push(`${result.unprompted.length} unprompted finding`);
  if (result.contradictions.length) bits.push(`${result.contradictions.length} contradiction`);
  return `${bits.join(', ')}. ${result.stillOpen} still open, understanding now ${result.brain.confidence}%.`;
}

function errText(e: unknown): string {
  return e instanceof Error && e.message ? e.message : 'unknown error';
}

export { PACK_KEYS };
