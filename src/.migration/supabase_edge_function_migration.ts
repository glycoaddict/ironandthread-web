import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2'

// ==========================================
// TYPE DEFINITIONS & SCHEMAS
// ==========================================
interface ClerkEmailAddress {
  id: string;
  email_address: string;
}

interface ClerkUserPayload {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email_addresses: ClerkEmailAddress[];
  primary_email_address_id: string | null;
  created_at: number;
  updated_at: number;
}

interface ProfileUpsertPayload {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

// ==========================================
// CONFIGURATION & ENVIROMENT VALIDATION
// ==========================================
const CLERK_SECRET_KEY = Deno.env.get('CLERK_SECRET_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchWithRetry(url: string, options: RequestInit, retries = 5, backoff = 1000): Promise<Response> {
  try {
    const response = await fetch(url, options)
    if (response.status === 429 && retries > 0) {
      const retryAfterHeader = response.headers.get('Retry-After')
      const waitTime = retryAfterHeader ? parseInt(retryAfterHeader, 10) * 1000 : backoff
      console.warn(`⚠️ Rate limited by Clerk. Retrying after ${waitTime}ms...`)
      await delay(waitTime)
      return fetchWithRetry(url, options, retries - 1, backoff * 2)
    }
    return response
  } catch (error) {
    if (retries > 0) {
      await delay(backoff)
      return fetchWithRetry(url, options, retries - 1, backoff * 2)
    }
    throw error
  }
}

function transformUser(user: ClerkUserPayload): ProfileUpsertPayload {
  const primaryEmailObj = user.email_addresses?.find(
    (email) => email.id === user.primary_email_address_id
  )
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: primaryEmailObj ? primaryEmailObj.email_address : null,
    created_at: new Date(user.created_at).toISOString(),
    updated_at: new Date(user.updated_at).toISOString(),
  }
}

// ==========================================
// BACKGROUND MIGRATION WORKER
// ==========================================
async function runMigration(supabase: SupabaseClient) {
  let offset = 0
  const limit = 100 
  let metricsTotalProcessed = 0
  let metricsTotalSuccess = 0
  let metricsTotalFailed = 0

  console.log('🚀 Background Task Started: Syncing Clerk Users -> Supabase...')

  while (true) {
    const url = `https://api.clerk.com/v1/users?limit=${limit}&offset=${offset}`
    let response: Response
    
    try {
      response = await fetchWithRetry(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      })
    } catch (networkError) {
      console.error(`❌ Terminal Network Error at offset ${offset}:`, networkError)
      break
    }

    if (!response.ok) {
      console.error(`❌ Clerk API Failure [Status ${response.status}]. Halting loop.`)
      break
    }

    const clerkUsers: ClerkUserPayload[] = await response.json()
    if (!clerkUsers || clerkUsers.length === 0) break

    console.log(`📦 Processing batch of ${clerkUsers.length} records (Offset: ${offset})...`)

    const batchOperations = clerkUsers.map(async (rawUser) => {
      metricsTotalProcessed++
      const profile = transformUser(rawUser)

      const { error } = await supabase
        .from('profiles')
        .upsert(profile, { onConflict: 'id', ignoreDuplicates: true })

      if (error) {
        metricsTotalFailed++
      } else {
        metricsTotalSuccess++
      }
    })

    await Promise.all(batchOperations)
    await delay(350)
    offset += limit
  }

  console.log('\n==================================================')
  console.log('🏁 MIGRATION COMPLETE')
  console.log(`📊 Total Evaluated: ${metricsTotalProcessed} | Success: ${metricsTotalSuccess} | Failed: ${metricsTotalFailed}`)
  console.log('==================================================')
}

// ==========================================
// HTTP SERVER HANDLER (Supabase Edge Standard)
// ==========================================
Deno.serve(async (req) => {
  // Handle CORS preflight requests smoothly
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  if (!CLERK_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(
      JSON.stringify({ error: "Environment configuration missing on server." }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }

  // Initialize your client dynamically within the request runtime context
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // CRITICAL ARCHITECTURAL CHOICE: Fire and Forget
  // We invoke the migration function *without* using 'await'. This allows it to run 
  // asynchronously in the background loop while the thread continues forward immediately.
  runMigration(supabase)

  // Return an instant 202 response. Your python script gets this within milliseconds, 
  // avoids any timeouts, and closes its connection cleanly.
  return new Response(
    JSON.stringify({ message: "Migration worker initiated successfully in cloud background." }),
    { status: 202, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
  )
})