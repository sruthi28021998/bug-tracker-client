import { useState } from 'react';
import toast from 'react-hot-toast';
import { api, upload, SERVER } from '../api';
import { useAuth } from '../context/AuthContext';
import { can } from '../utils/permissions';
import Comments from './Comments';
import ConfirmDialog from './ConfirmDialog';

export default function TicketModal({ ticket, project, role, onClose, onSaved }) {
  const { user } = useAuth();
  const isNew = !ticket;
  const readOnly = !isNew && !can(role, 'ticket:edit');
  const canDelete = !isNew && (can(role, 'ticket:delete:any') || (role !== 'viewer' && ticket.reporter?._id === user.id));

  const [f, setF] = useState({
    title: ticket?.title || '', description: ticket?.description || '',
    type: ticket?.type || 'bug', priority: ticket?.priority || 'medium',
    status: ticket?.status || 'todo', assignee: ticket?.assignee?._id || '',
  });
  const [files, setFiles] = useState([]);
  const [attachments, setAttachments] = useState(ticket?.attachments || []);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    if (readOnly) return;
    setSaving(true);
    try {
      const body = { ...f, assignee: f.assignee || null };
      if (isNew) {
        const t = await api('/tickets', 'POST', { ...body, projectId: project._id });
        if (files.length) await upload(`/tickets/${t._id}/attachments`, files);
      } else {
        await api(`/tickets/${ticket._id}`, 'PUT', body);
      }
      toast.success(isNew ? 'Ticket created' : 'Ticket updated');
      onSaved();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const del = async () => {
    try {
      await api(`/tickets/${ticket._id}`, 'DELETE');
      toast.success('Ticket deleted');
      onSaved();
    } catch (err) { toast.error(err.message); setConfirm(false); }
  };

  const addFiles = async (e) => {
    const picked = [...e.target.files];
    e.target.value = '';
    if (!picked.length) return;
    if (isNew) return setFiles(picked);
    try {
      const t = await upload(`/tickets/${ticket._id}/attachments`, picked);
      setAttachments(t.attachments);
      toast.success('Uploaded');
    } catch (err) { toast.error(err.message); }
  };

  const removeAttachment = async (id) => {
    try {
      const t = await api(`/tickets/${ticket._id}/attachments/${id}`, 'DELETE');
      setAttachments(t.attachments);
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-3">{isNew ? 'New ticket' : readOnly ? 'Ticket' : 'Edit ticket'}</h2>
        <form onSubmit={save}>
          <fieldset disabled={readOnly} className="space-y-2">
            <input className="input" placeholder="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required />
            <textarea className="input" rows="3" placeholder="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select className="input" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
                <option value="bug">Bug</option><option value="feature">Feature</option>
              </select>
              <select className="input" value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value })}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
              <select className="input" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
                <option value="todo">To Do</option><option value="inprogress">In Progress</option><option value="done">Done</option>
              </select>
              <select className="input" value={f.assignee} onChange={(e) => setF({ ...f, assignee: e.target.value })}>
                <option value="">Unassigned</option>
                {project.teamMembers.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>

            <div>
              <p className="text-sm font-semibold mb-1">Screenshots</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {attachments.map((a) => (
                  <div key={a._id} className="relative">
                    <a href={`${SERVER}/uploads/${a.filename}`} target="_blank" rel="noreferrer">
                      <img src={`${SERVER}/uploads/${a.filename}`} alt={a.originalName} className="h-20 w-20 object-cover rounded border" />
                    </a>
                    {!readOnly && (
                      <button type="button" onClick={() => removeAttachment(a._id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
                    )}
                  </div>
                ))}
              </div>
              {!readOnly && <input type="file" accept="image/*" multiple onChange={addFiles} className="text-sm" />}
              {isNew && files.length > 0 && <p className="text-xs text-gray-500 mt-1">{files.length} file(s) will upload on save</p>}
            </div>
          </fieldset>

          <div className="flex gap-2 pt-3">
            {!readOnly && <button className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>}
            <button type="button" className="btn-ghost" onClick={onClose}>{readOnly ? 'Close' : 'Cancel'}</button>
            {canDelete && (
              <button type="button" onClick={() => setConfirm(true)} className="ml-auto text-red-600 text-sm">Delete ticket</button>
            )}
          </div>
        </form>

        {!isNew && <Comments ticketId={ticket._id} canComment={can(role, 'comment:create')} />}
      </div>

      {confirm && (
        <ConfirmDialog message="Delete this ticket and its comments permanently?" onConfirm={del} onCancel={() => setConfirm(false)} />
      )}
    </div>
  );
}