import { Address } from '@ton/core';

export interface NFTState {
    owner: string;
    total: bigint;
    nextId: bigint;
    base_uri: string;
}

export interface TokenMetadata {
    name: string;
    description: string;
    image: string;
    attributes?: Array<{    
        trait_type: string;
        value: string;
    }>;    
}

export interface Token {
    id: number;
    student: string;
    metadata: TokenMetadata;
}

export interface NFTServiceConfig {
    endpoint: string;
    contractAddress: string;
}