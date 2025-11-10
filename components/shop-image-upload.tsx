"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, Upload, X } from "lucide-react"
import { uploadShopImage, deleteShopImage } from "@/lib/supabase/storage"

interface ShopImageUploadProps {
  userId: string
  currentImageUrl: string | null
  onImageUpdate: (url: string | null) => void
  className?: string
}

export function ShopImageUpload({
  userId,
  currentImageUrl,
  onImageUpdate,
  className
}: ShopImageUploadProps) {
  const [loading, setLoading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (1MB limit)
    if (file.size > 1000000) {
      alert("Image size must be less than 1MB")
      return
    }

    setLoading(true)
    try {
      // If there's an existing image, delete it first
      if (currentImageUrl) {
        await handleRemoveImage()
      }

      const url = await uploadShopImage(file, userId, (progress) => {
        setProgress(progress)
      })
      onImageUpdate(url)
    } catch (error: any) {
      console.error("Error uploading image:", error.message)
      alert("Failed to upload image. Please try again.")
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  const handleRemoveImage = async () => {
    if (!currentImageUrl) return

    setLoading(true)
    try {
      await deleteShopImage(currentImageUrl)
      onImageUpdate(null)
    } catch (error: any) {
      console.error("Error removing image:", error.message)
      alert("Failed to remove image. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <Label>Product Image (Max 1MB)</Label>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        accept="image/*"
        className="hidden"
        disabled={loading}
      />

      {currentImageUrl ? (
        <div className="mt-2 relative">
          <div className="aspect-video relative rounded-lg overflow-hidden border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImageUrl}
              alt="Product image"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute top-2 right-2 flex items-center gap-2">
            <Button
              variant="destructive"
              size="icon"
              onClick={handleRemoveImage}
              disabled={loading}
              className="h-8 w-8 shadow-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="w-full mt-2 h-32 flex-col gap-2 relative"
        >
          {loading ? (
            <>
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" />
              <span className="text-xs">{progress}%</span>
            </>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 opacity-50" />
              <span className="text-xs text-muted-foreground">
                Click to upload an image
              </span>
            </>
          )}
        </Button>
      )}
    </div>
  )
}

export default ShopImageUpload