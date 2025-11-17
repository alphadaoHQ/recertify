import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    address,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type SignedBundle = {
    $$type: 'SignedBundle';
    signature: Buffer;
    signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}

export function loadSignedBundle(slice: Slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
    const builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type AddAdmin = {
    $$type: 'AddAdmin';
    newAdmin: Address;
}

export function storeAddAdmin(src: AddAdmin) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3599441591, 32);
        b_0.storeAddress(src.newAdmin);
    };
}

export function loadAddAdmin(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3599441591) { throw Error('Invalid prefix'); }
    const _newAdmin = sc_0.loadAddress();
    return { $$type: 'AddAdmin' as const, newAdmin: _newAdmin };
}

export function loadTupleAddAdmin(source: TupleReader) {
    const _newAdmin = source.readAddress();
    return { $$type: 'AddAdmin' as const, newAdmin: _newAdmin };
}

export function loadGetterTupleAddAdmin(source: TupleReader) {
    const _newAdmin = source.readAddress();
    return { $$type: 'AddAdmin' as const, newAdmin: _newAdmin };
}

export function storeTupleAddAdmin(source: AddAdmin) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.newAdmin);
    return builder.build();
}

export function dictValueParserAddAdmin(): DictionaryValue<AddAdmin> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAddAdmin(src)).endCell());
        },
        parse: (src) => {
            return loadAddAdmin(src.loadRef().beginParse());
        }
    }
}

export type Mint = {
    $$type: 'Mint';
    student: Address;
    metadata: Slice;
}

export function storeMint(src: Mint) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2996168010, 32);
        b_0.storeAddress(src.student);
        b_0.storeRef(src.metadata.asCell());
    };
}

export function loadMint(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2996168010) { throw Error('Invalid prefix'); }
    const _student = sc_0.loadAddress();
    const _metadata = sc_0.loadRef().asSlice();
    return { $$type: 'Mint' as const, student: _student, metadata: _metadata };
}

export function loadTupleMint(source: TupleReader) {
    const _student = source.readAddress();
    const _metadata = source.readCell().asSlice();
    return { $$type: 'Mint' as const, student: _student, metadata: _metadata };
}

export function loadGetterTupleMint(source: TupleReader) {
    const _student = source.readAddress();
    const _metadata = source.readCell().asSlice();
    return { $$type: 'Mint' as const, student: _student, metadata: _metadata };
}

export function storeTupleMint(source: Mint) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.student);
    builder.writeSlice(source.metadata.asCell());
    return builder.build();
}

export function dictValueParserMint(): DictionaryValue<Mint> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMint(src)).endCell());
        },
        parse: (src) => {
            return loadMint(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryID: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(520518724, 32);
        b_0.storeInt(src.queryID, 257);
    };
}

export function loadDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 520518724) { throw Error('Invalid prefix'); }
    const _queryID = sc_0.loadIntBig(257);
    return { $$type: 'Deploy' as const, queryID: _queryID };
}

export function loadTupleDeploy(source: TupleReader) {
    const _queryID = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryID: _queryID };
}

export function loadGetterTupleDeploy(source: TupleReader) {
    const _queryID = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryID: _queryID };
}

export function storeTupleDeploy(source: Deploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryID);
    return builder.build();
}

export function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type Token = {
    $$type: 'Token';
    student: Address;
    metadata: Slice;
}

export function storeToken(src: Token) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.student);
        b_0.storeRef(src.metadata.asCell());
    };
}

export function loadToken(slice: Slice) {
    const sc_0 = slice;
    const _student = sc_0.loadAddress();
    const _metadata = sc_0.loadRef().asSlice();
    return { $$type: 'Token' as const, student: _student, metadata: _metadata };
}

export function loadTupleToken(source: TupleReader) {
    const _student = source.readAddress();
    const _metadata = source.readCell().asSlice();
    return { $$type: 'Token' as const, student: _student, metadata: _metadata };
}

export function loadGetterTupleToken(source: TupleReader) {
    const _student = source.readAddress();
    const _metadata = source.readCell().asSlice();
    return { $$type: 'Token' as const, student: _student, metadata: _metadata };
}

