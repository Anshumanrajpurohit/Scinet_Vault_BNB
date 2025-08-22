import { motion } from 'framer-motion'

export default function Card({ children, className = '', onClick }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={[
        'card-surface p-5 md:p-6',
        className,
      ].join(' ')}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}