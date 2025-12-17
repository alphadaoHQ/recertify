-- Migration: Create telegram_users table to store Telegram user data
-- Run in Supabase SQL editor or via psql

CREATE TABLE IF NOT EXISTS telegram_users (
  id bigserial PRIMARY KEY,
  telegram_id bigint UNIQUE NOT NULL,
  username text,
  first_name text,
  last_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_telegram_users_telegram_id ON telegram_users (telegram_id);