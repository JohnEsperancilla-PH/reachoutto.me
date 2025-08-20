-- Add admin policies for verified status management
-- Allow admins to update any user's verified status
CREATE POLICY "Admins can update user verification" ON users
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.id = auth.uid() 
            AND admin_user.is_admin = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.id = auth.uid() 
            AND admin_user.is_admin = true
        )
    );

-- Create admin function to update user verification status
CREATE OR REPLACE FUNCTION admin_update_user_verification(target_user_id UUID, verified_status BOOLEAN)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_id UUID;
    is_current_admin BOOLEAN;
BEGIN
    -- Get the current user ID
    current_user_id := auth.uid();
    
    -- Check if current user is admin
    SELECT is_admin INTO is_current_admin 
    FROM users 
    WHERE id = current_user_id;
    
    -- Only allow if current user is admin
    IF NOT is_current_admin THEN
        RAISE EXCEPTION 'Access denied: Admin privileges required';
    END IF;
    
    -- Update the user's verified status
    UPDATE users 
    SET verified = verified_status 
    WHERE id = target_user_id;
    
    -- Return success
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error and return false
        RAISE EXCEPTION 'Failed to update verification status: %', SQLERRM;
END;
$$;
