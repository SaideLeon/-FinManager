
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hukazotakydeddksyyoc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ie97UCCvEZgxA_Kbjg240Q_ilfqRiya';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
