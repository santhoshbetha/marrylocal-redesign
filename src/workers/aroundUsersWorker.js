import { createClient } from '@supabase/supabase-js';

export default async function aroundUsersWorker(params) {
  const { supabaseUrl, supabaseKey, userLat, userLng, userGender, searchdistance = 50 } = params;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const cols = {
    gender: userGender === 'Male' ? 'Female' : 'Male',
    state: '',
    jobstatus: '',
    agefrom: 18,
    ageto: 100,
    lat: userLat,
    long: userLng,
    searchdistance: searchdistance,
  };

  const { data, error } = await supabase.rpc('search_by_distance', cols);

  if (error) {
    console.error('Error in aroundUsersWorker:', error);
    return 0;
  }

  return data ? data.length : 0;
}