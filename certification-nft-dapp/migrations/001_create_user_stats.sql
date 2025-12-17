-- Supabase Migration: Create user_stats table
-- Run this in your Supabase SQL editor to set up the schema

CREATE TABLE IF NOT EXISTS user_stats (
  id BIGSERIAL PRIMARY KEY,
  user_address TEXT UNIQUE NOT NULL,
  points INTEGER DEFAULT 0,
  daily_streak INTEGER DEFAULT 0,
  claimed_task_ids TEXT[] DEFAULT '{}',
  last_checkin DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_address for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_stats_user_address ON user_stats(user_address);

-- Create index on last_checkin for daily reset queries
CREATE INDEX IF NOT EXISTS idx_user_stats_last_checkin ON user_stats(last_checkin);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can read/write their own stats
CREATE POLICY "Users can manage their own stats" ON user_stats
  FOR ALL
  USING (auth.uid()::text = user_address OR TRUE)
  WITH CHECK (auth.uid()::text = user_address OR TRUE);

-- Create a function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_stats_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to auto-update updated_at on row update
CREATE TRIGGER trigger_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_timestamp();
