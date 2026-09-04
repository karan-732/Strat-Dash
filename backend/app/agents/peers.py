"""
The peer ranking agent — phase 0's deep competitive benchmark.

The brief was blunt about the bar here: a competitive view that only says "here
is the client and here are some competitors" is something anyone can get from
one web search. What a partner wants is the parameters that actually decide who
wins in this sector, weighted, with the client and named peers ranked on each,
and a verdict of the form "third overall behind A and B but leads in X".

Two passes: the first decides the parameters and names a real peer set, then
those peers' sites are read, and the second scores everyone against them.
A failure here loses the ranking, not the phase.
"""

from __future__ import annotations

from typing import Any

from app.agents import prompts
from app.agents.runtime import Usage, complete_json
from app.agents.skills import skill
from app.services import scrape


async def rank(
    *, engagement: dict[str, Any], context: str, sources: list[dict[str, str]]
) -> dict[str, Any] | None:
    """
    Rank the client against a named peer set. Returns None, and why, on failure.

    The returned dict carries `_usage` and `_model` alongside the ranking. Both
    passes here run at the pack's token ceiling, and until they were reported
    the cost ledger showed this stage as free — the pipeline pops them off
    before the ranking is stored.
    """
    spec = prompts.peer_rank()
    usage = Usage()
    model = ""
    search_sources: list[str] = []

    def track(result):
        """Fold one pass's usage into the total and remember the model."""
        nonlocal model
        usage.prompt_tokens += result.usage.prompt_tokens
        usage.output_tokens += result.usage.output_tokens
        usage.cost_usd += result.usage.cost_usd
        model = result.model
        for url in result.sources:
            if url not in search_sources:
                search_sources.append(url)
        return result.json()

    try:
        setup_prompt = (
            f"Company: {engagement['name']}\nSector: {engagement['sector']}\n"
            f"Website: {engagement.get('url') or 'not supplied'}\n"
            f"Engagement notes: {engagement.get('notes') or 'none'}\n\n"
            f"Return JSON matching exactly this shape:\n{spec['setupShape']}"
        )
        setup = track(
            await complete_json(
                system=f"{skill(0)}\n\n{spec['setupSystem']}",
                prompt=setup_prompt + scrape.source_block(sources),
                max_tokens=3000,
                web_search=True,
            )
        )

        params, peer_set = _usable(setup)

        """
        The setup pass is occasionally degenerate — it returns one peer, or a
        name carrying its own commentary ("Bharat Earth Movers... (duplicate
        check avoided)"). A ranking against one company is not a ranking, so a
        thin peer set is asked for again once before giving up.
        """
        if len(peer_set) < 3 or len(params) < 4:
            retry = track(
                await complete_json(
                    system=f"{skill(0)}\n\n{spec['setupSystem']}",
                    prompt=(
                        setup_prompt + "\n\nYour previous reply named "
                        f"{len(peer_set)} usable peer(s) and {len(params)} parameter(s). "
                        "Name at least FOUR real, separately-named companies this business is "
                        "genuinely compared against, each with its own corporate website URL, and "
                        "at least six parameters. A company name is a name only — no parentheses, "
                        "no commentary, no duplicates."
                    ),
                    max_tokens=3000,
                    web_search=True,
                )
            )
            retry_params, retry_peers = _usable(retry)
            if len(retry_peers) > len(peer_set):
                params, peer_set = retry_params or params, retry_peers
        if len(peer_set) < 2 or not params:
            _LAST_ERROR["reason"] = f"peer set too thin ({len(peer_set)} peers, {len(params)} parameters)"
            return None

        peer_sources = await scrape.scrape_urls([p.get("url", "") for p in peer_set], cap=6, chars=3500)

        score_prompt = (
            f"Client: {engagement['name']} ({engagement['sector']})\n\n"
            "Parameters that decide the winner here, with weights:\n"
            + "\n".join(
                f"- {p['name']} [{p.get('unit', 'score')} · weight {p.get('weight')}% · "
                f"{'lower is better' if p.get('betterHigh') is False else 'higher is better'}] "
                f"{p.get('why', '')}"
                for p in params
            )
            + "\n\nPeer set:\n"
            + "\n".join(
                f"- {p['name']}"
                + (f" ({p['url']})" if p.get("url") else "")
                + (f" - {p['why']}" if p.get("why") else "")
                for p in peer_set
            )
            + f"\n\nProject context:\n{context}"
            + "\n\nScore the client and every peer on every parameter above and return JSON "
            f"matching exactly this shape:\n{spec['scoreShape']}"
        )
        ranking = track(
            await complete_json(
                system=f"{skill(0)}\n\n{spec['scoreSystem']}",
                prompt=score_prompt + scrape.source_block(sources + peer_sources),
                max_tokens=24000,
            )
        )

        if not (ranking.get("rows") or []):
            return None

        ranking["params"] = params
        ranking["peerSet"] = [
            {"name": p["name"], "url": p.get("url", ""), "why": p.get("why", "")} for p in peer_set
        ]
        # `read` is the pack's existing visible/stored source list. Hosted
        # search citations are retained alongside directly scraped peer sites.
        peer_sites_read = [s["u"] for s in peer_sources]
        ranking["read"] = list(dict.fromkeys(peer_sites_read + search_sources))
        ranking["_peer_sites_read"] = peer_sites_read
        ranking["_usage"] = usage
        ranking["_model"] = model
        return ranking
    except Exception as exc:  # noqa: BLE001 - the outside-in pack still stands without it
        _LAST_ERROR["reason"] = str(exc)[:300]
        return None


def _usable(setup: dict[str, Any]) -> tuple[list[dict], list[dict]]:
    """Parameters and peers worth ranking on — junk names dropped, duplicates removed."""
    params = [p for p in (setup.get("parameters") or []) if isinstance(p, dict) and p.get("name")][:9]

    peers: list[dict] = []
    seen: set[str] = set()
    for peer in setup.get("peers") or []:
        if not isinstance(peer, dict):
            continue
        name = str(peer.get("name") or "").strip()
        # a name carrying its own commentary is the model talking to itself
        if not name or "(" in name or "..." in name or len(name) > 60:
            continue
        key = name.lower()
        if key in seen:
            continue
        seen.add(key)
        peers.append(peer)
    return params, peers[:6]


_LAST_ERROR: dict[str, str] = {}


def last_error() -> str:
    """Why the most recent ranking failed, for the run log."""
    return _LAST_ERROR.get("reason", "")
