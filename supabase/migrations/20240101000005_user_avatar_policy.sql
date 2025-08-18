-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create new policy that explicitly allows avatar_url updates
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        (
            CASE
                WHEN avatar_url IS NOT NULL THEN
                    avatar_url LIKE 'https://%/storage/v1/object/public/profiles/%'
                ELSE true
            END
        )
    );
