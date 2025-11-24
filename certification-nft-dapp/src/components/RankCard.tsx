"use client";
import React from "react";
import { RiMedalFill } from "react-icons/ri";

interface RankCardProps {
  rank: number;
  userAddress: string;
  points: number;
  avatar?: string | null;
  userName?: string | null;
  previousRank?: number | null;
}

const getMedalIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return (
        <div className="relative w-10 h-10 flex items-center justify-center">
          <RiMedalFill className="w-10 h-10 text-yellow-400 drop-shadow-lg" />
          <span className="absolute text-xs font-bold text-yellow-900">1</span>
        </div>
      );
    case 2:
      return (
        <div className="relative w-10 h-10 flex items-center justify-center">
          <RiMedalFill className="w-9 h-9 text-gray-300 drop-shadow" />
          <span className="absolute text-xs font-bold text-gray-700">2</span>
        </div>
      );
    case 3:
      return (
        <div className="relative w-10 h-10 flex items-center justify-center">
          <RiMedalFill className="w-9 h-9 text-amber-600 drop-shadow" />
          <span className="absolute text-xs font-bold text-amber-900">3</span>
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-700 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
          {rank}
        </div>
      );
  }
};

const getRankAnimation = (rank: number, previousRank?: number | null) => {
  if (!previousRank) return "";
  if (rank < previousRank) return "animate-pulse"; // improved rank
  if (rank > previousRank) return "opacity-80 scale-95"; // dropped
  return "";
};

export const RankCard: React.FC<RankCardProps> = ({
  rank,
  userAddress,
  points,
  avatar,
  userName,
  previousRank,
}) => {
  const shortAddress = `${userAddress.slice(0, 6)}…${userAddress.slice(-4)}`;
  const displayName = userName || shortAddress;

  const rankChangeAnimation = getRankAnimation(rank, previousRank);

  return (
    <div
      className={`
        w-full px-4 py-3 mb-3 rounded-2xl
        border border-white/10 bg-gradient-to-r from-white/3 to-white/1
        backdrop-blur-sm hover:from-white/5 hover:to-white/3
        transition-all duration-300 ease-out
        ${rankChangeAnimation}
        transform hover:scale-[1.02]
      `}
    >
      <div className="flex items-center gap-4">
        {/* Rank Medal */}
        <div className="flex-shrink-0">{getMedalIcon(rank)}</div>

        {/* Avatar and Name */}
        <div className="flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-12 h-12 rounded-full border-2 border-purple-500/30 object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-700 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{displayName}</div>
          <div className="text-xs text-purple-300/70 truncate">{userAddress}</div>
        </div>

        {/* Points */}
        <div className="text-right">
          <div className="font-bold text-lg">{points?.toLocaleString() || 0}</div>
          <div className="text-xs text-purple-300/70">points</div>
        </div>
      </div>
    </div>
  );
};

export default RankCard;
