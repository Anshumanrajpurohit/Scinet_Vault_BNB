import Button from './Button'

export default function CTABanner() {
  return (
    <div className="rounded-2xl p-6 md:p-8 gradient-primary text-white shadow-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xl md:text-2xl font-semibold">Start verifying your research today</div>
          <div className="text-white/90 text-sm mt-1">Secure provenance, easier collaboration, trusted science.</div>
        </div>
        <Button variant="secondary" className="bg-white/15 hover:bg-white/25 border-white/30">Upload Now</Button>
      </div>
    </div>
  )
}