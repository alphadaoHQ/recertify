-- Add referral_code column to user_stats for unique alphanumeric referral identifiers
ALTER TABLE IF EXISTS user_stats
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Create index on referral_code for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_stats_referral_code ON user_stats(referral_code);

-- Add a comment explaining the referral code format
COMMENT ON COLUMN user_stats.referral_code IS 'Unique alphanumeric code used in Telegram referral URLs (e.g., t.me/AlphaDAOs/{referral_code})';

