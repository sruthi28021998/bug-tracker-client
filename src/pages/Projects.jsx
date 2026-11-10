import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [f, setF] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);

  const load = () => api('/projects').then(setProjects).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await api('/projects', 'POST', f);
      setF({ title: '', description: '' });
      toast.success('Project created');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { await api(`/projects/${id}`, 'DELETE'); toast.success('Deleted'); load(); }
    catch (err) { toast.error(err.message); }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="text-sm">{user.name} · <button onClick={logout} className="text-red-500">Logout</button></div>
      </div>
      <form onSubmit={create} className="bg-white p-4 rounded shadow mb-6 grid gap-2 md:grid-cols-3">
        <input className="input" placeholder="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required />
        <input className="input" placeholder="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        <button className="btn">Create project</button>
      </form>
      {loading ? <p>Loading...</p> : projects.length === 0 ? <p className="text-gray-500">No projects yet.</p> : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded shadow">
              <Link to={`/projects/${p._id}`} className="text-lg font-semibold text-indigo-600">{p.title}</Link>
              <p className="text-sm text-gray-500 my-1">{p.description || 'No description'}</p>
              <p className="text-xs text-gray-400">{p.teamMembers.length} member(s)</p>
              {p.owner._id === user.id && <button onClick={() => remove(p._id)} className="text-red-500 text-sm mt-2">Delete</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}