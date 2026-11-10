import { useEffect, useState, useCallback } from 'react';
import { Outlet, Link, useNavigate, useMatch, useLocation } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const match = useMatch('/projects/:id');
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);

  const loadProjects = useCallback(() => api('/projects').then(setProjects).catch(() => {}), []);

  useEffect(() => { loadProjects(); }, [loadProjects, loc.pathname]);
  useEffect(() => { setOpen(false); }, [loc.pathname]);

  const current = projects.find((p) => p._id === match?.params.id);

  return (
    <div className="min-h-screen md:flex">
      <aside className={`bg-gray-900 text-gray-100 md:w-60 p-4 space-y-4 ${open ? '' : 'hidden'} md:block`}>
        <h2 className="text-xl font-bold">🐞 BugTracker</h2>
        <Link to="/" className="block hover:text-indigo-300">Dashboard</Link>
        <select className="w-full bg-gray-800 rounded p-2 text-sm" value={match?.params.id || ''}
          onChange={(e) => e.target.value && nav(`/projects/${e.target.value}`)}>
          <option value="">Select project...</option>
          {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
        </select>
        <div className="pt-4 border-t border-gray-700 text-sm">
          <p className="mb-2">{user.name}</p>
          <button onClick={() => { logout(); nav('/login'); }} className="text-red-300">Logout</button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <button className="md:hidden btn-ghost" onClick={() => setOpen(!open)}>☰</button>
          <nav className="text-sm text-gray-500">
            <Link to="/" className="hover:underline">Home</Link>
            {match && <> / <span className="text-gray-800">{current?.title || 'Project'}</span></>}
          </nav>
        </div>
        <Outlet context={{ refreshProjects: loadProjects }} />
      </main>
    </div>
  );
}