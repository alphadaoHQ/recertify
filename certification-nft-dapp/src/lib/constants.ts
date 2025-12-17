export const CONTRACT_ADDRESS =
  "EQB06RcI2pIognHT-UZKXeKJZ9IeP8G72v8q2z_V_Wwfeoca";
export const MAX_SUPPLY = 10000n;
export const TESTNET_ENDPOINT = "https://testnet.toncenter.com/api/v2/jsonRPC";
export const TESTNET_API_KEY =
  "AGABHHWESKCOIPYAAAAH653LELLUEE23RDY3OEGZC4XFMFFB2CEIV3KXA3B77NUWUR2SZJI"; // Add your API key

export const TX_CONFIG = {
  validUntil: 600, // 10 minutes
  mintValue: "0.05",
  addAdminValue: "0.05",
} as const;

export const OPCODES = {
  MINT: 2415581732,
  ADD_ADMIN: 3599441591,
} as const;
export const CERTIFICATE_NFT_DAPP_URL = "https://alphadao.vercel.app/";
export const METADATA_BASE_URI =
  "https://peach-fast-clam-38.mypinata.cloud/ipfs/bafybeiedq3l22745663ebspnmozssslvek4roaw77lhn75eq3wipxqbxze/";
