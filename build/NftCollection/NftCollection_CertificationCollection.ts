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

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadGetterTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function storeTupleDeploy(source: Deploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
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

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadGetterTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function storeTupleDeployOk(source: DeployOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadGetterTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function storeTupleFactoryDeploy(source: FactoryDeploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

export function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwner = {
    $$type: 'ChangeOwner';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwner(src: ChangeOwner) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2174598809, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwner(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2174598809) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadTupleChangeOwner(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadGetterTupleChangeOwner(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

export function storeTupleChangeOwner(source: ChangeOwner) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

export function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwner(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwner(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwnerOk = {
    $$type: 'ChangeOwnerOk';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwnerOk(src: ChangeOwnerOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(846932810, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwnerOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 846932810) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadTupleChangeOwnerOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadGetterTupleChangeOwnerOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

export function storeTupleChangeOwnerOk(source: ChangeOwnerOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

export function dictValueParserChangeOwnerOk(): DictionaryValue<ChangeOwnerOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwnerOk(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwnerOk(src.loadRef().beginParse());
        }
    }
}

export type Transfer = {
    $$type: 'Transfer';
    query_id: bigint;
    new_owner: Address;
    response_destination: Address;
    custom_payload: Cell | null;
    forward_amount: bigint;
    forward_payload: Slice;
}

export function storeTransfer(src: Transfer) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1607220500, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.new_owner);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forward_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTransfer(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1607220500) { throw Error('Invalid prefix'); }
    const _query_id = sc_0.loadUintBig(64);
    const _new_owner = sc_0.loadAddress();
    const _response_destination = sc_0.loadAddress();
    const _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _forward_amount = sc_0.loadCoins();
    const _forward_payload = sc_0;
    return { $$type: 'Transfer' as const, query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}

export function loadTupleTransfer(source: TupleReader) {
    const _query_id = source.readBigNumber();
    const _new_owner = source.readAddress();
    const _response_destination = source.readAddress();
    const _custom_payload = source.readCellOpt();
    const _forward_amount = source.readBigNumber();
    const _forward_payload = source.readCell().asSlice();
    return { $$type: 'Transfer' as const, query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}

export function loadGetterTupleTransfer(source: TupleReader) {
    const _query_id = source.readBigNumber();
    const _new_owner = source.readAddress();
    const _response_destination = source.readAddress();
    const _custom_payload = source.readCellOpt();
    const _forward_amount = source.readBigNumber();
    const _forward_payload = source.readCell().asSlice();
    return { $$type: 'Transfer' as const, query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}

export function storeTupleTransfer(source: Transfer) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.new_owner);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_amount);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

export function dictValueParserTransfer(): DictionaryValue<Transfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTransfer(src.loadRef().beginParse());
        }
    }
}

export type OwnershipAssigned = {
    $$type: 'OwnershipAssigned';
    query_id: bigint;
    prev_owner: Address;
    forward_payload: Slice;
}

export function storeOwnershipAssigned(src: OwnershipAssigned) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(85167505, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.prev_owner);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadOwnershipAssigned(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 85167505) { throw Error('Invalid prefix'); }
    const _query_id = sc_0.loadUintBig(64);
    const _prev_owner = sc_0.loadAddress();
    const _forward_payload = sc_0;
    return { $$type: 'OwnershipAssigned' as const, query_id: _query_id, prev_owner: _prev_owner, forward_payload: _forward_payload };
}

export function loadTupleOwnershipAssigned(source: TupleReader) {
    const _query_id = source.readBigNumber();
    const _prev_owner = source.readAddress();
    const _forward_payload = source.readCell().asSlice();
    return { $$type: 'OwnershipAssigned' as const, query_id: _query_id, prev_owner: _prev_owner, forward_payload: _forward_payload };
}

export function loadGetterTupleOwnershipAssigned(source: TupleReader) {
    const _query_id = source.readBigNumber();
    const _prev_owner = source.readAddress();
    const _forward_payload = source.readCell().asSlice();
    return { $$type: 'OwnershipAssigned' as const, query_id: _query_id, prev_owner: _prev_owner, forward_payload: _forward_payload };
}

export function storeTupleOwnershipAssigned(source: OwnershipAssigned) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.prev_owner);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

export function dictValueParserOwnershipAssigned(): DictionaryValue<OwnershipAssigned> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeOwnershipAssigned(src)).endCell());
        },
        parse: (src) => {
            return loadOwnershipAssigned(src.loadRef().beginParse());
        }
    }
}

export type Excesses = {
    $$type: 'Excesses';
    query_id: bigint;
}

export function storeExcesses(src: Excesses) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3576854235, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadExcesses(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3576854235) { throw Error('Invalid prefix'); }
    const _query_id = sc_0.loadUintBig(64);
    return { $$type: 'Excesses' as const, query_id: _query_id };
}

export function loadTupleExcesses(source: TupleReader) {
    const _query_id = source.readBigNumber();
    return { $$type: 'Excesses' as const, query_id: _query_id };
}

export function loadGetterTupleExcesses(source: TupleReader) {
    const _query_id = source.readBigNumber();
    return { $$type: 'Excesses' as const, query_id: _query_id };
}

export function storeTupleExcesses(source: Excesses) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

export function dictValueParserExcesses(): DictionaryValue<Excesses> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeExcesses(src)).endCell());
        },
        parse: (src) => {
            return loadExcesses(src.loadRef().beginParse());
        }
    }
}

export type GetStaticData = {
    $$type: 'GetStaticData';
    query_id: bigint;
}

export function storeGetStaticData(src: GetStaticData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(801842850, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadGetStaticData(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 801842850) { throw Error('Invalid prefix'); }
    const _query_id = sc_0.loadUintBig(64);
    return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

export function loadTupleGetStaticData(source: TupleReader) {
    const _query_id = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

export function loadGetterTupleGetStaticData(source: TupleReader) {
    const _query_id = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

export function storeTupleGetStaticData(source: GetStaticData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

export function dictValueParserGetStaticData(): DictionaryValue<GetStaticData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadGetStaticData(src.loadRef().beginParse());
        }
    }
}

export type ReportStaticData = {
    $$type: 'ReportStaticData';
    query_id: bigint;
    index_id: bigint;
    collection: Address;
}

export function storeReportStaticData(src: ReportStaticData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2339837749, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeUint(src.index_id, 64);
        b_0.storeAddress(src.collection);
    };
}

export function loadReportStaticData(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2339837749) { throw Error('Invalid prefix'); }
    const _query_id = sc_0.loadUintBig(64);
    const _index_id = sc_0.loadUintBig(64);
    const _collection = sc_0.loadAddress();
    return { $$type: 'ReportStaticData' as const, query_id: _query_id, index_id: _index_id, collection: _collection };
}

