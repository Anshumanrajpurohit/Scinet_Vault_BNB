import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

export default function AnimatedCounter({ to = 0, prefix = '', suffix = '' }) {
  const value = useMotionValue(0)
  const rounded = useTransform(value, latest => Math.round(latest))

  useEffect(() => {
    const controls = animate(value, to, { duration: 1.2, ease: 'easeOut' })
    return controls.stop
  }, [to])

  return (
    <motion.span>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  )
}