import { useState, useRef } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'

export default function Upload() {
  const [file, setFile] = useState(null)
  const inputRef = useRef(null)

  const onDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) setFile(f)
  }

  const onChange = (e) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  const onSubmit = () => {
    if (!file) return
    alert(`Submitting ${file.name} to blockchain…`)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <h2 className="text-xl font-semibold">Upload Research</h2>
        <p className="text-white/70 text-sm mt-1">Drag & drop your paper or dataset. Supported: PDF, CSV, ZIP.</p>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className="mt-5 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/15 rounded-2xl p-10 text-center hover:border-white/25 transition-colors cursor-pointer"
        >
          <div className="h-14 w-14 rounded-2xl gradient-primary" />
          <div className="text-white/80">Drag files here or click to browse</div>
          <input ref={inputRef} type="file" className="hidden" onChange={onChange} />
        </div>
        {file && (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-4">
              <div className="text-sm text-white/70">File</div>
              <div className="font-medium">{file.name}</div>
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="text-sm text-white/70">Size</div>
              <div className="font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
          </div>
        )}
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={() => setFile(null)}>Clear</Button>
          <Button onClick={onSubmit} disabled={!file}>Submit to Blockchain</Button>
        </div>
      </Card>
    </div>
  )
}