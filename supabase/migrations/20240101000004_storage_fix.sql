-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profiles',
  'profiles',
  true,
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[];

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Profile photos are publicly accessible" ON storage.objects;

-- Create policies
-- Allow authenticated users to upload their own profile photos
CREATE POLICY "Users can upload their own profile photo" 
ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (
  bucket_id = 'profiles' AND 
  auth.uid()::text = (regexp_split_to_array(name, '/'))[1]
);

-- Allow authenticated users to update their own profile photos
CREATE POLICY "Users can update their own profile photo" 
ON storage.objects 
FOR UPDATE TO authenticated 
USING (
  bucket_id = 'profiles' AND 
  auth.uid()::text = (regexp_split_to_array(name, '/'))[1]
);

-- Allow authenticated users to delete their own profile photos
CREATE POLICY "Users can delete their own profile photo" 
ON storage.objects 
FOR DELETE TO authenticated 
USING (
  bucket_id = 'profiles' AND 
  auth.uid()::text = (regexp_split_to_array(name, '/'))[1]
);

-- Allow public access to profile photos
CREATE POLICY "Profile photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profiles');