# Deploying

The demo build is a single Vercel project. There is nothing else to stand up.

## Vercel

Import the repository, then set **Root Directory: `Frontend`**. Framework,
build command and Node version are detected from `package.json` and `bun.lock`.

No environment variables are required. The console serves the two seeded
engagements from `Frontend/src/features/console/fixtures` and holds edits in
`localStorage`, per browser.

That is the whole deployment.

## What the build actually contains

Verified against a production build driven in Chrome:

- Zero requests to any API or data origin. The only external requests are the
  Google Fonts stylesheet and its two woff2 files, from `layout.tsx`.
- No model key, no database credential, no `NEXT_PUBLIC_BACKEND_URL`.
- 7 static routes, 2 server-rendered engagement routes, 1 route handler.

## Restoring the live backend

The demo replaced one module. Everything else — the store, the mappers and all
84 ported components — is untouched.

1. Swap `Frontend/src/lib/backend/client.ts` with `client.live.ts`.
2. Restore the generation island (`git log --diff-filter=D -- 'Frontend/src/lib/ai/*'`).
3. Deploy `backend/` — `render.yaml` and `backend/Dockerfile` are still in the
   repo. Render's free tier handles the minutes-long NDJSON stream; Cloud Run
   is the better option if a card on file is acceptable.
4. Set `NEXT_PUBLIC_BACKEND_URL` on Vercel and `ALLOWED_ORIGINS` on the backend.

Note that the live backend has **no authentication** and a full six-phase run
costs several dollars of OpenRouter credit. Use a key with a hard credit cap.
