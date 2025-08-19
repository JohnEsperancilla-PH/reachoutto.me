import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardClient from "./dashboard-client"

// Force dynamic rendering to prevent build-time errors with Supabase
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  // Get user links
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("position")

  // Get user portfolio items
  const { data: portfolioItems } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("user_id", user.id)
    .order("position")

  return (
    <DashboardClient 
      user={user} 
      profile={profile} 
      initialLinks={links || []} 
      initialPortfolioItems={portfolioItems || []}
    />
  )
}
