# Architecture

OpsPilot combines RAG knowledge retrieval with scoped operational tools. The agreed AWS reference diagram is included as architecture.svg.

Runtime boundaries

- apps/web is the static React frontend.
- services/api is the API boundary for identity checks and future job submission.
- services/agent-worker is the future LangGraph job processor.
- packages/contracts owns future versioned API contracts.
- infra/terraform and deploy own infrastructure and deployment configurations.
- knowledge owns synthetic operational material and evaluation inputs.

The source diagram is a proposed target. The starter implements the frontend and a small API scaffold. AWS resources, authentication, model access, retrieval and operational tools are future milestones.

Target knowledge flow

Approved sources enter S3, pass through validated ingestion and embedding, and populate a versioned vector index.

Target investigation flow

An authenticated engineer submits a scoped question. The agent retrieves authorized knowledge and gathers live evidence through bounded tools. It returns supporting sources, observed facts, hypotheses and recommended next steps.

A reviewable change is a separate workflow. The deployment pipeline owns execution.

