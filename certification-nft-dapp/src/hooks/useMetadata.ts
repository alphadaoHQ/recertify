import { useCallback, useState } from "react";
import { contractService } from "@/lib/contract/contractService";
import type { NFTMetadata } from "@/types";

export const useMetadata = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = useCallback(async (tokenId: bigint) => {
    setLoading(true);
    setError(null);

    try {
      const token = await contractService.getToken(tokenId);

      if (!token) {
        throw new Error("Token not found");
      }

      const uri = await contractService.getTokenUri(tokenId);

      // Fetch metadata from URI
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error("Failed to fetch metadata");
      }

      const metadata: NFTMetadata = await response.json();

      return { token, metadata };
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch token";
      setError(errorMsg);
      console.error("Metadata fetch error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchToken,
    loading,
    error,
  };
};
