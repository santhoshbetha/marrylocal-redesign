import { useAuth } from '../context/AuthContext';
import { Outlet, Navigate } from 'react-router-dom';

function ProtectedRoute() {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;