export function storeTupleToken(source: Token) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.student);
    builder.writeSlice(source.metadata.asCell());
    return builder.build();
}

export function dictValueParserToken(): DictionaryValue<Token> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeToken(src)).endCell());
        },
        parse: (src) => {
            return loadToken(src.loadRef().beginParse());
        }
    }
}

export type State = {
    $$type: 'State';
    owner: Address;
    total: bigint;
    nextId: bigint;
    base_uri: string;
}

export function storeState(src: State) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeInt(src.total, 257);
        b_0.storeInt(src.nextId, 257);
        b_0.storeStringRefTail(src.base_uri);
    };
}

export function loadState(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _total = sc_0.loadIntBig(257);
    const _nextId = sc_0.loadIntBig(257);
    const _base_uri = sc_0.loadStringRefTail();
    return { $$type: 'State' as const, owner: _owner, total: _total, nextId: _nextId, base_uri: _base_uri };
}

export function loadTupleState(source: TupleReader) {
    const _owner = source.readAddress();
    const _total = source.readBigNumber();
    const _nextId = source.readBigNumber();
    const _base_uri = source.readString();
    return { $$type: 'State' as const, owner: _owner, total: _total, nextId: _nextId, base_uri: _base_uri };
}

export function loadGetterTupleState(source: TupleReader) {
    const _owner = source.readAddress();
    const _total = source.readBigNumber();
    const _nextId = source.readBigNumber();
    const _base_uri = source.readString();
    return { $$type: 'State' as const, owner: _owner, total: _total, nextId: _nextId, base_uri: _base_uri };
}

export function storeTupleState(source: State) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.total);
    builder.writeNumber(source.nextId);
    builder.writeString(source.base_uri);
    return builder.build();
}

export function dictValueParserState(): DictionaryValue<State> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeState(src)).endCell());
        },
        parse: (src) => {
            return loadState(src.loadRef().beginParse());
        }
    }
}

export type CertificationNFT$Data = {
    $$type: 'CertificationNFT$Data';
    owner: Address;
    admins: Dictionary<Address, boolean>;
    tokens: Dictionary<bigint, Token>;
    total: bigint;
    nextId: bigint;
    base_uri: string;
}

export function storeCertificationNFT$Data(src: CertificationNFT$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeDict(src.admins, Dictionary.Keys.Address(), Dictionary.Values.Bool());
        b_0.storeDict(src.tokens, Dictionary.Keys.BigInt(257), dictValueParserToken());
        b_0.storeInt(src.total, 257);
        b_0.storeInt(src.nextId, 257);
        b_0.storeStringRefTail(src.base_uri);
    };
}

export function loadCertificationNFT$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _admins = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.Bool(), sc_0);
    const _tokens = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserToken(), sc_0);
    const _total = sc_0.loadIntBig(257);
    const _nextId = sc_0.loadIntBig(257);
    const _base_uri = sc_0.loadStringRefTail();
    return { $$type: 'CertificationNFT$Data' as const, owner: _owner, admins: _admins, tokens: _tokens, total: _total, nextId: _nextId, base_uri: _base_uri };
}

export function loadTupleCertificationNFT$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _admins = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
    const _tokens = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserToken(), source.readCellOpt());
    const _total = source.readBigNumber();
    const _nextId = source.readBigNumber();
    const _base_uri = source.readString();
    return { $$type: 'CertificationNFT$Data' as const, owner: _owner, admins: _admins, tokens: _tokens, total: _total, nextId: _nextId, base_uri: _base_uri };
}

export function loadGetterTupleCertificationNFT$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _admins = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
    const _tokens = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserToken(), source.readCellOpt());
    const _total = source.readBigNumber();
    const _nextId = source.readBigNumber();
    const _base_uri = source.readString();
    return { $$type: 'CertificationNFT$Data' as const, owner: _owner, admins: _admins, tokens: _tokens, total: _total, nextId: _nextId, base_uri: _base_uri };
}

