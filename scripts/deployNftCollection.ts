import { Address, toNano, Cell } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { CertificationCollection } from '../build/NftCollection/NftCollection_CertificationCollection'; 
import * as fs from 'fs';
import * as path from 'path';
import { ItemInit } from '../build/NftCollection/NftCollection_CertificationItem'; 
import { Contract } from '@tact-lang/compiler';


const BASE_URI = "https://peach-fast-clam-38.mypinata.cloud/ipfs/bafybeiedq3l22745663ebspnmozssslvek4roaw77lhn75eq3wipxqbxze/"; 

export async function run(provider: NetworkProvider) {
    
    
    const ownerAddress = Address.parse(
        await provider.ui().input("Enter the owner address for the Collection Contract")
        || provider.sender().address!.toString()
    );

  
const itemPath = path.resolve(__dirname, '..', 'build', 'CertificationItem', 'CertificationItem_CertificationItem.code.boc');
const collectionPath = path.resolve(__dirname, '..', 'build', 'NftCollection', 'NftCollection_CertificationCollection.code.boc');

   
const itemCodeBuffer = fs.readFileSync(itemPath);
const itemCode: Cell = Cell.fromBoc(itemCodeBuffer)[0];
provider.ui().write('CertificationItem code loaded successfully from BOC.');


const collectionCodeBuffer = fs.readFileSync(collectionPath);
const collectionCode: Cell = Cell.fromBoc(collectionCodeBuffer)[0];
provider.ui().write('CertificationCollection code loaded successfully from BOC.');
    
    const contract = await CertificationCollection.fromInit(

         ownerAddress,
         BASE_URI,
         itemCode,
) as any;

const contractAddress = (contract as any).address as Address;
    provider.ui().write('\nCollection Contract will be deployed at: ${contractAddress.toString()}');

  
    await provider.deploy(contract as any, toNano("0.05"));

    provider.ui().write('✅ Deployed CertificationCollection at ${contractAddress.toString()}');
}