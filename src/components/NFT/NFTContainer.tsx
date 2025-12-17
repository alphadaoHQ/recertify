import React, { useEffect, useState } from 'react';
import { NFTState, Token } from '../../types/nft.types';
import { nftService } from '../../services/nft.service';
import { NFTCard } from './NFTCard';

export const NFTContainer: React.FC = () => {
    const [state, setState] = useState<NFTState | null>(null);
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadNFTData = async () => {
            try {
                const nftState = await nftService.getState();
                setState(nftState);

                // Load first 10 tokens as example
                const loadedTokens = [];
                for (let i = 0; i < Math.min(10, Number(nftState.total)); i++) {
                    const token = await nftService.getToken(i);
                    if (token) loadedTokens.push(token);
                }
                setTokens(loadedTokens);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        loadNFTData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {state && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">NFT Collection</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <p className="text-sm">Total Supply: {state.total.toString()}</p>
                            <p className="text-sm">Next ID: {state.nextId.toString()}</p>
                            <p className="text-sm">Base URI: {state.base_uri}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tokens.map((token) => (
                    <NFTCard key={token.id} token={token} />
                ))}
            </div>
        </div>
    );
};