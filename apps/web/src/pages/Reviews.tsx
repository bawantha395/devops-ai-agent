import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock, FileCode, MessageSquare, ShieldCheck } from 'lucide-react';
import { useWorkspace } from '../app/WorkspaceContext';
import { EmptyState, PageHeader, Pill } from '../components/UI';
import { environmentLabels } from '../lib/data';

export function Reviews() {
  const { reviews, environment, reviewProposal, notify } = useWorkspace();
  const [note, setNote] = useState('');
  const visible = reviews.filter((item) => item.environment === environment);
  function decide(id: string, decision: 'approved' | 'changes_requested') {
    try { reviewProposal(id, decision, note); setNote(''); } catch (error) { notify(error instanceof Error ? error.message : 'Unable to record this decision.'); }
  }
  return <><PageHeader eyebrow="KEEP ENGINEERING JUDGMENT IN THE LOOP" title="Change Reviews" description="Inspect the evidence and exact proposed change before making a decision." /><div className="inline-note"><ShieldCheck size={18} /><span>Review actions are simulated in this browser session. Approving a proposal does not create a pull request or modify a cluster.</span></div>
    {!visible.length ? <section className="panel"><EmptyState title="No proposals in this environment">Select Test to inspect the sample configuration proposal.</EmptyState></section> : visible.map((review) => <section className="panel review-panel" key={review.id}><div className="panel-heading"><div><div className="review-eyebrow">{review.id} <span>/</span> {environmentLabels[review.environment]} <span>/</span> {review.service}</div><h2>{review.title}</h2></div><Pill tone={review.status === 'pending' ? 'amber' : review.status === 'approved' ? 'green' : 'lavender'} dot>{review.status === 'pending' ? 'Awaiting review' : review.status === 'approved' ? 'Approved in demo' : 'Changes requested'}</Pill></div><div className="review-content"><p>{review.description}</p><Link className="text-link" to={'/investigations/' + review.investigationId}>View supporting investigation <ArrowRight size={15} /></Link><div className="diff-grid"><div className="diff-block diff-before"><div><FileCode size={15} />Current configuration</div><pre>{review.before}</pre></div><div className="diff-block diff-after"><div><FileCode size={15} />Proposed configuration</div><pre>{review.after}</pre></div></div>{review.status === 'pending' ? <><label className="field-label" htmlFor={'note-' + review.id}>Review note <span>Required when requesting changes</span></label><textarea id={'note-' + review.id} className="review-note" rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Record your reasoning or the changes you need…" maxLength={1500} /><div className="review-actions"><span><Clock size={14} />No automatic execution</span><button className="button button-secondary" onClick={() => decide(review.id, 'changes_requested')}><MessageSquare size={16} />Request changes</button><button className="button button-primary" onClick={() => decide(review.id, 'approved')}><Check size={16} />Approve demo proposal</button></div></> : <div className="decision-record"><ShieldCheck size={19} /><div><strong>Decision recorded locally</strong><p>{review.decisionNote}</p><small>{review.decidedAt ? new Date(review.decidedAt).toLocaleString() : ''}</small></div></div>}</div></section>)}</>;
}

