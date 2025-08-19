import type { Metadata } from 'next'
import { createPublicClient } from '@/lib/supabase/public'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: { username: string }
}): Promise<Metadata> {
  const supabase = createPublicClient()
  const { data: user } = await supabase
    .from('users')
    .select('username, avatar_url')
    .eq('username', params.username)
    .single()

  if (!user) {
    notFound()
  }

  const ogImageUrl = new URL('/api/og', process.env.NEXT_PUBLIC_APP_URL)
  ogImageUrl.searchParams.set('type', 'profile')
  ogImageUrl.searchParams.set('username', user.username)
  if (user.avatar_url) {
    ogImageUrl.searchParams.set('avatar', user.avatar_url)
  }

  return {
    title: `${user.username} | reachoutto.me`,
    description: `Check out ${user.username}'s links on reachoutto.me`,
    openGraph: {
      title: `${user.username} | reachoutto.me`,
      description: `Check out ${user.username}'s links on reachoutto.me`,
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

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return children
}
