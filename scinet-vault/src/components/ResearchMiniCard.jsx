import Card from './Card'

export default function ResearchMiniCard({ title, authors, verified }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold leading-snug">{title}</div>
          <div className="text-xs text-white/70">{authors}</div>
        </div>
        <span className={verified ? 'text-green-400 text-[10px]' : 'text-white/50 text-[10px]'}>
          {verified ? 'Verified' : 'Unverified'}
        </span>
      </div>
    </Card>
  )
}