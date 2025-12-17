import { Award, ExternalLink, Loader2, Search } from "lucide-react";
import Image from "next/image";
import { type FormEvent, useState } from "react";
import { useMetadata } from "@/hooks/useMetadata";
import { parseTokenId } from "@/lib/format";
import type { NFTMetadata, Token } from "@/types";

export const TokenViewer = () => {
  const [tokenId, setTokenId] = useState("");
  const [token, setToken] = useState<Token | null>(null);
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const { fetchToken, loading, error } = useMetadata();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!tokenId || Number.isNaN(Number(tokenId))) return;
    try {
      const result = await fetchToken(parseTokenId(tokenId));
      setToken(result.token);
      setMetadata(result.metadata);
    } catch {
      setToken(null);
      setMetadata(null);
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-4 sm:p-6">
      <h2 className="text-xl font-bold mb-4 text-white">View Certificate</h2>
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="number"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          placeholder="Search by Token ID..."
          className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-500"
          disabled={loading}
          min="0"
        />
        <button
          type="submit"
          disabled={loading || !tokenId}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </button>
      </form>
      {error && (
        <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg mb-6">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
      {token && metadata && (
        <div className="border-t border-gray-700 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">{metadata.name}</h3>
                <p className="text-gray-400">{metadata.description}</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-sm font-medium text-gray-300 mb-2">
                  Student Address
                </p>
                <p className="text-xs font-mono break-all text-white">
                  {token.student}
                </p>
              </div>
              {metadata.attributes.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-3">
                    Attributes
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {metadata.attributes.map((attr) => (
                      <div
                        key={`${attr.trait_type}-${attr.value}`}
                        className="bg-gray-900 p-3 rounded-lg border border-gray-700"
                      >
                        <p className="text-xs text-gray-500 mb-1">
                          {attr.trait_type}
                        </p>
                        <p className="text-sm font-medium">{attr.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center overflow-hidden shadow-lg">
                {metadata.image ? (
                  <Image
                    src={metadata.image}
                    alt={metadata.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <Award className="w-24 h-24 text-gray-500" />
                )}
              </div>
              {metadata.image && (
                <a
                  href={metadata.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 text-sm text-purple-400 hover:text-purple-300"
                >
                  View Full Image <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