export function loadTupleReportStaticData(source: TupleReader) {
    const _query_id = source.readBigNumber();
    const _index_id = source.readBigNumber();
    const _collection = source.readAddress();
    return { $$type: 'ReportStaticData' as const, query_id: _query_id, index_id: _index_id, collection: _collection };
}

export function loadGetterTupleReportStaticData(source: TupleReader) {
    const _query_id = source.readBigNumber();
    const _index_id = source.readBigNumber();
    const _collection = source.readAddress();
    return { $$type: 'ReportStaticData' as const, query_id: _query_id, index_id: _index_id, collection: _collection };
}

export function storeTupleReportStaticData(source: ReportStaticData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.index_id);
    builder.writeAddress(source.collection);
    return builder.build();
}

export function dictValueParserReportStaticData(): DictionaryValue<ReportStaticData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReportStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadReportStaticData(src.loadRef().beginParse());
        }
    }
}

export type ItemInit = {
    $$type: 'ItemInit';
    index: bigint;
    issue_date: bigint;
    student: Address;
}

export function storeItemInit(src: ItemInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(src.index, 64);
        b_0.storeUint(src.issue_date, 64);
        b_0.storeAddress(src.student);
    };
}

export function loadItemInit(slice: Slice) {
    const sc_0 = slice;
    const _index = sc_0.loadUintBig(64);
    const _issue_date = sc_0.loadUintBig(64);
    const _student = sc_0.loadAddress();
    return { $$type: 'ItemInit' as const, index: _index, issue_date: _issue_date, student: _student };
}

export function loadTupleItemInit(source: TupleReader) {
    const _index = source.readBigNumber();
    const _issue_date = source.readBigNumber();
    const _student = source.readAddress();
    return { $$type: 'ItemInit' as const, index: _index, issue_date: _issue_date, student: _student };
}

export function loadGetterTupleItemInit(source: TupleReader) {
    const _index = source.readBigNumber();
    const _issue_date = source.readBigNumber();
    const _student = source.readAddress();
    return { $$type: 'ItemInit' as const, index: _index, issue_date: _issue_date, student: _student };
}

export function storeTupleItemInit(source: ItemInit) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.index);
    builder.writeNumber(source.issue_date);
    builder.writeAddress(source.student);
    return builder.build();
}

export function dictValueParserItemInit(): DictionaryValue<ItemInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeItemInit(src)).endCell());
        },
        parse: (src) => {
            return loadItemInit(src.loadRef().beginParse());
        }
    }
}

export type NftItemData = {
    $$type: 'NftItemData';
    initialized: boolean;
    index: bigint;
    collection: Address;
    owner: Address;
    individual_content: Cell;
}

export function storeNftItemData(src: NftItemData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.initialized);
        b_0.storeUint(src.index, 64);
        b_0.storeAddress(src.collection);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.individual_content);
    };
}

export function loadNftItemData(slice: Slice) {
    const sc_0 = slice;
    const _initialized = sc_0.loadBit();
    const _index = sc_0.loadUintBig(64);
    const _collection = sc_0.loadAddress();
    const _owner = sc_0.loadAddress();
    const _individual_content = sc_0.loadRef();
    return { $$type: 'NftItemData' as const, initialized: _initialized, index: _index, collection: _collection, owner: _owner, individual_content: _individual_content };
}

export function loadTupleNftItemData(source: TupleReader) {
    const _initialized = source.readBoolean();
    const _index = source.readBigNumber();
    const _collection = source.readAddress();
    const _owner = source.readAddress();
    const _individual_content = source.readCell();
    return { $$type: 'NftItemData' as const, initialized: _initialized, index: _index, collection: _collection, owner: _owner, individual_content: _individual_content };
}

export function loadGetterTupleNftItemData(source: TupleReader) {
    const _initialized = source.readBoolean();
    const _index = source.readBigNumber();
    const _collection = source.readAddress();
    const _owner = source.readAddress();
    const _individual_content = source.readCell();
    return { $$type: 'NftItemData' as const, initialized: _initialized, index: _index, collection: _collection, owner: _owner, individual_content: _individual_content };
}

export function storeTupleNftItemData(source: NftItemData) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.initialized);
    builder.writeNumber(source.index);
    builder.writeAddress(source.collection);
    builder.writeAddress(source.owner);
    builder.writeCell(source.individual_content);
    return builder.build();
}

export function dictValueParserNftItemData(): DictionaryValue<NftItemData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeNftItemData(src)).endCell());
        },
        parse: (src) => {
            return loadNftItemData(src.loadRef().beginParse());
        }
    }
}

export type CertificationItem$Data = {
    $$type: 'CertificationItem$Data';
    collection_admin: Address;
    collection: Address;
    item_init: ItemInit;
    initialized: boolean;
    owner: Address;
}

export function storeCertificationItem$Data(src: CertificationItem$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.collection_admin);
        b_0.storeAddress(src.collection);
        b_0.store(storeItemInit(src.item_init));
        b_0.storeBit(src.initialized);
        const b_1 = new Builder();
        b_1.storeAddress(src.owner);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadCertificationItem$Data(slice: Slice) {
    const sc_0 = slice;
    const _collection_admin = sc_0.loadAddress();
    const _collection = sc_0.loadAddress();
    const _item_init = loadItemInit(sc_0);
    const _initialized = sc_0.loadBit();
    const sc_1 = sc_0.loadRef().beginParse();
    const _owner = sc_1.loadAddress();
    return { $$type: 'CertificationItem$Data' as const, collection_admin: _collection_admin, collection: _collection, item_init: _item_init, initialized: _initialized, owner: _owner };
}

export function loadTupleCertificationItem$Data(source: TupleReader) {
    const _collection_admin = source.readAddress();
    const _collection = source.readAddress();
    const _item_init = loadTupleItemInit(source);
    const _initialized = source.readBoolean();
    const _owner = source.readAddress();
    return { $$type: 'CertificationItem$Data' as const, collection_admin: _collection_admin, collection: _collection, item_init: _item_init, initialized: _initialized, owner: _owner };
}

