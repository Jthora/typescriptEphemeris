# Web3 Milestones and Tasks

This file tracks actionable tasks, acceptance criteria, and rollout notes.

## A) Dual Build + IPFS Publishing

Tasks
- Vite: make `base` configurable via env; default `/`, IPFS build `./`
- Add `scripts`:
  - `build:ipfs` → IPFS-friendly build
  - `deploy:ipfs` → upload `dist/` to IPFS and print CID + gateway URL
- Add `src/ipfs/client.ts` to wrap web3.storage
- Docs: update usage in `docs/web3/deploy.md`

Acceptance Criteria
- `npm run build` produces Vercel-ready artifact
- `npm run build:ipfs && npm run deploy:ipfs` returns a CID and public gateway link
- App loads correctly from `https://w3s.link/ipfs/<CID>/` (all assets resolve)

## B) Wallet Connect + On-Chain Gating (no payments)

Tasks
- Add deps: `wagmi`, `viem`, `@tanstack/react-query` (+ optional RainbowKit)
- Create `src/web3/Web3Provider.tsx` and `src/web3/useWallet.ts`
- Create `src/web3/gating.ts` with `checkNftOwnership`, `checkEasAttestation`
- Add optional Connect button and a "Check Premium" action

Acceptance Criteria
- App runs without wallet
- Connecting wallet works when user opts in
- Gating checks return deterministic result for configured contract(s)

## C) Web2 Subscriptions (Stripe) + Unified Gating

Tasks
- Add Vercel Functions: `/api/stripe/*` (checkout, webhook)
- Add Stripe client integration
- Issue short-lived JWT for premium access
- Merge gating logic: Stripe-active OR on-chain proof

Acceptance Criteria
- Users can subscribe via Stripe and access premium features on Vercel
- JWT refresh handled gracefully; logout clears state

## D) Crypto Payments (Coinbase Commerce or Unlock)

Tasks
- Option 1: Coinbase Commerce checkout + post-payment membership issuance (NFT or EAS)
- Option 2: Unlock Protocol membership lock; read via wagmi
- Integrate into unified gating logic

Acceptance Criteria
- Users can unlock premium with crypto
- Same gated features enabled as Stripe subscribers
