"use client";
import { useEffect, useState } from "react";
import { getUserAchievements } from "@/lib/supabaseService";
import { RiMedalFill, RiFireFill, RiUserAddFill, RiSearch2Line } from "react-icons/ri";

interface BadgesPanelProps {
  userAddress?: string | null;
  initialAchievements?: string[];
}

const BADGES = [
  { id: "first_claim", title: "First Claim", description: "Claim your first task", Icon: RiMedalFill },
  { id: "streak_7", title: "7-Day Streak", description: "Check in 7 days in a row", Icon: RiFireFill },
  { id: "referrer_1", title: "First Referral", description: "Refer your first user", Icon: RiUserAddFill },
  { id: "cert_viewer", title: "Certificate Explorer", description: "View 5 certificates", Icon: RiSearch2Line },
];

export default function BadgesPanel({ userAddress, initialAchievements = [] }: BadgesPanelProps) {
  const [owned, setOwned] = useState<string[]>(initialAchievements || []);

  useEffect(() => {
    async function load() {
      if (userAddress) {
        const a = await getUserAchievements(userAddress);
        setOwned(a || initialAchievements || []);
      }
    }
    load();
  }, [userAddress]);

  async function handleClaim(badgeId: string) {
    if (!userAddress) return;
    if (owned.includes(badgeId)) return;

    try {
      const res = await fetch(`/api/award-achievement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress, achievementId: badgeId }),
      });
      const json = await res.json();
      if (json.success) setOwned((s) => [...s, badgeId]);
    } catch (err) {
      console.warn("Failed to claim badge", err);
    }
  }

  return (
    <div className="rounded-xl border border-white/8 bg-gradient-to-br from-white/3 to-white/2 p-4 backdrop-blur-sm">
      <h4 className="font-semibold mb-3 text-lg">Achievements</h4>
      <div className="grid grid-cols-2 gap-4">
        {BADGES.map((b) => {
          const Icon = b.Icon;
          const isOwned = owned.includes(b.id);
          return (
            <div
              key={b.id}
              className={`p-4 rounded-2xl transition-transform transform hover:-translate-y-1 shadow-md ${
                isOwned
                  ? "bg-gradient-to-r from-emerald-700 to-emerald-500 text-white border-transparent"
                  : "bg-white/5 border border-white/6"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${isOwned ? "bg-white/10" : "bg-white/5"}`}>
                  <Icon className={`w-6 h-6 ${isOwned ? "text-white" : "text-purple-300"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold truncate">{b.title}</div>
                    <div className="text-xs opacity-80">{isOwned ? "Owned" : ""}</div>
                  </div>
                  <div className="text-xs text-white/70 mt-1 truncate">{b.description}</div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                {!isOwned && (
                  <button
                    onClick={() => handleClaim(b.id)}
                    className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium shadow-sm"
                  >
                    Claim
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
