"""
The agent runtime: one model call, retried, with the JSON discipline the packs
depend on.

Every agent in the sprint is a system prompt plus a required JSON shape. The
request chooses either the existing Claude/OpenRouter path or the direct OpenAI
Responses API without changing the agents' input and output contracts.
"""

from __future__ import annotations

import json
import re
from collections.abc import Iterator
from contextlib import contextmanager
from contextvars import ContextVar
from dataclasses import dataclass, field
from typing import Any, Literal
from urllib.parse import urlsplit

import httpx

from app.config import settings

_TRANSIENT = re.compile(r"overload|rate.?limit|429|500|502|503|529|timeout|network|fetch", re.I)
_WAITS = (0, 4, 10, 20)

Provider = Literal["openrouter", "openai"]
_PROVIDER: ContextVar[Provider] = ContextVar("model_provider", default="openrouter")


class AgentError(RuntimeError):
    pass


def current_provider() -> Provider:
    """The provider selected for this request; OpenRouter is the safe default."""
    return _PROVIDER.get()


@contextmanager
def provider_context(provider: Provider) -> Iterator[None]:
    """Keep one provider selection across every nested agent call in a request."""
    token = _PROVIDER.set(provider)
    try:
        yield
    finally:
        _PROVIDER.reset(token)


@dataclass
class Usage:
    prompt_tokens: int = 0
    output_tokens: int = 0
    cost_usd: float = 0.0


@dataclass
class Completion:
    text: str
    model: str
    usage: Usage = field(default_factory=Usage)
    # why the model stopped, and its refusal if it gave one — an empty reply is
    # otherwise indistinguishable from a network problem
    finish_reason: str = ""
    refusal: str = ""
    # URLs used by a hosted search tool. Empty for providers/calls without one.
    sources: list[str] = field(default_factory=list)

    def json(self) -> Any:
        return parse_json(self.text)


async def complete_json(
    *,
    system: str,
    prompt: str,
    max_tokens: int = 4000,
    model: str | None = None,
    cache: str | None = None,
    web_search: bool = False,
) -> Completion:
    """
    A completion that must parse as JSON.

    Long packs are the failure case: the model runs to the token ceiling and the
    object arrives unterminated. `parse_json` repairs a truncated tail, but a
    response that is prose, empty or cut before the first brace cannot be
    repaired — so that is retried once with the instruction restated, which is
    cheaper and more reliable than failing the phase.
    """
    result = await complete(
        system=system,
        prompt=prompt,
        max_tokens=max_tokens,
        model=model,
        cache=cache,
        json_output=True,
        web_search=web_search,
    )
    try:
        result.json()
        return result
    except Exception:  # noqa: BLE001 - retried once with a correction
        pass

    retry = await complete(
        system=system,
        prompt=(
            prompt + "\n\nYour previous reply could not be parsed as JSON. Return ONLY the JSON object, "
            "starting with { and ending with }. No preamble, no explanation, no markdown fences. "
            "Keep every string short enough that the whole object completes."
        ),
        max_tokens=max_tokens,
        model=model,
        cache=cache,
        json_output=True,
        # deliberately not re-searching: the first attempt already paid for the
        # results and the retry is about the shape of the reply, not the facts
        web_search=False,
    )
    try:
        retry.json()
    except AgentError as exc:
        raise AgentError(f"{exc} [{_describe(retry)}]") from exc
    retry.usage.prompt_tokens += result.usage.prompt_tokens
    retry.usage.output_tokens += result.usage.output_tokens
    retry.usage.cost_usd += result.usage.cost_usd
    retry.sources = _unique_urls([*result.sources, *retry.sources])
    return retry


def _user_content(prompt: str, cache: str | None) -> Any:
    """
    The user message, split into a cacheable prefix and the rest when there is
    one to split. Anthropic needs roughly a thousand tokens before a cache
    breakpoint earns its keep, so a short prefix is sent inline instead.
    """
    if not cache or len(cache) < 4000:
        return (cache or "") + prompt
    blocks: list[dict[str, Any]] = [{"type": "text", "text": cache, "cache_control": {"type": "ephemeral"}}]
    # an empty text block is rejected, and the whole message may be the prefix
    if prompt:
        blocks.append({"type": "text", "text": prompt})
    return blocks


