
//=================================================================================================
// CertificationItem.tact - this is a TEP-62 Compliant Soulbound NFT Item for the Recertify Project
//=================================================================================================

import "@stdlib/ownable";


const OP_DESTROY: Int = 0xDE57DED;



// Message sent by collection
message(0x5fcc3d14) Transfer { 
    query_id: Int as uint64;            
    new_owner: Address;                 
    response_destination: Address;      
    custom_payload: Cell?; 
    forward_amount: Int as coins; 
    forward_payload: Slice as remaining; 
}


message(0x05138d91) OwnershipAssigned{
    query_id: Int as uint64;
    prev_owner: Address;
    forward_payload: Slice as remaining;
}

message(0xd53276db) Excesses {
    query_id: Int as uint64;
}


message(0x2fcb26a2) GetStaticData { 
    query_id: Int as uint64;
}
message(0x8b771735) ReportStaticData{
    query_id: Int as uint64;
    index_id: Int as uint64;
    collection: Address;
}


// --- ITEM DATA STRUCTURES ---
struct ItemInit {
    index: Int as uint64;
    issue_date: Int as uint64;
    student: Address; 
}


struct NftItemData {
    initialized: Bool;
    index: Int as uint64;
    collection: Address;
    owner: Address;
    individual_content: Cell;
}



// --- MAIN CONTRACT ---
contract CertificationItem with Ownable {

    

    // State variables
    collection_admin: Address;
    collection: Address;
    item_init: ItemInit;
    initialized: Bool = false;

    
    owner: Address;

    init(collection_admin: Address, collection: Address, item_init: ItemInit) {
        self.collection_admin = collection_admin;
        self.collection = collection;
        self.item_init = item_init;
        self.owner = item_init.student; 
    }

    // ------------------- TEP-62 STANDARD RECEIVER -------------------
    receive(msg: Transfer) {
        let ctx: Context = context();
        
        //  Checking for Initial Deployment (Minting)
        if (!self.initialized) {
            // Must be sent by the Collection contract for initialization
            require(ctx.sender == self.collection, "Only Collection can initialize this item");
            
            // Seting the initialization flag
            self.initialized = true;

            // Reply with Excesses to the response_destination 
            send(SendParameters{
                to: msg.response_destination,
                value: 0,
                mode: SendIgnoreErrors + SendRemainingValue, // Send all remaining tons
                body: Excesses { query_id: msg.query_id }.toCell()
            });

          
            return;
        }

        require(false, "This NFT is Soulbound (non-transferable).");
    }

 
    
receive(msg: Slice){


    if (msg.bits() < 32) {
        
        return;
        }
            
            let op = msg.loadUint(32);

            if (op != OP_DESTROY) {
                return;
            }
         
            
            //  Authorization check: sender must be the Collection contract.
            require(sender() == self.collection, "Only the Collection contract Can destroy This Item");

            //  Performing self-destruction by sending a special message.
            send(SendParameters{
                to: self.collection_admin, 
                value: 0, 
                mode: SendRemainingBalance + SendDestroyIfZero + SendIgnoreErrors,
                bounce: false,
                body: emptyCell()
            });
            return; 
        }
    
   




    // ------------------- TEP-62 STATIC DATA GETTER -------------------
   
    receive(msg: GetStaticData) {
        let ctx: Context = context();

        send(SendParameters{
            to: ctx.sender,
            value: 0,
            mode: SendIgnoreErrors + SendRemainingValue, 
            bounce: true,
            body: ReportStaticData{
                query_id: msg.query_id,
                index_id: self.item_init.index,
                collection: self.collection
            }.toCell()
        });
    }
 


// ------------------- TEP-62 REQUIRED GETTER FUNCTION -------------------

get fun get_nft_data(): NftItemData {
    
    
    let index_string: String = self.item_init.index.toString();
    
    
    let b: StringBuilder = beginString();
    b.append(index_string);
    b.append(".json");
    
    let item_metadata_path: String = b.toString(); 
    
    
    let individual_content_cell: Cell = beginCell()
        .storeSlice(item_metadata_path.asSlice()) 
        .endCell();
    
    
    return NftItemData {
        initialized: self.initialized, 
        index: self.item_init.index, 
        collection: self.collection, 
        owner: self.owner,
       
        individual_content: individual_content_cell
    };
}
}