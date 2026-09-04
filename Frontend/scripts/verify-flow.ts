/**
 * Zero-cost browser verification for the phase workflow.
 *
 * The `/pack-preview` route uses in-memory fixtures and overrides every
 * persistence/model action, so this script cannot create an engagement,
 * mutate the database, scrape a site, or spend generation credits.
 */

import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright-core';

const WEB = (process.env.VERIFY_URL || 'http://localhost:3002').replace(/\/$/, '');
const OUT = process.env.VERIFY_OUT || mkdtempSync(join(tmpdir(), 'sprint-console-flow-'));
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });
const errors: string[] = [];
const backendRequests: string[] = [];

page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error' && !/favicon/i.test(message.text())) {
    errors.push(`console: ${message.text().slice(0, 240)}`);
  }
});
await page.route(/\/api\//, async (route) => {
  backendRequests.push(route.request().url());
  await route.abort('blockedbyclient');
});

try {
  console.log('Opening a phase is free until the consultant starts the requirements check');
  await page.goto(`${WEB}/pack-preview?phase=0&mode=unchecked`, { waitUntil: 'load' });
  await page.getByText('NOT CHECKED', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Check the Phase 0 requirements before generation' }).waitFor();

  console.log('Phase 0: requirements are shown before generation');
  await page.goto(`${WEB}/pack-preview?phase=0&mode=inputs`, { waitUntil: 'load' });
  await page.getByText('PHASE 0 · BEFORE GENERATION', { exact: true }).waitFor();
  await page.getByText('Which operating measure should the client use as the decision baseline?').waitFor();
  await page.getByText('IF YOU GENERATE NOW · ASSUMPTIONS THE PACK WILL MAKE', { exact: true }).waitFor();
  assert.equal(await page.locator('[data-card]').count(), 0, 'Phase 0 output must not exist before Generate');
  await page.screenshot({ path: join(OUT, '1-phase-0-before-generation.png'), fullPage: true });

  console.log('Phase 0: Generate produces the complete fixture output without a model call');
  await page.getByRole('button', { name: 'Generate the Phase 0 deliverables' }).click();
  await page.getByText('BUILT FROM LIVE SOURCES', { exact: true }).waitFor();
  const phase0Cards = await page.locator('[data-card]').count();
  assert.equal(phase0Cards, 13, `expected all 13 Phase 0 views, received ${phase0Cards}`);
  await page.screenshot({ path: join(OUT, '2-phase-0-output.png'), fullPage: true });

  console.log('Phase 1: prior Phase 0 pack unlocks it and it asks first');
  await page.goto(`${WEB}/pack-preview?phase=1&mode=inputs`, { waitUntil: 'load' });
  await page.getByText('PHASE 1 · BEFORE GENERATION', { exact: true }).waitFor();
  await page.getByText('Which operating measure should the client use as the decision baseline?').waitFor();
  assert.equal(await page.getByText('PHASE 1 IS LOCKED', { exact: true }).count(), 0, 'Phase 1 should be open after Phase 0');
  assert.match(
    await page.locator('.eng-gen-cta-note').innerText(),
    /every completed earlier phase/i,
    'generation must state that prior phase evidence is carried forward',
  );

  console.log('Phase 2: missing Phase 1 hides the workspace and keeps it locked');
  await page.goto(`${WEB}/pack-preview?phase=2&mode=locked`, { waitUntil: 'load' });
  await page.getByText('PHASE 2 IS LOCKED', { exact: true }).waitFor();
  assert.match(await page.locator('.eng-content').innerText(), /Phase 1.+has to be generated first/i);
  assert.equal(await page.getByRole('button', { name: 'OUTPUTS' }).count(), 0, 'a locked phase must not expose Outputs');
  assert.equal(await page.locator('[data-card]').count(), 0, 'a locked phase must not reveal a stale pack');
  await page.screenshot({ path: join(OUT, '3-phase-2-locked.png'), fullPage: true });

  assert.deepEqual(backendRequests, [], 'the fixture verification must never call the backend');
  assert.deepEqual(errors, [], `browser errors: ${errors.join(' | ')}`);
  console.log(`Flow verified without model/API usage. Screenshots: ${OUT}`);
} finally {
  await browser.close();
}
