import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'
import SuiTokenABI from '../abi/SuiTokenABI.json'

const SUI_CONTRACT = '0xd9145CCE52D386f254917e481eB44e9943F39138'

const TokenCtx = createContext(null)

export const TokenProvider = ({ children }) => {
  const [chainId, setChainId] = useState(undefined)
  const [bnbBalance, setBnb] = useState('0')
  const [suiBalance, setSui] = useState('0')
  const [decimals, setDecimals] = useState(18)
  const [symbol, setSymbol] = useState('SUI')

  const refresh = async (provider, address) => {
    if (!provider) return
    const net = await provider.getNetwork()
    setChainId(Number(net.chainId))
    // Native balance first (independent of token contract)
    if (address) {
      try {
        const wei = await provider.getBalance(address)
        setBnb(ethers.formatEther(wei))
      } catch {}
    }
    const read = new ethers.Contract(SUI_CONTRACT, SuiTokenABI, provider)
    try {
      // metadata (no address required)
      const dec = Number(await read.decimals?.()) || 18
      setDecimals(dec)
      const sym = await read.symbol?.()
      setSymbol(typeof sym === 'string' ? sym : 'SUI')
      if (address) {
        const bal = await read.balanceOf(address)
        setSui(ethers.formatUnits(bal, dec))
      }
    } catch {
      // ignore
    }
  }

  // Optimistic UI bump: listen for immediate balance adjustments
  useEffect(() => {
    const onBump = (e) => {
      const detail = e?.detail || {}
      if (detail.absolute != null) {
        setSui(String(detail.absolute))
        return
      }
      const delta = Number(detail.delta)
      if (!Number.isFinite(delta)) return
      setSui((prev) => {
        const cur = Number(prev || '0')
        const next = cur + delta
        return String(next)
      })
    }
    window.addEventListener('sui:balance-bump', onBump)
    return () => window.removeEventListener('sui:balance-bump', onBump)
  }, [])

  const value = useMemo(() => ({ chainId, bnbBalance, suiBalance, decimals, symbol, refresh }), [chainId, bnbBalance, suiBalance, decimals, symbol])
  return <TokenCtx.Provider value={value}>{children}</TokenCtx.Provider>
}

export const useToken = () => {
  const v = useContext(TokenCtx)
  if (!v) throw new Error('useToken must be used within TokenProvider')
  return v
}


