import { motion } from 'framer-motion'

export default function ProgressBar({ value = 0, className = '' }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={["w-full h-3 rounded-full bg-white/10 overflow-hidden", className].join(' ')}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="h-full gradient-primary rounded-full"
      />
    </div>
  )
}