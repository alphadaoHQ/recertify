"use client";

import React, { useEffect, useState } from "react";
import { contractService } from "@/lib/contractService";

export default function ContractState() {
  const [state, setState] = useState<any>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const s = await contractService.getState();
      setState(s);
      const all = await contractService.getAllTokens();
      setTokens(all);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Failed to fetch state");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Contract State</h3>
        <button onClick={refresh} className="btn">
          Refresh
        </button>
      </div>

      {loading && <p className="text-sm text-gray-300">Loading...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {state && (
        <div className="space-y-2">
          <p>
            <strong>Owner:</strong> {state.owner}
          </p>
          <p>
            <strong>Total minted:</strong> {state.total}
          </p>
          <p>
            <strong>Next ID:</strong> {state.nextId?.toString?.()}
          </p>
          <p>
            <strong>Base URI:</strong> {state.base_uri}
          </p>
        </div>
      )}

      <div className="mt-6">
        <h4 className="text-md font-semibold">Tokens</h4>
        {tokens.length === 0 && <p className="text-sm text-gray-300">No tokens found</p>}
        <ul className="space-y-2 mt-2">
          {tokens.map((t) => (
            <li key={t.id.toString()} className="border p-2 rounded border-gray-700">
              <div>
                <strong>#{t.id.toString()}</strong>
              </div>
              <div>
                <span className="text-sm">Owner: {t.student}</span>
              </div>
              <div>
                <span className="text-sm">Metadata: {t.metadata}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
