import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { BuyMeCoffeeButton } from "@/components/buy-me-coffee-button"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata = {
  title: 'Terms of Service - reachoutto.me',
  description: 'Terms of service and usage agreement for reachoutto.me',
}

export default function TermsPage() {
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
                Beta Testing Phase
              </CardTitle>
            </CardHeader>
            <CardContent className="text-orange-700 dark:text-orange-300">
              <p className="mb-3">
                <strong>reachoutto.me is currently in beta testing.</strong> By using our beta service, you acknowledge that:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>The service is provided "as-is" during development</li>
                <li>Features may be incomplete, change, or become temporarily unavailable</li>
                <li>Data migration or loss may occur during updates (we'll try to minimize this)</li>
                <li>Service availability is not guaranteed during beta</li>
                <li>These terms may be updated more frequently than in a stable release</li>
              </ul>
              <p className="mt-3">
                Your participation in our beta helps us improve the platform. Thank you for being an early adopter!
              </p>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
              <p className="text-muted-foreground text-lg">
                Last updated: August 20, 2025
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
              <p>
                By accessing and using reachoutto.me ("Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to these terms, you should not use this service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Description of Service</h2>
              <p>
                reachoutto.me is a platform that allows users to create personalized profile pages with links to their social media, 
                projects, and other online presence. We provide tools to showcase portfolios, manage links, and share professional information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. User Accounts</h2>
              <div className="space-y-3">
                <h3 className="text-xl font-medium">Account Creation</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>You must be at least 13 years old to create an account</li>
                  <li>One person may not maintain multiple accounts</li>
                </ul>
                
                <h3 className="text-xl font-medium">Username Policy</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Usernames must be unique and appropriate</li>
                  <li>Cannot impersonate others or infringe on trademarks</li>
                  <li>We reserve the right to reclaim inactive or inappropriate usernames</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Content Guidelines</h2>
              <div className="space-y-3">
                <h3 className="text-xl font-medium">Acceptable Use</h3>
                <p>You may use our service to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Share professional and personal information</li>
                  <li>Showcase your work and projects</li>
                  <li>Connect with others through links and contact information</li>
                  <li>Promote your business or personal brand</li>
                </ul>
                
                <h3 className="text-xl font-medium">Prohibited Content</h3>
                <p>You may not post content that:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Is illegal, harmful, or violates others' rights</li>
                  <li>Contains hate speech, harassment, or discrimination</li>
                  <li>Includes spam, malware, or phishing attempts</li>
                  <li>Violates copyright or intellectual property rights</li>
                  <li>Contains explicit adult content or violence</li>
                  <li>Misleads or deceives other users</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Intellectual Property</h2>
              <div className="space-y-3">
                <h3 className="text-xl font-medium">Your Content</h3>
                <p>
                  You retain ownership of all content you submit to our service. By posting content, you grant us a 
                  worldwide, non-exclusive, royalty-free license to use, display, and distribute your content for the purpose of providing our service.
                </p>
                
                <h3 className="text-xl font-medium">Our Platform</h3>
                <p>
                  The reachoutto.me platform, including its design, code, and functionality, is protected by copyright and other intellectual property laws. 
                  You may not copy, modify, or distribute our platform without permission.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Privacy and Data</h2>
              <p>
                Your privacy is important to us. Our collection and use of your information is governed by our 
                <Link href="/privacy" className="text-primary hover:underline"> Privacy Policy</Link>, 
                which is incorporated into these terms by reference.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Service Availability</h2>
              <p>We strive to maintain high availability but cannot guarantee:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Uninterrupted access to our service</li>
                <li>Error-free operation</li>
                <li>Compatibility with all devices or browsers</li>
                <li>Permanent data retention (please backup important content)</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                During beta testing, service interruptions may be more frequent as we improve the platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Termination</h2>
              <div className="space-y-3">
                <h3 className="text-xl font-medium">By You</h3>
                <p>You may terminate your account at any time by deleting it through your dashboard.</p>
                
                <h3 className="text-xl font-medium">By Us</h3>
                <p>We may suspend or terminate your account if you:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Violate these terms of service</li>
                  <li>Engage in harmful or illegal activities</li>
                  <li>Remain inactive for an extended period</li>
                  <li>Fail to respond to security concerns</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Disclaimers and Limitations</h2>
              <div className="space-y-3">
                <p>
                  <strong>AS-IS BASIS:</strong> Our service is provided "as-is" without warranties of any kind, either express or implied.
                </p>
                <p>
                  <strong>LIMITATION OF LIABILITY:</strong> We shall not be liable for any indirect, incidental, special, or consequential damages 
                  resulting from your use of our service.
                </p>
                <p>
                  <strong>BETA DISCLAIMER:</strong> During beta testing, the service may be unstable, incomplete, or subject to significant changes. 
                  Use at your own risk.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">10. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms 
                or your use of our service shall be resolved through binding arbitration.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">11. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through our platform. 
                Continued use of our service after changes constitutes acceptance of the new terms.
              </p>
              <p className="text-sm text-muted-foreground">
                During beta testing, terms may be updated more frequently to reflect new features and feedback.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">12. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Email: johnleonardesperancilla@gmail.com</li>
                <li>Through our <Link href="/support" className="text-primary hover:underline">support page</Link></li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">13. Acknowledgment</h2>
              <p>
                By using reachoutto.me, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
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
