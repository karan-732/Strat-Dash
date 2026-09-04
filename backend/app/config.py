"""Runtime configuration, read from the environment."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Turso / libSQL. The HTTP URL is derived from the libsql:// one.
    turso_database_url: str = ""
    turso_auth_token: str = ""

    # OpenRouter. The sprint runs on Claude; the router is how we reach it.
    openrouter_api_key: str = ""
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    model: str = "anthropic/claude-sonnet-5"
    """
    The model for the work the client sees.

    The output pack, the evidence ledger it is written from and the peer
    ranking stay here. These are the deliverable and the facts under it, so
    they are not the place to save money.
    """

    model_fast: str = "anthropic/claude-haiku-4.5"
    """
    The model for the short, structured passes around the pack.

    The intake gate, the questions, the answer mapping, the review and the
    running brain all read a fixed shape and emit a fixed shape - they classify
    and extract rather than compose. Haiku is half the price of Sonnet per
    token in both directions and this is the kind of work it is for. Point this
    at the main model to take it back if a pass starts reading thin.
    """

    openrouter_web_max_results: int = 3
    """
    How many live search results the web plugin returns per call.

    Capped low, and deliberately. The plugin does not just charge a search
    fee - it injects the results into the prompt, and five results measured
    35,000 input tokens on a single question, about $0.09 a call. Three is
    enough to find a peer set and its reported figures without paying to read
    the whole sector.
    """

    # Direct OpenAI Responses API. OpenRouter remains the default provider;
    # these settings are used only when a request explicitly selects OpenAI.
    openai_api_key: str = ""
    openai_base_url: str = "https://api.openai.com/v1"
    openai_model: str = "gpt-5.6-luna"
    openai_reasoning_effort: str = "low"

    # The Responses API reports tokens but not a dollar total. Keep the rate
    # card configurable so agent_runs can still carry a useful cost estimate
    # if the selected OpenAI model or its pricing changes.
    openai_input_cost_per_million: float = 0.20
    openai_cached_input_cost_per_million: float = 0.02
    openai_output_cost_per_million: float = 1.20
    openai_web_search_cost_per_call: float = 0.01

    """
    Sampling temperature for the OpenRouter path.

    Zero, deliberately. The same engagement generated twice should not read
    differently: the phase packs are the firm's output and a partner comparing
    two runs of the same client should see the same conclusions. Determinism
    costs nothing here because the structure is fixed by the JSON shape and the
    prose is rendered by the console, not invented by the model.
    """
    temperature: float = 0.0

    # Live page reads for company and peer research.
    scrape_reader_base: str = "https://r.jina.ai/"

    # Where the console is served from, for CORS.
    allowed_origins: str = "http://localhost:3000,http://localhost:3001,http://localhost:3002"

    @property
    def turso_http_url(self) -> str:
        url = self.turso_database_url.strip()
        if url.startswith("libsql://"):
            url = "https://" + url[len("libsql://") :]
        return url.rstrip("/")

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


@lru_cache
def settings() -> Settings:
    return Settings()
