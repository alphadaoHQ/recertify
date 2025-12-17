import * as path from 'path';
import * as fs from 'fs';
import { Address, toNano, Cell, beginCell, ContractProvider } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';


// Import your Collection wrapper
import { CertificationCollection, Mint } from '../build/NftCollection/NftCollection_CertificationCollection';

// --- CONFIGURATION ---

// 1. Collection Address: PASTE YOUR DEPLOYED COLLECTION ADDRESS HERE
// You must get this from the Testnet Explorer (it starts with EQ/UQ/kQ/iQ)
const COLLECTION_ADDRESS = 'kQCQmegg2KFHWhf4VhNRhUX-lNBW52jmV0hRU749WUvOZA-O'; 

// 2. NFT Index: The ID of the NFT you are minting (0 is the first)
const MINT_INDEX = 0;

// 3. NFT Content/Metadata URI: The URI pointing to the specific JSON metadata file for this NFT
// This must be a URI (e.g., IPFS link) that contains the NFT's name, image, and description.
const NFT_ITEM_URI = 'https://peach-fast-clam-38.mypinata.cloud/ipfs/bafybeiedq3l22745663ebspnmozssslvek4roaw77lhn75eq3wipxqbxze/';


// ---------------------

// --- MAIN MINTING FUNCTION ---

export async function run(provider: NetworkProvider) {

    const sender = provider.sender();
    const senderAddress = sender.address!;

    const mintMessage: Mint = {
        $$type: 'Mint',
        student: senderAddress,
        metadata: NFT_ITEM_URI,

    };
    
    // 1. Load the Deployed Collection Contract
    const collectionAddress = Address.parse(COLLECTION_ADDRESS);
    const collection = provider.open(new CertificationCollection(collectionAddress));

    provider.ui().write('Attempting to mint NFT #${MINT_INDEX} on collection ${collectionAddress.toString()}');
    provider.ui().write('NFT will be sent to owner: ${senderAddress.toString()}');

    // 3. Send the Transaction (The Collection contract executes the mint)
    await collection.send(sender, {value: toNano('0.08'), bounce: true }, mintMessage);
    // Note: We send 0.05 TON to cover the gas for this transaction and the new NFT contract's storage.

    provider.ui().write('✅ Mint transaction sent for NFT #${MINT_INDEX}.');
    provider.ui().write('Check the transaction status on the Testnet Explorer.');
}