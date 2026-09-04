# What a phase costs, and why

Measured from `agent_runs`, not estimated. Every figure below is a real logged
call against `anthropic/claude-sonnet-5` at $2/M input and $10/M output.

## Where the money goes

| agent | in | out | $/call | model |
|---|---|---|---|---|
| pack | 5,357 | 11,451 | 0.125 | sonnet-5 |
| brain | 3,696 | 4,213 | 0.050 | haiku-4.5 |
| intake | 3,914 | 3,783 | 0.046 | haiku-4.5 |
| questions | 6,104 | 3,010 | 0.042 | haiku-4.5 |
| answers | 2,674 | 3,264 | 0.038 | haiku-4.5 |
| metrics | 1,110 | 2,334 | 0.026 | haiku-4.5 |

**Output tokens are 85–90% of the bill.** The pack spends $0.011 reading and
$0.115 writing. That matters for what is worth optimising: shaving the context
is close to pointless, and the only way to make the pack itself materially
cheaper is to make it produce less — which means a thinner deliverable. That
trade is available but it is not a free win, so it has not been taken.

## What was done

**The short agents moved to `claude-haiku-4.5`.** Intake, questions, brain,
answers, review and metrics all read a fixed shape and emit a fixed shape; they
classify and extract rather than compose. The pack, the evidence ledger under it
and the peer ranking stay on Sonnet: those are the deliverable and the facts
beneath it. Set `MODEL_FAST` to the main model to take it back if a pass starts
reading thin.

The saving is larger than the halved token price, measured on the same
engagement with the same inputs:

| agent | on sonnet-5 | on haiku-4.5 | |
|---|---|---|---|
| intake | 4,000 out · $0.0442 | 1,583 out · $0.0107 | −76% |
| brain | 3,289 out · $0.0431 | 1,904 out · $0.0115 | −73% |

Haiku answers these in roughly half the tokens as well as at half the price. The
Sonnet intake figure is also flattered: 4,000 was exactly its ceiling, so that
run was truncated and the last thing it wanted to ask was cut off. The ceiling
is now 6,000.

**The pack's ceiling went from 24k to 32k.** Phase 0 grew a twelfth section and
the pack started finishing exactly on the old ceiling — truncated. A ceiling is
not a reservation, and a truncated pack costs a whole second call to top up, so
raising it lowers the bill rather than raising it.

**The peer ranking is now counted.** Its two passes ran at the pack's token
ceiling and were logged with no usage at all and the *pack's* model name, so the
cost ledger showed this stage as free. Every per-phase figure quoted before this
was understated by roughly $0.08.

**The intake gate is cached.** It used to re-run on every phase view. Opening a
phase, navigating away and coming back cost three model calls for an answer
that could not have changed, and the console then paid a fourth to show the
same gate before generating. The verdict is now stored against a SHA-256 digest
of everything it read — the assembled context, the open questions, the brain
revision — and served from the row while that digest holds. `?refresh=true`
forces a fresh reading. Measured: three requests, two model calls, the repeat
served in 1.2s instead of 90s.

## What did not work

**Anthropic prompt caching is not available on this OpenRouter key.** The
pricing table advertises `input_cache_read` at a tenth of the input price for
these models, and the request shape is correct — a `cache_control:
{type: ephemeral}` breakpoint on a >2,048-token leading block. It was tried on
a user content block, on a system content block, and with the provider pinned
to Anthropic. Every attempt came back `cached_tokens: 0,
cache_write_tokens: 0` and full price.

The plumbing is kept: `complete(cache=…)` marks a prefix, and the pack agent
passes its context that way, so the top-up call and any parse retry would ride
the cache the moment it starts working. Today it costs nothing and saves
nothing. If it matters, the fix is to call the Anthropic API directly rather
than through OpenRouter.

**Trimming `max_tokens` saves nothing.** It is a ceiling, not a reservation —
you pay for the tokens actually produced. The generous ceilings (24k on the
pack) exist because a pack that hits the ceiling arrives truncated, which costs
a whole second call to top up. Lowering them would raise the bill, not lower it.

**`:batch` variants are half price again** and unusable here: they are
asynchronous, and a phase runs while the consultant waits.

## The floor

Measured on a cold Phase 0 against a live client site, all eight stages:

| | before | after |
|---|---|---|
| intake | 0.044 | 0.011 |
| evidence | 0.046 | 0.046 |
| pack | 0.253 | 0.253 |
| peers | not counted | ~0.08 |
| review | 0.077 | ~0.025 |
| questions | 0.040 | ~0.012 |
| brain | 0.043 | 0.012 |
| **total** | **~0.58** | **~0.44** |

About a quarter off, and honestly counted for the first time.

**The pack is now 57% of the phase and it is the thing the client sees.** It
spends $0.011 reading and $0.24 writing twelve sections of charted analysis.
The only remaining lever on it is to produce less, which means a thinner
deliverable — that trade is available but it has not been taken. A six-phase
sprint lands near **$2**.

One caveat on determinism: two runs of the gate against identical inputs
returned four needs and then two. Temperature 0 fixes the sampling, not the
model, so runs are close but not identical. The evidence ledger and the JSON
shape are what keep the pack stable, not the temperature alone.
