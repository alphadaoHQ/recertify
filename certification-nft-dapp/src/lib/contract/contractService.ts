import { beginCell, Address as TonAddress, toNano } from "@ton/core";
import { TonClient } from "@ton/ton";
import type { ContractState, Token } from "@/types";
import {
  CONTRACT_ADDRESS,
  OPCODES,
  TESTNET_ENDPOINT,
  TX_CONFIG,
} from "../constants";
import { CertificationNFT } from "./CertificationNFT";

export class ContractService {
  private client: TonClient;
  private contractAddress: TonAddress;
  private static callCount = 0;
  private static lastCallTime = 0;

  constructor() {
    this.client = new TonClient({
      endpoint: TESTNET_ENDPOINT,
    });
    this.contractAddress = TonAddress.parse(CONTRACT_ADDRESS);
  }

  private logApiCall(method: string) {
    ContractService.callCount++;
    const now = Date.now();
    const timeSinceLastCall = now - ContractService.lastCallTime;
    ContractService.lastCallTime = now;
    
    console.log(`[API CALL #${ContractService.callCount}] ${method} - Time since last call: ${timeSinceLastCall}ms`);
    
    if (timeSinceLastCall < 1000) {
      console.warn(`[WARNING] Rapid API calls detected! Only ${timeSinceLastCall}ms between calls`);
    }
  }

  /**
   * Fetch current contract state
   */
  async getState(): Promise<ContractState> {
    const timestamp = new Date().toISOString();
    this.logApiCall('getState');
    console.log(`[${timestamp}] ContractService.getState() - Making API call to ${TESTNET_ENDPOINT}`);
    
    try {
      const contract = this.client.open(
        CertificationNFT.fromAddress(this.contractAddress),
      );

      const state = await contract.getState();
      console.log(`[${timestamp}] ContractService.getState() - API call successful`);

      return {
        owner: state.owner.toString(),
        total: state.total,
        nextId: state.nextId,
        base_uri: state.base_uri,
      };
    } catch (error) {
      console.error(`[${timestamp}] ContractService.getState() - API call failed:`, error);
      
      // Log specific rate limit errors
      if (error instanceof Error && error.message.includes('429')) {
        console.error(`[${timestamp}] RATE LIMIT DETECTED in getState() - TON API returned 429`);
      }
      
      throw new Error("Failed to fetch contract state");
    }
  }

  /**
   * Check if an address is an admin
   */
  async isAdmin(address: string): Promise<boolean> {
    const timestamp = new Date().toISOString();
    this.logApiCall('isAdmin');
    console.log(`[${timestamp}] ContractService.isAdmin() - Making API call to ${TESTNET_ENDPOINT}`);
    
    try {
      const contract = this.client.open(
        CertificationNFT.fromAddress(this.contractAddress),
      );

      const result = await contract.getIsAdmin(TonAddress.parse(address));
      console.log(`[${timestamp}] ContractService.isAdmin() - API call successful`);
      return result;
    } catch (error) {
      console.error(`[${timestamp}] ContractService.isAdmin() - API call failed:`, error);
      
      // Log specific rate limit errors
      if (error instanceof Error && error.message.includes('429')) {
        console.error(`[${timestamp}] RATE LIMIT DETECTED in isAdmin() - TON API returned 429`);
      }
      
      return false;
    }
  }

  /**
   * Get token data by ID
   */
  async getToken(id: bigint): Promise<Token | null> {
    try {
      const contract = this.client.open(
        CertificationNFT.fromAddress(this.contractAddress),
      );

      const token = await contract.getToken(id);

      if (!token) return null;

      return {
        student: token.student.toString(),
        metadata: token.metadata.toString(),
      };
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  }

  /**
   * Get token URI by ID
   */
  async getTokenUri(id: bigint): Promise<string> {
    try {
      const contract = this.client.open(
        CertificationNFT.fromAddress(this.contractAddress),
      );

      return await contract.getTokenUri(id);
    } catch (error) {
      console.error("Error fetching token URI:", error);
      throw new Error("Failed to fetch token URI");
    }
  }

  /**
   * Build mint transaction payload
   */
  buildMintTransaction(studentAddress: string) {
    const body = beginCell()
      .storeUint(OPCODES.MINT, 32)
      .storeAddress(TonAddress.parse(studentAddress))
      .storeRef(beginCell().endCell()) // Empty metadata cell (off-chain)
      .endCell();

    return {
      validUntil: Math.floor(Date.now() / 1000) + TX_CONFIG.validUntil,
      messages: [
        {
          address: CONTRACT_ADDRESS,
          amount: toNano(TX_CONFIG.mintValue).toString(),
          payload: body.toBoc().toString("base64"),
        },
      ],
    };
  }

  /**
   * Build add admin transaction payload
   */
  buildAddAdminTransaction(adminAddress: string) {
    const body = beginCell()
      .storeUint(OPCODES.ADD_ADMIN, 32)
      .storeAddress(TonAddress.parse(adminAddress))
      .endCell();

    return {
      validUntil: Math.floor(Date.now() / 1000) + TX_CONFIG.validUntil,
      messages: [
        {
          address: CONTRACT_ADDRESS,
          amount: toNano(TX_CONFIG.addAdminValue).toString(),
          payload: body.toBoc().toString("base64"),
        },
      ],
    };
  }
}

// Singleton instance
export const contractService = new ContractService();
