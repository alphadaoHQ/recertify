import { useCallback, useState } from "react";
import { contractService } from "@/lib/contract/contractService";
import type { NFTMetadata, Token } from "@/types";

export interface ScannedNFT {
  id: bigint;
  token: Token;
  uri: string;
  metadata: NFTMetadata | null;
  metadataError?: string;
}

export const useNFTScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nfts, setNfts] = useState<ScannedNFT[]>([]);

  const scanAllNFTs = useCallback(async (): Promise<ScannedNFT[]> => {
    setScanning(true);
    setError(null);

    try {
      console.log("Starting NFT scan...");

      // Get contract state
      const state = await contractService.getState();
      console.log(`Found ${state.total} total NFTs, next ID: ${state.nextId}`);

      const scannedNFTs: ScannedNFT[] = [];

      // Scan all minted NFTs (IDs from 0 to total-1)
      for (let tokenId = 0n; tokenId < state.total; tokenId++) {
        try {
          console.log(`Scanning token ${tokenId}...`);

          const token = await contractService.getToken(tokenId);
          if (!token) {
            console.warn(`Token ${tokenId} not found, skipping`);
            continue;
          }

          // Get token URI
          const uri = await contractService.getTokenUri(tokenId);
          console.log(`Token ${tokenId} URI: ${uri}`);

          // Fetch metadata
          let metadata: NFTMetadata | null = null;
          let metadataError: string | undefined;

          try {
            const response = await fetch(uri);
            if (response.ok) {
              metadata = await response.json();
              console.log(
                `Token ${tokenId} metadata loaded:`,
                metadata?.name ?? metadata,
              );
            } else {
              metadataError = `HTTP ${response.status}: ${response.statusText}`;
              console.warn(
                `Failed to fetch metadata for token ${tokenId}:`,
                metadataError,
              );
            }
          } catch (fetchError) {
            metadataError =
              fetchError instanceof Error
                ? fetchError.message
                : "Unknown fetch error";
            console.warn(
              `Error fetching metadata for token ${tokenId}:`,
              metadataError,
            );
          }

          scannedNFTs.push({
            id: tokenId,
            token,
            uri,
            metadata,
            metadataError,
          });

          // Small delay to avoid overwhelming the API
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (tokenError) {
          console.error(`Error scanning token ${tokenId}:`, tokenError);
          // Continue scanning other tokens even if one fails
        }
      }

      console.log(`NFT scan complete. Found ${scannedNFTs.length} NFTs`);
      setNfts(scannedNFTs);
      return scannedNFTs;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to scan NFTs";
      console.error("NFT scan failed:", err);
      setError(errorMsg);
      throw err;
    } finally {
      setScanning(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setNfts([]);
    setError(null);
  }, []);

  return {
    scanAllNFTs,
    scanning,
    error,
    nfts,
    clearResults,
  };
};
