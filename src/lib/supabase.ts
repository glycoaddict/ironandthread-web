import { createClient } from '@supabase/supabase-js';

export const createClerkSupabaseClient = (session: any) => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          // REMOVED: { template: 'supabase' }
          // The native integration uses the default session token.
          const token = await session.getToken();

          const headers = new Headers(options.headers);
          
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          
          // Still need to send the apikey so Supabase knows which project
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