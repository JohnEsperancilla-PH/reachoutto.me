-- Add icon and color columns if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'links' AND column_name = 'icon') THEN
        ALTER TABLE links ADD COLUMN icon TEXT DEFAULT 'Link';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'links' AND column_name = 'color') THEN
        ALTER TABLE links ADD COLUMN color TEXT DEFAULT 'default';
    END IF;
END $$;
