import { useAuth } from '../context/AuthContext';

export const useLogout = () => {
  const { handleLogout, isLoggingOut } = useAuth();

  return {
    handleLogout,
    isLoggingOut,
  };
};