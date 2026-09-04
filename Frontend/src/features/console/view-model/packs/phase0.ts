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
 * Phase 0 — the outside-in pack: snapshot, SWOT, benchmark quadrant,
 * positioning map, peer ranking, capability heatmap, value tree and chain,
 * activity classification, hypothesis bank, stakeholder map and BCG matrix.
 */
export function buildPhase0Pack(ctx: PackContext) {
  const { p, accent, pk, pickOn, picks } = ctx;
    const V = p.visual;
    let vis = null;
    if (V) {
      const nm = (v, d) => (typeof v === 'number' && isFinite(v) ? v : d);
      const shortName = (s) => { const t = String(s || '').replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+(Limited|Ltd\.?|Inc\.?|Pvt\.?|Private|Corporation|Company)\b/gi, '').trim(); return t.length > 22 ? t.slice(0, 21) + '…' : t; };
      const cl = (n) => Math.max(5, Math.min(95, n));
      const txt = (x) => (x == null || x === '' ? 'Not available' : String(x));
      const dim = (x) => /not available|unknown|n\/a/i.test(txt(x));
      const sn = V.snapshot || {};
      const snapshot = [['REVENUE', 'revenue'], ['GROWTH', 'growth'], ['EMPLOYEES', 'employees'], ['LOCATIONS', 'locations'], ['MARKET SHARE', 'marketShare'], ['PROFITABILITY', 'profitability']]
        .map((r) => { const v = txt(sn[r[1]]); return { k: r[0], v: v, fg: dim(sn[r[1]]) ? 'var(--fg4)' : (/^~/.test(v) ? 'var(--bad)' : 'var(--fg)'), fs: v.length > 40 ? '11px' : (v.length > 18 ? '13px' : '16px') }; });
      const sw = V.swot || {};
      const swot = [['STRENGTHS', 'strengths', 'var(--warn)'], ['WEAKNESSES', 'weaknesses', 'var(--ok)'], ['OPPORTUNITIES', 'opportunities', '#D26B51'], ['THREATS', 'threats', 'var(--bad)']]
        .map((r) => ({ t: r[0], c: r[2], items: (sw[r[1]] || []).slice(0, 6).map((x) => ({ t: String(x) })) }));
      const B = V.benchmark || {};
      const bx0 = nm(B.xMin, 0), bx1 = nm(B.xMax, 100), by0 = nm(B.yMin, 0), by1 = nm(B.yMax, 100);
      const num = (v) => typeof v === 'number' && isFinite(v) && v !== 0;
      const unplot0 = [];
      const bRaw = (B.points || []).filter((q) => { const ok = num(q.x) || num(q.y); if (!ok && q.name) unplot0.push(String(q.name)); return ok; });
      const bPts = bRaw.map((q, i) => {
        const k = 'b' + i, sel = pk === k;
        return {
          name: shortName(q.name), l: cl((q.x - bx0) / ((bx1 - bx0) || 1) * 100) + '%', t: cl(100 - (q.y - by0) / ((by1 - by0) || 1) * 100) + '%',
          d: sel ? (q.self ? '24px' : '18px') : (q.self ? '17px' : '11px'), c: q.self ? accent : 'var(--card2)', w: (q.self || sel) ? '700' : '500',
          z: sel ? 9 : (q.self ? 4 : 2), dl: (i * 70) + 'ms', on: pickOn(k),
          sh: sel ? '0 0 0 6px rgba(210,107,81,.2),0 10px 20px -8px var(--sh95)' : (q.self ? '0 0 0 3px rgba(210,107,81,.14)' : 'none'),
          nb: sel ? accent : 'var(--bg)', nf: sel ? '#FFFFFF' : 'var(--fg)'
        };
      });
      const bSel = bRaw[bRaw.findIndex((q, i) => pk === 'b' + i)] || null;
      if (bSel) picks.bench0 = { show: true, line: String(shortName(bSel.name)).toUpperCase() + '  \u00b7  ' + String(B.xLabel || 'X').toUpperCase() + ' ' + bSel.x + '  \u00b7  ' + String(B.yLabel || 'Y').toUpperCase() + ' ' + bSel.y };
      const stagger = (arr) => { const seen = {}; arr.forEach((p) => { const k = p.l + '|' + p.t; seen[k] = (seen[k] || 0) + 1; p.mt = ((seen[k] - 1) * 15) + 'px'; }); return arr; };
      stagger(bPts);
      const P = V.positioning || {};
      const unplotPos = [];
      const pRaw = (P.points || []).filter((q) => { const ok = num(q.innovation) || num(q.price); if (!ok && q.name) unplotPos.push(String(q.name)); return ok; });
      const pPts = pRaw.map((q, i) => {
        const k = 'p' + i, sel = pk === k;
        return {
          name: shortName(q.name), l: cl(q.price) + '%', t: cl(100 - q.innovation) + '%',
          d: sel ? (q.self ? '21px' : '16px') : (q.self ? '15px' : '10px'), c: q.self ? accent : 'var(--card2)', w: (q.self || sel) ? '700' : '500',
          z: sel ? 9 : (q.self ? 4 : 2), dl: (i * 70) + 'ms', on: pickOn(k),
          sh: sel ? '0 0 0 6px rgba(210,107,81,.2),0 10px 20px -8px var(--sh95)' : (q.self ? '0 0 0 3px rgba(210,107,81,.14)' : 'none'),
          nb: sel ? accent : 'var(--bg)', nf: sel ? '#FFFFFF' : 'var(--fg)'
        };
      });
      stagger(pPts);
      const pSel = pRaw[pRaw.findIndex((q, i) => pk === 'p' + i)] || null;
      if (pSel) picks.pos0 = { show: true, line: String(shortName(pSel.name)).toUpperCase() + '  \u00b7  PRICE POSITION ' + nm(pSel.price, 0) + '/100  \u00b7  INNOVATION ' + nm(pSel.innovation, 0) + '/100' };
      const H = V.capabilityHeatmap || {};
      const hComps = (H.competitors || []).slice(0, 4).map((c) => shortName(c));
      const dots = (n, self) => [0, 1, 2, 3].map((i) => ({ c: i < Math.round(nm(n, 0)) ? (self ? accent : 'var(--fg3)') : 'transparent', b: i < Math.round(nm(n, 0)) ? 'var(--ok)' : 'var(--ln20)' }));
      const hRows = (H.rows || []).filter((r) => num(r.company) || (r.scores || []).some(num)).slice(0, 9).map((r, ri) => {
        const k = 'h' + ri, sel = pk === k;
        const n4 = (v) => Math.round(nm(v, 0)) + '/4';
        return {
          cap: r.capability, sel: sel, on: pickOn(k), bg: sel ? 'var(--card3)' : 'var(--bg)', mk: sel ? accent : 'transparent',
          cells: [{ dots: dots(r.company, true), num: n4(r.company) }].concat(hComps.map((_, i) => ({ dots: dots((r.scores || [])[i], false), num: n4((r.scores || [])[i]) })))
        };
      });
      const vt = V.valueTree || {};
      const tree = [['REVENUE DRIVERS', 'revenue', 'var(--warn)'], ['COST DRIVERS', 'cost', 'var(--ok)'], ['CAPITAL DRIVERS', 'capital', 'var(--bad)']]
        .map((r) => ({ k: r[0], c: r[2], items: (vt[r[1]] || []).slice(0, 8).map((x) => ({ t: String(x) })) }));
      const chain = (V.valueChain || []).slice(0, 8).map((c, i) => ({ n: String(i + 1).padStart(2, '0'), stage: c.stage || '-', note: c.note || '' }));
      const G = V.bcg || {};
      const unplotBcg = [];
      const gi = (G.items || []).filter((x) => { const ok = num(x.growth) || num(x.share); if (!ok && x.name) unplotBcg.push(String(x.name)); return ok; });
      const gmax = Math.max.apply(null, gi.map((x) => x.growth).concat([10])) * 1.15;
      const smax = Math.max.apply(null, gi.map((x) => x.share).concat([10])) * 1.15;
      const wmax = Math.max.apply(null, gi.map((x) => nm(x.weight, 10)).concat([10]));
      const bcgItems = gi.slice(0, 6).map((x, i) => {
        const k = 'g' + i, sel = pk === k;
        return {
          name: x.name, tag: 'ABCDEF'[i], sel: sel, on: pickOn(k), dl: (i * 80) + 'ms',
          l: cl(100 - (x.share / smax) * 100) + '%', t: cl(100 - (x.growth / gmax) * 100) + '%',
          d: Math.round((sel ? 34 : 26) + (nm(x.weight, 10) / wmax) * 34) + 'px',
          c: sel ? accent : (i === 0 ? accent : 'var(--card2)'),
          z: sel ? 9 : 2, sh: sel ? '0 0 0 6px rgba(210,107,81,.2),0 12px 22px -8px var(--sh95)' : 'none',
          lb: sel ? 'var(--card3)' : 'transparent',
          meta: 'GROWTH ' + x.growth + '% \u00b7 SHARE ' + x.share + (x.quadrant ? ' \u00b7 ' + String(x.quadrant).toUpperCase() : '')
        };
      });
      const gSel = gi[gi.findIndex((x, i) => pk === 'g' + i)] || null;
      if (gSel) picks.bcg0 = { show: true, line: String(gSel.name).toUpperCase() + '  \u00b7  MARKET GROWTH ' + gSel.growth + '%  \u00b7  RELATIVE SHARE ' + gSel.share + '  \u00b7  ' + String(gSel.quadrant || '').toUpperCase() + '  \u00b7  ' + nm(gSel.weight, 0) + '% OF REVENUE' };
      const PR = V.peerRank || null;
      let rank = { has: false, rows: [], table: [], verdict: '', note: '', leads: [], lags: [], hasLeads: false, hasLags: false, meta: '', sources: [] };
      if (PR && (PR.rows || []).length) {
        const ov = PR.overall || {};
        const sourceSeen = new Set();
        const sourceLinks = (PR.read || []).map((raw) => {
          const value = String(raw || '').trim();
          if (!value) return null;
          const href = /^https?:\/\//i.test(value) ? value : 'https://' + value;
          try {
            const parsed = new URL(href);
            if (!['http:', 'https:'].includes(parsed.protocol) || sourceSeen.has(href)) return null;
            sourceSeen.add(href);
            return { href, label: parsed.hostname.replace(/^www\./i, '') };
          } catch {
            return null;
          }
        }).filter(Boolean);
        const tSc = (t) => nm(t && t.score, 0);
        const rawT = (ov.table || []).slice(0, 8);
        const tMax = Math.max.apply(null, rawT.map(tSc).concat([1]));
        const ord = ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH', '7TH', '8TH'];
        const table = rawT.slice().sort((a, b) => tSc(b) - tSc(a)).map((t, i) => ({
          name: shortName(t.name), rank: ord[(t.rank ? Math.round(t.rank) - 1 : i)] || (i + 1) + 'TH',
          score: String(Math.round(tSc(t) * 10) / 10),
          pct: Math.max(4, Math.round(tSc(t) / tMax * 100)) + '%',
          bg: t.self ? 'var(--card3)' : 'var(--bg)', mk: t.self ? accent : 'var(--ln22)', mk2: t.self ? accent : 'var(--ok)',
          fg: t.self ? 'var(--fg)' : 'var(--fg2)', fw: t.self ? '700' : '600'
        }));
        const rRows = (PR.rows || []).slice(0, 9).map((r, i) => {
          const k = 'r' + i, sel = pk === k;
          const cs = nm(r.clientScore, 0);
          const all = [{ name: p.name, value: txt(r.clientValue), score: cs, self: true }]
            .concat((r.peers || []).slice(0, 6).map((q) => ({ name: q.name, value: txt(q.value), score: nm(q.score, 0), self: false })));
          const mx = Math.max.apply(null, all.map((x) => x.score).concat([1]));
          const rk = Math.max(1, Math.round(nm(r.clientRank, 1)));
          return {
            name: r.parameter, unit: String(r.unit || 'score').toUpperCase(), weight: nm(r.weight, 0) + '%',
            rankTag: '#' + rk, rankFg: rk === 1 ? accent : (rk <= 2 ? 'var(--warn)' : 'var(--fg2)'),
            clientValue: txt(r.clientValue), pct: Math.max(4, Math.round(cs / mx * 100)) + '%',
            leaderTag: r.leader ? 'LEADER \u00b7 ' + String(shortName(r.leader)).toUpperCase() : '',
            basis: r.basis || '', sel: sel, on: pickOn(k), caret: sel ? '\u2212' : '+',
            bg: sel ? 'var(--card3)' : 'var(--bg)', barC: rk === 1 ? accent : 'var(--card4)',
            bars: all.slice().sort((a, b) => b.score - a.score).map((x) => ({
              name: shortName(x.name), value: x.value, pct: Math.max(3, Math.round(x.score / mx * 100)) + '%',
              c: x.self ? accent : 'var(--card4)', fg: x.self ? 'var(--fg)' : 'var(--fg2)', fw: x.self ? '700' : '500'
            }))
          };
        });
        rank = {
          has: true, rows: rRows, table: table, verdict: ov.verdict || '', note: ov.note || '',
          leads: (ov.leads || []).slice(0, 4).map((x) => ({ t: String(x) })), lags: (ov.lags || []).slice(0, 4).map((x) => ({ t: String(x) })),
          hasLeads: (ov.leads || []).length > 0, hasLags: (ov.lags || []).length > 0,
          meta: (PR.rows || []).length + ' PARAMETERS \u00b7 ' + ((PR.peerSet || []).length) + ' PEERS' + (sourceLinks.length ? ' \u00b7 ' + sourceLinks.length + ' SOURCES' : ''),
          sources: sourceLinks
        };
      }
      const none = (arr, empty) => ((arr && arr.length) ? 'Could not be reached, even by benchmark: ' + arr.join(', ') : empty);
      vis = {
        snapshot: snapshot, swot: swot, tree: tree, chain: chain, chainCols: 'repeat(' + Math.max(1, chain.length) + ',minmax(0,1fr))',
        bench: { xLabel: (B.xLabel || 'REVENUE GROWTH →').toUpperCase(), yLabel: (B.yLabel || 'MARKET SHARE →').toUpperCase(), pts: bPts, none: none((B.unavailable || []).concat(unplot0), bPts.length ? '' : 'No comparable data could be sourced or benchmarked.') },
        pos: { pts: pPts, none: none((P.unavailable || []).concat(unplotPos), pPts.length ? '' : 'No positioning data could be sourced or benchmarked.') },
        heat: { comps: hComps.map((c) => ({ n: c })), rows: hRows, cols: 'minmax(150px,1.4fr) repeat(' + (hComps.length + 1) + ',minmax(0,1fr))', none: none(H.unavailable, hRows.length ? '' : 'Capability positions could not be assessed or benchmarked.') },
        bcg: { items: bcgItems, none: none((G.unavailable || []).concat(unplotBcg), bcgItems.length ? '' : 'No segment-level data could be sourced or benchmarked.') },
        rank: rank
      };
    }
  return vis;
}
