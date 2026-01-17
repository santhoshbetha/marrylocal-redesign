import { createContext, useState, useContext, useEffect } from 'react';
import supabase, { supabaseUrl, supabaseAnonKey } from '../lib/supabase.js';
import { getProfileData, updateUserInfo } from '../services/userService';
import { toast } from 'sonner';
import { useWorker } from '@koale/useworker';
import aroundUsersWorker from '../workers/aroundUsersWorker';

const AuthContext = createContext();

//https://stackoverflow.com/questions/72385641/supabase-onauthstatechanged-how-do-i-properly-wait-for-the-request-to-finish-p

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profiledata, setProfiledata] = useState(null);
  const [userSession, setUserSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const runWorker = useWorker(aroundUsersWorker);

  const setAuth = authUser => {
    setUser(authUser);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
      setIsLoggingOut(false);
    }
  };

  const updateUserData = async user => {
    if (!user) {
      setProfiledata(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    let res = await getProfileData(user?.id);
    if (res.success == true) {
      // Check if this is an admin user who just verified their email
      if (res.data.role === 'admin' && res.data.userstate === 'inactive' && user?.email_confirmed_at) {
        // Update admin userstate to active after email verification
        const { error: updateError } = await supabase
          .from('users')
          .update({ userstate: 'active' })
          .eq('userid', user.id);

        if (!updateError) {
          // Update the profile data with the new userstate
          res.data.userstate = 'active';
        }
      }
      setProfiledata({ ...res.data });

      // Run worker to update arounduserscount if needed
      if (res.data.arounduserscount == null || res.data.arounduserscount <= 100) {
        runWorker({
          supabaseUrl,
          supabaseAnonKey,
          userLat: res.data.lat,
          userLng: res.data.lng,
          userGender: res.data.gender,
          searchdistance: 50 // assuming km or whatever unit
        }).then(async (count) => {
          await updateUserInfo(user.id, { arounduserscount: count });
          setProfiledata(prev => ({ ...prev, arounduserscount: count }));
        }).catch(error => {
          console.error('Error updating arounduserscount:', error);
        });
      }
    } else {
      setProfiledata(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        updateUserData(session?.user);
      } else {
        setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setAuth(session?.user);
        setUserSession(session);
        updateUserData(session?.user);
      } else {
        setAuth(null);
        setUserSession(null);
        setProfiledata(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profiledata,
        setAuth,
        userSession,
        setProfiledata,
        loading,
        isLoggingOut,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
