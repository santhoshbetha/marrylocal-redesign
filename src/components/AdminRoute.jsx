import { useAuth } from '../context/AuthContext';
import { Outlet, Navigate } from 'react-router-dom';

export function AdminRoute() {
  const { user, profiledata } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (profiledata?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}