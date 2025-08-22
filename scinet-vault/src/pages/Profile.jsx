import Card from '../components/Card'

export default function Profile() {
  const account = typeof window !== 'undefined' && window.ethereum?.selectedAddress
  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <h3 className="text-lg font-semibold">Profile</h3>
          <div className="mt-3 text-sm text-white/80">
            <div><span className="text-white/60">Wallet:</span> {account ? account : 'Not connected'}</div>
            <div className="mt-2"><span className="text-white/60">ORCID:</span> 0000-0002-1825-0097</div>
          </div>
        </Card>
        <Card className="md:col-span-2">
          <h3 className="text-lg font-semibold">Badges</h3>
          <div className="mt-3 flex gap-3 flex-wrap">
            {['Peer Reviewer','Data Steward','Reproducible'].map(b => (
              <div key={b} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm">{b}</div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <h3 className="text-lg font-semibold">Contributions</h3>
          <div className="mt-4 space-y-3 text-sm text-white/80">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center justify-between">
                <span>Published: Paper #{i}</span>
                <span className="text-white/50">Mar 2025</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}