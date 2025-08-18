-- Cleanup script - USE WITH CAUTION!
-- This will remove all data and reset the database schema

-- Drop trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop function
DROP FUNCTION IF EXISTS handle_new_user();

-- Drop policies
DROP POLICY IF EXISTS "Users can view all profiles" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view links" ON links;
DROP POLICY IF EXISTS "Users can manage own links" ON links;

-- Drop indexes
DROP INDEX IF EXISTS idx_links_user_id;
DROP INDEX IF EXISTS idx_links_position;
DROP INDEX IF EXISTS idx_users_username;

-- Drop tables (this will delete all data!)
DROP TABLE IF EXISTS links;
DROP TABLE IF EXISTS users;
