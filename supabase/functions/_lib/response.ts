import { ZodError } from 'zod';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const headers = { 'Content-Type': 'application/json', ...corsHeaders };

export const makeSuccessResponse = <T>(data: T) =>
  new Response(JSON.stringify({ data, error: null }), { status: 200, headers });
export const makeErrorResponse = (e: unknown, status?: number) => {
  const error =
    e instanceof ZodError
      ? e.flatten((issue) => ({ message: issue.message, errorCode: issue.code }))
      : e instanceof Error
        ? e.message
        : `${e}`;
  return new Response(JSON.stringify({ data: null, error }), { status: status ?? 404, headers });
};
