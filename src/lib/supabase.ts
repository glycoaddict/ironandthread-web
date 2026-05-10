import { createClient } from '@supabase/supabase-js';

export const createClerkSupabaseClient = (session: any) => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // This is your 'anon' key
    {
      global: {
        fetch: async (url, options = {}) => {
          const clerkToken = await session.getToken({ template: 'supabase' });

          // THE FIX: Explicitly set both headers
          const headers = new Headers(options.headers);
          
          // 1. Authorization header MUST be the Clerk JWT (trimmed)
          headers.set('Authorization', `Bearer ${clerkToken?.trim()}`);
          
          // 2. apikey header MUST be the Supabase anon key
          headers.set('apikey', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    }
  );
};