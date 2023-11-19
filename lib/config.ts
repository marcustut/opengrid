import { z } from 'zod';

const CommonConfig = z.object({
  supabase: z.object({
    url: z.string().url(),
    anonKey: z.string(),
  }),
});

export const parseCommonConfig = () =>
  CommonConfig.parse({
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  });
