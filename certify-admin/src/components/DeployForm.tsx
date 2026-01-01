"use client";

import React, { useState } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { contractService } from "@/lib/contractService";

export default function DeployForm() {
  const { connect, sendTransaction } = useTonConnectUI();
  const [codeBoc, setCodeBoc] = useState("");
  const [dataBoc, setDataBoc] = useState("");
  const [value, setValue] = useState("0.05");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const tx = contractService.buildDeployTransaction(codeBoc, dataBoc, value);
      await sendTransaction(tx.messages);
      setMessage("Deploy message created. Wallet will ask to confirm deploy.");
    } catch (err) {
      console.error(err);
      setMessage((err as Error).message || "Failed to create deploy message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleDeploy} className="space-y-4 bg-gray-800 p-6 rounded">
      <div>
        <label className="block text-sm font-medium text-gray-200">Code BOC (base64)</label>
        <textarea value={codeBoc} onChange={(e) => setCodeBoc(e.target.value)} className="mt-1 w-full rounded bg-gray-900 p-2 text-sm" rows={3} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Data BOC (base64)</label>
        <textarea value={dataBoc} onChange={(e) => setDataBoc(e.target.value)} className="mt-1 w-full rounded bg-gray-900 p-2 text-sm" rows={3} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Deploy value (TON)</label>
        <input value={value} onChange={(e) => setValue(e.target.value)} className="mt-1 w-32 rounded bg-gray-900 p-2 text-sm" />
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn btn-primary">{loading ? "Sending..." : "Deploy"}</button>
        <button type="button" onClick={() => navigator.clipboard?.writeText(codeBoc)} className="btn">Copy Code</button>
      </div>

      {message && <p className="text-sm text-gray-300">{message}</p>}
    </form>
  );
}
