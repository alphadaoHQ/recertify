import { Award, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useMetadata } from "@/hooks/useMetadata"; // Assuming we extend this for multiples
import { parseTokenId } from "@/lib/format";
import type { NFTMetadata, Token } from "@/types";
import { useContractState } from "@/hooks/useContractState"; // To get total minted

// ... imports ...

export const CertificateShelf = () => {
  const { state: contractState } = useContractState();
  const { fetchToken } = useMetadata();
  const [certificates, setCertificates] = useState<Array<{ token: Token; metadata: NFTMetadata }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCertificates = async () => {
      if (!contractState) return;
      setLoading(true);
      setError(null);
      try {
        const total = Number(contractState.total); // Assuming small collection for demo
        const fetched = [];
        for (let id = 1; id <= Math.min(total, 10); id++) { // Limit to 10 for performance
          const result = await fetchToken(parseTokenId(id.toString()));
          if (result.token && result.metadata) {
            fetched.push(result);
          }
        }
        setCertificates(fetched);
      } catch (err) {
        setError("Failed to load certificates");
      } finally {
        setLoading(false);
      }
    };
    loadCertificates();
  }, [contractState, fetchToken]);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-4 sm:p-6">
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-900 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-4 sm:p-6">
        <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-4 sm:p-6 text-center">
        <p className="text-gray-400">No certificates minted yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-md border border-gray-700 p-4 sm:p-6 overflow-x-auto">
      <div className="flex space-x-4 min-w-max"> {/* Horizontal scroll for mobile carousel */}
        {certificates.map(({ token, metadata }, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden transition-transform hover:scale-105 animate-fade-in w-64 flex-shrink-0"
          >
            <div className="aspect-square relative">
              {metadata.image ? (
                <img
                  src={metadata.image}
                  alt={metadata.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target as HTMLImageElement).src = ''} // Fallback
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <Award className="w-16 h-16 text-purple-400" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1 truncate">{metadata.name}</h3>
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">{metadata.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">ID: {token.id.toString()}</span>
                {index < 3 && <span className="text-xs text-magic-pink bg-magic-pink/20 px-2 py-1 rounded">Trending 🔥</span>}
                {metadata.image && (
                  <a
                    href={metadata.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm"
                  >
                    View <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};