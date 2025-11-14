import { RefreshCw } from "lucide-react";
import { useContractState } from "@/hooks/useContractState";
import { MAX_SUPPLY } from "@/lib/constants";
import { formatSupply, formatTokenId } from "@/lib/format";
import { formatAddress } from "@/lib/utils/address";

export const ContractState = () => {
  const { state, loading, error, refetch } = useContractState();

  console.log("[ContractState] Component render:", { state, loading, error });

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 font-medium">Error loading contract state</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!state && loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-100 rounded"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!state) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Contract State</h2>
          <button
            type="button"
            onClick={refetch}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Refresh"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium mb-1">
              Total Supply
            </p>
            <p className="text-2xl font-bold text-blue-900">
              {formatSupply(state.total, MAX_SUPPLY)}
            </p>
            <div className="mt-2 bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(Number(state.total) / Number(MAX_SUPPLY)) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700 font-medium mb-1">
              Next Token ID
            </p>
            <p className="text-2xl font-bold text-purple-900">
              {formatTokenId(state.nextId)}
            </p>
          </div>

          <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 font-medium mb-2">Base URI</p>
            <p className="text-sm text-gray-900 font-mono break-all">
              {state.base_uri}
            </p>
          </div>

          <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700 font-medium mb-2">Owner</p>
            <p
              className="text-sm text-gray-900 font-mono break-all"
              title={state.owner}
            >
              {formatAddress(state.owner, false)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
