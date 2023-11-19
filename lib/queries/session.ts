import { useQuery } from '@tanstack/react-query';

import { createSupabase } from '@/lib/client/supabase';

export const useSession = () => {
  const supabase = createSupabase();
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const session = await supabase.auth.getSession();
      if (session.error) throw session.error;
      return session.data;
    },
  });
};
