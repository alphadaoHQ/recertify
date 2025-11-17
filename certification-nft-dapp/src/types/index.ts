export interface ContractState {
  owner: string;
  total: bigint;
  nextId: bigint;
  base_uri: string;
  tokens?: Token[];
}

export interface Token {
  id: bigint;
  student: string;
  metadata: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
  tokenId?: bigint;
}
