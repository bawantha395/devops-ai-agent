# API contracts

The starter API exposes its actual OpenAPI document at /openapi.json and interactive documentation at /docs.

Current endpoints

- GET /health returns status, mode and version.
- GET /v1/capabilities describes the implementation boundaries.
- POST /v1/investigations validates question and environment, then returns 503 because the worker is not implemented.

The frontend demo does not call the investigation endpoint. Its settings page can call the API health endpoint.

Add a versioned generated OpenAPI file and generated TypeScript client when the real asynchronous job API is implemented. Keep request identity and environment authorization in the backend.

