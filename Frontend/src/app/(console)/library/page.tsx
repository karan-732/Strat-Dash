'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { LibraryView } from '@/features/console/components/LibraryView';
import { buildViewModel } from '@/features/console/view-model';
import { useConsoleNav } from '@/features/console/hooks/use-console-nav';
import { useTheme } from '@/features/console/hooks/use-theme';
import { ACCENT } from '@/lib/playbook/constants';
import { LIBRARY_KINDS, type LibraryKind } from '@/lib/library/types';
import { useConsoleStore } from '@/store/console-store';

/** The knowledge assets the sprints have left behind. */
function Library() {
  const store = useConsoleStore();
  const nav = useConsoleNav();
  const theme = useTheme();
  const params = useSearchParams();

  const requested = params.get('kind');
  const kind = LIBRARY_KINDS.some((k) => k.kind === requested) ? (requested as LibraryKind) : undefined;

  /*
   * This route renders the sidebar itself rather than going through `Console`,
   * so it has to do the two things `Console` was doing for it. Load the
   * portfolio: nothing else on this page does, so a hard load of /library left
   * the engagement list permanently empty. And hold off on the view model
   * until there is an engagement to build it from — `buildViewModel` derives
   * phase progress from `projects[0]`, which is undefined until the fetch
   * lands, and threw on every first paint of this route.
   */
  const loadPortfolio = useConsoleStore((s) => s.loadPortfolio);
  useEffect(() => {
    void loadPortfolio();
  }, [loadPortfolio]);

  /* the sidebar renders from the same view model as every other surface */
  const v = store.projects.length
    ? buildViewModel({
        route: { view: 'dashboard', engagementId: store.cur, phase: store.phase, projectHome: true },
        state: store,
        actions: store,
        nav,
        theme,
        settings: { accent: ACCENT, weighting: 'Equal phases', model: 'library' },
      })
    : null;

  return (
    <div className="app-root" style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'transparent' }}>
      {v ? <Sidebar v={v} /> : <div className="app-sidebar" />}
      <LibraryView kind={kind} />
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense fallback={null}>
      <Library />
    </Suspense>
  );
}
