# Portable image for the sprint backend. Works on Cloud Run, Koyeb, Fly or
# Render — anywhere that runs a container and honours $PORT.
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Dependencies first, so a code change does not reinstall them.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

# Cloud Run sets $PORT (8080); Render sets its own. Default for local runs.
ENV PORT=8080
EXPOSE 8080

# One worker: the phase pipeline is I/O-bound on model calls, and a second
# worker would double memory on a 512 MB instance for no throughput gain.
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --workers 1
