import { logout } from '../../store/actions/authActions';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import supabase from '../../lib/supabase';

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const logoutfunc = async () => {
      // Create AbortController for timeout handling
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, 10000); // 10 second timeout

      try {
        // Use Promise.race to make signOut abortable
        await Promise.race([
          supabase.auth.signOut(),
          new Promise((_, reject) => {
            abortController.signal.addEventListener('abort', () => {
              reject(new Error('Logout timeout'));
            });
          })
        ]);
      } catch (error) {
        if (error.message === 'Logout timeout') {
          console.warn('Logout request timed out after 10 seconds');
        } else {
          console.warn('Logout error:', error);
        }
      } finally {
        // Always clear timeout
        clearTimeout(timeoutId);
      }

      // Always clear local storage and session data, even if logout was aborted
      try {
        localStorage.removeItem('shortlistarray');
        localStorage.removeItem('page');
        localStorage.removeItem('userstate');
        localStorage.clear();
        secureLocalStorage.clear();

        // Clear any cached data
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => {
              caches.delete(name);
            });
          });
        }

        // Clear session storage
        sessionStorage.clear();

        dispatch(logout());
        navigate('/');
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
        // Still proceed with logout even if cleanup fails
        dispatch(logout());
        navigate('/');
      }
    };

    logoutfunc();
  }, [dispatch]);

  return (
    <div className="mt-2 sm:mt-4 text-sm sm:text-base leading-tight px-2 sm:px-0">
      Logging out ...
    </div>
  );
}

export default Logout;
