"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"
import { uploadPortfolioImage } from "@/lib/supabase/storage"

interface PortfolioImageUploadProps {
  userId: string
  currentImageUrl?: string | null
  onImageUpdate: (url: string | null) => void
}

export function PortfolioImageUpload({ userId, currentImageUrl, onImageUpdate }: PortfolioImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (1MB limit)
    if (file.size > 1 * 1024 * 1024) {
      alert('File size must be less than 1MB')
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('File type must be JPEG, PNG, GIF, or WebP')
      return
    }

    setIsUploading(true)

    try {
      // Create preview URL
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)

      // Upload the file
      const imageUrl = await uploadPortfolioImage(file, userId)
      onImageUpdate(imageUrl)

      // Clean up preview URL
      URL.revokeObjectURL(preview)
    } catch (error: any) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image: ' + error.message)
      setPreviewUrl(currentImageUrl || null)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onImageUpdate(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Project Image</Label>
      
      {previewUrl ? (
        <div className="relative group">
          <div className="relative w-full h-52 bg-muted rounded-lg overflow-hidden border mt-2">
            <Image
              src={previewUrl}
              alt="Portfolio image preview"
              fill
              className="object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleRemoveImage}
            disabled={isUploading}
            className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className="w-full h-52 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors mt-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Click to upload an image
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF, WebP (max 1MB)
            </p>
          </div>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        disabled={isUploading}
        className="hidden"
      />

      {!previewUrl && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Choose Image'}
        </Button>
      )}
    </div>
  )
}
