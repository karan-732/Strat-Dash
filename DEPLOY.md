# Deploying

Backend goes up first: the console inlines `NEXT_PUBLIC_BACKEND_URL` at build
time, so it cannot be pointed at the API after the fact without a rebuild.

## Why the split

`POST /api/engagements/{id}/phases/{n}/generate` streams NDJSON for **minutes** —
eight stages, each one a model call. That does not fit any serverless free tier
(Vercel functions, Netlify Functions, Cloudflare Workers all cap out far below).
It needs a long-lived process, which is Render. Vercel only ever serves the
console's page shells, so its limits never come into play.

## 1. Backend → Render

New → Blueprint → this repo. `render.yaml` sets everything except the secrets.

Fill these in the dashboard (values are in your local `backend/.env`):

| Variable | |
| --- | --- |
| `TURSO_DATABASE_URL` | `libsql://…` |
| `TURSO_AUTH_TOKEN` | |
| `OPENROUTER_API_KEY` | use a key with a **hard credit cap** — see Cost below |
| `OPENAI_API_KEY` | optional; only used when `provider=openai` |
| `ALLOWED_ORIGINS` | fill after step 2, then redeploy |

Migrations apply automatically on boot via the FastAPI lifespan hook.
Check `https://<service>.onrender.com/health` and `/docs`.

## 2. Frontend → Vercel

Import the repo, then set **Root Directory: `Frontend`**. Framework and build
command are detected from `package.json`.

| Variable | |
| --- | --- |
| `NEXT_PUBLIC_BACKEND_URL` | `https://<service>.onrender.com` |
| `NEXT_PUBLIC_GENERATION_MODEL` | `anthropic/claude-sonnet-5` |

## 3. Close the loop

Set `ALLOWED_ORIGINS` on Render to the Vercel production URL and redeploy the
backend. Preview deployments get generated subdomains that will not match —
add them explicitly if you need previews to reach the API.

## Known limits of the free tiers

**Render spins down after 15 minutes idle**, ~50s to wake. The first "generate"
of the day stalls. A `/health` ping every 10 minutes keeps it warm and costs
~744 of the 750 free instance-hours a month — so only one free service.

**512 MB RAM.** Fine for FastAPI, but a large `.xlsx` answer upload parsed by
openpyxl alongside scraped pages is the thing most likely to push it over.

**Vercel's Hobby plan forbids commercial use.** If this is billed client work,
it needs Pro. Netlify's free tier permits commercial use if that matters more
than the DX.

## Before this is genuinely public

**There is no authentication on the API.** No dependency, no key check, no
login. CORS restricts browsers, not `curl` — anyone with the URL can start a
generation run.

Two mitigations, in order of how much they buy you:

1. A dedicated OpenRouter key with a hard credit cap. Bounds the damage.
2. A shared-password gate that issues a signed token the console holds. A
   secret baked into the frontend bundle is not a secret — it must be exchanged
   for a token server-side.

## Cost

Every model call is written to `agent_runs` with tokens and cost;
`GET /api/engagements/{id}` returns the running total. A full six-phase run is
several dollars. See `Frontend/docs/COST.md`.
