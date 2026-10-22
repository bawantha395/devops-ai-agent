import type { Connector, Runbook, Review } from './types';
import { createInvestigation } from './demo-engine';

export const environmentLabels = { dev: 'Development', test: 'Test', uat: 'UAT', prod: 'Production' } as const;
export const runbooks: Runbook[] = [
  { id: 'rb-crashloop', title: 'Investigating CrashLoopBackOff', category: 'Kubernetes',
    description: 'Trace startup failures using pod events, previous logs and recent release changes.',
    source: 'knowledge/runbooks/crashloop.md', updated: 'Sample · v1.0',
    content: '# Investigating CrashLoopBackOff\n\nStart with the observed pod state. A restart loop is a symptom, not a root cause.\n\n## Gather evidence\n\nRead workload status and recent events. Select the affected container and inspect its previous logs. Record the deployed image and configuration references.\n\n## Configuration failures\n\nCompare required environment variable names with the workload manifest. Check ConfigMap references and key names. Diagnostic access must not expose Secret values.\n\n## Verify recovery\n\nAfter a reviewed change, verify readiness, restart count and the application health endpoint. Preserve the evidence used to reach the decision.' },
  { id: 'rb-config', title: 'Configuration changes before a release', category: 'Kubernetes',
    description: 'Check environment names, ConfigMap references and configuration ownership.',
    source: 'knowledge/runbooks/configuration.md', updated: 'Sample · v1.0',
    content: '# Configuration changes before a release\n\nRecord the service, environment and release revision before comparing manifests.\n\n## Environment variables\n\nAn application requiring DATABASE_URL will not receive it from an environment variable named DB_URL. Verify the variable name against application documentation.\n\n## Scope\n\nCompare intended configuration fields. Treat Kubernetes default values, status and managed metadata separately.\n\n## Review\n\nPrepare a specific diff and supporting evidence. Use the normal deployment pipeline to release the approved version.' },
  { id: 'rb-image', title: 'Resolving ImagePullBackOff', category: 'Kubernetes',
    description: 'Check image tags, registry permissions and image pull references.',
    source: 'knowledge/runbooks/image-pull.md', updated: 'Sample · v1.0',
    content: '# Resolving ImagePullBackOff\n\nRead the pod event before changing configuration.\n\n## Checks\n\nConfirm the image repository and immutable digest or tag exist. Inspect registry reachability and the name of the image pull Secret reference. Do not print credentials.\n\n## Recovery\n\nPublish or select the intended image through the delivery process, then verify the rollout.' },
  { id: 'rb-ci', title: 'Troubleshooting a failed build', category: 'CI/CD',
    description: 'Find the first failing stage and distinguish code, test and infrastructure errors.',
    source: 'knowledge/runbooks/ci-failures.md', updated: 'Sample · v1.0',
    content: '# Troubleshooting a failed build\n\nIdentify the first failing stage and collect a bounded log excerpt.\n\n## Test failures\n\nA failing unit test is an application validation signal. The deployment should not continue. Inspect the assertion and its associated change with the developer.\n\n## Build environment\n\nRecord the runtime version, dependency lock and tool configuration. Verify whether the failure reproduces with the same inputs.\n\n## Promotion\n\nPromote the tested image digest. Do not bypass failed checks to finish a release.' },
  { id: 'rb-plan', title: 'Reviewing a Terraform plan', category: 'Terraform',
    description: 'Inspect destructive changes, network exposure and infrastructure scope.',
    source: 'knowledge/runbooks/terraform-plan.md', updated: 'Sample · v1.0',
    content: '# Reviewing a Terraform plan\n\nConfirm the selected workspace and environment before interpreting a plan.\n\n## Change impact\n\nInspect resource replacements and deletions, state changes and dependencies. Review public network access and IAM changes explicitly.\n\n## Network access\n\nA database ingress rule using 0.0.0.0/0 exposes the configured port broadly. Prefer the documented application security group as the source.\n\n## Apply\n\nTreat the reviewed plan as a versioned artifact. Infrastructure changes require the approved delivery workflow.' },
  { id: 'rb-rollback', title: 'Recovering a GitOps release', category: 'Operations',
    description: 'Restore a reviewed desired version and verify application health.',
    source: 'knowledge/runbooks/gitops-recovery.md', updated: 'Sample · v1.0',
    content: '# Recovering a GitOps release\n\nEstablish which revision introduced the observed problem.\n\n## Prepare recovery\n\nReview configuration compatibility and database migration implications. Revert the intended Git change through the normal review process.\n\n## Reconcile and validate\n\nObserve Argo CD reconciliation, workload readiness and application checks. Record detection and recovery times.\n\n## Follow up\n\nDocument the cause supported by evidence and improve the release checks.' },
  { id: 'rb-secret', title: 'Handling sensitive operational data', category: 'Operations',
    description: 'Keep credentials out of prompts, logs, screenshots and knowledge sources.',
    source: 'knowledge/runbooks/sensitive-data.md', updated: 'Sample · v1.0',
    content: '# Handling sensitive operational data\n\nUse synthetic data in this learning project.\n\n## Agent access\n\nDiagnostic tools should read only the resources and logs required for the selected service. Secret values must not be returned to the model.\n\n## Knowledge sources\n\nReview and sanitize content before ingestion. Retrieval access must be filtered using the authenticated user and project grants.\n\n## Audit\n\nRecord scoped tool actions and decisions while protecting sensitive content.' },
  { id: 'rb-slo', title: 'Measuring investigation quality', category: 'Operations',
    description: 'Track supported answers, useful evidence, latency and investigation cost.',
    source: 'knowledge/runbooks/investigation-quality.md', updated: 'Sample · v1.0',
    content: '# Measuring investigation quality\n\nDefine targets before collecting measurements.\n\n## Quality\n\nReview whether retrieved content is relevant, citations are valid and findings are supported by evidence. Include unknown questions and access boundary tests.\n\n## Operations\n\nMeasure job completion time, tool failures, retry counts and model usage. Keep incident observations separate from model hypotheses.\n\n## Reporting\n\nState the workload, sample size and observation window. A target is not an achieved result.' },
];

