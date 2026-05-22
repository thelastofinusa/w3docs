<p align="center" style="margin-top: 20px;">
  <img src="https://w3docs.vercel.app/logo-black.png" alt="PushAI logo" width="64" height="64" />
</p>

<h1 align="center">w3docs</h1>

<p align="center">
  <strong>Beautiful, interactive docs for smart contracts.</strong><br />
  Like Swagger — but for Ethereum contracts.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/w3docs">
    <img src="https://img.shields.io/npm/dt/w3docs.svg" alt="npm downloads" />
  </a>
  <a href="https://www.npmjs.com/package/w3docs">
    <img src="https://img.shields.io/npm/v/w3docs.svg" alt="npm version" />
  </a>
</p>

<p align="center">
  Generate a live smart contract explorer from a deployed contract in minutes.
</p>

---

## What is w3docs?

**w3docs** is a CLI tool that turns deployed smart contracts into beautiful, interactive documentation websites.

You provide a contract address, and w3docs automatically:

- Fetches the contract ABI directly from the blockchain
- Generates a complete documentation website
- Creates an interactive explorer for read and write functions
- Adds wallet connection support for transactions
- Produces a ready-to-deploy frontend project

Think of it like:

- **Swagger UI** for smart contracts
- **Postman** for on-chain functions
- **Interactive protocol docs** without manual setup

No source code. No compiler setup. No hand-written documentation.

Just one command.

---

## Quick Start

Initialize a documentation

```bash
npx w3docs init
```

The CLI will guide you through:

- Selecting a supported network
- Entering the contract address
- Naming your documentation project

## Example Workflow

```bash
npx w3docs init --sol
```

```bash
┌  w3docs • Document smart contracts with ease
│
◇  Which EVM network is your contract deployed on?
│  Ethereum Mainnet
│
◇  What is the contract address?
│  0xd76b5c2a23ef78368d8e34288b5b65d616b746ae
│
◇  What would you like to name this project?
│  w3docs
│
◇  Project generated successfully.
│
│  ◆ Language   Solidity
│  ◆ Network    ethereum
│  ◆ Address    0xd76b5c2a23ef78368d8e34288b5b65d616b746ae
│  ◆ Directory  ./w3docs
│
└  ✓ Build complete. Your on-chain interface is ready.

Next steps:
 $ cd w3docs
 $ w3docs build
 $ w3docs dev
```

## Generated Documentation Site

w3docs creates a full frontend project with:

- Landing page
- Interactive contract explorer
- Read function explorer
- Write function explorer
- Wallet connection support
- Event viewer
- Responsive dark-themed UI

The generated explorer includes:

- Function descriptions
- Parameter forms
- Live execution
- Output display
- Copyable values
- Block explorer links

## Supported Languages & Chains

View all supported chains:

```bash
npx w3docs show
```

```bash
┌   w3docs  • Available smart contract languages
│
│  ◆ Solidity → EVM Compatible Chains
│    Command: npx w3docs init --sol
│
│  ◆ Rust → Solana (coming soon)
│    Command: npx w3docs init --rust
│
│  ◆ Cairo → Starknet (coming soon)
│    Command: npx w3docs init --cairo
│
│  ◆ Sui Move → Sui (coming soon)
│    Command: npx w3docs init --sui
│
└  Try it now → npx w3docs init --sol
```

## How It Works

w3docs follows a simple pipeline:

1. Connect to a blockchain explorer or RPC node
2. Fetch the deployed contract interface (ABI)
3. Normalize contract metadata
4. Generate a complete frontend documentation project
5. Add interactive execution support

The generated project can be deployed anywhere:

- Vercel
- Netlify
- Cloudflare Pages
- IPFS
- Static hosting providers

## Why w3docs?

Most smart contract documentation today is:

- Static
- Hard to navigate
- Difficult to test
- Not beginner friendly

w3docs makes contracts interactive by default.

Instead of reading raw ABIs or explorer pages, users get a clean interface where they can:

- Explore functions
- Test calls
- Connect wallets
- Interact with contracts live

## Philosophy

w3docs is built around one idea:

> Smart contract documentation should be interactive, live, and easy to share.

No outdated screenshots.
No manually maintained docs.
No explorer confusion.

Just a clean interface that always reflects the deployed contract.
