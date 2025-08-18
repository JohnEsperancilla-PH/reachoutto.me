import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { BuyMeCoffeeButton } from "@/components/buy-me-coffee-button"
import { Link as LinkIcon, Users, Zap, Shield, Smartphone, Globe } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-end px-4 md:px-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/auth">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
            <div className="sm:hidden">
              <Link href="/auth">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6">
        {/* Hero Section */}
        <section className="text-center space-y-6 sm:space-y-8 py-12 sm:py-16 lg:py-20">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Your{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                digital identity
              </span>
              <br className="hidden sm:block" />
              {" "}in one link
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              Create a beautiful, customizable landing page that showcases all your important links. 
              Perfect for social media bios, business cards, and everywhere you need to share multiple links.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2">
            <Link href="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-6">
                Create Your Page
              </Button>
            </Link>
            <Link href="/johndev" className="w-full sm:w-auto text-muted-foreground hover:text-foreground transition-colors">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-6">
                View Demo →
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Why choose reachoutto.me?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create a professional link-in-bio page
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="border-2 hover:border-primary/20 transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-4">
                <Zap className="h-8 w-8 text-primary mb-3" />
                <CardTitle className="text-lg sm:text-xl">Lightning Fast</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Built with Next.js and optimized for speed. Your page loads instantly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-4">
                <Smartphone className="h-8 w-8 text-primary mb-3" />
                <CardTitle className="text-lg sm:text-xl">Mobile First</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Perfectly responsive design that looks great on any device.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-4">
                <Shield className="h-8 w-8 text-primary mb-3" />
                <CardTitle className="text-lg sm:text-xl">Secure & Private</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Your data is protected with enterprise-grade security.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-4">
                <Users className="h-8 w-8 text-primary mb-3" />
                <CardTitle className="text-lg sm:text-xl">Easy to Use</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Simple drag-and-drop interface to organize your links.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-4">
                <Globe className="h-8 w-8 text-primary mb-3" />
                <CardTitle className="text-lg sm:text-xl">Custom Domain</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Use your own domain or get a free reachoutto.me subdomain.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-4">
                <LinkIcon className="h-8 w-8 text-primary mb-3" />
                <CardTitle className="text-lg sm:text-xl">Unlimited Links</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Add as many links as you need, organize them your way.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-4 sm:space-y-6 bg-muted/30 rounded-2xl p-6 sm:p-8 lg:p-12 mx-4 sm:mx-0">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to get started?</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Join thousands of creators, entrepreneurs, and professionals who trust reachoutto.me 
            to showcase their digital presence.
          </p>
          <div className="pt-2">
            <Link href="/auth" className="inline-block w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-6">
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-12 sm:mt-16 lg:mt-20">
        <div className="container py-6 sm:py-8 px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm sm:text-base">reachoutto.me</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <BuyMeCoffeeButton className="order-2 sm:order-1" />
              <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground order-1 sm:order-2">
                <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                <a href="#" className="hover:text-foreground transition-colors">Support</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
