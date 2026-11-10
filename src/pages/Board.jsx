import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { getRole } from '../utils/permissions';
import Members from '../components/Members';

export default function Board() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);

  useEffect(() => {
    api(`/projects/${id}`).then(setProject).catch((e) => toast.error(e.message));
  }, [id]);

  if (!project) return <p className="p-6">Loading...</p>;
  const role = getRole(project, user.id);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <Link to="/" className="text-sm text-indigo-600">← Projects</Link>
      <h1 className="text-2xl font-bold mt-2">{project.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{project.description} · Your role: <b>{role}</b></p>
      <Members project={project} role={role} onChange={setProject} />
      <p className="text-gray-500">Tickets will appear here.</p>
    </div>
  );
}