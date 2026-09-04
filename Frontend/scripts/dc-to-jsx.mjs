/*
 * dc-to-jsx — one-off codemod that lifted the original single-file
 * `Sprint Console.dc.html` template into the React tree under src/components.
 *
 * It is kept in the repo so the port can be re-run against a newer export of
 * the source console instead of being hand-merged:
 *
 *   node scripts/dc-to-jsx.mjs <path-to-Sprint Console.dc.html> <out-dir>
 *
 * Transformations
 *   class=                 -> className=
 *   style="a:b"            -> style={{ a: 'b' }}   (interpolations become template literals)
 *   style-hover="a:b"      -> generated `.hv-N:hover` rule in hover.css + className
 *   {{ expr }}             -> {v.expr}             (loop variables are left unprefixed)
 *   <sc-if value="{{x}}">  -> {x ? (<>…</>) : null}
 *   <sc-for list as="n">   -> {(list ?? []).map((n, i) => <Fragment key={i}>…</Fragment>)}
 *   hint-placeholder-*     -> dropped (editor-only hints)
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';

const VOID = new Set(['img', 'input', 'br', 'hr', 'meta', 'link', 'source']);
const EVENTS = new Set([
  'onClick', 'onChange', 'onMouseEnter', 'onMouseLeave', 'onFocus', 'onBlur',
  'onKeyDown', 'onDragOver', 'onDrop', 'onInput', 'onSubmit',
]);
/*
 * Bundled assets, by the uuid the export refers to them by, mapped to where
 * they are vendored in public/.
 */
const ASSETS = {
  '73ad6bee-a437-4090-a509-71b943d723cf': '/altrd-logo.png',
};

const ATTR_RENAME = {
  class: 'className',
  for: 'htmlFor',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'text-anchor': 'textAnchor',
  'dominant-baseline': 'dominantBaseline',
  tabindex: 'tabIndex',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  maxlength: 'maxLength',
  autocomplete: 'autoComplete',
  readonly: 'readOnly',
  contenteditable: 'contentEditable',
  spellcheck: 'spellCheck',
};
const BOOLEAN_ATTRS = new Set(['disabled', 'multiple', 'checked', 'readOnly', 'required', 'autoFocus']);
/* React types these as numbers, so a literal has to be emitted as an expression. */
const NUMERIC_ATTRS = new Set([
  'aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-level', 'aria-posinset', 'aria-setsize',
  'aria-colcount', 'aria-colindex', 'aria-colspan', 'aria-rowcount', 'aria-rowindex', 'aria-rowspan',
  'tabIndex', 'colSpan', 'rowSpan', 'maxLength', 'size', 'span',
]);

/* ------------------------------------------------------------------ parse */

function parse(html) {
  const root = { type: 'root', children: [] };
  const stack = [root];
  let i = 0;
  const push = (node) => stack[stack.length - 1].children.push(node);

  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt < 0) {
      pushText(html.slice(i));
      break;
    }
    if (lt > i) pushText(html.slice(i, lt));

    if (html.startsWith('<!--', lt)) {
      i = html.indexOf('-->', lt) + 3;
      continue;
    }
    const gt = findTagEnd(html, lt);
    const raw = html.slice(lt + 1, gt);
    i = gt + 1;

    if (raw[0] === '/') {
      const name = raw.slice(1).trim().toLowerCase();
      for (let s = stack.length - 1; s > 0; s--) {
        if (stack[s].name === name) {
          stack.length = s;
          break;
        }
      }
      continue;
    }

    const selfClosing = raw.endsWith('/');
    const body = selfClosing ? raw.slice(0, -1) : raw;
    const m = /^([A-Za-z][-A-Za-z0-9]*)/.exec(body);
    const name = m[1].toLowerCase();
    const node = { type: 'el', name, attrs: parseAttrs(body.slice(m[1].length)), children: [] };
    push(node);
    if (!selfClosing && !VOID.has(name)) stack.push(node);
  }
  return root;

  function pushText(text) {
    if (!text) return;
    push({ type: 'text', text });
  }
}

