/*
 * extract-view-model — slices the per-phase pack derivations out of the
 * original `renderVals()` and wraps each one as its own module.
 *
 *   node scripts/extract-view-model.mjs <Sprint Console.dc.html> <out-dir>
 *
 * These blocks are pure: they read the phase's pack off the engagement plus the
 * current chart selection, and return the object the cards render from. They
 * are copied verbatim (indentation included) so they can be diffed against a
 * newer export of the source console.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const [srcPath, outDir] = process.argv.slice(2);
const all = readFileSync(srcPath, 'utf8').split('\n');

/*
 * Where each block lives is found by anchor, not by line number. The source is
 * re-exported from a design tool whenever the UI changes, and every absolute
 * offset shifts when it does - which is exactly what broke the previous run of
 * this script. Anchors survive that.
 */

/** The 1-based line index of the first line matching `re`, searching from `at`. */
function lineOf(re, at = 0, what = '') {
  for (let i = at; i < all.length; i += 1) if (re.test(all[i])) return i + 1;
  throw new Error(`extract-view-model: could not find ${what || re}`);
}

/** Inclusive slice by absolute 1-based line numbers. */
const slice = (from, to) => all.slice(from - 1, to).join('\n');

/*
 * Each phase pack is derived in a `let visN = null; if (W) { … }` block. They
 * sit back to back inside renderVals(), so a block runs from its own opening
 * line up to the line before the next one starts - and the last one runs to
 * the first statement after the group.
 */
