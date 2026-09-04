/* eslint-disable @typescript-eslint/no-explicit-any */
import { PHASES } from '@/lib/playbook/phases';
import { DOC_STATUS, GEN_STAGES, PACK_KEYS } from '@/lib/playbook/constants';
import { phasePct, phaseUnlocked } from '@/lib/domain/progress';
import { pad2, slug } from '@/lib/domain/format';
import { questionsMd } from '@/lib/export/documents';
import { wrapDoc } from '@/lib/export/wrappers';
import { downloadPhaseReport } from '@/lib/export/report';
import { download } from '@/lib/browser/download';
import type { Engagement } from '@/lib/domain/types';
import type { ViewModelDeps } from './deps';
import { PHASE_OUTPUT_COPY } from './output-copy';

/**
 * The OUTPUTS tab: the pack header and generation ladder, the download
 * actions, the questions the phase leaves open and the next moves it implies.
 */
export function buildPhaseOutput(deps: ViewModelDeps, p: Engagement, pi: number) {
  const { state: S, actions, nav } = deps;
  const reportBusy = S.reportBusy;
  const ph = PHASES[pi];

  const phaseBuilt =
    !!(p.built && p.built[pi]) ||
    ph.docs.some((d) => {
      const r = p.docs[pi + '.' + d.n];
      return !!(r && (r.s > 0 || r.draft));
    });

  const naCount = ph.inputs.filter((_, i) => p.inputs[pi + ':' + i] === 'na').length;
  const inputsDone = ph.inputs.filter((_, i) => p.inputs[pi + ':' + i] === true).length;
  const inputsLabel =
    inputsDone + ' / ' + (ph.inputs.length - naCount) + ' RECEIVED' + (naCount ? '  ·  ' + naCount + ' NOT AVAILABLE' : '');

  const delivered = ph.docs.filter((d) => {
    const r = p.docs[pi + '.' + d.n];
    return r && r.s >= 3;
  }).length;
  const drafted = ph.docs.filter((d) => {
    const r = p.docs[pi + '.' + d.n];
    return r && r.draft;
  }).length;

  const phaseComplete = phasePct(p, pi) >= 100;
  const phasePackageReady = phaseComplete || drafted === ph.docs.length;
  const phaseNeedsBuild = !phaseBuilt || drafted < ph.docs.length;

  const copy = PHASE_OUTPUT_COPY[pi] || PHASE_OUTPUT_COPY[0];

  const genIdx = Math.max(0, Math.min(GEN_STAGES.length - 1, Number(S.genStage) || 0));
  const genSteps = GEN_STAGES.map((g, i) => {
    /* Peer benchmarking is the only conditional backend stage: Phase 0 runs it. */
    const skipped = pi !== 0 && i === 4;
    return {
      label: g[0] + (skipped ? ' · PHASE 0 ONLY' : ''),
      mark: skipped ? '–' : i < genIdx ? '✓' : i === genIdx ? '▸' : '·',
      fg: skipped ? 'var(--fg3)' : i <= genIdx ? 'var(--fg)' : 'var(--fg3)',
      dotBg: skipped ? 'var(--card3)' : i < genIdx ? '#D26B51' : i === genIdx ? 'rgba(210,107,81,.2)' : 'var(--card3)',
      dotFg: skipped ? 'var(--fg3)' : i < genIdx ? '#FFFFFF' : i === genIdx ? '#D26B51' : 'var(--fg3)',
    };
  });
  /*
   * What the run has actually found so far.
   *
   * A phase takes minutes and the ladder said only which of eight stages it
   * was on. Every one of these already arrives on the stream and was being
   * discarded or compressed into a toast after the fact - so the screen said
   * nothing while the interesting part was happening, and a run that read six
   * sources looked the same as one that read none.
   */
  const run = S.run && S.run.phase === pi ? S.run : null;
  const host = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  };
  const genFound = (() => {
    if (!run) return { has: false, lines: [] as { label: string; value: string }[], warnings: [] as string[] };
    const lines: { label: string; value: string }[] = [];
    if (run.sources?.length) {
      lines.push({
        label: 'READ LIVE',
        value: [...new Set(run.sources.map(host))].slice(0, 6).join(' · '),
      });
    }
    if (run.evidence) {
      lines.push({
        label: 'EVIDENCE',
        value:
          `${run.evidence.reported} reported · ${run.evidence.derived} derived` +
          (run.evidence.absent ? ` · ${run.evidence.absent} not found` : ''),
      });
    }
    if (run.review) {
      lines.push({
        label: 'CHECKED',
        value:
          `scored ${run.review.score} of 100` +
          (run.review.findings?.length ? ` · ${run.review.findings.length} to look at` : ''),
      });
    }
    return { has: lines.length > 0, lines, warnings: run.warnings ?? [] };
  })();

  const activeGenStages = GEN_STAGES.filter((_, i) => pi === 0 || i !== 4);
  const completedGenStages = GEN_STAGES.reduce(
    (count, _, i) => count + (i <= genIdx && (pi === 0 || i !== 4) ? 1 : 0),
    0,
  );
  const genProgress = Math.round((completedGenStages / activeGenStages.length) * 100);

  const outputKpis = copy.kpis.map((x) => ({ label: x[0], value: x[1], note: x[2] }));
  const outputBars = copy.bars.map((x) => ({ label: x[0], value: x[1], width: x[1] + '%' }));
  const outputMatrix = copy.matrix.map((x, i) => ({
    label: x[0],
    value: x[1],
    note: x[2],
    edge: i === 0 ? 'rgba(210,107,81,.46)' : 'var(--ln10)',
    bg: i === 0 ? 'rgba(210,107,81,.08)' : 'var(--card0)',
  }));
  const outputDocs = ph.docs.map((d, i) => ({
    nn: pad2(i + 1),
    name: d.name,
    insight: copy.insights[i % copy.insights.length],
    tag: i % 3 === 0 ? 'DECISION VIEW' : i % 3 === 1 ? 'EVIDENCE VIEW' : 'WORKING VIEW',
    signal: i % 2 === 0 ? 'HIGH SIGNAL' : 'VALIDATED',
  }));

  const outputBusy = !!S.packBusy[pi];
  const packHeld = !!p[PACK_KEYS[pi]];
  const outputReady = packHeld && !outputBusy;
  const outputEmpty = !packHeld && !outputBusy;
  const unlocked = phaseUnlocked(p, pi);


  /* --- exports ----------------------------------------------------------- */

  const downloadPhase = () => {
    let md = '# Phase ' + ph.num + ' - ' + ph.title + '\n\n' + p.name + ' · ' + p.sector + '\n';
    ph.docs.forEach((d) => {
      const rec = p.docs[pi + '.' + d.n];
      md +=
        '\n\n# ' +
        d.name +
        '\n\n' +
        (rec && rec.draft
          ? rec.draft
          : '_' +
            DOC_STATUS[rec ? rec.s : 0] +
            ' - status carried from the sprint tracker; no draft text held in this console. Rebuild the package to generate it._') +
        '\n';
    });
    md += questionsMd(p, pi);
    download(
      slug(p.name) + '-phase-' + ph.num + '-output.doc',
      wrapDoc('Phase ' + ph.num + ' - ' + ph.title + ' · ' + p.name, md),
      'application/msword',
    );
  };

  /*
   * The full report: every generated view captured from the screen as an
   * image with a note on what it shows, wrapped in a cover page, an executive
   * summary and the deliverables, as a .docx.
   */
  const downloadFullReport = async () => {
    if (reportBusy) return;
    actions.set({ reportBusy: true });
    try {
      const { cards } = await downloadPhaseReport(p, pi, (progress) => {
        if (progress.stage === 'capturing') {
          actions.set({ reportStage: `CAPTURING VIEWS · ${progress.done} / ${progress.total}` });
        } else if (progress.stage === 'assembling') {
          actions.set({ reportStage: 'ASSEMBLING THE DOCUMENT…' });
        }
      });
      actions.say(
        cards
          ? `Phase ${ph.num} report downloaded — ${cards} view${cards === 1 ? '' : 's'} captured, with the deliverables and open questions.`
          : `Phase ${ph.num} report downloaded. Run the phase first if you want the charts in it.`,
      );
    } catch (e) {
      actions.say('Could not build the report: ' + (e instanceof Error ? e.message : 'unknown error'));
    } finally {
      actions.set({ reportBusy: false, reportStage: '' });
    }
  };

  /* --- questions the phase leaves open ---------------------------------- */

  /*
   * On the producing phase's OUTPUTS: the count and the two actions, and
   * nothing else.
   *
   * The whole list used to render twice — here, and at the top of the next
   * phase's INPUTS where the answers land — each question with its reason and
   * its own answer box. Two editable copies of one set of questions is not
   * two jobs, it is the same job done in the wrong place: by the time there is
   * an answer to record you are working the next phase, which is the surface
   * that has the transcript reader beside it. So the questions are shown once,
   * there, and what is kept here is what only belongs here: that the phase
   * raised them, and the COPY and DOWNLOAD you send the client from.
   */
  const cq = (() => {
    const entry = (p.cq || {})[pi] || null;
    const asked = entry?.all ?? entry?.items ?? [];
    const answered = asked.filter((q) => (q.answer ?? '').trim()).length;
    const next = pi + 1 < PHASES.length ? PHASES[pi + 1] : null;
    const running = !!S.packBusy[pi];

    return {
      /* while the phase runs, say the questions are coming; questions are the
       * pipeline's last stage, so the block would otherwise appear late and
       * unannounced */
      show: running || asked.length > 0,
      loading: running,
      loadingNote: 'READING THE PACK FOR WHAT IT CANNOT ANSWER…',
      head: 'QUESTIONS FOR THE CLIENT',
      has: asked.length > 0,
      count: asked.length,
      countLabel: `${asked.length} QUESTION${asked.length === 1 ? '' : 'S'}`,
      answeredLabel: answered ? `${answered} ANSWERED` : '',
      /* where they are worked, which is the only thing left to say here */
      whereNote: next
        ? `Answered on Phase ${next.num}\u2019s INPUTS, beside the transcript reader.`
        : 'The last phase, so these close the sprint rather than feeding another.',
      openLabel: next ? `OPEN PHASE ${next.num}` : '',
      openAria: next ? `Go to Phase ${next.num} to record the answers` : '',
      openNext: () => {
        if (next) nav.toPhase(p.id, pi + 1);
      },
      emptyNote: 'This phase raised nothing that needs the client.',
      copy: () => {
        const t = questionsMd(p, pi).replace(/\*\*/g, '').trim();
        try {
          void navigator.clipboard.writeText(t);
          actions.say('Questions copied to the clipboard.');
        } catch {
          actions.say('Could not copy - download instead.');
        }
      },
      download: () =>
        download(
          slug(p.name) + '-phase-' + ph.num + '-client-questions.doc',
          wrapDoc(
            'Phase ' + ph.num + ' questions - ' + p.name,
            '# Questions for ' + p.name +
              '\n\n**Phase ' + ph.num + ' - ' + ph.title + '**' +
              questionsMd(p, pi),
          ),
          'application/msword',
        ),
    };
  })();

  /* --- our own next moves ------------------------------------------------ */

  const sug = (() => {
    const ent = (p.cq || {})[pi] || null;
    const its = ent ? ent.sug || [] : [];
    const md = () =>
      '# What we do next · ' +
      p.name +
      '\n\n**Phase ' +
      ph.num +
      ' - ' +
      ph.title +
      '**\n\n' +
      its
        .map((x, i) => i + 1 + '. **' + x.act + '**  \n   ' + (x.why ? x.why + '. ' : '') + 'Owner: ' + x.owner + ' · ' + x.when)
        .join('\n');
    return {
      /*
       * `qBusy` is one flag for the whole console, so generating any phase
       * hid every other phase's next moves. What matters is whether this
       * phase is running.
       */
      show: !S.packBusy[pi] && its.length > 0,
      head: 'WHAT WE DO NEXT · ' + its.length + ' POINTER' + (its.length === 1 ? '' : 'S'),
      note: 'Ours, not the client’s — read off what this phase produced.',
      items: its.map((x, i) => ({
        nn: pad2(i + 1),
        act: x.act,
        why: x.why,
        owner: x.owner,
        when: String(x.when || '').toUpperCase(),
      })),
      copy: () => {
        const t = md().replace(/\*\*/g, '').trim();
        try {
          void navigator.clipboard.writeText(t);
          actions.say('Next steps copied to the clipboard.');
        } catch {
          actions.say('Could not copy - download instead.');
        }
      },
      download: () =>
        download(slug(p.name) + '-phase-' + ph.num + '-next-steps.doc', wrapDoc('Phase ' + ph.num + ' next steps - ' + p.name, md()), 'application/msword'),
    };
  })();

  return {
    phaseBuilt,
    inputsLabel,
    delivered,
    drafted,
    phasePackageReady,
    phaseNeedsBuild,
    copy,
    genIdx,
    genSteps,
    genFound,
    genProgress,
    outputKpis,
    outputBars,
    outputMatrix,
    outputDocs,
    outputBusy,
    outputReady,
    outputEmpty,
    downloadPhase,
    downloadFullReport,
    reportBusy,
    reportStage: S.reportStage,
    cq,
    sug,
    unlocked,
  } as any;
}
