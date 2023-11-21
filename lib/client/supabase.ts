import { createClient } from '@supabase/supabase-js';
import { useMemo } from 'react';

import { parseCommonConfig } from '@/lib/config';
import type { Database } from '@/lib/database.types';

export const createSupabase = () => {
  const config = parseCommonConfig();
  return createClient<Database>(config.supabase.url, config.supabase.anonKey);
};

const supabase = createSupabase();

export const useSupabase = () => useMemo(() => supabase, []);

export type Supabase = ReturnType<typeof createSupabase>;
