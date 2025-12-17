export const formatSupply = (current: bigint, max: bigint): string => {
  return `${current.toString()} / ${max.toString()}`;
};

export const formatTokenId = (id: bigint): string => {
  return id.toString();
};

export const parseTokenId = (id: string): bigint => {
  return BigInt(id);
};
