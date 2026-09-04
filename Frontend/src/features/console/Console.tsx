'use client';

import { useEffect } from 'react';
import { ConsoleSurface } from '@/features/console/ConsoleSurface';
import { ACCENT } from '@/lib/playbook/constants';
import { buildViewModel } from '@/features/console/view-model';
import { useConsoleNav } from '@/features/console/hooks/use-console-nav';
import { useRouteSync, type RouteTarget } from '@/features/console/hooks/use-route-sync';
import { useTheme } from '@/features/console/hooks/use-theme';
import { useConsoleStore } from '@/store/console-store';

/**
 * The console. Every route renders this with the view the URL asks for: the
 * route is resolved first, the view model is derived from it plus the store,
 * and the ported component tree renders from the view model.
 */
export function Console(target: RouteTarget) {
  const store = useConsoleStore();
  const nav = useConsoleNav();
  const theme = useTheme();
  const route = useRouteSync(target);

  /*
   * Selected individually rather than off `store`: depending on the whole store
   * object re-runs these effects on every state change, and since loading the
   * portfolio *is* a state change, that never settles.
   */
  const loadPortfolio = useConsoleStore((s) => s.loadPortfolio);
  const refresh = useConsoleStore((s) => s.refresh);
  const loadGenerationProviders = useConsoleStore((s) => s.loadGenerationProviders);

  useEffect(() => {
    void loadGenerationProviders();
  }, [loadGenerationProviders]);

  useEffect(() => {
    void loadPortfolio();
  }, [loadPortfolio]);

  /* whichever engagement the URL points at is loaded in full */
  useEffect(() => {
    if (route.engagementId) void refresh(route.engagementId);
  }, [refresh, route.engagementId]);

  if (store.loading && !store.projects.length) {
    return <Boot message="Loading the portfolio…" />;
  }
  if (store.loadError && !store.projects.length) {
    return <Boot message={store.loadError} error />;
  }
  if (!store.projects.length) {
    return <Boot message="No engagements yet. Onboard a client to start a sprint." />;
  }

  const v = buildViewModel({
    route,
    state: store,
    actions: store,
    nav,
    theme,
    settings: {
      accent: ACCENT,
      weighting: 'Equal phases',
      model: process.env.NEXT_PUBLIC_GENERATION_MODEL || 'claude-sonnet-5',
    },
  });

  return <ConsoleSurface v={v} />;
}

/** Shown while the portfolio loads, or when the backend cannot be reached. */
function Boot({ message, error }: { message: string; error?: boolean }) {
  return (
    <div
      className="app-root"
      style={{ display: 'grid', placeItems: 'center', height: '100vh', padding: '32px' }}
    >
      <div style={{ maxWidth: '520px', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace",
            fontSize: '10px',
            letterSpacing: '.16em',
            color: error ? '#D26B51' : 'var(--fg3)',
          }}
        >
          {error ? 'BACKEND UNREACHABLE' : 'ALTRD SPRINT CONSOLE'}
        </div>
        <div style={{ marginTop: '12px', fontSize: '15px', lineHeight: 1.55, color: 'var(--fg2)' }}>
          {message}
        </div>
        {error ? (
          <div
            style={{
              marginTop: '14px',
              fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace",
              fontSize: '11px',
              color: 'var(--fg3)',
            }}
          >
            cd backend && uv run uvicorn app.main:app --port 8000
          </div>
        ) : null}
      </div>
    </div>
  );
}
