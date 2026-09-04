import { Console } from '@/features/console/Console';

/** One phase workspace: its inputs on one tab, its generated output on the other. */
export default async function PhasePage({
  params,
}: {
  params: Promise<{ engagement: string; phase: string }>;
}) {
  const { engagement, phase } = await params;
  return <Console view="project" engagement={engagement} phase={phase} />;
}
