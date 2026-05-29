import { POPULAR_EVM_NETWORKS } from "@w3xp/core/solidity";

export const CONTRACT_TYPES = [
  {
    label: "Solidity",
    value: "sol",
    hint: "Ethereum & EVM-compatible smart contracts",
    available: true,
    network: {
      message: "Select the network your contract is deployed on.",
      items: [
        ...POPULAR_EVM_NETWORKS.map((network) => ({
          label: network.label,
          value: String(network.value),
          hint: String(network.value),
        })),
        {
          label: "Custom Chain ID",
          value: "custom",
          hint: "Can't find your network? Add a chain ID",
        },
      ],
    },
  },
  {
    label: "Rust",
    value: "rust",
    hint: "Solana programs built with Rust",
    available: false,
    network: {
      message: "Choose the Solana cluster where your program is deployed.",
      items: [
        {
          label: "Mainnet",
          value: "mainnet",
          hint: "Production Solana network",
        },
        {
          label: "Devnet",
          value: "devnet",
          hint: "Development and testing environment",
        },
        {
          label: "Testnet",
          value: "testnet",
          hint: "Validator and protocol testing network",
        },
      ],
    },
  },
  {
    label: "Cairo",
    value: "cairo",
    hint: "Starknet smart contracts written in Cairo",
    available: false,
    network: {
      message:
        "Select the Starknet environment where your contract is deployed.",
      items: [
        {
          label: "Mainnet",
          value: "mainnet",
          hint: "Live Starknet production network",
        },
        {
          label: "Sepolia Testnet",
          value: "sepolia",
          hint: "Starknet Sepolia testing environment",
        },
      ],
    },
  },
  {
    label: "Sui Move",
    value: "sui",
    hint: "Move-based smart contracts for the Sui network",
    available: false,
    network: {
      message:
        "Choose the Sui network where your package or contract is deployed.",
      items: [
        {
          label: "Mainnet",
          value: "mainnet",
          hint: "Live Sui production network",
        },
        {
          label: "Testnet",
          value: "testnet",
          hint: "Public Sui testing environment",
        },
        {
          label: "Devnet",
          value: "devnet",
          hint: "Developer-focused experimental network",
        },
      ],
    },
  },
];
