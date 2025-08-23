import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import SuiTokenABI from '../abi/SuiTokenABI.json'
import { useAuth } from '../App'
import { useToken } from '../context/TokenContext'

// BNB Testnet SUI token contract (provided)
const SUI_CONTRACT = '0xd9145CCE52D386f254917e481eB44e9943F39138'
const BNB_TESTNET_CHAIN_ID = 97
const USD_TO_SUI = 50 // 1 USD = 50 SUI

const formatAddress = (addr) => addr ? `${addr.slice(0,6)}...${addr.slice(-4)}` : ''

export default function SuiDashboard() {
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  // chainId comes from TokenContext
  const { chainId, bnbBalance, suiBalance, decimals, symbol, refresh } = useToken()
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [error, setError] = useState('')
  const [usd, setUsd] = useState('')
  const { isConnected, walletAddress } = useAuth()

  const networkLabel = useMemo(() => {
    if (!chainId) return '-'
    switch (Number(chainId)) {
      case 97: return 'BNB Testnet (97)'
      case 56: return 'BNB Mainnet (56)'
      case 1: return 'Ethereum Mainnet (1)'
      case 137: return 'Polygon (137)'
      default: return `Chain ${chainId}`
    }
  }, [chainId])

  const readContract = useMemo(() => {
    if (!provider) return null
    try { return new ethers.Contract(SUI_CONTRACT, SuiTokenABI, provider) } catch { return null }
  }, [provider])

  // Initialize provider from MetaMask
  useEffect(() => {
    // Prefer injected provider; fall back to public BNB Testnet RPC for read-only balance queries
    let p
    if (typeof window !== 'undefined' && window.ethereum) {
      p = new ethers.BrowserProvider(window.ethereum)
    } else {
      p = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/')
    }
    setProvider(p)
    // reflect network changes
    const onChainChanged = () => setTimeout(() => ensureChain().catch(() => {}), 100)
    window.ethereum.on?.('chainChanged', onChainChanged)
    const onUpdated = () => { if (walletAddress) refreshBalances(walletAddress) }
    const onAccountsChanged = () => { if (walletAddress) refreshBalances(walletAddress) }
    window.addEventListener('sui:balance-updated', onUpdated)
    window.ethereum?.on?.('accountsChanged', onAccountsChanged)
    return () => {
      window.ethereum?.removeListener?.('chainChanged', onChainChanged)
      window.ethereum?.removeListener?.('accountsChanged', onAccountsChanged)
      window.removeEventListener('sui:balance-updated', onUpdated)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ensureChain = useCallback(async () => {
    if (!provider) return
    const net = await provider.getNetwork()
    const cid = Number(net.chainId)
    // Don't set chainId here; TokenContext.refresh handles it.
    if (cid !== BNB_TESTNET_CHAIN_ID && window.ethereum?.request) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x61' }], // 97
        })
      } catch (e) {
        // If not added
        if (e?.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x61',
                chainName: 'BNB Smart Chain Testnet',
                nativeCurrency: { name: 'BNB', symbol: 'tBNB', decimals: 18 },
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                blockExplorerUrls: ['https://testnet.bscscan.com/'],
              }],
            })
          } catch {}
        }
      }
    }
  }, [provider])

  const refreshBalances = useCallback(async (addr) => {
    if (!provider || !addr) return
    await refresh(provider, addr)
  }, [provider, refresh])

  // refresh balances when global wallet changes
  useEffect(() => {
    if (!provider) return
    // Always set chainId/symbol; balances will populate when walletAddress is known
    refresh(provider, walletAddress).catch?.(() => {})
    if (!walletAddress) return
    ensureChain().catch(() => {}).then(() => refreshBalances(walletAddress))
  }, [walletAddress, provider, ensureChain, refreshBalances, refresh])

  // Upload reward removed from dashboard; reward is triggered by Upload page

  const buyNow = useCallback(async () => {
    if (!provider || !walletAddress) return
    const usdNum = Number(usd)
    if (!Number.isFinite(usdNum) || usdNum < 1) { setError('Enter at least 1 USD'); return }
    const suiAmount = usdNum * USD_TO_SUI
    setLoading(true); setError(''); setTxHash('')
    try {
      const s = await provider.getSigner()
      setSigner(s)
      const writeContract = new ethers.Contract(SUI_CONTRACT, SuiTokenABI, s)
      const amount = ethers.parseUnits(String(suiAmount), decimals)
      const tx = await writeContract.mint(walletAddress, amount)
      const rec = await tx.wait()
      setTxHash(rec?.hash || tx?.hash || '')
      // optimistic UI update immediately
      try { window.dispatchEvent(new CustomEvent('sui:balance-bump', { detail: { delta: Number(suiAmount) } })) } catch {}
      try { window.dispatchEvent(new CustomEvent('sui:balance-updated', { detail: { reason: 'buy' } })) } catch {}
      await refreshBalances(walletAddress)
    } catch (e) {
      setError(e?.reason || e?.message || 'Purchase failed')
    } finally {
      setLoading(false)
    }
  }, [provider, walletAddress, usd, decimals, refreshBalances])

  const suiFromUsd = useMemo(() => {
    const u = Number(usd)
    if (!Number.isFinite(u) || u <= 0) return 0
    return u * USD_TO_SUI
  }, [usd])

  // Refresh on tab focus
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        if (provider) refresh(provider, walletAddress)
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [provider, walletAddress, refresh])

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100">SUI Dashboard</h1>
        <div className="text-sm text-gray-300">
          {isConnected && walletAddress ? `Wallet: ${formatAddress(walletAddress)}` : 'Connect wallet from the top-right'}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-500/10 text-red-300 border border-red-500/30">{error}</div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Panel */}
        <div className="md:col-span-1 glass-card border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-100">Wallet</h2>
            <button
              onClick={() => provider && refresh(provider, walletAddress)}
              className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-200"
            >Refresh</button>
          </div>
          <div className="text-sm text-gray-400">Network: {networkLabel} {chainId && chainId!==BNB_TESTNET_CHAIN_ID && '(switch to BNB Testnet)'}</div>
          <div className="mt-3 text-sm">
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-300">BNB</span>
              <span className="font-mono">{bnbBalance}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-300">{symbol}</span>
              <span className="font-mono">{suiBalance}</span>
            </div>
          </div>
        </div>
        {/* (Upload panel removed — rewards happen after real Upload) */}
        {/* Purchase Panel */}
        <div className="glass-card border border-white/10 rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-gray-100 mb-3">Buy SUI</h2>
          <label className="block text-sm text-gray-300 mb-1">USD Amount</label>
          <input
            type="number"
            min={1}
            value={usd}
            onChange={(e) => setUsd(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-transparent border border-white/10 text-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter USD"
          />
          <div className="mt-2 text-sm text-gray-400">You will receive: <span className="text-gray-200 font-semibold">{suiFromUsd} {symbol}</span></div>
          <button
            onClick={buyNow}
            className="w-full mt-4 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60"
            disabled={!walletAddress || loading || Number(usd) < 1}
          >
            {loading ? 'Buying…' : 'Buy Now'}
          </button>
          {txHash && (
            <div className="mt-3 text-xs text-gray-400 break-all">Tx: {txHash}</div>
          )}
        </div>
      </div>
    </div>
  )
}
