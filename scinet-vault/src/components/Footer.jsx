import { NavLink } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-8">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <div className="h-6 w-6 rounded-lg gradient-primary" />
          <span>SciNet Vault • Decentralized Science</span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <a className="link-hover text-white/80" href="#about">About</a>
          <a className="link-hover text-white/80" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          <a className="link-hover text-white/80" href="#docs">Docs</a>
          <a className="link-hover text-white/80" href="#community">Community</a>
        </nav>
      </div>
    </footer>
  )
}