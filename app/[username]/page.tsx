import { notFound } from "next/navigation"
import { createPublicClient } from "@/lib/supabase/public"
import PublicProfile from "./public-profile"
import type { Metadata } from "next"
import { generateProfileOGImage } from "@/lib/utils/og-image"

// Force dynamic rendering to prevent build-time errors with Supabase
export const dynamic = 'force-dynamic'

interface PageProps {
  params: { username: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = params
  const supabase = createPublicClient()

  const { data: user } = await supabase
    .from("users")
    .select("username, bio, avatar_url")
    .eq("username", username)
    .single()

  if (!user) {
    return {
      title: "User not found - reachoutto.me",
    }
  }

  const title = `${user.username} - reachoutto.me`
  const description = user.bio || `Check out ${user.username}'s links on reachoutto.me`

  // Get base URL for OG image
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  const ogImageUrl = `${baseUrl}/api/og?username=${encodeURIComponent(user.username)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${user.username}'s profile`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = params
  const supabase = createPublicClient()

  // Get user profile
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single()

  if (!user || userError) {
    notFound()
  }

  // Get user links
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("position")

  return <PublicProfile user={user} links={links || []} />
}
