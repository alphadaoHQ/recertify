"use client";
import { useEffect, useState } from "react";
import BadgesPanel from "@/components/BadgesPanel";
import Leaderboard from "@/components/Leaderboard";

interface RewardsTabProps {
  userAddress?: string | null;
}

function shortAddr(addr: string | null | undefined) {
  if (!addr) return "—";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function RewardsTab({ userAddress }: RewardsTabProps) {
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        if (userAddress) {
          const resA = await fetch(`/api/user-achievements`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userAddress }),
          });
          const jsonA = await resA.json();
          setAchievements(jsonA.success ? jsonA.data : []);
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

      <div className="mb-8">
        <Leaderboard />
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
