/*
 * The playbook is authored once, in src/lib/playbook/phases.ts, and exported
 * here as JSON for the Python backend to read. Run after editing the phases:
 *
 *   bun run scripts/export-playbook.ts
 */
import { writeFileSync } from 'node:fs';
import { PHASES } from '../src/lib/playbook/phases';
import { STEP_KINDS, DOC_STATUS } from '../src/lib/playbook/constants';
import { PACK_SHAPES, PACK_BRIEFS, PHASE2_SCOPE_BRIEF, PEER_RANK, QUESTIONS, DELIVERABLE, RESEARCH } from '../src/lib/ai/prompts/generated';
import { packSystem } from '../src/lib/ai/prompts';

const out = 'backend/app/domain/playbook.json';
writeFileSync(
  out,
  JSON.stringify({ generatedFrom: 'src/lib/playbook/phases.ts', stepKinds: STEP_KINDS, docStatus: DOC_STATUS, phases: PHASES }, null, 2),
);
console.log(`${out}: ${PHASES.length} phases, ${PHASES.reduce((n, p) => n + p.docs.length, 0)} deliverables`);

/*
 * The pack prompts too — extracted from the original console and corrected
 * against the playbook. `packSystem` applies those corrections, so the backend
 * gets the corrected text rather than the raw extraction.
 */
const prompts = 'backend/app/agents/prompts.json';
writeFileSync(
  prompts,
  JSON.stringify(
    {
      generatedFrom: 'src/lib/ai/prompts',
      packShapes: PACK_SHAPES,
      packSystems: PACK_SHAPES.map((_, i) => packSystem(i)),
      packBriefs: PACK_BRIEFS,
      phase2ScopeBrief: PHASE2_SCOPE_BRIEF,
      peerRank: PEER_RANK,
      questions: QUESTIONS,
      deliverable: DELIVERABLE,
      research: RESEARCH,
    },
    null,
    2,
  ),
);
console.log(`${prompts}: ${PACK_SHAPES.length} pack prompts`);
