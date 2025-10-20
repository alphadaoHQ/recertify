"use client";

import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { Shield, User } from "lucide-react";
import { useState } from "react";
import { AddAdminForm } from "@/components/AddAdminForm";
import { ContractState } from "@/components/ContractState";
import { MintForm } from "@/components/MintForm";
import { TokenViewer } from "@/components/TokenViewer";
import { useContractState } from "@/hooks/useContractState";
import { CONTRACT_ADDRESS } from "@/lib/constants";

export default function Home() {
  const userAddress = useTonAddress();
  const { isOwner, isAdmin, refetch } = useContractState();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleTransactionSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
    setTimeout(refetch, 3000);
  };

  const handleDisconnect = () => {
    if (typeof window === "undefined") return;
    try {
      Object.keys(localStorage).forEach((key) => {
        const k = key.toLowerCase();
        if (k.includes("tonconnect") || k.includes("ton-connect") || k.includes("ton:")) {
          localStorage.removeItem(key);
        }
      });
      localStorage.removeItem("tonconnect");
    } catch (e) {}
    setTimeout(() => location.reload(), 150);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="url(#yin-yang-grad)" />
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" fill="none" />
              <path d="M12 12c0 3.314-2.686 6-6 6s-6-2.686-6-6h12z" fill="#fff" />
              <path d="M12 12c0-3.314 2.686-6 6-6s6 2.686 6 6H12z" fill="#581c87" />
              <circle cx="6" cy="12" r="2" fill="#581c87" />
              <circle cx="18" cy="12" r="2" fill="#fff" />
              <defs><linearGradient id="yin-yang-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#a855f7" /><stop offset="1" stopColor="#ec4899" /></linearGradient></defs>
            </svg>
            <div>
              <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight">CertificationNFT</h1>
              <p className="text-xs sm:text-sm text-gray-400">TON Testnet</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {userAddress && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800">
                {isOwner && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded">
                    <Shield className="w-3 h-3" />
                    Owner
                  </span>
                )}
                {isAdmin && !isOwner && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-pink-300 bg-pink-900/50 px-2 py-0.5 rounded">
                    <User className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>
            )}
            <div className="rounded-xl overflow-hidden shadow-md ring-1 ring-gray-700">
              <div className="bg-gray-900 p-1">
                <TonConnectButton />
              </div>
            </div>
            {userAddress && (
              <button
                onClick={handleDisconnect}
                className="px-3 py-2 text-sm font-medium rounded-lg bg-red-900/50 text-red-300 hover:bg-red-900 transition-shadow shadow-sm"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {successMessage && (
          <div className="fixed inset-x-4 top-20 z-50 mx-auto max-w-md p-3 rounded-xl bg-green-900/80 border border-green-700 shadow-lg">
            <p className="text-green-200 font-medium text-sm text-center">{successMessage}</p>
          </div>
        )}

        <section id="contract-state" className="mb-8">
          <ContractState />
        </section>

        {userAddress && (isAdmin || isOwner) && (
          <section id="admin-dashboard" className="mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h2>
                <p className="text-sm text-gray-400">Manage certificates and admins</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {isAdmin && <MintForm onSuccess={() => handleTransactionSuccess("Certificate minted!")} />}
              {(isOwner || isAdmin) && <AddAdminForm onSuccess={() => handleTransactionSuccess("Admin added!")} />}
            </div>
          </section>
        )}

        <section id="certificate-explorer" className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Certificate Explorer</h2>
              <p className="text-sm text-gray-400">Search and verify by ID</p>
            </div>
          </div>
          <TokenViewer />
        </section>

        {!userAddress && (
          <section className="p-6 bg-gray-800 rounded-2xl text-center mb-8 shadow-lg border border-gray-700">
            <div className="max-w-xl mx-auto">
              <svg className="w-12 h-12 mx-auto text-purple-400 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Same yin-yang SVG as logo */}
                <circle cx="12" cy="12" r="10" fill="url(#yin-yang-grad-conn)" />
                {/* ... (repeat defs and paths) */}
                <defs><linearGradient id="yin-yang-grad-conn" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#a855f7" /><stop offset="1" stopColor="#ec4899" /></linearGradient></defs>
              </svg>
              <h3 className="text-lg sm:text-2xl font-bold mb-2">Connect Wallet</h3>
              <p className="text-sm text-gray-400 mb-4">Access admin features and mint certificates.</p>
              <div className="flex justify-center">
                <div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-700">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-0.5 rounded-xl">
                    <div className="bg-gray-900 p-2 rounded-lg">
                      <TonConnectButton />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mt-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Why Choose Us?</h2>
            <p className="text-sm sm:text-lg text-gray-400">Secure on TON blockchain</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700 hover:shadow-xl transition-all">
              <div className="p-3 bg-purple-900/50 rounded-lg w-fit mb-4">
                <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-semibold mb-2">Blockchain Verified</h3>
              <p className="text-sm text-gray-400">Immutable on TON.</p>
            </div>
            {/* Similar for other cards, with pink/green accents */}
            <div className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700 hover:shadow-xl transition-all">
              <div className="p-3 bg-pink-900/50 rounded-lg w-fit mb-4">
                <Shield className="w-6 h-6 text-pink-300" />
              </div>
              <h3 className="font-semibold mb-2">Secure Access</h3>
              <p className="text-sm text-gray-400">Role-based permissions.</p>
            </div>
            <div className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700 hover:shadow-xl transition-all">
              <div className="p-3 bg-green-900/50 rounded-lg w-fit mb-4">
                <User className="w-6 h-6 text-green-300" />
              </div>
              <h3 className="font-semibold mb-2">Student Owned</h3>
              <p className="text-sm text-gray-400">Full ownership in wallets.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-12 py-8 border-t bg-black/80 backdrop-blur-sm border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-5 h-5 text-purple-400" /* yin-yang SVG */ />
                <span className="text-lg font-bold">CertificationNFT</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">Digital certificates on TON.</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-300">Contract:</span>
                <code className="text-xs bg-gray-800 px-3 py-1.5 rounded-lg font-mono">
                  {CONTRACT_ADDRESS.slice(0, 8)}...{CONTRACT_ADDRESS.slice(-6)}
                </code>
              </div>
            </div>
            {/* Platform and Resources lists with hover:text-purple-300 */}
            <div>
              <h3 className="font-semibold mb-3">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#contract-state" className="hover:text-purple-300">Explore</a></li>
                {/* ... */}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://docs.ton.org" target="_blank" className="hover:text-purple-300">TON Docs</a></li>
                {/* ... */}
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">© 2025 CertificationNFT. All rights reserved.</p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>TON Testnet</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}