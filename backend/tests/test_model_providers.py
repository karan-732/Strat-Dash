"""Zero-I/O tests for request-scoped model-provider selection."""

from __future__ import annotations

import json
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from app.agents import evidence as evidence_agent
from app.agents import peers as peer_agent
from app.agents import runtime
from app.api import routes
from app.services import pipeline


def _config(**overrides: object) -> SimpleNamespace:
    values: dict[str, object] = {
        "openrouter_api_key": "test-openrouter-key",
        "openrouter_base_url": "https://openrouter.test/v1",
        "model": "anthropic/test-main",
        "model_fast": "anthropic/test-fast",
        "temperature": 0.0,
        "openai_api_key": "test-openai-key",
        "openai_base_url": "https://openai.test/v1",
        "openai_model": "gpt-5.6-luna",
        "openai_reasoning_effort": "low",
        "openai_input_cost_per_million": 0.20,
        "openai_cached_input_cost_per_million": 0.02,
        "openai_output_cost_per_million": 1.20,
        "openai_web_search_cost_per_call": 0.01,
    }
    values.update(overrides)
    return SimpleNamespace(**values)


class _Response:
    status_code = 200
    text = ""

    def __init__(self, payload: dict[str, object]) -> None:
        self._payload = payload

    def json(self) -> dict[str, object]:
        return self._payload


class _Client:
    calls: list[dict[str, object]] = []
    response: _Response

    def __init__(self, *args: object, **kwargs: object) -> None:
        pass

    async def __aenter__(self) -> _Client:
        return self

    async def __aexit__(self, *args: object) -> None:
        return None

    async def post(self, url: str, **kwargs: object) -> _Response:
        self.calls.append({"url": url, **kwargs})
        return self.response


@pytest.fixture(autouse=True)
def reset_provider() -> None:
    """A failed test must not leak its ContextVar selection into another."""
    with runtime.provider_context("openrouter"):
        yield


async def test_openrouter_remains_the_default_wire_contract(monkeypatch: pytest.MonkeyPatch) -> None:
    _Client.calls = []
    _Client.response = _Response(
        {
            "model": "anthropic/test-fast",
            "choices": [{"finish_reason": "stop", "message": {"content": '{"ready":true}', "refusal": ""}}],
            "usage": {"prompt_tokens": 120, "completion_tokens": 30, "cost": 0.0042},
        }
    )
    monkeypatch.setattr(runtime, "settings", lambda: _config())
    monkeypatch.setattr(runtime.httpx, "AsyncClient", _Client)

    result = await runtime.complete_json(
        system="system",
        prompt="prompt",
        model="anthropic/test-fast",
        cache="prefix:",
        max_tokens=900,
    )

    assert result.json() == {"ready": True}
    assert result.model == "openrouter:anthropic/test-fast"
    assert result.usage == runtime.Usage(prompt_tokens=120, output_tokens=30, cost_usd=0.0042)
    assert len(_Client.calls) == 1
    call = _Client.calls[0]
    assert call["url"] == "https://openrouter.test/v1/chat/completions"
    assert call["json"] == {
        "model": "anthropic/test-fast",
        "max_tokens": 900,
        "temperature": 0.0,
        "messages": [
            {"role": "system", "content": "system"},
            {"role": "user", "content": "prefix:prompt"},
        ],
        "usage": {"include": True},
    }


