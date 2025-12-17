-- Add achievements array and referral_count to user_stats
ALTER TABLE IF EXISTS user_stats
ADD COLUMN IF NOT EXISTS achievements TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE IF EXISTS user_stats
ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;

-- Index on referral_count for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_user_stats_referral_count ON user_stats(referral_count);

-- Ensure updated_at trigger exists (migration 001 adds it but keep idempotent)
CREATE OR REPLACE FUNCTION update_user_stats_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_update_user_stats_timestamp'
  ) THEN
    CREATE TRIGGER trigger_update_user_stats_timestamp
    AFTER UPDATE ON user_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats_timestamp();
  END IF;
END$$;
