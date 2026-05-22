export type Param = {
  name: string
  type: string
  description?: string
  placeholder?: string
  indexed?: boolean
}

export type ReadFn = {
  name: string
  description: string
  inputs: Param[]
  outputType: string
  mockOutput: string
}

export type WriteFn = {
  name: string
  description: string
  inputs: Param[]
}

export type EventDef = {
  name: string
  description: string
  params: Param[]
  signature: string
}

export const readFunctions: ReadFn[] = [
  {
    name: "balanceOf",
    description: "Returns the token balance of an address.",
    inputs: [
      {
        name: "account",
        type: "address",
        description: "Address to query the balance of.",
        placeholder: "0x...",
      },
    ],
    outputType: "uint256",
    mockOutput: "1000000000000000000",
  },
  {
    name: "allowance",
    description: "Amount of tokens an owner has allowed a spender to use.",
    inputs: [
      { name: "owner", type: "address", placeholder: "0x..." },
      { name: "spender", type: "address", placeholder: "0x..." },
    ],
    outputType: "uint256",
    mockOutput: "500000000000000000",
  },
  {
    name: "totalSupply",
    description: "Returns the total token supply in circulation.",
    inputs: [],
    outputType: "uint256",
    mockOutput: "42161398284532000000",
  },
  {
    name: "decimals",
    description: "Number of decimals used to format token amounts.",
    inputs: [],
    outputType: "uint8",
    mockOutput: "6",
  },
]

export const writeFunctions: WriteFn[] = [
  {
    name: "transfer",
    description: "Move tokens from your wallet to another address.",
    inputs: [
      { name: "recipient", type: "address", placeholder: "0x..." },
      { name: "amount", type: "uint256", placeholder: "0" },
    ],
  },
  {
    name: "approve",
    description: "Allow a spender to use a given amount of your tokens.",
    inputs: [
      { name: "spender", type: "address", placeholder: "0x..." },
      { name: "amount", type: "uint256", placeholder: "0" },
    ],
  },
  {
    name: "transferFrom",
    description: "Move tokens between accounts using a prior allowance.",
    inputs: [
      { name: "sender", type: "address", placeholder: "0x..." },
      { name: "recipient", type: "address", placeholder: "0x..." },
      { name: "amount", type: "uint256", placeholder: "0" },
    ],
  },
]

export const events: EventDef[] = [
  {
    name: "Transfer",
    description: "Emitted when tokens are moved between addresses.",
    params: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256" },
    ],
    signature:
      "event Transfer(address indexed from, address indexed to, uint256 value)",
  },
  {
    name: "Approval",
    description: "Emitted when an allowance is set by a call to approve.",
    params: [
      { name: "owner", type: "address", indexed: true },
      { name: "spender", type: "address", indexed: true },
      { name: "value", type: "uint256" },
    ],
    signature:
      "event Approval(address indexed owner, address indexed spender, uint256 value)",
  },
]

export const CHAINS = [
  "Ethereum",
  "Polygon",
  "Solana",
  "Sui",
  "Starknet",
] as const
export type Chain = (typeof CHAINS)[number]

export const CHAIN_NETWORK: Record<Chain, string> = {
  Ethereum: "Ethereum Mainnet",
  Polygon: "Polygon PoS",
  Solana: "Solana Mainnet",
  Sui: "Sui Mainnet",
  Starknet: "Starknet Mainnet",
}
