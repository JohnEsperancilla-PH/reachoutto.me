import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminDashboard from "./admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) {
    redirect("/dashboard")
  }

  // Get all users
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })

  // Get all links with user info
  const { data: links } = await supabase
    .from("links")
    .select(`
      *,
      users!inner(username)
    `)
    .order("created_at", { ascending: false })

  return (
    <AdminDashboard 
      users={users || []} 
      links={links || []} 
    />
  )
}