const renderVals = lineOf(/^\s*renderVals\(\)\s*\{/, 0, 'renderVals()');

const PACK_ORDER = ['vis', 'vis3', 'vis4', 'vis5', 'vis2', 'vis1'];
const packStart = {};
for (const name of PACK_ORDER) {
  packStart[name] = lineOf(new RegExp(`^\\s*let ${name} = null;`), renderVals, `let ${name} = null`);
}
/* the first thing renderVals does after the last pack block */
const afterPacks = lineOf(/^\s*const phaseBuilt = /, renderVals, 'const phaseBuilt');

const sortedStarts = [...PACK_ORDER].sort((a, b) => packStart[a] - packStart[b]);
const packRange = {};
sortedStarts.forEach((name, i) => {
  const next = i + 1 < sortedStarts.length ? packStart[sortedStarts[i + 1]] : afterPacks;
  packRange[name] = [packStart[name], next - 1];
});

/*
 * `const V = p.visual;`, `const W3 = p.visual3;` and their siblings sit just
 * *above* the block that uses them, which puts each one at the tail of the
 * previous block's range - or, for the first, outside every range. Move them:
 * strip the declarations off the end of every range, then give each block back
 * the ones its own body actually mentions. Doing it by what the body
 * references rather than by a fixed table means a re-export that adds, renames
 * or reorders a pack still lands correctly.
 *
 * The alias is a single capital, optionally numbered - `V`, `W`, `W2` - so the
 * pattern has to admit all of them. Matching only the `W` series left phase 0
 * without its `const V`, and the console died on `V is not defined`.
 */
const W_DECL = /^\s*const ([A-Z]\d?) = p\.\w+;\s*$/;
const wDecls = new Map();
for (let i = renderVals; i < afterPacks; i += 1) {
  const m = W_DECL.exec(all[i]);
  if (m) wDecls.set(m[1], all[i]);
}
for (const name of PACK_ORDER) {
  let [from, to] = packRange[name];
  while (to > from && W_DECL.test(all[to - 1])) to -= 1;
  packRange[name] = [from, to];
}
/** The `const W… = p.…;` lines a block's body refers to, in declaration order. */
function preambleFor(body) {
  return [...wDecls.entries()]
    .filter(([id]) => new RegExp(`\\b${id}\\b`).test(body))
    .map(([, line]) => line);
}

/* the extras IIFE: `const xtra = (() => { … })();` */
const xtraOpen = lineOf(/^\s*const xtra = \(\(\) => \{/, renderVals, 'const xtra = (() => {');
const xtraReturn = lineOf(/^\s*return X;/, xtraOpen, 'return X (extras)');

const HEADER = `// @ts-nocheck
/*
 * Ported verbatim from renderVals() in the original Sprint Console export by
 * scripts/extract-view-model.mjs. Prefer re-running that script over editing
 * this file by hand.
 *
 * Type checking is off in this file on purpose: the block reads unvalidated
 * model JSON off the engagement, so every accessor is dynamic. Typing it
 * properly means validating each pack shape on write (see docs/BACKEND.md,
 * "pack validation"); until then the source stays diff-able against the
 * original console.
 */
import type { PackContext } from './context';
`;

/*
 * Corrections applied to the verbatim blocks. The portfolio bucket is called
 * DO NOT BUILD in the playbook; the source console shortened it.
 */
const REWRITES = [["'DECLINE'", "'DO NOT BUILD'"]];

const BLOCKS = [
  {
    file: 'phase0.ts',
    fn: 'buildPhase0Pack',
    doc: 'Phase 0 — the outside-in pack: snapshot, SWOT, benchmark quadrant,\n * positioning map, peer ranking, capability heatmap, value tree and chain,\n * activity classification, hypothesis bank, stakeholder map and BCG matrix.',
    returns: 'vis',
    uses: ['p', 'accent', 'pk', 'pickOn', 'picks'],
  },
  {
    file: 'phase1.ts',
    fn: 'buildPhase1Pack',
    doc: 'Phase 1 — the leadership validation pack: north star, benchmark quadrant,\n * scorecard, value tree, value pools, priority matrix, leadership heatmap and\n * the hypothesis disposition bank.',
    returns: 'vis1',
    uses: ['p', 'accent', 'pk', 'pickOn', 'picks'],
  },
  {
    file: 'phase2.ts',
    fn: 'buildPhase2Pack',
    doc: 'Phase 2 — the functional diagnostic pack: functional KPIs, benchmark\n * comparison, functional economics, pain heatmap, opportunity map, value\n * ranking, scoring, priority matrix, leakage and the forensic shortlist.',
    returns: 'vis2',
    uses: ['p', 'accent', 'pk', 'pickOn'],
  },
  {
    file: 'phase3.ts',
    fn: 'buildPhase3Pack',
    doc: 'Phase 3 — the process forensics pack: the current-state twin, effort vs\n * waiting, process health, handoffs, friction heatmap, rework, economic\n * impact per step, people-and-systems map, root cause tree and step-level\n * quantification.',
    returns: 'vis3',
    uses: ['p', 'accent'],
  },
  {
    file: 'phase4.ts',
    fn: 'buildPhase4Pack',
    doc: 'Phase 4 — the AI-native redesign pack: current vs future flow, activity\n * transformation, human/AI responsibility, handoff and effort reduction,\n * future KPIs, decision rights, architecture, economics and the scorecard.',
    returns: 'vis4',
    uses: ['p', 'accent'],
  },
  {
    file: 'phase5.ts',
    fn: 'buildPhase5Pack',
    doc: 'Phase 5 — the business case pack: value at stake, business case per\n * initiative, current-vs-future bridge, investment split, implementation\n * scope, portfolio, sequence and the KPI framework.',
    returns: 'vis5',
    uses: ['p'],
  },
];

mkdirSync(outDir, { recursive: true });

for (const block of BLOCKS) {
  const [from, to] = packRange[block.returns];
  let body = slice(from, to);
  const preamble = preambleFor(body);
  if (preamble.length) body = `${preamble.join('\n')}\n${body}`;
  for (const [from, to] of REWRITES) body = body.split(from).join(to);
  const src = `${HEADER}
/**
 * ${block.doc}
 */
export function ${block.fn}(ctx: PackContext) {
  const { ${block.uses.join(', ')} } = ctx;
${body}
  return ${block.returns};
}
`;
  writeFileSync(join(outDir, block.file), src, 'utf8');
  console.log(`  ${block.file} (${body.split('\n').length} lines)`);
}

/* the playbook-parity extras, derived from every pack at once */
const xtraBody = slice(xtraOpen + 1, xtraReturn);
writeFileSync(
  join(outDir, 'extras.ts'),
  `${HEADER}
/**
 * Playbook-parity extras derived across the packs in one pass — value chain
 * stage detail, activity classification, hypothesis bank, stakeholder map,
 * management ambition, step-level quantification, human/AI role split, the
 * current-vs-future bridge, the investment split and implementation scope.
 *
 * Keys: chain / cls / hyp / stk / amb / steps / roles / bridge / invest / scope.
 */
export function buildExtras(ctx: PackContext) {
  const { p, accent, pk, pickOn } = ctx;
${xtraBody}
}
`,
  'utf8',
);
console.log(`  extras.ts (${xtraBody.split('\n').length} lines)`);
