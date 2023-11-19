import { createClient } from '@supabase/supabase-js';

import { parseCommonConfig } from '@/lib/config';
import type { Database } from '@/lib/database.types';

export const createSupabase = () => {
  const config = parseCommonConfig();
  return createClient<Database>(config.supabase.url, config.supabase.anonKey);
};
