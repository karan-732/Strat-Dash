/**
 * The model is asked for bare JSON, but a long pack can still arrive truncated.
 * `parseJson` finds the object and, if it will not parse, repairs the tail:
 * unterminated strings are closed, a dangling key is dropped and every open
 * brace or bracket is closed in order.
 */
export function parseJson<T = unknown>(raw: string): T {
  const t = String(raw).trim();
  const a = t.indexOf('{');
  if (a < 0) throw new Error('the model did not return JSON');
  const b = t.lastIndexOf('}');
  if (b > a) {
    try {
      return JSON.parse(t.slice(a, b + 1)) as T;
    } catch {
      /* fall through to repair */
    }
  }
  return JSON.parse(repairJson(t.slice(a))) as T;
}

export function repairJson(s: string): string {
  let out = '';
  const stack: string[] = [];
  let inStr = false;
  let esc = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      out += c;
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') {
      inStr = true;
      out += c;
      continue;
    }
    if (c === '{' || c === '[') {
      stack.push(c === '{' ? '}' : ']');
      out += c;
      continue;
    }
    if (c === '}' || c === ']') {
      stack.pop();
      out += c;
      continue;
    }
    out += c;
  }
  if (inStr) out += '"';
  for (let pass = 0; pass < 4; pass++) {
    out = out.replace(/\s+$/, '');
    if (/[:,]$/.test(out)) {
      out = out.replace(/,?\s*"[^"]*"\s*:$/, '').replace(/,$/, '');
      continue;
    }
    break;
  }
  while (stack.length) out += stack.pop();
  return out.replace(/,(\s*[}\]])/g, '$1');
}
