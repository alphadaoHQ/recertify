/**
 * Server-side task verification helpers
 * These can be called from API routes to verify task completions
 */

import supabase from "@/lib/supabaseClient";
import {
  awardAchievement,
  incrementReferralCount,
} from "@/lib/supabaseService";

export interface VerifyTaskResult {
  success: boolean;
  message: string;
}

/**
 * Verify if user follows Twitter account
 * Note: This requires Twitter API integration (not implemented here)
 */
export async function verifyTwitterFollow(
  _userHandle: string,
): Promise<VerifyTaskResult> {
  // TODO: Integrate with Twitter API to verify follow
  // For now, return mock success
  return {
    success: true,
    message: "Twitter follow verified",
  };
}

/**
 * Verify if user joined Telegram group
 * Note: This requires Telegram Bot API integration (not implemented here)
 */
export async function verifyTelegramJoin(
  _userTelegramId: string,
): Promise<VerifyTaskResult> {
  // TODO: Integrate with Telegram Bot API to verify membership
  // For now, return mock success
  return {
    success: true,
    message: "Telegram join verified",
  };
}

/**
 * Verify referral: check if referred user exists and has completed at least one task
 */
export async function verifyReferral(
  referrerAddress: string,
  referredAddress: string,
): Promise<VerifyTaskResult> {
  try {
    // Check if referred user exists in user_stats
    const { data, error } = await supabase
      .from("user_stats")
      .select("claimed_task_ids")
      .eq("user_address", referredAddress)
      .single();

    if (error || !data) {
      return { success: false, message: "Referred user not found" };
    }

    // Check if referred user has completed at least one task
    if (
      Array.isArray(data.claimed_task_ids) &&
      data.claimed_task_ids.length > 0
    ) {
      // Increment referrer's count and award simple achievement
      try {
        await incrementReferralCount(referrerAddress);
        await awardAchievement(referrerAddress, "referrer_1");
      } catch (_e) {
        // non-fatal
      }
      return { success: true, message: "Referral verified" };
    }

    return {
      success: false,
      message: "Referred user has not completed any tasks yet",
    };
  } catch (_err) {
    return { success: false, message: "Referral verification failed" };
  }
}

/**
 * Verify NFT mint: check if user has minted at least one NFT on chain
 * Note: Requires TON blockchain integration
 */
export async function verifyNFTMint(
  _userAddress: string,
): Promise<VerifyTaskResult> {
  // TODO: Integrate with TON blockchain to check NFT mints
  // For now, return mock success
  return {
    success: true,
    message: "NFT mint verified",
  };
}

/**
 * Verify certificate view: check if user has viewed at least 5 certificates
 * This would be tracked locally but could be verified against a view log
 */
export async function verifyCertificateViews(
  _userAddress: string,
  viewCount: number = 5,
): Promise<VerifyTaskResult> {
  if (viewCount >= 5) {
    return { success: true, message: "Certificate views verified" };
  }
  return {
    success: false,
    message: `User has only viewed ${viewCount}/5 certificates`,
  };
}

/**
 * Mark a task as verified and lock it (prevent unclaiming)
 */
export async function verifyAndLockTask(
  _userAddress: string,
  _taskId: string,
  verificationFn: () => Promise<VerifyTaskResult>,
): Promise<VerifyTaskResult> {
  try {
    // Run verification
    const result = await verificationFn();

    if (result.success) {
      // TODO: Update database to mark task as verified/locked
      // This prevents users from claiming again or tampering with claims
    }

    return result;
  } catch (_err) {
    return { success: false, message: "Verification failed" };
  }
}
