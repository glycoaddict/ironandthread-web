import { createClient } from '@supabase/supabase-js';

export const createClerkSupabaseClient = (session: any) => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          
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

export const getSupabaseImageUrl = async (
  session: any,
  src: string,
  bucketName: string = 'content',
  expirySeconds: number = 3600
): Promise<string | undefined> => {
  if (!session) return undefined;

  try {
    const supabase = createClerkSupabaseClient(session);
    const cleanedPath = src.replace(/^\/+/, '');

    // console.warn(`Getting signed URL for ${cleanedPath} in bucket ${bucketName}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(cleanedPath, expirySeconds);

    if (error) {
      console.warn(`Could not create signed URL for ${cleanedPath}:`, error);
      return undefined;
    }

    if (!data?.signedUrl) {
      console.warn(`Signed URL response missing for ${cleanedPath} in bucket ${bucketName}`);
      return undefined;
    }

    return data.signedUrl;
  } catch (err) {
    console.warn(`Error getting signed URL for ${src}:`, err);
    return undefined;
  }
};