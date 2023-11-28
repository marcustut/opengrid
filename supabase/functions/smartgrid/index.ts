import { z } from 'zod';

import { makeErrorResponse, makeSuccessResponse } from '../_lib/response.ts';
import { createSmartGrid, requestSchema } from '../_lib/smartgrid.ts';

const smartgrid = createSmartGrid();
const paramsSchema = z.discriminatedUnion('_type', [
  z.object({ _type: z.literal('demand') }).merge(requestSchema),
  z.object({ _type: z.literal('wind') }).merge(requestSchema),
]);

Deno.serve(async (req) => {
  // For CORS preflight request
  if (req.method === 'OPTIONS') return makeSuccessResponse('ok');
  if (req.method !== 'POST') return makeErrorResponse('Method not allowed', 405);

  try {
    const body = await req.json();
    const params = paramsSchema.parse(body);

    switch (params._type) {
      case 'demand': {
        const data = await smartgrid.demand(params);
        return makeSuccessResponse(data);
      }
      case 'wind': {
        const data = await smartgrid.wind(params);
        return makeSuccessResponse(data);
      }
    }
  } catch (e) {
    return makeErrorResponse(e);
  }
});