export function loadGetterTupleCertificationItem$Data(source: TupleReader) {
    const _collection_admin = source.readAddress();
    const _collection = source.readAddress();
    const _item_init = loadGetterTupleItemInit(source);
    const _initialized = source.readBoolean();
    const _owner = source.readAddress();
    return { $$type: 'CertificationItem$Data' as const, collection_admin: _collection_admin, collection: _collection, item_init: _item_init, initialized: _initialized, owner: _owner };
}

export function storeTupleCertificationItem$Data(source: CertificationItem$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.collection_admin);
    builder.writeAddress(source.collection);
    builder.writeTuple(storeTupleItemInit(source.item_init));
    builder.writeBoolean(source.initialized);
    builder.writeAddress(source.owner);
    return builder.build();
}

export function dictValueParserCertificationItem$Data(): DictionaryValue<CertificationItem$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCertificationItem$Data(src)).endCell());
        },
        parse: (src) => {
            return loadCertificationItem$Data(src.loadRef().beginParse());
        }
    }
}

export type AddAdmin = {
    $$type: 'AddAdmin';
    new_admin: Address;
}

export function storeAddAdmin(src: AddAdmin) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(379536166, 32);
        b_0.storeAddress(src.new_admin);
    };
}

export function loadAddAdmin(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 379536166) { throw Error('Invalid prefix'); }
    const _new_admin = sc_0.loadAddress();
    return { $$type: 'AddAdmin' as const, new_admin: _new_admin };
}

export function loadTupleAddAdmin(source: TupleReader) {
    const _new_admin = source.readAddress();
    return { $$type: 'AddAdmin' as const, new_admin: _new_admin };
}

export function loadGetterTupleAddAdmin(source: TupleReader) {
    const _new_admin = source.readAddress();
    return { $$type: 'AddAdmin' as const, new_admin: _new_admin };
}

export function storeTupleAddAdmin(source: AddAdmin) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.new_admin);
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

export type RemoveAdmin = {
    $$type: 'RemoveAdmin';
    admin: Address;
}

export function storeRemoveAdmin(src: RemoveAdmin) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3389799937, 32);
        b_0.storeAddress(src.admin);
    };
}

export function loadRemoveAdmin(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3389799937) { throw Error('Invalid prefix'); }
    const _admin = sc_0.loadAddress();
    return { $$type: 'RemoveAdmin' as const, admin: _admin };
}

export function loadTupleRemoveAdmin(source: TupleReader) {
    const _admin = source.readAddress();
    return { $$type: 'RemoveAdmin' as const, admin: _admin };
}

export function loadGetterTupleRemoveAdmin(source: TupleReader) {
    const _admin = source.readAddress();
    return { $$type: 'RemoveAdmin' as const, admin: _admin };
}

export function storeTupleRemoveAdmin(source: RemoveAdmin) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.admin);
    return builder.build();
}

export function dictValueParserRemoveAdmin(): DictionaryValue<RemoveAdmin> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRemoveAdmin(src)).endCell());
        },
        parse: (src) => {
            return loadRemoveAdmin(src.loadRef().beginParse());
        }
    }
}

export type UpdateBaseURI = {
    $$type: 'UpdateBaseURI';
    new_base_uri: string;
}

export function storeUpdateBaseURI(src: UpdateBaseURI) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2689715696, 32);
        b_0.storeStringRefTail(src.new_base_uri);
    };
}

export function loadUpdateBaseURI(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2689715696) { throw Error('Invalid prefix'); }
    const _new_base_uri = sc_0.loadStringRefTail();
    return { $$type: 'UpdateBaseURI' as const, new_base_uri: _new_base_uri };
}

export function loadTupleUpdateBaseURI(source: TupleReader) {
    const _new_base_uri = source.readString();
    return { $$type: 'UpdateBaseURI' as const, new_base_uri: _new_base_uri };
}

export function loadGetterTupleUpdateBaseURI(source: TupleReader) {
    const _new_base_uri = source.readString();
    return { $$type: 'UpdateBaseURI' as const, new_base_uri: _new_base_uri };
}

export function storeTupleUpdateBaseURI(source: UpdateBaseURI) {
    const builder = new TupleBuilder();
    builder.writeString(source.new_base_uri);
    return builder.build();
}

export function dictValueParserUpdateBaseURI(): DictionaryValue<UpdateBaseURI> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeUpdateBaseURI(src)).endCell());
        },
        parse: (src) => {
            return loadUpdateBaseURI(src.loadRef().beginParse());
        }
    }
}

export type Mint = {
    $$type: 'Mint';
    student: Address;
    metadata: string;
}

export function storeMint(src: Mint) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1791713539, 32);
        b_0.storeAddress(src.student);
        b_0.storeStringRefTail(src.metadata);
    };
}

export function loadMint(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1791713539) { throw Error('Invalid prefix'); }
    const _student = sc_0.loadAddress();
    const _metadata = sc_0.loadStringRefTail();
    return { $$type: 'Mint' as const, student: _student, metadata: _metadata };
}

export function loadTupleMint(source: TupleReader) {
    const _student = source.readAddress();
    const _metadata = source.readString();
    return { $$type: 'Mint' as const, student: _student, metadata: _metadata };
}

export function loadGetterTupleMint(source: TupleReader) {
    const _student = source.readAddress();
    const _metadata = source.readString();
    return { $$type: 'Mint' as const, student: _student, metadata: _metadata };
}

export function storeTupleMint(source: Mint) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.student);
    builder.writeString(source.metadata);
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

export type Revoke = {
    $$type: 'Revoke';
    owner: Address;
    token_id: bigint;
}

export function storeRevoke(src: Revoke) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3343207899, 32);
        b_0.storeAddress(src.owner);
        b_0.storeInt(src.token_id, 257);
    };
}

export function loadRevoke(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3343207899) { throw Error('Invalid prefix'); }
    const _owner = sc_0.loadAddress();
    const _token_id = sc_0.loadIntBig(257);
    return { $$type: 'Revoke' as const, owner: _owner, token_id: _token_id };
}

export function loadTupleRevoke(source: TupleReader) {
    const _owner = source.readAddress();
    const _token_id = source.readBigNumber();
    return { $$type: 'Revoke' as const, owner: _owner, token_id: _token_id };
}

