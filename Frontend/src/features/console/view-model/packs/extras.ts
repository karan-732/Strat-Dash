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
 * Playbook-parity extras derived across the packs in one pass — value chain
 * stage detail, activity classification, hypothesis bank, stakeholder map,
 * management ambition, step-level quantification, human/AI role split, the
 * current-vs-future bridge, the investment split and implementation scope.
 *
 * Keys: chain / cls / hyp / stk / amb / steps / roles / bridge / invest / scope.
 */
export function buildExtras(ctx: PackContext) {
  const { p, accent, pk, pickOn } = ctx;
      const X = {}, A = p.visual || {}, A1 = p.visual1 || {}, A3 = p.visual3 || {}, A4 = p.visual4 || {}, A5 = p.visual5 || {};
      const nn = (v) => (typeof v === 'number' && isFinite(v) ? v : 0);
      const tt = (v) => (v == null || v === '' ? 'Not available' : String(v));
      const lst = (a, n) => (a || []).slice(0, n || 6).map((x) => ({ t: String(x) }));
      const clp = (v) => Math.max(6, Math.min(94, nn(v)));
      const sname = (s) => { const t = String(s || '').replace(/\s*\([^)]*\)\s*/g, ' ').trim(); return t.length > 22 ? t.slice(0, 21) + '\u2026' : t; };

      const ch = (A.valueChain || []).slice(0, 8);
      X.chain = {
        has: ch.some((c) => (c.activities || c.systems || c.kpi || c.impact)),
        rows: ch.map((c, i) => {
          const k = 'vc' + i, sel = pk === k;
          return {
            nn: String(i + 1).padStart(2, '0'), stage: tt(c.stage), note: tt(c.note), kpi: tt(c.kpi), impact: tt(c.impact), people: tt(c.people),
            acts: lst(c.activities, 5), decs: lst(c.decisions, 4), syss: lst(c.systems, 5), datas: lst(c.data, 5),
            sel: sel, on: pickOn(k), bg: sel ? 'var(--card3)' : 'var(--bg)', caret: sel ? '\u2212' : '+', mk: sel ? accent : 'transparent'
          };
        })
      };

      const AC = A.activityClass || {};
      const lanes = [
        { k: 'DIFFERENTIATING', c: '#D26B51', d: 'Superior performance here creates advantage', items: (AC.differentiating || []).slice(0, 6).map((x) => ({ n: tt(x.name), tag: '', note: tt(x.note) })) },
        { k: 'TABLE STAKES', c: 'var(--ok)', d: 'Necessary work - eliminate, automate, agentify or standardise', items: (AC.tableStakes || []).slice(0, 6).map((x) => ({ n: tt(x.name), tag: String(x.treatment || '').toUpperCase(), note: tt(x.note) })) },
        { k: 'VALUE-ADDED SERVICES', c: 'var(--warn)', d: 'Could become new revenue, margin or customer value', items: (AC.services || []).slice(0, 6).map((x) => ({ n: tt(x.name), tag: String(x.revenue || '').toUpperCase(), note: tt(x.note) })) }
      ];
      const tot = lanes.reduce((s, l) => s + l.items.length, 0) || 1;
      X.cls = { has: lanes.some((l) => l.items.length > 0), lanes: lanes.map((l) => ({ k: l.k, c: l.c, d: l.d, items: l.items, count: l.items.length, pct: Math.max(4, Math.round(l.items.length / tot * 100)) + '%', share: l.items.length + ' OF ' + tot + ' ACTIVITIES' })) };

      const hb = (A.hypoBank || []).slice(0, 8);
      X.hyp = {
        has: hb.length > 0,
        rows: hb.map((h, i) => {
          const k = 'hb' + i, sel = pk === k;
          return { id: String(h.id || 'H' + String(i + 1).padStart(2, '0')), hyp: tt(h.hypothesis || h.signal), signal: tt(h.signal), cause: tt(h.cause), metric: tt(h.metric), fn: String(h.function || 'To assign').toUpperCase(), sel: sel, on: pickOn(k), bg: sel ? 'var(--card3)' : 'var(--bg)', caret: sel ? '\u2212' : '+' };
        })
      };

      const DG = A.diagnostic || {}, sRaw = (DG.stakeholders || []).slice(0, 10);
      const spts = sRaw.map((s, i) => {
        const k = 'sm' + i, sel = pk === k;
        return { name: sname(s.name || s.role), l: clp(s.influence) + '%', t: (100 - clp(s.knowledge)) + '%', sel: sel, on: pickOn(k), dl: (i * 60) + 'ms', d: sel ? '18px' : '12px', z: sel ? 9 : 3, sh: sel ? '0 0 0 6px rgba(210,107,81,.2)' : 'none', c: sel ? accent : 'var(--card2)', nb: sel ? accent : 'var(--bg)', nf: sel ? '#FFFFFF' : 'var(--fg)' };
      });
      const sSel = sRaw[spts.findIndex((s) => s.sel)] || null;
      const dr = (DG.dataRequests || []).slice(0, 12).map((d) => {
        const pr = String(d.priority || 'Medium'), hi = /high/i.test(pr), lo = /low/i.test(pr);
        return { item: tt(d.item), owner: String(d.owner || 'To assign').toUpperCase(), fmt: String(d.format || '').toUpperCase(), pri: pr.toUpperCase(), priFg: hi ? '#D26B51' : (lo ? 'var(--fg3)' : 'var(--warn)'), w: hi ? '100%' : (lo ? '34%' : '67%') };
      });
      X.stk = { has: spts.length > 0 || dr.length > 0, pts: spts, hasPts: spts.length > 0, reqs: dr, hasReqs: dr.length > 0, reqHead: dr.length + ' DATA REQUESTS', pickShow: !!sSel, pickLine: sSel ? String(sSel.name || sSel.role).toUpperCase() + '  \u00b7  ' + tt(sSel.role).toUpperCase() + '  \u00b7  INFLUENCE ' + nn(sSel.influence) + '/100  \u00b7  KNOWLEDGE OF THE WORK ' + nn(sSel.knowledge) + '/100' : '' };

      const AM = A1.ambition || {}, tg = (AM.targets || []).slice(0, 6).map((x) => ({ k: tt(x.k), from: tt(x.from), to: tt(x.to) }));
      X.amb = {
        has: !!(AM.horizon || tg.length || (AM.priorities || []).length), horizon: tt(AM.horizon), targets: tg, hasTargets: tg.length > 0,
        cols: [
          { k: 'GROWTH PRIORITIES', c: '#D26B51', items: lst(AM.priorities, 5) },
          { k: 'CONSTRAINTS NAMED', c: 'var(--ok)', items: lst(AM.constraints, 5) },
          { k: 'PRIOR FAILURES', c: 'var(--bad)', items: lst(AM.pastFailures, 4) },
          { k: 'SENSITIVE AREAS', c: 'var(--warn)', items: lst(AM.sensitivities, 4) }
        ]
      };

      const st = ((A3.twin || {}).steps || []).slice(0, 8);
      const mxV = Math.max.apply(null, st.map((s) => nn(s.volume)).concat([1]));
      X.steps = {
        has: st.some((s) => nn(s.volume) || nn(s.reworkPct) || nn(s.exceptionPct) || s.impact),
        rows: st.map((s, i) => ({
          nn: String(i + 1).padStart(2, '0'), name: tt(s.name), owner: String(s.owner || '').toUpperCase(), sys: String(s.system || '').toUpperCase(), data: tt(s.data), impact: tt(s.impact),
          vol: nn(s.volume) ? String(nn(s.volume)) + '/MO' : 'n/a', volW: Math.max(3, Math.round(nn(s.volume) / mxV * 100)) + '%',
          rw: Math.round(nn(s.reworkPct)) + '%', rwW: Math.max(2, Math.min(100, Math.round(nn(s.reworkPct)))) + '%',
          ex: Math.round(nn(s.exceptionPct)) + '%', exW: Math.max(2, Math.min(100, Math.round(nn(s.exceptionPct)))) + '%'
        }))
      };

      const RL = A4.roles || {};
      const aiR = (RL.ai || []).slice(0, 8).map((x) => ({ verb: String(x.verb || '').toUpperCase(), what: tt(x.what) }));
      const huR = (RL.human || []).slice(0, 8).map((x) => ({ verb: String(x.verb || '').toUpperCase(), what: tt(x.what) }));
      const totR = (aiR.length + huR.length) || 1;
      X.roles = { has: aiR.length > 0 || huR.length > 0, ai: aiR, human: huR, aiPct: Math.round(aiR.length / totR * 100) + '%', huPct: Math.round(huR.length / totR * 100) + '%', split: aiR.length + ' AI RESPONSIBILITIES \u00b7 ' + huR.length + ' HUMAN RESPONSIBILITIES' };

      const BR = A5.bridge || {}, bi = (BR.items || []).slice(0, 7).filter((x) => nn(x.current) || nn(x.future));
      const bmx = Math.max.apply(null, bi.map((x) => Math.max(nn(x.current), nn(x.future))).concat([1]));
      X.bridge = {
        has: bi.length > 0, unit: String(BR.unit || '').toUpperCase(),
        rows: bi.map((x) => {
          const d = Math.round((nn(x.current) - nn(x.future)) * 10) / 10;
          return { k: tt(x.k), cur: String(nn(x.current)), fut: String(nn(x.future)), curW: Math.max(3, Math.round(nn(x.current) / bmx * 100)) + '%', futW: Math.max(3, Math.round(nn(x.future) / bmx * 100)) + '%', delta: (d > 0 ? '\u2212' : '+') + Math.abs(d), dFg: d > 0 ? 'var(--ok)' : 'var(--bad)' };
        })
      };
      const IV = A5.investment || {}, iv = (IV.items || []).slice(0, 7).filter((x) => nn(x.v));
      const isum = iv.reduce((s, x) => s + nn(x.v), 0) || 1;
      X.invest = { has: iv.length > 0, unit: String(IV.unit || '').toUpperCase(), total: String(Math.round(isum * 10) / 10), items: iv.map((x, i) => ({ k: tt(x.k), v: String(nn(x.v)), pct: Math.max(3, Math.round(nn(x.v) / isum * 100)) + '%', c: i % 2 ? 'var(--card4)' : accent })) };
      X.scope = {
        has: (A5.scope || []).length > 0,
        rows: (A5.scope || []).slice(0, 5).map((s, i) => {
          const k = 'sc' + i, sel = pk === k;
          return { init: tt(s.initiative), obj: tt(s.objective), users: tt(s.users), timeline: String(s.timeline || '').toUpperCase(), team: tt(s.team), comm: tt(s.commercial), reqs: lst(s.requirements, 5), airs: lst(s.aiRequirements, 5), datas: lst(s.data, 5), kpis: lst(s.kpis, 4), sel: sel, on: pickOn(k), bg: sel ? 'var(--card3)' : 'var(--bg)', caret: sel ? '\u2212' : '+' };
        })
      };
      const QQ = (A.quadrants || []).slice(0, 6);
      const qd = QQ.map((q, qi) => {
        const rawP = (q.points || []).filter((z) => z && (typeof z.x === 'number' || typeof z.y === 'number'));
        const xv = rawP.map((z) => nn(z.x)), yv = rawP.map((z) => nn(z.y));
        const pad = (lo, hi) => { const s = (hi - lo) || Math.abs(hi) || 1; return [lo - s * 0.12, hi + s * 0.12]; };
        let x0 = nn(q.xMin), x1 = nn(q.xMax), y0 = nn(q.yMin), y1 = nn(q.yMax);
        if (!(x1 > x0) && xv.length) { const r = pad(Math.min.apply(null, xv), Math.max.apply(null, xv)); x0 = r[0]; x1 = r[1]; }
        if (!(y1 > y0) && yv.length) { const r = pad(Math.min.apply(null, yv), Math.max.apply(null, yv)); y0 = r[0]; y1 = r[1]; }
        const co = (q.corners || []).map((c) => String(c || '').toUpperCase());
        const num = (v) => { const n = nn(v); return Math.abs(n) >= 1000 ? String(Math.round(n)) : String(Math.round(n * 10) / 10); };
        const anySel = rawP.some((z, i) => pk === ('qd' + qi + '_' + i));
        const pts = rawP.map((z, i) => {
          const k = 'qd' + qi + '_' + i, sel = pk === k;
          return {
            sel: sel, name: sname(z.name), l: clp((nn(z.x) - x0) / ((x1 - x0) || 1) * 100) + '%', t: (100 - clp((nn(z.y) - y0) / ((y1 - y0) || 1) * 100)) + '%',
            d: sel ? (z.self ? '22px' : '16px') : (z.self ? '15px' : '10px'),
            c: z.self ? accent : (sel ? accent : 'var(--card2)'),
            ring: (z.self || sel) ? '#D26B51' : 'var(--ln38)',
            w: (z.self || sel) ? '700' : '500',
            op: anySel ? (sel || z.self ? '1' : '.42') : '1',
            z: sel ? 9 : (z.self ? 4 : 2), dl: (i * 60) + 'ms', on: pickOn(k),
            sh: sel ? '0 0 0 7px rgba(210,107,81,.18),0 10px 20px -8px var(--sh95)' : (z.self ? '0 0 0 4px rgba(210,107,81,.12)' : '0 1px 2px var(--sh50)'),
            nb: sel ? accent : 'var(--card)', nf: sel ? '#FFFFFF' : 'var(--fg)',
            nbd: sel ? accent : 'var(--ln12)'
          };
        });
        const selI = pts.findIndex((z) => z.sel), s = selI >= 0 ? rawP[selI] : null;
        return {
          title: String(q.title || (tt(q.yMetric) + ' vs ' + tt(q.xMetric))).toUpperCase(),
          why: tt(q.why), pts: pts,
          xLab: String(tt(q.xMetric)).toUpperCase() + (q.xUnit ? ' (' + q.xUnit + ')' : '') + ' \u2192',
          yLab: String(tt(q.yMetric)).toUpperCase() + (q.yUnit ? ' (' + q.yUnit + ')' : '') + ' \u2192',
          n: 'Q' + (qi + 1),
          x0: num(x0), x1: num(x1), y0: num(y0), y1: num(y1),
          xm: num((x0 + x1) / 2), ym: num((y0 + y1) / 2),
          crossShow: !!s, crossL: s ? pts[selI].l : '50%', crossT: s ? pts[selI].t : '50%',
          tl: co[0] || '', tr: co[1] || '', bl: co[2] || '', br: co[3] || '',
          pickShow: !!s,
          pickLine: s ? String(sname(s.name)).toUpperCase() + '  \u00b7  ' + String(tt(q.xMetric)).toUpperCase() + ' ' + num(s.x) + (q.xUnit ? ' ' + q.xUnit : '') + '  \u00b7  ' + String(tt(q.yMetric)).toUpperCase() + ' ' + num(s.y) + (q.yUnit ? ' ' + q.yUnit : '') : '',
          pickNote: s && s.note ? String(s.note) : '',
          none: (q.unavailable || []).length ? 'Could not be reached, even by benchmark: ' + (q.unavailable || []).join(', ') : ''
        };
      }).filter((q) => q.pts.length > 0);
      X.quads = { has: qd.length > 0, items: qd, head: qd.length + ' METRIC PAIRS \u00b7 SAME PEER SET \u00b7 TAP A POINT FOR ITS VALUES' };

      return X;
}
