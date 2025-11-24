-- Add an index on points for faster ORDER BY queries
-- Run this in your Postgres / Supabase SQL editor

CREATE INDEX IF NOT EXISTS idx_user_stats_points ON user_stats (points DESC);

-- If your DB supports CONCURRENTLY and you have low traffic, prefer:
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_stats_points ON user_stats (points DESC);
