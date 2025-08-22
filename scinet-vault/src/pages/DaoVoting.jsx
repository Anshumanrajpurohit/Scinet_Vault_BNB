import Card from '../components/Card'
import Button from '../components/Button'
import ProgressBar from '../components/ProgressBar'

const proposals = [
  { id: 1, title: 'Fund Open Dataset for Cancer Research', yes: 68, no: 12, end: '2d 4h' },
  { id: 2, title: 'Integrate Arweave Storage Layer', yes: 54, no: 22, end: '18h' },
  { id: 3, title: 'Grant for Reproducibility Audits', yes: 71, no: 9, end: '4d' },
]

export default function DaoVoting() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Governance</h2>
        <Button>New Proposal</Button>
      </div>
      <div className="mt-5 space-y-4">
        {proposals.map(p => (
          <Card key={p.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-white/60">Ends in {p.end}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm">Vote Yes</Button>
                <Button size="sm" variant="secondary">Vote No</Button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>Yes</span>
                  <span>{p.yes}%</span>
                </div>
                <ProgressBar value={p.yes} className="mt-1" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>No</span>
                  <span>{p.no}%</span>
                </div>
                <ProgressBar value={p.no} className="mt-1" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}