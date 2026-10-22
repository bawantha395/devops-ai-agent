# Investigating CrashLoopBackOff

Start with the observed pod state. A restart loop is a symptom, not a root cause.

## Gather evidence

Read workload status and recent events. Select the affected container and inspect its previous logs. Record the deployed image and configuration references.

## Configuration failures

Compare required environment variable names with the workload manifest. Check ConfigMap references and key names. Diagnostic access must not expose Secret values.

## Verify recovery

After a reviewed change, verify readiness, restart count and the application health endpoint. Preserve the evidence used to reach the decision.
