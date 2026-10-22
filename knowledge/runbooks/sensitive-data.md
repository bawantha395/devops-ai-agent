# Handling sensitive operational data

Use synthetic data in this learning project.

## Agent access

Diagnostic tools should read only the resources and logs required for the selected service. Secret values must not be returned to the model.

## Knowledge sources

Review and sanitize content before ingestion. Retrieval access must be filtered using the authenticated user and project grants.

## Audit

Record scoped tool actions and decisions while protecting sensitive content.
