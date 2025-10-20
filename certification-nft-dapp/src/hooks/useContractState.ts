import { useTonAddress } from "@tonconnect/ui-react";
import { useCallback, useEffect, useState } from "react";
import { contractService } from "@/lib/contract/contractService";
import { addressesEqual } from "@/lib/utils/address";
import { ADMIN_WALLET_ADDRESS } from "@/lib/constants";
import type { ContractState } from "@/types";

export const useContractState = () => {
  const userAddress = useTonAddress();
  const [state, setState] = useState<ContractState | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchState = useCallback(async () => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] fetchState called - userAddress:`, userAddress);
    
    setLoading(true);
    setError(null);

    try {
      console.log(`[${timestamp}] Making getState API call...`);
      const contractState = await contractService.getState();
      console.log(`[${timestamp}] getState successful`);
      setState(contractState);

      if (userAddress) {
        const owner = addressesEqual(userAddress, contractState.owner);
        setIsOwner(owner);

        console.log(`[${timestamp}] Making isAdmin API call...`);
        const admin = await contractService.isAdmin(userAddress);
        console.log(`[${timestamp}] isAdmin successful`);
        
        // Check if user is the hardcoded admin wallet
        const isHardcodedAdmin = addressesEqual(
          userAddress,
          ADMIN_WALLET_ADDRESS,
        );
        setIsAdmin(admin || owner || isHardcodedAdmin);
      } else {
        setIsOwner(false);
        setIsAdmin(false);
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch contract state";
      setError(errorMsg);
      console.error(`[${timestamp}] Contract state error:`, err);
      
      // Log specific 429 error details
      if (err instanceof Error && err.message.includes('429')) {
        console.error(`[${timestamp}] RATE LIMIT HIT - Too many requests to TON API`);
      }
    } finally {
      setLoading(false);
      console.log(`[${timestamp}] fetchState completed`);
    }
  }, [userAddress]);

  useEffect(() => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] useEffect triggered - fetchState dependency changed`);
    fetchState();
  }, [fetchState]);

  return {
    state,
    isOwner,
    isAdmin,
    loading,
    error,
    refetch: fetchState,
  };
};
