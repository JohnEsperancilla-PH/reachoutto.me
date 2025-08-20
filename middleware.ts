import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    const supabase = await createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      const url = new URL('/admin/login', request.url)
      return NextResponse.redirect(url)
    }

    // Check if user is admin
    const { data: adminData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!adminData?.is_admin) {
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('error', 'access_denied')
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match only essential paths that need auth:
     * - admin routes (except login)
     * - dashboard routes
     * - api routes (except og image generation)
     * Exclude all static assets and images
     */
    '/admin/((?!login$).*)',
    '/dashboard/:path*',
    '/api/((?!og).*)',
  ],
}