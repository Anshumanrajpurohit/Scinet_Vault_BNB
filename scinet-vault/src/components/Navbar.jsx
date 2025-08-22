import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import WalletButton from './WalletButton'

function Logo() {
  return (
    <NavLink to="/" className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-xl gradient-primary" />
      <span className="font-semibold tracking-tight">SciNet Vault</span>
    </NavLink>
  )
}

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) => [
      'px-3 py-2 rounded-xl transition-colors',
      isActive ? 'bg-white/10' : 'hover:bg-white/5',
    ].join(' ')}
  >
    {children}
  </NavLink>
)

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden md:flex items-center gap-2">
              <NavItem to="/dashboard">Dashboard</NavItem>
              <NavItem to="/upload">Upload</NavItem>
              <NavItem to="/explorer">Explorer</NavItem>
              <NavItem to="/dao">DAO</NavItem>
              <NavItem to="/profile">Profile</NavItem>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <WalletButton />
            <button className="md:hidden p-2 rounded-xl hover:bg-white/5" onClick={() => setOpen((v) => !v)}>
              <span className="sr-only">Toggle menu</span>
              <div className="w-5 h-5 grid gap-1.5">
                <span className="block h-0.5 bg-white rounded" />
                <span className="block h-0.5 bg-white rounded" />
                <span className="block h-0.5 bg-white rounded" />
              </div>
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="md:hidden pb-3 flex flex-col gap-1"
            >
              <NavItem to="/dashboard">Dashboard</NavItem>
              <NavItem to="/upload">Upload</NavItem>
              <NavItem to="/explorer">Explorer</NavItem>
              <NavItem to="/dao">DAO</NavItem>
              <NavItem to="/profile">Profile</NavItem>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}