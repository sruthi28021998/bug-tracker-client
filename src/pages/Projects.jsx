import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function Projects() {
  const { user } = useAuth();
  const { refreshProjects } = useOutletContext();
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
      refreshProjects();
    } catch (err) { toast.error(err.message); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this project and all its tickets?')) return;
    try {
      await api(`/projects/${id}`, 'DELETE');
      toast.success('Deleted');
      load();
      refreshProjects();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <form onSubmit={create} className="bg-white p-4 rounded shadow mb-6 grid gap-2 md:grid-cols-3">
        <input className="input" placeholder="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required />
        <input className="input" placeholder="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        <button className="btn">Create project</button>
      </form>
        {loading ? <Spinner /> : projects.length === 0 ? <p className="text-gray-500">No projects yet.</p> : (
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