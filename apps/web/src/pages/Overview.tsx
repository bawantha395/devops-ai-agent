import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, Box, Check, ChevronRight, GitBranch, Layers, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import { useWorkspace } from '../app/WorkspaceContext';
import { Composer } from '../components/Composer';
import { EmptyState, InvestigationList, PageHeader, Pill, RunbookViewer } from '../components/UI';

export function Overview() {
  const { environment, investigations, runbooks, reviews } = useWorkspace();
  const [selectedBook, setSelectedBook] = useState<string>();
  const runs = investigations.filter((run) => run.environment === environment);
  const pending = reviews.filter((review) => review.environment === environment && review.status === 'pending').length;
  const stats = [
    { label: 'Investigations', value: String(runs.length).padStart(2, '0'), detail: 'In this environment', icon: Sparkles, tone: 'mint' },
    { label: 'Knowledge documents', value: String(runbooks.length).padStart(2, '0'), detail: 'Sample and local runbooks', icon: BookOpen, tone: 'lavender' },
    { label: 'Live integrations', value: '00', detail: 'Connect in the next milestone', icon: Box, tone: 'sky' },
    { label: 'Awaiting review', value: String(pending).padStart(2, '0'), detail: 'Human decisions stay in control', icon: ShieldCheck, tone: 'peach' },
  ];
  return <>
    <PageHeader eyebrow="A LITTLE CONTEXT GOES A LONG WAY" title="Your DevOps workspace." description="Bring your runbooks, operational evidence and next steps together."><Link className="button button-secondary" to="/knowledge"><BookOpen size={16} />Browse knowledge</Link></PageHeader>
    <div className="overview-grid">
      <div className="overview-main"><Composer />
        <div className="stats-grid">{stats.map(({ label, value, detail, icon: Icon, tone }) => <div className="stat-card" key={label}><div className="stat-top"><span>{label}</span><span className={'stat-icon ' + tone}><Icon size={17} /></span></div><strong>{value}</strong><small>{detail}</small></div>)}</div>
        <section className="panel recent-panel"><div className="panel-heading"><div><h2>Recent investigations</h2><p>A trail of evidence, from question to next step.</p></div><Link className="text-link" to="/investigations">View all <ArrowUpRight size={16} /></Link></div>{runs.length ? <InvestigationList runs={runs.slice(0, 4)} /> : <EmptyState title="A fresh environment">Start a demo investigation above to see the workflow here.</EmptyState>}</section>
        <div className="principle-strip"><span className="principle-icon"><ShieldCheck size={20} /></span><div><strong>Evidence first. Human decisions always.</strong><p>Source references explain the findings. Proposed changes stay reviewable.</p></div><Pill tone="green">Read scope by design</Pill></div>
      </div>
      <aside className="overview-aside">
        <section className="panel workspace-snapshot"><div className="panel-heading compact"><h2>Your platform</h2><span className="tiny-label">PLANNED</span></div><div className="platform-orbit"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="orbit orbit-three" /><span className="platform-center"><Layers size={32} /></span><span className="orbit-node node-one"><Box size={16} /></span><span className="orbit-node node-two"><GitBranch size={16} /></span><span className="orbit-node node-three"><Sparkles size={16} /></span></div><h3>One workspace.<br /><span>More useful context.</span></h3><p>RAG knowledge and scoped tools, orchestrated on AWS.</p><div className="snapshot-row"><span>Agent runtime</span><strong>LangGraph</strong></div><div className="snapshot-row"><span>Model provider</span><strong>Amazon Bedrock</strong></div><div className="snapshot-row"><span>Cloud platform</span><strong>AWS / EKS</strong></div><Link to="/tools" className="text-link">Explore connections <ArrowRight size={15} /></Link></section>
        <section className="panel suggested-runbooks"><div className="panel-heading compact"><h2>Keep these close</h2><BookOpen size={17} /></div>{runbooks.filter((book) => ['rb-crashloop', 'rb-ci', 'rb-plan'].includes(book.id)).map((book) => <button key={book.id} className="runbook-shortcut" onClick={() => setSelectedBook(book.id)}><span className="book-icon"><BookOpen size={16} /></span><span>{book.title}<small>{book.category}</small></span><ChevronRight size={15} /></button>)}<Link to="/knowledge" className="text-link">All runbooks <ArrowUpRight size={14} /></Link></section>
        <section className="delivery-note"><span><Check size={15} /> BUILDING IN THE OPEN</span><h3>A foundation you can grow.</h3><p>The GitHub starter separates the web app, API and agent worker.</p><Link to="/settings">Project setup <Plus size={15} /></Link></section>
      </aside>
    </div>
    <RunbookViewer book={runbooks.find((book) => book.id === selectedBook)} onClose={() => setSelectedBook(undefined)} />
  </>;
}

