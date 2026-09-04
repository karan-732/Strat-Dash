/* eslint-disable @typescript-eslint/no-explicit-any */
import { PHASES, DOCS_PER_ENGAGEMENT } from '@/lib/playbook/phases';
import { DOC_STATUS, GEN_STAGES, PACK_KEYS, SPRINT_SCOPES } from '@/lib/playbook/constants';
import { curPhaseIdx, lockNote, phasePct, phaseUnlocked, firstMissingPhase, sprintPct } from '@/lib/domain/progress';
import { pad2, slug } from '@/lib/domain/format';
import { blocks } from '@/lib/markdown/blocks';
import { templateMd, blueprintMd } from '@/lib/export/documents';
import { wrapDoc } from '@/lib/export/wrappers';
import { download } from '@/lib/browser/download';
import type { Engagement } from '@/lib/domain/types';
import type { ViewModelDeps } from './deps';
import { LIBRARY_KINDS } from '@/lib/library/types';
import { captureFromPhase } from '@/lib/library/capture';
import { generationProviderLabel } from '@/lib/domain/generation-provider';
import { disclosure, resetEngagementScroll } from './disclosure';
import { forgetTabScroll } from './tab-scroll';
import { phaseBrief } from './phase-brief';
import { buildPortfolio } from './portfolio';
import { buildPhaseNav } from './phase-nav';
import { buildPhaseInputs } from './phase-inputs';
import { buildPhaseOutput } from './phase-output';
import { buildPhaseHandoff } from './phase-handoff';

import {
  buildExtras,
  buildPhase0Pack,
  buildPhase1Pack,
  buildPhase2Pack,
  buildPhase3Pack,
  buildPhase4Pack,
  buildPhase5Pack,
  emptyPicks,
  type PackContext,
  type Picks,
} from './packs';

export type { ViewModelDeps, ConsoleNav, ConsoleRoute, ConsoleTheme, ConsoleSettings } from './deps';

/**
 * The console's whole view model.
 *
 * Every ported component reads from the single object this returns — the same
 * contract the original single-file console rendered against, so the markup did
 * not have to change during the port. Composition order:
 *
 *   portfolio      dashboard, sidebar list, needs-attention
 *   phase nav      the six phase cards and the workspace rail
 *   phase inputs   checklist, workflow, deliverables, data room, research
 *   packs          the generated output pack for the phase on screen
 *   phase output   pack header, generation ladder, questions, next moves
 */
