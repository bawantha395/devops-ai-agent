# API service

Implemented: health, capability reporting and a clear 503 response for the unimplemented agent endpoint.

Run from the repository root with Python 3.12 or later:

    python -m venv .venv
    source .venv/bin/activate
    python -m pip install -e services/api
    uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

On Windows, activate .venv\\Scripts\\activate instead.

Open http://localhost:8000/docs for the generated API contract.

This is a local development scaffold. Authentication, persistence, authorization, ingestion and model/tool access are not implemented. Dependency ranges are development inputs; introduce a reviewed Python lockfile before deployment.

