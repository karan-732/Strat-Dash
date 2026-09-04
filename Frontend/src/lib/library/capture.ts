/* eslint-disable @typescript-eslint/no-explicit-any */
import { PHASES } from '@/lib/playbook/phases';
import { PACK_KEYS } from '@/lib/playbook/constants';
import type { Engagement } from '@/lib/domain/types';
import type { LibraryEntry, LibraryKind } from './types';

/**
 * What a phase's pack contributes to the firm's knowledge, as opposed to the
 * client's deliverable.
 *
 * Only the parts that generalise are taken: the shape of a sector's value
 * tree rather than this client's numbers, the parameters that decide the
 * winner rather than this client's rank, the friction pattern rather than this
 * client's cycle time.
 */
const rid = () => 'lib' + Math.random().toString(36).slice(2, 9);

type Extractor = (pack: any, p: Engagement, pi: number) => Omit<LibraryEntry, 'id' | 'source' | 'capturedAt' | 'sector'>[];

const EXTRACTORS: Record<number, Extractor> = {
  0: (pack) => {
    const out: ReturnType<Extractor> = [];
    if (pack?.valueTree || pack?.valueChain) {
      const chain = pack.valueChain ?? [];
      out.push({
        kind: 'value-tree' as LibraryKind,
        title: 'Industry value tree and value chain',
        summary: [
          `${(pack.valueTree?.revenue ?? []).length} revenue, ${(pack.valueTree?.cost ?? []).length} cost and ${(pack.valueTree?.capital ?? []).length} capital drivers`,
          `${chain.length} value chain stages, each with its activities, decisions, systems, data and KPI`,
        ],
        payload: { valueTree: pack.valueTree, valueChain: chain, activityClass: pack.activityClass },
      });
    }
    if (pack?.peerRank?.params?.length) {
      out.push({
        kind: 'benchmark' as LibraryKind,
        title: 'Parameters that decide the winner',
        summary: [
          `${pack.peerRank.params.length} weighted parameters and a ${(pack.peerRank.peerSet ?? []).length}-company peer set`,
          pack.peerRank.overall?.note ?? 'Scored on every parameter, ranked overall.',
        ],
        payload: { params: pack.peerRank.params, peerSet: pack.peerRank.peerSet, rows: pack.peerRank.rows },
      });
    }
    return out;
  },
  2: (pack) => {
    const out: ReturnType<Extractor> = [];
    if (pack?.scoring?.dimensions?.length) {
      out.push({
        kind: 'commercial' as LibraryKind,
        title: 'Opportunity scoring model',
        summary: [
          pack.scoring.dimensions.join(' · '),
          `Applied to ${(pack.scoring.items ?? []).length} opportunities`,
        ],
        payload: { dimensions: pack.scoring.dimensions, items: pack.scoring.items },
      });
    }
    if (pack?.valueRanking?.items?.length) {
      out.push({
        kind: 'commercial' as LibraryKind,
        title: 'Typical value pools',
        summary: [
          `${pack.valueRanking.items.length} pools sized in ${pack.valueRanking.unit ?? 'value'}`,
          'Each with the arithmetic behind the figure.',
        ],
        payload: pack.valueRanking,
      });
    }
    return out;
  },
  3: (pack) => {
    const out: ReturnType<Extractor> = [];
    if (pack?.twin?.steps?.length) {
      out.push({
        kind: 'process-pattern' as LibraryKind,
        title: pack.twin.name || 'Current-state process twin',
        summary: [
          `${pack.twin.steps.length} steps, ${pack.handoffs?.totalHandoffs ?? '?'} handoffs, ${pack.health?.totalCycle ?? '?'} cycle`,
          `Friction across ${(pack.friction?.dimensions ?? []).length} types; ${(pack.rework?.causes ?? []).length} rework causes`,
        ],
        payload: { twin: pack.twin, friction: pack.friction, rework: pack.rework, rootCause: pack.rootCause },
      });
    }
    return out;
  },
  4: (pack) => {
    const out: ReturnType<Extractor> = [];
    if (pack?.architecture?.layers?.length || pack?.roles) {
      out.push({
        kind: 'process-pattern' as LibraryKind,
        title: 'AI-native redesign pattern',
        summary: [
          `${(pack.architecture?.layers ?? []).length}-layer architecture; ${(pack.roles?.ai ?? []).length} AI and ${(pack.roles?.human ?? []).length} human responsibilities`,
          `${(pack.transformation?.activities ?? []).length} activities dispositioned`,
        ],
        payload: { architecture: pack.architecture, roles: pack.roles, transformation: pack.transformation },
      });
    }
    return out;
  },
  5: (pack) => {
    const out: ReturnType<Extractor> = [];
    if (pack?.cases?.length) {
      out.push({
        kind: 'commercial' as LibraryKind,
        title: 'ROI benchmarks and implementation effort',
        summary: [
          `${pack.cases.length} initiatives with investment, annual value and payback`,
          `Portfolio total ${pack.totals?.valueAtStake ?? '?'} at stake for ${pack.totals?.investment ?? '?'}`,
        ],
        payload: { totals: pack.totals, cases: pack.cases, investment: pack.investment },
      });
    }
    return out;
  },
};

/** Everything this phase's pack can contribute to the library. */
export function captureFromPhase(p: Engagement, pi: number): LibraryEntry[] {
  const pack = p[PACK_KEYS[pi]] as any;
  if (!pack) return [];
  const extract = EXTRACTORS[pi];
  if (!extract) return [];

  return extract(pack, p, pi).map((entry) => ({
    ...entry,
    id: rid(),
    sector: p.sector,
    source: { engagementId: p.id, engagementName: p.name, phase: pi },
    capturedAt: new Date().toISOString(),
  }));
}

/** Whether a phase has anything worth keeping. */
export function capturableCount(p: Engagement, pi: number): number {
  return captureFromPhase(p, pi).length;
}

/** Phases the playbook expects to feed the library. */
export const CAPTURING_PHASES = Object.keys(EXTRACTORS).map(Number);

export const phaseLabel = (pi: number) => `Phase ${PHASES[pi].num} · ${PHASES[pi].title}`;
