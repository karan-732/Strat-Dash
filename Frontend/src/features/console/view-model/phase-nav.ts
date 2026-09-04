import { PHASES } from '@/lib/playbook/phases';
import { firstMissingPhase, firstOpenPhase, lockNote, phaseDone, phasePct, phaseUnlocked } from '@/lib/domain/progress';
import type { Engagement } from '@/lib/domain/types';
import type { ViewModelDeps } from './deps';
import { resetEngagementScroll } from './disclosure';
import { rememberTabScroll } from './tab-scroll';

/** The six phase cards on the overview, and the phase rail in the workspace. */
export function buildPhaseNav(deps: ViewModelDeps, p: Engagement, pi: number) {
  const { actions, nav, settings } = deps;

  const phases = PHASES.map((x, i) => {
    const pct = phasePct(p, i);
    const on = i === pi;
    const unlocked = phaseUnlocked(p, i);
    const done = phaseDone(p, i);
    const next = !done && unlocked && i === firstOpenPhase(p);
    return {
      locked: !unlocked,
      cardOpacity: unlocked ? '1' : '.5',
      cardCursor: unlocked ? 'pointer' : 'not-allowed',
      lockLabel: unlocked ? '' : 'PHASE ' + PHASES[firstMissingPhase(p, i)].num + ' FIRST',
      num: x.num,
      title: x.title,
      subtitle: x.subtitle,
      intro: x.intro,
      note: x.note,
      pct,
      pctw: pct + '%',
      badge: !unlocked ? 'LOCKED' : done ? 'COMPLETE' : pct + '%',
      notClosed: !done,
      state:
        !unlocked
          ? 'LOCKED'
          : done
            ? 'COMPLETE'
            : next
              ? 'NEXT'
              : 'NOT STARTED',
      openLabel: unlocked ? 'OPEN' : 'LOCKED',
      actionLabel: 'Open Phase ' + x.num + ': ' + x.title,
      progressLabel: 'Phase ' + x.num + ' completion: ' + pct + '%',
      popoverId: 'phase-' + x.num + '-brief',
      titleId: 'phase-' + x.num + '-title',
      pctFg: !unlocked ? 'var(--fg3)' : done ? 'var(--accent)' : 'var(--fg2)',
      bg: on ? 'var(--card)' : 'var(--card0)',
      edge: on ? 'var(--fg)' : 'transparent',
      cardBg: next ? 'var(--card3)' : 'var(--card)',
      cardBd: next ? 'var(--accent)' : 'var(--ln12)',
      cardShadow: next
        ? '0 0 0 1px rgba(210,107,81,.16),0 18px 36px -26px rgba(210,107,81,.65)'
        : '0 1px 2px var(--sh50),0 18px 34px -30px var(--sh90)',
      ariaCurrent: on ? 'step' : 'false',
      select: () => {
        if (!unlocked) {
          actions.say(lockNote(p, i));
          return;
        }
        nav.toPhase(p.id, i);
        resetEngagementScroll('.eng-phase-hero-title');
      },
    };
  });

  const tabDefs: [('inputs' | 'docs'), string][] = [
    ['inputs', 'INPUTS'],
    ['docs', 'OUTPUTS'],
  ];
  const tabs = tabDefs.map((t) => ({
    label: t[1],
    edge: deps.state.tab === t[0] ? 'var(--fg)' : 'transparent',
    fg: deps.state.tab === t[0] ? 'var(--fg)' : 'var(--fg3)',
    selected: deps.state.tab === t[0] ? 'true' : 'false',
    /*
     * Both tabs share one scroller and only one renders at a time, so the
     * container's height collapses on the swap and the browser clamps the
     * offset. Save where this tab was and put the other one back where it was
     * left, or a switch mid-pack drops you somewhere arbitrary.
     */
    go: () => {
      rememberTabScroll(`${p.id}:${pi}:${deps.state.tab}`, `${p.id}:${pi}:${t[0]}`);
      actions.set({ tab: t[0], inputPanel: false, workflowPanel: false, researchPanel: false });
    },
  }));

  void settings;
  return { phases, tabs };
}
