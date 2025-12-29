import supabase from "@/lib/supabaseClient";
import { generateReferralCode } from "@/lib/referralUtils";

export interface UserStats {
  user_address: string;
  points: number;
  daily_streak: number;
  claimed_task_ids: string[];
  achievements?: string[];
  referral_count?: number;
  referral_code?: string;
  telegram_id?: number;
  last_checkin?: string; // ISO date
}

/**
 * Load user stats from Supabase, with localStorage fallback
 */
export async function loadUserStats(
  userAddress: string,
): Promise<UserStats | null> {
  try {
    const { data, error } = await supabase
      .from("user_stats")
      .select("points, daily_streak, claimed_task_ids, last_checkin")
      .eq("user_address", userAddress)
      .single();

    if (error && (error as any).code !== "PGRST116") {
      console.error("Supabase load error:", error);
    }

    if (data) {
      // Persist to localStorage as backup
      localStorage.setItem(`tasks_user_${userAddress}`, JSON.stringify(data));
      return { user_address: userAddress, ...data };
    }
  } catch (err) {
    console.warn("Failed to load from Supabase, trying localStorage:", err);
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(`tasks_user_${userAddress}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { user_address: userAddress, ...parsed };
    }
  } catch (_e) {
    // ignore
  }

  return null;
}

/**
 * Save/upsert user stats to Supabase
 */
export async function saveUserStats(
  userAddress: string,
  stats: Omit<UserStats, "user_address">,
): Promise<boolean> {
  // Always save to localStorage first
  try {
    localStorage.setItem(`tasks_user_${userAddress}`, JSON.stringify(stats));
  } catch (_e) {
    // ignore
  }

  // Then try Supabase
  try {
    const { error } = await supabase
      .from("user_stats")
      .upsert(
        { user_address: userAddress, ...stats },
        { onConflict: "user_address" },
      );

    if (error) {
      console.error("Supabase save error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Failed to save to Supabase:", err);
    return false;
  }
}

/**
 * Check if user has already completed daily check-in today
 */
export function hasCheckedInToday(lastCheckinDate?: string): boolean {
  if (!lastCheckinDate) return false;
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  return lastCheckinDate === today;
}

/**
 * Get today's ISO date string (YYYY-MM-DD)
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Reset daily check-in task if needed (returns true if reset was done)
 */
export function shouldResetCheckIn(lastCheckinDate?: string): boolean {
  const today = getTodayDateString();
  return lastCheckinDate !== today;
}

/**
 * Fetch leaderboard ordered by points (descending)
 * @param limit - Maximum number of entries to return
 * @param type - Leaderboard type: "daily" | "weekly" | "alltime" (currently all return all-time)
 */
export async function getLeaderboard(limit: number = 10, type: "daily" | "weekly" | "alltime" = "alltime") {
  try {
    const { data, error } = await supabase
      .from("user_stats")
      .select("user_address, points, referral_count, referral_code")
      .order("points", { ascending: false })
      .limit(limit);

    if (error) {
      console.warn("Supabase leaderboard error:", error);
      return [];
    }

    // TODO: Implement filtering by type (daily/weekly) based on created_at or points_earned_date
    // For now, all types return the same all-time leaderboard

    return data || [];
  } catch (err) {
    console.warn("Failed to fetch leaderboard:", err);
    return [];
  }
}

/**
 * Fetch top referrers ordered by referral_count
 */
export async function getTopReferrers(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from("user_stats")
      .select("user_address, points, referral_count, referral_code")
      .order("referral_count", { ascending: false })
      .limit(limit);

    if (error) {
      console.warn("Supabase referrers error:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.warn("Failed to fetch top referrers:", err);
    return [];
  }
}

/**
 * Award an achievement to a user (idempotent)
 */
export async function awardAchievement(
  userAddress: string,
  achievementId: string,
) {
  try {
    // get existing achievements
    const { data } = await supabase
      .from("user_stats")
      .select("achievements")
      .eq("user_address", userAddress)
      .single();

    if (
      data &&
      Array.isArray(data.achievements) &&
      data.achievements.includes(achievementId)
    ) {
      return true; // already has achievement
    }

    const newAchievements =
      data && Array.isArray(data.achievements)
        ? [...data.achievements, achievementId]
        : [achievementId];

    const { error } = await supabase
      .from("user_stats")
      .upsert(
        { user_address: userAddress, achievements: newAchievements },
        { onConflict: "user_address" },
      );

    if (error) {
      console.warn("Failed to award achievement:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.warn("awardAchievement error:", err);
    return false;
  }
}

/**
 * Load user's achievements
 */
export async function getUserAchievements(
  userAddress: string,
): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("user_stats")
      .select("achievements")
      .eq("user_address", userAddress)
      .single();

    if (error || !data) return [];
    return Array.isArray(data.achievements) ? data.achievements : [];
  } catch (_e) {
    return [];
  }
}

/**
 * Get or generate a referral code for a user
 * Creates one if it doesn't exist
 */
export async function getOrCreateReferralCode(
  userAddress: string,
): Promise<string | null> {
  try {
    // Check if user already has a referral code
    const { data: existingData } = await supabase
      .from("user_stats")
      .select("referral_code")
      .eq("user_address", userAddress)
      .single();

    if (existingData?.referral_code) {
      return existingData.referral_code;
    }

    // Generate a unique referral code
    let attempts = 0;
    let newCode: string | null = null;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const candidateCode = generateReferralCode();

      // Check if code already exists
      const { data: existingCode } = await supabase
        .from("user_stats")
        .select("referral_code")
        .eq("referral_code", candidateCode)
        .single();

      if (!existingCode) {
        newCode = candidateCode;
        break;
      }
      attempts++;
    }

    if (!newCode) {
      console.error("Failed to generate unique referral code after attempts");
      return null;
    }

    // Update or insert user with referral code
    const { error } = await supabase
      .from("user_stats")
      .upsert(
        {
          user_address: userAddress,
          referral_code: newCode,
          points: existingData ? undefined : 0,
          daily_streak: existingData ? undefined : 0,
          claimed_task_ids: existingData ? undefined : [],
        },
        { onConflict: "user_address" },
      );

    if (error) {
      console.warn("Failed to save referral code:", error);
      return null;
    }

    return newCode;
  } catch (err) {
    console.error("getOrCreateReferralCode error:", err);
    return null;
  }
}

/**
 * Increment referral count for a referrer (create row if missing)
 */
export async function incrementReferralCount(
  referrerAddress: string,
): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("user_stats")
      .select("referral_count")
      .eq("user_address", referrerAddress)
      .single();

    if (data) {
      const current =
        typeof data.referral_count === "number" ? data.referral_count : 0;
      const { error } = await supabase
        .from("user_stats")
        .update({ referral_count: current + 1 })
        .eq("user_address", referrerAddress);
      if (error) {
        console.warn("Failed to increment referral count:", error);
        return false;
      }
      return true;
    }

    // Insert new row with a referral code
    const referralCode = await getOrCreateReferralCode(referrerAddress);
    const { error } = await supabase.from("user_stats").insert({
      user_address: referrerAddress,
      referral_count: 1,
      referral_code: referralCode,
      points: 0,
      daily_streak: 0,
      claimed_task_ids: [],
    });

    if (error) {
      console.warn("Failed to create referrer row:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("incrementReferralCount error:", err);
    return false;
  }
}
