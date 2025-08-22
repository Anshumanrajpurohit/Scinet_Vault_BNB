import { motion } from 'framer-motion'

export default function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="card-surface p-5 md:p-6 h-full"
    >
      <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#C3339F,#7A28CB)' }}>
        <span className="text-sm">{icon}</span>
      </div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="mt-1 text-sm text-white/70">{description}</div>
    </motion.div>
  )
}