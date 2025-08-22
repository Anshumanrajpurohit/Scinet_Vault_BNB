import { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'

const mock = Array.from({ length: 8 }).map((_, i) => ({
  id: i+1,
  title: `Open Research Paper ${i+1}`,
  authors: 'Doe et al.',
  tags: ['AI', 'Biology', 'Data'],
  verified: i % 2 === 0,
}))

export default function Explorer() {
  const [query, setQuery] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const results = mock.filter(item => {
    const matches = item.title.toLowerCase().includes(query.toLowerCase())
    const pass = verifiedOnly ? item.verified : true
    return matches && pass
  })

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search research..."
          className="w-full md:flex-1 rounded-2xl bg-neutral-900/70 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
        <label className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
          <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
          Verified only
        </label>
        <Button className="md:w-auto">Search</Button>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {results.map(item => (
          <Card key={item.id}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-white/70">{item.authors}</div>
              </div>
              <span className={item.verified ? 'text-green-400 text-xs' : 'text-white/50 text-xs'}>
                {item.verified ? 'Verified' : 'Unverified'}
              </span>
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              {item.tags.map(t => (
                <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10">{t}</span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm">View</Button>
              <Button size="sm" variant="secondary">Cite</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}