import { describe, expect, it } from 'vitest';
import { advanceInvestigation, classifyQuestion, createInvestigation, decideReview, validateKnowledgeFile } from './demo-engine';
import { normalizeApiBase } from './api';
import { initialReviews, runbooks } from './data';

describe('demo investigation boundaries', () => {
  it('does not invent evidence for an unsupported question', () => {
    const run = createInvestigation('Who won a football match?', 'test', 1000);
    expect(run.kind).toBe('unknown');
    expect(run.evidence).toHaveLength(0);
    expect(run.runbookIds).toHaveLength(0);
  });
  it('preserves the selected environment and completes only after all steps', () => {
    const run = createInvestigation('Investigate a crashing pod', 'uat', 1000);
    expect(run.environment).toBe('uat');
    expect(run.namespace).toBe('payments-uat');
    expect(advanceInvestigation(run, 1699).status).toBe('running');
    const complete = advanceInvestigation(run, 4600);
    expect(complete.status).toBe('complete');
    expect(complete.steps.every((step) => step.state === 'complete')).toBe(true);
  });
  it('resolves every citation in supported scenarios to an existing source', () => {
    const ids = new Set(runbooks.map((book) => book.id));
    for (const question of ['Crashing Kubernetes pod', 'Failed Jenkins pipeline', 'Terraform plan']) {
      const run = createInvestigation(question, 'test', 1000);
      expect(run.runbookIds.length).toBeGreaterThan(0);
      expect(run.runbookIds.every((id) => ids.has(id))).toBe(true);
      expect(run.evidence.filter((item) => item.sourceId).every((item) => ids.has(item.sourceId!))).toBe(true);
    }
  });
  it('rejects empty and oversized prompts', () => {
    expect(() => createInvestigation('   ', 'test')).toThrow();
    expect(() => createInvestigation('a'.repeat(2001), 'test')).toThrow();
    expect(classifyQuestion('Explain a Terraform plan')).toBe('terraform');
  });
});
describe('review integrity', () => {
  it('requires a reason when requesting changes and rejects repeated decisions', () => {
    const pending = initialReviews[0];
    expect(() => decideReview(pending, 'changes_requested', ' ')).toThrow();
    const approved = decideReview(pending, 'approved', 'Verified sample diff', new Date('2026-10-22T12:00:00Z'));
    expect(pending.status).toBe('pending');
    expect(approved.decisionNote).toBe('Verified sample diff');
    expect(() => decideReview(approved, 'approved', 'Again')).toThrow();
  });
});
describe('input boundaries', () => {
  it('accepts small text files and rejects binary, empty or oversized uploads', () => {
    expect(() => validateKnowledgeFile('runbook.md', 1024)).not.toThrow();
    expect(() => validateKnowledgeFile('archive.zip', 1024)).toThrow();
    expect(() => validateKnowledgeFile('notes.txt', 0)).toThrow();
    expect(() => validateKnowledgeFile('notes.txt', 1024 * 1024 + 1)).toThrow();
  });
  it('rejects unsafe API addresses and embedded credentials', () => {
    expect(normalizeApiBase('/api/')).toBe('/api');
    expect(normalizeApiBase('http://localhost:8000/')).toBe('http://localhost:8000');
    expect(() => normalizeApiBase('javascript:alert(1)')).toThrow();
    expect(() => normalizeApiBase('//example.com')).toThrow();
    expect(() => normalizeApiBase('https://user:password@example.com')).toThrow();
  });
});

