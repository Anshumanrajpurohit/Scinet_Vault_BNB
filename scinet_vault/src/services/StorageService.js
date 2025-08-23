// BNB Greenfield storage service
// Uploads a JSON manifest to a Greenfield bucket on dCellar testnet.
// Requires browser wallet (MetaMask) for EVM signing.

import { Client } from '@bnb-chain/greenfield-js-sdk'

const GNFD_ENDPOINT = import.meta.env.VITE_GNFD_ENDPOINT || 'https://scinetvault.gnfd-testnet-sp1.bnbchain.org/'
const GREENFIELD_CHAIN_ID = Number(import.meta.env.VITE_GNFD_CHAIN_ID || 5600) // Greenfield testnet chain-id
const BUCKET_NAME = import.meta.env.VITE_GNFD_BUCKET || ''

async function getEvmSigner() {
  if (typeof window === 'undefined') return null
  const { ethereum } = window
  if (!ethereum?.request) return null
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
  const account = accounts?.[0]
  if (!account) return null
  // greenfield-js-sdk accepts an EVM signer object with request method
  return {
    getAddress: async () => account,
    request: ethereum.request.bind(ethereum),
  }
}

function toObjectKey(prefix) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix || 'manifest'}/${ts}-${rand}.json`
}

export const StorageService = {
  /**
   * Upload arbitrary JSON to Greenfield as a new object in the configured bucket.
   * Returns a reference with bucket and object key.
   */
  async put(data, opts = {}) {
    if (!BUCKET_NAME) {
      console.warn('VITE_GNFD_BUCKET not set; returning local placeholder id')
      const cid = 'local-' + Math.random().toString(36).slice(2, 8)
      return { cid, provider: 'none' }
    }

  // Initialize client
  const client = Client.create(GNFD_ENDPOINT, String(GREENFIELD_CHAIN_ID))

    const signer = await getEvmSigner()
    if (!signer) {
      console.warn('No EVM signer available; ensure MetaMask is installed and connected.')
      const cid = 'local-' + Math.random().toString(36).slice(2, 8)
      return { cid, provider: 'none' }
    }

    const objectKey = opts.objectKey || toObjectKey(opts.prefix)

    // Resolve SP endpoint/address
    let endpoint = ''
    let spAddress = ''
    try {
      endpoint = await client.sp.getSPUrlByBucket(BUCKET_NAME)
      try {
        const spInfo = await client.sp.getInServiceSP()
        spAddress = spInfo?.operatorAddress || spInfo?.OperatorAddress || spInfo?.operator || ''
      } catch {}
    } catch (e) {
      console.warn('Failed to resolve SP by bucket', e)
      try {
        const spInfo = await client.sp.getInServiceSP()
        const spId = spInfo?.id || spInfo?.Id || spInfo?.primarySpId || spInfo?.PrimarySpId
        endpoint = spId ? await client.sp.getSPUrlById(spId) : ''
        spAddress = spInfo?.operatorAddress || spInfo?.OperatorAddress || spInfo?.operator || ''
      } catch (e2) {
        console.warn('Failed to resolve SP endpoint from in-service SP as well', e2)
      }
    }

    if (!endpoint) {
      const cid = 'local-' + Math.random().toString(36).slice(2, 8)
      console.warn('No SP endpoint resolved; cannot upload')
      return { cid, provider: 'none' }
    }

    // Prepare offchain auth with SP
    const userAddress = await signer.getAddress()
    const chainHex = await (window?.ethereum?.request?.({ method: 'eth_chainId' }) ?? null)
    let currentChainId = GREENFIELD_CHAIN_ID
    if (typeof chainHex === 'string') {
      try { currentChainId = parseInt(chainHex, 16) } catch {}
    }
    const domain = window.location.host
    const sps = [{ address: spAddress || userAddress, endpoint }]

    const offchain = await client.offchainauth.genOffChainAuthKeyPairAndUpload({
      sps,
      address: userAddress,
      domain,
      expirationMs: 60 * 60 * 1000,
      chainId: currentChainId,
    }, signer.request)

    if (offchain?.code !== 200 || !offchain?.body?.seedString) {
      const cid = 'local-' + Math.random().toString(36).slice(2, 8)
      console.warn('Failed to setup offchain auth with SP', offchain)
      return { cid, provider: 'none' }
    }

    const authType = {
      type: 'EDDSA',
      seed: offchain.body.seedString,
      domain,
      address: userAddress,
    }

    const body = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })

    // Delegate upload
    const result = await client.object.delegateUploadObject({
      bucketName: BUCKET_NAME,
      objectName: objectKey,
      body,
      endpoint,
      contentType: 'application/json',
      delegatedOpts: { visibility: 1 },
    }, authType)

    if (result?.code !== 200) {
      const cid = 'local-' + Math.random().toString(36).slice(2, 8)
      console.warn('Delegated upload failed', result)
      return { cid, provider: 'none' }
    }

    return {
      provider: 'greenfield',
      bucket: BUCKET_NAME,
      key: objectKey,
      url: `https://dcellar-testnet.bnbchain.org/view/${BUCKET_NAME}/${objectKey}`,
    }
  },

  // NOTE: Direct read requires proper auth/signature depending on bucket policy.
  async get(ref) {
    return { ref, data: null }
  },
}
