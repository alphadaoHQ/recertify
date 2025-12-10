"use client";
import { useEffect, useState } from "react";
import BadgesPanel from "@/components/BadgesPanel";
import { LeaderboardTab } from "@/components/LeaderboardTab";

interface RewardsTabProps {
  userAddress?: string | null;
}

function shortAddr(addr: string | null | undefined) {
  if (!addr) return "—";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function RewardsTab({ userAddress }: RewardsTabProps) {
  const [achievements, setAchievements] = useState<string[]>([]);
  const [userStats, setUserStats] = useState<{
    points: number;
    daily_streak: number;
    level: number;
  } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (userAddress) {
          // Load achievements
          const resA = await fetch(`/api/user-achievements`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userAddress }),
          });
          const jsonA = await resA.json();
          setAchievements(jsonA.success ? jsonA.data : []);

          // Load user stats for level calculation
          const stats = await import("@/lib/supabaseService").then(m => m.loadUserStats(userAddress));
          if (stats) {
            const level = Math.max(1, Math.floor(stats.points / 500) + 1);
            setUserStats({
              points: stats.points,
              daily_streak: stats.daily_streak || 0,
              level,
            });
          }
        }
      } catch (err) {
        console.warn("Failed to load rewards data", err);
      }
    }
    load();
  }, [userAddress]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-xl font-extrabold">Rewards & Leaderboards</h3>
        <p className="text-sm text-white/70">
          See top performers and your achievements
        </p>
      </div>

      {/* User Stats Section */}
      {userStats && (
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl border border-purple-700/50 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-2xl font-bold text-white">Your Stats</h4>
              <p className="text-sm text-gray-400">Progress overview</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Level</p>
              <p className="font-bold text-2xl text-white">{userStats.level}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-800/60 to-blue-800/60 border border-purple-600/30">
              <p className="text-xs font-medium mb-2 text-gray-400">Total Points</p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">⚡</span>
                <span className="font-bold text-xl text-white">{userStats.points}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-800/60 to-blue-800/60 border border-purple-600/30">
              <p className="text-xs font-medium mb-2 text-gray-400">Daily Streak</p>
              <div className="flex items-center gap-2">
                <span className="text-pink-400">✨</span>
                <span className="font-bold text-xl text-white">{userStats.daily_streak}d</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <LeaderboardTab userAddress={userAddress || undefined} />
      </div>

      <div className="mt-6">
        <BadgesPanel
          userAddress={userAddress}
          initialAchievements={achievements}
        />
      </div>
    </div>
  );
}
