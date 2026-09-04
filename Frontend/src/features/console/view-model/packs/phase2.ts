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
 * Phase 2 — the functional diagnostic pack: functional KPIs, benchmark
 * comparison, functional economics, pain heatmap, opportunity map, value
 * ranking, scoring, priority matrix, leakage and the forensic shortlist.
 */
export function buildPhase2Pack(ctx: PackContext) {
  const { p, accent, pk, pickOn } = ctx;
    const W2 = p.visual2;
    let vis2 = null;
    if (W2) {
      const nz = (v) => (typeof v === 'number' && isFinite(v) ? v : 0);
      const cl2 = (n) => Math.max(6, Math.min(94, n));
      const sh2 = (t) => { const q = String(t || '').replace(/\s*\([^)]*\)\s*/g, ' ').trim(); return q.length > 20 ? q.slice(0, 19) + '…' : q; };
      const none2 = (arr, empty) => ((arr && arr.length) ? 'Could not be reached, even by benchmark: ' + arr.join(', ') : empty);
      const stagger2 = (arr) => { const seen = {}; arr.forEach((q) => { const k = q.l + '|' + q.t; seen[k] = (seen[k] || 0) + 1; q.mt = ((seen[k] - 1) * 15) + 'px'; }); return arr; };
      const txt = (v) => (v == null || v === '' ? 'Not available' : String(v));

      const kpi = (W2.functions || []).slice(0, 6).map((f) => ({
        name: String(f.name || '').toUpperCase(), note: f.note || '',
        metrics: [{ k: 'Annual spend', v: txt(f.spend) }, { k: 'Average cycle time', v: txt(f.cycleTime) }, { k: 'Cost / transaction', v: txt(f.costPerTxn) }, { k: 'Exception rate', v: txt(f.exceptionRate) }]
      }));

      const BM = W2.benchmark || {};
      const bItems = (BM.items || []).slice(0, 6).filter((b) => nz(b.actual) || nz(b.benchmark));
      const bMax = Math.max.apply(null, bItems.map((b) => Math.max(nz(b.actual), nz(b.benchmark))).concat([1]));
      const bench = {
        title: (BM.metric || 'Cycle time') + ' — actual against benchmark' + (BM.unit ? ' (' + BM.unit + ')' : ''),
        items: bItems.map((b, i) => {
          const k = 'f' + i, sel = pk === k;
          const gap = Math.round((nz(b.actual) - nz(b.benchmark)) * 10) / 10;
          return {
            name: b.function, aLabel: String(nz(b.actual)), bLabel: String(nz(b.benchmark)),
            aH: Math.max(4, Math.round(nz(b.actual) / bMax * 100)) + '%', bH: Math.max(4, Math.round(nz(b.benchmark) / bMax * 100)) + '%',
            sel: sel, on: pickOn(k), bg: sel ? 'var(--card3)' : 'transparent', dl: (i * 80) + 'ms',
            gap: (gap > 0 ? '+' : '') + gap + ' VS BENCHMARK', gapFg: gap > 0 ? 'var(--bad)' : 'var(--ok)'
          };
        }),
        none: none2(BM.unavailable, bItems.length ? '' : 'No function could be benchmarked on the material held.')
      };

      const GC = [['SCALE', '#D26B51'], ['EFFICIENCY', 'var(--ok)'], ['QUALITY', 'var(--warn)'], ['BUSINESS IMPACT', 'var(--bad)']];
      const econ = (W2.economics || []).slice(0, 5).map((e) => ({
        name: String(e.function || '').toUpperCase(),
        groups: [e.scale, e.efficiency, e.quality, e.impact].map((rows, i) => ({
          k: GC[i][0], c: GC[i][1], rows: (rows || []).slice(0, 4).map((r) => ({ k: r.k, v: txt(r.v) }))
        }))
      }));

      const HM = W2.painHeatmap || {};
      const LVL = { low: 'var(--ok)', medium: 'var(--warn)', high: 'var(--bad)', critical: 'var(--bad)' };
      const hDims = (HM.dimensions || []).slice(0, 7);
      const hRows = (HM.rows || []).slice(0, 7).map((r) => ({
        name: r.function,
        cells: hDims.map((d, i) => { const lv = String((r.levels || [])[i] || '').toLowerCase(); return { c: LVL[lv] || 'var(--card3)', title: d + ': ' + (lv || 'not captured') }; })
      }));
      const heat = {
        cols: 'minmax(120px,1.2fr) repeat(' + Math.max(1, hDims.length) + ',minmax(0,1fr))',
        dims: hDims.map((d) => ({ n: String(d).toUpperCase() })), rows: hRows,
        legend: [{ k: 'LOW', c: 'var(--ok)' }, { k: 'MEDIUM', c: 'var(--warn)' }, { k: 'HIGH', c: 'var(--bad)' }],
        none: none2(HM.unavailable, hRows.length ? '' : 'No function could be scored for pain on the material held.')
      };

      const OM = W2.opportunityMap || {}, omItems = (OM.items || []).slice(0, 8);
      const omMax = Math.max.apply(null, omItems.map((o) => nz(o.atStake)).concat([1]));
      const map = {
        unit: OM.unit || '', items: stagger2(omItems.map((o) => ({
          name: sh2(o.name), l: cl2(nz(o.pain)) + '%', t: cl2(100 - nz(o.value)) + '%',
          d: Math.round(26 + (nz(o.atStake) / omMax) * 34) + 'px',
          val: nz(o.atStake) ? String(Math.round(nz(o.atStake))) : '',
          c: nz(o.pain) >= 50 && nz(o.value) >= 50 ? accent : (nz(o.value) >= 50 ? 'var(--warn)' : 'var(--card4)')
        }))),
        none: none2(OM.unavailable, omItems.length ? '' : 'No opportunity could be sized against the material held.')
      };

      const VR = W2.valueRanking || {};
      const vrItems = (VR.items || []).filter((x) => typeof x.value === 'number').sort((a, b) => b.value - a.value).slice(0, 6);
      const vrMax = Math.max.apply(null, vrItems.map((x) => x.value).concat([1]));
      const rank = {
        total: vrItems.length ? (VR.unit || '') + ' ' + Math.round(vrItems.reduce((n, x) => n + x.value, 0)) : 'NOT AVAILABLE',
        items: vrItems.map((x, i) => ({
          name: x.name, val: (VR.unit || '') + ' ' + x.value, basis: x.basis || '',
          w: Math.round((x.value / vrMax) * 100) + '%', c: i === 0 ? accent : (i === 1 ? 'var(--ok)' : 'var(--warn)')
        })),
        none: none2(VR.unavailable, vrItems.length ? '' : 'No opportunity could be valued, even against sector benchmarks.')
      };

      const SG = W2.scoring || {}, sDims = (SG.dimensions || []).slice(0, 6);
      const sRows = (SG.items || []).slice(0, 6).map((it) => ({
        name: it.name,
        cells: sDims.map((_, i) => { const v = nz((it.scores || [])[i]); return { v: v ? v + '/10' : 'n/a', w: Math.round(v * 10) + '%', c: v >= 7 ? accent : (v >= 4 ? 'var(--warn)' : 'var(--bad)') }; })
      }));
      const score = {
        cols: 'minmax(150px,1.4fr) repeat(' + Math.max(1, sDims.length) + ',minmax(0,1fr))',
        dims: sDims.map((d) => ({ n: String(d).toUpperCase() })), rows: sRows,
        none: none2(SG.unavailable, sRows.length ? '' : 'No opportunity could be scored on the material held.')
      };

      const PR = W2.priorityMatrix || {};
      const prItems = stagger2((PR.items || []).slice(0, 8).map((x) => ({
        name: sh2(x.name), l: cl2(nz(x.feasibility)) + '%', t: cl2(100 - nz(x.value)) + '%',
        c: nz(x.value) >= 50 && nz(x.feasibility) >= 50 ? '#D26B51' : (nz(x.value) >= 50 ? 'var(--warn)' : (nz(x.feasibility) >= 50 ? 'var(--ok)' : 'var(--card4)'))
      })));
      const prio = { items: prItems, none: none2(PR.unavailable, prItems.length ? '' : 'Opportunities could not be placed on feasibility and value.') };

      const LK = W2.leakage || {}, lkSteps = (LK.steps || []).slice(0, 7).filter((x) => nz(x.value));
      const lkMax = Math.max.apply(null, lkSteps.map((x) => nz(x.value)).concat([1]));
      const leak = {
        baseLabel: (LK.base && LK.base.label) || 'Current functional cost',
        baseVal: LK.base && nz(LK.base.value) ? (LK.unit || '') + ' ' + LK.base.value : 'Not available',
        steps: lkSteps.map((x) => ({ name: x.name, val: (LK.unit || '') + ' ' + x.value, w: Math.round(nz(x.value) / lkMax * 100) + '%' })),
        recLabel: ((LK.recoverable && LK.recoverable.label) || 'Potential value pool').toUpperCase(),
        recVal: LK.recoverable && nz(LK.recoverable.value) ? (LK.unit || '') + ' ' + LK.recoverable.value : (lkSteps.length ? (LK.unit || '') + ' ' + lkSteps.reduce((n, x) => n + nz(x.value), 0) : 'Not available'),
        none: none2(LK.unavailable, lkSteps.length ? '' : 'Leakage could not be quantified on the material held.')
      };

      const LEV2 = { high: 'var(--bad)', medium: 'var(--warn)', low: 'var(--ok)' };
      const top = (W2.topOpportunities || []).slice(0, 5).map((t, i) => ({
        rank: '#' + String(t.rank || i + 1).padStart(2, '0'), name: t.name, pool: txt(t.valuePool),
        note: t.note || '', next: String(t.next || 'Forensic analysis').toUpperCase(),
        rows: [['Process pain', t.pain], ['AI suitability', t.aiSuitability], ['Feasibility', t.feasibility]].map((r) => ({
          k: r[0], v: String(r[1] || 'Not captured').toUpperCase(), c: LEV2[String(r[1] || '').toLowerCase()] || 'var(--fg3)'
        }))
      }));

      vis2 = {
        kpi: kpi, kpiNone: kpi.length ? '' : 'No function economics could be established or benchmarked.',
        bench: bench, econ: econ, econNone: econ.length ? '' : 'Functional economics could not be built from the material held.',
        heat: heat, map: map, rank: rank, score: score, prio: prio, leak: leak,
        top: top, topNone: top.length ? '' : 'No process has been selected for forensic analysis yet.'
      };
    }

  return vis2;
}
