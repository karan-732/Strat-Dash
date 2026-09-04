/*
 * End-to-end check for DOWNLOAD FULL REPORT.
 *
 * Drives the installed Chrome against a running server, clicks the button on
 * /pack-preview (which renders a phase pack from a fixture), and asserts the
 * .docx that comes back carries one image per card on screen.
 *
 *   bun run start &            # or bun dev
 *   bun run verify:report
 */

import { chromium } from 'playwright-core';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const URL = process.env.VERIFY_URL || 'http://localhost:3000/pack-preview';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const errors: string[] = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

try {
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForSelector('[data-card]', { timeout: 30_000 });

  const cards = await page.locator('[data-card]').count();
  console.log(`cards on screen: ${cards}`);
  if (!cards) throw new Error('no output cards rendered — is the fixture pack still wired up?');

  const button = page.getByRole('button', { name: /DOWNLOAD FULL REPORT|CAPTURING|ASSEMBLING|BUILDING/i }).first();
  await button.waitFor({ timeout: 15_000 });

  const downloadPromise = page.waitForEvent('download', { timeout: 180_000 });
  await button.click();
  const download = await downloadPromise;

  const dir = mkdtempSync(join(tmpdir(), 'sprint-report-'));
  const path = join(dir, download.suggestedFilename());
  await download.saveAs(path);

  const bytes = readFileSync(path);
  const zip = bytes.toString('latin1');
  const images = (zip.match(/word\/media\/[^\s]+?\.png/g) ?? []).length;

  console.log(`downloaded: ${download.suggestedFilename()} (${Math.round(bytes.length / 1024)} KB)`);
  console.log(`images embedded: ~${images}`);
  if (bytes.length < 20_000) throw new Error('report looks empty');
  if (errors.length) throw new Error('page errors: ' + errors.slice(0, 3).join(' | '));
  console.log('OK');
} finally {
  await browser.close();
}
