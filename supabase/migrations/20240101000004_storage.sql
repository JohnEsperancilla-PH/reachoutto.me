-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own profile photos
CREATE POLICY "Users can upload their own profile photo" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'profiles' AND
        (storage.foldername(name))[1] = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[2]
    );

-- Allow authenticated users to update their own profile photos
CREATE POLICY "Users can update their own profile photo" ON storage.objects
    FOR UPDATE TO authenticated
    USING (
        bucket_id = 'profiles' AND
        (storage.foldername(name))[1] = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[2]
    );

-- Allow authenticated users to delete their own profile photos
CREATE POLICY "Users can delete their own profile photo" ON storage.objects
    FOR DELETE TO authenticated
    USING (
        bucket_id = 'profiles' AND
        (storage.foldername(name))[1] = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[2]
    );

-- Allow public access to profile photos
CREATE POLICY "Profile photos are publicly accessible" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'profiles');

-- Update RLS for users table to allow avatar_url updates
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        (
            username IS NOT NULL AND
            (
                avatar_url IS NULL OR
                avatar_url LIKE '%/storage/v1/object/public/profiles/avatars/%'
            )
        )
    );
