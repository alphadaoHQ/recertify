import { useTonAddress } from "@tonconnect/ui-react";
import { useCallback, useEffect, useState } from "react";
import { contractService } from "@/lib/contract/contractService";
import { addressesEqual } from "@/lib/utils/address";
import type { ContractState } from "@/types";

export const useContractState = () => {
  const userAddress = useTonAddress();
  const [state, setState] = useState<ContractState | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchState = useCallback(async () => {
    console.log("[useContractState] fetchState called");
    setLoading(true);
    setError(null);

    try {
      console.log("[useContractState] Calling contractService.getState()");
      const contractState = await contractService.getState();
      console.log("[useContractState] contractState received:", contractState);
      setState(contractState);

      if (userAddress) {
        const owner = addressesEqual(userAddress, contractState.owner);
        setIsOwner(owner);

        const admin = await contractService.isAdmin(userAddress);
        setIsAdmin(admin || owner);
      } else {
        setIsOwner(false);
        setIsAdmin(false);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch contract state");
    } finally {
      setLoading(false);
    }
  }, [userAddress]);

  useEffect(() => {
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
