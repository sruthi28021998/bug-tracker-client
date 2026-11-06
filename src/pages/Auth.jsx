import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Auth({ mode }) {
  const isLogin = mode === 'login';
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      isLogin ? await login(f) : await register(f);
      nav('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-bold text-indigo-600">{isLogin ? 'Login' : 'Create account'}</h1>
        {!isLogin && <input className="input" placeholder="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />}
        <input className="input" type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required />
        <input className="input" type="password" placeholder="Password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required />
        <button className="btn w-full" disabled={loading}>{loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}</button>
        <p className="text-sm text-center">
          {isLogin ? 'No account? ' : 'Have an account? '}
          <Link className="text-indigo-600" to={isLogin ? '/register' : '/login'}>{isLogin ? 'Register' : 'Login'}</Link>
        </p>
      </form>
    </div>
  );
}