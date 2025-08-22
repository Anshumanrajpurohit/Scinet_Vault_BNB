import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [ -50, 50 ], [ 8, -8 ]), { stiffness: 200, damping: 20 })
  const ry = useSpring(useTransform(x, [ -50, 50 ], [ -8, 8 ]), { stiffness: 200, damping: 20 })

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = e.clientX - (rect.left + rect.width / 2)
    const py = e.clientY - (rect.top + rect.height / 2)
    x.set(Math.max(-50, Math.min(50, px / 4)))
    y.set(Math.max(-50, Math.min(50, py / 4)))
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transformStyle: 'preserve-3d', perspective: 800, rotateX: rx, rotateY: ry }}
      className={className}
    >
      {children}
    </motion.div>
  )
}