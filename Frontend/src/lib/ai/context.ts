import { PHASES } from '@/lib/playbook/phases';
import { PACK_KEYS } from '@/lib/playbook/constants';
import type { Engagement } from '@/lib/domain/types';

/** How the sprint's scope changes the unit of analysis for every phase. */
function scopeRule(scope: string): string {
  return /process/i.test(scope)
    ? 'Sprint scope: SINGLE PROCESS-LEVEL SPRINT. The unit of analysis is ONE named process end to end (for example work order generation or PO creation). Diagnose it step by step - every step, handoff, system, wait, exception and rework loop in the order work actually moves - and quantify at step level. Do not spread the analysis across departments or rank functions against each other; where a neighbouring function appears, treat it only as an input or output of this process.'
    : 'Sprint scope: DEPARTMENT-LEVEL SPRINT. The unit of analysis is a whole function or department (for example materials management, procurement or finance). Diagnose ACROSS the processes it owns - compare them, size the value in each, and rank them - so the sprint can select which process to take into forensics. Do not collapse the work into a single process.';
}

/**
 * Everything the sprint holds for a phase, in the order the model should weigh
 * it: the engagement itself, what the client could not supply, notes typed by
 * the consultant, the data room, research, earlier deliverables, the earlier
 * output packs and the questions already put to the client.
 *
 * `includeRoom: false` is used by the research desk when the consultant wants a
 * brief written without the uploaded files.
 */
export function buildContext(p: Engagement, pi: number, includeRoom = true): string {
  const scope = p.scope || 'Department-level sprint';
  const lines: string[] = [
    'Client: ' + p.name,
    'Sector: ' + p.sector,
    'Website: ' + (p.url || 'not supplied'),
    scopeRule(scope),
    'Engagement notes: ' + (p.notes || 'none'),
  ];

  if ((p.links || []).length) lines.push('Pasted source links: ' + p.links.map((l) => l.url).join('; '));

  const naList: string[] = [];
  PHASES.forEach((ph, i) => {
    if (i > pi) return;
    ph.inputs.forEach((label, j) => {
      if (p.inputs[i + ':' + j] === 'na') naList.push('[P' + ph.num + '] ' + label);
    });
  });
  if (naList.length) {
    lines.push(
      'Inputs the client could not supply - benchmark these against the sector and mark the figure as derived:\n' +
        naList.map((x) => '- ' + x).join('\n'),
    );
  }

  /*
   * Who was actually in the room. The playbook names the participants each
   * phase needs; a missing one is a hole in the evidence, so the pack is told
   * whose view it does not have rather than writing as if it had everyone.
   */
  const rooms: string[] = [];
  PHASES.forEach((ph, i) => {
    if (i > pi) return;
    const expected = ph.participants.filter((who) => !/^No broad/i.test(who));
    if (!expected.length) return;
    const present = expected.filter((who) => p.attended?.[i + ':' + ph.participants.indexOf(who)] === true);
    const missing = expected.filter((who) => !present.includes(who));
    rooms.push(
      '[Phase ' + ph.num + '] present: ' + (present.length ? present.join('; ') : 'not recorded') +
        (missing.length ? '\n  not in the room: ' + missing.join('; ') : ''),
    );
  });
  if (rooms.length) {
    lines.push(
      'Who was in the room for each phase. Where someone the playbook asks for was absent, say plainly which conclusions rest on an unverified view rather than presenting them as settled:\n' +
        rooms.join('\n'),
    );
  }

  const manual: string[] = [];
  PHASES.forEach((ph, i) => {
    if (i > pi) return;
    const t = (p.manual || {})[i];
    if (t) manual.push('[Phase ' + ph.num + ' - entered manually by the consultant, treat as first-hand client evidence]\n' + t);
  });
  if (manual.length) lines.push('Manually entered information:\n' + manual.join('\n\n'));

  const files = includeRoom === false ? [] : p.files.filter((f) => f.phase <= pi);
  if (files.length) {
    lines.push('Data room: ' + files.map((f) => f.name + (f.txt ? ' [text read]' : ' [contents not parsed]')).join('; '));
  }
  const parsed = files.filter((f) => f.txt);
  if (parsed.length) {
    lines.push(
      'Verbatim extracts from the uploaded text files and meeting transcripts - treat these as first-hand client evidence, and note any question already put to the client inside them:\n' +
        parsed
          .slice(0, 4)
          .map((f) => '[' + f.name + ']\n' + String(f.txt).slice(0, 6000))
          .join('\n\n'),
    );
  }

  const used = (p.research || []).filter((r) => r.use !== false);
  if (used.length) {
    lines.push(
      'Research library extracts:\n' +
        used
          .slice(0, 3)
          .map((r) => '- ' + r.q + '\n' + String(r.md).slice(0, 2200))
          .join('\n\n'),
    );
  }

  const priors: string[] = [];
  PHASES.forEach((ph, i) => {
    if (i >= pi) return;
    ph.docs.forEach((d) => {
      const rec = p.docs[i + '.' + d.n];
      if (rec && rec.draft) priors.push('- [Phase ' + ph.num + '] ' + d.name + ': ' + String(rec.draft).slice(0, 900));
    });
  });
  if (priors.length) lines.push('Earlier phase deliverables (extracts):\n' + priors.slice(0, 6).join('\n'));

  const packs: string[] = [];
  for (let i = Math.max(0, pi - 2); i < pi; i++) {
    const w = p[PACK_KEYS[i]];
    if (w) packs.push('[Phase ' + PHASES[i].num + ' - ' + PHASES[i].title + ' output pack]\n' + JSON.stringify(w).slice(0, 2500));
  }
  if (packs.length) {
    lines.push(
      'Output packs already built in the phases before this one. This phase is a continuation of them: carry their figures forward, name the priorities they selected, and never contradict them without saying why:\n' +
        packs.join('\n\n'),
    );
  }

  const openQs: string[] = [];
  for (let i = 0; i < pi; i++) {
    const ent = (p.cq || {})[i];
    if (ent && (ent.items || []).length) {
      openQs.push('[Phase ' + PHASES[i].num + ']\n' + ent.items.map((it) => '- ' + it.q).join('\n'));
    }
  }
  if (openQs.length) {
    lines.push(
      'Questions put to the client at the end of the earlier phases. Anything the material does not answer is still open - do not assume it was answered:\n' +
        openQs.join('\n\n'),
    );
  }

  return lines.join('\n');
}

/** Text-bearing uploads visible to a phase — transcripts, notes, exports. */
export function textSources(p: Engagement, pi: number) {
  return (p.files || []).filter((f) => f.phase <= pi && f.txt);
}
