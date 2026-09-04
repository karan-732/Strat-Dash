/**
 * Altrd's reusable knowledge asset.
 *
 * The playbook is explicit that every engagement must produce two things: the
 * client deliverable, and something the firm keeps. These are the four
 * categories it names.
 */
export type LibraryKind = 'value-tree' | 'benchmark' | 'process-pattern' | 'commercial';

export interface LibraryEntry {
  id: string;
  kind: LibraryKind;
  title: string;
  /** the sector it was learned in — what makes it reusable */
  sector: string;
  /** where it came from */
  source: { engagementId: string; engagementName: string; phase: number };
  capturedAt: string;
  /** two or three lines describing what is in it */
  summary: string[];
  /** the captured material itself */
  payload: unknown;
}

export const LIBRARY_KINDS: { kind: LibraryKind; label: string; icon: string; note: string }[] = [
  {
    kind: 'value-tree',
    label: 'Value trees',
    icon: '⑂',
    note: 'Industry value trees and value chains — the revenue, cost and capital drivers of a sector, and the stages value moves through.',
  },
  {
    kind: 'benchmark',
    label: 'Benchmarks',
    icon: '◔',
    note: 'Industry metrics and competitive benchmarks — the parameters that decide the winner in a sector, and where real companies landed on them.',
  },
  {
    kind: 'process-pattern',
    label: 'Process patterns',
    icon: '◫',
    note: 'Standard process maps, typical activity volumes, and the bottlenecks and friction patterns that recur.',
  },
  {
    kind: 'commercial',
    label: 'ROI and scoring models',
    icon: '▤',
    note: 'ROI benchmarks, implementation effort, typical value pools and the scoring models used to rank opportunities.',
  },
];
