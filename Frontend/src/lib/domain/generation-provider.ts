export type GenerationProvider = 'openrouter' | 'openai';

export interface GenerationProviderInfo {
  configured: boolean;
  label: string;
  model: string;
  webSearch: boolean;
}

export interface GenerationProviderCatalog {
  default: GenerationProvider;
  providers: Record<GenerationProvider, GenerationProviderInfo>;
}

export const DEFAULT_GENERATION_PROVIDER: GenerationProvider = 'openrouter';

export const GENERATION_PROVIDER_OPTIONS: ReadonlyArray<{
  value: GenerationProvider;
  label: string;
  detail: string;
}> = [
  { value: 'openrouter', label: 'CLAUDE', detail: 'Claude via OpenRouter' },
  { value: 'openai', label: 'CHATGPT · LUNA', detail: 'Luna via the OpenAI API' },
];

export function isGenerationProvider(value: unknown): value is GenerationProvider {
  return value === 'openrouter' || value === 'openai';
}

export function generationProviderLabel(provider: GenerationProvider): string {
  return GENERATION_PROVIDER_OPTIONS.find((option) => option.value === provider)?.label ?? 'CLAUDE';
}
