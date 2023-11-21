import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.5';

import type { Database } from './database.types.ts';

export const createSupabase = ({ url, key }: { url: string; key: string }) =>
  createClient<Database>(url, key);

export type Supabase = ReturnType<typeof createSupabase>;