export function loadGetterTupleRevoke(source: TupleReader) {
    const _owner = source.readAddress();
    const _token_id = source.readBigNumber();
    return { $$type: 'Revoke' as const, owner: _owner, token_id: _token_id };
}

export function storeTupleRevoke(source: Revoke) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.token_id);
    return builder.build();
}

export function dictValueParserRevoke(): DictionaryValue<Revoke> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRevoke(src)).endCell());
        },
        parse: (src) => {
            return loadRevoke(src.loadRef().beginParse());
        }
    }
}

export type SetPaused = {
    $$type: 'SetPaused';
    paused: boolean;
}

export function storeSetPaused(src: SetPaused) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(157817343, 32);
        b_0.storeBit(src.paused);
    };
}

export function loadSetPaused(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 157817343) { throw Error('Invalid prefix'); }
    const _paused = sc_0.loadBit();
    return { $$type: 'SetPaused' as const, paused: _paused };
}

export function loadTupleSetPaused(source: TupleReader) {
    const _paused = source.readBoolean();
    return { $$type: 'SetPaused' as const, paused: _paused };
}

export function loadGetterTupleSetPaused(source: TupleReader) {
    const _paused = source.readBoolean();
    return { $$type: 'SetPaused' as const, paused: _paused };
}

export function storeTupleSetPaused(source: SetPaused) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.paused);
    return builder.build();
}

export function dictValueParserSetPaused(): DictionaryValue<SetPaused> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetPaused(src)).endCell());
        },
        parse: (src) => {
            return loadSetPaused(src.loadRef().beginParse());
        }
    }
}

export type TransferOwnership = {
    $$type: 'TransferOwnership';
    new_owner: Address;
}

export function storeTransferOwnership(src: TransferOwnership) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2636691758, 32);
        b_0.storeAddress(src.new_owner);
    };
}

export function loadTransferOwnership(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2636691758) { throw Error('Invalid prefix'); }
    const _new_owner = sc_0.loadAddress();
    return { $$type: 'TransferOwnership' as const, new_owner: _new_owner };
}

export function loadTupleTransferOwnership(source: TupleReader) {
    const _new_owner = source.readAddress();
    return { $$type: 'TransferOwnership' as const, new_owner: _new_owner };
}

export function loadGetterTupleTransferOwnership(source: TupleReader) {
    const _new_owner = source.readAddress();
    return { $$type: 'TransferOwnership' as const, new_owner: _new_owner };
}

export function storeTupleTransferOwnership(source: TransferOwnership) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.new_owner);
    return builder.build();
}

export function dictValueParserTransferOwnership(): DictionaryValue<TransferOwnership> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTransferOwnership(src)).endCell());
        },
        parse: (src) => {
            return loadTransferOwnership(src.loadRef().beginParse());
        }
    }
}

export type Withdraw = {
    $$type: 'Withdraw';
    amount: bigint;
    to: Address;
}

export function storeWithdraw(src: Withdraw) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(883896863, 32);
        b_0.storeInt(src.amount, 257);
        b_0.storeAddress(src.to);
    };
}

export function loadWithdraw(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 883896863) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    return { $$type: 'Withdraw' as const, amount: _amount, to: _to };
}

export function loadTupleWithdraw(source: TupleReader) {
    const _amount = source.readBigNumber();
    const _to = source.readAddress();
    return { $$type: 'Withdraw' as const, amount: _amount, to: _to };
}

export function loadGetterTupleWithdraw(source: TupleReader) {
    const _amount = source.readBigNumber();
    const _to = source.readAddress();
    return { $$type: 'Withdraw' as const, amount: _amount, to: _to };
}

export function storeTupleWithdraw(source: Withdraw) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeAddress(source.to);
    return builder.build();
}

export function dictValueParserWithdraw(): DictionaryValue<Withdraw> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWithdraw(src)).endCell());
        },
        parse: (src) => {
            return loadWithdraw(src.loadRef().beginParse());
        }
    }
}

export type BatchMint = {
    $$type: 'BatchMint';
    students: Dictionary<number, Address>;
    count: bigint;
}

export function storeBatchMint(src: BatchMint) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(368609949, 32);
        b_0.storeDict(src.students, Dictionary.Keys.Uint(16), Dictionary.Values.Address());
        b_0.storeUint(src.count, 16);
    };
}

export function loadBatchMint(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 368609949) { throw Error('Invalid prefix'); }
    const _students = Dictionary.load(Dictionary.Keys.Uint(16), Dictionary.Values.Address(), sc_0);
    const _count = sc_0.loadUintBig(16);
    return { $$type: 'BatchMint' as const, students: _students, count: _count };
}

export function loadTupleBatchMint(source: TupleReader) {
    const _students = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.Address(), source.readCellOpt());
    const _count = source.readBigNumber();
    return { $$type: 'BatchMint' as const, students: _students, count: _count };
}

export function loadGetterTupleBatchMint(source: TupleReader) {
    const _students = Dictionary.loadDirect(Dictionary.Keys.Uint(16), Dictionary.Values.Address(), source.readCellOpt());
    const _count = source.readBigNumber();
    return { $$type: 'BatchMint' as const, students: _students, count: _count };
}

export function storeTupleBatchMint(source: BatchMint) {
    const builder = new TupleBuilder();
    builder.writeCell(source.students.size > 0 ? beginCell().storeDictDirect(source.students, Dictionary.Keys.Uint(16), Dictionary.Values.Address()).endCell() : null);
    builder.writeNumber(source.count);
    return builder.build();
}

export function dictValueParserBatchMint(): DictionaryValue<BatchMint> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBatchMint(src)).endCell());
        },
        parse: (src) => {
            return loadBatchMint(src.loadRef().beginParse());
        }
    }
}

export type CollectionData = {
    $$type: 'CollectionData';
    next_item_index: bigint;
    content: Cell;
    owner: Address;
}

export function storeCollectionData(src: CollectionData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(src.next_item_index, 64);
        b_0.storeRef(src.content);
        b_0.storeAddress(src.owner);
    };
}

export function loadCollectionData(slice: Slice) {
    const sc_0 = slice;
    const _next_item_index = sc_0.loadUintBig(64);
    const _content = sc_0.loadRef();
    const _owner = sc_0.loadAddress();
    return { $$type: 'CollectionData' as const, next_item_index: _next_item_index, content: _content, owner: _owner };
}

