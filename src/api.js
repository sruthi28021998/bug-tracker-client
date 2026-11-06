export const SERVER = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
const BASE = `${SERVER}/api`;

const handle = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const api = async (path, method = 'GET', body) => {
  const token = localStorage.getItem('token');
  return handle(await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: body ? JSON.stringify(body) : undefined,
  }));
};

export const upload = async (path, files) => {
  const fd = new FormData();
  [...files].forEach((f) => fd.append('files', f));
  return handle(await fetch(BASE + path, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: fd,
  }));
};