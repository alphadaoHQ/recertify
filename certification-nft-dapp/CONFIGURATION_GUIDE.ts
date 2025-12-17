/**
 * Quick Configuration Guide for Tasks System
 *
 * This file provides easy reference for common configuration changes
 */

// ============================================
// 1. UPDATE TUTORIAL VIDEO URL
// ============================================
// File: src/lib/externalLinks.ts
//
// Find this line:
//   tutorialVideo: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//
// Replace with your actual YouTube/Vimeo URL:
//   tutorialVideo: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
//
// Example formats:
//   YouTube: https://www.youtube.com/watch?v=xyz123
//   Vimeo:   https://vimeo.com/123456789
//   Custom:  https://videos.example.com/tutorial.mp4

// ============================================
// 2. UPDATE SOCIAL LINKS
// ============================================
// File: src/lib/externalLinks.ts
//
// Twitter:
//   twitter: "https://x.com/YourHandle",
//
// Telegram:
//   telegram: "https://t.me/YourGroupName",
//
// Discord (for future use):
//   discord: "https://discord.gg/YOUR_INVITE_CODE",

// ============================================
// 3. UPDATE REFERRAL BASE URL
// ============================================
// File: src/lib/externalLinks.ts
//
// Change referralBase to your production domain:
//   referralBase: "https://your-dapp-domain.com",
//
// This generates links like:
//   https://your-dapp-domain.com?ref=0xUserAddress

// ============================================
// 4. UPDATE SHARE TEXT
// ============================================
// File: src/lib/externalLinks.ts
// Function: generateShareText()
//
// Customize the message users share when inviting friends:
//   return `Join me on the Alpha DAOs certification NFT dApp! 🚀\n\n...`

// ============================================
// 5. ADD NEW TASKS
// ============================================
// File: src/components/TasksTabRealtime.tsx
//
// Add task to initial state array:
//   {
//     id: "r2",
//     title: "Refer 5 Friends",
//     description: "Successfully refer 5 friends to the dApp",
//     reward: 500,
//     category: "Referral",
//     frequency: "Weekly",
//     completed: false,
//     claimed: false,
//     progress: 0,
//     action: "referral",
//   }

// ============================================
// 6. INTEGRATE TWITTER API VERIFICATION
// ============================================
// File: src/lib/taskVerification.ts
// Function: verifyTwitterFollow()
//
// Example implementation:
/*
import axios from 'axios';

export async function verifyTwitterFollow(userHandle: string): Promise<VerifyTaskResult> {
  try {
    const response = await axios.get(`/api/verify-twitter`, {
      params: { handle: userHandle, target: 'Alpha_Daos' }
    });
    
    if (response.data.isFollowing) {
      return { success: true, message: "Twitter follow verified" };
    }
    return { success: false, message: "User does not follow @Alpha_Daos" };
  } catch (err) {
    return { success: false, message: "Twitter verification failed" };
  }
}
*/

// ============================================
// 7. INTEGRATE TELEGRAM API VERIFICATION
// ============================================
// File: src/lib/taskVerification.ts
// Function: verifyTelegramJoin()
//
// Requires Telegram Bot Token and Chat ID
// Telegram Bot API: https://core.telegram.org/bots/api
// Method: getChatMember to check if user is in group

// ============================================
// 8. INTEGRATE TON BLOCKCHAIN VERIFICATION
// ============================================
// File: src/lib/taskVerification.ts
// Function: verifyNFTMint()
//
// Uses existing TON integration already in the app:
//   import { Contract } from '@ton/ton';
//
//   const nftCollection = new Contract(NFT_COLLECTION_ADDRESS);
//   const userNFTs = await nftCollection.getCollectionIndex(userAddress);
//
//   return { success: userNFTs.length > 0, message: "..." };

// ============================================
// 9. CUSTOMIZE TASK REWARDS
// ============================================
// File: src/components/TasksTabRealtime.tsx
//
// Find each task in initial state and update 'reward' value:
//   reward: 50,  // Change to desired points
//
// Recommendation:
//   - Simple tasks (Follow, Join): 50-100 points
//   - Engagement (Check-in, View): 10-20 points daily
//   - Learning (Tutorial): 100-200 points
//   - Referral: 500+ points for high value

// ============================================
// 10. CUSTOMIZE LEVEL PROGRESSION
// ============================================
// File: src/lib/tasksUtils.ts
// Function: calculateLevel()
//
// Current: level = floor(points / 500) + 1
//
// To change progression speed:
//   - Slower: floor(points / 1000) + 1  (more grindy)
//   - Faster: floor(points / 250) + 1   (more rewarding)

// ============================================
// 11. DEBUG SUPABASE CONNECTION
// ============================================
// Browser Console:
//
// Test Supabase connection:
//   import supabase from '@/lib/supabaseClient';
//   const { data, error } = await supabase.from('user_stats').select('*').limit(1);
//   console.log(data, error);
//
// Check local storage:
//   localStorage.getItem('userStats')
//
// Clear local storage:
//   localStorage.removeItem('userStats')

// ============================================
// 12. ENVIRONMENT VARIABLES
// ============================================
// File: src/environments/environment.ts (or .env.local for Next.js)
//
// Ensure these are set:
//   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
//
// Note: Use NEXT_PUBLIC_ prefix to expose to browser client

// ============================================
// 13. TEST DAILY RESET LOGIC
// ============================================
// Browser Console:
//
// Manually trigger daily reset:
//   const userStats = JSON.parse(localStorage.getItem('userStats'));
//   userStats.last_checkin = '2024-01-01';  // Set to past date
//   localStorage.setItem('userStats', JSON.stringify(userStats));
//   location.reload();  // Reload page to trigger reset

// ============================================
// 14. MONITOR PERFORMANCE
// ============================================
// Browser DevTools Performance Tab:
//
// Check animation smoothness:
//   1. Open DevTools > Performance
//   2. Start recording
//   3. Scroll through task cards
//   4. Stop recording
//   5. Look for dropped frames (should see 60 FPS)

// ============================================
// 15. DEPLOYMENT CHECKLIST
// ============================================
// Before going to production:
//
// ✓ Update all URLs in src/lib/externalLinks.ts
// ✓ Run Supabase migration: migrations/001_create_user_stats.sql
// ✓ Test daily reset across timezone boundaries
// ✓ Verify RLS policies are correctly set (only users read their own stats)
// ✓ Test all action buttons (Twitter, Telegram, Share, etc.)
// ✓ Verify animations work smoothly on target devices
// ✓ Clear browser cache and test with fresh session
// ✓ Test on mobile devices (iOS Safari, Android Chrome)
// ✓ Monitor Supabase logs for errors
// ✓ Set up error tracking (Sentry, LogRocket, etc.)

export default {};
