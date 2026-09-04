import { PHASES } from '@/lib/playbook/phases';
import { capName, slug } from './format';
import type { Engagement, SprintScope } from './types';

const rid = (prefix: string, len = 6) => prefix + Math.random().toString(36).slice(2, 2 + len);

export function newEngagementId(): string {
  return rid('p');
}

/** A fresh engagement with nothing recorded against it. */
export function blankEngagement(input: {
  name: string;
  sector?: string;
  url?: string;
  notes?: string;
  scope?: SprintScope;
  /** Fixed id and open date, so seeded engagements render identically on
   *  the server and the client and keep a stable URL across reloads. */
  id?: string;
  created?: string;
}): Engagement {
  return {
    id: input.id || newEngagementId(),
    name: capName(input.name),
    sector: input.sector || 'Sector to confirm',
    url: input.url || '',
    notes: input.notes || '',
    scope: input.scope || 'Department-level sprint',
    created: input.created || new Date().toISOString().slice(0, 10),
    inputs: {},
    steps: {},
    attended: {},
    docs: {},
    built: {},
    manual: {},
    cq: {},
    files: [],
    links: [],
    research: [],
  };
}

/** Route segment for an engagement — `name` slug, disambiguated by id. */
export function engagementSlug(p: Pick<Engagement, 'id' | 'name'>): string {
  const base = slug(p.name);
  return base ? `${base}-${p.id}` : p.id;
}

/** Recover an engagement from a route segment produced by `engagementSlug`. */
export function findBySlug(projects: Engagement[], segment: string): Engagement | undefined {
  const id = segment.slice(segment.lastIndexOf('-') + 1);
  return projects.find((p) => p.id === id) ?? projects.find((p) => engagementSlug(p) === segment);
}

/** Route segment for a phase — `0-outside-in-view`. */
export function phaseSlug(pi: number): string {
  return `${PHASES[pi].num}-${slug(PHASES[pi].title)}`;
}

/** Phase index from a route segment; -1 when the segment is not a phase. */
export function phaseIndexFromSlug(segment: string): number {
  const idx = PHASES.findIndex((ph) => phaseSlug(PHASES.indexOf(ph)) === segment || ph.num === segment);
  return idx;
}
