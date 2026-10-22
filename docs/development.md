# Development

## Requirements

- Node.js 24 and npm.
- Python 3.12 or later only for the API scaffold.
- Docker only for the optional Compose setup.

## Frontend

From the repository root:

    npm ci
    npm run dev

Open http://localhost:4173.

The frontend uses React, TypeScript, Vite, React Router and Lucide. The original Nunito variable font is served locally with its OFL license. White cards, navy controls and soft accents match the portfolio, while a graphite grid gives this workspace its own background.

Meaningful checks:

    npm run typecheck
    npm test
    npm run build

npm run check runs all three in order. Build output is apps/web/dist. Hash routing makes direct static navigation portable.

The settings page checks /api/health. Vite forwards /api to http://127.0.0.1:8000. Set VITE_API_BASE_URL only to a nonsecret public API base path if needed.

## API

Follow services/api/README.md. Run it in a second terminal. The frontend remains a local demo even if the API health check succeeds.

## Docker

From the repository root:

    docker compose -f deploy/compose.yaml up --build

Open http://localhost:8080. Nginx proxies /api to the API container. This compose file runs the web application and API scaffold only.

    docker compose -f deploy/compose.yaml down

Container builds should be tested on your machine before relying on this optional setup.

## Local session data

Investigations, uploads and decisions live in browser memory and reset on refresh. Only the selected environment is stored in localStorage. No documents are uploaded or indexed by a model.

Use synthetic runbooks and sample logs. The frontend does not request AWS keys, GitHub tokens or cluster credentials.

