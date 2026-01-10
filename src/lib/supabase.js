import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
//export const supabase2 = createClient("http://localhost:54321", supabaseAnonKey)

export default supabase;
