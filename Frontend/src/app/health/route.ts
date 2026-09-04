/**
 * Liveness probe.
 *
 * Something in the dev environment health-checks `GET /health` and takes a
 * non-200 as a dead service: the dev server was being SIGTERMed (exit 143)
 * within seconds of starting, once per boot, always immediately after a single
 * `GET /health 404` in its log. The Python backend answers the same probe from
 * `backend/app/main.py` and was never killed once all session — which is what
 * identified the cause.
 *
 * It reports that the server is serving, nothing more. It deliberately does
 * not reach through to the backend or the database: a probe that fails when a
 * dependency is down would take the front end with it, and the console already
 * handles an unreachable backend by saying so on screen.
 */
export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json({ status: 'ok' });
}
