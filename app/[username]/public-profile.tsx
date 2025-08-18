"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import LinkCard from "@/components/link-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { BuyMeCoffeeButton } from "@/components/buy-me-coffee-button"
import { Link as LinkIcon, ExternalLink, Share2, Check } from "lucide-react"
import type { User, Link as LinkType } from "@/lib/types/database"

interface PublicProfileProps {
  user: User
  links: LinkType[]
}

export default function PublicProfile({ user, links }: PublicProfileProps) {
  const [copied, setCopied] = useState(false)

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
            <BuyMeCoffeeButton />
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

          {/* Links Section */}
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
              <div className="text-center py-8 sm:py-12 text-muted-foreground">
                <LinkIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                <p className="text-sm sm:text-base">No links added yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center pt-6 sm:pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              Create your own reachoutto.me
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
