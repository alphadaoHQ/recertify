# Tasks & Rewards System - Implementation Guide

## Overview

This guide documents the gamified Tasks & Rewards system implemented for the Alpha DAOs Certification NFT dApp, similar to Hamster Combat and Notcoin.

## Features

### 1. **Task Dashboard**
- Display 6 customizable tasks across 4 categories (Social, Engagement, Learning, Referral)
- Real-time stats display: Total Points, Daily Streak, Completion Rate, Current Level
- Category filtering (All, Social, Engagement, Learning, Referral)
- Task progress tracking with visual badges

### 2. **Real Actions**
Tasks trigger real-world actions with proper fallbacks:
- **Twitter**: Opens X/Twitter to follow @Alpha_Daos
- **Telegram**: Opens Telegram to join https://t.me/AlphaDAOs
- **Tutorial**: Opens YouTube tutorial video (configure URL in `src/lib/externalLinks.ts`)
- **Gallery**: Smooth scroll to certificate gallery
- **Daily Check-in**: Increments daily streak (max once per calendar day)
- **Referral**: Share invitecode via Web Share API or clipboard

### 3. **Persistent State**
- User stats persisted to Supabase PostgreSQL database
- Automatic localStorage fallback if Supabase unavailable
- Per-user stats tracked: points, daily_streak, claimed_task_ids, last_checkin date

### 4. **Daily Reset Logic**
- Checks if calendar date has changed from last_checkin date
- Automatically resets "Daily Check-in" task for new day
- Guards against duplicate streak increments in same calendar day
- Tracks last check-in as ISO date (YYYY-MM-DD)

### 5. **Smooth Animations**
- IntersectionObserver-based scroll animations
- CSS transitions (450ms ease-out) on task cards
- Performance optimized with `will-change` CSS property

### 6. **Unit Tests**
- Vitest test suite for utility functions
- Tests for calculateLevel, completionRate, and verification helpers
- Mock Supabase integration for referral verification

## Architecture

### File Structure

```
src/
├── components/
│   ├── TasksTabRealtime.tsx          # Main tasks component
│   └── tasks-animate.css             # Scroll animation styles
├── hooks/
│   └── useAnimateOnScroll.ts         # IntersectionObserver hook
├── lib/
│   ├── supabaseClient.ts             # Supabase initialization
│   ├── supabaseService.ts            # Service layer (load/save/verify)
│   ├── externalLinks.ts              # Centralized URL configuration
│   ├── taskVerification.ts           # Verification helpers (Twitter, Telegram, referral)
│   ├── tasksUtils.ts                 # Utility functions (calculateLevel, completionRate)
│   └── tasksUtils.test.ts            # Unit tests
├── app/
│   └── api/
│       └── verify-task/
│           └── route.ts              # Server-side verification API endpoint
└── types/
    └── [Task interface in TasksTabRealtime]
migrations/
└── 001_create_user_stats.sql         # PostgreSQL schema migration
```

## Setup Instructions

### 1. Database Setup (Supabase)

Run the migration SQL in Supabase SQL Editor:

```sql
-- From migrations/001_create_user_stats.sql
CREATE TABLE IF NOT EXISTS user_stats (
  id BIGSERIAL PRIMARY KEY,
  user_address TEXT UNIQUE NOT NULL,
  points INTEGER DEFAULT 0,
  daily_streak INTEGER DEFAULT 0,
  claimed_task_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  last_checkin DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_stats_user_address ON user_stats(user_address);
CREATE INDEX IF NOT EXISTS idx_user_stats_last_checkin ON user_stats(last_checkin);

-- Enable Row Level Security
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow users to read/write own stats)
CREATE POLICY "Users can read own stats" ON user_stats
  FOR SELECT USING (auth.uid()::text = user_address);

CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE USING (auth.uid()::text = user_address);

-- Create auto-update trigger for timestamp
CREATE OR REPLACE FUNCTION update_user_stats_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_stats_timestamp
AFTER UPDATE ON user_stats
FOR EACH ROW
EXECUTE FUNCTION update_user_stats_timestamp();
```

### 2. Configuration

Update external links in `src/lib/externalLinks.ts`:

```typescript
export const EXTERNAL_LINKS = {
  twitter: "https://x.com/Alpha_Daos",
  telegram: "https://t.me/AlphaDAOs",
  tutorialVideo: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID", // ← Update this
  referralBase: "https://your-domain.com",
};
```

### 3. Environment Variables

Ensure `src/environments/environment.ts` contains:

```typescript
export const environment = {
  supabaseUrl: "https://your-project.supabase.co",
  supabaseKey: "your-anon-key",
};
```

### 4. Install Dependencies

```bash
npm install
# or
yarn install
```

