    -- Performance Optimizations Migration
    -- Add indexes for frequently queried columns

    -- Add index on users.username for faster profile lookups
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_username ON users(username);

    -- Add index on users.is_admin for admin checks
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_is_admin ON users(is_admin) WHERE is_admin = true;

    -- Add index on users.verified for verified user queries
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_verified ON users(verified) WHERE verified = true;

    -- Add composite index on links table for user's links
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_links_user_id_position ON links(user_id, position);

    -- Add composite index on portfolio_items for user's portfolio
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_portfolio_items_user_id_order ON portfolio_items(user_id, "order");

    -- Add index on links.is_active for filtering active links
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_links_is_active ON links(is_active) WHERE is_active = true;

    -- Optimize RLS policies by adding better indexes
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_links_user_id ON links(user_id);
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_portfolio_items_user_id ON portfolio_items(user_id);

    -- Add partial index for active users (those with recent activity)
    CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active ON users(updated_at) WHERE updated_at > (NOW() - INTERVAL '30 days');

    -- Analyze tables to update statistics
    ANALYZE users;
    ANALYZE links;
    ANALYZE portfolio_items;
