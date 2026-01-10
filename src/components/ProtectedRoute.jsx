import { useAuth } from '../context/AuthContext';
import { Outlet, Navigate } from 'react-router-dom';

export function ProtectedRoute() {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to="/" replace />;
}
