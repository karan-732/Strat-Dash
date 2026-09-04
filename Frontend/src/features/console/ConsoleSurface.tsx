'use client';

import { ConsoleShell } from '@/components/ConsoleShell';
import { usePlotLabels } from '@/features/console/hooks/use-plot-labels';
import { useOutputZoom } from '@/features/console/hooks/use-output-zoom';

/**
 * The rendered console plus the DOM behaviour that belongs to the tree rather
 * than to any one route — anything that has to measure what was actually laid
 * out. Every surface that renders the console goes through here, so the
 * behaviour cannot be lost by mounting `ConsoleShell` directly.
 */
export function ConsoleSurface({ v }: { v: unknown }) {
  usePlotLabels();
  useOutputZoom();
  return <ConsoleShell v={v} />;
}
