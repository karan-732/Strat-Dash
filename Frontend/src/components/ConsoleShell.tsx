'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Sidebar } from './layout/Sidebar';
import { DashboardView } from './dashboard/DashboardView';
import { AttentionView } from './attention/AttentionView';
import { EngagementView } from './engagement/EngagementView';
import { NewEngagementModal } from './modals/NewEngagementModal';
import { DocumentPreview } from './modals/DocumentPreview';
import { Toast } from '@/features/console/components/Toast';

export function ConsoleShell({ v }: { v: any }) {
  return (
    <div className="app-root" style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'transparent' }}>
      <Sidebar v={v} />
      <DashboardView v={v} />
      <AttentionView v={v} />
      <EngagementView v={v} />
      <NewEngagementModal v={v} />
      <DocumentPreview v={v} />
      <Toast v={v} />
    </div>
  );
}
