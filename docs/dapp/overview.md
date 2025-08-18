# dApp Overview

This app remains Web2‑first (Vercel) with a decentralized mirror (IPFS). Users can optionally connect wallets for premium access proofs.

Key pieces
- Dual builds: Vercel base `/`, IPFS base `./`
- IPFS deploy via web3.storage with redundant pinning optional
- Future wallet connect (wagmi/viem), optional SIWE sessions
- Unified gating: Stripe (Web2) OR on‑chain proofs (NFT/EAS)
- PWA for offline and better gateway UX
