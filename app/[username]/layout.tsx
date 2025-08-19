import type { Metadata } from 'next'
import { createEdgeClient } from '@/lib/supabase/edge'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: { username: string }
}): Promise<Metadata> {
  const username = params.username
  const supabase = createEdgeClient()

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

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { username: string }
}) {
  return (
    <section className="min-h-screen">
      {children}
    </section>
  )
}