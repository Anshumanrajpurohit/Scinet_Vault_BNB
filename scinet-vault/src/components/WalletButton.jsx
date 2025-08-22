import { useEffect, useState } from 'react'
import Button from './Button'

export default function WalletButton({ onChange }) {
  const [account, setAccount] = useState('')
  const [loading, setLoading] = useState(false)
  const hasEthereum = typeof window !== 'undefined' && window.ethereum

  useEffect(() => {
    async function init() {
      if (!hasEthereum) return
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts && accounts[0]) {
          setAccount(accounts[0])
          onChange?.(accounts[0])
        }
      } catch {}
      window.ethereum.on?.('accountsChanged', (accs) => {
        const next = accs && accs[0] ? accs[0] : ''
        setAccount(next)
        onChange?.(next)
      })
    }
    init()
    return () => {
      window.ethereum?.removeAllListeners?.('accountsChanged')
    }
  }, [hasEthereum, onChange])

  const connect = async () => {
    if (!hasEthereum) {
      alert('MetaMask is required to connect a wallet.')
      return
    }
    setLoading(true)
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts && accounts[0]) {
        setAccount(accounts[0])
        onChange?.(accounts[0])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const short = account ? `${account.slice(0, 6)}…${account.slice(-4)}` : ''

  if (account) {
    return (
      <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(account)}>
        {short}
      </Button>
    )
  }

  return (
    <Button size="sm" onClick={connect} disabled={loading}>
      {loading ? 'Connecting…' : 'Connect Wallet'}
    </Button>
  )
}