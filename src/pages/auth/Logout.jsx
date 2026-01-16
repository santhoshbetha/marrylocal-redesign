import { logout } from '../../store/actions/authActions';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import secureLocalStorage from 'react-secure-storage';
import supabase from '../../lib/supabase';

function Logout() {
  const dispatch = useDispatch();

  useEffect(() => {
    const logoutfunc = async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        alert('Something wrong. Try later again 22');
      }

      localStorage.removeItem('shortlistarray');
      localStorage.removeItem('page');
      localStorage.removeItem('userstate');
      localStorage.clear();
      secureLocalStorage.clear();
      dispatch(logout());
      window.location.reload(false);
      //window.location.href="/";
    };

    logoutfunc();
  }, [dispatch]);

  return <div className="mt-4">Logging out ...</div>;
}

export default Logout;
