"""Live page reads for the company site and the peer set."""

from __future__ import annotations

import httpx

from app.config import settings


async def scrape_urls(urls: list[str], cap: int = 4, chars: int = 5000) -> list[dict[str, str]]:
    """Read pages through the reader proxy; an unreachable source is skipped."""
    cfg = settings()
    out: list[dict[str, str]] = []
    seen: set[str] = set()

    async with httpx.AsyncClient(timeout=httpx.Timeout(45.0, connect=10.0), follow_redirects=True) as http:
        for raw in urls:
            if len(out) >= cap:
                break
            url = (raw or "").strip()
            if not url or url in seen:
                continue
            seen.add(url)
            target = url if url.startswith(("http://", "https://")) else f"https://{url}"
            try:
                response = await http.get(cfg.scrape_reader_base + target)
                if response.status_code >= 400:
                    continue
                text = response.text
                if text and len(text) > 200:
                    out.append({"u": url, "text": text[:chars]})
            except Exception:  # noqa: BLE001 - an unreachable source is simply not used
                continue
    return out


def source_block(sources: list[dict[str, str]], *, outside_in: bool = True) -> str:
    """
    The block of live extracts appended to a generation prompt.

    `outside_in` says whether live reading was even attempted. On Phase 0 an
    empty list means the pages could not be read, and falling back to sector
    data is the right instruction. From Phase 1 on nothing was read because
    nothing should have been - the evidence is the client's own material - and
    telling that phase to reach for "established sector data" would send it
    looking for benchmarks when the transcript in front of it is the source.
    """
    if not sources and not outside_in:
        return (
            "\n\nNo public sources here, by design. This phase works from what the client has "
            "given the sprint - the call, the uploads, the notes and the earlier phase packs. "
            "Extract only from that material. Where it does not carry a figure, say so in "
            '"absent" rather than reaching for a sector benchmark.'
        )
    if not sources:
        return (
            "\n\nNo page could be read live. Work from what the sprint holds plus established "
            "sector data, mark every derived figure with ~ and state its basis."
        )
    body = "\n\n---\n\n".join(f"[S{i + 1}] {s['u']}\n{s['text']}" for i, s in enumerate(sources))
    return (
        "\n\nLive source extracts, scraped just now. Treat these as primary evidence, prefer their "
        "figures over anything else and cite them as [S1], [S2] in the note or basis fields:\n" + body
    )
