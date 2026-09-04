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
 * Phase 4 — the AI-native redesign pack: current vs future flow, activity
 * transformation, human/AI responsibility, handoff and effort reduction,
 * future KPIs, decision rights, architecture, economics and the scorecard.
 */
export function buildPhase4Pack(ctx: PackContext) {
  const { p, accent } = ctx;
    const W4 = p.visual4;
    let vis4 = null;
    if (W4) {
      const n4 = (v) => (typeof v === 'number' && isFinite(v) ? v : 0);
      const t4 = (v) => (v == null || v === '' ? 'Not available' : String(v));
      const none4 = (arr, empty) => ((arr && arr.length) ? 'Could not be reached, even by benchmark: ' + arr.join(', ') : empty);
      const ACT = (a) => {
        const k = String(a || '').toLowerCase();
        const hasH = k.indexOf('human') >= 0, hasA = k.indexOf('ai') >= 0 || k.indexOf('agent') >= 0;
        if (hasH && hasA) return 'var(--warn)';
        if (hasH) return '#D26B51';
        if (hasA) return accent;
        return 'var(--fg3)';
      };
      const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');

      const PR = W4.process || {};
      const sum4 = (arr, f) => (arr || []).reduce((n, s) => n + n4(s[f]), 0);
      const mkCol = (steps, title, c) => {
        const list = (steps || []).slice(0, 8);
        return {
          title: title, c: c,
          summary: list.length + ' STEPS · ' + sum4(list, 'handoffs') + ' HANDOFFS · ' + sum4(list, 'approvals') + ' APPROVALS',
          steps: list.map((s) => {
            const chips = [];
            if (s.cycleTime) chips.push({ t: String(s.cycleTime) + ' cycle' });
            if (s.effort) chips.push({ t: String(s.effort) + ' effort' });
            if (n4(s.handoffs)) chips.push({ t: plural(n4(s.handoffs), 'handoff') });
            if (n4(s.approvals)) chips.push({ t: plural(n4(s.approvals), 'approval') });
            return { name: s.name, actor: String(s.actor || 'Unassigned').toUpperCase(), c: ACT(s.actor), chips: chips };
          })
        };
      };
      const cur4 = mkCol(PR.currentSteps, 'CURRENT STATE', 'var(--bad)');
      const fut4 = mkCol(PR.futureSteps, 'AI-NATIVE FUTURE STATE', 'var(--ok)');
      const compare = {
        name: String(PR.name || 'Priority process').toUpperCase(),
        cols: [cur4, fut4],
        deltas: [
          { k: 'Activities', v: (PR.currentSteps || []).length + ' → ' + (PR.futureSteps || []).length },
          { k: 'Handoffs', v: sum4(PR.currentSteps, 'handoffs') + ' → ' + sum4(PR.futureSteps, 'handoffs') },
          { k: 'Approvals', v: sum4(PR.currentSteps, 'approvals') + ' → ' + sum4(PR.futureSteps, 'approvals') }
        ],
        none: (cur4.steps.length && fut4.steps.length) ? '' : 'The before-and-after comparison could not be built on the material held.'
      };

      const TR = W4.transformation || {}, tActs = (TR.activities || []).slice(0, 24);
      const TK = [['Eliminate', 'var(--bad)'], ['Automate', '#D26B51'], ['Agentify', accent], ['Augment', 'var(--ok)'], ['Retain', 'var(--fg3)']];
      const transform = {
        title: 'Every activity in the process today, and its treatment in the redesigned process.',
        cols: TK.map((pair) => {
          const items = tActs.filter((a) => String(a.treatment || '').toLowerCase() === pair[0].toLowerCase());
          return { k: pair[0].toUpperCase(), c: pair[1], n: String(items.length).padStart(2, '0'), items: items.map((a) => ({ t: a.current })) };
        }),
        none: none4(TR.unavailable, tActs.length ? '' : 'No activity could be dispositioned on the material held.')
      };

      const RS = W4.responsibility || {}, rLanes = (RS.lanes || []).slice(0, 8);
      const resp = {
        steps: rLanes.map((l, i) => {
          const k = String(l.actor || '').toLowerCase();
          const hasH = k.indexOf('human') >= 0, hasA = k.indexOf('ai') >= 0 || k.indexOf('agent') >= 0;
          return {
            i: String(i + 1).padStart(2, '0'), name: l.step, actor: String(l.actor || 'Unassigned').toUpperCase(),
            note: l.note || '', c: ACT(l.actor), ai: hasA || !hasH, human: hasH
          };
        }),
        none: rLanes.length ? '' : 'The responsibility split could not be drawn on the material held.'
      };

      const HR = W4.handoffReduction || {}, hItems = (HR.items || []).slice(0, 4).filter((i) => n4(i.current) || n4(i.future));
      const hMax = Math.max.apply(null, hItems.map((i) => Math.max(n4(i.current), n4(i.future))).concat([1]));
      const handoffR = {
        title: 'Structural load in the process, before and after the redesign.',
        items: hItems.map((i) => ({
          k: i.k, cLabel: String(n4(i.current)), fLabel: String(n4(i.future)),
          cH: Math.max(3, Math.round(n4(i.current) / hMax * 82)) + '%', fH: Math.max(3, Math.round(n4(i.future) / hMax * 82)) + '%'
        })),
        note: HR.note || (hItems.length ? '' : 'Handoffs and approvals could not be counted on the material held.')
      };

      const ER = W4.effortReduction || {}, eR = (ER.items || []).slice(0, 6).filter((i) => n4(i.current) || n4(i.future));
      const effortR = {
        title: 'Before and after on the measures that carry cost.',
        items: eR.map((i) => {
          const c = n4(i.current), f = n4(i.future), m = Math.max(c, f, 1), u = i.unit ? ' ' + i.unit : '';
          return {
            k: i.k, cLabel: i.currentLabel || (c + u), fLabel: i.futureLabel || (f + u),
            cH: Math.max(3, Math.round(c / m * 82)) + '%', fH: Math.max(3, Math.round(f / m * 82)) + '%'
          };
        }),
        note: ER.note || (eR.length ? '' : 'Effort and cycle time could not be quantified on the material held.')
      };

      const kpis = (W4.kpis || []).slice(0, 6).map((k) => ({ k: String(k.k || '').toUpperCase(), from: t4(k.from), to: t4(k.to) }));

      const DR = W4.decisionRights || {};
      const decision = {
        rows: (DR.rows || []).slice(0, 8).map((r) => ({ d: r.decision, cur: t4(r.current), fut: t4(r.future), c: ACT(r.future) })),
        none: none4(DR.unavailable, (DR.rows || []).length ? '' : 'Decision rights could not be redrawn on the material held.')
      };

      const AR = W4.architecture || {}, aLayers = (AR.layers || []).slice(0, 6);
      const arch = {
        layers: aLayers.map((l, i) => ({ name: l.name, note: l.note || '', arrow: i === aLayers.length - 1 ? '' : '↓', c: i % 2 ? accent : '#D26B51' })),
        cards: (AR.cards || []).slice(0, 5).map((c) => ({ k: String(c.k || '').toUpperCase(), items: (c.items || []).slice(0, 5).map((t) => ({ t: t })) })),
        none: aLayers.length ? '' : 'The future-state architecture could not be drawn on the material held.'
      };

      const EC = W4.economics || {};
      const econ = {
        items: (EC.items || []).slice(0, 5).map((i) => ({ k: String(i.k || '').toUpperCase(), v: t4(i.v), basis: i.basis || '' })),
        none: none4(EC.unavailable, (EC.items || []).length ? '' : 'Economic impact could not be sized on the material held.')
      };

      const score = (W4.scorecard || []).slice(0, 3).map((s) => ({
        name: s.process || compare.name,
        mix: [
          { k: 'Eliminated', v: String(n4(s.eliminated)), c: 'var(--bad)' },
          { k: 'Automated', v: String(n4(s.automated)), c: '#D26B51' },
          { k: 'Agentified', v: String(n4(s.agentified)), c: accent },
          { k: 'Augmented', v: String(n4(s.augmented)), c: 'var(--ok)' },
          { k: 'Retained', v: String(n4(s.retained)), c: 'var(--fg3)' }
        ],
        rows: [
          { k: 'Handoffs', v: t4(s.handoffs) },
          { k: 'Cycle time', v: t4(s.cycleTime) },
          { k: 'Manual effort', v: t4(s.manualEffort) }
        ]
      }));

      vis4 = {
        compare: compare, transform: transform, resp: resp, handoffR: handoffR, effortR: effortR,
        kpis: kpis, kpisNone: kpis.length ? '' : 'No future-state KPI could be set on the material held.',
        decision: decision, arch: arch, econ: econ,
        score: score, scoreNone: score.length ? '' : 'No process has been scored for redesign yet.'
      };
    }

  return vis4;
}
