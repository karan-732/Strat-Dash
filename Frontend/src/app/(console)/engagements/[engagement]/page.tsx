import { Console } from '@/features/console/Console';

/** Engagement overview — the sprint journey across the six phases. */
export default async function EngagementPage({ params }: { params: Promise<{ engagement: string }> }) {
  const { engagement } = await params;
  return <Console view="project" engagement={engagement} />;
}
