import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Check, Search, X, ArrowUpRight, BookOpen, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Investigation, Runbook } from '../lib/types';
import { environmentLabels } from '../lib/data';

export function Pill({ children, tone = 'neutral', dot = false }: { children: ReactNode; tone?: 'neutral' | 'green' | 'amber' | 'lavender' | 'red'; dot?: boolean }) {
  return <span className={'pill pill-' + tone}>{dot && <span className="status-dot" />}{children}</span>;
}
export function PageHeader({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return <div className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-description">{description}</p></div>{children && <div className="header-actions">{children}</div>}</div>;
}
export function Modal({ open, title, onClose, children, wide = false }: { open: boolean; title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal();
    if (!open && ref.current?.open) ref.current.close();
  }, [open]);
  return <dialog ref={ref} className={'modal ' + (wide ? 'modal-wide' : '')} aria-labelledby={id}
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="modal-inner"><div className="modal-heading"><h2 id={id}>{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={20} /></button></div>{children}</div>
  </dialog>;
}
export function EmptyState({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <div className="empty-state"><span className="empty-icon"><Search size={25} /></span><h3>{title}</h3><p>{children}</p>{action}</div>;
}
export function Markdown({ content }: { content: string }) {
  const fence = String.fromCharCode(96).repeat(3);
  return <div className="markdown">{content.split(/\n\s*\n/).map((block, index) => {
    if (block.startsWith('## ')) return <h3 key={index}>{block.slice(3)}</h3>;
    if (block.startsWith('# ')) return <h2 key={index}>{block.slice(2)}</h2>;
    if (block.startsWith(fence)) return <pre key={index}>{block.split('\n').slice(1, -1).join('\n')}</pre>;
    return <p key={index}>{block}</p>;
  })}</div>;
}
export function RunbookViewer({ book, onClose }: { book: Runbook | undefined; onClose: () => void }) {
  return <Modal open={!!book} title={book?.title || 'Runbook'} onClose={onClose} wide>
    {book && <><div className="document-meta"><Pill tone="lavender">{book.category}</Pill><span>{book.updated}</span></div><p className="source-path"><BookOpen size={15} />{book.source}</p>{book.local && <div className="inline-note">Local session document. This file is available for keyword search; it has not been embedded or sent to a server.</div>}<Markdown content={book.content} /></>}
  </Modal>;
}
export function StatusPill({ status }: { status: Investigation['status'] }) {
  return <Pill tone={status === 'running' ? 'lavender' : status === 'needs_review' ? 'amber' : 'green'} dot>{status === 'running' ? 'Investigating' : status === 'needs_review' ? 'Review needed' : 'Completed'}</Pill>;
}
export function InvestigationList({ runs }: { runs: Investigation[] }) {
  return <div className="table-scroll"><table className="data-table"><thead><tr><th>Investigation</th><th>Context</th><th>Status</th><th className="table-last">Details</th></tr></thead><tbody>{runs.map((run) => <tr key={run.id}><td><Link className="table-title" to={'/investigations/' + run.id}><span className={'table-icon ' + run.kind}><Sparkles size={17} /></span><span>{run.title}<small>{run.id} · Sample investigation</small></span></Link></td><td><span className="context-service">{run.service}</span><small>{environmentLabels[run.environment]}</small></td><td><StatusPill status={run.status} /></td><td className="table-last"><Link className="icon-button" aria-label={'Open ' + run.id} to={'/investigations/' + run.id}><ArrowUpRight size={18} /></Link></td></tr>)}</tbody></table></div>;
}
export function Toast({ message }: { message: string }) {
  return <div className={'toast ' + (message ? 'visible' : '')} role="status" aria-live="polite">{message && <><Check size={18} /><span>{message}</span></>}</div>;
}

