-- Add font customization fields to users table
ALTER TABLE users 
ADD COLUMN custom_font VARCHAR(100) DEFAULT NULL,
ADD COLUMN use_custom_font BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN users.custom_font IS 'Custom font family name for the user profile';
COMMENT ON COLUMN users.use_custom_font IS 'Whether to use custom font instead of default';
