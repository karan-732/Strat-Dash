import 'server-only';

export interface Source {
  u: string;
  text: string;
}

const READER = process.env.SCRAPE_READER_BASE || 'https://r.jina.ai/';

/** Read pages live through the reader proxy; an unreachable source is skipped. */
export async function scrapeUrls(urls: string[], cap = 4, chars = 5000): Promise<Source[]> {
  const out: Source[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < urls.length && out.length < cap; i++) {
    const u = String(urls[i] || '').trim();
    if (!u || seen.has(u)) continue;
    seen.add(u);
    try {
      const res = await fetch(READER + (/^https?:/.test(u) ? u : 'https://' + u));
      if (!res.ok) throw new Error('status ' + res.status);
      const t = await res.text();
      if (t && t.length > 200) out.push({ u, text: t.slice(0, chars) });
    } catch {
      /* an unreachable source is simply not used */
    }
  }
  return out;
}

/** The block of live extracts appended to every generation prompt. */
export function sourceBlock(srcs: Source[]): string {
  if (!srcs || !srcs.length) {
    return '\n\nNo page could be read live. Work from what the sprint holds plus established sector data, mark every derived figure with ~ and state its basis.';
  }
  return (
    '\n\nLive source extracts, scraped just now. Treat these as primary evidence, prefer their figures over anything else and cite them as [S1], [S2] in the note or basis fields:\n' +
    srcs.map((s, i) => '[S' + (i + 1) + '] ' + s.u + '\n' + s.text).join('\n\n---\n\n')
  );
}
