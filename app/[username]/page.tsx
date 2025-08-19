'use client'

import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import PublicProfile from "./public-profile"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

// Force dynamic rendering to prevent build-time errors with Supabase
export const dynamic = 'force-dynamic'

export default function ProfilePage() {
  const pathname = usePathname()
  const username = pathname.split('/').pop() || ''
  const [user, setUser] = useState<any>(null)
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!username) {
        setError(true)
        setLoading(false)
        return
      }

      const supabase = createClient()

      // Get user profile
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single()

      if (!userData || userError) {
        setError(true)
        setLoading(false)
        return
      }

      // Get user links
      const { data: linksData } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", userData.id)
        .order("position")

      setUser(userData)
      setLinks(linksData || [])
      setLoading(false)
      
      // Update page metadata with user-specific information
      if (userData.username) {
        document.title = `${userData.username} | reachoutto.me`
        
        const description = userData.bio || `Check out ${userData.username}'s links on reachoutto.me`
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
          metaDescription.setAttribute('content', description)
        }
        
        // Update OG image URL to use dynamic generation
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
          (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
        const ogImageUrl = `${baseUrl}/api/og?username=${encodeURIComponent(userData.username)}`
        
        // Update OG image
        const ogImage = document.querySelector('meta[property="og:image"]')
        if (ogImage) {
          ogImage.setAttribute('content', ogImageUrl)
        }
        
        // Update Twitter image
        const twitterImage = document.querySelector('meta[name="twitter:image"]')
        if (twitterImage) {
          twitterImage.setAttribute('content', ogImageUrl)
        }
      }
    }

    fetchData()
  }, [username])

  if (loading) {
    return null // No loading text, just render nothing
  }

  if (error || !user) {
    notFound()
  }

  return <PublicProfile user={user} links={links} />
}
