"use client";
import { useEffect, useState } from "react";
import BadgesPanel from "@/components/BadgesPanel";
import { RiTrophyFill, RiUser3Fill } from "react-icons/ri";

interface RewardsTabProps {
  userAddress?: string | null;
}

function shortAddr(addr: string | null | undefined) {
  if (!addr) return "—";
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

export default function RewardsTab({ userAddress }: RewardsTabProps) {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [referrers, setReferrers] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const resL = await fetch(`/api/leaderboard?limit=10`);
        const jsonL = await resL.json();
        setLeaders(jsonL.success ? jsonL.data : []);

        const resR = await fetch(`/api/top-referrers?limit=10`);
        const jsonR = await resR.json();
        setReferrers(jsonR.success ? jsonR.data : []);

        if (userAddress) {
          const resA = await fetch(`/api/user-achievements`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userAddress }) });
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
        <p className="text-sm text-white/70">See top performers and your achievements</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/6 p-4 bg-gradient-to-br from-white/3 to-white/2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <RiTrophyFill className="w-5 h-5 text-yellow-400" />
              <h4 className="font-semibold">Top by Points</h4>
            </div>
            <span className="text-xs text-white/70">Top 10</span>
          </div>
          <ol className="space-y-2">
            {leaders.map((u, idx) => (
              <li key={u.user_address} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-700 to-purple-500 flex items-center justify-center text-white font-mono">{(idx+1)}</div>
                  <div className="min-w-0">
                    <div className="truncate font-medium">{shortAddr(u.user_address)}</div>
                    <div className="text-xs text-white/60">{u.user_address}</div>
                  </div>
                </div>
                <div className="font-semibold">{u.points || 0} pts</div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-white/6 p-4 bg-gradient-to-br from-white/3 to-white/2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <RiUser3Fill className="w-5 h-5 text-cyan-400" />
              <h4 className="font-semibold">Top Referrers</h4>
            </div>
            <span className="text-xs text-white/70">Top 10</span>
          </div>
          <ol className="space-y-2">
            {referrers.map((u, idx) => (
              <li key={u.user_address} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-700 to-sky-500 flex items-center justify-center text-white font-mono">{(idx+1)}</div>
                  <div className="min-w-0">
                    <div className="truncate font-medium">{shortAddr(u.user_address)}</div>
                    <div className="text-xs text-white/60">{u.user_address}</div>
                  </div>
                </div>
                <div className="font-semibold">{u.referral_count || 0}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-6">
        <BadgesPanel userAddress={userAddress} initialAchievements={achievements} />
      </div>
    </div>
  );
}
