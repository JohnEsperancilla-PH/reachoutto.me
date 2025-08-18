-- Admin function to properly delete a user and all their data
CREATE OR REPLACE FUNCTION admin_delete_user(user_id UUID)
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
    
    -- Don't allow admin to delete themselves
    IF current_user_id = user_id THEN
        RAISE EXCEPTION 'Cannot delete your own admin account';
    END IF;
    
    -- Delete from auth.users (this will cascade to users table due to FK constraint)
    DELETE FROM auth.users WHERE id = user_id;
    
    -- Return success
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error and return false
        RAISE EXCEPTION 'Failed to delete user: %', SQLERRM;
END;
$$;

-- Function to check if a username exists (for profile pages)
CREATE OR REPLACE FUNCTION check_user_exists(username_param TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_exists BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM users WHERE username = username_param
    ) INTO user_exists;
    
    RETURN user_exists;
END;
$$;
