"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import LinkCard from "@/components/link-card"
import PortfolioCard from "@/components/portfolio-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProfileQRCode } from "@/components/profile-qr-code"
import { ProfileShareModal } from "@/components/profile-share-modal"
import { Link as LinkIcon, Coffee, Briefcase, CheckCircle, Mail, Phone } from "lucide-react"
import type { User, Link as LinkType, PortfolioItem } from "@/lib/types/database"

interface PublicProfileProps {
  user: User
  links: LinkType[]
  portfolioItems: PortfolioItem[]
}

export default function PublicProfile({ user, links, portfolioItems }: PublicProfileProps) {
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

  // Check if custom background is enabled
  const hasCustomBackground = user.use_custom_background && user.custom_background

  // Check if custom font is enabled
  const hasCustomFont = user.use_custom_font && user.custom_font

  // Determine background style
  const backgroundStyle = hasCustomBackground && user.custom_background
    ? { background: user.custom_background }
    : undefined

  // Determine font style
  const fontStyle = hasCustomFont && user.custom_font
    ? { fontFamily: user.custom_font }
    : undefined

  const containerClass = hasCustomBackground
    ? "min-h-screen"
    : "min-h-screen bg-gradient-to-br from-background to-muted/20"

  // Determine text colors based on custom background
  const textColorClasses = hasCustomBackground ? {
    primary: "text-white/90",
    secondary: "text-white/70", 
    muted: "text-white/60",
    card: "bg-white/10 backdrop-blur-sm border-white/20 text-white",
    button: "bg-transparent hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200",
    buttonActive: "bg-white/20 backdrop-blur-sm text-white shadow-sm",
    link: "text-white/80 hover:text-white",
    divider: "text-white/30",
    sectionContainer: "bg-white/10 backdrop-blur-sm border-white/20"
  } : {
    primary: "text-foreground",
    secondary: "text-muted-foreground",
    muted: "text-muted-foreground", 
    card: "bg-card text-card-foreground border",
    button: "bg-transparent text-muted-foreground hover:text-foreground",
    buttonActive: "bg-background text-foreground shadow-sm",
    link: "text-muted-foreground hover:text-foreground",
    divider: "text-muted-foreground/50",
    sectionContainer: "bg-muted"
  }

  const handleLinkClick = (url: string) => {
    // Add https:// if not present
    const fullUrl = url.startsWith("http") ? url : `https://${url}`
    window.open(fullUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className={containerClass} style={{ ...backgroundStyle, ...fontStyle }}>
      <main className="container mx-auto px-4 md:px-6 py-6 sm:py-8">
        <div className="max-w-sm sm:max-w-md mx-auto space-y-6 sm:space-y-8">
          {/* Top Controls */}
          <div className="flex justify-between items-center">
            <ProfileQRCode 
              profileUrl={typeof window !== 'undefined' ? window.location.href : `https://reachoutto.me/${user.username}`}
              username={user.username}
              customTheme={!!hasCustomBackground}
            />
            <div className="flex items-center gap-2">
              <ProfileShareModal
                username={user.username}
                bio={user.bio || undefined}
                profileUrl={typeof window !== 'undefined' ? window.location.href : `https://reachoutto.me/${user.username}`}
                ogImageUrl={`/api/og?username=${user.username}`}
                customTheme={!!hasCustomBackground}
              />
              {/* Hide theme toggle when custom background is active */}
              <ThemeToggle disabled={!!hasCustomBackground} />
            </div>
          </div>

          {/* Profile Section */}
          <div className="text-center space-y-4 sm:space-y-6">
            {user.avatar_url ? (
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
                <Image
                  src={user.avatar_url}
                  alt={`${user.username}'s avatar`}
                  fill
                  className={`rounded-full object-cover border-4 shadow-lg ${
                    hasCustomBackground 
                      ? 'border-white/30' 
                      : 'border-background'
                  }`}
                />
              </div>
            ) : (
              <div className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center border-4 shadow-lg ${
                hasCustomBackground 
                  ? 'bg-white/20 backdrop-blur-sm border-white/30 text-white' 
                  : 'bg-gradient-to-br from-primary to-primary/60 border-background text-primary-foreground'
              }`}>
                <span className="text-xl sm:text-2xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="space-y-2 sm:space-y-3">
              <h1 className={`text-xl sm:text-2xl font-bold flex items-center justify-center gap-1 ${textColorClasses.primary}`}>
                @{user.username}
                {user.verified && (
                  <span className="inline-flex items-center" aria-label="Verified">
                    <CheckCircle className={`inline h-5 w-5 ${hasCustomBackground ? 'text-white' : 'text-blue-500'}`} />
                    <span className="sr-only">Verified</span>
                  </span>
                )}
              </h1>
              {user.bio && (
                <p className={`text-sm sm:text-base text-center max-w-xs sm:max-w-sm mx-auto leading-relaxed px-4 sm:px-0 ${textColorClasses.secondary}`}>
                  {user.bio}
                </p>
              )}

              {/* Contact Information - Integrated Style */}
              {user.show_contact && (user.contact_email || user.contact_phone) && (
                <div className={`flex flex-wrap justify-center gap-2 text-xs ${textColorClasses.muted}`}>
                  {user.contact_email && (
                    <a 
                      href={`mailto:${user.contact_email}`}
                      className={`flex items-center gap-1 transition-colors ${textColorClasses.link}`}
                    >
                      <Mail className="h-3 w-3" />
                      {user.contact_email}
                    </a>
                  )}
                  {user.contact_phone && (
                    <>
                      {user.contact_email && <span className={textColorClasses.divider}>•</span>}
                      <a 
                        href={`tel:${user.contact_phone}`}
                        className={`flex items-center gap-1 transition-colors ${textColorClasses.link}`}
                      >
                        <Phone className="h-3 w-3" />
                        {user.contact_phone}
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6 sm:space-y-8">
            {/* Section Toggle (only show if both sections are available) */}
            {hasLinks && hasPortfolio && (
              <div className="flex items-center justify-center">
                <div className={`flex items-center rounded-full p-1.5 shadow-sm ${textColorClasses.sectionContainer}`}>
                  <button
                    onClick={() => setActiveSection('links')}
                    className={`px-6 py-2.5 text-sm font-medium rounded-full ${
                      activeSection === 'links'
                        ? textColorClasses.buttonActive
                        : textColorClasses.button
                    }`}
                  >
                    Links
                  </button>
                  <button
                    onClick={() => setActiveSection('portfolio')}
                    className={`px-6 py-2.5 text-sm font-medium rounded-full ${
                      activeSection === 'portfolio'
                        ? textColorClasses.buttonActive
                        : textColorClasses.button
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
                      customTheme={!!hasCustomBackground}
                    />
                  ))
                ) : (
                  <div className={`text-center py-12 sm:py-16 ${textColorClasses.muted}`}>
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
                        customTheme={!!hasCustomBackground}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-12 sm:py-16 ${textColorClasses.muted}`}>
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
            <div className={`flex items-center justify-center gap-3 text-xs sm:text-sm ${textColorClasses.muted}`}>
              <Link
                href="/"
                className={`inline-flex items-center gap-2 transition-colors underline ${textColorClasses.link}`}
              >
                <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                Create your own reachoutto.me
              </Link>
              
              <span className={textColorClasses.divider}>|</span>
              
              <button
                onClick={() => window.open('https://www.buymeacoffee.com/johnesperancilla', '_blank')}
                className={`inline-flex items-center gap-2 transition-colors underline ${textColorClasses.link}`}
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
