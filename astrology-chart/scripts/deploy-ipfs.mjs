#!/usr/bin/env node
/*
  Deploy astrology-chart/dist to IPFS via web3.storage
  Usage:
    export WEB3_STORAGE_TOKEN=<token>
    node ./scripts/deploy-ipfs.mjs [name]
*/
import { Web3Storage, getFilesFromPath } from 'web3.storage'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function main() {
  const token = process.env.WEB3_STORAGE_TOKEN
  if (!token) {
    console.error('Missing WEB3_STORAGE_TOKEN env var. Get one at https://web3.storage')
    process.exit(1)
  }
  const nameArg = process.argv[2] || `astrology-chart-${new Date().toISOString()}`
  const distPath = resolve(__dirname, '..', 'dist')
  if (!fs.existsSync(distPath)) {
    console.error(`dist folder not found at ${distPath}. Run: npm run build:ipfs`)
    process.exit(1)
  }
  const client = new Web3Storage({ token })
  const files = await getFilesFromPath(distPath)
  console.log(`Uploading ${files.length} files from ${distPath} to web3.storage...`)
  const cid = await client.put(files, { name: nameArg, wrapWithDirectory: false, maxRetries: 3 })

  // Persist CID for follow-up scripts
  const cidFile = resolve(distPath, '.cid')
  fs.writeFileSync(cidFile, cid, 'utf8')

  const gateways = [
    `https://w3s.link/ipfs/${cid}/`,
    `https://dweb.link/ipfs/${cid}/`,
    `https://cloudflare-ipfs.com/ipfs/${cid}/`,
  ]
  console.log('\nSuccessfully uploaded!')
  console.log('CID: ', cid)
  console.log('Gateways:')
  for (const g of gateways) console.log('  -', g)
  console.log('\nTip: If using ENS/DNSLink, set contenthash/DNSLink to this CID.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
