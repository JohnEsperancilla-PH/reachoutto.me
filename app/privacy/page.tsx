import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { BuyMeCoffeeButton } from "@/components/buy-me-coffee-button"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata = {
  title: 'Privacy Policy - reachoutto.me',
  description: 'Privacy policy and data protection information for reachoutto.me',
}

export default function PrivacyPage() {
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
                <strong>reachoutto.me is currently in beta testing.</strong> This means we're actively developing and improving our platform. During this phase:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Features may change or be temporarily unavailable</li>
                <li>We may collect additional debugging and usage data to improve our service</li>
                <li>Data backup and migration procedures are still being refined</li>
                <li>Your feedback helps us improve - please report any issues</li>
              </ul>
              <p className="mt-3">
                By using our beta service, you acknowledge these conditions and help us build a better platform for everyone.
              </p>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-muted-foreground text-lg">
                Last updated: August 20, 2025
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Information We Collect</h2>
              <div className="space-y-3">
                <h3 className="text-xl font-medium">Account Information</h3>
                <p>When you create an account, we collect:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Email address (for authentication)</li>
                  <li>Username (for your public profile)</li>
                  <li>Profile information (bio, photo, links)</li>
                  <li>Portfolio items and project details</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-medium">Usage Data</h3>
                <p>We automatically collect:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Page views and interaction data</li>
                  <li>Performance and error logs</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Provide and maintain our service</li>
                <li>Create and display your public profile</li>
                <li>Send important updates about your account</li>
                <li>Improve our platform and user experience</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Data Sharing and Disclosure</h2>
              <p>We do not sell your personal information. We may share data in these situations:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Public Profile:</strong> Information you choose to make public (username, bio, links, portfolio)</li>
                <li><strong>Service Providers:</strong> Trusted third parties who help us operate our service (Supabase, Vercel)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfer:</strong> In case of merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Data Security</h2>
              <p>We implement industry-standard security measures:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Encryption in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure hosting infrastructure</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Cookies and Tracking</h2>
              <p>We use cookies and similar technologies for:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Authentication and session management</li>
                <li>Preferences and settings</li>
                <li>Analytics and performance monitoring</li>
                <li>Security and fraud prevention</li>
              </ul>
              <p>You can control cookies through your browser settings.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Data Retention</h2>
              <p>We retain your data:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>As long as your account is active</li>
                <li>For up to 30 days after account deletion (for backup and recovery)</li>
                <li>Longer if required by law or for legitimate business purposes</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Children's Privacy</h2>
              <p>
                Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. 
                If we become aware that we have collected such information, we will delete it promptly.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page 
                and updating the "Last updated" date. Continued use of our service after changes constitutes acceptance of the new policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Email: johnleonardesperancilla@gmail.com</li>
                <li>Through our <Link href="/support" className="text-primary hover:underline">support page</Link></li>
              </ul>
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
