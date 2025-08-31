-- Add contact information fields to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS show_contact BOOLEAN DEFAULT false;

-- Add customization fields
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS custom_background TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS use_custom_background BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.users.contact_email IS 'User contact email address (separate from auth email)';
COMMENT ON COLUMN public.users.contact_phone IS 'User contact phone number';
COMMENT ON COLUMN public.users.show_contact IS 'Whether to show contact information on public profile';
COMMENT ON COLUMN public.users.custom_background IS 'Custom background color/gradient for profile';
COMMENT ON COLUMN public.users.use_custom_background IS 'Whether to use custom background instead of theme';

-- Update RLS policies to include new fields
-- Users can update their own contact information
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Public can read contact information if show_contact is true
-- (This is already covered by existing public read policy, but adding for clarity)
