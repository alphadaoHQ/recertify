import { Award, Calendar, Search, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useContractState } from "@/hooks/useContractState";
import { useMetadata } from "@/hooks/useMetadata";
import { parseTokenId } from "@/lib/format";
import type { NFTMetadata, Token } from "@/types";

export const CertificateShelf = () => {
  const { state: contractState } = useContractState();
  const { fetchToken } = useMetadata();
  const [certificates, setCertificates] = useState<
    Array<{ token: Token; metadata: NFTMetadata; tokenId: bigint }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "id" | "name">("date");
  const [_showFilters, _setShowFilters] = useState(false);

  useEffect(() => {
    const loadCertificates = async () => {
      if (!contractState) return;
      setLoading(true);
      setError(null);
      try {
        const total = Number(contractState.total);
        const fetched = [];
        // Load more certificates for gallery view
        for (let id = 1; id <= Math.min(total, 50); id++) {
          try {
            const tokenId = parseTokenId(id.toString());
            const result = await fetchToken(tokenId);
            if (result.token && result.metadata) {
              fetched.push({ ...result, tokenId });
            }
          } catch (tokenErr) {
            console.warn(`Failed to fetch token ${id}:`, tokenErr);
          }
        }
        setCertificates(fetched);
      } catch (err) {
        setError("Failed to load certificates");
        console.error("Certificate loading error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCertificates();
  }, [contractState, fetchToken]);

  // Filter and sort certificates
  const filteredCertificates = useMemo(() => {
    const filtered = certificates.filter((cert) => {
      const matchesSearch =
        cert.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.tokenId.toString().includes(searchTerm) ||
        cert.token.student.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        cert.metadata.attributes?.some(
          (attr) =>
            attr.trait_type === "Category" && attr.value === selectedCategory,
        );

      return matchesSearch && matchesCategory;
    });

    // Sort certificates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return Number(b.tokenId) - Number(a.tokenId); // Newest first
        case "id":
          return Number(a.tokenId) - Number(b.tokenId);
        case "name":
          return a.metadata.name.localeCompare(b.metadata.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [certificates, searchTerm, selectedCategory, sortBy]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    certificates.forEach((cert) => {
      cert.metadata.attributes?.forEach((attr) => {
        if (attr.trait_type === "Category") {
          cats.add(attr.value);
        }
      });
    });
    return Array.from(cats);
  }, [certificates]);

  // Certificate Card Component
  const CertificateCard = ({
    metadata,
    tokenId,
    token,
  }: {
    metadata: NFTMetadata;
    tokenId: bigint;
    token: Token;
  }) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
      <>
        <div
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
          onClick={() => setShowDetails(true)}
        >
          <div className="aspect-square relative">
            {metadata.image ? (
              <Image
                src={metadata.image}
                alt={metadata.name}
                width={256}
                height={256}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <Award className="w-16 h-16 text-purple-400" />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1 truncate text-white">
              {metadata.name}
            </h3>
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
              {metadata.description}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  ID: {tokenId.toString()}
                </span>
                <span className="text-xs text-gray-500">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {token.student.slice(0, 6)}...{token.student.slice(-4)}
                </span>
                <button className="text-xs text-purple-400 hover:text-purple-300 font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">
                    {metadata.name}
                  </h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {metadata.image && (
                  <div className="aspect-square rounded-xl overflow-hidden mb-4">
                    <Image
                      src={metadata.image}
                      alt={metadata.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-1">
                      Description
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {metadata.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">
                      Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Certificate ID:</span>
                        <p className="text-white font-mono">
                          {tokenId.toString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Owner:</span>
                        <p className="text-white font-mono text-xs">
                          {token.student}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Issue Date:</span>
                        <p className="text-white">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Blockchain:</span>
                        <p className="text-white">TON Testnet</p>
                      </div>
                    </div>
                  </div>

                  {metadata.attributes && metadata.attributes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">
                        Attributes
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {metadata.attributes.map((attr, index) => (
                          <div
                            key={index}
                            className="bg-gray-700 rounded-lg p-3"
                          >
                            <p className="text-xs text-gray-500">
                              {attr.trait_type}
                            </p>
                            <p className="text-white font-medium">
                              {attr.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    {metadata.image && (
                      <a
                        href={metadata.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                      >
                        View Image
                      </a>
                    )}
                    <a
                      href={`https://testnet.tonviewer.com/${token.student}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      View on Explorer
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={`loading-${i}`}
              className="h-80 bg-gray-800 rounded-xl"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/50 border border-red-700 rounded-xl">
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by certificate ID, name, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "date" | "id" | "name")
            }
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="date">Sort by Date</option>
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-gray-400 text-sm">
        Showing {filteredCertificates.length} of {certificates.length}{" "}
        certificates
      </div>

      {/* Certificate Grid */}
      {filteredCertificates.length === 0 ? (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            No certificates found matching your criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCertificates.map(({ metadata, tokenId, token }) => (
            <CertificateCard
              key={tokenId.toString()}
              metadata={metadata}
              tokenId={tokenId}
              token={token}
            />
          ))}
        </div>
      )}
    </div>
  );
};
