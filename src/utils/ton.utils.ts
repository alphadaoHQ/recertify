import { TonClient } from '@ton/core';
import { TokenMetadata } from '../types/nft.types';

let tonClient: TonClient | null = null;

export const getTonClient = (endpoint: string): TonClient => {
    if (!tonClient) {
        tonClient = new TonClient({
            endpoint,
        });
    }
    return tonClient;
};

export const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const parseMetadata = (rawMetadata: any): TokenMetadata => {
    try {
        if (typeof rawMetadata === 'string') {
            return JSON.parse(rawMetadata);
        }
        return rawMetadata;
    } catch (error) {
        console.error('Error parsing metadata:', error);
        return {
            name: 'Unknown',
            description: 'Error parsing metadata',
            image: '',
        };
    }
};
