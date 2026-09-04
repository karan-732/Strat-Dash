# Strat-Dash

The Altrd Strategy Sprint console — a six-phase consulting workspace.

**This repository currently ships as a self-contained demonstration.** The
console runs entirely in the browser on seeded fixtures: no backend, no API
call, no model key. It exists to show what the sprint looks like when it has
been run, not to run one.

| | |
| --- | --- |
| `Frontend/` | Next.js 16 console. Deploys to **Vercel** on its own. |
| `backend/` | FastAPI phase agents and Turso persistence. **Not deployed in the demo build.** Kept intact for when generation is switched back on. |

## The two seeded engagements

Both are complete sprints — all six phases generated, inputs recorded,
workflow steps closed, deliverables delivered, and the questions and next
moves each phase left behind.

| | |
| --- | --- |
| **Dot & Key** — beauty and personal care D2C | Rs 412 Cr, 38.4% growth. Traced process: demand signal to dark-store availability. Rs 63 Cr value at stake. |
| **Wakefit** — sleep and home furniture D2C | Rs 1,142 Cr, 24.6% growth, three owned plants. Traced process: order promise to installation. Rs 117 Cr value at stake. |

The figures are realistic but **invented** — written to demonstrate the
console, not researched. A standing badge in the corner of every screen says
so. Nothing in them should be quoted as a finding about a real company.

## Deploying

Vercel, root directory `Frontend`, and nothing else. See `DEPLOY.md`.

## Local

```bash
cd Frontend && bun install && bun run dev
```

## Putting the backend back

The live API client is preserved at `Frontend/src/lib/backend/client.live.ts`
and has the identical export surface as the demo layer that replaced it.
Swapping the two filenames, setting `NEXT_PUBLIC_BACKEND_URL` and deploying
`backend/` is the whole of it — `render.yaml` and the Dockerfile are still
here. `DEPLOY.md` keeps those instructions.
