import { motion } from 'framer-motion'

const items = ['Ethereum', 'IPFS', 'Arweave', 'The Graph', 'Polygon', 'Filecoin']

export default function LogosMarquee() {
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden border border-white/10 rounded-2xl">
      <motion.div
        className="flex items-center gap-8 whitespace-nowrap px-6 py-4"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        style={{ width: 'max-content' }}
      >
        {row.map((name, idx) => (
          <div key={idx} className="flex items-center gap-2 text-white/70">
            <span className="h-6 w-6 rounded-lg gradient-primary" />
            <span className="text-sm">{name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}