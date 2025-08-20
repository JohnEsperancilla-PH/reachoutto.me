"use client"

import { useState, useCallback, useMemo, useEffect } from "react"

// Force dynamic rendering to prevent build-time errors with Supabase
export const dynamic = 'force-dynamic'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { Link as LinkIcon, Mail, Lock, User, Loader2 } from "lucide-react"
import { createAuthClient } from "@/lib/supabase/auth-client"
import { useRouter } from "next/navigation"

// Preloader component
function AuthPreloader({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{message}</h2>
          <p className="text-muted-foreground">Setting up your workspace</p>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <img 
            src="/images/reachouttome_logo.png" 
            alt="reachoutto.me" 
            className="h-4 w-4 invert dark:invert-0"
          />
          <span>reachoutto.me</span>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [checkingSession, setCheckingSession] = useState(true)
  const [redirectingWithSession, setRedirectingWithSession] = useState(false)
  const router = useRouter()

  // Initialize theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light")
    
    document.documentElement.classList.toggle("dark", initialTheme === "dark")
  }, [])

  // Memoize the Supabase client to prevent recreation
  const supabase = useMemo(() => createAuthClient(), [])

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          // User is already authenticated, show signing in message and redirect
          setCheckingSession(false)
          setRedirectingWithSession(true)
          setTimeout(() => {
            window.location.href = "/dashboard"
          }, 800) // Small delay to show the message
          return
        }
      } catch (error) {
        console.error('Session check failed:', error)
      } finally {
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [supabase])

  const handleAuth = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Set a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      setError("Login is taking longer than expected. Please try again.")
      setLoading(false)
    }, 15000) // 15 second timeout

    try {
      if (isSignUp) {
        // Sign up with optimized options
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`
          },
        })

        if (error) throw error

        if (data.user && !data.session) {
          clearTimeout(timeoutId)
          setError("Please check your email for verification link")
          setLoading(false)
          return
        }
      } else {
        // Sign in with faster method
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        clearTimeout(timeoutId)
        // Fast redirect without refresh
        window.location.href = "/dashboard"
        return
      }

      clearTimeout(timeoutId)
      // Redirect to dashboard
      window.location.href = "/dashboard"
    } catch (error: any) {
      clearTimeout(timeoutId)
      setError(error.message)
      setLoading(false)
    }
  }, [isSignUp, email, password, username, supabase])

  const toggleAuthMode = useCallback(() => {
    setIsSignUp(!isSignUp)
    setError("")
    setEmail("")
    setPassword("")
    setUsername("")
  }, [isSignUp])

  // Show preloader while checking session - moved after all hooks
  if (checkingSession) {
    return <AuthPreloader message="Checking authentication status..." />
  }

  // Show signing in message when redirecting with existing session
  if (redirectingWithSession) {
    return <AuthPreloader message="Signing you in..." />
  }

  // Show preloader when form is being submitted
  if (loading) {
    return <AuthPreloader message={isSignUp ? "Creating your account..." : "Signing you in..."} />
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
                      disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-11" disabled={loading}>
                <span className="sm:hidden">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </span>
                <span className="hidden sm:inline">
                  {isSignUp ? "Create Account" : "Sign In"}
                </span>
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </span>{" "}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
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
