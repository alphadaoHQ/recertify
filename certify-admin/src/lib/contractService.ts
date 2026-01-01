import { beginCell, Address as TonAddress, toNano } from "@ton/core";
import { TonClient } from "@ton/ton";
import { CertificationNFT } from "@/lib/contract/CertificationNFT";

// Fallback constants; prefer NEXT_PUBLIC_* env vars in production
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const TESTNET_ENDPOINT = process.env.NEXT_PUBLIC_TESTNET_ENDPOINT || "https://testnet.toncenter.com/api/v2/jsonRPC";

const TX_CONFIG = {
  validUntil: 600, // 10 minutes
  mintValue: process.env.NEXT_PUBLIC_MINT_VALUE || "0.05",
  addAdminValue: process.env.NEXT_PUBLIC_ADD_ADMIN_VALUE || "0.05",
} as const;

const OPCODES = {
  MINT: Number(process.env.NEXT_PUBLIC_OPCODE_MINT) || 2415581732,
  ADD_ADMIN: Number(process.env.NEXT_PUBLIC_OPCODE_ADD_ADMIN) || 3599441591,
} as const;

export type ContractState = {
  owner: string;
  total: number;
  nextId: bigint;
  base_uri: string;
};

export type Token = {
  id: bigint;
  student: string;
  metadata: string;
};

export class ContractService {
  private client: TonClient;
  private contractAddress: TonAddress | null;

  constructor() {
    this.client = new TonClient({ endpoint: TESTNET_ENDPOINT });
    this.contractAddress = CONTRACT_ADDRESS ? TonAddress.parse(CONTRACT_ADDRESS) : null;
  }

  // Build a mint transaction for an arbitrary collection address
  buildMintTransactionForCollection(collectionAddress: string, studentAddress: string) {
    const body = beginCell().storeUint(OPCODES.MINT, 32).storeAddress(TonAddress.parse(studentAddress)).storeRef(beginCell().endCell()).endCell();
    return {
      validUntil: Math.floor(Date.now() / 1000) + TX_CONFIG.validUntil,
      messages: [
        {
          address: collectionAddress,
          amount: toNano(TX_CONFIG.mintValue).toString(),
          payload: body.toBoc().toString("base64"),
        },
      ],
    };
  }

  // Build a deploy transaction payload from provided init (code/data base64); returns the message that includes `init`.
  buildDeployTransaction(initCodeBase64: string, initDataBase64: string, deployValue = "0.05") {
    return {
      validUntil: Math.floor(Date.now() / 1000) + TX_CONFIG.validUntil,
      messages: [
        {
          // When deploying, the wallet should create a deploy message which includes `init` fields
          address: "",
          amount: toNano(deployValue).toString(),
          init: {
            code: initCodeBase64,
            data: initDataBase64,
          },
        } as any,
      ],
    };
  }

  private async retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 1000, maxDelay = 30000): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        const isRateLimit = error instanceof Error && (error.message.includes("429") || error.message.includes("rate limit") || error.message.includes("too many requests"));
        if (isRateLimit) {
          const delay = Math.min(baseDelay * 2 ** i, maxDelay);
          console.log(`RATE LIMIT: Retrying in ${delay}ms (attempt ${i + 1}/${maxRetries})`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
    throw new Error("Max retries exceeded");
  }

  getContractAddress() {
    return this.contractAddress?.toString() || null;
  }

  async getState(): Promise<ContractState> {
    if (!this.contractAddress) throw new Error("CONTRACT_ADDRESS not set");
    return this.retryWithBackoff(async () => {
      const contract = this.client.open(CertificationNFT.fromAddress(this.contractAddress));
      const state = await contract.getState();
      return {
        owner: state.owner.toString(),
        total: state.total,
        nextId: state.nextId,
        base_uri: state.base_uri,
      };
    });
  }

  async isAdmin(address: string): Promise<boolean> {
    if (!this.contractAddress) throw new Error("CONTRACT_ADDRESS not set");
    return this.retryWithBackoff(async () => {
      const contract = this.client.open(CertificationNFT.fromAddress(this.contractAddress));
      return contract.getIsAdmin(TonAddress.parse(address));
    });
  }

  async getToken(id: bigint): Promise<Token | null> {
    if (!this.contractAddress) throw new Error("CONTRACT_ADDRESS not set");
    try {
      const contract = this.client.open(CertificationNFT.fromAddress(this.contractAddress));
      const token = await contract.getToken(id);
      if (!token) return null;
      return { id, student: token.student.toString(), metadata: token.metadata.toString() };
    } catch (err) {
      console.error("getToken error", err);
      return null;
    }
  }

  async getTokenUri(id: bigint): Promise<string> {
    if (!this.contractAddress) throw new Error("CONTRACT_ADDRESS not set");
    const contract = this.client.open(CertificationNFT.fromAddress(this.contractAddress));
    return contract.getTokenUri(id);
  }

  async getAllTokens(): Promise<Token[]> {
    const state = await this.getState();
    const tokens: Token[] = [];
    for (let id = 1n; id < state.nextId; id++) {
      const token = await this.getToken(id);
      if (token) tokens.push(token);
    }
    return tokens;
  }

  buildMintTransaction(studentAddress: string) {
    const body = beginCell().storeUint(OPCODES.MINT, 32).storeAddress(TonAddress.parse(studentAddress)).storeRef(beginCell().endCell()).endCell();
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

  buildAddAdminTransaction(adminAddress: string) {
    const body = beginCell().storeUint(OPCODES.ADD_ADMIN, 32).storeAddress(TonAddress.parse(adminAddress)).endCell();
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

export const contractService = new ContractService();
