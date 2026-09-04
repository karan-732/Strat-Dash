'use client';

import { PHASES } from '@/lib/playbook/phases';
import { DOC_STATUS } from '@/lib/playbook/constants';
import { slug } from '@/lib/domain/format';
import { downloadBlob } from '@/lib/browser/download';
import type { Engagement } from '@/lib/domain/types';

export type { CapturedCard } from './capture';

export interface ReportProgress {
  stage: 'capturing' | 'assembling' | 'done';
  done: number;
  total: number;
}

/**
 * Build and download the phase report.
 *
 * The charts are captured from what is on screen, so this has to run while the
 * OUTPUTS tab for that phase is rendered — which is where the button lives.
 *
 * The rasteriser and the document writer are ~750 KB between them and are only
 * ever needed once, on this click, so they are imported here rather than at
 * module scope and stay out of the console's first load.
 */
export async function downloadPhaseReport(
  p: Engagement,
  pi: number,
  onProgress?: (progress: ReportProgress) => void,
): Promise<{ cards: number }> {
  const ph = PHASES[pi];

  const [{ captureOutputCards }, { buildPhaseReport }] = await Promise.all([
    import('./capture'),
    import('./build-docx'),
  ]);

  const cards = await captureOutputCards((done, total) => onProgress?.({ stage: 'capturing', done, total }));
  onProgress?.({ stage: 'assembling', done: cards.length, total: cards.length });

  const delivered = ph.docs.filter((d) => {
    const r = p.docs[pi + '.' + d.n];
    return r && r.s >= 3;
  }).length;

  const entry = (p.cq || {})[pi];

  const blob = await buildPhaseReport({
    clientName: p.name,
    sector: p.sector,
    url: p.url,
    phaseNumber: ph.num,
    phaseTitle: ph.title,
    phaseSubtitle: ph.subtitle,
    phaseIntro: ph.intro,
    deliveryStatus: `${delivered} of ${ph.docs.length} reviewed or delivered`,
    generatedOn: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
    cards,
    deliverables: ph.docs.map((d) => {
      const rec = p.docs[pi + '.' + d.n];
      return {
        name: d.name,
        desc: d.desc,
        draft: rec?.draft ?? '',
        status: DOC_STATUS[rec ? rec.s : 0],
      };
    }),
    questions: (entry?.items ?? []).map((q) => ({ q: q.q, why: q.why, who: q.who, priority: q.priority })),
    nextMoves: (entry?.sug ?? []).map((m) => ({ act: m.act, why: m.why, owner: m.owner, when: m.when })),
  });

  downloadBlob(`${slug(p.name)}-phase-${ph.num}-report.docx`, blob);
  onProgress?.({ stage: 'done', done: cards.length, total: cards.length });
  return { cards: cards.length };
}
