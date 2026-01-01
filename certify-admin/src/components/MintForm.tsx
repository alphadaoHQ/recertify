"use client";

import React, { useState } from "react";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { contractService } from "@/lib/contractService";

export default function MintForm() {
  const tonAddress = useTonAddress();
  const { connect, sendTransaction } = useTonConnectUI();
  const [recipient, setRecipient] = useState(tonAddress || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient) return setMessage("Recipient address is required");
    setLoading(true);
    setMessage(null);

    try {
      if (!contractService.getContractAddress()) throw new Error("CONTRACT_ADDRESS not configured. Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local");
      const tx = contractService.buildMintTransaction(recipient);
      // sendTransaction is a helper provided by TonConnect UI to ask the wallet
      // to sign/send the messages created above.
      await sendTransaction(tx.messages);
      setMessage("Mint transaction submitted. Check your wallet for confirmation.");
    } catch (err) {
      console.error(err);
      setMessage((err as Error).message || "Failed to send transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleMint} className="space-y-4 bg-gray-800 p-6 rounded">
      <div>
        <label className="block text-sm font-medium text-gray-200">Recipient</label>
        <input
          className="mt-1 block w-full rounded border-gray-700 bg-gray-900 px-3 py-2 text-white"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter TON address to mint to"
        />
      </div>

      <div className="flex gap-3">
        {!tonAddress && (
          <button type="button" onClick={handleConnect} className="btn">
            Connect Wallet
          </button>
        )}

        <button type="submit" disabled={loading || !contractService.getContractAddress()} className="btn btn-primary">
          {loading ? "Sending..." : "Mint NFT"}
        </button>
      </div>

      {!contractService.getContractAddress() && (
        <p className="text-sm text-yellow-300">CONTRACT_ADDRESS is not configured. Set `NEXT_PUBLIC_CONTRACT_ADDRESS` in certify-admin/.env.local</p>
      )}

      {message && <p className="text-sm text-gray-300">{message}</p>}
    </form>
  );
}
