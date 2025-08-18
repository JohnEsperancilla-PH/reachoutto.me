"use client"

import { useState } from "react"

// Force dynamic rendering to prevent build-time errors with Supabase
export const dynamic = 'force-dynamic'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { Link as LinkIcon, Lock, Shield } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // Check if user is admin
      const { data: adminData, error: adminError } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", user?.id)
        .single()

      if (adminError || !adminData?.is_admin) {
        throw new Error("Access denied: Admin privileges required")
      }

      router.push("/admin")
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 sm:mb-8">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg sm:text-xl">Admin Dashboard</span>
          </Link>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl sm:text-2xl">
                Admin Login
              </CardTitle>
              <ThemeToggle />
            </div>
            <CardDescription className="text-sm sm:text-base">
              Sign in to access admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="admin@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? "Verifying..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                ← Back to Homepage
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
