# Decision 0001 · One repository, independent deployables

Status: accepted for the learning project.

Use a monorepo to keep the frontend, API, agent worker, infrastructure, contracts and operational knowledge easy to navigate. Each runtime can have its own image and release process.

A monorepo does not make the application a monolith. Separately deployable services also require clear ownership, contracts, data boundaries and operational behavior. The first milestone implements the frontend and an API scaffold; it does not claim a complete microservices platform.

Use npm workspaces for the frontend. Keep Python packages independent. Use hash routing so the static frontend can be served without special path rewrites.

Promote the same tested image digest when cloud delivery is introduced. Version prompts, model settings and knowledge indexes alongside application changes.

