import { create } from 'zustand';
import { getLeaderboard, getTopReferrers } from '../supabaseService';

interface LeaderboardEntry {
  user_address: string;
  points?: number;
  referral_count?: number;
  referral_code?: string;
  avatar_url?: string;
}

type LeaderboardType = "daily" | "weekly" | "alltime";

interface LeaderboardState {
  activeTab: "points" | "referrals";
  data: LeaderboardEntry[];
  loading: boolean;
  setActiveTab: (tab: "points" | "referrals") => void;
  loadData: () => Promise<void>;
  // For LeaderboardTab
  leaderboardType: LeaderboardType;
  setLeaderboardType: (type: LeaderboardType) => void;
  fetchLeaderboard: (type?: LeaderboardType) => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
  activeTab: "points",
  data: [],
  loading: false,
  leaderboardType: "alltime",

  setActiveTab: (tab) => {
    set({ activeTab: tab });
    get().loadData();
  },

  loadData: async () => {
    const { activeTab } = get();
    set({ loading: true });
    try {
      let result: LeaderboardEntry[] = [];
      if (activeTab === "points") {
        result = await getLeaderboard(20);
      } else {
        result = await getTopReferrers(20);
      }

      // Ensure all entries have referral codes (generate if missing)
      const { getOrCreateReferralCode } = await import("@/lib/supabaseService");
      const entriesWithCodes = await Promise.all(
        result.map(async (entry) => {
          if (!entry.referral_code) {
            const code = await getOrCreateReferralCode(entry.user_address);
            return { ...entry, referral_code: code || undefined };
          }
          return entry;
        })
      );

      set({ data: entriesWithCodes });
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    } finally {
      set({ loading: false });
    }
  },

  setLeaderboardType: (type) => {
    set({ leaderboardType: type });
    get().fetchLeaderboard(type);
  },

  fetchLeaderboard: async (type) => {
    const currentType = type || get().leaderboardType;
    set({ loading: true });
    try {
      const res = await fetch(`/api/leaderboard?limit=10&type=${currentType}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        set({ data: json.data || [] });
      } else {
        set({ data: [] });
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      set({ data: [] });
    } finally {
      set({ loading: false });
    }
  },
}));