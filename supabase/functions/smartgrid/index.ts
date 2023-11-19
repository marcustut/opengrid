import { z } from 'zod';

import { makeErrorResponse, makeSuccessResponse } from '../_lib/response.ts';
import { createSmartGrid, demandRequestSchema } from '../_lib/smartgrid.ts';

const smartgrid = createSmartGrid();
const paramsSchema = z.discriminatedUnion('_type', [
  z.object({ _type: z.literal('demand') }).merge(demandRequestSchema),
]);

Deno.serve(async (req) => {
  // For CORS preflight request
  if (req.method === 'OPTIONS') return makeSuccessResponse('ok');
  if (req.method !== 'POST') return makeErrorResponse('Method not allowed', 405);

  try {
    // const url = new URL(req.url);
    // const params = paramsSchema.parse(Object.fromEntries(url.searchParams));
    const body = await req.json();
    const params = paramsSchema.parse(body);

    switch (params._type) {
      case 'demand': {
        const data = await smartgrid.demand(params);
        return makeSuccessResponse(data);
      }
    }
  } catch (e) {
    return makeErrorResponse(e);
  }
});
