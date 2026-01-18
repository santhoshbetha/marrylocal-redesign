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

  //console.log('Getting around users count for:', { lat, lng, userGender });

  if (isNaN(lat) || isNaN(lng)) {
    //console.error('Invalid lat/lng:', userLat, userLng);
    return 0;
  }

  // Haversine distance calculation function
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  //console.log('Fetching around users count for:', { lat, lng, oppositeGender });

  // First get all users of opposite gender with their coordinates
  const { data: users, error } = await supabase
    .from('users')
    .select('latitude, longitude')
    .eq('gender', oppositeGender)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);

  if (error) {
    //console.error('Error getting around users:', error);
    return 0;
  }

  // Filter users within radius using haversine distance
  const usersWithinRadius = users.filter(user => {
    const distance = haversineDistance(lat, lng, parseFloat(user.latitude), parseFloat(user.longitude));
    return distance <= radiusMeters;
  });

  const count = usersWithinRadius.length;
  //console.log('Around users count:', count);
  return count;
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

      // Run worker to update arounduserscount if needed
      if (!countUpdatedRef.current && (res.data.arounduserscount == null || res.data.arounduserscount <= 100) && res.data.latitude && res.data.longitude) {
        countUpdatedRef.current = true;
        getAroundUsersCount(supabaseUrl, supabaseAnonKey, res.data.latitude, res.data.longitude, res.data.gender)
          .then(async (count) => {
            //console.log('Around users count:', count);
            await updateUserInfo(user.id, { arounduserscount: count });
            setProfiledata(prev => ({ ...prev, arounduserscount: count }));
          })
          .catch(error => {
            //console.error('Error updating arounduserscount:', error);
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