async def complete(
    *,
    system: str,
    prompt: str,
    max_tokens: int = 4000,
    model: str | None = None,
    temperature: float | None = None,
    cache: str | None = None,
    json_output: bool = False,
    web_search: bool = False,
) -> Completion:
    """
    One completion, retried while the failure looks transient.

    `cache` is a leading slab of the user message - the sprint context, the
    evidence ledger, the sources - that several calls in a phase send
    unchanged. OpenRouter receives Anthropic's explicit cache breakpoint;
    OpenAI receives the same stable prefix for automatic prompt caching.
    """
    cfg = settings()
    provider = current_provider()
    if provider == "openai":
        if not cfg.openai_api_key:
            raise AgentError("OPENAI_API_KEY is not configured")
        chosen = cfg.openai_model
    else:
        if not cfg.openrouter_api_key:
            raise AgentError("OPENROUTER_API_KEY is not configured")
        chosen = model or cfg.model

    last: Exception | None = None

    for wait in _WAITS:
        if wait:
            import asyncio

            await asyncio.sleep(wait)
        try:
            if provider == "openai":
                return await _complete_openai(
                    cfg=cfg,
                    chosen=chosen,
                    system=system,
                    prompt=prompt,
                    cache=cache,
                    max_tokens=max_tokens,
                    json_output=json_output,
                    web_search=web_search,
                )
            return await _complete_openrouter(
                cfg=cfg,
                chosen=chosen,
                system=system,
                prompt=prompt,
                cache=cache,
                max_tokens=max_tokens,
                temperature=cfg.temperature if temperature is None else temperature,
                web_search=web_search,
            )
        except Exception as exc:  # noqa: BLE001 - retried below when transient
            last = exc
            if not _TRANSIENT.search(str(exc)):
                raise
    raise AgentError(f"the model was busy after four attempts ({last})")


async def _complete_openrouter(
    *,
    cfg: Any,
    chosen: str,
    system: str,
    prompt: str,
    cache: str | None,
    max_tokens: int,
    temperature: float,
    web_search: bool = False,
) -> Completion:
    """
    The OpenRouter Chat Completions wire contract.

    Claude has no web access of its own here. Anthropic's native search tool is
    not reachable through this route - the models advertise `tools` but not
    `web_search_options` - so live reading is done with OpenRouter's own `web`
    plugin, which runs the search itself and hands the results to the model
    before it answers. It works on any model, which is why it is attached here
    rather than by switching to a search-specific model.

    Until this was wired, `web_search=True` was accepted and silently ignored
    on this path: the peer agent asked for live search and never got it.
    """
    body: dict[str, Any] = {
        "model": chosen,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": _user_content(prompt, cache)},
        ],
        "usage": {"include": True},
    }
    if web_search:
        body["plugins"] = [{"id": "web", "max_results": cfg.openrouter_web_max_results}]

    async with httpx.AsyncClient(timeout=httpx.Timeout(300.0, connect=15.0)) as http:
        response = await http.post(
            f"{cfg.openrouter_base_url}/chat/completions",
            headers={
                "Authorization": f"Bearer {cfg.openrouter_api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://altrd.internal/sprint-console",
                "X-Title": "Altrd Sprint Console",
            },
            json=body,
        )
    if response.status_code >= 400:
        raise AgentError(f"openrouter {response.status_code}: {response.text[:400]}")

    payload = response.json()
    choices = payload.get("choices") or []
    if not choices:
        raise AgentError(f"no completion returned: {json.dumps(payload)[:300]}")
    usage = payload.get("usage") or {}
    choice = choices[0]
    message = choice.get("message") or {}
    return Completion(
        text=message.get("content") or "",
        model=f"openrouter:{payload.get('model', chosen)}",
        finish_reason=str(choice.get("finish_reason") or ""),
        refusal=str(message.get("refusal") or ""),
        usage=Usage(
            prompt_tokens=_as_int(usage.get("prompt_tokens")),
            output_tokens=_as_int(usage.get("completion_tokens")),
            cost_usd=float(usage.get("cost", 0.0) or 0.0),
        ),
    )


