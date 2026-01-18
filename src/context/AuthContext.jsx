import { createContext, useState, useContext, useEffect, useRef } from 'react';
import supabase, { supabaseUrl, supabaseAnonKey } from '../lib/supabase.js';
import { getProfileData, updateUserInfo } from '../services/userService';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

const AuthContext = createContext();

//https://stackoverflow.com/questions/72385641/supabase-onauthstatechanged-how-do-i-properly-wait-for-the-request-to-finish-p

const getAroundUsersCount = async (supabaseUrl, supabaseKey, userLat, userLng, userGender) => {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const oppositeGender = userGender === 'Male' ? 'Female' : 'Male';
  const radiusMeters = 50 * 1000; // 50km in meters

  const lat = parseFloat(userLat);
  const lng = parseFloat(userLng);

  console.log('Getting around users count for:', { lat, lng, userGender });

  if (isNaN(lat) || isNaN(lng)) {
    console.error('Invalid lat/lng:', userLat, userLng);
    return 0;
  }

  console.log('Fetching around users count for:', { lat, lng, oppositeGender });

  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('gender', oppositeGender);

  console.log('Around users count result:', { count, error });

  if (error) {
    console.error('Error getting around users count:', error);
    return 0;
  }
  console.log('Around users count:', count);
  return count || 0;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profiledata, setProfiledata] = useState(null);
  const [userSession, setUserSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isUpdatingRef = useRef(false);
  const countUpdatedRef = useRef(false);

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
    if (!user || isUpdatingRef.current) {
      return;
    }

    console.log('Updating user data for:', user?.id);

    isUpdatingRef.current = true;
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

      console.log('Profile data updated:', res.data);
      console.log('Profile data res.data.lat:', res.data.latitude);
      console.log('Profile data res.data.lng:', res.data.longitude);
      console.log('Profile data res.data.gender:', res.data.gender);

      // Run worker to update arounduserscount if needed
      if (!countUpdatedRef.current && (res.data.arounduserscount == null || res.data.arounduserscount <= 100) && res.data.latitude && res.data.longitude) {
        countUpdatedRef.current = true;
        getAroundUsersCount(supabaseUrl, supabaseAnonKey, res.data.latitude, res.data.longitude, res.data.gender)
          .then(async (count) => {
            console.log('Around users count:', count);
            await updateUserInfo(user.id, { arounduserscount: count });
            setProfiledata(prev => ({ ...prev, arounduserscount: count }));
          })
          .catch(error => {
            console.error('Error updating arounduserscount:', error);
            countUpdatedRef.current = false; // Reset on error to allow retry
          });
      }
    } else {
      setProfiledata(null);
    }
    setLoading(false);
    isUpdatingRef.current = false;
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
        countUpdatedRef.current = false; // Reset for next login
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
