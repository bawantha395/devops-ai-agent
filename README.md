# OpsPilot · DevOps AI Assistant on AWS

A production engineering learning project combining agentic RAG, operational evidence and reviewed decisions.

This is the initial repository and frontend milestone. The interface uses a portfolio's Nunito typography, navy controls and white cards on a distinct graphite background.

## Start the frontend

Install Node.js 24. Extract this repository and run these commands inside devops-ai-agent:

    npm ci
    npm run dev

Open http://localhost:4173.

Try “Diagnose a crashing pod”, submit the question and follow its sample evidence trail. Open a cited runbook, search Knowledge Base, inspect tool scopes and record a simulated change review.

## What works now

| Area | State |
| --- | --- |
| Dashboard and navigation | Implemented |
| Kubernetes, pipeline and Terraform demo scenarios | Implemented with labelled sample evidence |
| Knowledge search and runbook viewer | Implemented in the browser |
| Local Markdown and text document preview | Implemented without server upload or embeddings |
| Tool scope viewer and simulated change reviews | Implemented |
| API health and capability endpoints | Implemented scaffold |
| Bedrock, RAG, LangGraph worker and live tools | Next milestones |
| AWS infrastructure and deployment | Planned |

Demo data is synthetic. Investigations, uploaded documents and decisions reset on refresh. The environment preference is stored locally. No live AWS, GitHub, model or cluster connection is configured.

## Repository structure

- apps/web — React and TypeScript frontend.
- services/api — FastAPI development scaffold.
- services/agent-worker — future independently deployable LangGraph worker.
- packages/contracts — API contract ownership and integration notes.
- infra/terraform — infrastructure modules and environment directories.
- deploy — optional Docker Compose and future Kubernetes configurations.
- knowledge/runbooks — synthetic operational knowledge.
- docs — architecture, development guide, roadmap and decisions.
- .github/workflows — frontend validation and API scaffold checks.

This is a service based architecture prepared for independent deployment. The initial milestone does not implement a complete distributed backend.

## Use GitHub

The archive includes .github, .gitignore and CI workflows. Initialize your own Git history after extraction:

    git init -b main
    git add .
    git commit -m "Initialize OpsPilot frontend and service scaffolds"

Create an empty GitHub repository named devops-ai-agent. Then replace YOUR_USERNAME below:

    git remote add origin https://github.com/YOUR_USERNAME/devops-ai-agent.git
    git push -u origin main

Local .git history, dependencies, credentials and generated build output are excluded from the ZIP. Git will preserve the included hidden configuration files when you add the project.

## Validate

    npm run check

This runs TypeScript checking, domain tests and the production frontend build.

## API and containers

See docs/development.md for the Python API and optional Docker Compose instructions. The API reports its scaffold status and rejects investigation execution until the worker exists.

## Next milestone

Implement RAG ingestion and a grounded runbook Q&A workflow. Then connect scoped operational tools and the asynchronous agent API.

See docs/roadmap.md and docs/architecture.svg.

