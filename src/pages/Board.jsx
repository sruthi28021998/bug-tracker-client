import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { api } from '../api';
import { socket } from '../socket';
import { useAuth } from '../context/AuthContext';
import { getRole, can } from '../utils/permissions';
import TicketModal from '../components/TicketModal';
import Members from '../components/Members';
import Filters from '../components/Filters';

const COLS = [['todo', 'To Do'], ['inprogress', 'In Progress'], ['done', 'Done']];
const pc = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-red-100 text-red-700' };

export default function Board() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(undefined); // undefined = closed, null = new, object = edit
  const [filters, setFilters] = useState({ search: '', status: '', priority: '', assignee: '', sort: 'newest' });

  const loadProject = useCallback(
    () => api(`/projects/${id}`).then(setProject).catch((e) => toast.error(e.message)),
    [id]
  );
  useEffect(() => { setProject(null); loadProject(); }, [loadProject]);

  const loadTickets = useCallback(() => {
    const p = new URLSearchParams({ projectId: id });
    Object.entries(filters).forEach(([k, v]) => v && p.set(k, v));
    return api(`/tickets?${p}`).then(setTickets).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, [id, filters]);

  // debounce so typing in search doesn't fire a request per keystroke
  useEffect(() => {
    const t = setTimeout(loadTickets, 250);
    return () => clearTimeout(t);
  }, [loadTickets]);

  // real-time updates
  useEffect(() => {
    socket.auth = { token: localStorage.getItem('token') };
    socket.connect();
    const join = () => socket.emit('joinProject', id);
    socket.on('connect', join);
    if (socket.connected) join();
    socket.on('project:changed', loadProject);
    return () => {
      socket.emit('leaveProject', id);
      socket.off('connect', join);
      socket.off('project:changed', loadProject);
      socket.disconnect();
    };
  }, [id, loadProject]);

  useEffect(() => {
    socket.on('ticket:changed', loadTickets);
    return () => socket.off('ticket:changed', loadTickets);
  }, [loadTickets]);

  const onDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination || destination.droppableId === source.droppableId) return;
    const status = destination.droppableId;
    setTickets((ts) => ts.map((t) => (t._id === draggableId ? { ...t, status } : t)));
    try { await api(`/tickets/${draggableId}`, 'PUT', { status }); }
    catch (err) { toast.error(err.message); loadTickets(); }
  };

  if (!project) return <p>Loading...</p>;
  const role = getRole(project, user.id);
  const canEdit = can(role, 'ticket:edit');

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <p className="text-sm text-gray-500">{project.description} · Your role: <b>{role}</b></p>
        </div>
        {can(role, 'ticket:create') && <button className="btn" onClick={() => setModal(null)}>+ New ticket</button>}
      </div>

      <Members project={project} role={role} onChange={setProject} />
      <Filters filters={filters} setFilters={setFilters} members={project.teamMembers} />

      {loading ? <p>Loading tickets...</p> : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid gap-4 md:grid-cols-3">
            {COLS.map(([key, label]) => {
              const list = tickets.filter((t) => t.status === key);
              return (
                <Droppable droppableId={key} key={key}>
                  {(prov, snap) => (
                    <div ref={prov.innerRef} {...prov.droppableProps}
                      className={`rounded p-3 min-h-[200px] ${snap.isDraggingOver ? 'bg-indigo-100' : 'bg-gray-200'}`}>
                      <h3 className="font-semibold mb-2">{label} <span className="text-gray-500">({list.length})</span></h3>
                      {list.map((t, i) => (
                        <Draggable key={t._id} draggableId={t._id} index={i} isDragDisabled={!canEdit}>
                          {(p) => (
                            <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}
                              onClick={() => setModal(t)} className="bg-white rounded shadow p-3 mb-2 cursor-pointer">
                              <p className="font-medium text-sm">{t.title}</p>
                              <div className="flex flex-wrap gap-1 mt-2 text-xs">
                                <span className={`px-2 py-0.5 rounded ${pc[t.priority]}`}>{t.priority}</span>
                                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">{t.type}</span>
                                {t.attachments?.length > 0 && <span className="px-2 py-0.5 rounded bg-gray-100">📎 {t.attachments.length}</span>}
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                {t.assignee ? `👤 ${t.assignee.name}` : 'Unassigned'} · {new Date(t.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {prov.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      )}

      {modal !== undefined && (
        <TicketModal ticket={modal} project={project} role={role} onClose={() => setModal(undefined)}
          onSaved={() => { setModal(undefined); loadTickets(); }} />
      )}
    </div>
  );
}