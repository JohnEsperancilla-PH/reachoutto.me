import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron (optional security check)
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    
    // Perform a simple database operation to keep it active
    // 1. Count total users
    const { count: userCount, error: userError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (userError) {
      console.error('Error counting users:', userError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // 2. Count total links
    const { count: linkCount, error: linkError } = await supabase
      .from('links')
      .select('*', { count: 'exact', head: true })

    if (linkError) {
      console.error('Error counting links:', linkError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // 3. Get the most recent user (optional activity check)
    const { data: recentUser, error: recentError } = await supabase
      .from('users')
      .select('username, created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (recentError && recentError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is okay if no users exist
      console.error('Error getting recent user:', recentError)
    }

    const timestamp = new Date().toISOString()
    const stats = {
      timestamp,
      userCount: userCount || 0,
      linkCount: linkCount || 0,
      recentUser: recentUser?.username || 'none',
      status: 'healthy'
    }

    console.log('Database keep-alive successful:', stats)

    return NextResponse.json({
      success: true,
      message: 'Database keep-alive successful',
      stats
    })

  } catch (error: any) {
    console.error('Keep-alive cron job failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Keep-alive failed',
        message: error.message 
      }, 
      { status: 500 }
    )
  }
}

// Also handle POST requests in case Vercel Cron sends POST
export async function POST(request: NextRequest) {
  return GET(request)
}
