import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, Address, Cell, Transaction, TransactionDescription, Slice, beginCell } from '@ton/core';
import '@ton/test-utils';
import { CertificationCollection, ItemInit, CollectionData } from '../build/NftCollection/NftCollection_CertificationCollection';
import { CertificationItem } from '../build/NftCollection/NftCollection_CertificationItem';
import { log } from 'console';



// --- Define Test Variables ---
const COLLECTION_BASE_URI = 'ipfs://collection-metadata-uri/';
const MINT_FEE = toNano('0.05');

    let itemCode: Cell;



describe('CertificationCollection (Soulbound NFT)', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let collection: SandboxContract<CertificationCollection>;
    
    // Test addresses
    let admin: SandboxContract<TreasuryContract>;
    let studentA: SandboxContract<TreasuryContract>;
    let studentB: SandboxContract<TreasuryContract>;
    let rando: SandboxContract<TreasuryContract>;

    

    // --- SETUP: Deploy the Collection Contract ---
    beforeEach(async () => {

        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        admin = await blockchain.treasury('admin'); // Initial owner/admin
        studentA = await blockchain.treasury('studentA');
        studentB = await blockchain.treasury('studentB');
        rando = await blockchain.treasury('rando');

        const PLACEHOLDER_ADDRESS = Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');
        const collectionInt = await CertificationCollection.fromInit(admin.address, COLLECTION_BASE_URI, new Cell());

        const calculatedCollectionAddress = collectionInt.address;


        const itemInit: ItemInit = {
            $$type: 'ItemInit',
            index: 0n,
            issue_date: 0n,
            student: PLACEHOLDER_ADDRESS
        }

        

        const itemCode = (await CertificationItem.init(admin.address, calculatedCollectionAddress, itemInit)).code
        const finalCollectionInt = await CertificationCollection.fromInit(admin.address, COLLECTION_BASE_URI, itemCode);
        collection = blockchain.openContract(finalCollectionInt);
        
        

        const deployResult = await collection.send(
            deployer.getSender(),
            { value: toNano('0.5') }, // Initial funding
            { $$type: 'Deploy', queryId: 0n }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: collection.address,
            success: true,
        });
    });
    
    
    // ----------------------------------------------------------------------
    // I. CORE FUNCTIONALITY & GETTERS
    // ----------------------------------------------------------------------
    
    it('should deploy successfully and check initial state', async () => {

        
        // Test 3: Getter Check (Pre-Mint)
        const collectionData = await collection.getGetCollectionData();
        
        expect(collectionData.next_item_index).toEqual(0n);
        expect(collectionData.owner.toString()).toEqual(admin.address.toString());
        // Verify base URI is packaged correctly (content cell check)
        // Note: Full verification of TEP-64 cell structure might need a custom parser.
        expect(collectionData.content instanceof Cell).toBe(true); 
    });

    // ----------------------------------------------------------------------
    // II. MINTING FLOW
  // NftCollection.spec.ts
 
it('should allow admin to mint a single NFT', async () => {
    // Note: We use studentA's address as the recipient, not the 'owner' treasury.
    const studentAddress = studentA.address; 
    
    // 1. Get the current index (This is 0n right after deployment)
    // 🟢 FIX: Use 'collection' instead of 'Contract'
    const initialIndex = (await collection.getGetCollectionData()).next_item_index;

    // 2. Send Mint message
    // 🟢 FIX: Use 'collection' and 'admin' instead of 'contract' and 'owner'
    const mintResult = await collection.send(
        admin.getSender(), 
        { value: MINT_FEE + toNano('0.05') }, // Ensure enough value is sent
        { $$type: 'Mint', student: studentAddress, metadata: 'cert-1-metadata' } 
    );
    
    // In @ton/sandbox, system.run() is implied by contract.send(), no need for an explicit run.
    
    // --- 🟢 FINAL FIX: Get the address directly from the Collection contract ---
    
    // We expect the NFT to have been minted at the initialIndex (which is 0n)
    // 🟢 FIX: Use 'collection' instead of 'contract'
    const deployedNftAddress = await collection.getGetNftAddressByIndex(initialIndex);
    
    // 3. Assertions (Contract-level and State-level)
    expect(deployedNftAddress).not.toBeNull();
    
    // Check counter: next_item_index should have incremented to 1n.
    // 🟢 FIX: Use 'collection' instead of 'contract'
    const collectionData = await collection.getGetCollectionData();
    const expectedNextIndex = initialIndex + 1n;
    expect(collectionData.next_item_index).toEqual(expectedNextIndex);

    // Check the transaction logs
    // The NFT is deployed by the collection
    expect(mintResult.transactions).toHaveTransaction({
        from: collection.address,
        to: deployedNftAddress!, // Deployment transaction destination
        deploy: true,
        success: true,
    });

    // 4. Verify the NFT Item's internal state
    if (deployedNftAddress) {
        // Open the deployed NFT contract instance using the retrieved address
        // 🟢 FIX: Use 'blockchain' instead of 'system'
        const nftItem = blockchain.openContract(CertificationItem.fromAddress(deployedNftAddress));
        
        // Check the owner is the 'studentA'
        const nftData = await nftItem.getGetNftData();
        expect(nftData.owner).toEqualAddress(studentAddress);
        expect(nftData.index).toEqual(initialIndex);
    }
});