### 5. Run Tests

```bash
npm run test
# or
yarn test
```

## Task Model

Each task has the following structure:

```typescript
interface Task {
  id: string;                    // Unique identifier (e.g., "s1", "e1", "l1", "r1")
  title: string;                 // Display title
  description: string;           // Short description
  reward: number;                // Points awarded when claimed
  category: "Social" | "Engagement" | "Learning" | "Referral";
  frequency: "Daily" | "Weekly" | "Special";
  completed: boolean;            // User completed the task
  claimed: boolean;              // User claimed the reward
  progress: number;              // 0-100 for multi-step tasks
  action?: string;               // Action type (twitter, telegram, checkin, view, watch, referral)
}
```

## API Endpoints

### POST `/api/verify-task`

Server-side verification for task completions.

**Request Body:**
```json
{
  "userAddress": "0x...",
  "taskId": "s1",
  "verificationType": "twitter" | "telegram" | "nft_mint" | "referral",
  "metadata": {
    "referredAddress": "0x..." // For referral verification
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task verified"
}
```

## Verification Helpers

Located in `src/lib/taskVerification.ts`:

- `verifyTwitterFollow(userHandle)` - Verify Twitter follow (placeholder for Twitter API integration)
- `verifyTelegramJoin(userTelegramId)` - Verify Telegram membership (placeholder for Telegram Bot API integration)
- `verifyReferral(referrerAddress, referredAddress)` - Check if referred user has completed tasks
- `verifyNFTMint(userAddress)` - Verify NFT mint (placeholder for TON blockchain integration)
- `verifyCertificateViews(userAddress, viewCount)` - Verify certificate viewing

## Service Layer

The `src/lib/supabaseService.ts` provides a clean abstraction:

```typescript
// Load user stats with localStorage fallback
const stats = await loadUserStats(userAddress);

// Save stats to Supabase + localStorage
await saveUserStats(userAddress, stats);

// Check if user has already checked in today
const checkedInToday = hasCheckedInToday(lastCheckinDate);

// Check if daily reset is needed (calendar date changed)
const needsReset = shouldResetCheckIn(lastCheckinDate);

// Get today's date as ISO string (YYYY-MM-DD)
const todayString = getTodayDateString();
```

## Level System

Users progress through levels based on total points:

```typescript
level = Math.floor(points / 500) + 1
```

Examples:
- 0-499 points = Level 1
- 500-999 points = Level 2
- 1000+ points = Level 3+

## Daily Streak Mechanics

- Check-in task resets daily (max once per calendar day)
- Streak increments on successful daily check-in
- `last_checkin` date tracked to enable daily reset logic
- Next day: if calendar date != last_checkin, task resets automatically

## Testing

Example test cases in `src/lib/tasksUtils.test.ts`:

```typescript
describe("calculateLevel", () => {
  it("should return level 1 for 0 points", () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it("should return level 2 for 500 points", () => {
    expect(calculateLevel(500)).toBe(2);
  });

  it("should handle large point values", () => {
    expect(calculateLevel(5000)).toBe(11);
  });
});
```

Run tests with: `npm run test`

## Browser Compatibility

- **IntersectionObserver**: Modern browsers (IE not supported)
- **Web Share API**: Chrome, Firefox, Safari, Edge
- **Clipboard API**: Modern browsers with HTTPS

## Performance Considerations

1. **CSS Animations**: Using `will-change: transform, opacity` for GPU acceleration
2. **IntersectionObserver**: Threshold set to 0.12 (detects early viewport entry)
3. **Lazy Loading**: Tasks load stats only when component mounts
4. **Database Indexes**: Applied to user_address and last_checkin for fast queries

## Future Enhancements

### Phase 2 (Recommended)
1. Real Twitter API integration for follow verification
2. Telegram Bot API integration for membership verification
3. TON blockchain integration for NFT mint verification
4. Referral leaderboard UI
5. Achievement badges system

### Phase 3 (Optional)
1. Task history/activity log
2. Weekly/monthly challenges
3. Limited-time special events
4. Social sharing rewards multiplier
5. Seasonal tasks and themes

## Troubleshooting

### Tasks not persisting after reload
- Check browser console for Supabase errors
- Verify localStorage is enabled
- Confirm userAddress is being passed to TasksTab

### Daily check-in not resetting
- Verify Supabase user_stats table has last_checkin field
- Check that date comparison is using ISO format (YYYY-MM-DD)
- Clear browser cache and test in fresh session

### Scroll animations not working
- Verify tasks-animate.css is imported
- Check browser supports IntersectionObserver
- Confirm "animate-on-scroll" className is applied

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Supabase connection and credentials
3. Review migration SQL was properly executed
4. Test with different user addresses (clear localStorage between tests)
