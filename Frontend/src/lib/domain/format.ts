/** Small formatting helpers shared by the console and the exporters. */

/** Title-case a client name the way the console has always displayed it. */
export function capName(s: string): string {
  return String(s || '').replace(/(^|[\s&\-/(])([a-z])/g, (_m, a: string, b: string) => a + b.toUpperCase());
}

/** URL/file-safe slug — also used for engagement and phase route segments. */
export function slug(s: string): string {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function fmtSize(n: number): string {
  return n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
}

export function wordCount(text: string): number {
  const t = String(text || '').trim();
  return t ? t.split(/\s+/).length : 0;
}

export function pad2(n: number | string): string {
  return String(n).padStart(2, '0');
}
