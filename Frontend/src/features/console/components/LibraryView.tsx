'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LIBRARY_KINDS, type LibraryKind } from '@/lib/library/types';
import { PHASES } from '@/lib/playbook/phases';
import { useConsoleStore } from '@/store/console-store';
import { GenerationProviderSwitch } from '@/features/console/components/GenerationProviderSwitch';

/**
 * Altrd's own knowledge asset, as the playbook requires alongside the client
 * deliverable: value trees, benchmarks, process patterns and commercial models
 * kept out of finished phases and reusable on the next engagement.
 */
export function LibraryView({ kind }: { kind?: LibraryKind }) {
  const router = useRouter();
  const library = useConsoleStore((s) => s.library);
  const remove = useConsoleStore((s) => s.removeFromLibrary);
  const provider = useConsoleStore((s) => s.generationProvider);
  const providers = useConsoleStore((s) => s.generationProviders?.providers ?? null);
  const setProvider = useConsoleStore((s) => s.setGenerationProvider);
  const loadProviders = useConsoleStore((s) => s.loadGenerationProviders);
  const providerBusy = useConsoleStore(
    (s) => s.packBusy.some(Boolean) || s.answersBusy || Object.values(s.intakeBusy).some(Boolean),
  );
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    void loadProviders();
  }, [loadProviders]);

  const counts = useMemo(() => {
    const map = new Map<LibraryKind, number>();
    library.forEach((e) => map.set(e.kind, (map.get(e.kind) ?? 0) + 1));
    return map;
  }, [library]);

  const shown = kind ? library.filter((e) => e.kind === kind) : library;
  const active = kind ? LIBRARY_KINDS.find((k) => k.kind === kind) : null;

  return (
    <div className="app-view-shell" style={SHELL}>
      <header className="app-main-header" style={HEADER}>
        <div style={{ minWidth: 0 }}>
          <div style={EYEBROW}>ALTRD INTERNAL IP</div>
          <h1 style={TITLE}>{active ? active.label : 'Library'}</h1>
          <div style={{ marginTop: '7px', fontSize: '12.5px', lineHeight: 1.5, color: 'var(--fg2)', maxWidth: '640px' }}>
            {active
              ? active.note
              : 'Every sprint has to leave two things behind: the client deliverable, and something the firm keeps. This is the second one.'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <GenerationProviderSwitch
            provider={provider}
            providers={providers}
            disabled={providerBusy}
            onChange={setProvider}
          />
          <button type="button" className="eng-secondary" onClick={() => router.push('/dashboard')}>
            ← DASHBOARD
          </button>
        </div>
      </header>

      <div className="app-main-scroll" style={{ overflow: 'auto' }}>
        <div style={{ padding: '22px 26px 42px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
            <Chip label="ALL" count={library.length} on={!kind} onClick={() => router.push('/library')} />
            {LIBRARY_KINDS.map((k) => (
              <Chip
                key={k.kind}
                label={k.label.toUpperCase()}
                count={counts.get(k.kind) ?? 0}
                on={kind === k.kind}
                onClick={() => router.push(`/library?kind=${k.kind}`)}
              />
            ))}
          </div>

          {shown.length === 0 ? (
            <div style={EMPTY}>
              <div style={{ fontSize: '13px', fontWeight: 750, letterSpacing: '.1em', color: 'var(--fg2)' }}>
                NOTHING KEPT YET
              </div>
              <p style={{ maxWidth: '520px', margin: '10px auto 0', fontSize: '13px', lineHeight: 1.55, color: 'var(--fg2)' }}>
                Open a phase that has been run and press KEEP FOR THE LIBRARY on its OUTPUTS tab.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {shown.map((entry) => {
                const meta = LIBRARY_KINDS.find((k) => k.kind === entry.kind);
                const isOpen = open === entry.id;
                return (
                  <article key={entry.id} style={ROW}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flexWrap: 'wrap' }}>
                      <span style={ICON}>{meta?.icon ?? '▤'}</span>
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 650, lineHeight: 1.3 }}>{entry.title}</div>
                        <div style={META}>
                          {entry.sector.toUpperCase()} · {entry.source.engagementName.toUpperCase()} · PHASE{' '}
                          {PHASES[entry.source.phase].num} · {entry.capturedAt.slice(0, 10)}
                        </div>
                        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          {entry.summary.map((line, i) => (
                            <div key={i} style={{ fontSize: '12px', lineHeight: 1.45, color: 'var(--fg2)' }}>
                              {line}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button type="button" className="eng-doc-action" onClick={() => setOpen(isOpen ? null : entry.id)}>
                          {isOpen ? 'HIDE' : 'OPEN'}
                        </button>
                        <button type="button" className="eng-doc-action" onClick={() => remove(entry.id)}>
                          REMOVE
                        </button>
                      </div>
                    </div>
                    {isOpen ? (
                      <pre style={PAYLOAD}>{JSON.stringify(entry.payload, null, 2)}</pre>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Chip({ label, count, on, onClick }: { label: string; count: number; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        padding: '8px 12px',
        border: '1px solid ' + (on ? '#D26B51' : 'var(--ln16)'),
        background: on ? '#D26B51' : 'transparent',
        color: on ? '#FFFFFF' : 'var(--fg2)',
        borderRadius: '999px',
        fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace",
        fontSize: '9.5px',
        fontWeight: 700,
        letterSpacing: '.13em',
        whiteSpace: 'nowrap',
      }}
    >
      <span>{label}</span>
      <span style={{ opacity: 0.62 }}>{String(count).padStart(2, '0')}</span>
    </button>
  );
}

const SHELL: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'grid',
  gridTemplateRows: 'auto minmax(0,1fr)',
  overflow: 'hidden',
};
const HEADER: React.CSSProperties = {
  padding: '20px 28px 18px',
  borderBottom: '1px solid var(--ln12)',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: '28px',
  flexWrap: 'wrap',
};
const EYEBROW: React.CSSProperties = {
  fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace",
  fontSize: '10px',
  letterSpacing: '.16em',
  color: 'var(--fg3)',
};
const TITLE: React.CSSProperties = { margin: '8px 0 0', fontSize: '32px', fontWeight: 600, letterSpacing: '-.02em', lineHeight: 1.02 };
const META: React.CSSProperties = {
  marginTop: '5px',
  fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace",
  fontSize: '8.5px',
  letterSpacing: '.1em',
  color: 'var(--fg3)',
};
const ROW: React.CSSProperties = {
  border: '1px solid var(--ln10)',
  borderLeft: '3px solid #D26B51',
  background: 'var(--card)',
  borderRadius: '12px',
  padding: '14px 16px',
  boxShadow: '0 1px 2px var(--sh50),0 16px 30px -30px var(--sh90)',
};
const ICON: React.CSSProperties = {
  width: '30px',
  height: '30px',
  flex: '0 0 auto',
  borderRadius: '10px',
  background: 'var(--card2)',
  display: 'grid',
  placeItems: 'center',
  color: '#D26B51',
  fontSize: '14px',
};
const EMPTY: React.CSSProperties = {
  border: '1px dashed var(--ln20)',
  borderRadius: '16px',
  background: 'var(--card0)',
  padding: '48px 24px',
  textAlign: 'center',
};
const PAYLOAD: React.CSSProperties = {
  marginTop: '12px',
  padding: '12px',
  maxHeight: '340px',
  overflow: 'auto',
  background: 'var(--bg)',
  border: '1px solid var(--ln10)',
  borderRadius: '10px',
  fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace",
  fontSize: '11px',
  lineHeight: 1.5,
  color: 'var(--fg2)',
  whiteSpace: 'pre-wrap',
};