const seeded = [
  createInvestigation('Why is checkout-api in CrashLoopBackOff after the deployment?', 'test', Date.now() - 48 * 60_000),
  createInvestigation('Explain the failed Jenkins pipeline for notification-api.', 'test', Date.now() - 115 * 60_000),
  createInvestigation('Review this Terraform plan for database network access.', 'dev', Date.now() - 180 * 60_000),
];
export const initialInvestigations = seeded.map((item, index) => ({
  ...item, id: ['INV-1042', 'INV-1041', 'INV-1040'][index],
  status: index === 0 ? 'needs_review' as const : 'complete' as const,
  elapsed: 'Sample run', steps: item.steps.map((step) => ({ ...step, state: 'complete' as const })),
}));

export const initialReviews: Review[] = [{
  id: 'CHG-008', investigationId: 'INV-1042', title: 'Correct the checkout environment variable',
  service: 'checkout-api', environment: 'test', status: 'pending',
  description: 'The sample startup log requires DATABASE_URL. The sample workload defines DB_URL. This proposal corrects the variable name while preserving its value source.',
  before: 'env:\n  - name: DB_URL\n    valueFrom:\n      secretKeyRef:\n        name: checkout-db\n        key: url',
  after: 'env:\n  - name: DATABASE_URL\n    valueFrom:\n      secretKeyRef:\n        name: checkout-db\n        key: url',
}];

export const connectors: Connector[] = [
  { id: 'kubernetes', name: 'Kubernetes', icon: 'kubernetes', status: 'demo',
    description: 'Workload status, pod events and scoped container logs.',
    permissions: ['Read deployment and pod status', 'Read selected namespace events', 'Read bounded, sanitized container logs', 'No Secret values or workload changes'] },
  { id: 'pipelines', name: 'CI/CD Pipelines', icon: 'pipeline', status: 'demo',
    description: 'Failed stages and build evidence from your delivery tools.',
    permissions: ['Read an authorized pipeline run', 'Read failed stage log excerpts', 'No pipeline execution or repository writes'] },
  { id: 'metrics', name: 'Prometheus', icon: 'metrics', status: 'demo',
    description: 'Operational signals from approved metric queries.',
    permissions: ['Run allowlisted metric query templates', 'Use bounded service and time parameters', 'No arbitrary query execution in the starter'] },
  { id: 'cloudwatch', name: 'Amazon CloudWatch', icon: 'cloud', status: 'planned',
    description: 'AWS logs and infrastructure observations.',
    permissions: ['Planned: scoped log queries', 'Planned: selected service metrics', 'AWS authentication is not configured'] },
  { id: 'gitops', name: 'GitHub & GitOps', icon: 'git', status: 'planned',
    description: 'Release context and reviewed change proposals.',
    permissions: ['Planned: read repository release metadata', 'Planned: prepare a reviewed pull request', 'No GitHub connection is configured'] },
  { id: 'bedrock', name: 'Amazon Bedrock', icon: 'database', status: 'planned',
    description: 'Grounded reasoning and document embeddings.',
    permissions: ['Planned: model invocation with scoped IAM', 'Planned: token and cost tracking', 'No model requests are made in demo mode'] },
];

