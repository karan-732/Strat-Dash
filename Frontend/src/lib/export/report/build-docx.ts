'use client';

import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  ImageRun,
  PageBreak,
  PageNumber,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  convertInchesToTwip,
  type IRunOptions,
} from 'docx';
import { blocks, type MarkdownBlock } from '@/lib/markdown/blocks';
import type { CapturedCard } from './capture';
import { captionFor } from './captions';
import { fitToPage } from './capture';

const ACCENT = 'D26B51';
const INK = '100F0E';
const MUTED = '55534F';
const HAIRLINE = 'E6E0DC';
const TINT = 'FBF3F1';

const BODY_FONT = 'Georgia';
const HEAD_FONT = 'Arial';

export interface ReportInput {
  clientName: string;
  sector: string;
  url: string;
  phaseNumber: string;
  phaseTitle: string;
  phaseSubtitle: string;
  phaseIntro: string;
  /** e.g. "4 of 6 reviewed or delivered" */
  deliveryStatus: string;
  generatedOn: string;
  cards: CapturedCard[];
  deliverables: { name: string; desc: string; draft: string; status: string }[];
  questions: { q: string; why: string; who: string; priority: string }[];
  nextMoves: { act: string; why: string; owner: string; when: string }[];
}

/* ------------------------------------------------------------- primitives */

const text = (value: string, opts: Omit<IRunOptions, 'text'> = {}) =>
  new TextRun({ text: value, font: BODY_FONT, size: 21, color: INK, ...opts });

const para = (runs: TextRun[], opts: Record<string, unknown> = {}) =>
  new Paragraph({ children: runs, spacing: { after: 120 }, ...opts });

const eyebrow = (value: string) =>
  new Paragraph({
    children: [new TextRun({ text: value.toUpperCase(), font: HEAD_FONT, size: 15, bold: true, color: ACCENT, characterSpacing: 40 })],
    spacing: { after: 80 },
  });

const heading = (value: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel], size: number) =>
  new Paragraph({
    heading: level,
    spacing: { before: 320, after: 140 },
    children: [new TextRun({ text: value, font: HEAD_FONT, size, bold: true, color: INK })],
  });

/** The thin accent rule used under section titles. */
const rule = () =>
  new Paragraph({
    spacing: { after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 1 } },
    children: [new TextRun({ text: '' })],
  });

const cell = (
  content: Paragraph[],
  opts: { fill?: string; width?: number; head?: boolean } = {},
) =>
  new TableCell({
    children: content,
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill, color: 'auto' } : undefined,
    margins: { top: 90, bottom: 90, left: 120, right: 120 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: HAIRLINE },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: HAIRLINE },
      left: { style: BorderStyle.SINGLE, size: 4, color: HAIRLINE },
      right: { style: BorderStyle.SINGLE, size: 4, color: HAIRLINE },
    },
  });

const headCell = (label: string, width?: number) =>
  cell(
    [new Paragraph({ children: [new TextRun({ text: label.toUpperCase(), font: HEAD_FONT, size: 15, bold: true, color: MUTED, characterSpacing: 30 })] })],
    { fill: TINT, width },
  );

const table = (rows: TableRow[]) =>
  new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE }, layout: 'autofit' as never });

/** `phase0-07A` → `07A`, so the report numbers views the way the screen does. */
const cardNumber = (card: CapturedCard) => card.id.split('-').slice(1).join('-') || card.id;

/* ------------------------------------------------------------------ parts */

function cover(input: ReportInput): Paragraph[] {
  return [
    new Paragraph({ spacing: { before: 2600 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: 'ALTRD STRATEGY AUTOMATION', font: HEAD_FONT, size: 17, bold: true, color: ACCENT, characterSpacing: 80 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: input.phaseTitle, font: HEAD_FONT, size: 66, bold: true, color: INK })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [text(`Phase ${input.phaseNumber} · Full Report`, { size: 26, color: MUTED })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 900 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 8 } },
      children: [text(input.phaseSubtitle, { size: 22, color: ACCENT, italics: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: input.clientName, font: HEAD_FONT, size: 30, bold: true, color: INK })],
    }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [text(input.sector, { color: MUTED })] }),
    ...(input.url ? [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [text(input.url, { color: MUTED })] })] : []),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [text(input.generatedOn, { color: MUTED })] }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

