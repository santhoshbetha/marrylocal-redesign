import { createContext, useState, useContext, useEffect } from 'react';
import supabase from '../lib/supabase.js';
import { getProfileData } from '../services/userService';

const AuthContext = createContext();

//https://stackoverflow.com/questions/72385641/supabase-onauthstatechanged-how-do-i-properly-wait-for-the-request-to-finish-p

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profiledata, setProfiledata] = useState(null);
  const [userSession, setUserSession] = useState(null);

  const setAuth = authUser => {
    setUser(authUser);
  };

  const updateUserData = async user => {
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
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserSession(session);
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setAuth(session?.user);
        setUserSession(session);
        updateUserData(session?.user);
      } else {
        setAuth(null);
        setUserSession(null);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
