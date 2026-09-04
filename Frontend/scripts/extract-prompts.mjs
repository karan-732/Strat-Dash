/*
 * extract-prompts — pulls the generation prompts out of the original
 * `Sprint Console.dc.html` so the ported pipeline sends byte-identical
 * instructions to the model.
 *
 *   node scripts/extract-prompts.mjs <Sprint Console.dc.html> <out.ts>
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const [srcPath, outPath] = process.argv.slice(2);
const lines = readFileSync(srcPath, 'utf8').split('\n');

/*
 * Everything below is located by anchor - the enclosing method name and the
 * shape of the assignment - never by absolute line number. The source is
 * re-exported from a design tool whenever the UI changes and every offset moves
 * when it does, which is what broke the previous run of this script.
 */

/** Every quoted literal on a line, in order, with its quote character. */
function literalsOn(lineNo) {
  const line = lines[lineNo - 1] ?? '';
  const out = [];
  for (let i = 0; i < line.length; i++) {
    const quote = line[i];
    if (quote !== "'" && quote !== '"') continue;
    let raw = '';
    let j = i + 1;
    for (; j < line.length; j++) {
      if (line[j] === '\\') {
        raw += line[j] + line[j + 1];
        j++;
        continue;
      }
      if (line[j] === quote) break;
      raw += line[j];
    }
    out.push({ quote, raw });
    i = j;
  }
  return out;
}

/** Pull the literal assigned to `const <name> = ` on a line. */
function literalOn(lineNo, name) {
  const line = lines[lineNo - 1];
  const at = line.indexOf(`const ${name} = `);
  if (at < 0) throw new Error(`no "const ${name}" on line ${lineNo}`);
  let i = at + `const ${name} = `.length;
  const quote = line[i];
  if (quote !== "'" && quote !== '"') throw new Error(`line ${lineNo} does not start a literal`);
  i++;
  let raw = '';
  for (; i < line.length; i++) {
    const c = line[i];
    if (c === '\\') {
      raw += c + line[i + 1];
      i++;
      continue;
    }
    if (c === quote) break;
    raw += c;
  }
  return { quote, raw };
}

/** Pull the Nth quoted literal on a line (used for the prose briefs). */
function nthLiteral(lineNo, n) {
  const found = literalsOn(lineNo)[n];
  if (!found) throw new Error(`literal #${n} not found on line ${lineNo}`);
  return found;
}

/*
 * The line span of each top-level method on the console object, so a lookup for
 * `const shape` can be scoped to the method that owns it. Six of them are
 * called `buildVisuals…` and every one declares a `shape` and a `system`.
 */