function executiveSummary(input: ReportInput): (Paragraph | Table)[] {
  const facts = [
    ['Client', input.clientName],
    ['Sector', input.sector],
    ['Phase', `${input.phaseNumber} — ${input.phaseTitle}`],
    ['Views generated', String(input.cards.length)],
    ['Deliverables', `${input.deliverables.length} · ${input.deliveryStatus}`],
    ['Report date', input.generatedOn],
  ];

  return [
    eyebrow('Executive summary'),
    heading('What this report contains', HeadingLevel.HEADING_1, 34),
    rule(),
    para([
      text(
        `This report consolidates the Phase ${input.phaseNumber} work for ${input.clientName} (${input.sector}). ` +
          `${input.phaseIntro} `,
      ),
    ]),
    para([
      text(
        `It carries ${input.cards.length} generated view${input.cards.length === 1 ? '' : 's'}, each reproduced with a note on what it shows, ` +
          `followed by the ${input.deliverables.length} deliverable${input.deliverables.length === 1 ? '' : 's'} this phase produces ` +
          `(${input.deliveryStatus}), the questions still open with the client, and the moves the team takes next.`,
      ),
    ]),
    para([
      text('Figures prefixed with ', { color: MUTED }),
      text('~', { bold: true, color: ACCENT }),
      text(' are derived from sector benchmarks rather than reported by the client; the basis is stated wherever one appears.', {
        color: MUTED,
      }),
    ]),
    table(
      facts.map(
        ([k, v]) =>
          new TableRow({
            children: [headCell(k, 28), cell([para([text(v)])], { width: 72 })],
          }),
      ),
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

function contents(input: ReportInput): Paragraph[] {
  const items = [
    'Executive summary',
    ...input.cards.map((c) => `${cardNumber(c)}  ${c.title || c.id}`),
    ...(input.deliverables.length ? ['Deliverables'] : []),
    ...(input.questions.length ? ['Questions for the client'] : []),
    ...(input.nextMoves.length ? ['What we do next'] : []),
  ];
  return [
    eyebrow('Contents'),
    heading('In this report', HeadingLevel.HEADING_1, 34),
    rule(),
    ...items.map(
      (t) =>
        new Paragraph({
          spacing: { after: 90 },
          children: [text(t)],
          border: { bottom: { style: BorderStyle.DOTTED, size: 4, color: HAIRLINE, space: 4 } },
        }),
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

function generatedViews(input: ReportInput): (Paragraph | Table)[] {
  if (!input.cards.length) return [];
  const out: (Paragraph | Table)[] = [
    eyebrow('Generated views'),
    heading(`What the Phase ${input.phaseNumber} pack found`, HeadingLevel.HEADING_1, 34),
    rule(),
  ];

  input.cards.forEach((card) => {
    const size = fitToPage(card);
    out.push(
      heading(`${cardNumber(card)} · ${card.title || card.id}`, HeadingLevel.HEADING_2, 26),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new ImageRun({
            data: card.bytes,
            transformation: { width: size.width, height: size.height },
            type: 'png',
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 320 },
        indent: { left: 120 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 8 } },
        children: [text(captionFor(card.id, card.title), { size: 19, color: MUTED, italics: true })],
      }),
    );
  });

  out.push(new Paragraph({ children: [new PageBreak()] }));
  return out;
}

/** Render a deliverable draft, reusing the console's markdown block parser. */
function draftBody(md: string): (Paragraph | Table)[] {
  const parsed = blocks(md);
  const out: (Paragraph | Table)[] = [];
  let pendingRows: MarkdownBlock[] = [];

  const flush = () => {
    if (!pendingRows.length) return;
    const [head, ...rest] = pendingRows;
    out.push(
      table([
        new TableRow({ children: (head.cells ?? []).map((c) => headCell(c.t)) }),
        ...rest.map(
          (r) => new TableRow({ children: (r.cells ?? []).map((c) => cell([para([text(c.t, { size: 19 })])])) }),
        ),
      ]),
    );
    out.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
    pendingRows = [];
  };

  parsed.forEach((b) => {
    if (b.isRow) {
      pendingRows.push(b);
      return;
    }
    flush();
    if (b.isH1) out.push(heading(b.text, HeadingLevel.HEADING_2, 26));
    else if (b.isH2) out.push(heading(b.text, HeadingLevel.HEADING_3, 23));
    else if (b.isH3) out.push(heading(b.text, HeadingLevel.HEADING_4, 20));
    else if (b.isLi) out.push(new Paragraph({ bullet: { level: 0 }, spacing: { after: 60 }, children: [text(b.text)] }));
    else out.push(para([text(b.text)]));
  });
  flush();
  return out;
}

function deliverables(input: ReportInput): (Paragraph | Table)[] {
  if (!input.deliverables.length) return [];
  const out: (Paragraph | Table)[] = [
    eyebrow('Deliverables'),
    heading(`The Phase ${input.phaseNumber} documents`, HeadingLevel.HEADING_1, 34),
    rule(),
  ];

  input.deliverables.forEach((d, i) => {
    out.push(
      heading(`${String(i + 1).padStart(2, '0')} · ${d.name}`, HeadingLevel.HEADING_2, 26),
      para([text(d.desc, { italics: true, color: MUTED })]),
    );
    if (d.draft.trim()) out.push(...draftBody(d.draft));
    else
      out.push(
        para([
          text(`${d.status} — no draft text is held for this deliverable yet. Rebuild the package to generate it.`, {
            italics: true,
            color: MUTED,
          }),
        ]),
      );
    if (i < input.deliverables.length - 1) out.push(new Paragraph({ children: [new PageBreak()] }));
  });

  out.push(new Paragraph({ children: [new PageBreak()] }));
  return out;
}

function questions(input: ReportInput): (Paragraph | Table)[] {
  if (!input.questions.length && !input.nextMoves.length) return [];
  const out: (Paragraph | Table)[] = [];

  if (input.questions.length) {
    out.push(
      eyebrow('Still open'),
      heading('Questions for the client', HeadingLevel.HEADING_1, 34),
      rule(),
      para([text('Nothing here is answered by the material the sprint currently holds.', { color: MUTED })]),
      table([
        new TableRow({
          children: [headCell('#', 6), headCell('Question', 50), headCell('Why it matters', 26), headCell('Owner', 12), headCell('Priority', 12)],
        }),
        ...input.questions.map(
          (q, i) =>
            new TableRow({
              children: [
                cell([para([text(String(i + 1).padStart(2, '0'), { size: 19, color: MUTED })])]),
                cell([para([text(q.q, { size: 19, bold: true })])]),
                cell([para([text(q.why, { size: 19, color: MUTED })])]),
                cell([para([text(q.who, { size: 19 })])]),
                cell([para([text(q.priority, { size: 19, bold: true, color: /high/i.test(q.priority) ? ACCENT : MUTED })])]),
              ],
            }),
        ),
      ]),
    );
  }

  if (input.nextMoves.length) {
    out.push(
      new Paragraph({ spacing: { before: 400 }, children: [] }),
      eyebrow('Next'),
      heading('What we do next', HeadingLevel.HEADING_1, 34),
      rule(),
      para([text('Our own moves into the following phase, read off this phase’s pack.', { color: MUTED })]),
      table([
        new TableRow({ children: [headCell('#', 6), headCell('Move', 44), headCell('Why', 30), headCell('Owner', 12), headCell('When', 12)] }),
        ...input.nextMoves.map(
          (m, i) =>
            new TableRow({
              children: [
                cell([para([text(String(i + 1).padStart(2, '0'), { size: 19, color: MUTED })])]),
                cell([para([text(m.act, { size: 19, bold: true })])]),
                cell([para([text(m.why, { size: 19, color: MUTED })])]),
                cell([para([text(m.owner, { size: 19 })])]),
                cell([para([text(m.when, { size: 19 })])]),
              ],
            }),
        ),
      ]),
    );
  }

  return out;
}

/* ------------------------------------------------------------------ build */

/** Assemble the phase report and hand back the .docx bytes. */
export async function buildPhaseReport(input: ReportInput): Promise<Blob> {
  const doc = new Document({
    creator: 'Altrd Sprint Console',
    title: `${input.clientName} — Phase ${input.phaseNumber} ${input.phaseTitle}`,
    description: `Phase ${input.phaseNumber} full report`,
    styles: {
      default: {
        document: { run: { font: BODY_FONT, size: 21, color: INK }, paragraph: { spacing: { line: 300 } } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                border: { top: { style: BorderStyle.SINGLE, size: 4, color: HAIRLINE, space: 6 } },
                children: [
                  new TextRun({
                    text: `${input.clientName} · Phase ${input.phaseNumber} · `,
                    font: HEAD_FONT,
                    size: 15,
                    color: MUTED,
                  }),
                  new TextRun({ children: [PageNumber.CURRENT], font: HEAD_FONT, size: 15, color: MUTED }),
                ],
              }),
            ],
          }),
        },
        children: [
          ...cover(input),
          ...executiveSummary(input),
          ...contents(input),
          ...generatedViews(input),
          ...deliverables(input),
          ...questions(input),
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
}
