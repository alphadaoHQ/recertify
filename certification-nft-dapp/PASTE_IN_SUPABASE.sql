-- ============================================================
-- PASTE THIS ENTIRE SCRIPT IN SUPABASE SQL EDITOR
-- This creates the complete user_stats table with referral_code
-- ============================================================

-- Create the user_stats table
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_address TEXT NOT NULL PRIMARY KEY,
  points BIGINT DEFAULT 0 NOT NULL,
  referral_count INTEGER DEFAULT 0 NOT NULL,
  referral_code TEXT UNIQUE,
  daily_streak INTEGER DEFAULT 0 NOT NULL,
  last_checkin DATE,
  claimed_task_ids TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  achievements TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_stats_points ON public.user_stats(points DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_referral_count ON public.user_stats(referral_count DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_referral_code ON public.user_stats(referral_code) WHERE referral_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_stats_last_checkin ON public.user_stats(last_checkin);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_stats;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.user_stats;
DROP POLICY IF EXISTS "Enable update for all users" ON public.user_stats;

-- Create RLS policy: Allow anyone to read the leaderboard (public read)
CREATE POLICY "Enable read access for all users"
ON public.user_stats FOR SELECT
USING (true);

-- Create RLS policy: Allow public insert
-- WARNING: Allowing public insert/update is insecure for production but matches the current client-side code structure
CREATE POLICY "Enable insert for all users"
ON public.user_stats FOR INSERT
WITH CHECK (true);

-- Create RLS policy: Allow public update
-- WARNING: In production, restrict this with authentication
CREATE POLICY "Enable update for all users"
ON public.user_stats FOR UPDATE
USING (true);

-- Create function to auto-update the updated_at timestamp
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

-- Add column comment
COMMENT ON COLUMN public.user_stats.referral_code IS 'Unique alphanumeric code (8 characters) used in Telegram referral URLs. Format: https://t.me/AlphaDAOs/{referral_code}';

