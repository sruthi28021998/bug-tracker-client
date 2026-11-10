import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';
import { can } from '../utils/permissions';

export default function Members({ project, role, onChange }) {
  const [email, setEmail] = useState('');
  const [newRole, setNewRole] = useState('developer');
  const manage = can(role, 'member:manage');

  const run = async (fn, msg) => {
    try { onChange(await fn()); if (msg) toast.success(msg); }
    catch (err) { toast.error(err.message); }
  };
  const add = (e) => {
    e.preventDefault();
    run(() => api(`/projects/${project._id}/members`, 'POST', { email, role: newRole }), 'Member added');
    setEmail('');
  };
  const changeRole = (id, r) => run(() => api(`/projects/${project._id}/members/${id}`, 'PUT', { role: r }));
  const remove = (id) => run(() => api(`/projects/${project._id}/members/${id}`, 'DELETE'));

  return (
    <div className="bg-white rounded shadow p-3 mb-4">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-semibold">Team:</span>
        {project.teamMembers.map((m) => {
          const isOwner = project.owner._id === m._id;
          return (
            <span key={m._id} className="bg-gray-100 text-xs px-2 py-1 rounded flex items-center gap-1">
              {m.name}
              {isOwner ? <b>(admin)</b> : manage ? (
                <select className="bg-transparent" value={(project.roles || {})[m._id] || 'developer'} onChange={(e) => changeRole(m._id, e.target.value)}>
                  <option value="manager">manager</option><option value="developer">developer</option><option value="viewer">viewer</option>
                </select>
              ) : <i>({(project.roles || {})[m._id] || 'developer'})</i>}
              {manage && !isOwner && <button onClick={() => remove(m._id)} className="text-red-500">×</button>}
            </span>
          );
        })}
        {manage && (
          <form onSubmit={add} className="flex gap-2 ml-auto">
            <input className="input !w-44" type="email" placeholder="Invite by email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <select className="input !w-32" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              <option value="manager">manager</option><option value="developer">developer</option><option value="viewer">viewer</option>
            </select>
            <button className="btn">Add</button>
          </form>
        )}
      </div>
    </div>
  );
}