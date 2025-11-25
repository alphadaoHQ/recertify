-- ============================================================
-- COMPLETE USER_STATS TABLE SCHEMA WITH REFERRAL CODE
-- ============================================================
-- This migration creates the complete user_stats table with all features
-- including the new referral_code column for Telegram referral links
-- ============================================================

-- Drop existing table if you need to start fresh (UNCOMMENT ONLY IF STARTING FROM SCRATCH)
-- DROP TABLE IF EXISTS public.user_stats CASCADE;

-- ============================================================
-- CREATE USER_STATS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_stats (
  -- Primary key: user wallet address
  user_address TEXT NOT NULL PRIMARY KEY,
  
  -- Points system
  points BIGINT DEFAULT 0 NOT NULL,
  
  -- Referral system
  referral_count INTEGER DEFAULT 0 NOT NULL,
  referral_code TEXT UNIQUE, -- Unique alphanumeric code for Telegram links (e.g., t.me/AlphaDAOs/{code})
  
  -- Daily streak tracking
  daily_streak INTEGER DEFAULT 0 NOT NULL,
  last_checkin DATE,
  
  -- Task and achievement tracking
  claimed_task_ids TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  achievements TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================

-- Index on user_address (already indexed as PRIMARY KEY, but explicit for clarity)
CREATE INDEX IF NOT EXISTS idx_user_stats_user_address ON public.user_stats(user_address);

-- Index on points for leaderboard queries (sorted by points DESC)
CREATE INDEX IF NOT EXISTS idx_user_stats_points ON public.user_stats(points DESC);

-- Index on referral_count for top referrers leaderboard
CREATE INDEX IF NOT EXISTS idx_user_stats_referral_count ON public.user_stats(referral_count DESC);

-- Index on referral_code for fast lookups when generating/checking codes
CREATE INDEX IF NOT EXISTS idx_user_stats_referral_code ON public.user_stats(referral_code) WHERE referral_code IS NOT NULL;

-- Index on last_checkin for daily reset queries
CREATE INDEX IF NOT EXISTS idx_user_stats_last_checkin ON public.user_stats(last_checkin);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on the table
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean migration)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_stats;
DROP POLICY IF EXISTS "Enable insert/update for all users" ON public.user_stats;
DROP POLICY IF EXISTS "Enable update for all users" ON public.user_stats;
DROP POLICY IF EXISTS "Users can manage their own stats" ON public.user_stats;

-- Policy 1: Allow anyone to read leaderboard data (public read access)
-- This enables the frontend to fetch leaderboard without authentication
CREATE POLICY "Enable read access for all users"
ON public.user_stats FOR SELECT
USING (true);

-- Policy 2: Allow public insert for new user registrations
-- WARNING: In production, you might want to restrict this with authentication
CREATE POLICY "Enable insert for all users"
ON public.user_stats FOR INSERT
WITH CHECK (true);

-- Policy 3: Allow public update for user stats updates
-- WARNING: In production, you might want to restrict this with authentication
CREATE POLICY "Enable update for all users"
ON public.user_stats FOR UPDATE
USING (true);

-- ============================================================
-- AUTO-UPDATE TRIGGER FOR updated_at TIMESTAMP
-- ============================================================

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_stats_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_user_stats_updated_at ON public.user_stats;

-- Create trigger to auto-update updated_at on row update
CREATE TRIGGER trigger_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_timestamp();

-- ============================================================
-- ADD COLUMN COMMENTS FOR DOCUMENTATION
-- ============================================================

COMMENT ON TABLE public.user_stats IS 'User statistics and achievements table for the certification NFT dApp';
COMMENT ON COLUMN public.user_stats.user_address IS 'Primary key: User wallet address (e.g., TON wallet address)';
COMMENT ON COLUMN public.user_stats.points IS 'Total points earned by the user from completing tasks';
COMMENT ON COLUMN public.user_stats.referral_count IS 'Number of successful referrals made by this user';
COMMENT ON COLUMN public.user_stats.referral_code IS 'Unique alphanumeric code (8 chars) used in Telegram referral URLs. Format: t.me/AlphaDAOs/{referral_code}';
COMMENT ON COLUMN public.user_stats.daily_streak IS 'Current consecutive days of check-ins';
COMMENT ON COLUMN public.user_stats.last_checkin IS 'Date of last daily check-in (YYYY-MM-DD format)';
COMMENT ON COLUMN public.user_stats.claimed_task_ids IS 'Array of task IDs that the user has claimed rewards for';
COMMENT ON COLUMN public.user_stats.achievements IS 'Array of achievement IDs earned by the user';

-- ============================================================
-- VERIFICATION QUERIES (Optional - run these to verify setup)
-- ============================================================

-- View table structure
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'user_stats'
-- ORDER BY ordinal_position;

-- Check indexes
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'user_stats';

-- Check RLS policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename = 'user_stats';

