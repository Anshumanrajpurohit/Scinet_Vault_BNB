import { forwardRef } from 'react'
import { motion } from 'framer-motion'

const base = 'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed'

const variants = {
  primary: 'gradient-primary text-white shadow-lg shadow-pink-500/10 hover:brightness-110',
  secondary: 'bg-neutral-900/70 border border-white/10 text-white hover:bg-neutral-800',
  ghost: 'bg-transparent text-white hover:bg-white/5',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

const MotionButton = motion.button

const Button = forwardRef(function Button({ children, variant = 'primary', size = 'md', className = '', ...props }, ref) {
  const classes = [base, variants[variant], sizes[size], className].filter(Boolean).join(' ')
  return (
    <MotionButton
      ref={ref}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      className={classes}
      {...props}
    >
      {children}
    </MotionButton>
  )
})

export default Button