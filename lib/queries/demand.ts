import { useQuery } from '@tanstack/react-query';
import { formatRFC3339 } from 'date-fns';
import type { z } from 'zod';

import { createSupabase } from '@/lib/client/supabase';
import type {
  demandRequestSchema,
  demandResponseSchema,
} from '@/supabase/functions/_lib/smartgrid';

export const useDemand = (params: z.infer<typeof demandRequestSchema>) => {
  const supabase = createSupabase();
  return useQuery({
    queryKey: ['demand', ...Object.entries(params).map(([k, v]) => `${k}=${v}`)],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<
        z.infer<typeof demandResponseSchema>['Rows']
      >('smartgrid', {
        body: {
          ...params,
          from: formatRFC3339(params.from),
          to: formatRFC3339(params.to),
          _type: 'demand',
        },
      });
      if (error) throw error;
      return data;
    },
  });
};