const METHODS = (() => {
  const found = [];
  const head = /^  (?:async )?([a-zA-Z_][\w]*)\(/;
  lines.forEach((line, i) => {
    const m = head.exec(line);
    if (m) found.push({ name: m[1], from: i + 1 });
  });
  const spans = new Map();
  found.forEach((entry, i) => {
    /* a name can appear once only; later duplicates would shadow the first */
    if (!spans.has(entry.name)) {
      spans.set(entry.name, { from: entry.from, to: (found[i + 1]?.from ?? lines.length + 1) - 1 });
    }
  });
  return spans;
})();

function span(method) {
  const found = METHODS.get(method);
  if (!found) throw new Error(`extract-prompts: no method "${method}" in the source`);
  return found;
}

/** The line inside `method` that assigns `const <name> = '…'`. */
function lineIn(method, name) {
  const { from, to } = span(method);
  for (let i = from; i <= to; i++) {
    if ((lines[i - 1] ?? '').includes(`const ${name} = `)) return i;
  }
  throw new Error(`extract-prompts: no "const ${name}" inside ${method}()`);
}

const constIn = (method, name) => literalOn(lineIn(method, name), name);

/**
 * The playbook brief a pack prompt appends: the one literal in the method that
 * opens with a blank line and talks about the playbook. Phase 2 has none - it
 * appends a scope override instead - so a miss is not an error.
 */
function briefIn(method) {
  const { from, to } = span(method);
  for (let i = from; i <= to; i++) {
    for (const lit of literalsOn(i)) {
      if (lit.raw.startsWith('\\n\\n') && /laybook/.test(lit.raw)) return lit;
    }
  }
  return null;
}

/** The one literal in `method` whose text starts with `head`. */
function literalStarting(method, head) {
  const { from, to } = span(method);
  for (let i = from; i <= to; i++) {
    for (const lit of literalsOn(i)) if (lit.raw.startsWith(head)) return lit;
  }
  throw new Error(`extract-prompts: no literal starting "${head}" inside ${method}()`);
}

const ts = (lit) => (lit.quote === "'" ? `'${lit.raw}'` : `"${lit.raw}"`);

/* the six pack prompts, by the method that builds each one */
const PACK_METHOD = ['buildVisuals', 'buildVisuals1', 'buildVisuals2', 'buildVisuals3', 'buildVisuals4', 'buildVisuals5'];

const shapes = [];
const systems = [];
const briefs = [];
PACK_METHOD.forEach((method, phase) => {
  shapes[phase] = ts(constIn(method, 'shape'));
  systems[phase] = ts(constIn(method, 'system'));
  const brief = briefIn(method);
  briefs[phase] = brief ? ts(brief) : "''";
});

/* Phase 2 swaps the playbook brief for a scope override. */
const scopeProcess = ts(literalStarting('buildVisuals2', '\\n\\nSCOPE OVERRIDE'));
const scopeDepartment = ts(literalStarting('buildVisuals2', '\\n\\nSCOPE - '));

/* peer ranking (phase 0, second AI pass) */
const peer = {
  shape1: ts(constIn('peerRank', 'shape1')),
  sys1: ts(constIn('peerRank', 'sys1')),
  shape2: ts(constIn('peerRank', 'shape2')),
  sys2: ts(constIn('peerRank', 'sys2')),
};

/* client questions + next moves */
const questions = {
  shape: ts(constIn('buildQuestions', 'shape')),
  system: ts(constIn('buildQuestions', 'system')),
};

/* one deliverable draft */
const deliverable = { system: ts(constIn('generate', 'system')) };

/* research desk — one concatenated system prompt, in three literals */
const researchLine = lineIn('runResearch', 'system');
const researchLits = literalsOn(researchLine);
const research = {
  system: ts(researchLits[0]),
  benchmarks: ts(researchLits[1]),
  tail: ts(researchLits[researchLits.length - 1]),
};

const body = `/*
 * GENERATED by scripts/extract-prompts.mjs from the original Sprint Console
 * export — do not edit by hand. Every string here is byte-identical to the
 * instructions the source console sent to the model.
 */

/** The JSON shape each phase pack must match. */
export const PACK_SHAPES: readonly string[] = [
${shapes.map((s) => '  ' + s + ',').join('\n')}
];

/** The system prompt for each phase pack. */
export const PACK_SYSTEMS: readonly string[] = [
${systems.map((s) => '  ' + s + ',').join('\n')}
];

/** Playbook-parity instructions appended to each phase prompt ('' for phase 2). */
export const PACK_BRIEFS: readonly string[] = [
${briefs.map((s) => '  ' + s + ',').join('\n')}
];

/** Phase 2 runs differently depending on how the sprint is scoped. */
export const PHASE2_SCOPE_BRIEF = {
  process: ${scopeProcess},
  department: ${scopeDepartment},
} as const;

export const PEER_RANK = {
  setupShape: ${peer.shape1},
  setupSystem: ${peer.sys1},
  scoreShape: ${peer.shape2},
  scoreSystem: ${peer.sys2},
} as const;

export const QUESTIONS = {
  shape: ${questions.shape},
  system: ${questions.system},
} as const;

export const DELIVERABLE = {
  system: ${deliverable.system},
} as const;

export const RESEARCH = {
  systemHead: ${research.system},
  systemBenchmarks: ${research.benchmarks},
  systemTail: ${research.tail},
} as const;
`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, body, 'utf8');
console.log(`wrote ${outPath} (${body.length} bytes)`);
