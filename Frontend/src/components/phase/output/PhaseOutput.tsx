'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { OutputStatus } from './OutputStatus';
import { DeliverableList } from './DeliverableList';
import { Phase1Pack } from './phase1/Phase1Pack';
import { Phase2Pack } from './phase2/Phase2Pack';
import { Phase3Pack } from './phase3/Phase3Pack';
import { Phase4Pack } from './phase4/Phase4Pack';
import { Phase0Pack } from './phase0/Phase0Pack';
import { Phase5Pack } from './phase5/Phase5Pack';
import { NextMoves } from './NextMoves';
import { ReportAction } from '@/features/console/components/ReportAction';
import { ClientQuestions } from '@/features/console/components/ClientQuestions';

export function PhaseOutput({ v }: { v: any }) {
  return (
    v.tabDocs ? (
      <>
      <div>
        <OutputStatus v={v} />
        <DeliverableList v={v} />
        <Phase1Pack v={v} />
        <Phase2Pack v={v} />
        <Phase3Pack v={v} />
        <Phase4Pack v={v} />
        <Phase0Pack v={v} />
        <Phase5Pack v={v} />
        <ClientQuestions v={v} />
        <NextMoves v={v} />
      </div>
      <ReportAction v={v} />
      </>
    ) : null
  );
}
