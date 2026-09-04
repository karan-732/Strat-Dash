'use client';

/*
 * Development harness for the phase output cards.
 *
 * Renders any phase without calling the backend or a model:
 *
 *   /pack-preview?phase=0
 *   /pack-preview?phase=1&mode=inputs
 *   /pack-preview?phase=1&mode=unchecked
 *   /pack-preview?phase=2&mode=locked
 *
 * The inputs mode can simulate a successful generation locally, which makes
 * the complete ask-first -> generate -> output interaction safe to test.
 */

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ConsoleSurface } from '@/features/console/ConsoleSurface';
import { buildViewModel } from '@/features/console/view-model';
import { DEMO_PACKS, demoEngagement } from '@/features/console/fixtures/demo';
import { ACCENT, PACK_KEYS } from '@/lib/playbook/constants';
import { PHASES } from '@/lib/playbook/phases';
import { useConsoleStore } from '@/store/console-store';

const noop = () => {};

function Preview() {
  const store = useConsoleStore();
  const params = useSearchParams();

  const requested = Number(params.get('phase'));
  const phase = Number.isInteger(requested) && requested >= 0 && requested < PHASES.length ? requested : 0;
  const mode =
    params.get('mode') === 'inputs'
      ? 'inputs'
      : params.get('mode') === 'unchecked'
        ? 'unchecked'
        : params.get('mode') === 'locked'
          ? 'locked'
          : 'outputs';
  const [previewTab, setPreviewTab] = useState<'inputs' | 'docs'>(mode === 'outputs' ? 'docs' : 'inputs');
  const [simulatedGenerated, setSimulatedGenerated] = useState(false);
  const engagement = demoEngagement();

  if (mode !== 'outputs') {
    const firstRemoved = mode === 'locked' && phase > 0 ? phase - 1 : phase;
    for (let i = firstRemoved; i < PHASES.length; i++) {
      delete engagement[PACK_KEYS[i]];
      delete engagement.built[i];
    }
    if (simulatedGenerated && mode === 'inputs') {
      engagement[PACK_KEYS[phase]] = DEMO_PACKS[phase];
      engagement.built[phase] = true;
    }
  }

  const readiness = {
    canRun: true,
    confidence: 76,
    verdict: `Phase ${PHASES[phase].num} can run with the evidence held so far; confirm the named gap to sharpen the output.`,
    needs: [
      {
        ask: 'Which operating measure should the client use as the decision baseline?',
        why: 'It anchors the value comparison carried into the next phase.',
        who: 'Client sponsor',
        severity: 'needed' as const,
        haveAlready: false,
        whereFrom: 'Latest operating review',
      },
    ],
    willAssume: [
      {
        assumption: 'The latest reported operating period is representative.',
        ifWrong: 'The opportunity sizing will need to be rebased.',
      },
    ],
  };

  /* Never let this development route reach persistence or a model. */
  const actions = {
    ...store,
    set: (partial: unknown) => {
      if (typeof partial === 'object' && partial && 'tab' in partial) {
        const tab = (partial as { tab?: unknown }).tab;
        if (tab === 'inputs' || tab === 'docs') setPreviewTab(tab);
      }
    },
    say: noop,
    current: () => engagement,
    loadPortfolio: async () => {},
    refresh: async () => {},
    loadCredits: async () => {},
    patchLocal: noop,
    toggleInput: noop,
    markInputNa: noop,
    toggleStep: noop,
    toggleAttendance: noop,
    saveNote: noop,
    setUrl: noop,
    addLink: noop,
    removeLink: noop,
    setDocStatus: noop,
    setDocDraft: noop,
    addFiles: noop,
    removeFile: noop,
    createEngagement: async () => null,
    syncManualDraft: noop,
    loadIntake: async () => {},
    generatePhase: async () => {
      setSimulatedGenerated(true);
      setPreviewTab('docs');
    },
    resetPhaseOutputs: async () => {
      setSimulatedGenerated(false);
      setPreviewTab('inputs');
    },
    submitAnswers: async () => {},
    uploadAnswers: async () => {},
    captureToLibrary: () => 0,
    removeFromLibrary: noop,
    generateDoc: async () => {},
    runResearch: async () => {},
    fileBlob: () => undefined,
  };

  const v = buildViewModel({
    route: { view: 'project', engagementId: engagement.id, phase, projectHome: false },
    state: {
      ...store,
      projects: [engagement],
      cur: engagement.id,
      phase,
      tab: previewTab,
      intake: mode === 'inputs' ? { [phase]: readiness } : {},
      intakeBusy: {},
      packBusy: [false, false, false, false, false, false],
      /* the fixture is the whole engagement, so nothing is still arriving */
      hydrated: { [engagement.id]: true },
      hydrating: {},
    },
    actions,
    nav: { toDashboard: noop, toAttention: noop, toEngagement: noop, toPhase: noop, toLibrary: noop },
    theme: { t: 'light', toggle: noop },
    settings: { accent: ACCENT, weighting: 'Equal phases', model: 'fixture' },
  });

  return <ConsoleSurface v={v} />;
}

export default function PackPreviewPage() {
  return (
    <Suspense fallback={null}>
      <Preview />
    </Suspense>
  );
}
