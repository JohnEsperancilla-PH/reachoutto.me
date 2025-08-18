import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Link as LinkIcon, UserX, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <LinkIcon className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg sm:text-xl">reachoutto.me</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/auth">
              <Button size="sm">Create Your Page</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-16">
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <UserX className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">User Not Found</CardTitle>
              <CardDescription>
                This profile doesn't exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The user you're looking for might have:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Changed their username</li>
                <li>• Deleted their account</li>
                <li>• Never existed</li>
              </ul>
              <div className="pt-4">
                <Link href="/" className="inline-block w-full">
                  <Button className="w-full gap-2">
                    <Home className="h-4 w-4" />
                    Go Home
                  </Button>
                </Link>
              </div>
              <div className="pt-2">
                <Link href="/auth">
                  <Button variant="outline" className="w-full">
                    Create Your Own Page
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}