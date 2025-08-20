import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import { type Database } from '../types/database'

// Cache the client instance to avoid recreating it
let supabaseClient: ReturnType<typeof createSupabaseBrowserClient<Database>> | null = null

export function createClient() {
  // Return cached client if it exists
  if (supabaseClient) {
    return supabaseClient
  }

  // Create new client with optimized settings
  supabaseClient = createSupabaseBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return document.cookie.split('; ')
            .find(row => row.startsWith(`${name}=`))
            ?.split('=')[1]
        },
        set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; secure?: boolean }) {
          document.cookie = `${name}=${value}${options.path ? `;path=${options.path}` : ''}${options.maxAge ? `;max-age=${options.maxAge}` : ''}${options.domain ? `;domain=${options.domain}` : ''}${options.secure ? ';secure' : ''}`
        },
        remove(name: string, options: { path?: string; domain?: string }) {
          document.cookie = `${name}=;max-age=0${options.path ? `;path=${options.path}` : ''}${options.domain ? `;domain=${options.domain}` : ''}`
        }
      },
      global: {
        headers: {
          'X-Client-Info': 'reachoutto.me'
        }
      },
      auth: {
        // Optimize auth settings for better performance
        persistSession: true,
        detectSessionInUrl: false, // Disable for faster page loads
        flowType: 'pkce',
        // Reduce storage access for faster auth
        storage: {
          getItem: (key: string) => {
            if (typeof window !== 'undefined') {
              return window.localStorage.getItem(key)
            }
            return null
          },
          setItem: (key: string, value: string) => {
            if (typeof window !== 'undefined') {
              window.localStorage.setItem(key, value)
            }
          },
          removeItem: (key: string) => {
            if (typeof window !== 'undefined') {
              window.localStorage.removeItem(key)
            }
          },
        },
        // Disable auto refresh for faster login
        autoRefreshToken: false,
      },
      // Add connection pooling for better performance
      db: {
        schema: 'public'
      }
    }
  )

  return supabaseClient
}

export const createBrowserClient = createClient