"use client";

import { useEffect, useState } from "react";
import { getLeaderboard, getTopReferrers } from "@/lib/supabaseService";

interface LeaderboardEntry {
    user_address: string;
    points?: number;
    referral_count?: number;
}

export default function Leaderboard() {
    const [activeTab, setActiveTab] = useState<"points" | "referrals">("points");
    const [data, setData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            let result: any[] = [];
            if (activeTab === "points") {
                result = await getLeaderboard(20);
            } else {
                result = await getTopReferrers(20);
            }
            setData(result);
        } catch (error) {
            console.error("Failed to load leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

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
                            <th className="p-4">User</th>
                            <th className="p-4 text-right">
                                {activeTab === "points" ? "Points" : "Referrals"}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-8 text-center text-gray-500">
                                    No data available yet.
                                </td>
                            </tr>
                        ) : (
                            data.map((entry, index) => (
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
                                    <td className="p-4 font-mono text-blue-300">
                                        {truncateAddress(entry.user_address)}
                                    </td>
                                    <td className="p-4 text-right font-bold text-white">
                                        {activeTab === "points"
                                            ? entry.points?.toLocaleString() || 0
                                            : entry.referral_count?.toLocaleString() || 0}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

