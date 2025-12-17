import { Address, TonClient } from '@ton/core';
import { CertificationNFT } from '../contracts/certificationNFT.tact_CertificationNFT';
import { NFTServiceConfig, NFTState, Token, TokenMetadata } from '../types/nft.types';
import { getTonClient, parseMetadata } from '../utils/ton.utils';

export class NFTService {
    private client: TonClient;
    private contract: CertificationNFT;

    constructor(config: NFTServiceConfig) {
        this.client = getTonClient(config.endpoint);
        this.contract = CertificationNFT.fromAddress(Address.parse(config.contractAddress));
    }

    async getState(): Promise<NFTState> {
        try {
            const state = await this.contract.getState(this.client);
            return {
                owner: state.owner.toString(),
                total: state.total,
                nextId: state.nextId,
                base_uri: state.base_uri
            };
        } catch (error) {
            console.error('Error getting NFT state:', error);
            throw new Error('Failed to fetch NFT state');
        }
    }

    async getToken(id: number): Promise<Token | null> {
        try {
            const token = await this.contract.getToken(this.client, BigInt(id));
            if (!token) return null;

            const uri = await this.contract.getTokenUri(this.client, BigInt(id));
            const metadata = await this.fetchMetadata(uri);

            return {
                id,
                student: token.student.toString(),
                metadata
            };
        } catch (error) {
            console.error(`Error getting token ${id}:`, error);
            throw new Error(`Failed to fetch token ${id}`);
        }
    }

    async getStudentTokens(studentAddress: string): Promise<Token[]> {
        try {
            const state = await this.getState();
            const tokens: Token[] = [];
            const address = Address.parse(studentAddress);

            for (let i = 0; i < Number(state.total); i++) {
                const token = await this.getToken(i);
                if (token && token.student === address.toString()) {
                    tokens.push(token);
                }
            }

            return tokens;
        } catch (error) {
            console.error('Error getting student tokens:', error);
            throw new Error('Failed to fetch student tokens');
        }
    }

    private async fetchMetadata(uri: string): Promise<TokenMetadata> {
        try {
            const response = await fetch(uri);
            const data = await response.json();
            return parseMetadata(data);
        } catch (error) {
            console.error('Error fetching metadata:', error);
            throw new Error('Failed to fetch token metadata');
        }
    }
}

export const nftService = new NFTService({
    endpoint: process.env.NEXT_PUBLIC_TON_ENDPOINT || 'https://toncenter.com/api/v2/jsonRPC',
    contractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || ''
});