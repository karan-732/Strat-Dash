/* eslint-disable @typescript-eslint/no-explicit-any */
import { PHASES, DOCS_PER_ENGAGEMENT } from '@/lib/playbook/phases';
import { DOC_STATUS } from '@/lib/playbook/constants';
import { curPhaseIdx, phaseDone, phasePct, sprintPct } from '@/lib/domain/progress';
import { pad2 } from '@/lib/domain/format';
import { blueprintMd } from '@/lib/export/documents';
import { wrapDoc } from '@/lib/export/wrappers';
import { download } from '@/lib/browser/download';
import { slug } from '@/lib/domain/format';
import type { Engagement } from '@/lib/domain/types';
import type { ViewModelDeps } from './deps';
import { resetEngagementScroll } from './disclosure';

const MIX_COLORS = (accent: string) => ['var(--card2)', '#C8ACA4', accent, 'var(--ok)', '#D26B51'];

/** Severity language for the attention list. */
const SEV: Record<string, { c: string; tint: string; label: string; rank: number }> = {
  BLOCKED: { c: '#D26B51', tint: 'rgba(210,107,81,.10)', label: 'BLOCKED', rank: 0 },
  'REVIEW REQUIRED': { c: '#8C948F', tint: 'rgba(140,148,143,.08)', label: 'IN REVIEW', rank: 1 },
  'INPUTS OUTSTANDING': { c: '#A96756', tint: 'rgba(169,103,86,.08)', label: 'INPUTS DUE', rank: 2 },
  CLEAR: { c: '#6D746F', tint: 'rgba(109,116,111,.08)', label: 'CLEAR', rank: 3 },
};

/**
 * Everything the dashboard, the sidebar engagement list and the "needs
 * attention" view render from.
 */