export function loadTupleCollectionData(source: TupleReader) {
    const _next_item_index = source.readBigNumber();
    const _content = source.readCell();
    const _owner = source.readAddress();
    return { $$type: 'CollectionData' as const, next_item_index: _next_item_index, content: _content, owner: _owner };
}

export function loadGetterTupleCollectionData(source: TupleReader) {
    const _next_item_index = source.readBigNumber();
    const _content = source.readCell();
    const _owner = source.readAddress();
    return { $$type: 'CollectionData' as const, next_item_index: _next_item_index, content: _content, owner: _owner };
}

export function storeTupleCollectionData(source: CollectionData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.next_item_index);
    builder.writeCell(source.content);
    builder.writeAddress(source.owner);
    return builder.build();
}

export function dictValueParserCollectionData(): DictionaryValue<CollectionData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCollectionData(src)).endCell());
        },
        parse: (src) => {
            return loadCollectionData(src.loadRef().beginParse());
        }
    }
}

export type CertificationCollection$Data = {
    $$type: 'CertificationCollection$Data';
    owner: Address;
    admins: Dictionary<Address, boolean>;
    nft_owners: Dictionary<bigint, Address>;
    next_item_index: bigint;
    max_supply: bigint;
    base_uri: string;
    paused: boolean;
    minting_fee: bigint;
    item_code: Cell;
    nft_addresses: Dictionary<bigint, Address>;
}

export function storeCertificationCollection$Data(src: CertificationCollection$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeDict(src.admins, Dictionary.Keys.Address(), Dictionary.Values.Bool());
        b_0.storeDict(src.nft_owners, Dictionary.Keys.BigUint(64), Dictionary.Values.Address());
        b_0.storeUint(src.next_item_index, 64);
        b_0.storeUint(src.max_supply, 64);
        const b_1 = new Builder();
        b_1.storeStringRefTail(src.base_uri);
        b_1.storeBit(src.paused);
        b_1.storeCoins(src.minting_fee);
        b_1.storeRef(src.item_code);
        b_1.storeDict(src.nft_addresses, Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadCertificationCollection$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _admins = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.Bool(), sc_0);
    const _nft_owners = Dictionary.load(Dictionary.Keys.BigUint(64), Dictionary.Values.Address(), sc_0);
    const _next_item_index = sc_0.loadUintBig(64);
    const _max_supply = sc_0.loadUintBig(64);
    const sc_1 = sc_0.loadRef().beginParse();
    const _base_uri = sc_1.loadStringRefTail();
    const _paused = sc_1.loadBit();
    const _minting_fee = sc_1.loadCoins();
    const _item_code = sc_1.loadRef();
    const _nft_addresses = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), sc_1);
    return { $$type: 'CertificationCollection$Data' as const, owner: _owner, admins: _admins, nft_owners: _nft_owners, next_item_index: _next_item_index, max_supply: _max_supply, base_uri: _base_uri, paused: _paused, minting_fee: _minting_fee, item_code: _item_code, nft_addresses: _nft_addresses };
}

export function loadTupleCertificationCollection$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _admins = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
    const _nft_owners = Dictionary.loadDirect(Dictionary.Keys.BigUint(64), Dictionary.Values.Address(), source.readCellOpt());
    const _next_item_index = source.readBigNumber();
    const _max_supply = source.readBigNumber();
    const _base_uri = source.readString();
    const _paused = source.readBoolean();
    const _minting_fee = source.readBigNumber();
    const _item_code = source.readCell();
    const _nft_addresses = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    return { $$type: 'CertificationCollection$Data' as const, owner: _owner, admins: _admins, nft_owners: _nft_owners, next_item_index: _next_item_index, max_supply: _max_supply, base_uri: _base_uri, paused: _paused, minting_fee: _minting_fee, item_code: _item_code, nft_addresses: _nft_addresses };
}

export function loadGetterTupleCertificationCollection$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _admins = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
    const _nft_owners = Dictionary.loadDirect(Dictionary.Keys.BigUint(64), Dictionary.Values.Address(), source.readCellOpt());
    const _next_item_index = source.readBigNumber();
    const _max_supply = source.readBigNumber();
    const _base_uri = source.readString();
    const _paused = source.readBoolean();
    const _minting_fee = source.readBigNumber();
    const _item_code = source.readCell();
    const _nft_addresses = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    return { $$type: 'CertificationCollection$Data' as const, owner: _owner, admins: _admins, nft_owners: _nft_owners, next_item_index: _next_item_index, max_supply: _max_supply, base_uri: _base_uri, paused: _paused, minting_fee: _minting_fee, item_code: _item_code, nft_addresses: _nft_addresses };
}

export function storeTupleCertificationCollection$Data(source: CertificationCollection$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeCell(source.admins.size > 0 ? beginCell().storeDictDirect(source.admins, Dictionary.Keys.Address(), Dictionary.Values.Bool()).endCell() : null);
    builder.writeCell(source.nft_owners.size > 0 ? beginCell().storeDictDirect(source.nft_owners, Dictionary.Keys.BigUint(64), Dictionary.Values.Address()).endCell() : null);
    builder.writeNumber(source.next_item_index);
    builder.writeNumber(source.max_supply);
    builder.writeString(source.base_uri);
    builder.writeBoolean(source.paused);
    builder.writeNumber(source.minting_fee);
    builder.writeCell(source.item_code);
    builder.writeCell(source.nft_addresses.size > 0 ? beginCell().storeDictDirect(source.nft_addresses, Dictionary.Keys.BigInt(257), Dictionary.Values.Address()).endCell() : null);
    return builder.build();
}

export function dictValueParserCertificationCollection$Data(): DictionaryValue<CertificationCollection$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCertificationCollection$Data(src)).endCell());
        },
        parse: (src) => {
            return loadCertificationCollection$Data(src.loadRef().beginParse());
        }
    }
}

 type CertificationCollection_init_args = {
    $$type: 'CertificationCollection_init_args';
    owner: Address;
    base_uri: string;
    item_code: Cell;
}

function initCertificationCollection_init_args(src: CertificationCollection_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeStringRefTail(src.base_uri);
        b_0.storeRef(src.item_code);
    };
}