async def test_openai_uses_responses_json_and_costs_web_search(monkeypatch: pytest.MonkeyPatch) -> None:
    _Client.calls = []
    _Client.response = _Response(
        {
            "model": "gpt-5.6-luna-2026-08-01",
            "status": "completed",
            "output": [
                {
                    "type": "web_search_call",
                    "id": "search-1",
                    "status": "completed",
                    "action": {
                        "type": "search",
                        "sources": [
                            {"type": "url_citation", "url": "https://source.example/report"},
                            {"type": "url_citation", "url": "javascript:alert(1)"},
                        ],
                    },
                },
                {
                    "type": "message",
                    "content": [
                        {
                            "type": "output_text",
                            "text": '{"peers":["A","B"]}',
                            "annotations": [
                                {
                                    "type": "url_citation",
                                    "url": "https://source.example/report",
                                },
                                {
                                    "type": "url_citation",
                                    "url": "https://peer.example/about",
                                },
                            ],
                        }
                    ],
                },
            ],
            "usage": {
                "input_tokens": 1000,
                "input_tokens_details": {"cached_tokens": 100, "cache_write_tokens": 200},
                "output_tokens": 500,
            },
        }
    )
    monkeypatch.setattr(runtime, "settings", lambda: _config())
    monkeypatch.setattr(runtime.httpx, "AsyncClient", _Client)

    with runtime.provider_context("openai"):
        result = await runtime.complete_json(
            system="system",
            prompt="prompt",
            model="anthropic/must-not-leak-to-openai",
            cache="prefix:",
            max_tokens=2400,
            web_search=True,
        )

    assert runtime.current_provider() == "openrouter"
    assert result.json() == {"peers": ["A", "B"]}
    assert result.model == "openai:gpt-5.6-luna-2026-08-01"
    assert result.usage.prompt_tokens == 1000
    assert result.usage.output_tokens == 500
    assert result.usage.cost_usd == pytest.approx(0.010792)
    assert result.sources == ["https://source.example/report", "https://peer.example/about"]
    assert len(_Client.calls) == 1
    call = _Client.calls[0]
    assert call["url"] == "https://openai.test/v1/responses"
    assert call["json"] == {
        "model": "gpt-5.6-luna",
        "instructions": "system",
        "input": "prefix:prompt",
        "max_output_tokens": 2400,
        "store": False,
        "reasoning": {"effort": "low"},
        "text": {"format": {"type": "json_object"}},
        "tools": [{"type": "web_search", "search_context_size": "low"}],
        "max_tool_calls": 1,
        "include": ["web_search_call.action.sources"],
    }


