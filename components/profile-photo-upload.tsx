"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Camera, Trash2, Loader2 } from "lucide-react"
import { uploadProfilePhoto, deleteProfilePhoto } from "@/lib/supabase/storage"

interface ProfilePhotoUploadProps {
  userId: string
  currentPhotoUrl?: string | null
  onUpdate: (url: string | null) => void
  className?: string
}

export function ProfilePhotoUpload({ userId, currentPhotoUrl, onUpdate, className }: ProfilePhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Reset input value to allow uploading the same file again
    e.target.value = ''

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB')
      return
    }

    setIsUploading(true)
    try {
      const url = await uploadProfilePhoto(file, userId)
      onUpdate(url)
    } catch (error: any) {
      alert('Error uploading photo: ' + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentPhotoUrl) return
    if (!confirm('Are you sure you want to remove your profile photo?')) return

    setIsDeleting(true)
    try {
      await deleteProfilePhoto(userId)
      onUpdate(null)
    } catch (error: any) {
      alert('Error deleting photo: ' + error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className={className}>
      <div className="relative group">
        <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden bg-muted">
          {currentPhotoUrl ? (
            <Image
              src={currentPhotoUrl}
              alt="Profile photo"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
              {userId.charAt(0).toUpperCase()}
            </div>
          )}
          
          {/* Upload/Loading Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
            {isUploading || isDeleting ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  <Camera className="h-4 w-4 text-white" />
                </Button>
                {currentPhotoUrl && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30"
                    onClick={handleDelete}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="mt-2 text-center">
        <p className="text-sm text-muted-foreground">
          {currentPhotoUrl ? 'Change photo' : 'Add photo'}
        </p>
      </div>
    </div>
  )
}
