import { PHASES } from '@/lib/playbook/phases';
import { buildContext, textSources } from '@/lib/ai/context';
import type { DeliverableDefinition, Engagement } from '@/lib/domain/types';
import { DELIVERABLE, PACK_BRIEFS, PACK_SHAPES, PACK_SYSTEMS, PHASE2_SCOPE_BRIEF, QUESTIONS, RESEARCH } from './generated';

export { PACK_SHAPES, PACK_BRIEFS, PEER_RANK, QUESTIONS, DELIVERABLE, RESEARCH } from './generated';

/*
 * Corrections applied on top of the extracted prompts, so `generated.ts` stays
 * a faithful copy of the source console and every deviation is visible here.
 *
 * The Phase 3 friction taxonomy in the source lists thirteen types; the
 * playbook (3.5) lists fifteen — forecasting and monitoring were missing.
 */
const SYSTEM_CORRECTIONS: [string, string][] = [
  [
    'quality check, exception handling',
    'quality check, forecasting, monitoring, exception handling',
  ],
];

function correct(system: string): string {
  return SYSTEM_CORRECTIONS.reduce((out, [from, to]) => out.replace(from, to), system);
}

const header = (p: Engagement) =>
  'Company: ' + p.name + '\nSector: ' + p.sector + '\nWebsite: ' + (p.url || 'not supplied');

/**
 * The user prompt for a phase pack.
 *
 * Phase 0 is the only phase with nothing before it, so it works from the raw
 * engagement fields; every later phase is handed the accumulated sprint
 * context. Phase 2 swaps the playbook brief for a scope override, because a
 * department sprint and a single-process sprint diagnose differently.
 */
export function packPrompt(p: Engagement, pi: number): string {
  const shape = '\n\nReturn JSON matching exactly this shape:\n' + PACK_SHAPES[pi];

  if (pi === 0) {
    return (
      header(p) +
      '\nEngagement notes: ' +
      (p.notes || 'none') +
      ((p.links || []).length ? '\nPasted source links: ' + p.links.map((l) => l.url).join('; ') : '') +
      PACK_BRIEFS[0] +
      shape
    );
  }

  const brief =
    pi === 2
      ? /process/i.test(p.scope || '')
        ? PHASE2_SCOPE_BRIEF.process
        : PHASE2_SCOPE_BRIEF.department
      : PACK_BRIEFS[pi];

  return header(p) + '\n\nProject context:\n' + buildContext(p, pi) + brief + shape;
}

export function packSystem(pi: number): string {
  return correct(PACK_SYSTEMS[pi]);
}

/* ------------------------------------------------------------ peer ranking */

export function peerSetupPrompt(p: Engagement, shape: string): string {
  return (
    'Company: ' +
    p.name +
    '\nSector: ' +
    p.sector +
    '\nWebsite: ' +
    (p.url || 'not supplied') +
    '\nEngagement notes: ' +
    (p.notes || 'none') +
    '\n\nReturn JSON matching exactly this shape:\n' +
    shape
  );
}

export interface PeerParameter {
  name: string;
  why?: string;
  weight?: number;
  unit?: string;
  betterHigh?: boolean;
}

export interface Peer {
  name: string;
  url?: string;
  why?: string;
}

export function peerScorePrompt(p: Engagement, params: PeerParameter[], peers: Peer[], shape: string): string {
  return (
    'Client: ' +
    p.name +
    ' (' +
    p.sector +
    ')\n\nParameters that decide the winner here, with weights:\n' +
    params
      .map(
        (x) =>
          '- ' +
          x.name +
          ' [' +
          (x.unit || 'score') +
          ' · weight ' +
          x.weight +
          '% · ' +
          (x.betterHigh === false ? 'lower is better' : 'higher is better') +
          '] ' +
          (x.why || ''),
      )
      .join('\n') +
    '\n\nPeer set:\n' +
    peers.map((x) => '- ' + x.name + (x.url ? ' (' + x.url + ')' : '') + (x.why ? ' - ' + x.why : '')).join('\n') +
    '\n\nProject context:\n' +
    buildContext(p, 0) +
    '\n\nScore the client and every peer on every parameter above and return JSON matching exactly this shape:\n' +
    shape
  );
}

/* --------------------------------------------------- questions + next moves */

