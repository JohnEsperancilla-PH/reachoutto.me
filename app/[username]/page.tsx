import { notFound } from "next/navigation"
import { createPublicClient } from "@/lib/supabase/public"
import PublicProfile from "./public-profile"
import type { Metadata } from "next"

// Force dynamic rendering to prevent build-time errors with Supabase
export const dynamic = 'force-dynamic'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
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
  
  // Temporarily disable OG image generation to fix deployment
  // TODO: Re-enable after fixing deployment issues
  // const ogImageUrl = new URL('/api/og', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
  // ogImageUrl.searchParams.set('username', user.username)
  // if (user.bio) ogImageUrl.searchParams.set('bio', user.bio)
  // if (user.avatar_url) ogImageUrl.searchParams.set('avatar', user.avatar_url)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      // Temporarily disabled OG image
      // images: [
      //   {
      //     url: ogImageUrl.toString(),
      //     width: 1200,
      //     height: 630,
      //     alt: `${user.username}'s profile`,
      //   },
      // ],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      // Temporarily disabled OG image
      // images: [ogImageUrl.toString()],
    },
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
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
