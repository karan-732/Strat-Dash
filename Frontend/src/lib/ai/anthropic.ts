import 'server-only';

const API = 'https://api.anthropic.com/v1/messages';
const VERSION = '2023-06-01';

/** Retry schedule for the transient failures a long pack build runs into. */
const WAITS = [0, 5000, 12000, 25000];
const TRANSIENT = /overload|rate.?limit|429|500|502|503|529|timeout|network|fetch/i;

export function defaultModel(): string {
  return process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';
}

export interface CompleteInput {
  system: string;
  prompt: string;
  maxTokens?: number;
  model?: string;
}

/** One completion, retried four times while the failure looks transient. */
export async function complete({ system, prompt, maxTokens, model }: CompleteInput): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY is not configured on the server');

  let last: unknown = null;
  for (let i = 0; i < WAITS.length; i++) {
    if (WAITS[i]) await new Promise((r) => setTimeout(r, WAITS[i]));
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': key,
          'anthropic-version': VERSION,
        },
        body: JSON.stringify({
          model: model || defaultModel(),
          max_tokens: maxTokens || 4000,
          system,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (!res.ok) throw new Error(`anthropic ${res.status}: ${(await res.text()).slice(0, 300)}`);
      const json = (await res.json()) as { content?: { type: string; text?: string }[] };
      return (json.content || [])
        .filter((b) => b.type === 'text')
        .map((b) => b.text || '')
        .join('');
    } catch (e) {
      last = e;
      if (!TRANSIENT.test(String((e as Error)?.message ?? e))) throw e;
    }
  }
  throw new Error(
    'the model was busy after four attempts - press GENERATE again in a moment (' +
      String((last as Error)?.message ?? last) +
      ')',
  );
}
