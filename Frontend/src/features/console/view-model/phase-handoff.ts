import { PHASES } from '@/lib/playbook/phases';
import { pad2 } from '@/lib/domain/format';
import type { ClientQuestion, Engagement } from '@/lib/domain/types';
import type { ViewModelDeps } from './deps';
import { phaseBrief } from './phase-brief';

/**
 * What the previous phase handed this one: the questions it put to the client,
 * and the two ways an answer arrives.
 *
 * The console used to show a phase's questions only on the phase that produced
 * them, which is the wrong end of the chain — by the time you are working Phase
 * 1, what matters is not that Phase 0 asked five things, it is what came back.
 * Then it showed them at both ends, which was worse: two editable copies of one
 * list, two clicks apart. This is the one place they are worked. The producing
 * phase's OUTPUTS keeps the count and the COPY and DOWNLOAD you send the client
 * from, and nothing else.
 *
 * Two routes in, different in kind. Typing into the box beside a question
 * writes straight to that row — which question was meant is not in doubt, so
 * no model runs. A call transcript is the other way round: it answers whatever
 * it happens to answer, in no order, so the reader works out which questions it
 * closed and says so against each one.
 *
 * What this surface deliberately does not carry: the previous phase's own next
 * moves, which are ours rather than the client's and belong with the output
 * that produced them; and any tally of what is outstanding. This is the list to
 * put to a client, not a progress report on it.
 */
