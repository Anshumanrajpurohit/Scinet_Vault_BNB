import Card from '../components/Card'
import Button from '../components/Button'

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold">12</div>
              <div className="text-white/70 text-sm">Your Papers</div>
            </div>
            <div className="h-10 w-10 rounded-xl gradient-primary" />
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm">New Paper</Button>
            <Button size="sm" variant="secondary">View All</Button>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold">8</div>
              <div className="text-white/70 text-sm">Your Datasets</div>
            </div>
            <div className="h-10 w-10 rounded-xl" style={{ background: 'linear-gradient(135deg,#7A28CB,#FC60A8)' }} />
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm">Upload Dataset</Button>
            <Button size="sm" variant="secondary">View All</Button>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-semibold">4</div>
              <div className="text-white/70 text-sm">Open Reviews</div>
            </div>
            <div className="h-10 w-10 rounded-xl" style={{ background: 'linear-gradient(135deg,#C3339F,#7A28CB)' }} />
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm">Review Now</Button>
            <Button size="sm" variant="secondary">See Queue</Button>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <Button variant="ghost" size="sm">View all</Button>
          </div>
          <div className="mt-4 space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center justify-between text-sm text-white/80">
                <span>Paper #{i} verified on-chain</span>
                <span className="text-white/50">2h ago</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button variant="secondary">Import ORCID</Button>
            <Button variant="secondary">Link GitHub</Button>
            <Button>New Proposal</Button>
            <Button>Join DAO</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}