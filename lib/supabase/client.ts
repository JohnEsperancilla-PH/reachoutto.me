import { createBrowserClient } from '@supabase/ssr'

export function createBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Implement cookie handling as needed
          return document.cookie.split('; ')
            .find(row => row.startsWith(`${name}=`))
            ?.split('=')[1]
        },
      },
      global: {
        headers: {
          'X-Client-Info': 'reachoutto.me-og-image'
        }
      }
    }
  )
}