function findTagEnd(html, lt) {
  let quote = null;
  for (let j = lt + 1; j < html.length; j++) {
    const c = html[j];
    if (quote) {
      if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'") quote = c;
    else if (c === '>') return j;
  }
  return html.length;
}

function parseAttrs(src) {
  const attrs = [];
  const re = /([A-Za-z_:][-A-Za-z0-9_:.]*)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let m;
  while ((m = re.exec(src))) {
    if (!m[1]) continue;
    const value = m[3] ?? m[4] ?? m[5] ?? null;
    attrs.push({ name: m[1], value });
  }
  return attrs;
}

/* --------------------------------------------------------------- emitting */

const hoverRules = new Map();

function hoverClass(decls) {
  if (!hoverRules.has(decls)) hoverRules.set(decls, `hv-${hoverRules.size + 1}`);
  return hoverRules.get(decls);
}

const camel = (prop) =>
  prop.startsWith('-webkit-')
    ? 'Webkit' + camel(prop.slice(8)).replace(/^./, (c) => c.toUpperCase())
    : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

const INTERP = /\{\{([\s\S]*?)\}\}/g;

/** Turn a `{{ expr }}` reference into JS, prefixing free identifiers with `v.` */
function expr(src, scope) {
  const code = src.trim();
  const head = /^[A-Za-z_$][\w$]*/.exec(code);
  if (!head) return code;
  if (scope.has(head[0]) || ['true', 'false', 'null', 'undefined'].includes(head[0])) return code;
  return `v.${code}`;
}

/** A whole attribute/text value that may mix literal text with interpolations. */
function valueToJs(value, scope) {
  const parts = [];
  let last = 0;
  INTERP.lastIndex = 0;
  let m;
  while ((m = INTERP.exec(value))) {
    if (m.index > last) parts.push({ lit: value.slice(last, m.index) });
    parts.push({ code: expr(m[1], scope) });
    last = m.index + m[0].length;
  }
  if (last < value.length) parts.push({ lit: value.slice(last) });

  const codes = parts.filter((p) => p.code);
  if (!codes.length) return { kind: 'literal', text: value };
  if (parts.length === 1) return { kind: 'code', code: codes[0].code };
  const tpl = parts
    .map((p) => (p.code ? '${' + p.code + '}' : p.lit.replace(/[\\`$]/g, (c) => '\\' + c)))
    .join('');
  return { kind: 'code', code: '`' + tpl + '`' };
}

function styleObject(value, scope) {
  const entries = [];
  value
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
    .forEach((decl) => {
      const c = decl.indexOf(':');
      if (c < 0) return;
      const prop = decl.slice(0, c).trim();
      const raw = decl.slice(c + 1).trim();
      const key = /^[a-zA-Z][\w]*$/.test(camel(prop)) ? camel(prop) : `'${prop}'`;
      const jsValue = valueToJs(raw, scope);
      entries.push(`${key}: ${jsValue.kind === 'code' ? jsValue.code : quote(jsValue.text)}`);
    });
  return `{{ ${entries.join(', ')} }}`;
}

const quote = (s) => (s.includes("'") ? `"${s.replace(/"/g, '\\"')}"` : `'${s}'`);

function decode(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function emitChildren(children, scope, indent, rec) {
  return children
    .map((c) => rec(c, scope, indent))
    .filter((s) => s !== null && s.trim() !== '')
    .join('\n');
}

function emitNode(node, scope, indent, rec) {
  const pad = '  '.repeat(indent);
  const stamp = node.type === 'el' ? pendingCardStamp : null;
  if (stamp) pendingCardStamp = null;

  const slots = node.type === 'el' ? SLOT_INJECTIONS.filter((s) => s.match(node)) : [];
  slots.forEach((s) => injected.add(s));
  const withSlot = (kids, at) => {
    if (!slots.length) return kids;
    const pad = '  '.repeat(at);
    const tag = (s) => {
      if (s.props === 'none') return `${pad}<${s.component} />`;
      if (s.props === 'card') {
        /*
         * The portfolio card, from the `sc-for … as="c"` the dashboard loops
         * with. Named rather than passed as `v`, because the control acts on
         * one engagement and should not be able to reach the whole model.
         */
        return `${pad}<${s.component} card={c} />`;
      }
      if (s.props === 'provider') {
        return [
          `${pad}<${s.component}`,
          `${pad}  provider={v.generationProvider}`,
          `${pad}  providers={v.generationProviders}`,
          `${pad}  disabled={v.generationProviderBusy}`,
          `${pad}  onChange={v.setGenerationProvider}`,
          `${pad}/>`,
        ].join('\n');
      }
      return `${pad}<${s.component} v={v} />`;
    };
    const first = slots.filter((s) => s.position !== 'last').map(tag);
    const last = slots.filter((s) => s.position === 'last').map(tag);
    return [...first, kids, ...last].filter(Boolean).join('\n');
  };

  if (node.type === 'text') {
    const text = node.text;
    if (!text.trim()) return null;

    /* a whole interpolated line swapped for one binding */
    const whole = INTERPOLATED_TO_BINDING.find(([re]) => re.test(text.trim()));
    if (whole) return `${pad}{${whole[1]}}`;

    const parts = [];
    let last = 0;
    INTERP.lastIndex = 0;
    let m;
    while ((m = INTERP.exec(text))) {
      if (m.index > last) parts.push(literalText(text.slice(last, m.index)));
      parts.push(`{${expr(m[1], scope)}}`);
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(literalText(text.slice(last)));
    const joined = parts.filter(Boolean).join('');
    return joined ? pad + joined : null;
  }

  if (node.name === 'sc-if') {
    const cond = attr(node, 'value');
    const test = expr(stripBraces(cond), scope);
    const inner = withSlot(emitChildren(node.children, scope, indent + 1, rec), indent + 1);
    return `${pad}{${test} ? (\n${pad}  <>\n${inner}\n${pad}  </>\n${pad}) : null}`;
  }

  if (node.name === 'sc-for') {
    const list = expr(stripBraces(attr(node, 'list')), scope);
    const as = attr(node, 'as') || 'item';
    const idx = `${as}Index`;
    const next = new Set(scope);
    next.add(as);
    next.add(idx);
    const inner = emitChildren(node.children, next, indent + 2, rec);
    return `${pad}{(${list} ?? []).map((${as}: any, ${idx}: number) => (\n${pad}  <Fragment key={${idx}}>\n${inner}\n${pad}  </Fragment>\n${pad}))}`;
  }

  const props = [];
  let hover = null;
  for (const a of node.attrs) {
    if (a.name.startsWith('hint-placeholder')) continue;
    if (a.name === 'style-hover') {
      hover = a.value;
      continue;
    }
    props.push(...propToJsx(node, a, scope));
  }
  if (stamp) {
    props.push(`data-card=${JSON.stringify(stamp.id)}`);
    props.push(`data-card-title=${JSON.stringify(stamp.title)}`);
  }
  /*
   * Scatter-chart points: a dot positioned at left/top with its label beneath.
   * usePlotLabels finds them by this attribute and separates labels that would
   * otherwise land on top of each other.
   */
  if (node.type === 'el' && isPlotPoint(node)) props.push('data-plot-point=""');
  if (hover) {
    const cls = hoverClass(hover);
    const existing = props.findIndex((p) => p.startsWith('className='));
    if (existing >= 0) {
      const prev = props[existing].slice('className='.length);
      props[existing] = prev.startsWith('{')
        ? `className={\`\${${prev.slice(1, -1)}} ${cls}\`}`
        : `className={\`${prev.slice(1, -1)} ${cls}\`}`;
    } else {
      props.push(`className="${cls}"`);
    }
  }

  const name = node.name === 'sc-slot' ? 'div' : node.name;
  const open = props.length ? `<${name} ${props.join(' ')}` : `<${name}`;
  const kids = withSlot(emitChildren(node.children, scope, indent + 1, rec), indent + 1);

  /*
   * A layout wrapper whose every child was a dropped card is itself dead —
   * emitting it would leave an empty grid row in the pack.
   */
  if (!kids && (node.children ?? []).some((c) => c.type === 'el')) return '';
  if (VOID.has(name) || !kids) return `${pad}${open}${props.length ? ' ' : ''}/>`.replace('  />', ' />');
  return `${pad}${open}>\n${kids}\n${pad}</${name}>`;
}

/*
 * `TEXT_REWRITES` applies to anything the reader actually reads, which is not
 * only text nodes: the longest copy in the console is a textarea placeholder,
 * and the labels above the source inputs are attribute values too. Rewriting
 * only text nodes meant those could be trimmed in the tree and then grow back
 * on the next `bun run port:jsx`.
 */
function rewriteCopy(text) {
  for (const [from, to] of TEXT_REWRITES) if (text.includes(from)) text = text.replace(from, to);
  return text;
}

/** Attributes whose literal value is copy rather than markup. */
const COPY_ATTRS = new Set(['placeholder', 'title', 'aria-label', 'alt']);

function literalText(raw) {
  let text = decode(raw).replace(/\s+/g, ' ');
  if (!text.trim()) return '';
  if (renumber) {
    text = text.replace(new RegExp('^(\\s*)' + renumber.from + ' · '), `$1${renumber.to} · `);
  }
  text = rewriteCopy(text);
  const binding = TEXT_TO_BINDING[text.trim()];
  if (binding) return `{${binding}}`;
  return text.replace(/[{}]/g, (c) => `{'${c}'}`);
}

/*
 * The design tool serialises camelCase attributes as `sc-camel-<kebab>`, so
 * `onClick` arrives as `sc-camel-on-click` and `viewBox` as
 * `sc-camel-view-box`. Undo it: without this the props survive into the JSX
 * verbatim, React ignores them as unknown attributes, and every button,
 * chart point and input in the console renders but does nothing. The whole UI
 * was inert until this was found - the tabs would not even switch.
 */
function unCamelPrefix(name) {
  if (!name.startsWith('sc-camel-')) return null;
  return name
    .slice('sc-camel-'.length)
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function propToJsx(node, a, scope) {
  const name = ATTR_RENAME[a.name] || unCamelPrefix(a.name) || a.name;

  if (a.value === null) return [name];

  if (name === 'style') return [`style=${styleObject(a.value, scope)}`];

  if (EVENTS.has(name)) {
    const code = expr(stripBraces(a.value), scope);
    return [`${name}={${code}}`];
  }

  const jsValue = valueToJs(a.value, scope);

  if (BOOLEAN_ATTRS.has(name)) {
    if (jsValue.kind === 'code') return [`${name}={${jsValue.code}}`];
    return [name];
  }

  if (NUMERIC_ATTRS.has(name)) {
    if (jsValue.kind === 'code') return [`${name}={${jsValue.code}}`];
    const n = Number(jsValue.text);
    return [`${name}={${Number.isFinite(n) ? n : JSON.stringify(jsValue.text)}}`];
  }

  if (name === 'src' && jsValue.kind === 'literal') {
    /*
     * The export references bundled assets by uuid - `src="73ad6bee-…"` for
     * the logo - which resolves to nothing and 404s. Map the ones vendored
     * under public/ back to their real path.
     */
    const asset = ASSETS[jsValue.text];
    if (asset) return [`src=${quote(asset)}`];
    return [`src=${quote(jsValue.text.replace(/^\.\//, '/'))}`];
  }

  if (jsValue.kind === 'code') return [`${name}={${jsValue.code}}`];
  const literal = decode(jsValue.text);
  return [`${name}=${JSON.stringify(COPY_ATTRS.has(name) ? rewriteCopy(literal) : literal)}`];
}

/** A positioned scatter-chart point in the source markup. */
function isPlotPoint(node) {
  const style = node.attrs?.find((a) => a.name === 'style')?.value ?? '';
  return style.includes('position:absolute') && style.includes('transform:translate(-50%,-50%)') && style.includes('left: {{');
}

const attr = (node, name) => {
  const found = node.attrs.find((a) => a.name === name);
  return found ? found.value : '';
};
const stripBraces = (s) => s.replace(/^\s*\{\{|\}\}\s*$/g, '');

/* -------------------------------------------------------- section mapping */

/*
 * The source template is one 2.7k-line tree. These rules cut it at the seams
 * the console already had — one file per view, per workspace band, per phase
 * output pack and per numbered card inside a pack — so the ported tree is
 * navigable instead of being a single generated blob.
 */

const styleOf = (node) => (node.type === 'el' ? attr(node, 'style') || '' : '');
const classOf = (node) => (node.type === 'el' ? attr(node, 'class') || '' : '');
const scIf = (node, value) => node.type === 'el' && node.name === 'sc-if' && stripBraces(attr(node, 'value')).trim() === value;
const hasClass = (node, cls) => classOf(node).split(/\s+/).includes(cls);

/** `projectOverview` / `phaseWorkspace` guard both a breadcrumb button and the
 *  band itself; only the band carries the scroller, so match on that. */
function containsClass(node, cls, depth = 3) {
  if (depth < 0 || node.type !== 'el') return false;
  if (hasClass(node, cls)) return true;
  return (node.children ?? []).some((c) => containsClass(c, cls, depth - 1));
}

const CARD_LABEL = /^(\d{2}[A-Z]?) · (.+)$/;

/*
 * Cards the port removes on its own. Empty by design: the source template now
 * ships the de-duplicated set, so dropping anything here would put the port
 * back out of step with the file it is generated from. Phase 1's competitive
 * benchmark quadrant and scorecard, and phase 4's future-state KPI cards and
 * economic impact, were removed upstream and are already absent.
 */
const DROPPED_CARDS = new Set();

/*
 * Copy the source template left behind when cards were removed upstream. The
 * numbered cards went, the sentences describing them did not, so phase 1 still
 * advertised eight views and named two that no longer render, and phase 4 still
 * counted ten. These are corrections to stale prose, not additions - phases 0
 * and 3 are internally consistent and are left alone.
 */
const TEXT_REWRITES = [
  [
    'NORTH STAR · BENCHMARK QUADRANT · SCORECARD · VALUE TREE · VALUE POOLS · PRIORITY MATRIX · HYPOTHESIS BANK · LEADERSHIP HEATMAP',
    'NORTH STAR · VALUE TREE · VALUE POOLS · PRIORITY MATRIX · LEADERSHIP HEATMAP · AMBITION · HYPOTHESIS BANK',
  ],
  ['Eight validation views built from leadership input', 'Seven validation views built from leadership input'],
  ['Ten redesign views built from the', 'Nine redesign views built from the'],
  /*
   * The dashboard bar measures generated packs, not deliverable status - the
   * copy predates the backend and described what the prototype tracked.
   */
  [
    'Completion tracks deliverable status across all six phases.',
    'Completion tracks generated current packs across all six phases.',
  ],
  /*
   * Copy that explains the console to itself.
   *
   * The prototype had to argue for each control, so every box carried a
   * paragraph on what it was for and what would happen to what you put in it.
   * On a phase with seven questions, a data room and a notes box that is more
   * instruction than content, and it says the same three things — this feeds
   * the generation, live sources are read, nothing is uploaded — in four
   * places. Kept once each, where it is load-bearing; trimmed to the label
   * everywhere else.
   */
  [
    'Load what you have in the INPUTS tab, then press GENERATE at the bottom of it. The pack is built from live sources - the company site, the links you add and the notes held here.',
    'Load what you have on the INPUTS tab, then press GENERATE at the bottom of it.',
  ],
  [
    "Type anything the documents don't carry - interview notes, numbers given verbally, constraints, client language to preserve. Everything entered here is fed to the package build for this phase.",
    "Interview notes, numbers given verbally, constraints, client language to preserve - anything the documents don't carry.",
  ],
  [
    'Drop files here - questionnaires, ERP exports, transcripts, screenshots, sample documents',
    'Drop files here - questionnaires, exports, transcripts, screenshots',
  ],
  [
    'OTHER LINKS - ANNUAL REPORT, FILINGS, SECTOR NOTES, DASHBOARDS',
    'OTHER LINKS - REPORTS, FILINGS, SECTOR NOTES',
  ],
];

/*
 * Components the port adds that the source template had no place for.
 *
 * Empty by instruction: the console must show exactly what the source file
 * shows, nothing more. The agent loop that used to have its own panels here
 * now runs through the channels the source already provides - a phase's
 * outstanding intake needs appear inside the QUESTIONS FOR THE CLIENT block,
 * and material coming back from the client arrives through the manual-entry
 * box on the INPUTS tab. The machinery is unchanged; only its surfaces are.
 */
const SLOT_INJECTIONS = [
  /*
   * The model picker. Two rows carry it: the app header on the dashboard and
   * attention views, and the actions row inside an engagement header. Matching
   * `eng-header` as well would inject it twice, since the actions row is a
   * descendant of it. It has
   * to be injected rather than hand-added: `src/components` is wiped and
   * rewritten on every run, and the first copy of this component lived there
   * and was destroyed by exactly that.
   */
  ...['app-main-header', 'eng-actions'].map((cls) => ({
    match: (node) => node.type === 'el' && hasClass(node, cls),
    component: 'GenerationProviderSwitch',
    from: '@/features/console/components/GenerationProviderSwitch',
    props: 'provider',
  })),
  {
    /*
     * What a run has found, at the foot of the generation panel. The stream
     * carries the sources read, the evidence counts, the check's score and any
     * warnings; the panel showed eight dots and a percentage.
     */
    match: (node) => node.type === 'el' && hasClass(node, 'eng-gen-stage'),
    component: 'GenerationFound',
    from: '@/features/console/components/GenerationFound',
    position: 'last',
  },
  {
    /*
     * The handoff, at the top of the INPUTS tab: what this phase asks, what the
     * phase before it asked the client, and where the answers go. The template
     * has no such surface - it was built before phases were chained.
     */
    match: (node) => node.type === 'el' && node.name === 'sc-if'
      && stripBraces(attr(node, 'value')).trim() === 'tabInputs',
    component: 'PhaseHandoff',
    from: '@/features/console/components/PhaseHandoff',
  },
  {
    /* the report download, at the foot of the outputs rather than above them */
    match: (node) => node.type === 'el' && node.name === 'sc-if'
      && stripBraces(attr(node, 'value')).trim() === 'tabDocs',
    component: 'ReportAction',
    from: '@/features/console/components/ReportAction',
    position: 'last',
  },
  {
    /*
     * Removing an engagement. The template has no such control - it was built
     * before there was a database to remove anything from - so it is injected
     * into each portfolio card.
     */
    match: (node) => node.type === 'el' && hasClass(node, 'portfolio-card'),
    component: 'PortfolioCardRemove',
    from: '@/features/console/components/PortfolioCardRemove',
    props: 'card',
    /* last, so the confirmation reads after the name it applies to */
    position: 'last',
  },
  {
    /*
     * What the peer pass actually read. The ranking is the one card built from
     * pages fetched live, so the sources belong with it - otherwise a
     * benchmarked figure and a reported one look identical.
     */
    match: (node) => isCard(node, 'phase0', '05'),
    component: 'PeerRankingSources',
    from: '@/features/console/components/PeerRankingSources',
    position: 'last',
  },
];

/*
 * Button labels that need to report progress, swapped for a view-model value.
 */
const TEXT_TO_BINDING = {
  'DOWNLOAD FULL REPORT': 'v.reportLabel',
};

/*
 * Text that interpolates a value and still needs to change wholesale. The CTA
 * eyebrow reads "PHASE 0 · FINAL STEP" in the template, which is wrong once the
 * phase has been generated and the step is behind you.
 */
const INTERPOLATED_TO_BINDING = [
  [/^PHASE \{\{ ph\.num \}\} · FINAL STEP$/, 'v.genCtaEyebrow'],
];

/*
 * Card renumbering the port applies on its own. Empty for the same reason as
 * DROPPED_CARDS - the source template already numbers each pack 01, 02, 03…
 * around its own removals.
 */
const RENUMBERED_CARDS = {};

function firstCardLabel(node, depth = 0) {
  if (depth > 4 || node.type !== 'el') return null;
  for (const child of node.children ?? []) {
    if (child.type === 'text') {
      const m = CARD_LABEL.exec(decode(child.text).trim());
      if (m) return m;
    }
    const found = firstCardLabel(child, depth + 1);
    if (found) return found;
  }
  return null;
}

const pascal = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

/** Which phase pack are we currently inside — drives the card folder name. */
let packFolder = null;

/** Set while emitting a card whose number changed, so its header follows. */
let renumber = null;

/** Attributes to stamp on the next card root, so the report can find it. */
let pendingCardStamp = null;

const PACKS = {
  showVisual: 'phase0',
  showVisual1: 'phase1',
  showVisual2: 'phase2',
  showVisual3: 'phase3',
  showVisual4: 'phase4',
  showVisual5: 'phase5',
};

/*
 * Nodes the port renders with a hand-written component instead of generating.
 *
 * This is the escape hatch for the handful of places where the template's
 * markup is not good enough and patching the generated file by hand would
 * simply be erased on the next run. The subtree is skipped entirely and the
 * named component is imported and rendered in its place.
 */
/*
 * Nodes the port does not emit. Either something else renders them somewhere
 * better, or they should not exist at all. The subtree is skipped and nothing
 * takes its place.
 */
const DROPPED_NODES = [
  /*
   * DOWNLOAD FULL REPORT. The template offers it above the pack, so the report
   * is offered before there is anything to report on. `ReportAction` renders it
   * at the foot of the outputs instead, after the cards, the questions and the
   * next moves.
   */
  (n) => scIf(n, 'canDownloadReport'),

  /*
   * RESET. A generated phase is final: its pack is what later phases are built
   * on, its questions may already have been answered, and clearing it took
   * every later phase and every answered question with it - with no
   * confirmation. Recovery is a backend call now, not a button.
   */
  (n) =>
    n.type === 'el' &&
    n.name === 'button' &&
    stripBraces(attr(n, 'sc-camel-on-click')).trim() === 'resetOutputs',
];

const REPLACEMENTS = [
  [
    /*
     * The toast. The template shows one message in one colour for one fixed
     * duration, with no way to dismiss it and no queue, so a failure raised
     * while the console refreshed was overwritten before it could be read.
     */
    (n) => scIf(n, 'toast'),
    '@/features/console/components/Toast',
    'Toast',
  ],
  [
    /*
     * The questions for the client. The template draws the whole list here as
     * well as on the next phase's inputs, tallying in the heading how many are
     * open and how many were "left out" - two editable copies of one set of
     * questions, in the phase you have finished rather than the one you are
     * working. The replacement keeps only what belongs on a finished pack: that
     * the phase raised them, and the COPY and DOWNLOAD you send the client
     * from. The list itself is on the next phase's inputs, where the answers
     * land.
     */
    (n) => scIf(n, 'cq.show'),
    '@/features/console/components/ClientQuestions',
    'ClientQuestions',
  ],
];

const NAMED = [
  [(n) => hasClass(n, 'app-sidebar-shell'), 'layout/Sidebar'],
  [(n) => scIf(n, 'isDash'), 'dashboard/DashboardView'],
  [(n) => scIf(n, 'isAttn'), 'attention/AttentionView'],
  [(n) => scIf(n, 'isProj'), 'engagement/EngagementView'],
  [(n) => scIf(n, 'modal'), 'modals/NewEngagementModal'],
  [(n) => scIf(n, 'previewOpen'), 'modals/DocumentPreview'],

  [(n) => hasClass(n, 'eng-header'), 'engagement/EngagementHeader'],
  [(n) => scIf(n, 'projectOverview') && containsClass(n, 'eng-overview-scroll', 1), 'engagement/EngagementOverview'],
  [(n) => scIf(n, 'phaseWorkspace') && containsClass(n, 'eng-phase-nav', 1), 'engagement/PhaseWorkspace'],
  [(n) => hasClass(n, 'eng-phase-nav'), 'engagement/PhaseNav'],
  [(n) => hasClass(n, 'eng-phase-hero'), 'engagement/PhaseHero'],
  [(n) => hasClass(n, 'eng-tabs'), 'engagement/PhaseTabs'],

  [(n) => scIf(n, 'tabInputs'), 'phase/inputs/PhaseInputs'],
  [(n) => scIf(n, 'tabDocs'), 'phase/output/PhaseOutput'],
  [(n) => hasClass(n, 'eng-output-shell'), 'phase/output/OutputStatus'],
  [(n) => scIf(n, 'legacyOutput'), 'phase/output/DeliverableList'],
  [(n) => scIf(n, 'cq.show'), 'phase/output/ClientQuestions'],
  [(n) => scIf(n, 'sug.show'), 'phase/output/NextMoves'],

  [(n) => scIf(n, 'showVisual'), 'phase/output/phase0/Phase0Pack'],
  [(n) => scIf(n, 'showVisual1'), 'phase/output/phase1/Phase1Pack'],
  [(n) => scIf(n, 'showVisual2'), 'phase/output/phase2/Phase2Pack'],
  [(n) => scIf(n, 'showVisual3'), 'phase/output/phase3/Phase3Pack'],
  [(n) => scIf(n, 'showVisual4'), 'phase/output/phase4/Phase4Pack'],
  [(n) => scIf(n, 'showVisual5'), 'phase/output/phase5/Phase5Pack'],
];

/** A numbered output card: a panel whose header carries `NN · LABEL`. */
/** Is `node` the root of the numbered card `<pack>:<number>`? */
function isCard(node, pack, number) {
  if (packFolder !== pack) return false;
  const rule = cardRule(node);
  return !!rule && rule.number === number;
}

function cardRule(node) {
  if (node.type !== 'el' || node.name !== 'div' || !packFolder) return null;
  const style = styleOf(node);
  if (!/border:1px solid var\(--ln10\)/.test(style) || !/background:var\(--card\)/.test(style)) return null;
  const label = firstCardLabel(node);
  if (!label) return null;
  const key = `${packFolder}:${label[1]}`;
  if (DROPPED_CARDS.has(key)) return { dropped: true };
  const number = RENUMBERED_CARDS[key] ?? label[1];
  return {
    path: `phase/output/${packFolder}/cards/Card${number}${pascal(label[2])}`,
    from: label[1],
    number,
    title: label[2],
  };
}

const files = [];
const emitted = new Set();
/*
 * Slot components used by the file currently being written. A stack, because a
 * component being extracted can contain others: a single set would be cleared
 * by the inner extraction before the outer one had written its imports.
 */
const injectedStack = [new Set()];
const injected = {
  add: (slot) => injectedStack[injectedStack.length - 1].add(slot),
};

function componentName(path) {
  return path.slice(path.lastIndexOf('/') + 1);
}

function extractionFor(node) {
  for (const [match, path] of NAMED) if (match(node)) return { path };
  return cardRule(node);
}

/**
 * Emit `node`, but whenever a child matches an extraction rule replace it with
 * a component reference and queue that subtree as its own file.
 */
const depStack = [];

function emitSplit(node, scope, indent) {
  const pad = '  '.repeat(indent);

  /*
   * A replaced node never reaches the emitter: the hand-written component
   * takes the whole subtree, and only its import is recorded.
   */
  if (!emitted.has(node) && DROPPED_NODES.some((match) => match(node))) {
    emitted.add(node);
    return '';
  }

  if (!emitted.has(node)) {
    const swap = REPLACEMENTS.find(([match]) => match(node));
    if (swap) {
      emitted.add(node);
      const [, from, component] = swap;
      injected.add({ component, from });
      return `${pad}<${component} v={v} />`;
    }
  }

  const rule = emitted.has(node) ? null : extractionFor(node);

  /* an output that lives in another phase — drop the whole subtree */
  if (rule?.dropped) {
    emitted.add(node);
    return '';
  }

  if (rule) {
    emitted.add(node);
    const { path } = rule;
    const name = componentName(path);
    const params = [...scope];
    const prevPack = packFolder;
    if (node.type === 'el' && node.name === 'sc-if') {
      const key = stripBraces(attr(node, 'value')).trim();
      if (PACKS[key]) packFolder = PACKS[key];
    }
    const prevRenumber = renumber;
    if (rule.from && rule.number !== rule.from) renumber = { from: rule.from, to: rule.number };
    if (rule.number) {
      /* the full report captures cards by this id and captions them by it */
      pendingCardStamp = { id: `${packFolder}-${rule.number}`, title: rule.title };
    }
    depStack.push(new Set());
    injectedStack.push(new Set());
    const body = emitSplit(node, scope, 2);
    const slots = [...injectedStack.pop()];
    const deps = depStack.pop();
    renumber = prevRenumber;
    packFolder = prevPack;
    files.push({ path, name, params, body, deps: [...deps], slots });
    if (depStack.length) depStack[depStack.length - 1].add(path);
    const props = ['v={v}', ...params.map((p) => `${p}={${p}}`)].join(' ');
    return `${pad}<${name} ${props} />`;
  }
  return emitNode(node, scope, indent, emitSplit);
}

/** import specifier from one generated file to another */
function relativeImport(fromPath, toPath) {
  const from = fromPath.split('/').slice(0, -1);
  const to = toPath.split('/');
  let i = 0;
  while (i < from.length && i < to.length - 1 && from[i] === to[i]) i++;
  const up = from.length - i;
  const down = to.slice(i).join('/');
  return (up === 0 ? './' : '../'.repeat(up)) + down;
}

/*
 * A component whose whole body is one `{cond ? … : null}` expression cannot be
 * returned as JSX — unwrap it to `return cond ? … : null;`.
 */
function unwrapExpression(body) {
  const lines = body.trimEnd().split('\n');
  const first = lines[0];
  const last = lines[lines.length - 1];
  if (!/^\s*\{\S/.test(first) || !/^\s*\) : null\}$/.test(last)) return body;
  lines[0] = first.replace('{', '');
  lines[lines.length - 1] = last.replace(/\}$/, '');
  return lines.join('\n');
}

function writeComponent({ path, name, params, body, deps, slots = [] }) {
  body = unwrapExpression(body);
  const imports = [`import { Fragment } from 'react';`];
  const usesFragment = /<Fragment/.test(body);
  if (!usesFragment) imports.length = 0;
  for (const dep of deps) {
    imports.push(`import { ${componentName(dep)} } from '${relativeImport(path, dep)}';`);
  }
  for (const slot of slots) imports.push(`import { ${slot.component} } from '${slot.from}';`);
  const props = ['v: any', ...params.map((p) => `${p}: any`)].join('; ');
  const args = ['v', ...params].join(', ');
  const file = join(outDir, `${path}.tsx`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(
    file,
    [
      `'use client';`,
      '',
      `/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */`,
      ...imports,
      '',
      `export function ${name}({ ${args} }: { ${props} }) {`,
      `  return (`,
      body,
      `  );`,
      `}`,
      '',
    ].join('\n'),
    'utf8',
  );
}

/* ------------------------------------------------------------------- main */

const [srcPath, outDir] = process.argv.slice(2);
if (!srcPath || !outDir) {
  console.error('usage: node scripts/dc-to-jsx.mjs <Sprint Console.dc.html> <out-dir>');
  process.exit(1);
}

const file = readFileSync(srcPath, 'utf8');
const bodyStart = file.indexOf('</helmet>') + '</helmet>'.length;
const bodyEnd = file.indexOf('</x-dc>');
const template = file.slice(bodyStart, bodyEnd);

const tree = parse(template);
const appRoot = tree.children.find((c) => c.type === 'el');

/*
 * Wipe the output tree first. Every file under it is generated, and a card the
 * source has renumbered or removed would otherwise survive as an orphan that
 * nothing imports - which is how the previous run left two dead phase-1 cards
 * and six dead phase-4 ones behind. Regeneration has to be able to shrink.
 */
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

depStack.push(new Set());
injectedStack.push(new Set());
const rootBody = emitSplit(appRoot, new Set(), 2);
const rootSlots = [...injectedStack.pop()];
const rootDeps = [...depStack.pop()];

/*
 * The root takes slots like any other component. It did not until the toast
 * moved to a hand-written replacement, which sits at the top of the tree: the
 * frame was never pushed, so its import was silently dropped and the build
 * failed on an undefined `Toast`.
 */
writeComponent({
  path: 'ConsoleShell',
  name: 'ConsoleShell',
  params: [],
  body: rootBody,
  deps: rootDeps,
  slots: rootSlots,
});
files.forEach(writeComponent);

const hoverCss = [...hoverRules.entries()]
  .map(([decls, cls]) => `.${cls}:hover{${decls}}`)
  .join('\n');
writeFileSync(
  join(outDir, 'hover.css'),
  `/* Ported \`style-hover\` attributes from the Sprint Console template. */\n${hoverCss}\n`,
  'utf8',
);

console.log(`${files.length + 1} components, ${hoverRules.size} hover rules`);
for (const f of files.sort((a, b) => a.path.localeCompare(b.path))) {
  console.log(`  ${f.path}.tsx  (${f.body.split('\n').length} lines)`);
}
