"use client";

import { TonConnectButton } from "@tonconnect/ui-react";
import { Wallet, Lock } from "lucide-react";

interface WalletGateProps {
    isDarkMode: boolean;
    tabName: string;
}

export function WalletGate({ isDarkMode, tabName }: WalletGateProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center min-h-[60vh] p-8 rounded-2xl border ${isDarkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
        >
            {/* Lock Icon */}
            <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDarkMode
                        ? "bg-purple-900/40 border-2 border-purple-600"
                        : "bg-purple-100 border-2 border-purple-300"
                    }`}
            >
                <Lock
                    className={`w-10 h-10 ${isDarkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                />
            </div>

            {/* Heading */}
            <h2
                className={`text-2xl font-bold mb-3 text-center ${isDarkMode ? "text-white" : "text-gray-900"
                    }`}
            >
                Connect Your Wallet
            </h2>

            {/* Description */}
            <p
                className={`text-center mb-6 max-w-md ${isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
            >
                To access <span className="font-semibold text-purple-500">{tabName}</span>,
                please connect your TON wallet first. This helps us track your progress
                and rewards.
            </p>

            {/* Wallet Icon with Animation */}
            <div className="flex items-center gap-3 mb-6">
                <Wallet
                    className={`w-6 h-6 animate-pulse ${isDarkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                />
                <span
                    className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                    Secure connection via TON Connect
                </span>
            </div>

            {/* Connect Button */}
            <TonConnectButton />

            {/* Benefits List */}
            <div
                className={`mt-8 p-4 rounded-xl ${isDarkMode ? "bg-gray-900/50" : "bg-gray-50"
                    }`}
            >
                <p
                    className={`text-sm font-medium mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                >
                    By connecting, you can:
                </p>
                <ul className={`text-sm space-y-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Track your quiz and task progress
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Earn and claim rewards
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        View your NFT certificates
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Get your unique referral link
                    </li>
                </ul>
            </div>
        </div>
    );
}