it('should successfully add a new address to the admins map', async () => {
    // --- 1. SETUP ---
    // The current Super Admin (Deployer)
    const superAdmin = admin; 
    
    // The new address we want to grant admin privileges to
    const newAdmin = await blockchain.treasury('newAdmin');
    
    const collectionAddress = collection.address;

    // --- 2. EXECUTE: ADD NEW ADMIN ---
    const addResult = await collection.send(
        superAdmin.getSender(), // Sent by the Super Admin (who can call requireOwner)
        { value: toNano('0.05') },
        // NOTE: CONFIRM 'new_admin' is the EXACT field name in your Tact message!
        { $$type: 'AddAdmin', new_admin: newAdmin.address } 
    );

    // --- 3. ASSERTIONS ---
    
    // Check 1: Transaction must succeed at the blockchain level
    expect(addResult.transactions).toHaveTransaction({
        from: superAdmin.address,
        to: collectionAddress,
        success: true,
    });

    // Check 2: VERIFY THE MAP STATE (The crucial check we isolated)
    // Assuming your getter is named getIsAdmin (camelCase)
    const isNewAdminInMap = await collection.getGetIsAdmin(newAdmin.address); 
    
    console.log('[DEBUG] Is the new admin (${newAdmin.address.toString()}) in the map? ${isNewAdminInMap}');
    
    // Check 3: The getter MUST return true after the AddAdmin call
    expect(isNewAdminInMap).toBe(true); 
    
    // A secondary check to ensure the old admin (superAdmin) is still recognized
    const isSuperAdminStillAdmin = await collection.getGetIsAdmin(superAdmin.address);
    expect(isSuperAdminStillAdmin).toBe(true); 
});


it('should allow the newly added admin to successfully mint an NFT', async () => {
    // --- 1. SETUP ---
    const superAdmin = admin; 
    const newAdmin = await blockchain.treasury('newAdmin');
    const studentC = await blockchain.treasury('studentC');
    const collectionAddress = collection.address;
    
    // 🟢 FIX 1: Fetch the current index BEFORE the mint
    const indexToMint = (await collection.getGetCollectionData()).next_item_index;
    
    // --- 2. PRE-STEP: ADD NEW ADMIN (Must succeed) ---
    await collection.send(
        superAdmin.getSender(), 
        { value: toNano('0.05') },
        { $$type: 'AddAdmin', new_admin: newAdmin.address } 
    );
    expect(await collection.getGetIsAdmin(newAdmin.address)).toBe(true);

    // --- 3. EXECUTE: PRIVILEGED ACTION BY NEW ADMIN ---
    const newAdminMintResult = await collection.send(
        newAdmin.getSender(), 
        // 🟢 FIX 2: Increase value to a very safe amount (e.g., 5 TON)
        { value: toNano('0.05'), bounce: true }, 
        {
            $$type: 'Mint',
           student: studentC.address,
           metadata: 'Certificate Metadata'
        }
    );

    // --- 4. ASSERTIONS ---
    
    // Check 1: The mint transaction from the new admin must succeed
    expect(newAdminMintResult.transactions).toHaveTransaction({
        from: newAdmin.address,
        to: collectionAddress,
        success: true, 
    });

    // Check 2: The new NFT item must have been deployed
    // 🟢 FIX 3: Use the dynamically captured indexToMint
    const nftAddress = await collection.getGetNftAddressByIndex(indexToMint);
    expect(nftAddress).not.toBeNull(); // This should now pass!
    
    // Check 3: Final state check (next_item_index should have incremented)
    const newCollectionData = await collection.getGetCollectionData();
    expect(newCollectionData.next_item_index).toEqual(indexToMint + 1n);
});