export function buildPortfolio(deps: ViewModelDeps) {
  const { route, state: S, actions, nav, settings } = deps;
  const accent = settings.accent;
  const w = settings.weighting;

  const openEngagement = (id: string) => {
    nav.toEngagement(id);
    resetEngagementScroll('.eng-title');
  };
  const openAt = (id: string, phase: number) => {
    nav.toPhase(id, phase);
    resetEngagementScroll('.eng-phase-hero-title');
  };

  const downloadBlueprint = (p: Engagement) => {
    const { md, heldDrafts } = blueprintMd(p, w);
    download(
      'altrd-blueprint-' + slug(p.name) + '.doc',
      wrapDoc('Altrd AI Transformation Blueprint - ' + p.name, md),
      'application/msword',
    );
    actions.say('Blueprint assembled with ' + heldDrafts + ' held draft' + (heldDrafts === 1 ? '' : 's') + ' across six phases');
  };

  /* --- sidebar list ---------------------------------------------------- */

  const projects = S.projects.map((x) => {
    const pct = sprintPct(x, w);
    const ci = curPhaseIdx(x);
    const active = x.id === route.engagementId && route.view === 'project';
    return {
      name: x.name,
      sector: x.sector,
      pct,
      pctw: pct + '%',
      stage: pct >= 100 ? 'Complete' : 'Phase ' + PHASES[ci].num + ' · ' + PHASES[ci].title,
      bg: active ? '#D26B51' : 'transparent',
      edge: 'transparent',
      current: active ? 'page' : 'false',
      navFg: active ? '#FFFFFF' : 'var(--fg)',
      navPct: active ? 'rgba(255,255,255,.8)' : 'var(--fg3)',
      select: () => openEngagement(x.id),
    };
  });

  /* --- portfolio-wide counts ------------------------------------------- */

  const mixN = [0, 0, 0, 0, 0];
  let draftedAll = 0;
  let awaiting = 0;
  let filesAll = 0;
  let resAll = 0;
  let inRec = 0;
  let inTot = 0;
  let inNa = 0;
  S.projects.forEach((x) => {
    PHASES.forEach((xp, i) => {
      xp.docs.forEach((d) => {
        const r = x.docs[i + '.' + d.n];
        const st = r ? r.s : 0;
        mixN[st]++;
        if (st >= 4) draftedAll++;
        else if (st >= 1) awaiting++;
      });
      xp.inputs.forEach((_, j) => {
        const v = x.inputs[i + ':' + j];
        if (v === 'na') inNa++;
        else {
          inTot++;
          if (v === true) inRec++;
        }
      });
    });
    filesAll += x.files.length;
    resAll += x.research.length;
  });
  const docsAll = DOCS_PER_ENGAGEMENT * S.projects.length;
  const avgPct = S.projects.length
    ? Math.round(S.projects.reduce((n, x) => n + sprintPct(x, w), 0) / S.projects.length)
    : 0;

  const done = S.projects.filter((x) => sprintPct(x, w) >= 100);
  const openP = S.projects.filter((x) => sprintPct(x, w) < 100);
  const phaseAvgs = PHASES.map((_, i) =>
    S.projects.length ? S.projects.reduce((n, x) => n + phasePct(x, i), 0) / S.projects.length : 0,
  );
  const phaseAvg = Math.round(phaseAvgs.reduce((n, v) => n + v, 0) / (phaseAvgs.length || 1));
  const toBuild = S.projects.filter((x) => PHASES.every((_, i) => phaseDone(x, i)));

  const kpis: any[] = [
    {
      label: 'SPRINTS OPEN',
      value: pad2(openP.length),
      unit: '',
      sub: openP.length
        ? 'Currently mid-sprint across ' + openP.length + ' client' + (openP.length === 1 ? '' : 's')
        : 'Nothing currently in flight',
    },
    {
      label: 'SPRINTS COMPLETED',
      value: pad2(done.length),
      unit: 'of ' + S.projects.length,
      sub: 'All six current phase packs generated',
    },
    { label: 'AVG COMPLETION BY PHASE', value: phaseAvg, unit: '%', sub: 'Share of current phase packs generated, all clients' },
    { label: 'AVG SPRINT DURATION', value: 15, unit: 'days', sub: 'Onboarding to close, standard six-phase sprint' },
    { label: 'MOVED TO BUILD', value: pad2(toBuild.length), unit: 'clients', sub: 'Handed from strategy sprint into the build phase' },
  ];

  const tipK = (k: string) => ({
    on: S.tip === k,
    over: () => actions.set({ tip: k }),
    out: () => actions.set({ tip: null }),
  });
  kpis.forEach((k, i) => {
    const t = tipK('kpi' + i);
    k.tipOn = t.on;
    k.over = t.over;
    k.out = t.out;
  });
  const barsTip = tipK('bars');
  const phaseTip = tipK('phase');

  const bars = S.projects
    .map((x) => {
      const v = sprintPct(x, w);
      return { name: x.name, pct: v, pctw: v + '%', open: () => openEngagement(x.id) };
    })
    .sort((a, b) => b.pct - a.pct);

  const cols = PHASES.map((xp, i) => {
    const avg = S.projects.length ? Math.round(S.projects.reduce((n, x) => n + phasePct(x, i), 0) / S.projects.length) : 0;
    const here = S.projects.filter((x) => curPhaseIdx(x) === i && sprintPct(x, w) < 100).length;
    return {
      num: xp.num,
      pct: avg + '%',
      h: Math.max(4, Math.round(avg * 1.02)) + 'px',
      fill: avg >= 100 ? '#D26B51' : accent,
      here: here ? here + ' here now' : '-',
    };
  });

  const mix = DOC_STATUS.map((lab, i) => ({
    label: lab,
    n: mixN[i],
    c: MIX_COLORS(accent)[i],
    w: (docsAll ? (mixN[i] / docsAll) * 100 : 0) + '%',
  }));

  /* --- needs attention -------------------------------------------------- */

  const attention: any[] = [];
  S.projects.forEach((x) => {
    const ci = curPhaseIdx(x);
    const xp = PHASES[ci];
    const missing = xp.inputs.filter((_, j) => x.inputs[ci + ':' + j] == null).length;
    if (missing) {
      attention.push({
        title: missing + ' input' + (missing > 1 ? 's' : '') + ' due - ' + x.name,
        meta: 'PHASE ' + xp.num + ' · ' + xp.title.toUpperCase(),
        dot: 'var(--ok)',
        go: () => openAt(x.id, ci),
      });
    }
    const rev: number[] = [];
    PHASES.forEach((yp, i) =>
      yp.docs.forEach((d) => {
        const r = x.docs[i + '.' + d.n];
        if (r && r.draft && r.s < 3) rev.push(i);
      }),
    );
    if (rev.length) {
      attention.push({
        title: rev.length + ' draft' + (rev.length > 1 ? 's' : '') + ' in review - ' + x.name,
        meta: 'MARK REVIEWED BEFORE THE PACK SHIPS',
        dot: accent,
        go: () => openAt(x.id, rev[0]),
      });
    }
    if (!x.url) {
      attention.push({
        title: 'Company URL missing - ' + x.name,
        meta: 'PHASE 0 CANNOT OPEN WITHOUT IT',
        dot: 'var(--ok)',
        go: () => openAt(x.id, 0),
      });
    }
  });
  if (!attention.length) {
    attention.push({
      title: 'Every engagement is current',
      meta: 'NO OPEN ITEMS ACROSS THE PORTFOLIO',
      dot: '#D26B51',
      go: () => {},
    });
  }

  attention.forEach((a) => {
    const parts = a.title.split(' - ');
    a.client = (parts[1] || 'PORTFOLIO').toUpperCase();
    a.head = parts[0];
    a.kind = /input/i.test(a.head)
      ? 'INPUTS OUTSTANDING'
      : /draft/i.test(a.head)
        ? 'REVIEW REQUIRED'
        : /url/i.test(a.head)
          ? 'BLOCKED'
          : 'CLEAR';
    a.cta = 'OPEN';
    if (a.kind === 'CLEAR') a.go = () => nav.toDashboard();
    const sv = SEV[a.kind];
    a.dot = sv.c;
    a.tint = sv.tint;
    a.kindLabel = sv.label;
    a.rank = sv.rank;
  });
  attention.sort((a, b) => a.rank - b.rank);

  const attnOpen = attention.filter((a) => a.kind !== 'CLEAR').length;
  const attnCnt = (k: string) => pad2(attention.filter((a) => a.kind === k).length);
  const af = S.af || 'ALL';
  const setAf = (k: string) => () => actions.set({ af: k });

  const attnKpis = [
    {
      label: 'BLOCKED',
      value: attnCnt('BLOCKED'),
      c: SEV['BLOCKED'].c,
      sub: 'Cannot open Phase 0 until a company URL is held',
      on: af === 'BLOCKED',
      bg: af === 'BLOCKED' ? SEV['BLOCKED'].tint : 'var(--card)',
      set: setAf(af === 'BLOCKED' ? 'ALL' : 'BLOCKED'),
    },
    {
      label: 'DRAFTS IN REVIEW',
      value: attnCnt('REVIEW REQUIRED'),
      c: SEV['REVIEW REQUIRED'].c,
      sub: 'Drafts built but not yet marked reviewed',
      on: af === 'REVIEW REQUIRED',
      bg: af === 'REVIEW REQUIRED' ? SEV['REVIEW REQUIRED'].tint : 'var(--card)',
      set: setAf(af === 'REVIEW REQUIRED' ? 'ALL' : 'REVIEW REQUIRED'),
    },
    {
      label: 'INPUTS DUE',
      value: attnCnt('INPUTS OUTSTANDING'),
      c: SEV['INPUTS OUTSTANDING'].c,
      sub: 'Phases waiting on inputs before they can run',
      on: af === 'INPUTS OUTSTANDING',
      bg: af === 'INPUTS OUTSTANDING' ? SEV['INPUTS OUTSTANDING'].tint : 'var(--card)',
      set: setAf(af === 'INPUTS OUTSTANDING' ? 'ALL' : 'INPUTS OUTSTANDING'),
    },
  ];

  const attnChips = [{ label: 'ALL', key: 'ALL', c: 'var(--fg)', n: pad2(attention.length) }]
    .concat(
      ['BLOCKED', 'REVIEW REQUIRED', 'INPUTS OUTSTANDING'].map((k) => ({
        label: SEV[k].label,
        key: k,
        c: SEV[k].c,
        n: attnCnt(k),
      })),
    )
    .map((c) => ({
      label: c.label,
      n: c.n,
      on: af === c.key,
      bg: af === c.key ? c.c : 'transparent',
      fg: af === c.key ? (c.key === 'ALL' ? 'var(--bg)' : '#FFFFFF') : 'var(--fg2)',
      bd: af === c.key ? c.c : 'var(--ln16)',
      dot: c.c,
      dotOp: af === c.key ? '0' : '1',
      set: setAf(c.key),
    }));

  const attnList = af === 'ALL' ? attention : attention.filter((a) => a.kind === af);
  const attnEmpty = attnList.length === 0;
  const attnFilterLabel =
    af === 'ALL' ? pad2(attention.length) + ' OPEN ITEMS' : attnList.length + ' OF ' + attention.length + ' · ' + SEV[af].label;

  /* --- engagement cards -------------------------------------------------- */

  const cards = S.projects.map((x) => {
    const v = sprintPct(x, w);
    const ci = curPhaseIdx(x);
    let dn = 0;
    let ir = 0;
    let it = 0;
    PHASES.forEach((xp, i) => {
      xp.docs.forEach((d) => {
        const r = x.docs[i + '.' + d.n];
        if (r && r.s >= 4) dn++;
      });
      xp.inputs.forEach((_, j) => {
        const vv = x.inputs[i + ':' + j];
        if (vv !== 'na') {
          it++;
          if (vv === true) ir++;
        }
      });
    });
    return {
      name: x.name,
      sector: x.sector,
      pct: v,
      stage: v >= 100 ? 'All six phase packs complete' : 'Phase ' + PHASES[ci].num + ' · ' + PHASES[ci].title,
      segs: PHASES.map((_, i) => {
        const q = phasePct(x, i);
        return { w: q + '%', fill: q >= 100 ? '#D26B51' : accent };
      }),
      stats: [
        { v: dn + '/' + DOCS_PER_ENGAGEMENT, k: 'Delivered' },
        { v: ir + '/' + it, k: 'Inputs' },
        { v: x.files.length + '/' + x.research.length, k: 'Files/rsch' },
      ],
      open: () => openEngagement(x.id),
      blueprint: (e?: { stopPropagation?: () => void }) => {
        e?.stopPropagation?.();
        downloadBlueprint(x);
      },

      /*
       * Removing it. Two presses, and every handler stops the event: the whole
       * card is a button that opens the sprint, so a click that reaches it
       * would navigate away mid-decision.
       */
      removeArmed: S.removeArmed === x.id,
      removeBusy: S.removeBusy && S.removeArmed === x.id,
      removeAria: 'Remove ' + x.name + ' from the portfolio',
      removeLabel: S.removeBusy && S.removeArmed === x.id ? 'REMOVING…' : 'REMOVE',
      arm: (e?: { stopPropagation?: () => void }) => {
        e?.stopPropagation?.();
        actions.armRemove(x.id);
      },
      cancelRemove: (e?: { stopPropagation?: () => void }) => {
        e?.stopPropagation?.();
        actions.armRemove(null);
      },
      confirmRemove: (e?: { stopPropagation?: () => void }) => {
        e?.stopPropagation?.();
        void actions.removeEngagement(x.id);
      },
    };
  });

  const q = S.q || '';
  const ql = q.trim().toLowerCase();
  const hit = (n: string, sec?: string) => !ql || (n + ' ' + (sec || '')).toLowerCase().indexOf(ql) >= 0;

  return {
    projects,
    projectsF: projects.filter((x) => hit(x.name, x.sector)),
    cards,
    cardsF: cards.filter((x) => hit(x.name, x.sector)),
    bars,
    barsF: bars.filter((x) => hit(x.name, '')),
    cols,
    mix,
    kpis,
    barsTip,
    phaseTip,
    avgPct,
    docsAll,
    attention,
    attnList,
    attnKpis,
    attnChips,
    attnEmpty,
    attnFilterLabel,
    attnOpen,
    setAf,
    q,
    ql,
    counts: { draftedAll, awaiting, filesAll, resAll, inRec, inTot, inNa },
    openEngagement,
    openAt,
    downloadBlueprint,
  };
}
