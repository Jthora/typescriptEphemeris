# IPFS Deploy (Milestone A)

This guide shows how to build an IPFS-friendly bundle and upload it using web3.storage.

## Prerequisites
- Node 18+
- web3.storage token (free tier available): https://web3.storage

## Steps
1. In `astrology-chart/`, install deps and build for IPFS:
   - npm install
   - npm run build:ipfs

2. Export your token and deploy:
   - export WEB3_STORAGE_TOKEN=YOUR_TOKEN
   - npm run deploy:ipfs

3. Output includes:
   - CID (ipfs://<CID>)
   - Gateway URL: https://w3s.link/ipfs/<CID>/

4. Test in browser:
   - Open the Gateway URL
   - Verify assets and routing work

## Notes
- Vite base is relative when VITE_IPFS=true, so assets resolve under ipfs/<CID>/
- For custom name: set DNSLink (dnslink=/ipfs/<CID>) or ENS contenthash to the CID
- Each deploy is immutable; update DNSLink/ENS to point to a new CID for updates