async def _complete_openai(
    *,
    cfg: Any,
    chosen: str,
    system: str,
    prompt: str,
    cache: str | None,
    max_tokens: int,
    json_output: bool,
    web_search: bool,
) -> Completion:
    """A direct OpenAI Responses API call, normalized to the shared result."""
    body: dict[str, Any] = {
        "model": chosen,
        "instructions": system,
        "input": (cache or "") + prompt,
        "max_output_tokens": max_tokens,
        "store": False,
    }
    if cfg.openai_reasoning_effort:
        body["reasoning"] = {"effort": cfg.openai_reasoning_effort}
    if json_output:
        body["text"] = {"format": {"type": "json_object"}}
    if web_search:
        # One search is enough to seed the existing peer discovery + scrape
        # path, and caps the hosted-tool fee for a single model pass.
        body["tools"] = [{"type": "web_search", "search_context_size": "low"}]
        body["max_tool_calls"] = 1
        body["include"] = ["web_search_call.action.sources"]

    async with httpx.AsyncClient(timeout=httpx.Timeout(300.0, connect=15.0)) as http:
        response = await http.post(
            f"{cfg.openai_base_url}/responses",
            headers={
                "Authorization": f"Bearer {cfg.openai_api_key}",
                "Content-Type": "application/json",
            },
            json=body,
        )
    if response.status_code >= 400:
        raise AgentError(f"openai {response.status_code}: {response.text[:400]}")

    payload = response.json()
    text = _openai_output_text(payload)
    if not text:
        raise AgentError(f"no response text returned: {_openai_status(payload)}")

    usage = payload.get("usage") or {}
    prompt_tokens = _as_int(usage.get("input_tokens"))
    output_tokens = _as_int(usage.get("output_tokens"))
    input_details = usage.get("input_tokens_details") or {}
    cached_tokens = _as_int(input_details.get("cached_tokens"))
    cache_write_tokens = _as_int(input_details.get("cache_write_tokens"))
    search_calls = sum(1 for item in payload.get("output") or [] if item.get("type") == "web_search_call")
    return Completion(
        text=text,
        model=f"openai:{payload.get('model', chosen)}",
        finish_reason=_openai_status(payload),
        refusal=_openai_refusal(payload),
        sources=_openai_sources(payload),
        usage=Usage(
            prompt_tokens=prompt_tokens,
            output_tokens=output_tokens,
            cost_usd=_openai_cost(
                cfg,
                prompt_tokens=prompt_tokens,
                cached_tokens=cached_tokens,
                cache_write_tokens=cache_write_tokens,
                output_tokens=output_tokens,
                search_calls=search_calls,
            ),
        ),
    )


def _openai_output_text(payload: dict[str, Any]) -> str:
    """Read the Responses API output without depending on an SDK helper."""
    if payload.get("output_text"):
        return str(payload["output_text"])
    chunks: list[str] = []
    for item in payload.get("output") or []:
        if item.get("type") != "message":
            continue
        for part in item.get("content") or []:
            if part.get("type") == "output_text" and part.get("text"):
                chunks.append(str(part["text"]))
    return "\n".join(chunks)


def _openai_refusal(payload: dict[str, Any]) -> str:
    refusals: list[str] = []
    for item in payload.get("output") or []:
        if item.get("type") != "message":
            continue
        for part in item.get("content") or []:
            if part.get("type") == "refusal" and part.get("refusal"):
                refusals.append(str(part["refusal"]))
    return "\n".join(refusals)


def _openai_sources(payload: dict[str, Any]) -> list[str]:
    """Collect safe source URLs from search actions and output annotations."""
    urls: list[str] = []
    for item in payload.get("output") or []:
        if item.get("type") == "web_search_call":
            action = item.get("action") or {}
            for source in action.get("sources") or []:
                if isinstance(source, dict):
                    urls.append(str(source.get("url") or ""))
        if item.get("type") != "message":
            continue
        for part in item.get("content") or []:
            for annotation in part.get("annotations") or []:
                if isinstance(annotation, dict) and annotation.get("type") == "url_citation":
                    urls.append(str(annotation.get("url") or ""))
    return _unique_urls(urls)


def _unique_urls(urls: list[str]) -> list[str]:
    """De-duplicate valid HTTP(S) URLs without ever rendering unsafe schemes."""
    out: list[str] = []
    seen: set[str] = set()
    for raw in urls:
        url = str(raw or "").strip()
        try:
            parsed = urlsplit(url)
        except ValueError:
            continue
        if parsed.scheme not in {"http", "https"} or not parsed.netloc or url in seen:
            continue
        seen.add(url)
        out.append(url)
    return out


