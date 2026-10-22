# Roadmap

## 01 · Frontend foundation

Implemented: dark portfolio inspired workspace, dashboard, sample investigation flows, cited runbooks, keyword search, local text document preview, tool scope viewer, simulated change review, environment selection and API health checks.

Implemented scaffolds: health/capability API and worker status command.

## 02 · RAG knowledge

Implement approved source ingestion, sanitization, versioned chunks, Bedrock embeddings and PostgreSQL with pgvector. Add project and environment access metadata, source citations and a small reviewed evaluation set.

Local uploads in the current frontend are previews, not this ingestion pipeline.

## 03 · Operational agent

Implement a LangGraph investigation using scoped Kubernetes status, event and log tools. Add durable jobs, bounded tool/model calls, retries and checkpointing. Connect the frontend to real job submission and result polling.

Add pipeline and infrastructure tools after the first evaluated workflow.

## 04 · AWS platform and LLMOps

Implement Terraform modules, identity, secrets, EKS runtime, SQS, private integration and observability. Promote versioned application and knowledge bundles through development, test, UAT and simulated production.

Add evaluation gates, access boundary tests, failure drills, restore tests and measured cost reports.

## 05 · Reviewed changes

Implement a narrowly scoped GitOps proposal workflow. An approval must reference the exact target and diff. Keep deployment execution in the delivery pipeline.

