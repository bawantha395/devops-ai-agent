# Troubleshooting a failed build

Identify the first failing stage and collect a bounded log excerpt.

## Test failures

A failing unit test is an application validation signal. The deployment should not continue. Inspect the assertion and its associated change with the developer.

## Build environment

Record the runtime version, dependency lock and tool configuration. Verify whether the failure reproduces with the same inputs.

## Promotion

Promote the tested image digest. Do not bypass failed checks to finish a release.