it('should allow the owner to remove an admin and revoke their privileges', async () => {
    // --- 1. SETUP ---
    const superAdmin = admin; 
    const revokableAdmin = await blockchain.treasury('revokableAdmin');
    const studentD = await blockchain.treasury('studentD');
    
    const collectionAddress = collection.address;
    
    // 🟢 Dynamic Index: Fetch the current index before starting this test
    const initialIndex = (await collection.getGetCollectionData()).next_item_index;

    // --- 2. PRE-STEP 1: ADD ADMIN ---
    await collection.send(
        superAdmin.getSender(), 
        { value: toNano('0.1') },
        { $$type: 'AddAdmin', new_admin: revokableAdmin.address } 
    );
    // Sanity Check: Must be admin initially
    expect(await collection.getGetIsAdmin(revokableAdmin.address)).toBe(true);
    
    // --- 3. EXECUTE: REMOVE ADMIN ---
    const removeResult = await collection.send(
        superAdmin.getSender(), // Only the Super Admin can remove
        { value: toNano('0.05') },
        { $$type: 'RemoveAdmin', admin: revokableAdmin.address }
    );

    // --- 4. ASSERTIONS: REMOVAL ---
    // Check 1: Removal transaction must succeed
    expect(removeResult.transactions).toHaveTransaction({
        from: superAdmin.address,
        to: collectionAddress,
        success: true,
    });
    
    // Check 2: The address must be removed from the map
    expect(await collection.getGetIsAdmin(revokableAdmin.address)).toBe(false);

    // --- 5. EXECUTE/ASSERT: PRIVILEGE REVOCATION (Mint attempt) ---
    // The now-removed admin attempts to mint (this should fail immediately)
    const revocationMintResult = await collection.send(
        revokableAdmin.getSender(), 
        { value: toNano('0.5'), bounce: true },
        { $$type: 'Mint', student: studentD.address, metadata: "Post-removal failure test" }
    );

    // Check 3: The transaction MUST FAIL (aborted: true)
    expect(revocationMintResult.transactions).toHaveTransaction({
        from: revokableAdmin.address,
        to: collectionAddress,
        aborted: true, // requireAdmin() should cause the transaction to abort
    });
    
    // Check 4: The index should NOT have changed
    const finalCollectionData = await collection.getGetCollectionData();
    expect(finalCollectionData.next_item_index).toEqual(initialIndex);
});



it('should prevent the NFT from being transferred by the owner (Soulbound)', async () => {
    // --- 1. SETUP ---
    
    const Mint_SENDER = await blockchain.treasury('admin'); // An admin to mint
    const originalOwner = await blockchain.treasury('studentA'); 
    const newRecipient = await blockchain.treasury('studentB');


    // Get the index BEFORE minting to ensure we check the correct item
    const indexToMint = (await collection.getGetCollectionData()).next_item_index;

    // --- 2. PRE-STEP: MINT THE NFT ---
    // The NFT item is initialized and deployed by this transaction.
    const MintResult = await collection.send(
        Mint_SENDER.getSender(), 
        { value: toNano('1'), bounce: true },
        {
            $$type: 'Mint',
            student: originalOwner.address, // NFT goes to this owner
            metadata: 'Soulbound test NFT'
        }
    );
     expect(MintResult.transactions).toHaveTransaction
     ({
        from: admin.address,
        to: collection.address,
        success: true,
     });
    
    // Get the address and open the NFT item contract instance
    const nftAddress = await collection.getGetNftAddressByIndex(indexToMint);
    expect(nftAddress).not.toBeNull();
    const nftItem = blockchain.openContract(CertificationItem.fromAddress(nftAddress!));
   
    
    // Initial check: Confirm the current owner is the originalOwner
    let initialNftData = await nftItem.getGetNftData();
    expect(initialNftData.owner).toEqualAddress(originalOwner.address);
    
    // --- 3. EXECUTE: ATTEMPT TRANSFER (from the current owner) ---
    // The owner attempts to transfer the NFT to a new recipient.
    const transferResult = await nftItem.send(
        originalOwner.getSender(), // Sent by the current owner
        { value: toNano('0.1'), bounce: true },
        {
            $$type: 'Transfer',
            query_id: 0n,
            new_owner: newRecipient.address, // The attempted recipient
            response_destination: originalOwner.address,
            custom_payload:  new Cell(),
            forward_amount: toNano('0.01'),
            forward_payload: beginCell().endCell().beginParse() as Slice,
        }
    );

    // --- 4. ASSERTIONS: TRANSFER FAILURE ---
    
    // Check 1: The transaction MUST ABORT due to the require(false, ...) statement
    expect(transferResult.transactions).toHaveTransaction({
        from: originalOwner.address,
        to: nftAddress!,
        aborted: true, // This is the crucial check for Soulbound
    });
    
    // Check 2: The ownership must NOT have changed
    let finalNftData = await nftItem.getGetNftData();
    expect(finalNftData.owner).toEqualAddress(originalOwner.address);
    expect(finalNftData.owner).not.toEqualAddress(newRecipient.address);
});



    it('should prevent non-admin from revoking the NFT', async () => {
        // Test 13: Unauthorized Revocation
        const failResult = await collection.send(
            rando.getSender(), // Rando is not the admin
            { value: toNano('0.05') },
            { $$type: 'Revoke', token_id: 0n, owner: studentA.address }
        );
        
        expect(failResult.transactions).toHaveTransaction({
            from: rando.address,
            to: collection.address,
            success: false, // Must fail!
        });
    });
});