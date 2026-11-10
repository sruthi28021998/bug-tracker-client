import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { getRole, can } from '../utils/permissions';
import TicketModal from '../components/TicketModal';
import Members from '../components/Members';

const pc = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-red-100 text-red-700' };
const sl = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' };

export default function Board() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(undefined); // undefined = closed, null = new, object = edit

  useEffect(() => {
    api(`/projects/${id}`).then(setProject).catch((e) => toast.error(e.message));
  }, [id]);

  const loadTickets = useCallback(
    () => api(`/tickets?projectId=${id}`).then(setTickets).catch((e) => toast.error(e.message)).finally(() => setLoading(false)),
    [id]
  );
  useEffect(() => { loadTickets(); }, [loadTickets]);

  if (!project) return <p className="p-6">Loading...</p>;
  const role = getRole(project, user.id);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <Link to="/" className="text-sm text-indigo-600">← Projects</Link>
      <div className="flex flex-wrap items-center justify-between gap-2 my-3">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <p className="text-sm text-gray-500">{project.description} · Your role: <b>{role}</b></p>
        </div>
        {can(role, 'ticket:create') && <button className="btn" onClick={() => setModal(null)}>+ New ticket</button>}
      </div>

      <Members project={project} role={role} onChange={setProject} />

      {loading ? <p>Loading tickets...</p> : tickets.length === 0 ? (
        <p className="text-gray-500">No tickets yet.</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3">Title</th><th className="p-3">Type</th><th className="p-3">Priority</th>
                <th className="p-3">Status</th><th className="p-3">Assignee</th><th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t._id} onClick={() => setModal(t)} className="border-t hover:bg-gray-50 cursor-pointer">
                  <td className="p-3 font-medium">{t.title}{t.attachments?.length > 0 && <span className="ml-2 text-xs">📎 {t.attachments.length}</span>}</td>
                  <td className="p-3 capitalize">{t.type}</td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs ${pc[t.priority]}`}>{t.priority}</span></td>
                  <td className="p-3">{sl[t.status]}</td>
                  <td className="p-3">{t.assignee ? t.assignee.name : 'Unassigned'}</td>
                  <td className="p-3">{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal !== undefined && (
        <TicketModal ticket={modal} project={project} role={role} onClose={() => setModal(undefined)}
          onSaved={() => { setModal(undefined); loadTickets(); }} />
      )}
    </div>
  );
}