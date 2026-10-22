# Recovering a GitOps release

Establish which revision introduced the observed problem.

## Prepare recovery

Review configuration compatibility and database migration implications. Revert the intended Git change through the normal review process.

## Reconcile and validate

Observe Argo CD reconciliation, workload readiness and application checks. Record detection and recovery times.

## Follow up

Document the cause supported by evidence and improve the release checks.
