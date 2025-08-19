import type { Metadata } from 'next'
import { createPublicClient } from '@/lib/supabase/public'

export async function generateUserMetadata(username: string): Promise<Metadata> {
  const supabase = createPublicClient()
  const { data: user } = await supabase
    .from('users')
    .select('username, bio, avatar_url')
    .eq('username', username)
    .single()

  if (!user) {
    return {
      title: 'User Not Found | reachoutto.me',
      description: 'This user profile does not exist.',
    }
  }

  // Get base URL for OG image
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  const ogImageUrl = new URL('/api/og', baseUrl)
  ogImageUrl.searchParams.set('username', user.username)

  const title = `${user.username} | reachoutto.me`
  const description = user.bio || `Check out ${user.username}'s links on reachoutto.me`

  return {
    title,
    description,
    openGraph: {
      title,
      description: description,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: `${user.username}'s profile`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${user.username} | reachoutto.me`,
      description: `Check out ${user.username}'s links on reachoutto.me`,
      images: [ogImageUrl.toString()],
    },
  }
}
