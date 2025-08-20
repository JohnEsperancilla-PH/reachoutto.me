"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { BuyMeCoffeeButton } from "@/components/buy-me-coffee-button"
import { Link as LinkIcon, Users, Zap, Shield, Smartphone, User, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// Preloader component
function DashboardPreloader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Loading Dashboard...</h2>
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

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [navigatingToDashboard, setNavigatingToDashboard] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        setIsAuthenticated(!!session)
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Handle dashboard navigation with preloader
  const handleDashboardNavigation = () => {
    setNavigatingToDashboard(true)
    // Small delay to show the preloader, then navigate
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 800)
  }

  // Show preloader when navigating to dashboard
  if (navigatingToDashboard) {
    return <DashboardPreloader />
  }

  // Navigation component based on auth status
  const Navigation = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <div className="w-20 h-9 bg-muted animate-pulse rounded" />
        </div>
      )
    }

    if (isAuthenticated) {
      return (
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
                    <Button 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={handleDashboardNavigation}
          >
            Dashboard
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        <div className="hidden sm:flex items-center gap-2">
          <Link href="/auth">
            <Button variant="outline" size="sm" className="h-9">Sign In</Button>
          </Link>
          <Link href="/auth">
            <Button size="sm" className="h-9">Get Started</Button>
          </Link>
        </div>
        <div className="sm:hidden">
          <Link href="/auth">
            <Button size="sm" className="h-9">Sign Up</Button>
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-end px-4 md:px-6">
          <Navigation />
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 pb-8">
        {/* Hero Section */}
        <section className="text-center space-y-8 py-12 sm:py-16 lg:py-24 max-w-4xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight">
              One Link to
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Rule Them All
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
              {isAuthenticated 
                ? "Welcome back! Manage your links and portfolio from your dashboard."
                : "One beautiful link for all your social media, portfolio, and important content."
              }
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
                            <Button 
                size="lg" 
                className="bg-white text-black-600 hover:bg-gray-100"
                onClick={handleDashboardNavigation}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Link href="/auth">
                <Button size="lg" className="text-xl px-8 py-6">
                  Create Your Page
                </Button>
              </Link>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
                reachoutto.me
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-2 hover:border-primary/20 transition-all">
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-3" />
                <CardTitle className="text-xl">Fast & Beautiful</CardTitle>
                <CardDescription className="text-base">
                  Clean design that loads instantly and looks great.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-all">
              <CardHeader>
                <Smartphone className="h-8 w-8 text-primary mb-3" />
                <CardTitle className="text-xl">Mobile-First</CardTitle>
                <CardDescription className="text-base">
                  Perfect on all devices - phone, tablet, or desktop.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-all">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-3" />
                <CardTitle className="text-xl">Easy Setup</CardTitle>
                <CardDescription className="text-base">
                  No coding needed. Set up your page in under 2 minutes.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-6 sm:p-8 md:p-12 border-2 border-primary/10 max-w-5xl mx-auto mb-8 sm:mb-12">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              {isAuthenticated ? (
                <>
                  Ready to{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Update Your Page?
                  </span>
                </>
              ) : (
                <>
                  Get Started in{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    2 Minutes
                  </span>
                </>
              )}
            </h2>
            <p className="text-lg sm:text-xl max-w-xl mx-auto">
              {isAuthenticated 
                ? "Add new links, update your portfolio, and customize your page."
                : "Create your link page now. Free forever."
              }
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            {isAuthenticated ? (
              <Button 
                size="lg" 
                className="text-lg sm:text-xl px-6 sm:px-8 py-4 sm:py-6"
                onClick={handleDashboardNavigation}
              >
                Manage Your Page
              </Button>
            ) : (
              <Link href="/auth">
                <Button size="lg" className="text-lg sm:text-xl px-6 sm:px-8 py-4 sm:py-6">
                  Start Building
                </Button>
              </Link>
            )}
            <div className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Quick setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Always free</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container mx-auto py-6 px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src="/images/reachouttome_logo.png" 
                alt="reachoutto.me" 
                className="h-5 w-5 invert dark:invert-0"
              />
              <span className="font-semibold">reachoutto.me</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <BuyMeCoffeeButton />
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                <Link href="/support" className="hover:text-foreground transition-colors">Support</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
