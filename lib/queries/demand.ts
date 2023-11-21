import { useQuery } from '@tanstack/react-query';
import { formatRFC3339, parseISO } from 'date-fns';
import { z } from 'zod';

import type { Supabase } from '@/lib/client/supabase';
import type { Response } from '@/supabase/functions/_lib/response';
import type { demandRequestSchema } from '@/supabase/functions/_lib/smartgrid';
import { demandSchema } from '@/supabase/functions/_lib/smartgrid';

const fetchDemand = (supabase: Supabase) => async (params: z.infer<typeof demandRequestSchema>) => {
  const { data, error } = await supabase.functions.invoke<Response<z.infer<typeof demandSchema>>>(
    'smartgrid',
    {
      body: {
        ...params,
        from: formatRFC3339(params.from),
        to: formatRFC3339(params.to),
        _type: 'demand',
      },
    },
  );
  if (error || !data) throw error instanceof Error ? error : new Error(`${error}`);
  if (data.error) throw new Error(data.error);
  return demandSchema
    .omit({ EffectiveTime: true })
    .merge(z.object({ EffectiveTime: z.string().transform((x) => parseISO(x)) }))
    .array()
    .parse(data.data);
};

export const demand = {
  queryKey: (params: z.infer<typeof demandRequestSchema>) => [
    'demand',
    ...Object.entries(params).map(([k, v]) => `${k}=${v instanceof Date ? formatRFC3339(v) : v}`),
  ],
  queryFn: fetchDemand,
  useQuery: (supabase: Supabase) => (params: z.infer<typeof demandRequestSchema>) =>
    useQuery({
      queryKey: demand.queryKey(params),
      queryFn: () => demand.queryFn(supabase)(params),
    }),
};
