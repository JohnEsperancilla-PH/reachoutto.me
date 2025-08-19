import type { Metadata, ResolvingMetadata } from 'next'
import { createPublicClient } from '@/lib/supabase/public'
import { notFound } from 'next/navigation'

export async function generateMetadata(
  { params }: { params: { username: string } },
  _parent?: ResolvingMetadata
): Promise<Metadata> {
  const supabase = createPublicClient()
  const { data: user } = await supabase
    .from('users')
    .select('username')
    .eq('username', params.username)
    .single()

  if (!user) {
    notFound()
  }

  return {
    title: `${user.username} | reachoutto.me`,
    description: `Check out ${user.username}'s links on reachoutto.me`,
    openGraph: {
      title: `${user.username} | reachoutto.me`,
      description: `Check out ${user.username}'s links on reachoutto.me`,
      images: [
        {
          url: '/og-image.png',
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
      images: ['/og-image.png'],
    },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}