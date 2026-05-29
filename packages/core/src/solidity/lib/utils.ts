import * as viemChains from "viem/chains";
import { isAddress, type Chain } from "viem";

export const SOURCIFY_SERVER = "https://sourcify.dev/server";

export function getChainById(chainId: string | number): Chain | undefined {
  const id = typeof chainId === "string" ? Number(chainId) : chainId;

  return Object.values(viemChains).find((chain: any) => chain?.id === id) as
    | Chain
    | undefined;
}

export interface NetworkOption {
  label: string;
  value: number;
}

export const POPULAR_EVM_NETWORKS: NetworkOption[] = [
  1, 11155111, 42161, 421614, 10, 11155420, 43114, 43113,
].map((id) => {
  const chain = getChainById(id);

  return {
    label: chain?.name ?? `Chain ${id}`,
    value: id,
  };
});

export function formatAddress(
  address: string,
  start: number = 6,
  end: number = 4,
): string {
  if (!address) return "";
  if (address.length <= start + end) return address;

  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function validateAddress(value: string): string | undefined {
  if (!value?.trim()) return "Contract address is required";
  if (!isAddress(value)) return `"${value}" is not a valid Ethereum address`;
  return undefined;
}
