export interface ContractFunction {
  name: string;
  type: "read" | "write";
  description: string;
  inputs: { name: string; type: string; description?: string }[];
  outputs: { type: string }[];
  stateMutability?: string;
}

export interface ContractEvent {
  name: string;
  signature: string;
  inputs: { name: string; type: string; indexed?: boolean }[];
}

export interface UnifiedContract {
  name: string;
  address: string;
  chain: string;
  verified?: boolean;
  functions: ContractFunction[];
  events: ContractEvent[];
}
