"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Share2, Copy, Check, Facebook, Twitter } from "lucide-react"
import Image from "next/image"

interface ProfileShareModalProps {
  username: string
  bio?: string
  profileUrl: string
  ogImageUrl: string
  className?: string
}

export function ProfileShareModal({ 
  username, 
  bio, 
  profileUrl, 
  ogImageUrl,
  className = "" 
}: ProfileShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username} - reachoutto.me`,
          text: bio || `Check out ${username}'s links`,
          url: profileUrl,
        })
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(profileUrl)
      }
    } else {
      copyToClipboard(profileUrl)
    }
  }

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const shareToTwitter = () => {
    const text = bio ? `Check out ${username}'s profile: ${bio}` : `Check out ${username}'s profile`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={className}>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share {username}'s Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* OG Image Preview */}
            <div className="bg-gradient-to-br from-muted/30 to-muted/60 rounded-lg p-4 border">
              <div className="aspect-[1.91/1] relative rounded-md overflow-hidden bg-white">
                <Image
                  src={ogImageUrl}
                  alt={`${username}'s profile preview`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                This is how your profile will appear when shared
              </p>
            </div>

            {/* Share URL */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Profile URL</label>
              <div className="flex gap-2">
                <div className="flex-1 p-2 bg-muted rounded border text-sm truncate">
                  {profileUrl}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(profileUrl)}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Share to</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={shareToFacebook}
                  className="w-full"
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  onClick={shareToTwitter}
                  className="w-full"
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
              </div>
              
              {/* Native Share (if available) */}
              {canShare && (
                <Button
                  variant="default"
                  onClick={handleNativeShare}
                  className="w-full"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share via System
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
