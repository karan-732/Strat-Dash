import { PHASES } from '@/lib/playbook/phases';
import { DOC_STATUS, STEP_KINDS } from '@/lib/playbook/constants';
import { fmtSize, pad2, slug, wordCount } from '@/lib/domain/format';
import { templateMd } from '@/lib/export/documents';
import { wrapDoc } from '@/lib/export/wrappers';
import { download, downloadBlob } from '@/lib/browser/download';
import type { DocStatus, Engagement } from '@/lib/domain/types';
import type { ViewModelDeps } from './deps';

/**
 * The INPUTS tab: the checklist of what the phase needs, its workflow steps,
 * the deliverable rows, the data room and the research library.
 */
export function buildPhaseInputs(deps: ViewModelDeps, p: Engagement, pi: number) {
  const { state: S, actions, settings } = deps;
  const accent = settings.accent;
  const ph = PHASES[pi];

  /*
   * The playbook names the room each phase needs; this records who was in it.
   * A trailing instruction like "No broad functional interviews yet" is a rule
   * for the phase, not a person, so it is shown but cannot be ticked.
   */
  const isRule = (who: string) => /^No broad/i.test(who);
  const people = ph.participants.map((label, i) => {
    const k = pi + ':' + i;
    const present = p.attended?.[k] === true;
    const rule = isRule(label);
    return {
      label,
      present: present ? 'true' : 'false',
      aria: rule ? label : (present ? 'Mark absent: ' : 'Mark present: ') + label,
      bd: rule ? 'var(--ln12)' : present ? accent : 'var(--ln22)',
      bg: rule ? 'var(--card0)' : present ? 'var(--card3)' : 'transparent',
      fg: rule ? 'var(--fg3)' : present ? 'var(--fg)' : 'var(--fg2)',
      markBd: rule ? 'var(--ln20)' : present ? accent : 'var(--ln26)',
      markBg: rule ? 'transparent' : present ? accent : 'transparent',
      mark: rule ? '·' : present ? '✓' : '',
      toggle: rule ? () => {} : () => actions.toggleAttendance(pi, i),
    };
  });
  const expected = ph.participants.filter((who) => !isRule(who)).length;
  const presentCount = ph.participants.filter((who, i) => !isRule(who) && p.attended?.[pi + ':' + i] === true).length;
  const room = {
    num: ph.num,
    people,
    allPresent: presentCount >= expected && expected > 0,
    status: presentCount + ' / ' + expected + ' IN THE ROOM',
    note:
      presentCount >= expected
        ? 'Everyone the playbook asks for was present.'
        : 'Whoever is missing is carried into the generation, so the pack says whose view it lacks.',
  };

  const inputs = ph.inputs.map((label, i) => {
    const k = pi + ':' + i;
    const v = p.inputs[k];
    const on = v === true;
    const na = v === 'na';
    const fl = p.files.filter((f) => f.phase === pi && f.input === i).length;
    return {
      label,
      received: on ? 'true' : 'false',
      naPressed: na ? 'true' : 'false',
      toggleAria: (on ? 'Mark not received: ' : 'Mark received: ') + label,
      naAria: (na ? 'Mark available: ' : 'Mark not available: ') + label,
      fileAria: 'Attach files for ' + label,
      box: on ? accent : 'transparent',
      mark: on ? '✓' : na ? '–' : '',
      fg: na ? 'var(--fg3)' : on ? 'var(--fg)' : 'var(--fg2)',
      deco: na ? 'line-through' : 'none',
      naBg: na ? 'var(--fg)' : 'transparent',
      naFg: na ? 'var(--card)' : 'var(--fg3)',
      naBd: na ? 'var(--fg)' : 'var(--ln20)',
      filesLabel: fl ? fl + (fl > 1 ? ' FILES' : ' FILE') : '',
      toggle: () => actions.toggleInput(pi, i),
      na: () => actions.markInputNa(pi, i),
      onFiles: (e: React.ChangeEvent<HTMLInputElement>) => {
        actions.addFiles(e.target.files, pi, i);
        e.target.value = '';
      },
    };
  });

  const steps = ph.steps.map((row, i) => {
    const k = pi + ':' + i;
    const done = p.steps[k] === true;
    const kind = STEP_KINDS[row[0]] || STEP_KINDS.grey;
    return {
      n: pad2(i + 1),
      label: row[1],
      kind: kind.l,
      c: kind.c,
      done: done ? 'true' : 'false',
      display: done ? '✓' : pad2(i + 1),
      numberBg: done ? kind.c : 'var(--card2)',
      numberFg: done ? '#0E1015' : 'var(--fg3)',
      bg: done ? 'var(--card3)' : 'var(--card0)',
      toggleAria: (done ? 'Mark incomplete: ' : 'Mark complete: ') + row[1],
      toggle: () => actions.toggleStep(pi, i),
    };
  });
  const stepsDone = ph.steps.filter((_, i) => p.steps[pi + ':' + i] === true).length;

  const docs = ph.docs.map((d) => {
    const k = pi + '.' + d.n;
    const rec = p.docs[k] || { s: 0 as DocStatus, draft: '' };
    const words = wordCount(rec.draft);
    const genLabel = S.busy[k] ? 'GENERATING…' : rec.draft ? 'REGENERATE DRAFT' : 'GENERATE DRAFT';
    const tplLabel = S.tpl[k] ? 'HIDE OUTLINE' : 'OUTLINE';
    const openLabel = S.open[k] ? 'HIDE DRAFT' : rec.draft ? 'OPEN DRAFT' : 'WRITE DRAFT';
    const draftOrTemplate = () => rec.draft || templateMd(p, pi, d);
    return {
      nn: '0' + d.n,
      name: d.name,
      desc: d.desc,
      titleId: 'doc-p' + pi + '-' + d.n + '-title',
      briefId: 'doc-p' + pi + '-' + d.n + '-brief',
      outlineId: 'doc-p' + pi + '-' + d.n + '-outline',
      draftId: 'doc-p' + pi + '-' + d.n + '-draft',
      scopeLabel: 'View ' + d.name + ' scope',
      editorLabel: 'Draft for ' + d.name,
      edge: rec.s >= 3 ? '#D26B51' : rec.s > 0 ? accent : 'var(--ln12)',
      chips: DOC_STATUS.map((lab, idx) => ({
        label: lab,
        bg: idx === rec.s ? accent : 'var(--card0)',
        fg: idx === rec.s ? 'var(--fg)' : 'var(--fg3)',
        bd: idx === rec.s ? 'var(--fg)' : 'var(--ln14)',
        aria: 'Set ' + d.name + ' status to ' + lab,
        pressed: idx === rec.s ? 'true' : 'false',
        set: () => actions.setDocStatus(pi, d.n, idx as DocStatus),
      })),
      sections: d.sections.map((s, i) => ({ n: pad2(i + 1), t: s })),
      draft: rec.draft,
      open: !!S.open[k],
      tplOpen: !!S.tpl[k],
      busy: !!S.busy[k],
      genLabel,
      genAria: genLabel + ' - ' + d.name,
      genBg: rec.draft ? 'var(--card)' : accent,
      tplLabel,
      tplAria: tplLabel + ' - ' + d.name,
      tplExpanded: S.tpl[k] ? 'true' : 'false',
      openLabel,
      openAria: openLabel + ' - ' + d.name,
      openExpanded: S.open[k] ? 'true' : 'false',
      previewAria: 'Preview ' + d.name,
      tplDownloadAria: 'Download blank template for ' + d.name,
      mdDownloadAria: 'Download ' + d.name + ' as Markdown',
      docDownloadAria: 'Download ' + d.name + ' as Word document',
      wordCount: words ? words + ' WORDS · ' + DOC_STATUS[rec.s] : DOC_STATUS[rec.s],
      toggleTpl: () => actions.set((s) => ({ tpl: { ...s.tpl, [k]: !s.tpl[k] } })),
      toggleOpen: () => actions.set((s) => ({ open: { ...s.open, [k]: !s.open[k] } })),
      gen: () => void actions.generateDoc(pi, d.n),
      onEdit: (e: React.ChangeEvent<HTMLTextAreaElement>) => actions.setDocDraft(pi, d.n, e.target.value),
      dlMd: () =>
        download(
          slug(p.name) + '-p' + ph.num + '-' + slug(d.name) + '.md',
          draftOrTemplate(),
          'text/markdown;charset=utf-8',
        ),
      dlDoc: () =>
        download(
          slug(p.name) + '-p' + ph.num + '-' + slug(d.name) + '.doc',
          wrapDoc(d.name + ' - ' + p.name, draftOrTemplate()),
          'application/msword',
        ),
      dlTpl: () => download('outline-' + slug(d.name) + '.md', templateMd(p, pi, d), 'text/markdown;charset=utf-8'),
      preview: () => actions.set({ pv: k }),
    };
  });

  const files = p.files
    .filter((f) => f.phase === pi)
    .map((f) => ({
      name: f.name,
      meta: fmtSize(f.size) + (f.input >= 0 ? ' · INPUT ' + pad2(f.input + 1) : ' · DATA ROOM'),
      download: () => {
        const b = actions.fileBlob(f.id);
        if (!b) {
          actions.say('This file was attached in an earlier session - re-attach it to download.');
          return;
        }
        downloadBlob(f.name, b);
      },
      remove: () => actions.removeFile(f.id),
    }));

  const research = p.research.map((r, ri) => ({
    q: r.q,
    md: r.md,
    when: r.when,
    open: !!S.ropen[r.id],
    titleId: 'research-p' + pi + '-' + ri + '-title',
    bodyId: 'research-p' + pi + '-' + ri + '-body',
    srcLabel:
      r.srcs && r.srcs.length
        ? r.srcs.filter((s) => s.ok).length + ' / ' + r.srcs.length + ' SOURCES READ LIVE'
        : 'MODEL KNOWLEDGE ONLY',
    openLabel: S.ropen[r.id] ? 'COLLAPSE' : 'OPEN',
    useLabel: r.use === false ? 'NOT IN CONTEXT' : 'IN CONTEXT',
    useBg: r.use === false ? 'var(--card0)' : accent,
    usePressed: r.use === false ? 'false' : 'true',
    expanded: S.ropen[r.id] ? 'true' : 'false',
    useAria: (r.use === false ? 'Include in generation context: ' : 'Exclude from generation context: ') + r.q,
    openAria: (S.ropen[r.id] ? 'Collapse research brief: ' : 'Open research brief: ') + r.q,
    downloadAria: 'Download research brief: ' + r.q,
    deleteAria: 'Delete research brief: ' + r.q,
    toggle: () => actions.set((s) => ({ ropen: { ...s.ropen, [r.id]: !s.ropen[r.id] } })),
    use: () => actions.patchLocal((x) => {
      x.research = x.research.map((y) => (y.id === r.id ? { ...y, use: y.use === false } : y));
    }),
    dl: () =>
      download(
        slug(p.name) + '-research-' + slug(r.q.slice(0, 40)) + '.md',
        '# ' + r.q + '\n\n' + r.md,
        'text/markdown;charset=utf-8',
      ),
    del: () => actions.patchLocal((x) => {
      x.research = x.research.filter((y) => y.id !== r.id);
    }),
  }));

  const links = (p.links || []).map((l) => ({
    url: l.url,
    remove: () => actions.removeLink(l.id),
  }));

  return { inputs, steps, stepsDone, docs, files, research, links, room };
}
