export default function Steps() {
  const steps = [
    { title: 'Upload', desc: 'Drag-and-drop your paper or dataset. We hash it locally.' },
    { title: 'Verify', desc: 'Submit to blockchain for immutable timestamp and provenance.' },
    { title: 'Explore', desc: 'Share, cite, and discover verifiable research artifacts.' },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {steps.map((s, i) => (
        <div key={s.title} className="glass rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <span className="h-6 w-6 rounded-lg gradient-primary" />
            <span className="font-semibold">{i+1}. {s.title}</span>
          </div>
          <div className="mt-2 text-sm text-white/70">{s.desc}</div>
        </div>
      ))}
    </div>
  )
}