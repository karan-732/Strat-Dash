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
 * Phase 3 — the process forensics pack: the current-state twin, effort vs
 * waiting, process health, handoffs, friction heatmap, rework, economic
 * impact per step, people-and-systems map, root cause tree and step-level
 * quantification.
 */
export function buildPhase3Pack(ctx: PackContext) {
  const { p, accent } = ctx;
    const W3 = p.visual3;
    let vis3 = null;
    if (W3) {
      const n3 = (v) => (typeof v === 'number' && isFinite(v) ? v : 0);
      const t3 = (v) => (v == null || v === '' ? 'Not available' : String(v));
      const FR = { high: 'var(--bad)', medium: 'var(--warn)', low: 'var(--ok)', critical: 'var(--bad)' };
      const none3 = (arr, empty) => ((arr && arr.length) ? 'Could not be reached, even by benchmark: ' + arr.join(', ') : empty);
      const dur = (m) => { const v = n3(m); if (!v) return '0 min'; if (v < 90) return v + ' min'; if (v < 1440) return (Math.round(v / 6) / 10) + ' hrs'; return (Math.round(v / 144) / 10) + ' days'; };

      const TW = W3.twin || {};
      const tSteps = (TW.steps || []).slice(0, 8);
      const twin = {
        name: String(TW.name || 'Priority process').toUpperCase(),
        steps: tSteps.map((s, i) => {
          const c = FR[String(s.friction || '').toLowerCase()] || 'var(--card4)';
          const chips = [];
          if (s.owner) chips.push({ t: String(s.owner) });
          if (n3(s.activeMin)) chips.push({ t: dur(s.activeMin) + ' active' });
          if (n3(s.waitMin)) chips.push({ t: dur(s.waitMin) + ' waiting' });
          if (s.system) chips.push({ t: String(s.system) });
          return { i: String(i + 1), name: s.name, c: c, fr: String(s.friction || 'not classified').toUpperCase() + ' FRICTION', chips: chips, note: s.note || '' };
        }),
        none: tSteps.length ? '' : 'The process twin could not be built from the material held.'
      };

      const H = W3.health || {};
      const health = [
        { k: 'Total cycle time', v: t3(H.totalCycle), c: 'var(--bad)' },
        { k: 'Active effort', v: t3(H.activeEffort), c: '#D26B51' },
        { k: 'Waiting time', v: t3(H.waitingTime), c: 'var(--warn)' },
        { k: 'People involved', v: n3(H.people) ? String(H.people) : 'n/a', c: 'var(--ok)' },
        { k: 'Systems touched', v: n3(H.systems) ? String(H.systems) : 'n/a', c: 'var(--ok)' },
        { k: 'Handoffs', v: n3(H.handoffs) ? String(H.handoffs) : 'n/a', c: 'var(--warn)' }
      ];

      const eItems = tSteps.filter((s) => n3(s.activeMin) || n3(s.waitMin));
      const eMax = Math.max.apply(null, eItems.map((s) => n3(s.activeMin) + n3(s.waitMin)).concat([1]));
      const effort = {
        title: 'Active work against waiting time for every step, in minutes per instance.',
        items: eItems.map((s) => {
          const a = n3(s.activeMin), w = n3(s.waitMin);
          return {
            name: s.name, total: dur(a + w),
            aH: Math.max(3, Math.round(a / eMax * 88)) + '%', wH: Math.max(0, Math.round(w / eMax * 88)) + '%',
            actT: 'Active effort: ' + dur(a), waitT: 'Waiting time: ' + dur(w)
          };
        }),
        none: eItems.length ? '' : 'No step could be timed on the material held.'
      };

      const HO = W3.handoffs || {}, hChain = (HO.chain || []).slice(0, 8);
      const handoff = {
        chain: hChain.map((n, i) => ({ name: n, arrow: i === hChain.length - 1 ? '' : '→' })),
        stats: [
          { k: 'Total handoffs', v: n3(HO.totalHandoffs) ? String(HO.totalHandoffs) : 'n/a' },
          { k: 'Approval points', v: n3(HO.approvalPoints) ? String(HO.approvalPoints) : 'n/a' },
          { k: 'System transfers', v: n3(HO.systemTransfers) ? String(HO.systemTransfers) : 'n/a' }
        ],
        note: HO.note || (hChain.length ? '' : 'The handoff chain could not be established on the material held.')
      };

      const FH = W3.friction || {}, fDims = (FH.dimensions || []).slice(0, 7);
      const fRows = (FH.rows || []).slice(0, 8).map((r) => ({
        name: r.step,
        cells: fDims.map((d, i) => { const lv = String((r.levels || [])[i] || '').toLowerCase(); return { c: FR[lv] || 'var(--card3)', title: d + ': ' + (lv || 'not captured') }; })
      }));
      const friction = {
        cols: 'minmax(150px,1.3fr) repeat(' + Math.max(1, fDims.length) + ',minmax(0,1fr))',
        dims: fDims.map((d) => ({ n: String(d).toUpperCase() })), rows: fRows,
        legend: [{ k: 'LOW', c: 'var(--ok)' }, { k: 'MEDIUM', c: 'var(--warn)' }, { k: 'HIGH', c: 'var(--bad)' }],
        none: none3(FH.unavailable, fRows.length ? '' : 'No step could be classified for friction on the material held.')
      };

      const RW = W3.rework || {}, rCauses = (RW.causes || []).filter((c) => n3(c.pct)).sort((a, b) => n3(b.pct) - n3(a.pct)).slice(0, 6);
      const rMax = Math.max.apply(null, rCauses.map((c) => n3(c.pct)).concat([1]));
      const rework = {
        title: 'Top causes of rework and exceptions, ' + (RW.unit || '% of cases') + '.',
        items: rCauses.map((c, i) => ({
          label: String(i + 1).padStart(2, '0') + ' · ' + c.name, val: n3(c.pct) + '%',
          w: Math.round(n3(c.pct) / rMax * 100) + '%', c: i === 0 ? 'var(--bad)' : (i === 1 ? 'var(--warn)' : '#D26B51')
        })),
        none: RW.note || (rCauses.length ? '' : 'Rework and exception causes could not be quantified on the material held.')
      };

      const CO = W3.cost || {}, cItems = (CO.items || []).filter((c) => n3(c.value)).sort((a, b) => n3(b.value) - n3(a.value)).slice(0, 7);
      const cMax = Math.max.apply(null, cItems.map((c) => n3(c.value)).concat([1]));
      const cUnit = CO.unit || '';
      const cost = {
        title: 'Annual economic consequence attached to each activity.',
        items: cItems.map((c) => ({ name: c.activity, val: (cUnit ? cUnit + ' ' : '') + c.value, w: Math.round(n3(c.value) / cMax * 100) + '%', basis: c.basis || '' })),
        total: cItems.length ? (cUnit ? cUnit + ' ' : '') + Math.round(cItems.reduce((n, c) => n + n3(c.value), 0) * 10) / 10 : 'Not available',
        none: none3(CO.unavailable, cItems.length ? '' : 'No activity could be costed on the material held.')
      };

      const PS = W3.peopleSystems || {}, psChain = (PS.chain || []).slice(0, 10);
      const people = {
        stats: [
          { k: 'People', v: n3(PS.people) ? String(PS.people) : 'n/a' },
          { k: 'Systems', v: n3(PS.systems) ? String(PS.systems) : 'n/a' },
          { k: 'Departments', v: n3(PS.departments) ? String(PS.departments) : 'n/a' }
        ],
        chain: psChain.map((n, i) => ({ name: n.name, c: String(n.kind || '').toLowerCase() === 'system' ? accent : '#D26B51', arrow: i === psChain.length - 1 ? '' : '→' }))
      };

      const RC = W3.rootCause || {}, rcBranches = (RC.branches || []).slice(0, 6), rcDrill = ((RC.drill || {}).reasons || []).slice(0, 5);
      const root = {
        question: RC.question || 'Why is cycle time high?',
        branches: rcBranches.map((b) => ({ t: b })),
        drillCause: (RC.drill || {}).cause || 'Not established',
        drill: rcDrill.map((r) => ({ t: r })),
        none: rcBranches.length ? '' : 'Root causes could not be resolved on the material held.'
      };

      const opps = (W3.opportunities || []).slice(0, 4).map((o, i) => ({
        rank: 'FRICTION #' + (o.rank || i + 1), name: o.name,
        c: FR[String(o.severity || '').toLowerCase()] || 'var(--warn)',
        metrics: (o.metrics || []).slice(0, 3).map((m) => ({ k: m.k, v: t3(m.v) })), note: o.note || ''
      }));

      vis3 = {
        twin: twin, health: health, effort: effort, handoff: handoff, friction: friction,
        rework: rework, cost: cost, people: people, root: root,
        opps: opps, oppsNone: opps.length ? '' : 'No friction has been summarised into an opportunity yet.'
      };
    }

  return vis3;
}
