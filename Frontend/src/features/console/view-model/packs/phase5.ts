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
 * Phase 5 — the business case pack: value at stake, business case per
 * initiative, current-vs-future bridge, investment split, implementation
 * scope, portfolio, sequence and the KPI framework.
 */
export function buildPhase5Pack(ctx: PackContext) {
  const { p } = ctx;
    const W5 = p.visual5;
    let vis5 = null;
    if (W5) {
      const f5 = (v) => { const m = String(v == null ? '' : v).replace(/[^0-9.\-]/g, ''); const x = parseFloat(m); return isFinite(x) ? Math.abs(x) : 0; };
      const T5 = W5.totals || {};
      const totals = [
        { k: 'VALUE AT STAKE', v: T5.valueAtStake || 'Not available' },
        { k: 'INVESTMENT', v: T5.investment || 'Not available' },
        { k: 'BLENDED PAYBACK', v: T5.payback || 'Not available' },
        { k: 'HURDLE', v: T5.hurdle || 'Not available' }
      ];
      const rawCases = (W5.cases || []).slice(0, 8);
      const vMax5 = Math.max.apply(null, rawCases.map((c) => f5(c.annualValue)).concat([1]));
      const conf5 = { high: ['#D26B51', 'rgba(210,107,81,.14)'], medium: ['var(--fg2)', 'var(--card3)'], low: ['var(--fg3)', 'var(--card3)'] };
      const cases = rawCases.map((c, i) => {
        const key = String(c.confidence || '').toLowerCase();
        const pair = conf5[key] || conf5.medium;
        return {
          n: String(i + 1).padStart(2, '0'),
          name: c.initiative || '-', investment: c.investment || '~', value: c.annualValue || '~',
          payback: c.payback || '~', basis: c.basis || '',
          w: Math.max(4, Math.round((f5(c.annualValue) / vMax5) * 100)) + '%',
          conf: String(c.confidence || 'Medium').toUpperCase(), confFg: pair[0], confBg: pair[1]
        };
      });
      const P5 = W5.portfolio || {};
      const port = [
        ['NOW', 'Fund and mobilise', P5.now, '#D26B51'],
        ['NEXT', 'Unlock dependencies', P5.next, '#E2A08C'],
        ['LATER', 'Hold in portfolio', P5.later, 'var(--fg3)'],
        ['DO NOT BUILD', 'Case does not clear', P5.decline, 'var(--fg4)']
      ].map((c) => ({
        k: c[0], sub: c[1], c: c[3],
        count: String(((c[2] || []).length)).padStart(2, '0'),
        items: (c[2] || []).slice(0, 6).map((x) => ({ t: String(x) }))
      }));
      const seq = (W5.sequence || []).slice(0, 6).map((s, i) => ({
        n: String(i + 1).padStart(2, '0'), period: s.period || '-', milestone: s.milestone || '-',
        dep: s.dependency ? 'Needs: ' + s.dependency : 'No blocking dependency'
      }));
      const kpis5 = (W5.kpis || []).slice(0, 7).map((k) => ({
        kpi: k.kpi || '-', base: k.baseline || '~', target: k.target || '~', owner: k.owner || 'To assign'
      }));
      vis5 = {
        totals: totals, cases: cases, port: port, seq: seq, kpis: kpis5,
        caseNone: cases.length ? '' : 'No initiative could be costed on the material held.',
        kpiNone: kpis5.length ? '' : 'No KPI baseline could be established yet.'
      };
    }

  return vis5;
}