export function storeTupleCertificationNFT$Data(source: CertificationNFT$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeCell(source.admins.size > 0 ? beginCell().storeDictDirect(source.admins, Dictionary.Keys.Address(), Dictionary.Values.Bool()).endCell() : null);
    builder.writeCell(source.tokens.size > 0 ? beginCell().storeDictDirect(source.tokens, Dictionary.Keys.BigInt(257), dictValueParserToken()).endCell() : null);
    builder.writeNumber(source.total);
    builder.writeNumber(source.nextId);
    builder.writeString(source.base_uri);
    return builder.build();
}

export function dictValueParserCertificationNFT$Data(): DictionaryValue<CertificationNFT$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCertificationNFT$Data(src)).endCell());
        },
        parse: (src) => {
            return loadCertificationNFT$Data(src.loadRef().beginParse());
        }
    }
}

 type CertificationNFT_init_args = {
    $$type: 'CertificationNFT_init_args';
    owner: Address;
    base_uri: string;
}

function initCertificationNFT_init_args(src: CertificationNFT_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeStringRefTail(src.base_uri);
    };
}

async function CertificationNFT_init(owner: Address, base_uri: string) {
    const __code = Cell.fromHex('b5ee9c72410212010003c1000228ff008e88f4a413f4bcf2c80bed5320e303ed43d9010e020271020c0201200308020120040601adb5723da89a1a400031c39f481e809a803a1e809020203ae01020203ae01a861a0208c208ad82d1c23f481a803a02405a202dadae04020688027c4aa0bb678d8c240dd2460db3240dde5a100de44de05c440dd2460dbbd0050040810101250259f40d6fa192306ddf206e92306d9bd0fa40d401d0126c126f02e2017db5e2bda89a1a400031c39f481e809a803a1e809020203ae01020203ae01a861a0208c208ad82d1c23f481a803a02405a202dadae04020688027c5b678d8c90070008547521230181b908fed44d0d200018e1cfa40f404d401d0f404810101d700810101d700d430d0104610456c168e11fa40d401d01202d1016d6d702010344013e25505db3c6c618090486c86f00016f8c6d6f8c22db3c8b12f8db3c018e22c821c10098802d01cb0701a301de019a7aa90ca630541220c000e63068a592cb07e4da11c9d0db3c8b52e6a736f6e80b0b0b0a0128db3c6f2201c993216eb396016f2259ccc9e831d00b00b620d74a21d7499720c20022c200b18e48036f22807f22cf31ab02a105ab025155b60820c2009a20aa0215d71803ce4014de596f025341a1c20099c8016f025044a1aa028e123133c20099d430d020d74a21d749927020e2e2e85f030181bef2876a268690000c70e7d207a026a00e87a02408080eb80408080eb806a186808230822b60b4708fd206a00e809016880b6b6b810081a2009f12a82ed9e3630c0d003c81010b2602714133f40a6fa19401d70030925b6de27f216e925b7091bae202ea3001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e1cfa40f404d401d0f404810101d700810101d700d430d0104610456c168e11fa40d401d01202d1016d6d702010344013e207925f07e005d70d1ff2e082218210d68b1eb7bae302018210b295e54abae3025f07f2c0820f1000b431fa4030f84210561045103443708138c65117c705f2f41481010b50077f71216e955b59f4593098c801cf004133f441e2044135c87f01ca0055505056ce13f40001c8f40012810101cf0012810101cf0002c8ce12cdcdc9ed5401e2fa40d430d0f84210561046103646788200a5c3095306c70592307f8e1e81010b2602714133f40a6fa19401d70030925b6de27f216e925b7091bae2e219f2f48200ba6222812710b9f2f40581010107c85902ce01c8cecdc9542650206e953059f45a30944133f415e204a403a44504431311004cc87f01ca0055505056ce13f40001c8f40012810101cf0012810101cf0002c8ce12cdcdc9ed54f604c184');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initCertificationNFT_init_args({ $$type: 'CertificationNFT_init_args', owner, base_uri })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const CertificationNFT_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
    14534: { message: "Not owner" },
    42435: { message: "Not authorized" },
    47714: { message: "Max supply reached" },
} as const

