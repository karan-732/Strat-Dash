'use client';

import {
  GENERATION_PROVIDER_OPTIONS,
  type GenerationProvider,
  type GenerationProviderInfo,
} from '@/lib/domain/generation-provider';

/**
 * Which model the next task runs on.
 *
 * Two providers reach the console: Claude through OpenRouter and Luna through
 * the OpenAI API. Both read the web, so the choice is about judgement and
 * price rather than capability, and it belongs where the consultant can see it
 * before pressing generate — not in a settings screen.
 *
 * A provider the backend has no key for is shown but cannot be picked, so the
 * absence is visible rather than mysterious. Switching mid-task is refused: a
 * phase that started on one model finishes on it.
 *
 * Lives outside `src/components` on purpose. That tree is wiped and rewritten
 * by `scripts/dc-to-jsx.mjs`, and an earlier copy of this file kept there was
 * destroyed by a regeneration. The codemod renders it through
 * `SLOT_INJECTIONS` instead.
 */
export function GenerationProviderSwitch({
  provider,
  providers,
  disabled,
  onChange,
}: {
  provider: GenerationProvider;
  providers: Record<GenerationProvider, GenerationProviderInfo> | null;
  disabled: boolean;
  onChange: (next: GenerationProvider) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Model for the next generation"
      style={{
        display: 'inline-flex',
        alignItems: 'stretch',
        border: '1px solid var(--ln20)',
        background: 'var(--card0)',
        borderRadius: '7px',
        overflow: 'hidden',
      }}
    >
      {GENERATION_PROVIDER_OPTIONS.map((option) => {
        const info = providers?.[option.value];
        const selected = option.value === provider;
        const unavailable = !!providers && !info?.configured;
        const locked = disabled || unavailable;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={locked && !selected}
            aria-pressed={selected}
            title={
              unavailable
                ? `${option.label} has no key configured on the backend`
                : disabled
                  ? 'A model task is running — it will finish on the current model'
                  : info
                    ? `${option.detail} · ${info.model}`
                    : option.detail
            }
            style={{
              padding: '6px 11px',
              border: '0',
              borderRight: option.value === GENERATION_PROVIDER_OPTIONS[0].value ? '1px solid var(--ln20)' : '0',
              background: selected ? 'var(--card3)' : 'transparent',
              color: selected ? 'var(--fg)' : unavailable ? 'var(--fg4)' : 'var(--fg3)',
              fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace",
              fontSize: '9px',
              letterSpacing: '.13em',
              fontWeight: selected ? 700 : 500,
              cursor: locked && !selected ? 'not-allowed' : 'pointer',
              textDecoration: unavailable ? 'line-through' : 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