async def test_json_retry_preserves_both_attempts_usage_and_sources(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    replies = iter(
        [
            runtime.Completion(
                text="not json",
                model="openai:gpt-5.6-luna",
                usage=runtime.Usage(prompt_tokens=100, output_tokens=20, cost_usd=0.001),
                sources=["https://first.example/source"],
            ),
            runtime.Completion(
                text='{"ready":true}',
                model="openai:gpt-5.6-luna",
                usage=runtime.Usage(prompt_tokens=110, output_tokens=10, cost_usd=0.002),
                sources=["https://first.example/source", "https://second.example/source"],
            ),
        ]
    )

    async def fake_complete(**kwargs: object) -> runtime.Completion:
        return next(replies)

    monkeypatch.setattr(runtime, "complete", fake_complete)

    result = await runtime.complete_json(system="system", prompt="prompt")

    assert result.json() == {"ready": True}
    assert result.usage == runtime.Usage(prompt_tokens=210, output_tokens=30, cost_usd=0.003)
    assert result.sources == ["https://first.example/source", "https://second.example/source"]


async def test_openai_missing_key_fails_before_http(monkeypatch: pytest.MonkeyPatch) -> None:
    def unexpected_client(*args: object, **kwargs: object) -> None:
        raise AssertionError("missing configuration must not attempt network I/O")

    monkeypatch.setattr(runtime, "settings", lambda: _config(openai_api_key=""))
    monkeypatch.setattr(runtime.httpx, "AsyncClient", unexpected_client)

    with runtime.provider_context("openai"), pytest.raises(runtime.AgentError, match="OPENAI_API_KEY"):
        await runtime.complete(system="system", prompt="prompt")


def test_intake_cache_fingerprint_is_provider_specific() -> None:
    with runtime.provider_context("openrouter"):
        openrouter = pipeline._intake_fingerprint("context", [], {"version": 1})
    with runtime.provider_context("openai"):
        openai = pipeline._intake_fingerprint("context", [], {"version": 1})

    assert openrouter != openai


async def test_provider_metadata_contains_no_credentials(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(routes, "settings", lambda: _config(openai_api_key="", openrouter_api_key="set"))

    result = await routes.providers()

    assert result == {
        "default": "openrouter",
        "providers": {
            "openrouter": {
                "configured": True,
                "label": "CLAUDE",
                "model": "anthropic/test-main",
                "modelFast": "anthropic/test-fast",
                # Claude reads live too, through OpenRouter's web plugin
                "webSearch": True,
            },
            "openai": {
                "configured": False,
                "label": "CHATGPT · LUNA",
                "model": "gpt-5.6-luna",
                "webSearch": True,
            },
        },
    }
    assert "key" not in json.dumps(result).lower()


async def test_intake_provider_scope_is_reset(monkeypatch: pytest.MonkeyPatch) -> None:
    seen: list[runtime.Provider] = []

    async def fake_unlocked(engagement_id: str, phase: int) -> tuple[bool, str]:
        return True, ""

    async def fake_intake(engagement_id: str, phase: int, *, refresh: bool) -> dict[str, object]:
        seen.append(runtime.current_provider())
        return {"usage": {}, "canRun": True}

    monkeypatch.setattr(routes.pipeline, "phase_unlocked", fake_unlocked)
    monkeypatch.setattr(routes.pipeline, "run_intake", fake_intake)

    result = await routes.phase_intake("engagement-1", 0, provider="openai")

    assert result == {"canRun": True}
    assert seen == ["openai"]
    assert runtime.current_provider() == "openrouter"


async def test_stream_keeps_provider_for_the_full_generator(monkeypatch: pytest.MonkeyPatch) -> None:
    seen: list[runtime.Provider] = []

    async def fake_run_phase(engagement_id: str, phase: int, *, force: bool):
        seen.append(runtime.current_provider())
        yield {"type": "stage", "stage": 0}
        seen.append(runtime.current_provider())
        yield {"type": "done"}

    monkeypatch.setattr(routes.pipeline, "run_phase", fake_run_phase)

    response = await routes.generate_phase("engagement-1", 0, provider="openai")
    assert runtime.current_provider() == "openrouter"
    chunks = [chunk async for chunk in response.body_iterator]

    assert chunks == ['{"type": "stage", "stage": 0}\n', '{"type": "done"}\n']
    assert seen == ["openai", "openai"]
    assert runtime.current_provider() == "openrouter"


async def test_success_metrics_selects_provider_from_json_body(monkeypatch: pytest.MonkeyPatch) -> None:
    seen: list[runtime.Provider] = []

    async def fake_extract(**kwargs: object) -> dict[str, object]:
        seen.append(runtime.current_provider())
        return {
            "brief": "",
            "scope_read": "department",
            "metrics": [],
            "missing": [],
            "model": "openai:gpt-5.6-luna",
            "usage": runtime.Usage(),
        }

    monkeypatch.setattr(
        routes.repo,
        "get_engagement",
        AsyncMock(return_value={"id": "engagement-1", "name": "Example", "sector": "Industry"}),
    )
    save_metrics = AsyncMock()
    log_run = AsyncMock()
    monkeypatch.setattr(routes.repo, "save_success_metrics", save_metrics)
    monkeypatch.setattr(routes.repo, "log_run", log_run)
    monkeypatch.setattr(routes.metrics_agent, "extract", fake_extract)

    result = await routes.set_success_metrics(
        "engagement-1", routes.MetricsRequest(material="proposal", provider="openai")
    )

    assert result["metrics"] == []
    assert seen == ["openai"]
    assert runtime.current_provider() == "openrouter"
    save_metrics.assert_awaited_once_with("engagement-1", [])
    log_run.assert_awaited_once()


async def test_typed_answers_selects_provider_from_json_body(monkeypatch: pytest.MonkeyPatch) -> None:
    seen: list[runtime.Provider] = []

    async def fake_ingest(**kwargs: object) -> dict[str, bool]:
        seen.append(runtime.current_provider())
        return {"ok": True}

    filed: list[dict[str, object]] = []

    async def fake_add_file(**kwargs: object) -> str:
        filed.append(kwargs)
        return "file-1"

    monkeypatch.setattr(routes.ingest, "ingest_answers", fake_ingest)
    monkeypatch.setattr(routes.repo, "add_file", fake_add_file)

    result = await routes.post_answers(
        "engagement-1",
        routes.AnswerText(material="client answer", phase=1, provider="openai"),
    )

    assert result == {"fileId": "file-1", "ok": True}
    assert seen == ["openai"]
    assert runtime.current_provider() == "openrouter"

    """
    Pasted answers are filed like an uploaded sheet. The typed path used to
    drop the material entirely, so a pasted transcript closed questions and
    left no record of the words that closed them.
    """
    assert len(filed) == 1
    assert filed[0]["kind"] == "answers"
    assert filed[0]["phase"] == 1
    assert filed[0]["text"] == "client answer"


async def test_peer_discovery_searches_live_but_scoring_does_not(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    calls: list[dict[str, object]] = []
    replies = iter(
        [
            {
                "parameters": [
                    {"name": f"parameter-{i}", "weight": 25, "betterHigh": True} for i in range(4)
                ],
                "peers": [{"name": f"Peer {i}", "url": f"https://peer-{i}.invalid"} for i in range(3)],
            },
            {"rows": [{"company": "Example Client", "scores": []}]},
        ]
    )

    async def fake_complete_json(**kwargs: object) -> runtime.Completion:
        calls.append(kwargs)
        sources = ["https://search.example/peer-evidence"] if len(calls) == 1 else []
        return runtime.Completion(
            text=json.dumps(next(replies)),
            model="openai:gpt-5.6-luna",
            usage=runtime.Usage(),
            sources=sources,
        )

    async def fake_scrape(*args: object, **kwargs: object) -> list[dict[str, str]]:
        return []

    monkeypatch.setattr(peer_agent, "complete_json", fake_complete_json)
    monkeypatch.setattr(peer_agent.scrape, "scrape_urls", fake_scrape)

    ranking = await peer_agent.rank(
        engagement={"name": "Example Client", "sector": "Industry", "url": "", "notes": ""},
        context="phase context",
        sources=[],
    )

    assert ranking is not None
    assert calls[0]["web_search"] is True
    assert "web_search" not in calls[1]
    assert ranking["read"] == ["https://search.example/peer-evidence"]


async def test_only_phase_zero_pays_for_a_live_search(monkeypatch: pytest.MonkeyPatch) -> None:
    """
    The outside-in view works from the public record; every phase after it works
    from the client's own material. Searching the open web for a client's
    internal figures costs about $0.09 and 35,000 injected tokens to find
    nothing, and this used to be hard-coded on for all six phases.
    """
    asked: list[bool] = []

    async def fake_complete_json(**kwargs: object) -> runtime.Completion:
        asked.append(bool(kwargs.get("web_search")))
        return runtime.Completion(
            text=json.dumps({"facts": [], "absent": []}),
            model="openrouter:anthropic/test-main",
            usage=runtime.Usage(),
        )

    monkeypatch.setattr(evidence_agent, "complete_json", fake_complete_json)

    engagement = {"name": "Example Client", "sector": "Industry"}
    for phase in range(6):
        await evidence_agent.extract(
            engagement=engagement,
            phase=phase,
            sources_block="no page could be read",
            held="context",
            web_search=(phase == 0),
        )

    assert asked == [True, False, False, False, False, False]


async def test_a_json_retry_does_not_buy_a_second_search(monkeypatch: pytest.MonkeyPatch) -> None:
    """
    The retry corrects the shape of a reply, not the facts in it. Forwarding the
    flag meant an unparseable answer was charged for twice.
    """
    searched: list[bool] = []
    replies = iter(["not json at all", json.dumps({"ok": True})])

    async def fake_complete(**kwargs: object) -> runtime.Completion:
        searched.append(bool(kwargs.get("web_search")))
        return runtime.Completion(
            text=next(replies), model="openrouter:anthropic/test-main", usage=runtime.Usage()
        )

    monkeypatch.setattr(runtime, "complete", fake_complete)

    result = await runtime.complete_json(system="s", prompt="p", web_search=True)

    assert result.json() == {"ok": True}
    assert searched == [True, False]
