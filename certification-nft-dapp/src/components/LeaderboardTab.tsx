"use client";

import React, { useEffect, useState, useRef } from "react";
import { RankCard } from "./RankCard";
import { RiTrophyFill, RiFireFill } from "react-icons/ri";
import { getTelegramUser, isInTelegram } from "@/lib/telegram";

interface LeaderboardUser {
  user_address: string;
  points: number;
  telegram_id?: number;
  referral_count?: number;
  created_at?: string;
  avatar?: string | null;
  user_name?: string | null;
}

type LeaderboardType = "daily" | "weekly" | "alltime";

interface LeaderboardTabProps {
  userAddress?: string;
}

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ userAddress }) => {
  const [activeTab, setActiveTab] = useState<LeaderboardType>("alltime");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(false);

  // keep previous ranks to animate changes
  const previousRanksRef = useRef<Record<string, number>>({});

  useEffect(() => {
    fetchLeaderboard(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // detect telegram user (client-only)
  const [telegramUser, setTelegramUser] = useState<any | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined" && isInTelegram()) {
      const tu = getTelegramUser();
      setTelegramUser(tu || null);
    }
  }, []);

  const fetchLeaderboard = async (type: LeaderboardType) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?limit=10&type=${type}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // save previous ranks
        const prev: Record<string, number> = {};
        leaderboardData.forEach((u, i) => {
          prev[u.user_address] = i + 1;
        });
        previousRanksRef.current = prev;

        setLeaderboardData(json.data || []);
      } else {
        setLeaderboardData([]);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch avatars from Telegram API (requires bot) - placeholder
  const getTelegramAvatar = (u: LeaderboardUser): string | undefined => {
    if ((u as any).avatar_url) return (u as any).avatar_url as string;
    return undefined;
  };

  const saveAvatarToServer = async (avatarUrl: string, initData?: string) => {
    if (!userAddress) return { success: false, message: "No userAddress" };
    try {
      const payload: any = { userAddress, avatarUrl };
      if (initData) payload.initData = initData;
      const res = await fetch("/api/save-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (err) {
      console.error("Failed to save avatar:", err);
      return { success: false };
    }
  };

  const tabConfigs = [
    { id: "daily" as LeaderboardType, label: "Daily", icon: <RiFireFill className="w-4 h-4" /> },
    { id: "weekly" as LeaderboardType, label: "Weekly", icon: <RiTrophyFill className="w-4 h-4" /> },
    { id: "alltime" as LeaderboardType, label: "All Time", icon: <RiTrophyFill className="w-4 h-4" /> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RiTrophyFill className="w-5 h-5 text-yellow-400" />
          <h4 className="font-semibold">Top by Points</h4>
        </div>
        <div className="flex items-center gap-2">
          {tabConfigs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`text-xs px-2 py-1 rounded-md font-medium ${activeTab === t.id ? "bg-white/8 text-white" : "text-white/60 hover:bg-white/4"}`}
            >
              <span className="inline-flex items-center gap-1">{t.icon}<span className="ml-1">{t.label}</span></span>
            </button>
          ))}
        </div>
      </div>

      <div>
        {loading ? (
          <div className="py-6">
            <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-purple-300/70 text-sm text-center">Loading rankings...</p>
          </div>
        ) : leaderboardData.length > 0 ? (
          <div className="space-y-1">
            {leaderboardData.map((user, index) => (
              <div
                key={user.user_address}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <RankCard
                  rank={index + 1}
                  userAddress={user.user_address}
                  points={user.points}
                  avatar={getTelegramAvatar(user)}
                  previousRank={previousRanksRef.current[user.user_address] ?? null}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-purple-300/70 text-center">No leaderboard data available yet</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="text-xs text-purple-300/50">Last updated: Just now</div>
        {telegramUser && telegramUser.photo_url && userAddress ? (
          <div className="text-right">
            <button
              className="text-xs px-3 py-1 rounded-md bg-white/6 hover:bg-white/9"
              onClick={async () => {
                try {
                  const webAppData = (window as any)?.Telegram?.initData || (telegramUser && (telegramUser.initData || (typeof window !== 'undefined' && (window as any).WebApp ? (window as any).WebApp.initData : undefined)));
                  // fallback to getWebAppData via global if available
                  const r = await saveAvatarToServer(telegramUser.photo_url, webAppData || undefined);
                  if (r?.success) {
                    // refetch leaderboard for current tab to pick up avatar
                    fetchLeaderboard(activeTab);
                  } else {
                    console.warn('save avatar failed', r);
                  }
                } catch (e) {
                  console.warn(e);
                }
              }}
            >
              Save my Telegram Avatar
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LeaderboardTab;
