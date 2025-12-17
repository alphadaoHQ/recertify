import { Address } from "@ton/core";

export const validateAddress = (addr: string): boolean => {
  try {
    Address.parse(addr);
    return true;
  } catch {
    return false;
  }
};

export const formatAddress = (addr: string, short = true): string => {
  if (!addr) return "";
  if (!short) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

export const addressesEqual = (addr1: string, addr2: string): boolean => {
  try {
    const a1 = Address.parse(addr1);
    const a2 = Address.parse(addr2);
    return a1.equals(a2);
  } catch {
    return false;
  }
};
