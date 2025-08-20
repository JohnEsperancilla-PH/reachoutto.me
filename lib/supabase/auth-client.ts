import { createBrowserClient } from '@supabase/ssr'
import { type Database } from '../types/database'

// Lightweight auth-only client for faster login operations
let authClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createAuthClient() {
  if (authClient) {
    return authClient
  }

  authClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Minimal config for auth operations only
      auth: {
        persistSession: true,
        detectSessionInUrl: false,
        flowType: 'pkce',
        autoRefreshToken: false,
        // Use sessionStorage for faster access during login
        storage: {
          getItem: (key: string) => {
            if (typeof window !== 'undefined') {
              return window.sessionStorage.getItem(key) || window.localStorage.getItem(key)
            }
            return null
          },
          setItem: (key: string, value: string) => {
            if (typeof window !== 'undefined') {
              window.sessionStorage.setItem(key, value)
              window.localStorage.setItem(key, value)
            }
          },
          removeItem: (key: string) => {
            if (typeof window !== 'undefined') {
              window.sessionStorage.removeItem(key)
              window.localStorage.removeItem(key)
            }
          },
        },
      },
      global: {
        headers: {
          'X-Client-Info': 'reachoutto.me-auth'
        }
      }
    }
  )

  return authClient
}
