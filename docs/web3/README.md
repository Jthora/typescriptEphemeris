# Web3 Enablement Plan

This document defines a pragmatic, incremental path to evolve the app into a Web2-first app with Web3 capabilities. We will keep Vercel deployment as the primary Web2 target and add decentralized hosting and premium access features via Web3 in stages.

## Milestones Overview

- A) Dual Build + IPFS Publishing (decentralized mirror)
  - Keep Vercel deploy as-is
  - Add IPFS-friendly build (relative base path)
  - Add CLI/pipeline to publish `dist/` to IPFS (web3.storage or Pinata), return CID
  - Optional: DNSLink or ENS contenthash to map a name to the CID
  - Nice-to-have: "Save chart to IPFS" for user artifacts (JSON/PNG)

- B) Wallet Connect + On-Chain Gating (no payments yet)
  - Add optional wallet connection using wagmi + viem (+ RainbowKit/WalletConnect)
  - Implement lightweight NFT/EAS attestation checks for “premium flags”
  - Keep logic entirely client-side; preserve full app functionality without a wallet

- C) Web2 Subscriptions (Stripe) + Unified Gating
  - Stripe Checkout + Customer Portal for recurring subscriptions
  - Vercel Functions issue short-lived sessions/JWTs for premium API routes or feature flags
  - Unify gating: either Stripe-active OR on-chain ownership/attestation grants premium access

- D) Crypto Payments (Coinbase Commerce or Unlock Protocol)
  - Add crypto payments as an alternative to Stripe
  - Option 1: Coinbase Commerce (one-time) → mint/attest membership post-payment
  - Option 2: Unlock Protocol (NFT memberships; supports card and crypto)
  - Optional: EAS attestation as a portable, non-transferable proof of membership

## Detailed Scope by Milestone

### A) Dual Build + IPFS Publishing

1. Build system
   - Vite dual-base support:
     - Vercel: `base: '/'`
     - IPFS: `base: './'` (relative assets)
   - Introduce env flag (e.g., `VITE_PUBLIC_BASE` or separate config)

2. IPFS publishing
   - Add `web3.storage` client and a script `deploy:ipfs` to upload `dist/` and print the CID
   - Output:
     - `ipfs://<CID>`
     - gateway link (e.g., `https://w3s.link/ipfs/<CID>/`)
   - Optional pinning providers: Pinata, web3.storage redundant pins

3. Docs
   - Usage and troubleshooting for IPFS deploy
   - Notes on immutability and cache headers

4. (Optional now, nice-to-have) "Save to IPFS"
   - Export current chart JSON and PNG (SVG-to-PNG) and upload to IPFS

### B) Wallet Connect + On-Chain Gating

1. Dependencies
   - `wagmi`, `viem`, `@tanstack/react-query`
   - UI kit: RainbowKit or WalletConnect Modal

2. Implementation
   - Lazy-load wallet UI for premium flows
   - Add `Web3Provider` and `useWallet` hook
   - Add `checkNFTGate` and/or `checkEASAttestation` utilities

3. UX
   - Non-invasive Connect button
   - Clearly optional unless user wants to unlock premium via on-chain ownership

### C) Web2 Subscriptions (Stripe) + Unified Gating

1. Payments
   - Stripe Checkout for subscription plans
   - Stripe Customer Portal

2. Backend
   - Vercel Functions for Stripe webhooks and issuing session/JWT
   - Store minimal user state (customer id, product tier) in Stripe metadata / JWT claims

3. Gating logic
   - Client checks: Stripe session OR on-chain proof → enable premium features

### D) Crypto Payments (Coinbase Commerce or Unlock)

1. Coinbase Commerce (simple)
   - Create charge → on success, issue membership (NFT or EAS attestation)

2. Unlock Protocol (memberships)
   - Deploy membership lock on Base/Polygon
   - Gating by reading membership NFT via wagmi

3. Optional portable proof
   - EAS attestation referencing membership status or IPFS CID for transparency

## Chains, Costs, and RPC
- Preferred chains: Base or Polygon for low fees
- RPC providers: Alchemy/Infura/Ankr (read-only)
- No private keys in client; any mint/attest calls must be user-initiated

## Security & Privacy
- Do not gate core, non-premium functionality behind wallet
- Avoid storing PII; prefer JWTs with short TTL and minimal claims
- For IPFS artifacts, warn users about public immutability

## Work Breakdown (Initial)
- Week 1: Milestone A (dual build, IPFS deploy, docs)
- Week 2: Milestone B (wallet connect, basic on-chain gating utilities)
- Week 3: Milestone C (Stripe subscriptions, unified gating)
- Week 4: Milestone D (crypto payments via Coinbase Commerce or Unlock)

---

Refer to `milestones.md` for task-level details and acceptance criteria.
