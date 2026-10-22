import type { Environment, Investigation, InvestigationStep, Review, ReviewStatus, ScenarioKind } from './types';

export function classifyQuestion(question: string): ScenarioKind {
  if (/terraform|\bplan\b|security group|infrastructure/i.test(question)) return 'terraform';
  if (/jenkins|pipeline|\bbuild\b|github actions|maven/i.test(question)) return 'pipeline';
  if (/kubernetes|\bpod\b|crash|checkout|deployment|configmap/i.test(question)) return 'kubernetes';
  return 'unknown';
}
const baseSteps: Omit<InvestigationStep, 'state'>[] = [
  { label: 'Establish context', detail: 'Select the service and lab environment.' },
  { label: 'Retrieve knowledge', detail: 'Find relevant sample runbooks and source references.' },
  { label: 'Collect evidence', detail: 'Load the sample operational observations.' },
  { label: 'Analyze findings', detail: 'Assemble the included scenario findings.' },
  { label: 'Verify references', detail: 'Attach the supporting runbook citations.' },
];

export function createInvestigation(question: string, environment: Environment, now = Date.now()): Investigation {
  const clean = question.trim();
  if (!clean || clean.length > 2000) throw new Error('Enter a question between 1 and 2,000 characters.');
  const kind = classifyQuestion(clean);
  const shared: Investigation = {
    id: 'INV-' + now.toString(36).toUpperCase(), title: clean, question: clean, kind,
    status: 'running', service: kind === 'pipeline' ? 'notification-api' : kind === 'terraform' ? 'platform-infra' : 'checkout-api',
    namespace: kind === 'terraform' ? 'AWS lab' : 'payments-' + environment, environment,
    createdAt: now, elapsed: 'In progress', summary: '', findings: [], nextSteps: [], evidence: [],
    runbookIds: [], sample: true, steps: baseSteps.map((step, index) => ({ ...step, state: index === 0 ? 'running' : 'pending' })),
  };
  if (kind === 'kubernetes') return { ...shared, title: 'Investigate checkout startup failure',
    summary: 'The sample evidence points to an environment variable name mismatch introduced in the release.',
    findings: ['The container exits because DATABASE_URL is missing.', 'The sample workload defines DB_URL, which does not match the documented application requirement.', 'The evidence supports reviewing the variable name before changing credentials or storage.'],
    nextSteps: ['Confirm the required variable name with the application owner.', 'Prepare a reviewed configuration change through GitOps.', 'Verify readiness and restart count after the release.'],
    runbookIds: ['rb-crashloop', 'rb-config'],
    evidence: [
      { id: 'ev-log', kind: 'log', title: 'Previous container log · sample', content: 'ERROR Startup validation failed\\nMissing required environment variable: DATABASE_URL\\nApplication exited with code 1'.replaceAll('\\n', '\n') },
      { id: 'ev-config', kind: 'configuration', title: 'Workload configuration · sample', content: 'env:\n  - name: DB_URL\n    valueFrom:\n      secretKeyRef:\n        name: checkout-db\n        key: url' },
      { id: 'ev-runbook', kind: 'runbook', title: 'Configuration naming requirement', content: 'The sample application requires an environment variable named DATABASE_URL.', sourceId: 'rb-config' },
    ] };
  if (kind === 'pipeline') return { ...shared, title: 'Diagnose notification pipeline failure',
    summary: 'The sample pipeline stopped at a failing unit test. The deployment stage was correctly skipped.',
    findings: ['The first failing stage is Unit tests.', 'NotificationPolicyTest expected an accepted response and received a validation error.', 'No deployment occurred in this sample run.'],
    nextSteps: ['Review the failing assertion and recent code change with the developer.', 'Reproduce the failure with the locked dependencies.', 'Rerun the checks before promoting the same build artifact.'],
    runbookIds: ['rb-ci'],
    evidence: [
      { id: 'ev-ci', kind: 'log', title: 'Unit test stage · sample', content: '[ERROR] NotificationPolicyTest.shouldAcceptValidRequest\nExpected status: 202\nActual status: 400\n[ERROR] Tests run: 24, Failures: 1\nDeployment stage skipped.' },
      { id: 'ev-ci-doc', kind: 'runbook', title: 'Failed build procedure', content: 'Identify the first failing stage. Do not bypass failed checks to finish a release.', sourceId: 'rb-ci' },
    ] };
  if (kind === 'terraform') return { ...shared, title: 'Review database ingress change',
    summary: 'The sample plan proposes broad ingress to the database port. The documented application security group is the narrower source.',
    findings: ['The proposed ingress allows 0.0.0.0/0 on port 5432.', 'The change should be reviewed against the application network boundary.', 'The plan has not been applied.'],
    nextSteps: ['Confirm the expected application security group.', 'Replace the broad source with the documented allowed source.', 'Generate and review a new plan before applying changes.'],
    runbookIds: ['rb-plan'],
    evidence: [
      { id: 'ev-plan', kind: 'configuration', title: 'Terraform plan excerpt · sample', content: '+ ingress {\n+   from_port   = 5432\n+   to_port     = 5432\n+   cidr_blocks = ["0.0.0.0/0"]\n+ }' },
      { id: 'ev-plan-doc', kind: 'runbook', title: 'Network access review', content: 'Prefer the documented application security group as the database ingress source.', sourceId: 'rb-plan' },
    ] };
  return { ...shared, title: 'Explore a custom question', service: 'Unspecified',
    summary: 'This question is outside the included demo scenarios.',
    findings: ['This starter demonstrates Kubernetes incidents, pipeline failures and Terraform plan reviews.', 'A live agent backend is needed to investigate your own question.'],
    nextSteps: ['Try one of the sample investigation prompts.', 'Add your own runbooks to explore the knowledge interface.', 'Connect the agent backend in the next project milestone.'],
    evidence: [], runbookIds: [] };
}

export function advanceInvestigation(run: Investigation, now: number): Investigation {
  if (run.status !== 'running') return run;
  const completed = Math.floor((now - run.createdAt) / 700);
  const finished = completed >= run.steps.length;
  return { ...run, status: finished ? 'complete' : 'running',
    elapsed: finished ? ((now - run.createdAt) / 1000).toFixed(1) + 's demo' : 'In progress',
    steps: run.steps.map((step, index) => ({ ...step, state: finished || index < completed ? 'complete' : index === completed ? 'running' : 'pending' })),
  };
}

export function decideReview(review: Review, status: Exclude<ReviewStatus, 'pending'>, note: string, now = new Date()): Review {
  if (review.status !== 'pending') throw new Error('This proposal already has a decision.');
  if (status === 'changes_requested' && !note.trim()) throw new Error('Add a reason for the requested changes.');
  return { ...review, status, decisionNote: note.trim() || 'Approved in the local demo. No repository was changed.', decidedAt: now.toISOString() };
}

export function validateKnowledgeFile(name: string, size: number): void {
  if (!/\.(md|txt)$/i.test(name)) throw new Error('Choose a Markdown (.md) or plain text (.txt) file.');
  if (size === 0) throw new Error('The selected file is empty.');
  if (size > 1024 * 1024) throw new Error('Choose a file smaller than 1 MB.');
}