async function CertificationCollection_init(owner: Address, base_uri: string, item_code: Cell) {
    const __code = Cell.fromHex('b5ee9c72410243010010ab000228ff008e88f4a413f4bcf2c80bed5320e303ed43d9010f020271020a020120030501d9b8b5ded44d0d200018e1ffa40f404d401d0f404d33fd33fd401d001d200fa00d4f40430108a10896c1a8e3afa40d401d001d4552003d1586d6d81271070820afaf0806d515881010b500a7f71216e955b59f4593098c801cf004133f441e207104670504615e25519db3c6ca1804025831d0c86f00016f8c6d6f8c26db3c01db3c6f2201c993216eb396016f2259ccc9e831d0c87101cb0701cf16c93434020120060801d5b4a3bda89a1a400031c3ff481e809a803a1e809a67fa67fa803a003a401f401a9e8086021142112d8351c75f481a803a003a8aa4007a2b0dadb024e20e10415f5e100daa2b1020216a014fee242dd2ab6b3e8b2613190039e008267e883c40e208ce0a08c2bc5b678d94300700022901d9b4f47da89a1a400031c3ff481e809a803a1e809a67fa67fa803a003a401f401a9e8086021142112d8351c75f481a803a003a8aa4007a2b0dadb024e20e10415f5e100daa2b1020216a014fee242dd2ab6b3e8b2613190039e008267e883c40e208ce0a08c2bc4aa13b678d943009001c810101220259f40c6fa192306ddf0201200b0d01d5b905bed44d0d200018e1ffa40f404d401d0f404d33fd33fd401d001d200fa00d4f40430108a10896c1a8e3afa40d401d001d4552003d1586d6d81271070820afaf0806d515881010b500a7f71216e955b59f4593098c801cf004133f441e207104670504615e2db3c6ca380c004426559024c87101cb0701cf16c9541b0a10bc10ab109a10891078106710561045103401d9b8246ed44d0d200018e1ffa40f404d401d0f404d33fd33fd401d001d200fa00d4f40430108a10896c1a8e3afa40d401d001d4552003d1586d6d81271070820afaf0806d515881010b500a7f71216e955b59f4593098c801cf004133f441e207104670504615e25509db3c6ca180e005053a0c70592307f8e1e81010b2a02714133f40a6fa19401d70030925b6de27f216e925b7091bae2e201f83001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e1ffa40f404d401d0f404d33fd33fd401d001d200fa00d4f40430108a10896c1a8e3afa40d401d001d4552003d1586d6d81271070820afaf0806d515881010b500a7f71216e955b59f4593098c801cf004133f441e207104670504615e21004640b925f0be009d70d1ff2e082218210169f4326bae302218210ca0c3e01bae302218210096819ffbae302218210a051cdf0ba1114171903fe31fa4030108910781067105610451034413adb3c816ab68d086000000000000000000000000000000000000000000000000000000000000000000452c0c705b3f2f41881010b500b7f71216e955b59f4593098c801cf004133f441e288c88258c000000000000000000000000101cb67ccc970fb0008091067105610451034401213001c0000000041646d696e416464656400564130c87f01ca005590509ace17f40005c8f40014cb3f12cb3f01c8cecdca0058fa0212cc12f400cdc9ed5403b631fa4030108910781067105610451034413adb3c53a9c705b3f2e6f31881010b500b7071216e955b59f4593098c801cf004133f441e288c88258c000000000000000000000000101cb67ccc970fb0008091067105610451034413040151600200000000041646d696e52656d6f7665640052c87f01ca005590509ace17f40005c8f40014cb3f12cb3f01c8cecdca0058fa0212cc12f400cdc9ed5402c831d20030108910781067105610451034413adb3c3388c88258c000000000000000000000000101cb67ccc970fb0010891078106710561045103458c87f01ca005590509ace17f40005c8f40014cb3f12cb3f01c8cecdca0058fa0212cc12f400cdc9ed544018002c0000000050617573656453746174654368616e67656404f08f6331d430d0108910781067105610451034413adb3c3488c88258c000000000000000000000000101cb67ccc970fb00108910781067105610455502c87f01ca005590509ace17f40005c8f40014cb3f12cb3f01c8cecdca0058fa0212cc12f400cdc9ed54e021821034af321fbae30221821015f88a9dba401a1b1f002400000000426173655552495570646174656404fe31810101d700fa403050abdb3c8142a62bc200f2f48109228d086000000000000000000000000000000000000000000000000000000000000000000452d0c705b3f2f4f8276f108200d557511cbef2f4707f88104e103d10246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf818ae2f400c901401c1d1e001c000000005769746864726177616c001a58cf8680cf8480f400f400cf81005afb005517c87f01ca005590509ace17f40005c8f40014cb3f12cb3f01c8cecdca0058fa0212cc12f400cdc9ed54043ce3022182106acb6103bae302218210c7454ddbbae3022182109d28b92eba20262b3f02fc31f404d30f3050abf8416f2410235f03530ac70591308e2981010b2a02714133f40a6fa19401d70030925b6de28200d739216eb39601206ef2d080923170e2f2f4e28200d52624b3f2f48173b32cc200932cc1659170e2f2f48139cc537ca027bbf2f4f8416f24135f03533ca801814a4c02bef2f47093530cb98ae8303a2124012a2b80102259f40e6fa192306ddf206eb39130e30da42202fe5381a0804022206ef2d0802b103d01206e953059f45b30944133f416e2f82302206ef2d0804bb010cd10bd10ad109d108d107d106d105d104d103ddb3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d02582084c4b40a0137240037f6d1046051034403328230064c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00550901a0505aa088c88258c000000000000000000000000101cb67ccc970fb001079106810570610354430c87f01ca005590509ace17f40005c8f40014cb3f12cb3f01c8cecdca0058fa0212cc12f400cdc9ed5425001e0000000042617463684d696e74656401fe31fa4030108910781067105610451034413af8416f2410235f03530ac70591308e2981010b2a02714133f40a6fa19401d70030925b6de28200d739216eb39601206ef2d080923170e2f2f4e28200d52624b3f2f48200ba625376b9f2f4078040537b206e953059f45b30944133f416e2f8416f24303182009bbe3224bef2f42702fcf82354471c10bc10ab108910781067105610451034db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d00381010153a4206e953059f45a30944133f414e22582084c4b40a01034724055037f6d10460510344033c8cf8580ca00cf8440ce01fa0280692829010ef8282d4434db3c2d01cccf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0006a488c88258c000000000000000000000000101cb67ccc970fb0006c87f01ca005590509ace17f40005c8f40014cb3f12cb3f01c8cecdca0058fa0212cc12f400cdc9ed542a0014000000004d696e74656402fc31fa40810101d7003050abf8416f2410235f03530ac70591308e2981010b2a02714133f40a6fa19401d70030925b6de28200d739216eb39601206ef2d080923170e2f2f4e270544c1c10bc10ab109a108910782d10781067105610455520db3c810e1f51c8b91cf2f4821005f5e1008100a27fc882100de57ded01cb1fc92c3d016a33f8282d4334db3c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d02d012e88c87001ca0055415045ce12ce50235023cb3fcb3fcec92e0228ff008e88f4a413f4bcf2c80bed5320e303ed43d92f3502027130320185be28ef6a268690000c70dfd207d20699fe99ffd202a9001e9006a00e87d20180b8b22a8360bc70b7d207d20699fe99ffd202a90081a881a02e8aa81b810f16d9e3638c310002200185bc7e7f6a268690000c70dfd207d20699fe99ffd202a9001e9006a00e87d20180b8b22a8360bc70b7d207d20699fe99ffd202a90081a881a02e8aa81b810f16d9e363ac3302b6248e22c821c10098802d01cb0701a301de019a7aa90ca630541220c000e63068a592cb07e4da11c9d0c86f00016f8c6d6f8c01db3c8b52e6a736f6e8db3c6f2201c993216eb396016f2259ccc9e831d0c801cf16c9546260546840343400b620d74a21d7499720c20022c200b18e48036f22807f22cf31ab02a105ab025155b60820c2009a20aa0215d71803ce4014de596f025341a1c20099c8016f025044a1aa028e123133c20099d430d020d74a21d749927020e2e2e85f0303f83001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e1bfa40fa40d33fd33ffa40552003d200d401d0fa4030171645506c178e16fa40fa40d33fd33ffa4055201035103405d155037021e208925f08e07027d749c21f953026d70b1fde2082105fcc3d14bae30282102fcb26a2bae30226d74936383a018430068020d721d33ffa4031fa4030f8416f2410235f0328e3035f038200b6bdf2f010465513c87f01ca0055605067ce14ce035023cb3fcb3fceca0001c8cecdc9ed543700f2820080303926c70518f2f47f70804203c8018210d53276db58cb1fcb3fc9103941905a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0010465513c87f01ca0055605067ce14ce035023cb3fcb3fceca0001c8cecdc9ed5401d4068020d721d33f30f8416f2410235f037080427f543478c8552082108b7717355004cb1f12cb3fcb3fcec91034413010246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb001046551339003ac87f01ca0055605067ce14ce035023cb3fcb3fceca0001c8cecdc9ed5402fec1208e223610465513c87f01ca0055605067ce14ce035023cb3fcb3fceca0001c8cecdc9ed54e006d31f3082100de57dedbd8e2110465513c87f01ca0055605067ce14ce035023cb3fcb3fceca0001c8cecdc9ed54e0812844f84225c705f2f4708100a2708828553010246d50436d03c8cf8580ca00cf8440ce01fa0280693b3c00000084cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0010465513c87f01ca0055605067ce14ce035023cb3fcb3fceca0001c8cecdc9ed5401fa104e10246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0088c88258c000000000000000000000000101cb67ccc970fb005508c87f01ca005590509ace17f40005c8f40014cb3f12cb3f01c8cecdca0058fa0212cc12f400cdc9ed543e002c0000000043657274696669636174655265766f6b656403d68f5931fa4030108910781067105610451034413adb3c3988c88258c000000000000000000000000101cb67ccc970fb005507c87f01ca005590509ace17f40005c8f40014cb3f12cb3f01c8cecdca0058fa0212cc12f400cdc9ed54e0018210946a98b6bae3025f0bf2c0824041420010f8422ac705f2e0840030000000004f776e6572736869705472616e7366657272656400d8d33f30c8018210aff90f5758cb1fcb3fc9108a10791068105710461035443012f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00c87f01ca005590509ace17f40005c8f40014cb3f12cb3f01c8cecdca0058fa0212cc12f400cdc9ed544dad0ad8');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initCertificationCollection_init_args({ $$type: 'CertificationCollection_init_args', owner, base_uri, item_code })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const CertificationCollection_errors = {
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
    1779: { message: "Cannot remove owner" },
    2338: { message: "Invalid destination" },
    3615: { message: "Token ID is not minted yet" },
    10308: { message: "Only the Collection contract Can destroy This Item" },
    14796: { message: "Exceeds max supply" },
    17062: { message: "Invalid amount" },
    19020: { message: "Insufficient minting fee for batch" },
    27318: { message: "Invalid admin address" },
    29619: { message: "Invalid batch count (1-100)" },
    32816: { message: "Only Collection can initialize this item" },
    39870: { message: "Insufficient minting fee" },
    46781: { message: "This NFT is Soulbound (non-transferable)." },
    47714: { message: "Max supply reached" },
    54566: { message: "Minting is paused" },
    54615: { message: "Insufficient balance" },
    55097: { message: "Only admins can call this" },
} as const

export const CertificationCollection_errors_backward = {
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
    "Cannot remove owner": 1779,
    "Invalid destination": 2338,
    "Token ID is not minted yet": 3615,
    "Only the Collection contract Can destroy This Item": 10308,
    "Exceeds max supply": 14796,
    "Invalid amount": 17062,
    "Insufficient minting fee for batch": 19020,
    "Invalid admin address": 27318,
    "Invalid batch count (1-100)": 29619,
    "Only Collection can initialize this item": 32816,
    "Insufficient minting fee": 39870,
    "This NFT is Soulbound (non-transferable).": 46781,
    "Max supply reached": 47714,
    "Minting is paused": 54566,
    "Insufficient balance": 54615,
    "Only admins can call this": 55097,
} as const

const CertificationCollection_types: ABIType[] = [
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
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwner","header":2174598809,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwnerOk","header":846932810,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Transfer","header":1607220500,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"new_owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forward_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"OwnershipAssigned","header":85167505,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"prev_owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"Excesses","header":3576854235,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"GetStaticData","header":801842850,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"ReportStaticData","header":2339837749,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"index_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"collection","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ItemInit","header":null,"fields":[{"name":"index","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"issue_date","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"student","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"NftItemData","header":null,"fields":[{"name":"initialized","type":{"kind":"simple","type":"bool","optional":false}},{"name":"index","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"collection","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"individual_content","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"CertificationItem$Data","header":null,"fields":[{"name":"collection_admin","type":{"kind":"simple","type":"address","optional":false}},{"name":"collection","type":{"kind":"simple","type":"address","optional":false}},{"name":"item_init","type":{"kind":"simple","type":"ItemInit","optional":false}},{"name":"initialized","type":{"kind":"simple","type":"bool","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"AddAdmin","header":379536166,"fields":[{"name":"new_admin","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"RemoveAdmin","header":3389799937,"fields":[{"name":"admin","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"UpdateBaseURI","header":2689715696,"fields":[{"name":"new_base_uri","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"Mint","header":1791713539,"fields":[{"name":"student","type":{"kind":"simple","type":"address","optional":false}},{"name":"metadata","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"Revoke","header":3343207899,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"token_id","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SetPaused","header":157817343,"fields":[{"name":"paused","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"TransferOwnership","header":2636691758,"fields":[{"name":"new_owner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Withdraw","header":883896863,"fields":[{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BatchMint","header":368609949,"fields":[{"name":"students","type":{"kind":"dict","key":"uint","keyFormat":16,"value":"address"}},{"name":"count","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"CollectionData","header":null,"fields":[{"name":"next_item_index","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"CertificationCollection$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"admins","type":{"kind":"dict","key":"address","value":"bool"}},{"name":"nft_owners","type":{"kind":"dict","key":"uint","keyFormat":64,"value":"address"}},{"name":"next_item_index","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"max_supply","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"base_uri","type":{"kind":"simple","type":"string","optional":false}},{"name":"paused","type":{"kind":"simple","type":"bool","optional":false}},{"name":"minting_fee","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"item_code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"nft_addresses","type":{"kind":"dict","key":"int","value":"address"}}]},
]

const CertificationCollection_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
    "ChangeOwner": 2174598809,
    "ChangeOwnerOk": 846932810,
    "Transfer": 1607220500,
    "OwnershipAssigned": 85167505,
    "Excesses": 3576854235,
    "GetStaticData": 801842850,
    "ReportStaticData": 2339837749,
    "AddAdmin": 379536166,
    "RemoveAdmin": 3389799937,
    "UpdateBaseURI": 2689715696,
    "Mint": 1791713539,
    "Revoke": 3343207899,
    "SetPaused": 157817343,
    "TransferOwnership": 2636691758,
    "Withdraw": 883896863,
    "BatchMint": 368609949,
}

const CertificationCollection_getters: ABIGetter[] = [
    {"name":"get_nft_address_by_index","methodId":92067,"arguments":[{"name":"token_id","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"address","optional":true}},
    {"name":"get_collection_data","methodId":102491,"arguments":[],"returnType":{"kind":"simple","type":"CollectionData","optional":false}},
    {"name":"get_nft_content","methodId":68445,"arguments":[{"name":"index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"individual_content","type":{"kind":"simple","type":"cell","optional":false}}],"returnType":{"kind":"simple","type":"cell","optional":false}},
    {"name":"get_is_admin","methodId":115270,"arguments":[{"name":"addr","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"owner","methodId":83229,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
]

export const CertificationCollection_getterMapping: { [key: string]: string } = {
    'get_nft_address_by_index': 'getGetNftAddressByIndex',
    'get_collection_data': 'getGetCollectionData',
    'get_nft_content': 'getGetNftContent',
    'get_is_admin': 'getGetIsAdmin',
    'owner': 'getOwner',
}

const CertificationCollection_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"AddAdmin"}},
    {"receiver":"internal","message":{"kind":"typed","type":"RemoveAdmin"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetPaused"}},
    {"receiver":"internal","message":{"kind":"typed","type":"UpdateBaseURI"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Withdraw"}},
    {"receiver":"internal","message":{"kind":"typed","type":"BatchMint"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Mint"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Revoke"}},
    {"receiver":"internal","message":{"kind":"typed","type":"TransferOwnership"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]

export const OP_DESTROY = 233143789n;

export class CertificationCollection implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = CertificationCollection_errors_backward;
    public static readonly opcodes = CertificationCollection_opcodes;
    
    static async init(owner: Address, base_uri: string, item_code: Cell) {
        return await CertificationCollection_init(owner, base_uri, item_code);
    }
    
    static async fromInit(owner: Address, base_uri: string, item_code: Cell) {
        const __gen_init = await CertificationCollection_init(owner, base_uri, item_code);
        const address = contractAddress(0, __gen_init);
        return new CertificationCollection(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new CertificationCollection(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  CertificationCollection_types,
        getters: CertificationCollection_getters,
        receivers: CertificationCollection_receivers,
        errors: CertificationCollection_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: AddAdmin | RemoveAdmin | SetPaused | UpdateBaseURI | Withdraw | BatchMint | Mint | Revoke | TransferOwnership | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AddAdmin') {
            body = beginCell().store(storeAddAdmin(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'RemoveAdmin') {
            body = beginCell().store(storeRemoveAdmin(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetPaused') {
            body = beginCell().store(storeSetPaused(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'UpdateBaseURI') {
            body = beginCell().store(storeUpdateBaseURI(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Withdraw') {
            body = beginCell().store(storeWithdraw(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'BatchMint') {
            body = beginCell().store(storeBatchMint(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Mint') {
            body = beginCell().store(storeMint(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Revoke') {
            body = beginCell().store(storeRevoke(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TransferOwnership') {
            body = beginCell().store(storeTransferOwnership(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetNftAddressByIndex(provider: ContractProvider, token_id: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(token_id);
        const source = (await provider.get('get_nft_address_by_index', builder.build())).stack;
        const result = source.readAddressOpt();
        return result;
    }
    
    async getGetCollectionData(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_collection_data', builder.build())).stack;
        const result = loadGetterTupleCollectionData(source);
        return result;
    }
    
    async getGetNftContent(provider: ContractProvider, index: bigint, individual_content: Cell) {
        const builder = new TupleBuilder();
        builder.writeNumber(index);
        builder.writeCell(individual_content);
        const source = (await provider.get('get_nft_content', builder.build())).stack;
        const result = source.readCell();
        return result;
    }
    
    async getGetIsAdmin(provider: ContractProvider, addr: Address) {
        const builder = new TupleBuilder();
        builder.writeAddress(addr);
        const source = (await provider.get('get_is_admin', builder.build())).stack;
        const result = source.readBoolean();
        return result;
    }
    
    async getOwner(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('owner', builder.build())).stack;
        const result = source.readAddress();
        return result;
    }
    
}