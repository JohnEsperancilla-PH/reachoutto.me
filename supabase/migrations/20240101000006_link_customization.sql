-- Add icon and color columns to links table
ALTER TABLE links
ADD COLUMN icon TEXT DEFAULT 'Link',
ADD COLUMN color TEXT DEFAULT 'default';
