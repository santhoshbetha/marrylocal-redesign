import { createClient } from '@supabase/supabase-js';

export default async function aroundUsersWorker(params) {
  const { supabaseUrl, supabaseKey, userLat, userLng, userGender, searchdistance = 50 } = params;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const oppositeGender = userGender === 'Male' ? 'Female' : 'Male';

  // Use direct query instead of RPC to avoid potential issues
  const radiusMeters = searchdistance * 1000; // assuming searchdistance is in km

  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('gender', oppositeGender)
    .filter('location', 'st_dwithin', `POINT(${userLng} ${userLat}), ${radiusMeters}`);

  if (error) {
    console.error('Error in aroundUsersWorker:', error);
    return 0;
  }

  return count || 0;
}