# Routing on IPFS

IPFS doesn’t support server fallback for SPA routes. Options:

- Hash routing (recommended): `/#/route` works on gateways
- Single‑entry app: avoid deep routes; state via query/hash
- If using path routing on Web2, keep IPFS build hash‑based

Migration tip
- Abstract a router so IPFS build switches to hash mode
