/*
 * The design tool exports the console as a self-extracting "bundled page":
 * a small loader plus two JSON payload lines — an asset map and the real
 * template. This pulls the template back out so the codemods have a plain
 * source file to read, and vendors it in the repo so the port can be
 * regenerated without the original download.
 *
 *   node scripts/unbundle.mjs <bundled.html> <out.html>
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('usage: node scripts/unbundle.mjs <bundled.html> <out.html>');
  process.exit(1);
}

const raw = readFileSync(input, 'utf8');

/*
 * Already a plain template? The design tool exports both shapes and either is
 * a valid input, so accept it rather than failing on a file that needs no work.
 * The bundler's own loader is the tell - a bundled file mentions `<x-dc>` too,
 * but only inside the JSON payload it is about to unpack.
 */
if (!raw.includes('__bundler_loading')) {
  writeFileSync(output, raw);
  console.log(`${input} is already unbundled - copied ${raw.length} bytes`);
  process.exit(0);
}

/*
 * The template is the one JSON-string line holding a whole document. The asset
 * map on the neighbouring line is a JSON *object* of base64 blobs, so keying on
 * the leading quote picks the template and skips it.
 */
const line = raw
  .split('\n')
  .map((l) => l.trim().replace(/;$/, ''))
  .filter((l) => l.startsWith('"') && l.length > 10000)
  .sort((a, b) => b.length - a.length)[0];

if (!line) {
  console.error(`${input}: no embedded template found`);
  process.exit(1);
}

const html = JSON.parse(line);
if (!html.includes('<x-dc>')) {
  console.error(`${input}: the embedded payload is not a console template`);
  process.exit(1);
}

writeFileSync(output, html);
console.log(`unbundled ${input} -> ${output} (${html.length} bytes, ${html.split('\n').length} lines)`);
