import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import PublicProfile from "./public-profile"
import type { Metadata } from "next"

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()

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
  
  // Generate OG image URL
  const ogImageUrl = new URL('/api/og', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
  ogImageUrl.searchParams.set('username', user.username)
  if (user.bio) ogImageUrl.searchParams.set('bio', user.bio)
  if (user.avatar_url) ogImageUrl.searchParams.set('avatar', user.avatar_url)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
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
      title,
      description,
      images: [ogImageUrl.toString()],
    },
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const supabase = await createClient()

  // Get user profile
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single()

  if (!user || userError) {
    notFound()
  }

  // Double-check that the user still exists in auth.users
  // This handles cases where user was deleted from auth but not from users table
  const { data: authUser } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .single()

  if (!authUser) {
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
