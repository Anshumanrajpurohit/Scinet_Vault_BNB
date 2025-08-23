import React, { useState } from 'react'

export default function Analyzer() {
  const [sourceType, setSourceType] = useState('text')
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [style, setStyle] = useState('bullets')
  const [maxPoints, setMaxPoints] = useState(6)
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState('')
  const [error, setError] = useState('')

  const toBase64 = (f) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result || '').toString().split(',').pop())
    reader.onerror = reject
    reader.readAsDataURL(f)
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSummary(''); setLoading(true)
    try {
      let payload = { sourceType, data: '', options: { summaryStyle: style, maxPoints: Number(maxPoints) || 6, maxChars: 50_000 } }
      if (sourceType === 'pdf') {
        if (!file) throw new Error('Select a PDF file')
        const b64 = await toBase64(file)
        payload.data = b64
      } else {
        if (!text.trim()) throw new Error('Enter some text')
        payload.data = text
      }
      const res = await fetch('/api/analyze/summarize-base64', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error?.message || 'Request failed')
      setSummary(json.summary || '')
    } catch (err) {
      setError(err.message || 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-transparent py-8 text-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-4">Analyzer</h1>
        <form onSubmit={onSubmit} className="space-y-4 glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="radio" value="text" checked={sourceType==='text'} onChange={()=>setSourceType('text')} /> Text</label>
            <label className="flex items-center gap-2"><input type="radio" value="pdf" checked={sourceType==='pdf'} onChange={()=>setSourceType('pdf')} /> PDF</label>
          </div>
          {sourceType === 'pdf' ? (
            <div>
              <input type="file" accept="application/pdf" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
            </div>
          ) : (
            <div>
              <textarea className="w-full px-3 py-2 rounded bg-transparent backdrop-blur border border-white/10" rows={10} value={text} onChange={(e)=>setText(e.target.value)} placeholder="Paste text here..." />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Style</label>
              <select className="w-full px-3 py-2 rounded bg-transparent backdrop-blur border border-white/10" value={style} onChange={(e)=>setStyle(e.target.value)}>
                <option value="bullets">Bullets</option>
                <option value="paragraph">Paragraph</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Max points</label>
              <input type="number" className="w-full px-3 py-2 rounded bg-transparent backdrop-blur border border-white/10" value={maxPoints} onChange={(e)=>setMaxPoints(e.target.value)} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary text-white px-6 py-2 rounded-lg">{loading? 'Summarizing...' : 'Summarize'}</button>
        </form>
        {error && <div className="mt-4 text-red-400">{error}</div>}
        {summary && (
          <div className="mt-6 glass-card p-6 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Summary</h2>
              <button onClick={()=>navigator.clipboard.writeText(summary)} className="btn-secondary px-3 py-1 rounded">Copy</button>
            </div>
            <pre className="whitespace-pre-wrap text-sm">{summary}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
