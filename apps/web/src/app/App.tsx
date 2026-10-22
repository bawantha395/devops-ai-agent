import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Activity, ArrowUpRight, BookOpen, Box, Check, ChevronDown, Command, GitBranch, LayoutDashboard, Menu, Search, Settings, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useWorkspace } from './WorkspaceContext';
import { Modal, Toast } from '../components/UI';
import { environmentLabels } from '../lib/data';
import { Overview } from '../pages/Overview';
import { Investigations } from '../pages/Investigations';
import { Knowledge } from '../pages/Knowledge';
import { Tools } from '../pages/Tools';
import { Reviews } from '../pages/Reviews';
import { SettingsPage } from '../pages/Settings';
import type { Environment } from '../lib/types';

const navigation = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/investigations', label: 'Investigations', icon: Sparkles },
  { to: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
  { to: '/tools', label: 'Tool Connections', icon: Box },
  { to: '/reviews', label: 'Change Reviews', icon: ShieldCheck },
];
function Logo() {
  return <span className="brand-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="m10 24 10-14 10 14-10 6zM10 24l10-4 10 4M20 10v10" /></svg></span>;
}
export function App() {
  const { environment, setEnvironment, reviews, toast, runbooks, investigations } = useWorkspace();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const pending = reviews.filter((item) => item.status === 'pending').length;
  const pageTitle = location.pathname.startsWith('/settings') ? 'Settings' : navigation.find((item) => item.to !== '/' && location.pathname.startsWith(item.to))?.label || 'Overview';
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen((current) => !current); }
    }
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);
  const matchingBooks = runbooks.filter((book) => (book.title + ' ' + book.description).toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  const matchingRuns = investigations.filter((run) => (run.title + ' ' + run.id).toLowerCase().includes(query.toLowerCase())).slice(0, 3);
  function openSearchResult(path: string) { navigate(path); setSearchOpen(false); setQuery(''); }
  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    {menuOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
    <aside className={'sidebar ' + (menuOpen ? 'sidebar-open' : '')}>
      <Link className="brand" to="/" aria-label="OpsPilot overview"><Logo /><span>OpsPilot<small>DEVOPS AI WORKSPACE</small></span></Link>
      <div className="workspace-label"><span className="workspace-avatar"><GitBranch size={17} /></span><div>AWS Lab<small>Personal workspace</small></div><span className="tiny-chevron"><ChevronDown size={15} /></span></div>
      <p className="nav-caption">WORKSPACE</p>
      <nav aria-label="Main navigation">{navigation.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => 'nav-item ' + (isActive ? 'active' : '')}><Icon size={19} /><span>{label}</span>{to === '/reviews' && pending > 0 && <span className="nav-count">{pending}</span>}</NavLink>)}</nav>
      <div className="sidebar-note"><span className="small-orbit"><Activity size={20} /></span><p>Built for calmer<br /><strong>operations.</strong></p><small>Knowledge. Evidence. Clear next steps.</small></div>
      <div className="sidebar-bottom"><NavLink to="/settings" className={({ isActive }) => 'nav-item ' + (isActive ? 'active' : '')}><Settings size={19} /><span>Settings</span></NavLink><div className="profile"><span className="profile-avatar">BR</span><div>Bawantha Rathnayake<small>Workspace owner · Demo</small></div><span className="profile-dot" /></div><p className="sidebar-version">OpsPilot v0.1.0 <span>Frontend milestone</span></p></div>
    </aside>
    <div className="main-shell">
      <header className="topbar"><div className="topbar-location"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={22} /></button><span className="breadcrumb-root">Workspace</span><span className="breadcrumb-slash">/</span><strong>{pageTitle}</strong></div><div className="topbar-actions"><button className="global-search" onClick={() => setSearchOpen(true)} aria-label="Search workspace"><Search size={16} /><span>Search workspace</span><kbd><Command size={11} /> K</kbd></button><span className="demo-label"><span className="status-dot" />Demo workspace</span><label className="environment-select"><span className="sr-only">Environment</span><span className={'environment-dot ' + environment} /><select aria-label="Environment" value={environment} onChange={(event) => setEnvironment(event.target.value as Environment)}>{Object.entries(environmentLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><ChevronDown size={14} /></label></div></header>
      <main id="main-content" tabIndex={-1}>
        <Routes><Route path="/" element={<Overview />} /><Route path="/investigations" element={<Investigations />} /><Route path="/investigations/:id" element={<Investigations />} /><Route path="/knowledge" element={<Knowledge />} /><Route path="/tools" element={<Tools />} /><Route path="/reviews" element={<Reviews />} /><Route path="/settings" element={<SettingsPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>
        <footer className="workspace-footer"><span><span className="status-dot" />Sample data. No live AWS, GitHub or cluster connection.</span><span>Designed for human judgment <ArrowUpRight size={12} /></span></footer>
      </main>
    </div>
    <Toast message={toast} />
    <Modal open={searchOpen} title="Search your workspace" onClose={() => setSearchOpen(false)}>
      <div className="search-field large"><Search size={18} /><input autoFocus aria-label="Search runbooks and investigations" placeholder="Search runbooks or investigations…" value={query} onChange={(event) => setQuery(event.target.value)} /><button className="icon-button" aria-label="Clear search" onClick={() => setQuery('')}><X size={16} /></button></div>
      <p className="list-label">KNOWLEDGE</p><div className="search-results">{matchingBooks.map((book) => <button key={book.id} onClick={() => openSearchResult('/knowledge?book=' + book.id)}><BookOpen size={17} /><span>{book.title}<small>{book.category}</small></span><ArrowUpRight size={16} /></button>)}</div>
      <p className="list-label">INVESTIGATIONS</p><div className="search-results">{matchingRuns.map((run) => <button key={run.id} onClick={() => openSearchResult('/investigations/' + run.id)}><Sparkles size={17} /><span>{run.title}<small>{run.id}</small></span><ArrowUpRight size={16} /></button>)}</div>
      {!matchingBooks.length && !matchingRuns.length && <p className="muted">No matching documents or investigations.</p>}
      <p className="modal-footnote"><Check size={14} /> Searches the current browser workspace.</p>
    </Modal>
  </div>;
}

