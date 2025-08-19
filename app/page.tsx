import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
        <section className="text-center space-y-6 sm:space-y-8 py-12 sm:py-16 lg:py-24">
          <div className="space-y-6 sm:space-y-8">
            <h1 className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
              One Link to
              <br className="hidden sm:block" />
              {" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Rule Them All
              </span>
            </h1>
            <div className="space-y-4">
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                Stop cluttering your bio with multiple links. Create a stunning, customizable landing page 
                that brings together all your social media, portfolio, and important links in one place.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4">
            <Link href="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-primary hover:bg-primary/90">
                Get Your Free Page
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              Everything You Need to
              <br className="hidden sm:block" />
              {" "}
              <span className="bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
                Stand Out Online
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
              Powerful features that make reachoutto.me the best choice for your digital presence
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <Card className="group border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <Zap className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-lg sm:text-xl">Beautiful & Fast</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Modern, clean design that loads instantly. Make a great first impression, every time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <Smartphone className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-lg sm:text-xl">Perfect on All Devices</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Responsive design that looks stunning on phones, tablets, and desktops.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <Shield className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-lg sm:text-xl">Enterprise Security</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Bank-grade encryption and security. Your data is safe with us.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <Users className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-lg sm:text-xl">Drag & Drop Easy</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  No coding needed. Just drag, drop, and customize your links in seconds.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <Globe className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-lg sm:text-xl">Your Brand, Your Domain</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Use your own domain or get a free reachoutto.me profile. The choice is yours.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <LinkIcon className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-lg sm:text-xl">Unlimited Everything</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  No limits on links, clicks, or customization. Everything you need, completely free.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-6 sm:space-y-8 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-8 sm:p-10 lg:p-16 mx-4 sm:mx-0 border-2 border-primary/10">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Ready to Level Up Your
              <br className="hidden sm:block" />
              {" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Online Presence?
              </span>
            </h2>
            <div className="space-y-3">
              <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Create your stunning link page in less than 2 minutes.
                No credit card, no commitment.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Link href="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-primary hover:bg-primary/90">
                Get Your Free Page
              </Button>
            </Link>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>2-min setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Free forever</span>
              </div>
            </div>
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
