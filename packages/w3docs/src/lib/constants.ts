export const CONTRACT_TYPES = [
  {
    label: "Solidity",
    value: "solidity",
    hint: "EVM",
    networkMessage: "Which EVM network is your contract deployed on?",
    networks: [
      { label: "Ethereum Mainnet", value: "ethereum" },
      { label: "Polygon", value: "polygon" },
      { label: "Arbitrum", value: "arbitrum" },
      { label: "Optimism", value: "optimism" },
      { label: "Base", value: "base" },
    ],
  },
  {
    label: "Rust",
    value: "rust",
    hint: "Solana",
    networkMessage: "Which Solana cluster is your contract deployed on?",
    networks: [
      { label: "Mainnet Beta", value: "mainnet-beta" },
      { label: "Devnet", value: "devnet" },
    ],
  },
  {
    label: "Cairo",
    value: "cairo",
    hint: "Starknet",
    networkMessage: "Which Starknet network is your contract deployed on?",
    networks: [
      { label: "Mainnet", value: "mainnet" },
      { label: "Sepolia Testnet", value: "sepolia" },
    ],
  },
  {
    label: "Sui Move",
    value: "sui-move",
    hint: "Sui",
    networkMessage: "Which Sui network is your contract deployed on?",
    networks: [
      { label: "Mainnet", value: "mainnet" },
      { label: "Testnet", value: "testnet" },
      { label: "Devnet", value: "devnet" },
    ],
  },
];
