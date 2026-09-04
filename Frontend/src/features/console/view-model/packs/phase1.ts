// @ts-nocheck
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

/**
 * Phase 1 — the leadership validation pack: north star, benchmark quadrant,
 * scorecard, value tree, value pools, priority matrix, leadership heatmap and
 * the hypothesis disposition bank.
 */
export function buildPhase1Pack(ctx: PackContext) {
  const { p, accent, pk, pickOn, picks } = ctx;
    const W = p.visual1;
    let vis1 = null;
    if (W) {
      const n1 = (v, d) => (typeof v === 'number' && isFinite(v) ? v : d);
      const cl1 = (n) => Math.max(6, Math.min(94, n));
      const short = (s) => { const t = String(s || '').replace(/\s*\([^)]*\)\s*/g, ' ').trim(); return t.length > 20 ? t.slice(0, 19) + '…' : t; };
      const nn = (arr, empty) => ((arr && arr.length) ? 'Could not be reached, even by benchmark: ' + arr.join(', ') : empty);
      const LEVEL = { low: 1, medium: 2, high: 3, critical: 4 };

      const north = (W.northStar || []).slice(0, 6).map((x) => ({
        metric: x.metric, arrow: String(x.direction).toLowerCase() === 'down' ? '↓' : '↑',
        dirFg: String(x.direction).toLowerCase() === 'down' ? 'var(--ok)' : accent,
        current: x.current == null || x.current === '' ? 'Not available' : String(x.current),
        target: x.target == null || x.target === '' ? 'Not available' : String(x.target),
        gap: x.gap == null || x.gap === '' ? 'Not available' : String(x.gap),
        note: x.note || ''
      }));

      const B1 = W.benchmark || {};
      const x0 = n1(B1.xMin, 0), x1 = n1(B1.xMax, 100), y0 = n1(B1.yMin, 0), y1 = n1(B1.yMax, 100);
      const num1 = (v) => typeof v === 'number' && isFinite(v) && v !== 0;
      const unplotB = [];
      const bpRaw = (B1.points || []).filter((q) => { const ok = num1(q.x) || num1(q.y); if (!ok && q.name) unplotB.push(String(q.name)); return ok; });
      const bpts = bpRaw.map((q, i) => {
        const k = 'q' + i, sel = pk === k;
        return {
          name: short(q.name), l: cl1((q.x - x0) / ((x1 - x0) || 1) * 100) + '%', t: cl1(100 - (q.y - y0) / ((y1 - y0) || 1) * 100) + '%',
          d: sel ? (q.self ? '25px' : '18px') : (q.self ? '18px' : (q.leader ? '14px' : '11px')),
          c: q.self ? accent : (q.leader ? 'var(--warn)' : 'var(--card)'),
          bd: q.self ? accent : 'var(--bad)', w: (q.self || sel) ? '700' : '500',
          z: sel ? 9 : (q.self ? 4 : 2), dl: (i * 70) + 'ms', on: pickOn(k),
          sh: sel ? '0 0 0 6px rgba(210,107,81,.2),0 10px 20px -8px var(--sh95)' : (q.self ? '0 0 0 3px rgba(210,107,81,.14)' : 'none'),
          nb: sel ? accent : 'var(--bg)', nf: sel ? '#FFFFFF' : 'var(--fg)'
        };
      });
      const bpSel = bpRaw[bpRaw.findIndex((q, i) => pk === 'q' + i)] || null;
      if (bpSel) picks.bench1 = { show: true, line: String(short(bpSel.name)).toUpperCase() + '  \u00b7  ' + String(B1.xLabel || 'X').toUpperCase() + ' ' + bpSel.x + '  \u00b7  ' + String(B1.yLabel || 'Y').toUpperCase() + ' ' + bpSel.y };
      const stagger1 = (arr) => { const seen = {}; arr.forEach((p) => { const k = p.l + '|' + p.t; seen[k] = (seen[k] || 0) + 1; p.mt = ((seen[k] - 1) * 15) + 'px'; }); return arr; };
      stagger1(bpts);

      const SC = W.scorecard || {};
      const scComps = (SC.competitors || []).slice(0, 5).map((c) => short(c));
      const bar = (v, lead) => {
        const has = typeof v === 'number' && isFinite(v) && v > 0;
        const n = has ? Math.max(0, Math.min(100, Math.round(v))) : 0;
        return { w: n + '%', v: has ? String(n) : 'n/a', has: has, noData: !has, c: lead ? accent : 'var(--ok)', bg: lead ? 'rgba(210,107,81,.13)' : 'rgba(109,116,111,.10)' };
      };
      const scRowsAll = (SC.rows || []).slice(0, 8).map((r) => ({
        metric: r.metric,
        cells: [bar(r.client, true)].concat(scComps.map((_, i) => bar((r.scores || [])[i], false)))
      }));
      const scRows = scRowsAll.filter((r) => r.cells.some((c) => c.has));

      const VT = W.valueTree || {};
      const branchC = ['#D26B51', 'var(--ok)', 'var(--warn)'];
      const branches = (VT.branches || []).slice(0, 3).map((b, i) => ({
        name: b.name, c: branchC[i % 3],
        drivers: (b.drivers || []).slice(0, 6).map((d) => ({ name: d.name, note: d.note || '' }))
      }));

      const VP = W.valuePools || {};
      const vpItems = (VP.items || []).filter((x) => typeof x.value === 'number').sort((a, b) => b.value - a.value).slice(0, 6);
      const vpMax = Math.max.apply(null, vpItems.map((x) => x.value).concat([1]));
      const vpTotal = vpItems.reduce((n, x) => n + x.value, 0);
      const pools = vpItems.map((x, i) => ({
        name: x.name, val: (VP.unit || '') + ' ' + x.value, basis: x.basis || '',
        w: Math.round((x.value / vpMax) * 100) + '%',
        c: i === 0 ? accent : (i === 1 ? 'var(--ok)' : 'var(--warn)'),
        bub: Math.round(30 + (x.value / vpMax) * 58) + 'px'
      }));

      const PM = W.priorityMatrix || {};
      const unplotPm = [];
      const pmItems = (PM.items || []).filter((x) => { const ok = num1(x.importance) || num1(x.gap); if (!ok && x.name) unplotPm.push(String(x.name)); return ok; }).slice(0, 8).map((x) => {
        const hi = x.importance >= 50, hg = x.gap >= 50;
        return {
          name: short(x.name), l: cl1(x.importance) + '%', t: cl1(100 - x.gap) + '%',
          c: hi && hg ? '#D26B51' : (hi ? 'var(--warn)' : (hg ? 'var(--ok)' : 'var(--card2)')),
          zone: hi && hg ? 'DEEP DIVE' : (hi ? 'MONITOR' : (hg ? 'SELECTIVE REVIEW' : 'LOW PRIORITY'))
        };
      });
      stagger1(pmItems);

      const SBG = { confirmed: 'var(--warn)', rejected: 'var(--card2)', 'to validate': 'var(--ok)' };
      const hyps = (W.hypotheses || []).slice(0, 8).map((h) => ({
        id: h.id, title: h.title, statement: h.statement, signal: h.signal || 'Not available',
        validate: h.validate || 'Not available', owner: h.owner || 'Not available',
        status: String(h.status || 'To validate').toUpperCase(),
        c: SBG[String(h.status || 'to validate').toLowerCase()] || 'var(--ok)'
      }));
      const hCount = ['Confirmed', 'Rejected', 'To validate'].map((s) => ({
        k: s.toUpperCase(), v: (W.hypotheses || []).filter((h) => String(h.status || '').toLowerCase() === s.toLowerCase()).length
      }));

      const LD = W.leadership || {};
      const steps = (lvl, c) => [1, 2, 3, 4].map((i) => ({ c: i <= (LEVEL[String(lvl).toLowerCase()] || 0) ? c : 'transparent' }));
      const leads = (LD.dimensions || []).slice(0, 7).map((d) => {
        const a = LEVEL[String(d.leadership).toLowerCase()] || 0, b = LEVEL[String(d.evidence).toLowerCase()] || 0;
        const both = a > 0 && b > 0;
        return {
          name: d.name,
          says: a ? String(d.leadership) : 'Not captured', shows: b ? String(d.evidence) : 'Not captured',
          hasSays: a > 0, noSays: a === 0, hasShows: b > 0, noShows: b === 0,
          saysSteps: steps(d.leadership, accent), showsSteps: steps(d.evidence, 'var(--warn)'),
          flag: both ? (a !== b ? 'MISALIGNED' : 'ALIGNED') : 'NOT CAPTURED',
          flagC: both && a !== b ? '#D26B51' : 'var(--fg3)'
        };
      });

      vis1 = {
        northCols: 'repeat(' + Math.max(1, north.length) + ',minmax(0,1fr))', hypCols: 'repeat(' + Math.max(1, (W.hypotheses || []).slice(0, 8).length) + ',minmax(0,1fr))',
        north: north, northNone: north.length ? '' : 'No enterprise outcomes could be established or benchmarked.',
        bench: { xLabel: (B1.xLabel || 'REVENUE GROWTH →').toUpperCase(), yLabel: (B1.yLabel || 'EBITDA MARGIN →').toUpperCase(), pts: bpts, none: nn((B1.unavailable || []).concat(unplotB), bpts.length ? '' : 'No comparable data could be sourced or benchmarked.') },
        score: { comps: scComps.map((c) => ({ n: c })), rows: scRows, has: scRows.length > 0, empty: scRows.length === 0, cols: 'minmax(110px,1.1fr) repeat(' + (scComps.length + 1) + ',minmax(0,1fr))', none: nn(SC.unavailable, scRows.length ? '' : 'No comparable scorecard data could be sourced or benchmarked.') },
        tree: { branches: branches, none: nn(VT.unavailable, branches.length ? '' : 'The value tree could not be built from the material held.') },
        pools: { items: pools, has: pools.length > 0, empty: pools.length === 0, total: pools.length ? (VP.unit || '') + ' ' + Math.round(vpTotal) : 'NOT AVAILABLE', none: nn(VP.unavailable, pools.length ? '' : 'No value pools could be sized, even against sector benchmarks.') },
        matrix: { items: pmItems, none: nn((PM.unavailable || []).concat(unplotPm), pmItems.length ? '' : 'Functions could not be scored against the material held.') },
        hyps: hyps, hCount: hCount, hypsNone: hyps.length ? '' : 'No hypotheses could be formed from the material held.',
        lead: { rows: leads, none: nn(LD.unavailable, leads.length ? '' : 'Leadership priorities have not been captured yet.') }
      };
    }
  return vis1;
}
