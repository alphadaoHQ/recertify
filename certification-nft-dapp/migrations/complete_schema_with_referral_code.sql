-- ============================================================
-- COMPLETE USER_STATS TABLE SCHEMA (Ready to paste in Supabase SQL Editor)
-- Includes referral_code for Telegram referral links
-- ============================================================

-- Create the user_stats table
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_address TEXT NOT NULL PRIMARY KEY,
  points BIGINT DEFAULT 0 NOT NULL,
  referral_count INTEGER DEFAULT 0 NOT NULL,
  referral_code TEXT UNIQUE, -- Unique alphanumeric code for Telegram links (t.me/AlphaDAOs/{code})
  daily_streak INTEGER DEFAULT 0 NOT NULL,
  last_checkin DATE,
  claimed_task_ids TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  achievements TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================

-- Index on points for leaderboard queries (sorted DESC for top users)
CREATE INDEX IF NOT EXISTS idx_user_stats_points ON public.user_stats(points DESC);

-- Index on referral_count for top referrers leaderboard
CREATE INDEX IF NOT EXISTS idx_user_stats_referral_count ON public.user_stats(referral_count DESC);

-- Index on referral_code for fast lookups when generating/checking codes
CREATE INDEX IF NOT EXISTS idx_user_stats_referral_code ON public.user_stats(referral_code) WHERE referral_code IS NOT NULL;

-- Index on last_checkin for daily reset queries
CREATE INDEX IF NOT EXISTS idx_user_stats_last_checkin ON public.user_stats(last_checkin);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean setup)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_stats;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.user_stats;
DROP POLICY IF EXISTS "Enable update for all users" ON public.user_stats;

-- Policy 1: Allow anyone to read the leaderboard (public read access)
-- This enables the frontend to fetch leaderboard data without authentication
CREATE POLICY "Enable read access for all users"
ON public.user_stats FOR SELECT
USING (true);

-- Policy 2: Allow public insert for new user registrations
-- WARNING: Allowing public insert/update is insecure for production but matches the current client-side code structure
-- For production, you should add authentication and restrict to authenticated users only
CREATE POLICY "Enable insert for all users"
ON public.user_stats FOR INSERT
WITH CHECK (true);

-- Policy 3: Allow public update for user stats updates
-- WARNING: In production, restrict this with authentication (e.g., users can only update their own stats)
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
-- DOCUMENTATION COMMENTS
-- ============================================================

COMMENT ON COLUMN public.user_stats.referral_code IS 'Unique alphanumeric code (8 characters) used in Telegram referral URLs. Format: https://t.me/AlphaDAOs/{referral_code}';