export const CertificationNFT_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "Not owner": 14534,
    "Not authorized": 42435,
    "Max supply reached": 47714,
} as const

const CertificationNFT_types: ABIType[] = [
    {"name":"DataSize","header":null,"fields":[{"name":"cells","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bits","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"refs","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SignedBundle","header":null,"fields":[{"name":"signature","type":{"kind":"simple","type":"fixed-bytes","optional":false,"format":64}},{"name":"signedData","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounceable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"MessageParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"DeployParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"init","type":{"kind":"simple","type":"StateInit","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"BasechainAddress","header":null,"fields":[{"name":"hash","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
    {"name":"AddAdmin","header":3599441591,"fields":[{"name":"newAdmin","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Mint","header":2996168010,"fields":[{"name":"student","type":{"kind":"simple","type":"address","optional":false}},{"name":"metadata","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"Deploy","header":520518724,"fields":[{"name":"queryID","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"Token","header":null,"fields":[{"name":"student","type":{"kind":"simple","type":"address","optional":false}},{"name":"metadata","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"State","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"total","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"nextId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"base_uri","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"CertificationNFT$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"admins","type":{"kind":"dict","key":"address","value":"bool"}},{"name":"tokens","type":{"kind":"dict","key":"int","value":"Token","valueFormat":"ref"}},{"name":"total","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"nextId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"base_uri","type":{"kind":"simple","type":"string","optional":false}}]},
]

const CertificationNFT_opcodes = {
    "AddAdmin": 3599441591,
    "Mint": 2996168010,
    "Deploy": 520518724,
}

const CertificationNFT_getters: ABIGetter[] = [
    {"name":"state","methodId":77589,"arguments":[],"returnType":{"kind":"simple","type":"State","optional":false}},
    {"name":"isAdmin","methodId":122448,"arguments":[{"name":"addr","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"token","methodId":68497,"arguments":[{"name":"id","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"Token","optional":true}},
    {"name":"token_uri","methodId":86159,"arguments":[{"name":"id","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"string","optional":false}},
]

export const CertificationNFT_getterMapping: { [key: string]: string } = {
    'state': 'getState',
    'isAdmin': 'getIsAdmin',
    'token': 'getToken',
    'token_uri': 'getTokenUri',
}

const CertificationNFT_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"AddAdmin"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Mint"}},
]


export class CertificationNFT implements Contract {
    
    public static readonly MAX_SUPPLY = 10000n;
    public static readonly storageReserve = 0n;
    public static readonly errors = CertificationNFT_errors_backward;
    public static readonly opcodes = CertificationNFT_opcodes;
    
    static async init(owner: Address, base_uri: string) {
        return await CertificationNFT_init(owner, base_uri);
    }
    
    static async fromInit(owner: Address, base_uri: string) {
        const __gen_init = await CertificationNFT_init(owner, base_uri);
        const address = contractAddress(0, __gen_init);
        return new CertificationNFT(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new CertificationNFT(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  CertificationNFT_types,
        getters: CertificationNFT_getters,
        receivers: CertificationNFT_receivers,
        errors: CertificationNFT_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: AddAdmin | Mint) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AddAdmin') {
            body = beginCell().store(storeAddAdmin(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Mint') {
            body = beginCell().store(storeMint(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getState(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('state', builder.build())).stack;
        const result = loadGetterTupleState(source);
        return result;
    }
    
    async getIsAdmin(provider: ContractProvider, addr: Address) {
        const builder = new TupleBuilder();
        builder.writeAddress(addr);
        const source = (await provider.get('isAdmin', builder.build())).stack;
        const result = source.readBoolean();
        return result;
    }
    
    async getToken(provider: ContractProvider, id: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(id);
        const source = (await provider.get('token', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleToken(result_p) : null;
        return result;
    }
    
    async getTokenUri(provider: ContractProvider, id: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(id);
        const source = (await provider.get('token_uri', builder.build())).stack;
        const result = source.readString();
        return result;
    }
    
}