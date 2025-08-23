/* Express API for base64 summarization */
import express from 'express'
import pdf from 'pdf-parse'

const app = express()
const PORT = process.env.PORT || 8787
const MAX_BASE64_SIZE_BYTES = Number(process.env.MAX_BASE64_SIZE_BYTES || 20000000)
const LLM_PROVIDER = (process.env.LLM_PROVIDER || 'none').toLowerCase()
const LLM_MODEL = process.env.LLM_MODEL || (LLM_PROVIDER === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash')
const LLM_API_KEY = process.env.LLM_API_KEY || ''

app.use(express.json({ limit: Math.max(MAX_BASE64_SIZE_BYTES + 1024 * 1024, 5 * 1024 * 1024) }))

function newCorrelationId() {
  try { return crypto.randomUUID() } catch { return Date.now().toString(36) + Math.random().toString(36).slice(2) }
}

function normalizeWhitespace(str) {
  return (str || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ').replace(/\s+/g, ' ').trim()
}

function sentenceSplit(text) {
  return (text || '').split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean)
}

const STOPWORDS = new Set('a,an,and,are,as,at,be,by,for,from,has,he,in,is,it,its,of,on,that,the,to,was,were,will,with,or,if,then,than,this,these,those,which,who,whom,what,when,where,why,how,not,can,could,should,would,may,might,into,onto,about,above,below,between,over,under,again,further,here,there'.split(','))

function scoreSentences(sentences) {
  const freq = Object.create(null)
  for (const s of sentences) {
    for (const w of s.toLowerCase().match(/[a-z0-9]+/g) || []) {
      if (STOPWORDS.has(w)) continue
      freq[w] = (freq[w] || 0) + 1
    }
  }
  return sentences.map((s, idx) => {
    let score = 0
    for (const w of s.toLowerCase().match(/[a-z0-9]+/g) || []) {
      if (STOPWORDS.has(w)) continue
      score += freq[w] || 0
    }
    return { idx, s, score }
  })
}

function fallbackSummarize(text, { summaryStyle = 'bullets', maxPoints = 6 } = {}) {
  const sentences = sentenceSplit(text)
  if (sentences.length === 0) return { summary: '', tokensEstimated: 0 }
  const scored = scoreSentences(sentences)
  scored.sort((a, b) => b.score - a.score)
  if (summaryStyle === 'paragraph') {
    // Select ~5-7 best sentences, then trim to ~150 words
    const picked = scored.slice(0, 6).sort((a, b) => a.idx - b.idx).map(x => x.s)
    let paragraph = picked.join(' ')
    const words = paragraph.split(/\s+/)
    if (words.length > 160) paragraph = words.slice(0, 160).join(' ')
    return { summary: paragraph, tokensEstimated: Math.ceil(paragraph.length / 4) }
  }
  const n = Math.max(3, Math.min(maxPoints || 6, 10))
  const picked = scored.slice(0, n).sort((a, b) => a.idx - b.idx).map(x => `- ${x.s}`)
  const summary = picked.join('\n')
  return { summary, tokensEstimated: Math.ceil(summary.length / 4) }
}

async function callLLM(text, { summaryStyle = 'bullets', maxPoints = 6 } = {}, signal) {
  if (!LLM_API_KEY || LLM_PROVIDER === 'none') return fallbackSummarize(text, { summaryStyle, maxPoints })
  const sys = 'You are a concise academic summarizer. From the content, extract key concepts, definitions, formulas, and processes.'
  const style = summaryStyle === 'paragraph' ? 'a 100-150 word paragraph' : `${Math.max(3, Math.min(maxPoints || 6, 10))} bullet points`
  const user = `Summarize the following content clearly and non-redundantly. Output as ${style}. Content:\n\n${text}`

  if (LLM_PROVIDER === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${LLM_API_KEY}` },
      body: JSON.stringify({ model: LLM_MODEL, messages: [{ role: 'system', content: sys }, { role: 'user', content: user }], temperature: 0.2 }),
      signal,
    })
    if (!res.ok) throw new Error(`OpenAI error: ${res.status}`)
    const json = await res.json()
    const content = json?.choices?.[0]?.message?.content?.trim?.() || ''
    if (!content) throw new Error('Empty LLM response')
    return { summary: content, tokensEstimated: Math.ceil((text.length + content.length) / 4) }
  } else if (LLM_PROVIDER === 'gemini') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(LLM_MODEL)}:generateContent?key=${encodeURIComponent(LLM_API_KEY)}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `${sys}\n\n${user}` }] }] }),
      signal,
    })
    if (!res.ok) throw new Error(`Gemini error: ${res.status}`)
    const json = await res.json()
    const content = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim?.() || ''
    if (!content) throw new Error('Empty LLM response')
    return { summary: content, tokensEstimated: Math.ceil((text.length + content.length) / 4) }
  }
  return fallbackSummarize(text, { summaryStyle, maxPoints })
}

function error(code, message, status = 400) {
  const e = new Error(message)
  e.status = status
  e.code = code
  return e
}

app.post('/api/analyze/summarize-base64', async (req, res) => {
  const correlationId = newCorrelationId()
  const started = Date.now()
  console.log(`[${correlationId}] /summarize-base64 start`)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort('timeout'), 30_000)
  try {
    const { sourceType, data, options = {} } = req.body || {}
    if (!sourceType || (sourceType !== 'pdf' && sourceType !== 'text')) {
      throw error('INVALID_INPUT', 'sourceType must be "pdf" or "text"', 400)
    }
    if (typeof data !== 'string' || data.length === 0) {
      throw error('INVALID_INPUT', 'data must be a non-empty string', 400)
    }

    let content = ''
    if (sourceType === 'pdf') {
      // Check base64 size
      if (data.length > MAX_BASE64_SIZE_BYTES * 1.4) { // rough overhead factor
        throw error('PAYLOAD_TOO_LARGE', 'Base64 payload too large', 413)
      }
      let buf
      try {
        buf = Buffer.from(data, 'base64')
      } catch {
        throw error('INVALID_INPUT', 'Invalid base64 data', 400)
      }
      if (!buf || buf.length === 0) throw error('INVALID_INPUT', 'Empty decoded PDF buffer', 400)
      if (buf.length > MAX_BASE64_SIZE_BYTES) throw error('PAYLOAD_TOO_LARGE', 'Decoded payload too large', 413)
      const header = buf.subarray(0, 4).toString('ascii')
      if (header !== '%PDF') throw error('INVALID_INPUT', 'File is not a valid PDF (missing PDF header)', 400)
      let parsed
      try {
        parsed = await pdf(buf)
      } catch (e) {
        throw error('PDF_ERROR', 'Failed to parse PDF', 400)
      }
      content = normalizeWhitespace(parsed?.text || '')
      if (!content) throw error('INVALID_INPUT', 'PDF is encrypted or contains no extractable text', 400)
    } else if (sourceType === 'text') {
      content = normalizeWhitespace(data)
      if (!content) throw error('INVALID_INPUT', 'Empty text', 400)
      const maxChars = Math.min(Number(options?.maxChars || 50_000), 200_000)
      if (content.length > maxChars) content = content.slice(0, maxChars)
    }

    const { summaryStyle = 'bullets', maxPoints = 6 } = options || {}
    const result = await callLLM(content, { summaryStyle, maxPoints }, controller.signal)
    const resp = {
      summary: result.summary,
      tokensEstimated: result.tokensEstimated,
      meta: { charsProcessed: content.length, sourceType },
    }
    console.log(`[${correlationId}] done in ${Date.now() - started}ms`)
    res.json(resp)
  } catch (e) {
    const status = e.status || (e.message === 'timeout' ? 504 : 500)
    const code = e.code || (e.message === 'timeout' ? 'TIMEOUT' : 'INTERNAL_ERROR')
    if (code === 'TIMEOUT') console.warn(`[${correlationId}] timeout at 30s`)
    else console.warn(`[${correlationId}] error`, code, e?.message)
    res.status(status).json({ error: { code, message: e.message } })
  } finally {
    clearTimeout(timeout)
  }
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})

export default app
