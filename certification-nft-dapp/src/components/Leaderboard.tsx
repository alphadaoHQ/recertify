"use client";

import { getOrCreateReferralCode } from "@/lib/supabaseService";
import { generateTelegramReferralLink } from "@/lib/externalLinks";
import { useLeaderboardStore } from "@/lib/stores/leaderboardStore";

export default function Leaderboard() {
    const { activeTab, data, loading, setActiveTab, loadData } = useLeaderboardStore();

    const truncateAddress = (address: string) => {
        if (!address) return "";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-gray-900 text-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Leaderboard
            </h2>

            {/* Tabs */}
            <div className="flex justify-center mb-6 space-x-4">
                <button
                    onClick={() => setActiveTab("points")}
                    className={`px-6 py-2 rounded-full transition-all duration-300 ${activeTab === "points"
                        ? "bg-blue-600 text-white shadow-blue-500/50 shadow-lg"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                >
                    Top Points
                </button>
                <button
                    onClick={() => setActiveTab("referrals")}
                    className={`px-6 py-2 rounded-full transition-all duration-300 ${activeTab === "referrals"
                        ? "bg-purple-600 text-white shadow-purple-500/50 shadow-lg"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                >
                    Top Referrers
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-700 text-gray-400 uppercase text-sm">
                            <th className="p-4">Rank</th>
                            <th className="p-4">Player</th>
                            {activeTab === "referrals" && (
                                <th className="p-4">Referral Link</th>
                            )}
                            <th className="p-4 text-right">
                                {activeTab === "points" ? "Points" : "Referrals"}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading ? (
                            <tr>
                                <td colSpan={activeTab === "referrals" ? 4 : 3} className="p-8 text-center text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={activeTab === "referrals" ? 4 : 3} className="p-8 text-center text-gray-500">
                                    No data available yet.
                                </td>
                            </tr>
                        ) : (
                            data.map((entry, index) => {
                                const referralLink = entry.referral_code 
                                    ? generateTelegramReferralLink(entry.referral_code)
                                    : null;
                                
                                return (
                                    <tr
                                        key={entry.user_address}
                                        className="hover:bg-gray-800/50 transition-colors"
                                    >
                                        <td className="p-4 font-medium">
                                            {index + 1 === 1 ? (
                                                <span className="text-yellow-400">🥇 1st</span>
                                            ) : index + 1 === 2 ? (
                                                <span className="text-gray-300">🥈 2nd</span>
                                            ) : index + 1 === 3 ? (
                                                <span className="text-amber-600">🥉 3rd</span>
                                            ) : (
                                                <span className="text-gray-500">#{index + 1}</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {entry.avatar_url ? (
                                                    <img
                                                        src={entry.avatar_url}
                                                        alt="Avatar"
                                                        className="w-8 h-8 rounded-full border border-gray-600"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
                                                        {entry.user_address.slice(0, 1).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="font-mono text-blue-300 text-sm">
                                                    {truncateAddress(entry.user_address)}
                                                </span>
                                            </div>
                                        </td>
                                        {activeTab === "referrals" && (
                                            <td className="p-4">
                                                {referralLink ? (
                                                    <a
                                                        href={referralLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-cyan-400 hover:text-cyan-300 hover:underline font-mono text-sm break-all"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            navigator.clipboard.writeText(referralLink);
                                                            // You could add a toast notification here
                                                            alert(`Referral link copied: ${referralLink}`);
                                                        }}
                                                    >
                                                        {referralLink}
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">—</span>
                                                )}
                                            </td>
                                        )}
                                        <td className="p-4 text-right font-bold text-white">
                                            {activeTab === "points"
                                                ? entry.points?.toLocaleString() || 0
                                                : entry.referral_count?.toLocaleString() || 0}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
