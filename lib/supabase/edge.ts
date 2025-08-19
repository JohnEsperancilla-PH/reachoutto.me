import { createClient } from '@supabase/supabase-js'
import { type Database } from '../types/database'

export function createEdgeClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        // Disable WebSocket features for Edge
        headers: {
          'X-Client-Info': `supabase-js-edge/v2`,
        },
      },
    }
  )
}
