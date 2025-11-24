import supabase from "@/lib/supabaseClient";

export interface UserStats {
  user_address: string;
  points: number;
  daily_streak: number;
  claimed_task_ids: string[];
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
      console.warn("Supabase load error:", error);
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
      console.warn("Supabase save error:", error);
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
 */
export type LeaderboardType = "daily" | "weekly" | "alltime";

export async function getLeaderboard(limit: number = 10, type: LeaderboardType = "alltime") {
  try {
    if (type === "daily") {
      const today = getTodayDateString();
      const nextDay = new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0];

      const { data, error } = await supabase
        .from("user_stats")
        .select("user_address, points, referral_count, telegram_id, created_at, avatar_url, user_name")
        .gte("created_at", `${today}T00:00:00Z`)
        .lt("created_at", `${nextDay}T00:00:00Z`)
        .order("points", { ascending: false })
        .limit(limit);

      if (error) {
        console.warn("Supabase daily leaderboard error:", error);
        return [];
      }

      return data || [];
    }

    if (type === "weekly") {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const { data, error } = await supabase
        .from("user_stats")
        .select("user_address, points, referral_count, telegram_id, created_at, avatar_url, user_name")
        .gte("created_at", `${sevenDaysAgo}T00:00:00Z`)
        .order("points", { ascending: false })
        .limit(limit);

      if (error) {
        console.warn("Supabase weekly leaderboard error:", error);
        return [];
      }

      return data || [];
    }

    // alltime
    const { data, error } = await supabase
      .from("user_stats")
      .select("user_address, points, referral_count, telegram_id, created_at, avatar_url, user_name")
      .order("points", { ascending: false })
      .limit(limit);

    if (error) {
      console.warn("Supabase alltime leaderboard error:", error);
      return [];
    }

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
      .select("user_address, points, referral_count")
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
 * Fetch avatar audit entries for a user
 */
export async function getAvatarAudit(userAddress: string, limit: number = 20) {
  try {
    const { data, error } = await supabase
      .from("avatar_audit")
      .select("id, user_address, avatar_url, method, metadata, created_at")
      .eq("user_address", userAddress)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.warn("Supabase avatar_audit fetch error:", error);
      return [];
    }

    return data || [];
  } catch (_e) {
    return [];
  }
}

/**
 * Get paginated avatar audit entries for a specific user.
 * Returns { data, total, page, pageSize }.
 */
export async function getAvatarAuditPaginated(
  userAddress: string,
  page: number = 1,
  pageSize: number = 20,
) {
  try {
    const offset = (page - 1) * pageSize;

    // Get total count
    const { count, error: countError } = await supabase
      .from("avatar_audit")
      .select("*", { count: "exact", head: true })
      .eq("user_address", userAddress);

    if (countError) {
      console.warn("Supabase avatar_audit count error:", countError);
      return { data: [], total: 0, page, pageSize };
    }

    // Get paginated data
    const { data, error } = await supabase
      .from("avatar_audit")
      .select("id, user_address, avatar_url, method, metadata, created_at")
      .eq("user_address", userAddress)
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.warn("Supabase avatar_audit fetch error:", error);
      return { data: [], total: 0, page, pageSize };
    }

    return {
      data: data || [],
      total: count || 0,
      page,
      pageSize,
    };
  } catch (_e) {
    return { data: [], total: 0, page, pageSize };
  }
}

/**
 * Get all avatar audit entries (admin only). Returns paginated results.
 */
export async function getAllAvatarAuditsPaginated(
  page: number = 1,
  pageSize: number = 20,
) {
  try {
    const offset = (page - 1) * pageSize;

    // Get total count
    const { count, error: countError } = await supabase
      .from("avatar_audit")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.warn("Supabase avatar_audit count error:", countError);
      return { data: [], total: 0, page, pageSize };
    }

    // Get paginated data
    const { data, error } = await supabase
      .from("avatar_audit")
      .select("id, user_address, avatar_url, method, metadata, created_at")
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.warn("Supabase avatar_audit fetch error:", error);
      return { data: [], total: 0, page, pageSize };
    }

    return {
      data: data || [],
      total: count || 0,
      page,
      pageSize,
    };
  } catch (_e) {
    return { data: [], total: 0, page, pageSize };
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

    // Insert new row
    const { error } = await supabase.from("user_stats").insert({
      user_address: referrerAddress,
      referral_count: 1,
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
    console.warn("incrementReferralCount error:", err);
    return false;
  }
}
