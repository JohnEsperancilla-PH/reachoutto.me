import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle, Mail, Bug, Lightbulb, MessageSquare, HelpCircle } from "lucide-react"
import { BuyMeCoffeeButton } from "@/components/buy-me-coffee-button"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata = {
  title: 'Support - reachoutto.me',
  description: 'Get help and support for reachoutto.me',
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-end">
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back to Home Button */}
          <div className="flex justify-start">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          {/* Beta Notice */}
          <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <AlertTriangle className="h-5 w-5" />
                Beta Testing Support
              </CardTitle>
            </CardHeader>
            <CardContent className="text-orange-700 dark:text-orange-300">
              <p className="mb-3">
                <strong>We're in beta and actively improving!</strong> Your feedback is invaluable during this phase.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">🐛 Found a Bug?</h4>
                  <p className="text-sm">Please report it! Include steps to reproduce, browser info, and screenshots if possible.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">💡 Have Ideas?</h4>
                  <p className="text-sm">We love feature suggestions! Tell us what would make your experience better.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">⚡ Expected Changes</h4>
                  <p className="text-sm">Features may change, and some issues are known as we iterate quickly.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🚀 Response Times</h4>
                  <p className="text-sm">We aim to respond within 24-48 hours during beta testing.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Support Center</h1>
              <p className="text-muted-foreground text-lg">
                Get help with reachoutto.me or report issues during our beta phase.
              </p>
            </div>

            {/* Contact Options */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="h-5 w-5 text-red-500" />
                    Report a Bug
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Found something broken? Help us fix it quickly during beta testing.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Include in your report:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Steps to reproduce the issue</li>
                      <li>• Your browser and device info</li>
                      <li>• Screenshots or error messages</li>
                      <li>• When the issue started</li>
                    </ul>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <a href="mailto:johnleonardesperancilla@gmail.com?subject=Bug Report - Beta">
                      <Mail className="h-4 w-4 mr-2" />
                      Report Bug
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Feature Request
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Have an idea for a new feature? We're building based on user feedback!
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Tell us about:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• What you'd like to see added</li>
                      <li>• How it would help you</li>
                      <li>• Any examples from other platforms</li>
                      <li>• Priority level for you</li>
                    </ul>
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <a href="mailto:johnleonardesperancilla@gmail.com?subject=Feature Request - Beta">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Suggest Feature
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    General Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Need help using the platform or have questions about your account?
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">We can help with:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Account setup and configuration</li>
                      <li>• Profile customization</li>
                      <li>• Link management</li>
                      <li>• Portfolio creation</li>
                    </ul>
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <a href="mailto:johnleonardesperancilla@gmail.com?subject=Support Request">
                      <Mail className="h-4 w-4 mr-2" />
                      Get Help
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-green-500" />
                    Beta Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share your overall experience and help us improve the platform.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Your feedback on:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Overall user experience</li>
                      <li>• Design and usability</li>
                      <li>• Performance issues</li>
                      <li>• Missing features</li>
                    </ul>
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <a href="mailto:johnleonardesperancilla@gmail.com?subject=Beta Feedback">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Share Feedback
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How do I create my profile page?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      After signing up, go to your dashboard to customize your profile. Add your bio, upload a profile photo, 
                      and start adding links to your social media and projects. Your profile will be available at reachoutto.me/yourusername.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Can I customize my profile URL?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Yes! Your username becomes your custom URL. Choose it carefully during signup as it cannot be changed later 
                      (though we may add this feature based on beta feedback).
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Is my data safe during beta testing?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      We take data security seriously and use industry-standard practices. However, during beta testing, 
                      there may be occasional updates that could affect data. We recommend keeping backups of important content 
                      and will notify users of any major changes.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What happens after beta testing ends?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Beta testers will automatically transition to the full version when it launches. Your account and data 
                      will be preserved. You'll likely get early access to new features and possibly special beta tester benefits!
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">How can I delete my account?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      You can delete your account from your dashboard settings. During beta, you can also contact us directly 
                      if you encounter any issues with account deletion.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Response Times */}
            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-red-500 mb-2">🚨 Critical Bugs</h4>
                    <p className="text-muted-foreground">Within 12 hours</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-500 mb-2">📧 General Support</h4>
                    <p className="text-muted-foreground">24-48 hours</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-500 mb-2">💡 Feature Requests</h4>
                    <p className="text-muted-foreground">3-5 business days</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Response times may vary during beta testing as we prioritize critical issues and platform stability.
                </p>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">Email Support</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Direct to the Developer: johnleonardesperancilla@gmail.com</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-2">Other Resources</h3>
                    <div className="space-y-1 text-sm">
                      <Link href="/privacy" className="text-primary hover:underline block">Privacy Policy</Link>
                      <Link href="/terms" className="text-primary hover:underline block">Terms of Service</Link>
                      <Link href="/dashboard" className="text-primary hover:underline block">Dashboard</Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </div>
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
