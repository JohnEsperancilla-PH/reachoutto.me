import { createClient } from '@/lib/supabase/client'

export async function uploadProfilePhoto(file: File, userId: string) {
  const supabase = createClient()
  
  // Generate a unique file name with proper extension and timestamp
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const timestamp = Date.now()
  const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9]/g, '-')}`
  // Store files directly under user ID as the root folder
  const filePath = `${userId}/${fileName}`

  // Validate file size (50MB limit on free plan)
  if (file.size > 50 * 1024 * 1024) {
    throw new Error('File size must be less than 50MB')
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('File type must be JPEG, PNG, GIF, or WebP')
  }

  try {
    // Upload the file
    const { data, error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) throw uploadError

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath)

    // Update user profile
    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)

    if (updateError) {
      // If profile update fails, delete the uploaded file
      await supabase.storage
        .from('profiles')
        .remove([filePath])
      throw updateError
    }

    return publicUrl
  } catch (error: any) {
    console.error('Error uploading profile photo:', error.message)
    throw new Error(error.message)
  }
}

export async function deleteProfilePhoto(userId: string) {
  const supabase = createClient()

  // Get current avatar URL
  const { data: user } = await supabase
    .from('users')
    .select('avatar_url')
    .eq('id', userId)
    .single()

  if (user?.avatar_url) {
    // Extract file path from URL
    const filePath = user.avatar_url.split('profiles/')[1]
    if (filePath) {
      // Delete the file
      await supabase.storage
        .from('profiles')
        .remove([filePath])
    }
  }

  // Update user profile
  const { error } = await supabase
    .from('users')
    .update({ avatar_url: null })
    .eq('id', userId)

  if (error) throw error
}
