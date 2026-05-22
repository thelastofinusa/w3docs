export const CONTRACT_TYPES = [
  {
    label: "Solidity",
    value: "sol",
    hint: "EVM Compatible Chains",
    available: true,
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
    available: false,
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
    available: false,
    networkMessage: "Which Starknet network is your contract deployed on?",
    networks: [
      { label: "Mainnet", value: "mainnet" },
      { label: "Sepolia Testnet", value: "sepolia" },
    ],
  },
  {
    label: "Sui Move",
    value: "sui",
    hint: "Sui",
    available: false,
    networkMessage: "Which Sui network is your contract deployed on?",
    networks: [
      { label: "Mainnet", value: "mainnet" },
      { label: "Testnet", value: "testnet" },
      { label: "Devnet", value: "devnet" },
    ],
  },
];
