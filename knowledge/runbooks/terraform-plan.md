# Reviewing a Terraform plan

Confirm the selected workspace and environment before interpreting a plan.

## Change impact

Inspect resource replacements and deletions, state changes and dependencies. Review public network access and IAM changes explicitly.

## Network access

A database ingress rule using 0.0.0.0/0 exposes the configured port broadly. Prefer the documented application security group as the source.

## Apply

Treat the reviewed plan as a versioned artifact. Infrastructure changes require the approved delivery workflow.