def _openai_status(payload: dict[str, Any]) -> str:
    incomplete = payload.get("incomplete_details") or {}
    return str(incomplete.get("reason") or payload.get("status") or "unknown")


def _openai_cost(
    cfg: Any,
    *,
    prompt_tokens: int,
    cached_tokens: int,
    cache_write_tokens: int,
    output_tokens: int,
    search_calls: int,
) -> float:
    """Estimate direct OpenAI spend from the published model/tool rate card."""
    cached = min(max(cached_tokens, 0), max(prompt_tokens, 0))
    cache_write = min(max(cache_write_tokens, 0), max(prompt_tokens - cached, 0))
    uncached = max(prompt_tokens - cached - cache_write, 0)
    input_multiplier = 2.0 if prompt_tokens > 272_000 else 1.0
    output_multiplier = 1.5 if prompt_tokens > 272_000 else 1.0
    token_cost = (
        uncached * cfg.openai_input_cost_per_million * input_multiplier
        + cache_write * cfg.openai_input_cost_per_million * 1.25 * input_multiplier
        + cached * cfg.openai_cached_input_cost_per_million * input_multiplier
        + output_tokens * cfg.openai_output_cost_per_million * output_multiplier
    ) / 1_000_000
    return token_cost + search_calls * cfg.openai_web_search_cost_per_call


def _as_int(value: Any) -> int:
    try:
        return int(value or 0)
    except (TypeError, ValueError):
        return 0


# ------------------------------------------------------------------ JSON


def parse_json(raw: str) -> Any:
    """
    Find the JSON object in a completion and parse it.

    A long pack can arrive truncated, so a failed parse is repaired rather than
    thrown away: unterminated strings are closed, a dangling key is dropped and
    every open brace is closed in order.
    """
    text = (raw or "").strip()
    fence = re.search(r"```(?:json)?\s*(.+?)```", text, re.S)
    if fence:
        text = fence.group(1).strip()

    start = text.find("{")
    if start < 0:
        head = text[:200].replace("\n", " ") or "(empty reply)"
        raise AgentError(f"the model did not return JSON — it replied: {head}")

    end = text.rfind("}")
    if end > start:
        try:
            return json.loads(text[start : end + 1])
        except json.JSONDecodeError:
            pass

    body = text[start:]
    try:
        return json.loads(repair_json(body))
    except json.JSONDecodeError:
        pass

    """
    The tail was cut somewhere the closer cannot fix — mid-key, or inside a
    number. Walk back to the last point where an element actually finished and
    repair from there: a pack missing its final row is worth far more than no
    pack at all, and the caller checks for missing sections anyway.
    """
    for cut in range(len(body) - 1, max(len(body) - 20000, 0), -1):
        if body[cut] not in "}]":
            continue
        try:
            return json.loads(repair_json(body[: cut + 1]))
        except json.JSONDecodeError:
            continue
    raise AgentError("the model returned JSON that could not be repaired")


def _describe(result: Completion) -> str:
    """Why a reply was unusable — an empty one is otherwise a mystery."""
    bits = [f"finish_reason={result.finish_reason or 'unknown'}"]
    if result.refusal:
        bits.append(f"refusal={result.refusal[:160]}")
    bits.append(f"output_tokens={result.usage.output_tokens}")
    return ", ".join(bits)


def repair_json(source: str) -> str:
    out: list[str] = []
    stack: list[str] = []
    in_string = False
    escaped = False

    for char in source:
        if in_string:
            out.append(char)
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
            continue
        if char == '"':
            in_string = True
            out.append(char)
            continue
        if char in "{[":
            stack.append("}" if char == "{" else "]")
            out.append(char)
            continue
        if char in "}]":
            if stack:
                stack.pop()
            out.append(char)
            continue
        out.append(char)

    if in_string:
        out.append('"')
    text = "".join(out)

    for _ in range(4):
        text = text.rstrip()
        if text.endswith((":", ",")):
            text = re.sub(r',?\s*"[^"]*"\s*:$', "", text).rstrip(",")
            continue
        break

    while stack:
        text += stack.pop()
    return re.sub(r",(\s*[}\]])", r"\1", text)
