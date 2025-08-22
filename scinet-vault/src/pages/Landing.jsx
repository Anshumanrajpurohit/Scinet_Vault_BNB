import { motion } from 'framer-motion'
import Button from '../components/Button'
import FeatureCard from '../components/FeatureCard'
import Steps from '../components/Steps'
import LogosMarquee from '../components/LogosMarquee'
import CTABanner from '../components/CTABanner'
import ResearchMiniCard from '../components/ResearchMiniCard'

export default function Landing() {
  const trending = Array.from({ length: 6 }).map((_, i) => ({
    id: i+1,
    title: `Verifiable Paper ${i+1}`,
    authors: 'Lee et al.',
    verified: i % 2 === 0,
  }))

  return (
    <div className="relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8 lg:px-12 py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 mb-6">
          <span className="h-2 w-2 rounded-full bg-green-400" /> Live on-chain verification
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
          The trust layer for open research.
        </h1>
        <p className="mt-4 text-white/80 max-w-2xl mx-auto">
          Upload, verify, and access papers and datasets with cryptographic provenance. Built for researchers, powered by Web3.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button size="lg" className="">Get Started</Button>
          <Button variant="secondary" size="lg">Explore Research</Button>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          {[
            ['3,200+', 'Verified Papers'],
            ['1,150+', 'Datasets'],
            ['12', 'Active DAOs'],
            ['~0.02', 'Avg Gas (USD)'],
          ].map(([stat, label]) => (
            <div key={label} className="card-surface p-4">
              <div className="text-2xl font-semibold">{stat}</div>
              <div className="text-white/70 text-sm">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-left">
          <h2 className="text-xl font-semibold">Why SciNet Vault</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <FeatureCard icon="🔗" title="On-chain Provenance" description="Immutable timestamps and signatures ensure authenticity." />
            <FeatureCard icon="🧪" title="Reproducibility" description="Datasets linked to code and versions for transparent reuse." />
            <FeatureCard icon="🛡️" title="Trust & Governance" description="DAO-driven reviews and funding power community science." />
          </div>
        </div>

        <div className="mt-14 text-left">
          <h2 className="text-xl font-semibold">How it works</h2>
          <div className="mt-4">
            <Steps />
          </div>
        </div>

        <div className="mt-14 text-left">
          <h2 className="text-xl font-semibold">Trending research</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {trending.map(t => (
              <ResearchMiniCard key={t.id} title={t.title} authors={t.authors} verified={t.verified} />
            ))}
          </div>
        </div>

        <div className="mt-14">
          <LogosMarquee />
        </div>

        <div className="mt-14">
          <CTABanner />
        </div>
      </div>
    </div>
  )
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <motion.div
        aria-hidden
        className="absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle at center, #C3339F, transparent 60%)' }}
        animate={{ x: [0, 20, -10, 0], y: [0, -10, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle at center, #7A28CB, transparent 60%)' }}
        animate={{ x: [0, -15, 10, 0], y: [0, 10, -10, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(1000px_400px_at_50%_-20%,rgba(255,255,255,0.06),transparent)]" />
    </div>
  )
}