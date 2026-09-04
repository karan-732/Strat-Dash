'use client';

import { useEffect, useMemo } from 'react';
import { findBySlug, phaseIndexFromSlug } from '@/lib/domain/engagement';
import { firstOpenPhase } from '@/lib/domain/progress';
import type { ConsoleRoute } from '@/features/console/view-model';
import { useConsoleStore, type ConsoleView } from '@/store/console-store';

export interface RouteTarget {
  view: ConsoleView;
  /** `name-id` segment, present on engagement routes. */
  engagement?: string;
  /** `0-outside-in-view` segment, present on phase routes. */
  phase?: string;
}

/**
 * Resolve the URL into the view the console should show, and keep the store
 * pointed at the same place so actions (patch, generate, upload) write to the
 * engagement on screen.
 *
 * The resolved route — not the store — is what the view model renders from, so
 * the first paint is already correct instead of flashing the dashboard.
 */
export function useRouteSync({ view, engagement, phase }: RouteTarget): ConsoleRoute {
  const projects = useConsoleStore((s) => s.projects);
  const set = useConsoleStore((s) => s.set);
  const syncManualDraft = useConsoleStore((s) => s.syncManualDraft);

  const route = useMemo<ConsoleRoute>(() => {
    const fallback: ConsoleRoute = {
      view: view === 'project' ? 'dashboard' : view,
      engagementId: projects[0]?.id ?? '',
      phase: 0,
      projectHome: true,
    };
    if (view !== 'project') return fallback;

    const p = engagement ? findBySlug(projects, engagement) : undefined;
    if (!p) return fallback;

    const pi = phase ? phaseIndexFromSlug(phase) : -1;
    return {
      view: 'project',
      engagementId: p.id,
      phase: pi >= 0 ? pi : firstOpenPhase(p),
      projectHome: !phase,
    };
  }, [engagement, phase, projects, view]);

  useEffect(() => {
    const movedEngagement = useConsoleStore.getState().cur !== route.engagementId;
    set({
      view: route.view,
      cur: route.engagementId,
      phase: route.phase,
      projectHome: route.projectHome,
      tab: 'inputs',
      inputPanel: false,
      workflowPanel: false,
      researchPanel: false,
      ...(movedEngagement ? { intake: {}, intakeBusy: {} } : {}),
    });
    if (route.engagementId) syncManualDraft(route.engagementId, route.phase);
  }, [route, set, syncManualDraft]);

  return route;
}
