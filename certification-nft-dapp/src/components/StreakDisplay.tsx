"use client";
import { Flame, Calendar, Trophy, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface StreakDisplayProps {
  streak: number;
  lastCheckinDate?: string;
  isDarkMode: boolean;
  compact?: boolean;
}

export function StreakDisplay({
  streak,
  lastCheckinDate,
  isDarkMode,
  compact = false
}: StreakDisplayProps) {
  const [showCelebration, setShowCelebration] = useState(false);

  // Show celebration for milestone streaks
  useEffect(() => {
    if (streak > 0 && (streak % 7 === 0 || streak === 1)) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [streak]);

  const getFlameSize = () => {
    if (streak >= 30) return "w-12 h-12";
    if (streak >= 14) return "w-10 h-10";
    if (streak >= 7) return "w-8 h-8";
    if (streak >= 3) return "w-6 h-6";
    return "w-5 h-5";
  };

  const getFlameColor = () => {
    if (streak >= 30) return "text-red-500";
    if (streak >= 14) return "text-orange-500";
    if (streak >= 7) return "text-yellow-500";
    if (streak >= 3) return "text-pink-500";
    return "text-gray-400";
  };

  const getStreakTier = () => {
    if (streak >= 30) return { name: "Legendary", color: "text-red-400", bg: "bg-red-900/20" };
    if (streak >= 14) return { name: "Epic", color: "text-orange-400", bg: "bg-orange-900/20" };
    if (streak >= 7) return { name: "Rare", color: "text-yellow-400", bg: "bg-yellow-900/20" };
    if (streak >= 3) return { name: "Uncommon", color: "text-pink-400", bg: "bg-pink-900/20" };
    return { name: "Common", color: "text-gray-400", bg: "bg-gray-900/20" };
  };

  const tier = getStreakTier();
  const bonusMultiplier = streak >= 7 ? 2 : streak >= 3 ? 1.5 : 1;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Flame className={`${getFlameSize()} ${getFlameColor()}`} />
        <span className={`font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {streak}d
        </span>
        {bonusMultiplier > 1 && (
          <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 font-medium">
            {bonusMultiplier}x bonus
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl p-4 ${tier.bg} border ${isDarkMode ? "border-gray-700/50" : "border-gray-200/50"}`}>
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 rounded-2xl flex items-center justify-center z-10 animate-pulse">
          <div className="text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-yellow-400">
              {streak === 1 ? "First Day!" : `${streak} Day Streak!`}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Flame className={`${getFlameSize()} ${getFlameColor()} animate-pulse`} />
            {streak >= 7 && (
              <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
            )}
          </div>
          <div>
            <h4 className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {streak} Day Streak
            </h4>
            <p className={`text-sm ${tier.color} font-medium`}>
              {tier.name} Streak
            </p>
          </div>
        </div>

        {bonusMultiplier > 1 && (
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-400">
              {bonusMultiplier}x
            </div>
            <div className="text-xs text-yellow-400/70">
              Check-in Bonus
            </div>
          </div>
        )}
      </div>

      {/* Mini Calendar */}
      <div className="flex items-center gap-1 mb-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-xs text-gray-400">Last 7 days</span>
      </div>

      <div className="flex gap-1">
        {Array.from({ length: 7 }, (_, i) => {
          const dayIndex = 6 - i; // Show last 7 days, newest first
          const isActive = dayIndex < streak;
          return (
            <div
              key={i}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                isActive
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 border-purple-400 text-white shadow-lg"
                  : `border-gray-300 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`
              }`}
            >
              {isActive ? "✓" : ""}
            </div>
          );
        })}
      </div>

      {/* Next Milestone */}
      {streak > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-600/30">
          <div className="flex items-center justify-between text-xs">
            <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Next milestone: {streak >= 7 ? "Keep it up!" : `${7 - streak} days to 2x bonus`}
            </span>
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" />
              <span className="text-orange-400 font-medium">
                {streak >= 7 ? "Legendary" : streak >= 3 ? "Epic" : "Rare"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}