import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, BookOpen, FileText, FolderOpen, Search, Trash2, Upload } from 'lucide-react';
import { useWorkspace } from '../app/WorkspaceContext';
import { EmptyState, PageHeader, Pill, RunbookViewer } from '../components/UI';

export function Knowledge() {
  const { runbooks, addRunbook, removeRunbook, notify } = useWorkspace();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [uploading, setUploading] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const categories = ['All', 'Kubernetes', 'CI/CD', 'Terraform', 'Operations'];
  const books = runbooks.filter((book) => (category === 'All' || book.category === category) && (book.title + ' ' + book.description + ' ' + book.content).toLowerCase().includes(query.toLowerCase()));
  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { await addRunbook(file); } catch (error) { notify(error instanceof Error ? error.message : 'The document could not be read.'); }
    setUploading(false);
    event.target.value = '';
  }
  return <><PageHeader eyebrow="GOOD ANSWERS BEGIN WITH GOOD SOURCES" title="Knowledge Base" description="Keep your operational knowledge easy to find and useful to investigate."><button className="button button-primary" disabled={uploading} onClick={() => input.current?.click()}><Upload size={16} />{uploading ? 'Reading document…' : 'Add local document'}</button><input ref={input} className="sr-only" type="file" accept=".md,.txt,text/plain,text/markdown" aria-label="Upload a local runbook" onChange={upload} /></PageHeader>
    <div className="knowledge-stats"><div className="knowledge-summary"><span className="stat-icon mint"><BookOpen size={21} /></span><div><strong>{runbooks.length}</strong><span>Available documents</span></div></div><div className="knowledge-summary"><span className="stat-icon lavender"><FolderOpen size={21} /></span><div><strong>4</strong><span>Knowledge categories</span></div></div><div className="knowledge-summary"><span className="stat-icon sky"><FileText size={21} /></span><div><strong>{runbooks.filter((book) => book.local).length}</strong><span>Local session documents</span></div></div></div>
    <div className="inline-note knowledge-note"><BookOpen size={18} /><span>Explore the sample runbooks or add a synthetic Markdown or text file. Local documents stay in this browser session and support keyword search. RAG embedding and ingestion will be connected in the backend milestone.</span></div>
    <section className="panel"><div className="knowledge-toolbar"><div className="tabs" aria-label="Knowledge categories">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="search-field"><Search size={17} /><input aria-label="Search knowledge" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your knowledge…" /></div></div>
    {books.length ? <div className="knowledge-grid">{books.map((book) => <article className="knowledge-card" key={book.id}><div className="knowledge-card-top"><span className="document-icon"><FileText size={23} /></span><Pill tone={book.local ? 'amber' : 'green'}>{book.local ? 'Local preview' : 'Sample source'}</Pill></div><button className="knowledge-title" onClick={() => setParams({ book: book.id })}>{book.title}<ArrowUpRight size={16} /></button><p>{book.description}</p><div className="knowledge-card-bottom"><span>{book.category} <span>·</span> {book.updated}</span>{book.local ? <button className="icon-button" aria-label={'Remove ' + book.title} onClick={() => removeRunbook(book.id)}><Trash2 size={15} /></button> : <button className="text-link" onClick={() => setParams({ book: book.id })}>Read source <ArrowUpRight size={14} /></button>}</div></article>)}</div> : <EmptyState title="No matching knowledge">Try a different category or search phrase.</EmptyState>}</section>
    <RunbookViewer book={runbooks.find((book) => book.id === params.get('book'))} onClose={() => setParams({})} />
  </>;
}

