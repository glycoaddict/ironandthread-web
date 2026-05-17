import { createClient } from '@supabase/supabase-js';

let supabaseClient: any = null;
let getToken: (() => Promise<string | null>) | null = null;

const createClerkSupabaseClientInternal = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
        autoRefreshToken: false,
      },
      global: {
        fetch: async (url, options = {}) => {
          const token = getToken ? await getToken() : null;

          const headers = new Headers(options.headers);
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }

          headers.set('apikey', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    }
  );

export const createClerkSupabaseClient = (session: any): any => {
  getToken = async () => await session.getToken();
  if (!supabaseClient) {
    supabaseClient = createClerkSupabaseClientInternal();
  }
  return supabaseClient;
};

// Alias for reuse in any component or route. This returns the shared
// browser Supabase client while keeping auth token resolution dynamic.
export const getSupabaseClient = createClerkSupabaseClient;

export const getSupabaseImageUrl = async (
  supabase: ReturnType<typeof createClerkSupabaseClient> | null,
  src: string,
  bucketName: string = 'content',
  expirySeconds: number = 3600
): Promise<string | undefined> => {
  if (!supabase) return undefined;

  try {
    const cleanedPath = src.replace(/^\/+/, '');

    if (!cleanedPath || cleanedPath.endsWith('/')) {
      console.warn(`Skipping signed URL request for invalid storage path: ${cleanedPath}`);
      return undefined;
    }

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