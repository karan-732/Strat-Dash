# Strat-Dash

The Altrd Strategy Sprint console — a six-phase consulting workspace.

| | |
| --- | --- |
| `Frontend/` | Next.js 16 console. All client components, no API routes. → **Vercel** |
| `backend/` | FastAPI phase agents, the sprint brain, Turso persistence. → **Render** |
| Turso | Managed libSQL. Already hosted; nothing to deploy. |

The browser talks to the Python API directly through `NEXT_PUBLIC_BACKEND_URL`.
Nothing generative runs in Next.js, so no model key ever reaches the client.

## Deploying

See `DEPLOY.md`. Backend first — the frontend inlines the API URL at build time.

## Local

```bash
cd backend  && uv sync && uv run uvicorn app.main:app --reload --port 8000
cd Frontend && bun install && bun run dev
```
