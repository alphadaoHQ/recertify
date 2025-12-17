import * as path from 'path';
import * as fs from 'fs';
import { Address, toNano, Cell, beginCell, ContractProvider } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';



import { CertificationCollection, Mint } from '../build/NftCollection/NftCollection_CertificationCollection';


const COLLECTION_ADDRESS = 'kQCQmegg2KFHWhf4VhNRhUX-lNBW52jmV0hRU749WUvOZA-O'; 


const MINT_INDEX = 0;


const NFT_ITEM_URI = 'https://peach-fast-clam-38.mypinata.cloud/ipfs/bafybeiedq3l22745663ebspnmozssslvek4roaw77lhn75eq3wipxqbxze/';




export async function run(provider: NetworkProvider) {

    const sender = provider.sender();
    const senderAddress = sender.address!;

    const mintMessage: Mint = {
        $$type: 'Mint',
        student: senderAddress,
        metadata: NFT_ITEM_URI,

    };
    
   
    const collectionAddress = Address.parse(COLLECTION_ADDRESS);
    const collection = provider.open(new CertificationCollection(collectionAddress));

    provider.ui().write('Attempting to mint NFT #${MINT_INDEX} on collection ${collectionAddress.toString()}');
    provider.ui().write('NFT will be sent to owner: ${senderAddress.toString()}');

    
    await collection.send(sender, {value: toNano('0.08'), bounce: true }, mintMessage);
   
    provider.ui().write('✅ Mint transaction sent for NFT #${MINT_INDEX}.');
    provider.ui().write('Check the transaction status on the Testnet Explorer.');
}s