export function buildPhaseHandoff(deps: ViewModelDeps, p: Engagement, pi: number) {
  const { state: S, actions } = deps;
  const ph = PHASES[pi];
  const brief = phaseBrief(pi);
  const prev = pi > 0 ? PHASES[pi - 1] : null;
  const entry = prev ? (p.cq || {})[pi - 1] || null : null;

  /*
   * Every question the phase asked, in the order it asked them, answered or
   * not. The fallback to `items` covers the demo fixtures, which carry only
   * the unanswered ones.
   */
  const asked: ClientQuestion[] = entry?.all ?? entry?.items ?? [];

  /*
   * Whether there is anything still to wait for.
   *
   * Two ways a question can be absent rather than nonexistent: the engagement
   * itself has not been fetched in full yet — the portfolio paints shells with
   * no questions on them — or the phase that raises them is running right now,
   * and questions are the pipeline's last stage. Either way the block must say
   * it is waiting instead of stating that nothing was raised.
   */
  const loading = !!prev && (!S.hydrated[p.id] || !!S.packBusy[pi - 1]);
  const loadingNote = !prev
    ? ''
    : S.packBusy[pi - 1]
      ? `PHASE ${prev.num} IS STILL RUNNING · ITS QUESTIONS ARRIVE LAST`
      : 'LOADING THE QUESTIONS…';

  /*
   * Why a question was asked at all. The agent raises one only where a figure
   * is benchmarked rather than reported, a conclusion rests on an assumption, a
   * decision has no owner, or this phase needs an input the last one could not
   * produce. Saying which stops the list reading like a form.
   */
  const conditionNote: Record<string, string> = {
    benchmarked: 'A FIGURE HERE IS ESTIMATED, NOT REPORTED',
    assumption: 'A CONCLUSION RESTS ON THIS',
    'no-owner': 'NO OWNER NAMED FOR THIS',
    'next-phase-input': `PHASE ${ph.num} NEEDS THIS`,
  };

  return {
    /*
     * The framing, from Phase 1 on only. Phase 0 has nothing handed to it, so
     * a question header there is answering something nobody asked - and it was
     * the first thing on a brand-new engagement's screen.
     */
    showQuestion: !!prev && !!brief.question,
    question: brief.question,
    derivation: brief.derivation,
    bounds: brief.bounds.toUpperCase(),
    eyebrow: `PHASE ${ph.num} · THE QUESTION THIS PHASE ASKS`,

    /* the questions themselves, only from phase 1 on */
    show: !!prev,
    prevNum: prev ? prev.num : '',
    head: prev ? `QUESTIONS FOR THE CLIENT · FROM PHASE ${prev.num}` : '',
    hasAsked: asked.length > 0,
    loading,
    loadingNote,
    emptyNote: prev ? `Phase ${prev.num} raised nothing for the client.` : '',

    items: asked.map((q, i) => {
      const id = q.id ?? '';
      const saved = (q.answer ?? '').trim();
      /*
       * Editing exactly while a draft is held. An answered question is read
       * as text and takes a fraction of the height; only the one being
       * changed opens a box.
       */
      const editing = !!id && id in S.answerDrafts;
      const fromTranscript = !!saved && !!q.answerSource && q.answerSource !== 'consultant';
      return {
        id,
        nn: pad2(i + 1),
        q: q.q,
        why: q.why,
        who: q.who,
        pri: String(q.priority || '').toUpperCase(),
        priClass: /^high$/i.test(q.priority || '')
          ? 'is-high'
          : /^low$/i.test(q.priority || '')
            ? 'is-low'
            : 'is-medium',
        condition: q.condition ? conditionNote[q.condition] || '' : '',

        answered: !!saved,
        answer: saved,
        fromTranscript,
        sourceNote: fromTranscript ? 'FROM THE TRANSCRIPT' : saved ? 'ENTERED BY HAND' : '',
        quote: fromTranscript ? (q.quote ?? '') : '',

        partial: !saved && !!q.stillMissing,
        gotSoFar: q.gotSoFar ?? '',
        stillMissing: q.stillMissing ?? '',

        editing,
        draft: editing ? (S.answerDrafts[id] ?? '') : saved,
        busy: !!id && !!S.answerSaving[id],
        placeholder: 'Type the client\u2019s answer here\u2026',
        boxAria: `Answer for: ${q.q}`,
        editAria: `Edit the answer for: ${q.q}`,
        saveLabel: (() => {
          if (id && S.answerSaving[id]) return 'SAVING\u2026';
          if (saved && !(S.answerDrafts[id] ?? '').trim()) return 'CLEAR';
          return 'SAVE';
        })(),
        onDraft: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          if (id) actions.setAnswerDraft(id, e.target.value);
        },
        beginEdit: () => {
          if (id) actions.setAnswerDraft(id, saved);
        },
        cancel: () => {
          if (id) actions.cancelAnswerDraft(id);
        },
        save: () => {
          if (id) void actions.saveAnswer(id);
        },
      };
    }),

    /*
     * The transcript route. A call answers several questions at once and in no
     * order, so the material goes in whole and the reader decides what it
     * closed — which is why this is a separate control from the boxes above
     * rather than a bigger version of one.
     */
    fathomLabel: 'FETCH FROM FATHOM',
    fathomOpen: !!S.fathomOpen,
    fathomToggleAria: S.fathomOpen
      ? 'Hide the transcript options'
      : 'Fetch the call transcript from Fathom',
    toggleFathom: () => actions.set({ fathomOpen: !S.fathomOpen }),

    transcriptNote:
      'Read against the questions above; each one it answers is marked here in the client’s own words.',
    uploadLabel: 'ATTACH A TRANSCRIPT',
    uploadNote: 'vtt, txt, md, csv or xlsx.',
    uploadAria: `Attach the Phase ${prev ? prev.num : ph.num} call transcript`,
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (file) void actions.uploadAnswers(file, pi);
    },

    pasteLabel: 'OR PASTE IT',
    pastePlaceholder: 'Paste the transcript here — it does not have to be tidy or in order…',
    pasteDraft: S.transcript ?? '',
    onPaste: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      actions.set({ transcript: e.target.value }),
    readLabel: S.answersBusy ? 'READING IT…' : 'READ THE TRANSCRIPT',
    busy: !!S.answersBusy,
    readTranscript: () => {
      const material = (S.transcript ?? '').trim();
      if (!material) {
        actions.say('Paste the transcript first — the box is empty.');
        return;
      }
      void actions.submitAnswers(material, `Phase ${prev ? prev.num : ph.num} call transcript`, pi);
      actions.set({ transcript: '' });
    },
  };
}
