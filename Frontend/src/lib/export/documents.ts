import { PHASES } from '@/lib/playbook/phases';
import { DOC_STATUS } from '@/lib/playbook/constants';
import { sprintPct, type Weighting } from '@/lib/domain/progress';
import type { ClientQuestion, DeliverableDefinition, Engagement } from '@/lib/domain/types';

/** The blank template for a deliverable: title block, then a stub per section. */
export function templateMd(p: Engagement, pi: number, d: DeliverableDefinition): string {
  const ph = PHASES[pi];
  let s =
    '# ' +
    d.name +
    '\n\n' +
    '**Client:** ' +
    p.name +
    '  \n**Phase ' +
    ph.num +
    ' - ' +
    ph.title +
    '**  \n**Purpose:** ' +
    d.desc +
    '\n\n';
  d.sections.forEach((sec, i) => {
    s += '## ' + (i + 1) + '. ' + sec + '\n\n_[to complete]_\n\n';
  });
  s += '---\n\nOpen questions\n\n- \n\nSources\n\n- \n';
  return s;
}

/**
 * The client questions and "what we do next" block appended to every export.
 *
 * `extraItems` holds intake-only requirements that are visible before a pack
 * exists. They are merged ahead of stored post-generation questions using the
 * same normalized-question dedupe as the screen.
 */
export function questionsMd(p: Engagement, pi: number): string {
  const ent = (p.cq || {})[pi];
  if (!ent) return '';

  /*
   * Every question the phase asked, in order, each with its answer where one
   * has been given. This used to list only the unanswered ones and then append
   * a note of how many had been "left out" - which read as bookkeeping to the
   * one person who should never see it, the client.
   */
  const items: ClientQuestion[] = ent.all ?? ent.items ?? [];
  let s = '\n\n## Questions for the client\n\n';
  if (!items.length) s += 'None. The material held for this phase answers what the phase needed.\n';
  else
    items.forEach((it, i) => {
      s +=
        i + 1 + '. **' + it.q + '**  \n   ' + (it.why ? it.why + '. ' : '') + 'Owner: ' + it.who + ' · Priority: ' + it.priority + '\n';
      const answer = (it.answer || '').trim();
      if (answer) s += '   Answered: ' + answer + '\n';
      else if (it.stillMissing) s += '   Still needed: ' + it.stillMissing + '\n';
    });
  const sug = ent?.sug || [];
  if (sug.length) {
    s +=
      '\n## What we do next\n\n' +
      sug.map((x) => '- **' + x.act + '** - ' + (x.why ? x.why + '. ' : '') + x.owner + ' · ' + x.when).join('\n') +
      '\n';
  }
  return s;
}

/** The assembled six-phase blueprint, markdown. */
export function blueprintMd(p: Engagement, weighting: Weighting = 'Equal phases'): { md: string; heldDrafts: number } {
  let md =
    '# Altrd AI Transformation Blueprint\n\n## ' +
    p.name +
    '\n\n' +
    p.sector +
    (p.url ? ' · ' + p.url : '') +
    '  \nAssembled ' +
    new Date().toISOString().slice(0, 10) +
    ' · sprint ' +
    sprintPct(p, weighting) +
    '% complete\n\n';
  let heldDrafts = 0;
  PHASES.forEach((ph, pi) => {
    md += '\n# Phase ' + ph.num + ' - ' + ph.title + '\n\n';
    ph.docs.forEach((d) => {
      const rec = p.docs[pi + '.' + d.n];
      md += '\n## ' + d.name + '\n\n';
      if (rec && rec.draft) {
        md += rec.draft + '\n';
        heldDrafts++;
      } else {
        md += '_Status: ' + DOC_STATUS[rec ? rec.s : 0] + ' - no draft held in the console._\n';
      }
    });
    md += questionsMd(p, pi);
  });
  return { md, heldDrafts };
}
