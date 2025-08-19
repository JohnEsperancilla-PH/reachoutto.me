import type { Metadata } from 'next'
import { createPublicClient } from '@/lib/supabase/public'
import { notFound } from 'next/navigation'

type Props = {
  params: { username: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = params.username
  const supabase = createPublicClient()

  // Fetch user data
  const { data: user } = await supabase
    .from('users')
    .select('username')
    .eq('username', username)
    .single()

  if (!user) {
    notFound()
  }

  const title = `${username} | reachoutto.me`
  const description = `Connect with ${username} on reachoutto.me`
  const ogImage = `/api/og/${encodeURIComponent(username)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${username}'s profile`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://reachoutto.me/${encodeURIComponent(username)}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  }
}

export default function Layout({ children }: Props) {
  return <>{children}</>
}