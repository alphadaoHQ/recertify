// ================================================================================================
// Certification Collection Contract (TEP-62 + TEP-64 + TEP-84 Soulbound) For the Recertify project
// ================================================================================================

import "@stdlib/deploy";
import "@stdlib/ownable";
import "./CertificationItem";




// --- MESSAGES ---

message AddAdmin {
    new_admin: Address;
}

message RemoveAdmin {
    admin: Address;
}

message UpdateBaseURI {
    new_base_uri: String;
}

message Mint {
    student: Address;
    metadata: String;
}

message Revoke {
    owner: Address;
    token_id: Int;
}

message SetPaused {
    paused: Bool;
}

message TransferOwnership {
    new_owner: Address;
}

message Withdraw {
    amount: Int;
    to: Address;
}

message BatchMint {
    students: map<Int as uint16, Address>;
    count: Int as uint16;
}

                 //STRUCT FOR GETTERS
    struct CollectionData {
    next_item_index: Int as uint64;
    content: Cell;
    owner: Address;
    }



     // --- MAIN CONTRACT ---
 contract CertificationCollection with Deployable, Ownable {

    // --- STATE VARIABLES ---
    owner: Address;

    admins: map<Address, Bool>;

    nft_owners: map<Int as uint64, Address>;

    next_item_index: Int as uint64 = 0;

    max_supply: Int as uint64 = 10000;

    base_uri: String;

    paused: Bool = false;

    minting_fee: Int as coins = ton("0.05");

    item_code: Cell;

    nft_addresses: map<Int, Address>;



    // --- INITIALIZATION ---
    init(owner: Address, base_uri: String, item_code: Cell) {
        self.owner = owner;
        self.base_uri = base_uri;
        self.item_code = item_code;

         
        self.admins.set(owner, true);
        self.next_item_index = 0;

    }




    // --- INTERNAL HELPERS ---
    inline fun requireAdmin() {
        let ctx: Context = context();
        let sender: Address = ctx.sender;

        if (sender == self.owner) {
            return;
        }
        let is_admin: Bool? = self.admins.get(ctx.sender);
        require(is_admin != null && is_admin!!, "Only admins can call this");
    }

    // --- ADMIN MANAGEMENT ---
    receive(msg: AddAdmin) {
        self.requireOwner();
        require(msg.new_admin != newAddress(0, 0), "Invalid admin address");
        self.admins.set(msg.new_admin, true);
        emit("AdminAdded".asComment());
    }

    receive(msg: RemoveAdmin) {
        self.requireOwner();
        require(msg.admin != self.owner, "Cannot remove owner");
        self.admins.set(msg.admin, false);
        emit("AdminRemoved".asComment());
    }

    // --- PAUSE SYSTEM ---
 receive(msg: SetPaused) {
    self.requireOwner(); // only owner can pause/unpause

    // Update paused state
    self.paused = msg.paused;

    emit("PausedStateChanged".asComment());
}

    

    // --- COLLECTION METADATA MANAGEMENT ---

receive(msg: UpdateBaseURI) {
    self.requireOwner();
    self.base_uri = msg.new_base_uri;
    emit("BaseURIUpdated".asComment());
}

// --- TEP-64 COLLECTION CONTENT BUILDER ---
 inline fun build_collection_content_cell(): Cell {
    let uri_bytes: Slice =  self.base_uri.asSlice();   // convert string to bytes
    let uri_cell: Cell = beginCell()
        .storeUint(1, 8)        // prefix 0x01 for off-chain URI
        .storeSlice(uri_bytes)  // store bytes in the cell
        .endCell();
    return uri_cell;
}

// --- WITHDRAW TON ---
receive(msg: Withdraw) {
    self.requireOwner();   // only owner can withdraw

    require(msg.amount > 0, "Invalid amount");
    require(msg.to != newAddress(0, 0), "Invalid destination");

    let balance = myBalance();  
    require(balance >= msg.amount, "Insufficient balance");

    // Safe send
    send(SendParameters{
        to: msg.to,
        value: msg.amount,
        mode: 0,
        bounce: true,
        body: "Withdrawal". asComment ()
    });

 }



// --- BATCH MINTING ---
receive(msg: BatchMint) {
    self.requireAdmin();                     // only admin can call
    require(!self.paused, "Minting is paused");
    require(msg.count > 0 && msg.count <= 100, "Invalid batch count (1-100)");
    require(self.next_item_index + msg.count <= self.max_supply, "Exceeds max supply");

    let ctx: Context = context();            // get incoming value
    let total_fee: Int = self.minting_fee * msg.count;
    require(ctx.value >= total_fee, "Insufficient minting fee for batch");

    let i: Int = 0;
    while (i < msg.count) {
        let student: Address? = msg.students.get(i);
        if (student != null) {
            let token_id: Int = self.next_item_index + i;

            self.nft_owners.set(self.next_item_index, student!!);

            //  initialization data for Item contract
            let item_init_data: ItemInit = ItemInit{
                index: token_id,
                issue_date: now(),
                student: student!!
            };
            

            let item_state: StateInit = self.build_nft_item_state_init(item_init_data);
            let nft_item_address: Address = contractAddress(item_state);

            //  deployment message to Item contract
            send(SendParameters{
                to: nft_item_address,
                value: self.minting_fee + ton("0.005"), 
                mode: SendIgnoreErrors,
                code: item_state.code,
                data: item_state.data,
                bounce: true,
                body: emptyMap()
            });
        }
        i = i + 1;
    }

    
    self.next_item_index = self.next_item_index + msg.count;  
    emit("BatchMinted".asComment());
 }

// --- INTERNAL FUNCTIONS ---
fun build_nft_item_state_init(init_data: ItemInit): StateInit {
    return initOf CertificationItem(
        self.owner,
        myAddress(),
        init_data
    );
}






      // --- INTERNAL FUNCTIONS --- 
     fun calculate_nft_item_address(token_id: Int, init_data: ItemInit): Address {
    let init: StateInit = initOf CertificationItem(
         self.owner,
         myAddress(),
         init_data
    );
    
    return contractAddress(init);
 }


 receive(msg: Mint) {
    self.requireAdmin();                   // only admin can call
    require(!self.paused, "Minting is paused");
    require(self.next_item_index < self.max_supply, "Max supply reached");

    self.nft_owners.set(self.next_item_index, msg.student);

    let ctx: Context = context();
    require(ctx.value >= self.minting_fee, "Insufficient minting fee");

    let student: Address = msg.student;

    //  initialization data for Item contract
    let item_init_data: ItemInit = ItemInit{
        index: self.next_item_index,
        issue_date: now(),
        student: msg.student
    };

    // Build StateInit
    let item_state: StateInit = self.build_nft_item_state_init(item_init_data);

    let nft_address: Address = contractAddress(item_state);

    self.nft_addresses.set(self.next_item_index, nft_address);
    send(SendParameters{
        to: nft_address,
        value: self.minting_fee + ton("0.005"),   
        mode: SendIgnoreErrors,
        code: item_state.code,
        data: item_state.data,
        bounce: true,
        body: emptyMap()
    });

   
    self.next_item_index = self.next_item_index + 1;
    emit("Minted".asComment());
}



receive(msg: Revoke) {
    self.requireAdmin(); // Only admin can revoke
    
    // 1. Calculate the Item's address
    let item_init_data: ItemInit = ItemInit{
        index: msg.token_id,
        issue_date: 0, 
        student: msg.owner 
    };
    
    let nft_address: Address = self.calculate_nft_item_address(msg.token_id, item_init_data);

   

    
    require(msg.token_id < self.next_item_index, "Token ID is not minted yet");
    send(SendParameters{
        to: nft_address,
        value: ton("0.1"), 
        mode: SendRemainingBalance | SendDestroyIfZero | SendIgnoreErrors,
        bounce: true,
        body: beginCell().storeUint(OP_DESTROY, 32).endCell() 
    });
    
    emit("CertificateRevoked".asComment());
}

receive(msg: TransferOwnership) {
    
    self.requireOwner();
    self.owner = msg.new_owner;

    emit("OwnershipTransferred".asComment());
}

// -----------  TEP-62 GETTER 1: Returning the deterministic address of an NFT item by index  ----------------- //


    get fun get_nft_address_by_index(token_id: Int): Address? {
   return self.nft_addresses.get(token_id)}

    // -----------------------   TEP-62 GETTER 2: Getting Collection Metadata   -----------------------------//


    get  fun get_collection_data(): CollectionData {
   
    return CollectionData{
      next_item_index: self.next_item_index,
      content: self.build_collection_content_cell(), 
      owner:   self.owner
    };
}

// ------------ REQUIRED TEP-62 GETTER 3: Combined Content ------------  //

get fun get_nft_content(index: Int, individual_content: Cell): Cell {
    
   
    let suffix_slice: Slice = individual_content.asSlice();
    let suffix_string: String = suffix_slice.asString();
    
  
    let b: StringBuilder = beginString();
    b.append(self.base_uri);
    b.append(suffix_string);
    let full_uri: String = b.toString(); 
    
    
    let full_uri_cell: Cell = beginCell()
        .storeUint(1, 8)       
        .storeSlice(full_uri.asSlice()) 
        .endCell();
        
    return full_uri_cell;
}


    get fun get_is_admin(addr: Address): Bool {
     return self.owner == addr || (self.admins.get(addr) == true);
    }


 }