export function questionsPrompt(p: Engagement, pi: number, pack: unknown): string {
  const ph = PHASES[pi];
  const drafts: string[] = [];
  ph.docs.forEach((d) => {
    const rec = p.docs[pi + '.' + d.n];
    if (rec && rec.draft) drafts.push('- ' + d.name + ': ' + String(rec.draft).slice(0, 1000));
  });

  const trs = textSources(p, pi);

  const prior: string[] = [];
  Object.keys(p.cq || {}).forEach((k) => {
    if (String(k) === String(pi)) return;
    const ent = p.cq[Number(k)] || { items: [], covered: [], sug: [], ts: '' };
    const pn = PHASES[Number(k)] ? PHASES[Number(k)].num : k;
    (ent.items || []).forEach((it) => prior.push('- [Phase ' + pn + ', already sent to the client] ' + it.q));
    (ent.covered || []).forEach((it) => prior.push('- [already asked in a meeting] ' + it.q));
  });

  const mine = String((p.manual || {})[pi] || '').slice(0, 4000);
  const naList: string[] = [];
  ph.inputs.forEach((label, j) => {
    if (p.inputs[pi + ':' + j] === 'na') naList.push(label);
  });

  return (
    'Client: ' +
    p.name +
    '\nSector: ' +
    p.sector +
    '\nPhase just completed: Phase ' +
    ph.num +
    ' - ' +
    ph.title +
    (ph.subtitle ? ' (' + ph.subtitle + ')' : '') +
    '\nWhat this phase had to establish: ' +
    (ph.intro || ph.subtitle || '') +
    '\n\nProject context:\n' +
    buildContext(p, pi) +
    (pack
      ? '\n\nTHE OUTPUT PACK THIS PHASE JUST PRODUCED - its own figures, rankings, rows and charts. This is the primary material: anchor every question and every suggestion to something specific inside it and quote the figure or the name you are reacting to:\n' +
        JSON.stringify(pack).slice(0, 9000)
      : '') +
    (mine ? '\n\nWhat the consultant entered by hand for this phase:\n' + mine : '') +
    (naList.length
      ? '\n\nInputs the client could not supply for this phase, so the pack benchmarked them - a question here is only worth asking if the real figure would move a conclusion:\n' +
        naList.map((x) => '- ' + x).join('\n')
      : '') +
    (drafts.length ? '\n\nDeliverables drafted in this phase:\n' + drafts.join('\n') : '') +
    (trs.length
      ? '\n\nMeeting transcripts and text files uploaded to this sprint. Questions we have already asked the client appear inside these - read them closely and do not ask any of them again:\n' +
        trs
          .slice(0, 4)
          .map((f) => '[' + f.name + ']\n' + String(f.txt).slice(0, 8000))
          .join('\n\n')
      : '') +
    (prior.length ? '\n\nQuestions already raised on this sprint - do not repeat them:\n' + prior.join('\n') : '') +
    '\n\nReturn JSON matching exactly this shape:\n' +
    QUESTIONS.shape
  );
}

/* ------------------------------------------------------- single deliverable */

export function deliverablePrompt(p: Engagement, pi: number, d: DeliverableDefinition): string {
  const ph = PHASES[pi];
  return (
    'Deliverable: ' +
    d.name +
    '\nPhase ' +
    ph.num +
    ' - ' +
    ph.title +
    ' (' +
    ph.subtitle +
    ')\nPurpose: ' +
    d.desc +
    '\n\nRequired sections, in order:\n' +
    d.sections.map((s, i) => i + 1 + '. ' + s).join('\n') +
    '\n\nProject context:\n' +
    buildContext(p, pi) +
    '\n\nWrite the full deliverable now. Start with an H1 title line, then a 3-line context block, then the sections.'
  );
}

export const deliverableSystem = DELIVERABLE.system;

/* ------------------------------------------------------------ research desk */

export function researchSystem(includeBenchmarks: boolean): string {
  return RESEARCH.systemHead + (includeBenchmarks ? RESEARCH.systemBenchmarks : '') + RESEARCH.systemTail;
}

export function researchPrompt(input: {
  engagement: Engagement;
  phaseIndex: number;
  query: string;
  includeRoom: boolean;
  sources: { u: string; ok: boolean; text: string }[];
}): string {
  const { engagement, phaseIndex, query, includeRoom, sources } = input;
  const ok = sources.filter((s) => s.ok);
  const failed = sources.filter((s) => !s.ok);
  return (
    'Research brief requested:\n' +
    query +
    '\n\nProject context:\n' +
    buildContext(engagement, phaseIndex, includeRoom) +
    '\n\n' +
    (ok.length
      ? 'Source extracts:\n' + ok.map((s, i) => '[S' + (i + 1) + '] ' + s.u + '\n' + s.text).join('\n\n---\n\n')
      : 'No source extracts were retrievable - work from established sector knowledge and be explicit about what must still be sourced.') +
    (failed.length ? '\n\nCould not be fetched (flag these as unsourced): ' + failed.map((s) => s.u).join(', ') : '')
  );
}
