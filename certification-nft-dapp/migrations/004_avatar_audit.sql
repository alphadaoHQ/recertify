-- Migration: Create avatar_audit table to log avatar changes
-- Run in Supabase SQL editor or via psql

CREATE TABLE IF NOT EXISTS avatar_audit (
  id bigserial PRIMARY KEY,
  user_address text NOT NULL,
  avatar_url text NOT NULL,
  method text NOT NULL, -- 'admin' | 'telegram' | 'other'
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_avatar_audit_user_address ON avatar_audit (user_address);
