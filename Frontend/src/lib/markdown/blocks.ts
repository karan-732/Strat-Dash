/** A markdown line, pre-classified for the document preview renderer. */
export interface MarkdownBlock {
  isH1: boolean;
  isH2: boolean;
  isH3: boolean;
  isLi: boolean;
  isRow: boolean;
  isP: boolean;
  text: string;
  cells?: { t: string }[];
}

/** Split a draft into preview blocks. Tables become `isRow` blocks with cells. */
export function blocks(md: string): MarkdownBlock[] {
  const out: MarkdownBlock[] = [];
  String(md)
    .split('\n')
    .forEach((raw) => {
      const l = raw.trim();
      if (!l || l === '---') return;
      const b: MarkdownBlock = { isH1: false, isH2: false, isH3: false, isLi: false, isRow: false, isP: false, text: l };
      if (/^###\s/.test(l)) {
        b.isH3 = true;
        b.text = l.slice(4);
      } else if (/^##\s/.test(l)) {
        b.isH2 = true;
        b.text = l.slice(3);
      } else if (/^#\s/.test(l)) {
        b.isH1 = true;
        b.text = l.slice(2);
      } else if (/^[-*]\s/.test(l)) {
        b.isLi = true;
        b.text = l.slice(2);
      } else if (/^\|/.test(l)) {
        const cells = l
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((c) => c.trim());
        if (cells.every((c) => /^:?-{2,}:?$/.test(c))) return;
        b.isRow = true;
        b.cells = cells.map((c) => ({ t: c.replace(/\*\*/g, '') }));
      } else {
        b.isP = true;
      }
      b.text = b.text.replace(/\*\*/g, '').replace(/^_/, '').replace(/_$/, '');
      out.push(b);
    });
  return out.slice(0, 600);
}
