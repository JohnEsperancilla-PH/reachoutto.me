// lib/supabase/edge.ts
import { createClient } from '@supabase/supabase-js'

export function createEdgeClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      global: {
        // Disable realtime for Edge functions
        headers: { 'X-Client-Info': 'supabase-js-edge' }
      }
    }
  )
}