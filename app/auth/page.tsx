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
import { Link as LinkIcon, Mail, Lock, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            },
          },
        })

        if (error) throw error

        if (data.user && !data.session) {
          setError("Please check your email for verification link")
          return
        }
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
      }

      router.push("/dashboard")
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
            <LinkIcon className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg sm:text-xl">reachoutto.me</span>
          </Link>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl sm:text-2xl">
                {isSignUp ? "Create account" : "Welcome back"}
              </CardTitle>
              <ThemeToggle />
            </div>
            <CardDescription className="text-sm sm:text-base">
              {isSignUp
                ? "Create your account to get started"
                : "Sign in to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="johndoe"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="john@example.com"
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
                {loading
                  ? "Loading..."
                  : isSignUp
                  ? "Create Account"
                  : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </span>{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError("")
                  setEmail("")
                  setPassword("")
                  setUsername("")
                }}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs sm:text-sm text-muted-foreground px-4">
          By signing up, you agree to our{" "}
          <a href="#" className="hover:text-foreground underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="hover:text-foreground underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}
