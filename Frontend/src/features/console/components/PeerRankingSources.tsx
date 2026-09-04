'use client';

/**
 * The pages the peer pass actually read.
 *
 * The peer ranking is the one card in the outside-in pack built from sites
 * fetched live rather than from the model's own knowledge, and the difference
 * matters: a figure read off a company's own filing carries weight a
 * sector-derived estimate does not. Without this the two look identical on the
 * card, so the sources are listed under it.
 *
 * Empty when nothing could be read live — in which case the card's own note
 * already says the ranking is desk-derived.
 */
interface PeerSource {
  href: string;
  label: string;
}

export function PeerRankingSources({ v }: { v: { vis?: { rank?: { sources?: PeerSource[] } } } }) {
  const sources = v.vis?.rank?.sources ?? [];
  if (!sources.length) return null;

  return (
    <div style={{ marginTop: '13px', paddingTop: '12px', borderTop: '1px solid var(--ln10)' }}>
      <div
        style={{
          fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace",
          fontSize: '8.5px',
          letterSpacing: '.14em',
          color: 'var(--fg3)',
        }}
      >
        SOURCES READ LIVE FOR PEER DISCOVERY
      </div>
      <div style={{ marginTop: '7px', display: 'flex', flexWrap: 'wrap', gap: '6px 12px' }}>
        {sources.map((source, i) => (
          <a
            key={`${source.href}-${i}`}
            href={source.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '10.5px',
              lineHeight: 1.4,
              color: 'var(--fg2)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              overflowWrap: 'anywhere',
            }}
          >
            {source.label}
          </a>
        ))}
      </div>
    </div>
  );
}
