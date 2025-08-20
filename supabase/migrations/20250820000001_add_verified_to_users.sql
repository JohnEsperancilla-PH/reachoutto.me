-- Add verified field to users table
ALTER TABLE users ADD COLUMN verified BOOLEAN DEFAULT false;
