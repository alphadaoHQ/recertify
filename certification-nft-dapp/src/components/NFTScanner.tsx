import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import { useState } from "react";
import { type ScannedNFT, useNFTScanner } from "@/hooks/useNFTScanner";
import { IPFSCollectionViewer } from "./IPFSCollectionViewer";

const NFTCard = ({ nft }: { nft: ScannedNFT }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">Token #{nft.id.toString()}</h3>
          <p className="text-sm text-gray-400 font-mono">
            {nft.token.student.slice(0, 8)}...{nft.token.student.slice(-6)}
          </p>
        </div>
        {nft.metadata ? (
          <CheckCircle className="w-5 h-5 text-green-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-400" />
        )}
      </div>

      {nft.metadata ? (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-purple-300">
              {nft.metadata.name}
            </h4>
            <p className="text-sm text-gray-400">{nft.metadata.description}</p>
          </div>

          <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
            {nft.metadata.image && !imageError ? (
              <img
                src={nft.metadata.image}
                alt={nft.metadata.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                <p className="text-xs">Certificate</p>
              </div>
            )}
          </div>

          {nft.metadata.attributes && nft.metadata.attributes.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-300 mb-2">
                Attributes
              </p>
              <div className="grid grid-cols-2 gap-2">
                {nft.metadata.attributes.map((attr, index) => (
                  <div key={index} className="bg-gray-900 p-2 rounded text-xs">
                    <p className="text-gray-500">{attr.trait_type}</p>
                    <p className="font-medium">{attr.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <a
            href={nft.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
          >
            View Metadata <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ) : (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Metadata not available</p>
          {nft.metadataError && (
            <p className="text-xs text-red-300 mt-1">{nft.metadataError}</p>
          )}
          <a
            href={nft.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 mt-2"
          >
            View Raw URI <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
};

export const NFTScanner = () => {
  const { scanAllNFTs, scanning, error, nfts, clearResults } = useNFTScanner();
  const [showResults, setShowResults] = useState(false);
  const [showIPFSCollection, setShowIPFSCollection] = useState(false);

  const handleScan = async () => {
    try {
      await scanAllNFTs();
      setShowResults(true);
      setShowIPFSCollection(true);
    } catch (_err) {
      // Error is handled by the hook
    }
  };

  const handleClear = () => {
    clearResults();
    setShowResults(false);
    setShowIPFSCollection(false);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-900/50 rounded-lg">
          <Search className="w-6 h-6 text-blue-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold">NFT Scanner</h2>
          <p className="text-sm text-gray-400">
            Scan all minted certificates on the blockchain
          </p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={handleScan}
          disabled={scanning}
          className="flex-1 relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-700 disabled:to-gray-600 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/25 disabled:transform-none disabled:shadow-none overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
          <div className="relative flex items-center justify-center gap-2">
            {scanning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="animate-pulse">Scanning Blockchain...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5 group-hover:animate-bounce" />
                <span>Scan All NFTs</span>
              </>
            )}
          </div>
        </button>

        {nfts.length > 0 && (
          <button
            onClick={handleClear}
            className="px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-gray-500/25 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            <span className="relative">Clear</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg mb-6">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {showResults && nfts.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-400">
            Found {nfts.length} NFT{nfts.length !== 1 ? "s" : ""} on the
            blockchain
          </p>
        </div>
      )}

      {showResults && nfts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <NFTCard key={nft.id.toString()} nft={nft} />
          ))}
        </div>
      )}

      {showResults && nfts.length === 0 && !scanning && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No NFTs found on the blockchain</p>
        </div>
      )}

      {showIPFSCollection && (
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-900/50 rounded-lg">
              <FileText className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">IPFS Collection Metadata</h3>
              <p className="text-sm text-gray-400">
                JSON metadata files from the collection
              </p>
            </div>
          </div>
          <IPFSCollectionViewer />
        </div>
      )}
    </div>
  );
};
