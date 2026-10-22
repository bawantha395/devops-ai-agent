# Configuration changes before a release

Record the service, environment and release revision before comparing manifests.

## Environment variables

An application requiring DATABASE_URL will not receive it from an environment variable named DB_URL. Verify the variable name against application documentation.

## Scope

Compare intended configuration fields. Treat Kubernetes default values, status and managed metadata separately.

## Review

Prepare a specific diff and supporting evidence. Use the normal deployment pipeline to release the approved version.
