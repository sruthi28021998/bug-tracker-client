import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Projects from './pages/Projects';
import Board from './pages/Board';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Projects />} />
        <Route path="/projects/:id" element={<Board />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}