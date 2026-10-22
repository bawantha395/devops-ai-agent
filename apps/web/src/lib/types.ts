export type Environment = 'dev' | 'test' | 'uat' | 'prod';
export type ScenarioKind = 'kubernetes' | 'pipeline' | 'terraform' | 'unknown';
export type InvestigationStatus = 'running' | 'complete' | 'needs_review';
export type StepState = 'pending' | 'running' | 'complete';
export type ReviewStatus = 'pending' | 'approved' | 'changes_requested';

export interface Runbook {
  id: string;
  title: string;
  category: 'Kubernetes' | 'CI/CD' | 'Terraform' | 'Operations';
  description: string;
  content: string;
  source: string;
  updated: string;
  local?: boolean;
}
export interface Evidence {
  id: string;
  title: string;
  kind: 'log' | 'event' | 'configuration' | 'runbook';
  content: string;
  sourceId?: string;
}
export interface InvestigationStep {
  label: string;
  detail: string;
  state: StepState;
}
export interface Investigation {
  id: string;
  title: string;
  question: string;
  kind: ScenarioKind;
  status: InvestigationStatus;
  service: string;
  namespace: string;
  environment: Environment;
  createdAt: number;
  elapsed: string;
  summary: string;
  findings: string[];
  nextSteps: string[];
  evidence: Evidence[];
  runbookIds: string[];
  steps: InvestigationStep[];
  sample: boolean;
}
export interface Review {
  id: string;
  investigationId: string;
  title: string;
  service: string;
  environment: Environment;
  description: string;
  before: string;
  after: string;
  status: ReviewStatus;
  decisionNote?: string;
  decidedAt?: string;
}
export interface Connector {
  id: string;
  name: string;
  description: string;
  icon: 'kubernetes' | 'pipeline' | 'metrics' | 'cloud' | 'git' | 'database';
  status: 'demo' | 'planned';
  permissions: string[];
}

