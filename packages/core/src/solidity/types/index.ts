export interface SolidityEvent {
  name: string;
  signature: string;
  description?: string;
  inputs: { name: string; type: string; indexed?: boolean }[];
}

export interface SolidityFunction {
  name: string;
  type: "read" | "write";
  description?: string;
  inputs: { name: string; type: string; description?: string }[];
  outputs: { type: string }[];
  stateMutability: "view" | "pure" | "nonpayable" | "payable";
}

export interface SolidityContract {
  name: string;
  description: string;
  address: string;
  network: number | string;
  verified: boolean;
  functions: SolidityFunction[];
  events: SolidityEvent[];
  compiler?: string;
  optimization?: boolean;
}
