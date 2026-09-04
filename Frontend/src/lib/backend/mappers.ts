/**
 * Backend rows → the shape the console renders from.
 *
 * The view model and the 84 ported components read a single `Engagement`
 * object with keyed maps (`inputs['0:3']`), which is what the original
 * single-file console held in memory. The backend stores those normalised, one
 * row per tick. This is the seam between the two, and the only place that
 * knows both shapes.
 */

import { PACK_KEYS } from '@/lib/playbook/constants';
import type { Engagement, PhaseQuestions } from '@/lib/domain/types';
import type { BackendEngagement, BackendQuestion } from './client';

export function toEngagement(row: BackendEngagement): Engagement {
  const engagement: Engagement = {
    id: row.id,
    name: row.name,
    sector: row.sector,
    url: row.url,
    notes: row.notes,
    scope: (row.scope as Engagement['scope']) ?? 'Department-level sprint',
    created: row.opened_on,
    inputs: {},
    steps: {},
    attended: {},
    docs: {},
    built: {},
    manual: {},
    cq: {},
    files: [],
    links: (row.links ?? []).map((l) => ({ id: l.id, url: l.url })),
    research: [],
  };

  (row.inputs ?? []).forEach((r) => {
    engagement.inputs[`${r.phase}:${r.input_index}`] = r.state === 'na' ? 'na' : true;
  });
  (row.steps ?? []).forEach((r) => {
    engagement.steps[`${r.phase}:${r.step_index}`] = true;
  });
  (row.attendance ?? []).forEach((r) => {
    engagement.attended[`${r.phase}:${r.participant_index}`] = true;
  });
  (row.phase_notes ?? []).forEach((r) => {
    engagement.manual[r.phase] = r.body ?? '';
  });
  (row.deliverables ?? []).forEach((d) => {
    engagement.docs[`${d.phase}.${d.doc_number}`] = {
      s: d.status as never,
      draft: d.draft ?? '',
    };
  });
  (row.files ?? []).forEach((f) => {
    engagement.files.push({
      id: f.id,
      name: f.name,
      size: f.size_bytes,
      phase: f.phase,
      input: f.input_index,
      txt: f.extracted_text ?? undefined,
    });
  });

  /* packs arrive keyed by phase index; the console reads them by field name */
  Object.entries(row.packs ?? {}).forEach(([phase, pack]) => {
    const key = PACK_KEYS[Number(phase)];
    if (key) {
      engagement[key] = pack as Engagement['visual'];
      engagement.built[Number(phase)] = true;
    }
  });

  engagement.cq = groupQuestions(row.questions ?? []);
  return engagement;
}

/** Backend question rows → the per-phase `{ items, covered, sug }` the UI wants. */
export function groupQuestions(rows: BackendQuestion[]): Record<number, PhaseQuestions> {
  const out: Record<number, PhaseQuestions> = {};
  const bucket = (phase: number) =>
    (out[phase] ??= { items: [], covered: [], sug: [], all: [], ts: '' });

  /*
   * Answered rows remain in the database as useful sprint history, but they
   * are no longer open questions.  Show them with the questions the agent
   * deliberately suppressed as already covered, including the recorded
   * answer when there is one.
   */
  const coveredBodies = new Map<number, Set<string>>();
  const addCovered = (phase: number, q: string, source: string) => {
    const key = q.trim().toLocaleLowerCase();
    const seen = coveredBodies.get(phase) ?? new Set<string>();
    if (!key || seen.has(key)) return;
    seen.add(key);
    coveredBodies.set(phase, seen);
    bucket(phase).covered.push({ q, source });
  };

  [...rows]
    .sort((a, b) => a.position - b.position)
    .forEach((q) => {
      const entry = bucket(q.phase);
      if (q.kind === 'open') {
        /*
         * Every question the phase asked, answered or not, kept whole and in
         * order. The next phase's inputs shows one box per question and needs
         * the answer alongside it; splitting them into open and covered, as
         * below, is what the outputs tab wants instead.
         */
        (entry.all ??= []).push({
          id: q.id,
          q: q.body,
          why: q.why,
          who: q.who,
          priority: q.priority ?? 'Medium',
          condition: q.condition ?? undefined,
          gotSoFar: q.partial_got ?? undefined,
          stillMissing: q.partial_missing ?? undefined,
          answer: q.answer ?? undefined,
          quote: q.answer_quote ?? undefined,
          answerSource: q.answer_source ?? undefined,
          answeredAt: q.answered_at ?? undefined,
        });

        if (q.answered_at) {
          const source = q.answer?.trim()
            ? `Answered: ${q.answer.trim()}`
            : q.answer_source?.trim()
              ? `Answered via ${q.answer_source.trim()}`
              : 'Answered earlier in the sprint';
          addCovered(q.phase, q.body, source);
        } else {
          entry.items.push({
            id: q.id,
            q: q.body,
            why: q.why,
            who: q.who,
            priority: q.priority ?? 'Medium',
            condition: q.condition ?? undefined,
            gotSoFar: q.partial_got ?? undefined,
            stillMissing: q.partial_missing ?? undefined,
          });
        }
      } else if (q.kind === 'covered') {
        addCovered(q.phase, q.body, q.source ?? 'earlier in the sprint');
      } else {
        entry.sug.push({ act: q.body, why: q.why, owner: q.who, when: q.horizon ?? 'Next' });
      }
    });
  return out;
}