/** "the outside-in view" -> "The outside-in view", for a sentence opener. */
function sentence(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/*
 * The generated pack for the phase on screen, cached on what it is actually
 * derived from.
 *
 * `buildViewModel` runs straight out of the component with nothing memoising
 * it, so every store change re-derives the pack: a keystroke in an answer box,
 * a tab switch, a toast expiring, the hydration flag flipping. Each derivation
 * is a dense pass over unvalidated model JSON — the reason all six were cut
 * down to one in the first place — and it was still the largest single task in
 * a render.
 *
 * A pack builder reads nothing but its `PackContext`, so its output is a pure
 * function of the engagement object, the phase, the selected chart point and
 * the accent. `p` is replaced wholesale by `patchLocal` and `refresh`, so
 * identity is a sound key: everything that could change a pack changes one of
 * these four, and nothing else in the store can.
 *
 * `picks` is cached alongside `active` rather than rebuilt, because the
 * builders fill it as a side effect and the card read-outs read it back — a
 * fresh `emptyPicks()` against a cached pack would render every quadrant
 * read-out blank.
 *
 * One entry is enough. There is one phase on screen.
 */
const PACK_BUILDERS = [
  buildPhase0Pack,
  buildPhase1Pack,
  buildPhase2Pack,
  buildPhase3Pack,
  buildPhase4Pack,
  buildPhase5Pack,
];

let packCache: {
  key: readonly [Engagement, number, string, string];
  value: { active: any; picks: Picks; xtra: any };
} | null = null;

function derivePacks(
  p: Engagement,
  pi: number,
  pk: string,
  accent: string,
  actions: ViewModelDeps['actions'],
) {
  const cached = packCache;
  if (
    cached &&
    cached.key[0] === p &&
    cached.key[1] === pi &&
    cached.key[2] === pk &&
    cached.key[3] === accent
  ) {
    return cached.value;
  }

  const picks = emptyPicks();
  const ctx: PackContext = {
    p,
    accent,
    pk,
    pickOn: (k: string) => () => actions.set({ pick: pk === k ? '' : k }),
    picks,
  };

  /*
   * Only the phase on screen is derived. The five that are not are never read:
   * each pack component is gated on `showVisualN: pi === n`, so leaving them
   * null changes nothing except the work.
   *
   * `xtra` stays whole. It reads the raw pack JSON off the engagement rather
   * than these derivations, and the extras of several phases are interleaved
   * in one verbatim block lifted from the source console.
   */
  const value = {
    xtra: buildExtras(ctx),
    active: PACK_BUILDERS[pi] ? PACK_BUILDERS[pi](ctx) : null,
    picks,
  };
  packCache = { key: [p, pi, pk, accent] as const, value };
  return value;
}

export function buildViewModel(deps: ViewModelDeps): any {
  const { route, state: S, actions, nav, theme, settings } = deps;
  const accent = settings.accent;
  const weighting = settings.weighting;

  const p = S.projects.find((x) => x.id === route.engagementId) ?? S.projects[0];
  const pi = route.phase;
  const ph = PHASES[pi];

  const portfolio = buildPortfolio(deps);
  const { phases, tabs } = buildPhaseNav(deps, p, pi);
  const io = buildPhaseInputs(deps, p, pi);
  const out = buildPhaseOutput(deps, p, pi);
  const handoff = buildPhaseHandoff(deps, p, pi);
  const brief = phaseBrief(pi);

  /* --- generated packs for the phase on screen -------------------------- */

  const pk = S.pick || '';
  const { active, picks, xtra } = derivePacks(p, pi, pk, accent, actions);
  const vis = pi === 0 ? active : null;
  const vis1 = pi === 1 ? active : null;
  const vis2 = pi === 2 ? active : null;
  const vis3 = pi === 3 ? active : null;
  const vis4 = pi === 4 ? active : null;
  const vis5 = pi === 5 ? active : null;

  const sp = sprintPct(p, weighting);
  const ci = curPhaseIdx(p);
  const unlocked = phaseUnlocked(p, pi);

  /*
   * Generate. One press, one thing happens.
   *
   * There is deliberately no readiness step in front of this. The intake gate
   * still runs - it is the pipeline's first stage, where it works out what the
   * phase is missing and states the assumptions the pack will make - but it
   * informs the run rather than standing in the consultant's way. `force`
   * carries that: the gate reports, it does not veto.
   */
  const startPhaseGeneration = () => {
    if (!unlocked) {
      actions.say(lockNote(p, pi));
      return;
    }
    if (out.outputBusy) return;
    /* built already: read it, do not run it again over the top */
    if (out.outputReady) {
      /* arriving from the button, so start at the top of the output */
      forgetTabScroll(`${p.id}:${pi}:docs`);
      actions.set({ tab: 'docs' });
      return;
    }
    void actions.generatePhase(pi, { force: true });
  };

  /* --- document preview -------------------------------------------------- */

  let preview: any = null;
  if (S.pv) {
    const parts = S.pv.split('.');
    const ppi = Number(parts[0]);
    const pd = PHASES[ppi].docs.filter((x) => x.n === Number(parts[1]))[0];
    const rec = p.docs[S.pv] || { s: 0 as const, draft: '' };
    const md = rec.draft || templateMd(p, ppi, pd);
    preview = {
      name: pd.name,
      meta:
        p.name +
        '  ·  Phase ' +
        PHASES[ppi].num +
        ' - ' +
        PHASES[ppi].title +
        '  ·  ' +
        DOC_STATUS[rec.s] +
        (rec.draft ? '' : '  ·  BLANK TEMPLATE, NOT YET DRAFTED'),
      blocks: blocks(md),
      dlDoc: () =>
        download(
          slug(p.name) + '-p' + PHASES[ppi].num + '-' + slug(pd.name) + '.doc',
          wrapDoc(pd.name + ' - ' + p.name, md),
          'application/msword',
        ),
      dlMd: () =>
        download(slug(p.name) + '-p' + PHASES[ppi].num + '-' + slug(pd.name) + '.md', md, 'text/markdown;charset=utf-8'),
    };
  }

  const isLight = theme.t === 'light';

  return {
    accent,

    /* theme toggle */
    themeLabel: isLight ? 'LIGHT' : 'DARK',
    themeTitle: isLight ? 'Switch to dark theme' : 'Switch to light theme',
    themeDot: isLight ? 'var(--warn)' : 'var(--fg2)',
    themeIsLight: isLight,
    themeSunTransform: isLight ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(.4)',
    themeSunOpacity: isLight ? 1 : 0,
    themeMoonTransform: isLight ? 'rotate(-90deg) scale(.4)' : 'rotate(0deg) scale(1)',
    themeMoonOpacity: isLight ? 0 : 1,
    toggleTheme: theme.toggle,

    /* eye-button popovers */
    openDisclosure: disclosure.open,
    leaveDisclosure: disclosure.leave,
    blurDisclosure: disclosure.blur,
    toggleDisclosure: disclosure.toggle,
    closeDisclosure: disclosure.close,

    /* dashboard analytics tooltips */
    barsTipOn: portfolio.barsTip.on,
    barsOver: portfolio.barsTip.over,
    barsOut: portfolio.barsTip.out,
    phaseTipOn: portfolio.phaseTip.on,
    phaseOver: portfolio.phaseTip.over,
    phaseOut: portfolio.phaseTip.out,

    /* which view is on screen */
    isDash: route.view === 'dashboard',
    isProj: route.view === 'project',
    isAttn: route.view === 'attention',
    sidebarClass: route.view === 'project' ? 'app-sidebar eng-project-sidebar' : 'app-sidebar',
    goDash: () => nav.toDashboard(),
    projectOverview: route.projectHome !== false,
    phaseWorkspace: route.projectHome === false,
    goProjectHome: () => {
      nav.toEngagement(p.id);
      resetEngagementScroll('.eng-section-title');
    },
    projectPrimaryLabel: sp >= 100 ? 'ASSEMBLE' : 'OPEN',
    projectPrimary:
      sp >= 100
        ? () => {
            const { md, heldDrafts } = blueprintMd(p, weighting);
            download(
              'altrd-blueprint-' + slug(p.name) + '.doc',
              wrapDoc('Altrd AI Transformation Blueprint - ' + p.name, md),
              'application/msword',
            );
            actions.say(
              'Blueprint assembled with ' + heldDrafts + ' held draft' + (heldDrafts === 1 ? '' : 's') + ' across six phases',
            );
          }
        : phases[ci].select,
    goAttn: () => nav.toAttention(),
    attnBg: route.view === 'attention' ? '#D26B51' : 'transparent',
    attnCurrent: route.view === 'attention' ? 'page' : 'false',
    attnEdge: route.view === 'attention' ? 'var(--fg)' : 'transparent',
    attnDot: portfolio.attnOpen ? 'var(--warn)' : 'var(--ok)',
    attnCount: String(portfolio.attnOpen),
    attnKpis: portfolio.attnKpis,

    /* sidebar */
    navCount: pad2(S.projects.length),
    engListOpen: S.engListOpen !== false,
    engListExpanded: S.engListOpen !== false ? 'true' : 'false',
    engListArrow: S.engListOpen !== false ? 'rotate(0deg)' : 'rotate(-90deg)',
    toggleEngList: () => actions.set((s) => ({ engListOpen: s.engListOpen === false })),
    /* Altrd's own knowledge assets — the playbook's second deliverable */
    library: LIBRARY_KINDS.map((k) => ({
      icon: k.icon,
      label: k.label + (S.library.filter((e) => e.kind === k.kind).length ? ` · ${S.library.filter((e) => e.kind === k.kind).length}` : ''),
      open: () => nav.toLibrary(k.kind),
    })),

    /* dashboard */
    q: portfolio.q,
    onQ: (e: React.ChangeEvent<HTMLInputElement>) => actions.set({ q: e.target.value }),
    searchCount: portfolio.ql
      ? portfolio.cardsF.length + ' OF ' + portfolio.cards.length + ' SHOWN'
      : portfolio.cards.length + ' OPEN',
    noMatches: !!portfolio.ql && portfolio.projectsF.length === 0,
    dashBg: route.view === 'dashboard' ? '#D26B51' : 'transparent',
    dashCurrent: route.view === 'dashboard' ? 'page' : 'false',
    dashEdge: route.view === 'dashboard' ? 'var(--fg)' : 'transparent',
    avgPct: portfolio.avgPct,
    kpis: portfolio.kpis,
    bars: portfolio.barsF,
    cols: portfolio.cols,
    mix: portfolio.mix,
    attention: portfolio.attnList,
    cards: portfolio.cardsF,
    attnChips: portfolio.attnChips,
    attnEmpty: portfolio.attnEmpty,
    attnFilterLabel: portfolio.attnFilterLabel,
    attnClearFilter: portfolio.setAf('ALL'),
    docTotalLabel: portfolio.docsAll + ' DELIVERABLE SLOTS · ' + DOCS_PER_ENGAGEMENT + ' PER ENGAGEMENT',
    exportPortfolio: () =>
      download(
        'altrd-portfolio-' + new Date().toISOString().slice(0, 10) + '.json',
        JSON.stringify(
          {
            generated: new Date().toISOString(),
            projects: S.projects.map((x) => ({
              name: x.name,
              sector: x.sector,
              url: x.url,
              created: x.created,
              sprintPct: sprintPct(x, weighting),
              phases: PHASES.map((xp, i) => ({ phase: xp.num, title: xp.title, pct: phasePct(x, i) })),
            })),
          },
          null,
          2,
        ),
        'application/json',
      ),
    modelLabel: (() => {
      const metadata = S.generationProviders?.providers[S.generationProvider];
      return metadata
        ? `${metadata.label} · ${metadata.model.toUpperCase()}`
        : S.generationProvider === 'openrouter'
          ? `CLAUDE · ${settings.model.toUpperCase()}`
          : 'CHATGPT · LUNA';
    })(),
    generationProvider: S.generationProvider,
    generationProviderLabel: generationProviderLabel(S.generationProvider),
    generationProviders: S.generationProviders?.providers ?? null,
    generationProviderBusy:
      S.packBusy.some(Boolean) || S.answersBusy || Object.values(S.intakeBusy).some(Boolean),
    setGenerationProvider: actions.setGenerationProvider,
    projects: portfolio.projectsF,
    projectCount: pad2(S.projects.length),

    /* engagement */
    phases,
    tabs,
    holdings: (() => {
      let dv = 0;
      let dr = 0;
      PHASES.forEach((xp, i) => {
        xp.docs.forEach((d) => {
          const r = p.docs[i + '.' + d.n];
          if (r && r.s >= 4) dv++;
          if (r && r.draft) dr++;
        });
      });
      return [
        { k: 'Delivered', v: dv + '/' + DOCS_PER_ENGAGEMENT },
        { k: 'Drafts held', v: String(dr) },
        { k: 'Phases complete', v: PHASES.filter((_, i) => phasePct(p, i) >= 100).length + '/6' },
        { k: 'Files / research', v: p.files.length + ' / ' + p.research.length },
      ];
    })(),
    detail: [
      { k: 'Sector', v: p.sector || 'To confirm' },
      { k: 'Company URL', v: p.url || 'Not yet supplied' },
      { k: 'Opened', v: p.created },
      { k: 'Source links pasted', v: ((p.links || []).length || 'None') + '' },
      { k: 'Engagement notes', v: p.notes || 'None recorded' },
    ],

    /* phase workspace tabs and panels */
    tabInputs: S.tab === 'inputs',
    tabDocs: S.tab === 'docs',
    inputPanelOpen: !!S.inputPanel,
    inputPanelExpanded: S.inputPanel ? 'true' : 'false',
    workflowPanelOpen: !!S.workflowPanel,
    workflowPanelExpanded: S.workflowPanel ? 'true' : 'false',
    researchPanelOpen: !!S.researchPanel,
    researchPanelExpanded: S.researchPanel ? 'true' : 'false',
    toggleInputPanel: () => actions.set((s) => ({ inputPanel: !s.inputPanel, workflowPanel: false, researchPanel: false })),
    toggleWorkflowPanel: () => actions.set((s) => ({ inputPanel: false, workflowPanel: !s.workflowPanel, researchPanel: false })),
    toggleResearchPanel: () => actions.set((s) => ({ inputPanel: false, workflowPanel: false, researchPanel: !s.researchPanel })),
    room: io.room,
    isPhase0: pi === 0,
    phaseBuilt: out.phaseBuilt,
    notBuilt: !out.phaseBuilt,

    /* manual notes */
    manualDraft: S.md != null ? S.md : '',
    hasManual: !!(p.manual || {})[pi],
    manualStatus: S.answersBusy
      ? 'READING IT AGAINST THE OPEN QUESTIONS…'
      : (p.manual || {})[pi]
        ? (p.manual || {})[pi].trim().split(/\s+/).length + ' WORDS SAVED FOR THIS PHASE'
        : 'NO NOTES YET',
    manualBg: (S.md || '').trim() ? accent : 'var(--card2)',
    manualFg: (S.md || '').trim() ? '#0E1015' : 'var(--fg)',
    onManual: (e: React.ChangeEvent<HTMLTextAreaElement>) => actions.set({ md: e.target.value }),
    /*
     * Notes, and only notes. This used to double as the answer reader, because
     * it was the one way material reached a phase by hand. It no longer is:
     * answers go in the box beside their own question, and a whole transcript
     * goes through the Fathom control at the top of the tab. Leaving the double
     * duty in place meant a note about the sprint was charged for as an answer
     * pass against every open question.
     */
    saveManual: () => {
      const t = (S.md || '').trim();
      if (!t) {
        actions.say('Type something first - the box is empty.');
        return;
      }
      actions.saveNote(pi, t);
      actions.say(
        'Saved to Phase ' + ph.num + ' - it feeds this phase and every one after it.',
      );
    },
    clearManual: () => {
      actions.saveNote(pi, '');
      actions.set({ md: '' });
    },

    /* pack header and generation ladder */
    legacyOutput: false,
    outputTitle: out.copy.title,
    outputSummary: out.copy.summary,
    outputChartTitle: out.copy.chart,
    outputMatrixTitle: out.copy.matrixTitle,
    outputBusy: out.outputBusy,
    outputReady: out.outputReady,
    downloadFullReport: out.downloadFullReport,
    /*
     * There has to be something to report on. This was `!outputBusy`, so the
     * button appeared on a phase that had never been generated - and the
     * report it built would have captured zero cards.
     */
    canDownloadReport: !out.outputBusy && out.outputReady,
    reportBusy: out.reportBusy,
    reportLabel: out.reportBusy ? out.reportStage || 'BUILDING THE REPORT…' : 'DOWNLOAD FULL REPORT',
    outputEmpty: out.outputEmpty,
    outputStage: GEN_STAGES[out.genIdx][0],
    outputStageDetail: GEN_STAGES[out.genIdx][1],
    outputProgressValue: out.genProgress,
    outputProgress: out.genProgress + '%',
    outputBadge: out.outputBusy ? 'GENERATING' : out.outputReady ? 'BUILT FROM LIVE SOURCES' : 'NOT GENERATED',
    outputBadgeFg: out.outputBusy || out.outputReady ? '#D26B51' : 'var(--fg3)',
    outputBadgeBd: out.outputBusy || out.outputReady ? 'rgba(210,107,81,.42)' : 'var(--ln18)',
    genSteps: out.genSteps,
    genFound: out.genFound,
    startGenerate: startPhaseGeneration,
    handoff,

    /* cumulative gating */
    phaseLocked: !unlocked,
    phaseLockTitle: pi > 0 ? 'PHASE ' + ph.num + ' IS LOCKED' : '',
    phaseLockNote: pi > 0 ? lockNote(p, pi) : '',
    phaseLockCta: pi > 0 ? 'GO TO PHASE ' + PHASES[firstMissingPhase(p, pi)].num : '',
    goPrevPhase: () => {
      if (pi > 0) {
        nav.toPhase(p.id, firstMissingPhase(p, pi));
        resetEngagementScroll('.eng-phase-hero-title');
      }
    },
    /*
     * The generate call to action, which stops being one once the phase is
     * built. A generated pack is what every later phase is derived from and
     * its questions may already have been answered against it, so there is no
     * regenerate and no reset: the button becomes a way to go and read the
     * output. Clearing a phase is a backend call, deliberately not a control.
     */
    genDisabled: out.outputBusy || !unlocked,
    /*
     * The call to action, named after the thing it produces. "Generate the
     * pack" was the prototype's vocabulary: a consultant builds a view or runs
     * a diagnosis, and nobody outside this codebase knows what a pack is.
     */
    genCtaEyebrow: !unlocked
      ? 'PHASE ' + ph.num + ' · LOCKED'
      : out.outputBusy
        ? 'PHASE ' + ph.num + ' · RUNNING'
        : out.outputReady
          ? 'PHASE ' + ph.num + ' · DONE'
          : 'PHASE ' + ph.num,
    genLabel: !unlocked
      ? 'LOCKED'
      : out.outputBusy
        ? 'RUNNING…'
        : out.outputReady
          ? 'OPEN IT'
          : brief.action,
    genAria: out.outputReady
      ? 'Open ' + brief.output
      : brief.action.charAt(0) + brief.action.slice(1).toLowerCase(),
    genCtaTitle: !unlocked
      ? 'Phase ' + ph.num + ' is locked'
      : out.outputReady
        ? sentence(brief.output) + ' is built'
        : brief.action.charAt(0) + brief.action.slice(1).toLowerCase(),
    genCtaNote: !unlocked
      ? lockNote(p, pi)
      : out.outputReady
        ? 'Final — everything after it is built on this.'
        : pi === 0
          ? 'Reads the site and the links above live. Takes as long as the sources take.'
          : 'Built from this phase and every earlier one. No public sources, so it is quick.',

    /* the packs themselves */
    showVisual: pi === 0,
    hasVis: !!vis,
    noVis: false,
    vis,
    picks,
    xtra,
    cq: out.cq,
    sug: out.sug,

    /* the playbook's second deliverable: what Altrd keeps from this phase */
    keep: (() => {
      const candidates = captureFromPhase(p, pi);
      const held = S.library.filter((e) => e.source.engagementId === p.id && e.source.phase === pi);
      return {
        show: candidates.length > 0,
        head: held.length ? 'KEPT FOR THE LIBRARY · ' + held.length : 'FOR THE ALTRD LIBRARY · ' + candidates.length + ' TO KEEP',
        items: candidates.map((c) => ({
          title: c.title,
          kindLabel: (LIBRARY_KINDS.find((k) => k.kind === c.kind)?.label ?? c.kind).toLowerCase(),
        })),
        note: held.length
          ? 'Keeping again replaces what this phase contributed.'
          : 'The pattern, not this client’s figures.',
        label: held.length ? 'KEEP AGAIN' : 'KEEP FOR THE LIBRARY',
        capture: () => void actions.captureToLibrary(pi),
        open: () => nav.toLibrary(),
      };
    })(),
    showVisual1: pi === 1,
    hasVis1: !!vis1,
    noVis1: false,
    vis1,
    showVisual2: pi === 2,
    hasVis2: !!vis2,
    noVis2: false,
    vis2,
    showVisual3: pi === 3,
    hasVis3: !!vis3,
    noVis3: false,
    vis3,
    showVisual4: pi === 4,
    hasVis4: !!vis4,
    noVis4: false,
    vis4,
    showVisual5: pi === 5,
    hasVis5: !!vis5,
    noVis5: false,
    vis5,
    visStatus: S.packBusy[0]
      ? 'READING SOURCES AND BENCHMARKS…'
      : vis
        ? 'PUBLIC FIGURES WHERE THEY EXIST · ~ MARKS A BENCHMARK-DERIVED VALUE'
        : 'NOT BUILT YET',
    vis1Status: S.packBusy[1]
      ? 'READING LEADERSHIP INPUT AGAINST THE OUTSIDE-IN VIEW…'
      : vis1
        ? '~ MARKS A BENCHMARK-DERIVED VALUE, WITH THE BASIS SHOWN'
        : 'NOT BUILT YET',
    vis2Status: S.packBusy[2]
      ? 'READING FUNCTIONAL DATA AND BENCHMARKS…'
      : vis2
        ? '~ MARKS A BENCHMARK-DERIVED VALUE, WITH THE BASIS SHOWN'
        : 'NOT BUILT YET',
    vis3Status: S.packBusy[3]
      ? 'READING OBSERVATION NOTES AND TIMINGS…'
      : vis3
        ? '~ MARKS A BENCHMARK-DERIVED VALUE, WITH THE BASIS SHOWN'
        : 'NOT BUILT YET',
    vis4Status: S.packBusy[4]
      ? 'REDESIGNING AGAINST CURRENT AI CAPABILITY…'
      : vis4
        ? '~ MARKS A BENCHMARK-DERIVED VALUE, WITH THE BASIS SHOWN'
        : 'NOT BUILT YET',
    vis5Status: S.packBusy[5]
      ? 'COSTING AND SEQUENCING THE PORTFOLIO…'
      : vis5
        ? '~ MARKS A BENCHMARK-DERIVED VALUE, WITH THE BASIS SHOWN'
        : 'NOT GENERATED YET',

    /* legacy deliverable list */
    builtPlain: out.phaseBuilt,
    builtTitle: out.phasePackageReady ? 'PACKAGE BUILT' : 'PACKAGE IN PROGRESS',
    builtLine:
      out.delivered +
      ' of ' +
      ph.docs.length +
      ' deliverables reviewed or delivered' +
      (out.drafted ? ', ' + out.drafted + ' holding draft text' : ' - status only, no draft text held') +
      '.',
    showMissingDrafts: out.phasePackageReady && out.phaseNeedsBuild,
    missingDraftsLabel:
      'BUILD ' + (ph.docs.length - out.drafted) + ' MISSING DRAFT' + (ph.docs.length - out.drafted === 1 ? '' : 'S'),
    downloadPhase: out.downloadPhase,
    buildPackage: startPhaseGeneration,

    /* engagement header */
    cur: {
      name: p.name,
      meta: p.sector + (p.url ? '  ·  ' + p.url : '') + '  ·  opened ' + p.created,
      pct: sp,
      pctw: sp + '%',
      sprintLabel: sp >= 100 ? 'SPRINT COMPLETE' : 'SPRINT PROGRESS',
      statusLine: sp >= 100 ? 'ALL SIX PHASE PACKS COMPLETE' : 'RUNNING · PHASE ' + PHASES[ci].num + ' - ' + PHASES[ci].title.toUpperCase(),
      stageLong: sp >= 100 ? 'ALL SIX PHASE PACKS COMPLETE' : 'PHASE ' + PHASES[ci].num + ' - ' + PHASES[ci].title.toUpperCase(),
    },

    /* the phase on screen */
    ph: {
      num: ph.num,
      title: ph.title,
      subtitle: ph.subtitle,
      intro: ph.intro,
      note: ph.note,
      inputs: io.inputs,
      inputsLabel: out.inputsLabel,
      steps: io.steps,
      stepsLabel: io.stepsDone + ' / ' + ph.steps.length + ' COMPLETE',
      docCount: ph.docs.length,
      docs: io.docs,
      docsSummary: out.phaseBuilt ? out.delivered + ' OF ' + ph.docs.length + ' REVIEWED OR DELIVERED' : 'NOT BUILT YET',
      files: io.files,
    },

    /* sources */
    curUrl: p.url || '',
    links: io.links,
    lk: S.lk || '',
    onUrl: (e: React.ChangeEvent<HTMLInputElement>) => actions.setUrl(e.target.value),
    onLk: (e: React.ChangeEvent<HTMLInputElement>) => actions.set({ lk: e.target.value }),
    addLink: () => {
      const value = (S.lk || '').trim();
      if (!value) {
        actions.say('Paste a link first.');
        return;
      }
      actions.addLink(value);
      actions.set({ lk: '' });
    },

    /* document preview */
    previewOpen: !!S.pv,
    preview,
    closePreview: () => actions.set({ pv: '' }),

    /* research desk */
    research: io.research,
    researchCount: pad2(p.research.length),
    researchEmpty: io.research.length === 0,
    rq: S.rq,
    rurls: S.rurls,
    rBtnLabel: S.rbusy ? 'RESEARCHING…' : 'RESEARCH',
    liveBg: S.live ? accent : 'var(--card0)',
    roomBg: S.useRoom ? accent : 'var(--card0)',
    benchBg: S.bench ? accent : 'var(--card0)',
    livePressed: S.live ? 'true' : 'false',
    roomPressed: S.useRoom ? 'true' : 'false',
    benchPressed: S.bench ? 'true' : 'false',
    toggleLive: () => actions.set((s) => ({ live: !s.live })),
    toggleRoom: () => actions.set((s) => ({ useRoom: !s.useRoom })),
    toggleBench: () => actions.set((s) => ({ bench: !s.bench })),
    onRq: (e: React.ChangeEvent<HTMLTextAreaElement>) => actions.set({ rq: e.target.value }),
    onRurls: (e: React.ChangeEvent<HTMLTextAreaElement>) => actions.set({ rurls: e.target.value }),
    runResearch: () => void actions.runResearch(),

    /* data room drop target */
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      actions.addFiles(e.dataTransfer.files, pi, -1);
    },
    onRoomFiles: (e: React.ChangeEvent<HTMLInputElement>) => {
      actions.addFiles(e.target.files, pi, -1);
      e.target.value = '';
    },

    /* onboarding modal */
    modal: S.modal,
    form: S.form,
    openNew: () =>
      actions.set({
        modal: true,
        form: { name: '', sector: '', url: '', notes: '', scope: 'Department-level sprint' },
      }),
    closeNew: () => actions.set({ modal: false }),
    fName: (e: React.ChangeEvent<HTMLInputElement>) => actions.set((s) => ({ form: { ...s.form, name: e.target.value } })),
    fSector: (e: React.ChangeEvent<HTMLInputElement>) => actions.set((s) => ({ form: { ...s.form, sector: e.target.value } })),
    fUrl: (e: React.ChangeEvent<HTMLInputElement>) => actions.set((s) => ({ form: { ...s.form, url: e.target.value } })),
    fNotes: (e: React.ChangeEvent<HTMLTextAreaElement>) => actions.set((s) => ({ form: { ...s.form, notes: e.target.value } })),
    scopeOptions: SPRINT_SCOPES.map((o) => ({
      label: o.label,
      note: o.note,
      bd: S.form.scope === o.key ? '#D26B51' : 'var(--ln30)',
      bg: S.form.scope === o.key ? 'var(--card3)' : 'var(--bg)',
      dot: S.form.scope === o.key ? '#D26B51' : 'transparent',
      pick: () => actions.set((st) => ({ form: { ...st.form, scope: o.key } })),
    })),
    /*
     * Routing is URL-driven, so the new engagement has to be navigated to —
     * and straight into Phase 0's workspace, because the next thing the
     * consultant does is find out what it needs before it can run.
     */
    createProject: () => {
      void actions.createEngagement().then((id) => {
        if (id) nav.toPhase(id, 0);
      });
    },

    /* exports */
    blueprint: () => portfolio.downloadBlueprint(p),
    exportJson: () => download(slug(p.name) + '-sprint-state.json', JSON.stringify(p, null, 2), 'application/json'),

    /*
     * The toast stack. Each kind gets its own edge colour and mark so a save
     * that worked and a phase that failed are not the same coral box, and each
     * carries its own dismiss - an error stays until it is read.
     */
    toasts: S.toasts.map((t) => ({
      id: t.id,
      body: t.body,
      kind: t.kind,
      mark: t.kind === 'error' ? '!' : t.kind === 'note' ? '·' : '✓',
      bg: t.kind === 'error' ? '#D26B51' : 'var(--card)',
      fg: t.kind === 'error' ? '#FFFFFF' : 'var(--fg)',
      bd: t.kind === 'error' ? '#D26B51' : 'var(--ln20)',
      edge: t.kind === 'error' ? 'rgba(255,255,255,.55)' : t.kind === 'note' ? 'var(--fg3)' : accent,
      markFg: t.kind === 'error' ? '#FFFFFF' : t.kind === 'note' ? 'var(--fg3)' : accent,
      /* an error has no timer, so say so rather than leaving it looking stuck */
      hint: t.kind === 'error' ? 'CLICK TO DISMISS' : '',
      dismissAria: 'Dismiss: ' + t.body,
      dismiss: () => actions.dismissToast(t.id),
    })),
  };
}

/** Which engagement field the phase on screen writes its pack into. */
export const packKeyFor = (pi: number) => PACK_KEYS[pi];
