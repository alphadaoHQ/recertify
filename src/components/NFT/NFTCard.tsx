import React from 'react';
import { Token } from '../../types/nft.types';
import { formatAddress } from '../../utils/ton.utils';

interface NFTCardProps {
    token: Token;
}

export const NFTCard: React.FC<NFTCardProps> = ({ token }) => {
    return (
        <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img 
                    src={token.metadata.image} 
                    alt={token.metadata.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <h3 className="text-lg font-semibold mb-2">{token.metadata.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{token.metadata.description}</p>
            <p className="text-sm text-gray-500">
                Student: {formatAddress(token.student)}
            </p>
            {token.metadata.attributes && (
                <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Attributes</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {token.metadata.attributes.map((attr, index) => (
                            <div key={index} className="text-xs bg-gray-100 p-2 rounded">
                                <span className="font-medium">{attr.trait_type}:</span>{' '}
                                {attr.value}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
