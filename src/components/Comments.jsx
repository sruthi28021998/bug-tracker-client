import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';
import { socket } from '../socket';
import { useAuth } from '../context/AuthContext';

function Node({ c, all, canComment, onReply, onDelete, me }) {
  const [reply, setReply] = useState('');
  const [show, setShow] = useState(false);
  const kids = all.filter((x) => x.parentId === c._id);
  return (
    <div className="mt-2">
      <div className="bg-gray-100 rounded p-2 text-sm">
        <b>{c.userId?.name}</b> <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
        <p>{c.text}</p>
        {canComment && <button className="text-xs text-indigo-600 mr-2" onClick={() => setShow(!show)}>Reply</button>}
        {c.userId?._id === me && <button className="text-xs text-red-500" onClick={() => onDelete(c._id)}>Delete</button>}
      </div>
      {show && (
        <div className="flex gap-2 mt-1 ml-4">
          <input className="input" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply..." />
          <button className="btn" onClick={() => { onReply(reply, c._id); setReply(''); setShow(false); }}>Send</button>
        </div>
      )}
      <div className="ml-4 border-l pl-2">
        {kids.map((k) => <Node key={k._id} c={k} all={all} canComment={canComment} onReply={onReply} onDelete={onDelete} me={me} />)}
      </div>
    </div>
  );
}

export default function Comments({ ticketId, canComment }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  const load = () => api(`/comments?ticketId=${ticketId}`).then(setComments).catch(() => {});

  useEffect(() => {
    load();
    const h = (p) => { if (p.ticketId === ticketId) load(); };
    socket.on('comment:changed', h);
    return () => socket.off('comment:changed', h);
  }, [ticketId]);

  const add = async (t, parentId = null) => {
    if (!t.trim()) return;
    try { await api('/comments', 'POST', { ticketId, text: t, parentId }); load(); }
    catch (err) { toast.error(err.message); }
  };
  const del = async (id) => {
    try { await api(`/comments/${id}`, 'DELETE'); load(); } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="mt-5 border-t pt-3">
      <h3 className="font-semibold mb-1">Comments</h3>
      {comments.length === 0 && <p className="text-sm text-gray-400">No comments yet.</p>}
      {comments.filter((c) => !c.parentId).map((c) => (
        <Node key={c._id} c={c} all={comments} canComment={canComment} onReply={add} onDelete={del} me={user.id} />
      ))}
      {canComment && (
        <div className="flex gap-2 mt-3">
          <input className="input" placeholder="Add a comment..." value={text} onChange={(e) => setText(e.target.value)} />
          <button className="btn" onClick={() => { add(text); setText(''); }}>Post</button>
        </div>
      )}
    </div>
  );
}