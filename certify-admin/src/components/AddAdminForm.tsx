"use client";

import React, { useState } from "react";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { contractService } from "@/lib/contractService";

export default function AddAdminForm() {
  const tonAddress = useTonAddress();
  const { connect, sendTransaction } = useTonConnectUI();
  const [adminAddress, setAdminAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminAddress) return setMessage("Admin address is required");
    setLoading(true);
    setMessage(null);
    try {
      const tx = contractService.buildAddAdminTransaction(adminAddress);
      await sendTransaction(tx.messages);
      setMessage("Add-admin transaction submitted. Check your wallet for confirmation.");
      setAdminAddress("");
    } catch (err) {
      console.error(err);
      setMessage((err as Error).message || "Failed to send transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddAdmin} className="space-y-4 bg-gray-800 p-6 rounded">
      <div>
        <label className="block text-sm font-medium text-gray-200">Admin Address</label>
        <input
          className="mt-1 block w-full rounded border-gray-700 bg-gray-900 px-3 py-2 text-white"
          value={adminAddress}
          onChange={(e) => setAdminAddress(e.target.value)}
          placeholder="Enter TON address to promote to admin"
        />
      </div>

      <div className="flex gap-3">
        {!tonAddress && (
          <button type="button" onClick={handleConnect} className="btn">
            Connect Wallet
          </button>
        )}

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Sending..." : "Add Admin"}
        </button>
      </div>

      {message && <p className="text-sm text-gray-300">{message}</p>}
    </form>
  );
}
