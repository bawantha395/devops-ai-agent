import { useRef, useState } from 'react';
import { ArrowRight, Box, GitBranch, Layers, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../app/WorkspaceContext';
import { environmentLabels } from '../lib/data';

const prompts = [
  { icon: Box, label: 'Diagnose a crashing pod', text: 'Why is checkout-api in CrashLoopBackOff after the latest deployment?' },
  { icon: GitBranch, label: 'Explain a failed pipeline', text: 'Explain why the Jenkins pipeline failed for notification-api.' },
  { icon: Layers, label: 'Review a Terraform plan', text: 'Review the database ingress changes in this Terraform plan.' },
];
export function Composer({ compact = false }: { compact?: boolean }) {
  const [question, setQuestion] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);
  const { environment, startInvestigation, notify } = useWorkspace();
  const navigate = useNavigate();
  function submit(event: React.FormEvent) {
    event.preventDefault();
    try { navigate('/investigations/' + startInvestigation(question)); } catch (error) { notify(error instanceof Error ? error.message : 'Unable to start this investigation.'); }
  }
  return <section className={'composer-card ' + (compact ? 'composer-compact' : '')}>
    <div className="composer-heading"><span className="assistant-symbol"><Sparkles size={21} /></span><div><h2>What are we investigating?</h2><p>Start with a question. Bring the right context.</p></div><PillLabel /></div>
    <form onSubmit={submit}>
      <label className="sr-only" htmlFor="investigation-question">Describe your DevOps question</label>
      <textarea id="investigation-question" ref={ref} value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={2000}
        placeholder="Ask about a failing deployment, pipeline or infrastructure change…" rows={3}
        onKeyDown={(event) => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
      <div className="composer-footer"><span className="composer-context"><span className="status-dot" />AWS Lab <span className="divider-dot">/</span> {environmentLabels[environment]}</span><button type="submit" className="button button-primary" disabled={!question.trim()}>Investigate <ArrowRight size={17} /></button></div>
    </form>
    <div className="prompt-list">{prompts.map(({ icon: Icon, label, text }) => <button key={label} className="prompt-chip" onClick={() => { setQuestion(text); ref.current?.focus(); }}><Icon size={15} />{label}<ArrowRight size={13} /></button>)}</div>
  </section>;
}
function PillLabel() { return <span className="mini-label">DEMO ASSISTANT</span>; }

