-- Add section toggles to users table
ALTER TABLE users 
ADD COLUMN show_links BOOLEAN DEFAULT true,
ADD COLUMN show_portfolio BOOLEAN DEFAULT false;

-- Create portfolio_items table
CREATE TABLE portfolio_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    project_url TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_portfolio_items_user_id ON portfolio_items(user_id);
CREATE INDEX idx_portfolio_items_position ON portfolio_items(user_id, position);

-- Enable RLS on portfolio_items
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Create policies for portfolio_items
CREATE POLICY "Users can view all portfolio items" ON portfolio_items FOR SELECT USING (true);

CREATE POLICY "Users can insert their own portfolio items" ON portfolio_items FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio items" ON portfolio_items FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolio items" ON portfolio_items FOR DELETE 
USING (auth.uid() = user_id);
