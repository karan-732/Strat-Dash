'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { engagementSlug, phaseSlug } from '@/lib/domain/engagement';
import { firstOpenPhase } from '@/lib/domain/progress';
import type { ConsoleNav } from '@/features/console/view-model';
import { useConsoleStore } from '@/store/console-store';

/**
 * Navigation is URL-driven: every view the console can be in has a route, so a
 * phase workspace can be linked to and reloaded. The store is synced from the
 * route by `useRouteSync`, never the other way round.
 *
 * The engagement list is read at call time rather than closed over: navigating
 * to an engagement that was created in the same click would otherwise look it
 * up in the list as it was before the creation, find nothing, and stay put.
 */
export function useConsoleNav(): ConsoleNav {
  const router = useRouter();

  return useMemo(
    () => ({
      toDashboard: () => router.push('/dashboard'),
      toAttention: () => router.push('/attention'),
      toLibrary: (kind?: string) => router.push(kind ? `/library?kind=${kind}` : '/library'),
      toEngagement: (id: string) => {
        const p = useConsoleStore.getState().projects.find((x) => x.id === id);
        router.push(`/engagements/${p ? engagementSlug(p) : id}`);
      },
      toPhase: (id: string, phaseIndex: number) => {
        const p = useConsoleStore.getState().projects.find((x) => x.id === id);
        const pi = phaseIndex < 0 ? (p ? firstOpenPhase(p) : 0) : phaseIndex;
        router.push(`/engagements/${p ? engagementSlug(p) : id}/${phaseSlug(pi)}`);
      },
    }),
    [router],
  );
}
