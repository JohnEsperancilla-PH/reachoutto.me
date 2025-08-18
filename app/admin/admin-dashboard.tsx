"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  Link as LinkIcon, 
  Users, 
  Trash2, 
  ExternalLink,
  LogOut,
  Shield,
  Calendar,
  Mail
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User, Link as LinkType } from "@/lib/types/database"

interface AdminDashboardProps {
  users: User[]
  links: (LinkType & { users: { username: string } })[]
}

export default function AdminDashboard({ users: initialUsers, links: initialLinks }: AdminDashboardProps) {
  const [users, setUsers] = useState(initialUsers)
  const [links, setLinks] = useState(initialLinks)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"users" | "links">("users")
  
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const handleDeleteUser = async (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (!confirm(`Are you sure you want to delete user "${user?.username}"? This will permanently delete their account and all their links. This action cannot be undone.`)) {
      return
    }

    setLoading(true)
    try {
      // Use the admin function to properly delete the user
      const { data, error } = await supabase.rpc('admin_delete_user', {
        user_id: userId
      })

      if (error) throw error

      // Update local state
      setUsers(users.filter(user => user.id !== userId))
      setLinks(links.filter(link => link.user_id !== userId))
      
      alert(`User "${user?.username}" has been successfully deleted.`)
    } catch (error: any) {
      console.error("Error deleting user:", error.message)
      alert(`Failed to delete user: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this link?")) {
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from("links")
        .delete()
        .eq("id", linkId)

      if (error) throw error

      setLinks(links.filter(link => link.id !== linkId))
    } catch (error: any) {
      console.error("Error deleting link:", error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Admin Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{links.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("users")}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Users
            </Button>
            <Button
              variant={activeTab === "links" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("links")}
              className="gap-2"
            >
              <LinkIcon className="h-4 w-4" />
              Links
            </Button>
          </div>

          {/* Users Tab */}
          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
                <CardDescription>
                  Manage all registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">@{user.username}</span>
                          {user.is_admin && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.id}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {user.bio && (
                          <p className="text-sm text-muted-foreground">{user.bio}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/${user.username}`}>
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={loading || user.is_admin}
                          className="text-destructive hover:text-destructive"
                          title={user.is_admin ? "Cannot delete admin users" : "Delete user"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No users found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Links Tab */}
          {activeTab === "links" && (
            <Card>
              <CardHeader>
                <CardTitle>Links Management</CardTitle>
                <CardDescription>
                  Manage all user links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {links.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{link.title}</span>
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                            @{link.users.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="truncate max-w-md">{link.url}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(link.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(link.url.startsWith("http") ? link.url : `https://${link.url}`, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteLink(link.id)}
                          disabled={loading}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {links.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No links found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
