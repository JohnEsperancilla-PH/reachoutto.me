import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import { type Database } from '../types/database'

export function createClient() {
  return createSupabaseBrowserClient<Database>(
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
      }
    }
  )
}

export const createBrowserClient = createClient