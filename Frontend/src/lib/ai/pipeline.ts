import 'server-only';

import { PHASES } from '@/lib/playbook/phases';
import type { Engagement, PhaseQuestions, PhasePack } from '@/lib/domain/types';
import { complete } from './anthropic';
import { parseJson } from './json';
import { scrapeUrls, sourceBlock, type Source } from './scrape';
import {
  PEER_RANK,
  QUESTIONS,
  deliverablePrompt,
  deliverableSystem,
  packPrompt,
  packSystem,
  peerScorePrompt,
  peerSetupPrompt,
  questionsPrompt,
  researchPrompt,
  researchSystem,
  type Peer,
  type PeerParameter,
} from './prompts';

/** Company site plus every link pasted into the engagement. */
export async function scrapeEngagement(p: Engagement): Promise<Source[]> {
  const urls: string[] = [];
  if (p.url) urls.push(p.url);
  (p.links || []).forEach((l) => {
    if (l && l.url) urls.push(l.url);
  });
  return scrapeUrls(urls, 4, 5000);
}

/**
 * Phase 0's deep competitive benchmark, run as two passes: the first decides
 * the parameters that decide the winner in this sector and names a real peer
 * set, the second scores the client and every peer parameter by parameter
 * after their sites have been read.
 *
 * The outside-in pack still stands without the ranking, so a failure here is
 * swallowed rather than failing the whole build.
 */
export async function peerRank(p: Engagement, srcs: Source[]): Promise<PhasePack | null> {
  try {
    const setup = parseJson<{ parameters?: PeerParameter[]; peers?: Peer[] }>(
      await complete({
        system: PEER_RANK.setupSystem,
        prompt: peerSetupPrompt(p, PEER_RANK.setupShape) + sourceBlock(srcs),
        maxTokens: 2000,
      }),
    );
    const params = (setup.parameters || []).filter((x) => x && x.name).slice(0, 9);
    const peers = (setup.peers || []).filter((x) => x && x.name).slice(0, 6);
    if (!params.length || !peers.length) return null;

    const peerSrcs = await scrapeUrls(
      peers.map((x) => x.url || ''),
      6,
      3500,
    );

    const rank = parseJson<{ rows?: unknown[] } & PhasePack>(
      await complete({
        system: PEER_RANK.scoreSystem,
        prompt: peerScorePrompt(p, params, peers, PEER_RANK.scoreShape) + sourceBlock(srcs.concat(peerSrcs)),
        maxTokens: 7000,
      }),
    );
    if (!(rank.rows || []).length) return null;

    rank.params = params;
    rank.peerSet = peers.map((x) => ({ name: x.name, url: x.url || '', why: x.why || '' }));
    rank.read = peerSrcs.map((s) => s.u);
    return rank;
  } catch {
    return null;
  }
}

/** The phase output pack, built from live sources plus everything held. */
export async function buildPack(p: Engagement, pi: number, srcs: Source[]): Promise<PhasePack> {
  const raw = await complete({
    system: packSystem(pi),
    prompt: packPrompt(p, pi) + sourceBlock(srcs),
    maxTokens: 8000,
  });
  return parseJson<PhasePack>(raw);
}

/**
 * What is still open after a phase, and our own next moves — written off the
 * pack that was just built, skipping anything the transcripts already asked.
 */
export async function buildQuestions(p: Engagement, pi: number, pack: unknown): Promise<PhaseQuestions> {
  const raw = await complete({
    system: QUESTIONS.system,
    prompt: questionsPrompt(p, pi, pack),
    maxTokens: 2500,
  });
  const j = parseJson<{
    questions?: { q?: string; why?: string; who?: string; priority?: string }[];
    alreadyAsked?: { q?: string; source?: string }[];
    suggestions?: { do?: string; why?: string; owner?: string; when?: string }[];
  }>(raw);

  return {
    items: (j.questions || [])
      .filter((x) => x && x.q)
      .slice(0, 6)
      .map((x) => ({
        q: String(x.q),
        why: String(x.why || ''),
        who: String(x.who || 'To assign'),
        priority: String(x.priority || 'Medium'),
      })),
    covered: (j.alreadyAsked || [])
      .filter((x) => x && x.q)
      .slice(0, 8)
      .map((x) => ({ q: String(x.q), source: String(x.source || 'earlier in the sprint') })),
    sug: (j.suggestions || [])
      .filter((x) => x && x.do)
      .slice(0, 3)
      .map((x) => ({
        act: String(x.do),
        why: String(x.why || ''),
        owner: String(x.owner || 'Engagement lead'),
        when: String(x.when || 'Next'),
      })),
    ts: new Date().toISOString(),
  };
}

/** One deliverable draft, for the human review pass. */
export async function buildDeliverable(p: Engagement, pi: number, docNumber: number): Promise<string> {
  const d = PHASES[pi].docs.find((x) => x.n === docNumber);
  if (!d) throw new Error('no deliverable ' + docNumber + ' in phase ' + pi);
  return complete({ system: deliverableSystem, prompt: deliverablePrompt(p, pi, d), maxTokens: 5000 });
}

/** A research brief for the library, with live sources cited. */
export async function buildResearch(input: {
  engagement: Engagement;
  phaseIndex: number;
  query: string;
  urls: string[];
  live: boolean;
  includeRoom: boolean;
  includeBenchmarks: boolean;
}): Promise<{ md: string; srcs: { u: string; ok: boolean }[] }> {
  const { engagement, phaseIndex, query, urls, live, includeRoom, includeBenchmarks } = input;

  const sources: { u: string; ok: boolean; text: string }[] = [];
  if (live && urls.length) {
    const read = await scrapeUrls(urls.slice(0, 5), 5, 9000);
    urls.slice(0, 5).forEach((u) => {
      const hit = read.find((r) => r.u === u);
      sources.push({ u, ok: !!hit, text: hit?.text ?? '' });
    });
  } else {
    urls.forEach((u) => sources.push({ u, ok: false, text: '' }));
  }

  const md = await complete({
    system: researchSystem(includeBenchmarks),
    prompt: researchPrompt({ engagement, phaseIndex, query, includeRoom, sources }),
    maxTokens: 6000,
  });

  return { md, srcs: sources.map((s) => ({ u: s.u, ok: s.ok })) };
}
