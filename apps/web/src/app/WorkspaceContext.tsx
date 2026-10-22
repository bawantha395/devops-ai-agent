import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { advanceInvestigation, createInvestigation, decideReview, validateKnowledgeFile } from '../lib/demo-engine';
import { initialInvestigations, initialReviews, runbooks as sampleRunbooks } from '../lib/data';
import type { Environment, Investigation, Review, ReviewStatus, Runbook } from '../lib/types';

interface WorkspaceState {
  environment: Environment;
  setEnvironment: (value: Environment) => void;
  investigations: Investigation[];
  runbooks: Runbook[];
  reviews: Review[];
  toast: string;
  notify: (message: string) => void;
  startInvestigation: (question: string) => string;
  addRunbook: (file: File) => Promise<void>;
  removeRunbook: (id: string) => void;
  reviewProposal: (id: string, decision: Exclude<ReviewStatus, 'pending'>, note: string) => void;
}
const WorkspaceContext = createContext<WorkspaceState | null>(null);
function initialEnvironment(): Environment {
  try {
    const saved = localStorage.getItem('opspilot.environment');
    if (saved && ['dev', 'test', 'uat', 'prod'].includes(saved)) return saved as Environment;
  } catch { /* Nonessential preference storage can be unavailable. */ }
  return 'test';
}
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [environment, setEnvironmentState] = useState<Environment>(initialEnvironment);
  const [investigations, setInvestigations] = useState<Investigation[]>(initialInvestigations);
  const [runbooks, setRunbooks] = useState(sampleRunbooks);
  const [reviews, setReviews] = useState(initialReviews);
  const [toast, setToast] = useState('');
  const activeIds = investigations.filter((run) => run.status === 'running').map((run) => run.id).join(',');
  useEffect(() => {
    if (!activeIds) return;
    const timer = window.setInterval(() => setInvestigations((current) => current.map((run) => advanceInvestigation(run, Date.now()))), 250);
    return () => window.clearInterval(timer);
  }, [activeIds]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);
  function setEnvironment(value: Environment) {
    setEnvironmentState(value);
    try { localStorage.setItem('opspilot.environment', value); } catch { /* Keep the in-memory selection. */ }
  }
  function startInvestigation(question: string) {
    const run = createInvestigation(question, environment);
    run.id += '-' + Math.random().toString(36).slice(2, 5).toUpperCase();
    setInvestigations((current) => [run, ...current]);
    return run.id;
  }
  async function addRunbook(file: File) {
    validateKnowledgeFile(file.name, file.size);
    const content = await file.text();
    if (!content.trim() || content.includes('\u0000')) throw new Error('Choose a nonempty text document.');
    const id = 'local-' + crypto.randomUUID();
    setRunbooks((current) => [...current, {
      id, title: file.name.replace(/\.(md|txt)$/i, '').replaceAll('-', ' '), category: 'Operations',
      description: 'Local preview document. Available for browser keyword search.',
      content, source: 'Local session / ' + file.name, updated: 'This session', local: true,
    }]);
    setToast('Document added to this browser session. Embedding indexing is a later milestone.');
  }
  function removeRunbook(id: string) {
    setRunbooks((current) => current.filter((book) => book.id !== id || !book.local));
    setToast('Local document removed.');
  }
  function reviewProposal(id: string, decision: Exclude<ReviewStatus, 'pending'>, note: string) {
    const proposal = reviews.find((item) => item.id === id);
    if (!proposal) throw new Error('Proposal not found.');
    const next = decideReview(proposal, decision, note);
    setReviews((current) => current.map((item) => item.id === id ? next : item));
    setToast(decision === 'approved' ? 'Demo proposal approved. No GitHub or cluster change was made.' : 'Changes requested in the local demo.');
  }
  return <WorkspaceContext.Provider value={{ environment, setEnvironment, investigations, runbooks, reviews, toast, notify: setToast, startInvestigation, addRunbook, removeRunbook, reviewProposal }}>{children}</WorkspaceContext.Provider>;
}
export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error('WorkspaceProvider is required.');
  return value;
}

