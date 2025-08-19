"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import LinkCard from "@/components/link-card"
import PortfolioCard from "@/components/portfolio-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Link as LinkIcon, Share2, Check, Coffee, Briefcase } from "lucide-react"
import type { User, Link as LinkType, PortfolioItem } from "@/lib/types/database"

interface PublicProfileProps {
  user: User
  links: LinkType[]
  portfolioItems: PortfolioItem[]
}

export default function PublicProfile({ user, links, portfolioItems }: PublicProfileProps) {
  const [copied, setCopied] = useState(false)
  const [activeSection, setActiveSection] = useState<'links' | 'portfolio'>('links')

  // Determine which sections are available
  const hasLinks = user.show_links && links.length > 0
  const hasPortfolio = user.show_portfolio && portfolioItems.length > 0
  
  // Set default active section based on what's available
  useEffect(() => {
    if (hasLinks) {
      setActiveSection('links')
    } else if (hasPortfolio) {
      setActiveSection('portfolio')
    }
  }, [hasLinks, hasPortfolio])

  const handleShare = async () => {
    const url = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.username} - reachoutto.me`,
          text: user.bio || `Check out ${user.username}'s links`,
          url: url,
        })
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(url)
      }
    } else {
      copyToClipboard(url)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleLinkClick = (url: string) => {
    // Add https:// if not present
    const fullUrl = url.startsWith("http") ? url : `https://${url}`
    window.open(fullUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <main className="container mx-auto px-4 md:px-6 py-6 sm:py-8">
        <div className="max-w-sm sm:max-w-md mx-auto space-y-6 sm:space-y-8">
          {/* Top Controls */}
          <div className="flex justify-end items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
            >
              {copied ? (
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
              <span className="hidden sm:inline">
                {copied ? "Copied!" : "Share"}
              </span>
            </Button>
            <ThemeToggle />
          </div>

          {/* Profile Section */}
          <div className="text-center space-y-4 sm:space-y-6">
            {user.avatar_url ? (
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
                <Image
                  src={user.avatar_url}
                  alt={`${user.username}'s avatar`}
                  fill
                  className="rounded-full object-cover border-4 border-background shadow-lg"
                />
              </div>
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center border-4 border-background shadow-lg">
                <span className="text-xl sm:text-2xl font-bold text-primary-foreground">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-xl sm:text-2xl font-bold">@{user.username}</h1>
              {user.bio && (
                <p className="text-sm sm:text-base text-muted-foreground text-center max-w-xs sm:max-w-sm mx-auto leading-relaxed px-4 sm:px-0">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6 sm:space-y-8">
            {/* Section Toggle (only show if both sections are available) */}
            {hasLinks && hasPortfolio && (
              <div className="flex items-center justify-center">
                <div className="flex items-center bg-muted rounded-full p-1 shadow-sm">
                  <button
                    onClick={() => setActiveSection('links')}
                    className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all ${
                      activeSection === 'links'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Links
                  </button>
                  <button
                    onClick={() => setActiveSection('portfolio')}
                    className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all ${
                      activeSection === 'portfolio'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Portfolio
                  </button>
                </div>
              </div>
            )}

            {/* Links Content */}
            {(activeSection === 'links' || (!hasPortfolio && hasLinks)) && (
              <div className="space-y-3 sm:space-y-4">
                {links.length > 0 ? (
                  links.map((link) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      onClick={() => handleLinkClick(link.url)}
                      className="active:scale-[0.98]"
                    />
                  ))
                ) : (
                  <div className="text-center py-12 sm:py-16 text-muted-foreground">
                    <LinkIcon className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-6 opacity-50" />
                    <p className="text-base sm:text-lg font-medium mb-2">No links added yet</p>
                    <p className="text-sm sm:text-base">Check back later for updates!</p>
                  </div>
                )}
              </div>
            )}

            {/* Portfolio Content */}
            {(activeSection === 'portfolio' || (!hasLinks && hasPortfolio)) && (
              <div className="space-y-6">
                {portfolioItems.length > 0 ? (
                  <div className="grid gap-6">
                    {portfolioItems.map((item) => (
                      <PortfolioCard
                        key={item.id}
                        item={item}
                        className="active:scale-[0.98] max-w-md mx-auto w-full"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 sm:py-16 text-muted-foreground">
                    <Briefcase className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-6 opacity-50" />
                    <p className="text-base sm:text-lg font-medium mb-2">No projects added yet</p>
                    <p className="text-sm sm:text-base">Check back later for updates!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center pt-6 sm:pt-8">
            <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-muted-foreground">
              <Link
                href="/"
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors underline"
              >
                <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                Create your own reachoutto.me
              </Link>
              
              <span className="text-muted-foreground/50">|</span>
              
              <button
                onClick={() => window.open('https://www.buymeacoffee.com/johnesperancilla', '_blank')}
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors underline"
              >
                <Coffee className="h-3 w-3 sm:h-4 sm:w-4" />
                Buy me a coffee
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
