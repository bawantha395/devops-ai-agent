import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle, Clock, Copy, FileText, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { Composer } from '../components/Composer';
import { EmptyState, InvestigationList, PageHeader, Pill, RunbookViewer, StatusPill } from '../components/UI';
import { useWorkspace } from '../app/WorkspaceContext';
import { environmentLabels } from '../lib/data';

export function Investigations() {
  const { id } = useParams();
  const { environment, investigations } = useWorkspace();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  if (id) return <InvestigationDetail id={id} />;
  const runs = investigations.filter((run) => run.environment === environment && (run.title + run.id + run.service).toLowerCase().includes(query.toLowerCase()) && (status === 'all' || run.status === status));
  return <><PageHeader eyebrow="FROM SIGNAL TO UNDERSTANDING" title="Investigations" description="Follow the evidence and keep the reasoning in one place." /><Composer compact /><section className="panel"><div className="panel-heading"><h2>Investigation history</h2><Pill>{environmentLabels[environment]}</Pill></div><div className="filter-bar"><div className="search-field"><Search size={17} /><input aria-label="Search investigations" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by question, service or ID…" /></div><select aria-label="Investigation status" className="filter-select" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option value="running">Investigating</option><option value="complete">Completed</option><option value="needs_review">Review needed</option></select></div>{runs.length ? <InvestigationList runs={runs} /> : <EmptyState title="No matching investigations">Try another search, select a different environment or start a new demo investigation.</EmptyState>}</section></>;
}
function InvestigationDetail({ id }: { id: string }) {
  const { investigations, runbooks, notify, reviews } = useWorkspace();
  const [bookId, setBookId] = useState<string>();
  const run = investigations.find((item) => item.id === id);
  if (!run) return <EmptyState title="Investigation not found">This demo investigation may have been cleared when the page was refreshed.<Link to="/investigations" className="button button-secondary">Back to investigations</Link></EmptyState>;
  const finished = run.status !== 'running';
  const review = reviews.find((item) => item.investigationId === run.id);
  async function copySummary() {
    try { await navigator.clipboard.writeText([run!.title, 'SAMPLE INVESTIGATION', run!.summary, ...run!.findings].join('\n\n')); notify('Sample investigation summary copied.'); } catch { notify('Clipboard access is unavailable in this browser.'); }
  }
  return <>
    <Link to="/investigations" className="back-link"><ArrowLeft size={16} />All investigations</Link>
    <PageHeader eyebrow={run.id + ' / SAMPLE INVESTIGATION'} title={run.title} description={run.question}><StatusPill status={run.status} /></PageHeader>
    <div className="investigation-context"><span><span className="status-dot" />{environmentLabels[run.environment]}</span><span>{run.service}</span><span>{run.namespace}</span><span><Clock size={14} />{run.elapsed}</span><Pill tone="lavender">Demo evidence</Pill></div>
    <div className="investigation-grid">
      <div className="investigation-main"><section className="panel result-panel"><div className="panel-heading"><div className="inline-heading"><span className="assistant-symbol"><Sparkles size={20} /></span><h2>{finished ? 'Investigation summary' : 'Gathering the right context…'}</h2></div>{finished && <button className="icon-button" aria-label="Copy investigation summary" onClick={copySummary}><Copy size={17} /></button>}</div>{!finished ? <div className="investigation-loading"><span className="large-spinner" /><h3>Following the sample evidence</h3><p>This preview is walking through a predefined scenario. No live tools or models are called.</p></div> : <div className="result-body"><div className="summary-callout"><span className="summary-label"><ShieldCheck size={15} />EVIDENCE-LED SUMMARY</span><h3>{run.summary}</h3></div><h4>What the evidence shows</h4><ul className="finding-list">{run.findings.map((finding) => <li key={finding}><CheckCircle size={17} /><span>{finding}</span></li>)}</ul><h4>Recommended next steps</h4><ol className="next-steps">{run.nextSteps.map((step) => <li key={step}>{step}</li>)}</ol>{review && <Link className="button button-secondary" to="/reviews">Review proposed change <ArrowRight size={16} /></Link>}{run.kind === 'unknown' && <Link className="button button-secondary" to="/investigations">Try a sample scenario <ArrowRight size={16} /></Link>}</div>}</section>
      {finished && run.evidence.length > 0 && <section className="panel"><div className="panel-heading"><div><h2>Supporting evidence</h2><p>Sanitized observations from the included sample.</p></div><Pill>{run.evidence.length} sources</Pill></div><div className="evidence-list">{run.evidence.map((evidence) => <article className="evidence-card" key={evidence.id}><div className="evidence-heading"><span><FileText size={16} />{evidence.title}</span><Pill>{evidence.kind}</Pill></div><pre>{evidence.content}</pre>{evidence.sourceId && <button className="text-link" onClick={() => setBookId(evidence.sourceId)}>Open source runbook <ArrowRight size={14} /></button>}</article>)}</div></section>}
      </div><aside className="investigation-aside"><section className="panel"><div className="panel-heading compact"><h2>Investigation trail</h2><Pill tone="lavender">Demo</Pill></div><ol className="timeline">{run.steps.map((step, index) => <li key={step.label} data-state={step.state}><span className="timeline-marker">{step.state === 'complete' ? <Check size={13} /> : step.state === 'running' ? <span className="small-spinner" /> : index + 1}</span><div><strong>{step.label}</strong><p>{step.detail}</p></div></li>)}</ol></section><section className="panel citations-panel"><div className="panel-heading compact"><h2>Knowledge references</h2><BookOpen size={17} /></div>{finished ? run.runbookIds.length ? run.runbookIds.map((sourceId) => { const book = runbooks.find((item) => item.id === sourceId); return book ? <button key={book.id} className="citation-button" onClick={() => setBookId(book.id)}><BookOpen size={16} /><span>{book.title}<small>{book.source}</small></span><ArrowRight size={14} /></button> : null; }) : <p className="panel-copy muted">No sources were retrieved for this custom demo question.</p> : <p className="panel-copy muted">References will appear when the sample investigation is complete.</p>}</section><div className="inline-note"><ShieldCheck size={17} /><span>Findings inform a decision. Deployment changes remain a separate, reviewed action.</span></div></aside>
    </div><RunbookViewer book={runbooks.find((book) => book.id === bookId)} onClose={() => setBookId(undefined)} />
  </>;
}

