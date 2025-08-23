/* Express API for base64 summarization */
import express from 'express'
// Import the internal implementation to avoid the package's CJS index debug block
import pdf from 'pdf-parse/lib/pdf-parse.js'

const app = express()
const PORT = process.env.PORT || 8787
const MAX_BASE64_SIZE_BYTES = Number(process.env.MAX_BASE64_SIZE_BYTES || 20000000)
const LLM_PROVIDER = (process.env.LLM_PROVIDER || 'none').toLowerCase()
const LLM_MODEL = process.env.LLM_MODEL || (LLM_PROVIDER === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash')
const LLM_API_KEY = process.env.LLM_API_KEY || ''

// Enhanced reproducibility scoring configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.LLM_API_KEY || ''
const REPRO_SCORE_PROVIDER = (process.env.REPRO_SCORE_PROVIDER || 'heuristic').toLowerCase()

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

// Enhanced reproducibility scoring endpoint
app.post('/api/analyze/reproducibility-score', async (req, res) => {
  const correlationId = newCorrelationId()
  const started = Date.now()
  console.log(`[${correlationId}] /reproducibility-score start`)
  
  try {
    const { manifest } = req.body || {}
    if (!manifest || typeof manifest !== 'object') {
      throw error('INVALID_INPUT', 'manifest must be a valid object', 400)
    }

    const analysis = await analyzeReproducibilityWithGemini(manifest, correlationId)
    
    const resp = {
      score: analysis.score,
      confidence: analysis.confidence,
      category: analysis.category,
      provider: analysis.provider,
      diagnostics: analysis.diagnostics,
      recommendations: analysis.recommendations,
      strengths: analysis.strengths,
      metadata: analysis.metadata,
      correlationId
    }
    
    console.log(`[${correlationId}] reproducibility analysis completed in ${Date.now() - started}ms - score: ${analysis.score}`)
    res.json(resp)
  } catch (e) {
    const status = e.status || 500
    const code = e.code || 'ANALYSIS_ERROR'
    console.warn(`[${correlationId}] reproducibility error`, code, e?.message)
    res.status(status).json({ error: { code, message: e.message }, correlationId })
  }
})

async function analyzeReproducibilityWithGemini(manifest, correlationId) {
  // Try Gemini AI-powered analysis first
  if (REPRO_SCORE_PROVIDER === 'gemini' && GEMINI_API_KEY) {
    try {
      console.log(`[${correlationId}] Using Gemini for reproducibility analysis`)
      return await geminiAnalyzeManifest(manifest)
    } catch (error) {
      console.warn(`[${correlationId}] Gemini analysis failed, falling back to heuristic:`, error.message)
    }
  }
  
  console.log(`[${correlationId}] Using heuristic reproducibility analysis`)
  return heuristicAnalyzeManifest(manifest)
}

async function geminiAnalyzeManifest(manifest = {}) {
  const { title, description, authors, category, type, tags, files = [] } = manifest
  
  // Prepare context for Gemini analysis
  const researchContext = {
    title: title || 'Untitled Research',
    description: description || 'No description provided',
    authors: Array.isArray(authors) ? authors : [],
    category: category || 'Unknown',
    type: type || 'paper',
    tags: Array.isArray(tags) ? tags : [],
    fileList: files.map(f => ({
      name: f.name || 'unnamed',
      size: f.size || 0,
      type: inferFileType(f.name || '')
    }))
  }

  const prompt = buildGeminiPrompt(researchContext)
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1000,
        }
      })
    }
  )

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  const result = data?.candidates?.[0]?.content?.parts?.[0]?.text
  
  if (!result) {
    throw new Error('Empty response from Gemini')
  }

  return parseGeminiResponse(result, researchContext)
}

function buildGeminiPrompt(context) {
  return `You are an expert in research reproducibility assessment. Analyze this research submission and provide a reproducibility score (0-100) with detailed diagnostics.

Research Details:
- Title: ${context.title}
- Description: ${context.description}
- Category: ${context.category}
- Type: ${context.type}
- Authors: ${context.authors.join(', ') || 'None specified'}
- Tags: ${context.tags.join(', ') || 'None'}

Files Included:
${context.fileList.map(f => `- ${f.name} (${f.size} bytes, type: ${f.type})`).join('\n')}

Evaluate based on:
1. Documentation Quality (README, clear descriptions)
2. Code/Data Availability (source files, datasets)
3. Environment Specification (dependencies, requirements files)
4. Testing & Validation (test files, validation scripts)
5. Licensing & Legal (proper licensing)
6. Metadata Completeness (authors, descriptions, tags)
7. File Organization (logical structure)
8. Version Control Indicators (git files, changelog)

Respond in this exact JSON format:
{
  "score": [0-100 integer],
  "confidence": [0-100 integer],
  "category": "excellent|good|fair|poor",
  "diagnostics": [
    "specific finding 1",
    "specific finding 2"
  ],
  "recommendations": [
    "actionable improvement 1", 
    "actionable improvement 2"
  ],
  "strengths": [
    "positive aspect 1",
    "positive aspect 2"
  ]
}`
}

function parseGeminiResponse(response, context) {
  try {
    // Extract JSON from response (handle cases where Gemini adds extra text)
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }
    
    const analysis = JSON.parse(jsonMatch[0])
    
    // Validate and sanitize the response
    const score = Math.max(0, Math.min(100, parseInt(analysis.score) || 0))
    const confidence = Math.max(0, Math.min(100, parseInt(analysis.confidence) || 75))
    
    return {
      score,
      confidence,
      category: analysis.category || 'unknown',
      diagnostics: Array.isArray(analysis.diagnostics) ? analysis.diagnostics : ['Gemini analysis completed'],
      recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : [],
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
      provider: 'gemini',
      metadata: {
        fileCount: context.fileList.length,
        hasDocumentation: context.fileList.some(f => f.type === 'documentation'),
        hasCode: context.fileList.some(f => f.type === 'code'),
        hasData: context.fileList.some(f => f.type === 'data'),
        category: context.category,
        type: context.type
      }
    }
  } catch (error) {
    throw new Error(`Failed to parse Gemini response: ${error.message}`)
  }
}

function inferFileType(filename) {
  const name = filename.toLowerCase()
  
  // Documentation
  if (name.includes('readme') || name.endsWith('.md') || name.endsWith('.txt') || name.endsWith('.rst')) {
    return 'documentation'
  }
  
  // Code files
  if (name.endsWith('.py') || name.endsWith('.js') || name.endsWith('.java') || 
      name.endsWith('.cpp') || name.endsWith('.c') || name.endsWith('.go') || 
      name.endsWith('.rs') || name.endsWith('.r') || name.endsWith('.m') ||
      name.endsWith('.ipynb') || name.endsWith('.jl')) {
    return 'code'
  }
  
  // Data files
  if (name.endsWith('.csv') || name.endsWith('.json') || name.endsWith('.xlsx') || 
      name.endsWith('.parquet') || name.endsWith('.h5') || name.endsWith('.hdf5') ||
      name.endsWith('.pkl') || name.endsWith('.npy')) {
    return 'data'
  }
  
  // Environment files
  if (name.includes('requirements') || name.includes('environment') || 
      name.endsWith('package.json') || name.endsWith('pipfile') || 
      name.endsWith('.yml') || name.endsWith('.yaml') || name.endsWith('dockerfile')) {
    return 'environment'
  }
  
  // Test files
  if (name.includes('test') || name.includes('spec') || name.includes('__test__')) {
    return 'test'
  }
  
  // License
  if (name.includes('license') || name.includes('licence') || name.includes('copying')) {
    return 'license'
  }
  
  return 'other'
}

function heuristicAnalyzeManifest(manifest = {}) {
  // Original heuristic method as fallback
  let score = 0
  const diagnostics = []
  const recommendations = []
  const strengths = []
  const files = (manifest.files || []).map(f => f.name?.toLowerCase?.() || '')
  const has = (pattern) => files.some((f) => f.includes(pattern))

  // Documentation (25 points)
  if (has('readme')) { 
    score += 20
    strengths.push('README documentation found')
  } else { 
    diagnostics.push('Missing README.md')
    recommendations.push('Add a comprehensive README.md explaining the research')
  }
  
  if (manifest.description && manifest.description.length > 100) {
    score += 5
    strengths.push('Detailed description provided')
  } else {
    recommendations.push('Provide a more detailed research description')
  }

  // Licensing (10 points)
  if (has('license') || has('licence')) { 
    score += 10
    strengths.push('License file present')
  } else { 
    diagnostics.push('No license file')
    recommendations.push('Add a license file (MIT, Apache, GPL, etc.)')
  }

  // Environment specification (25 points)  
  if (has('requirements') || has('environment') || has('package.json') || has('pipfile')) { 
    score += 20
    strengths.push('Environment dependencies specified')
  } else { 
    diagnostics.push('No environment specification')
    recommendations.push('Add requirements.txt, environment.yml, or similar dependency file')
  }
  
  if (has('dockerfile')) { 
    score += 5
    strengths.push('Docker containerization available')
  }

  // Testing (20 points)
  if (files.some(f => f.includes('test') || f.includes('__tests__'))) { 
    score += 20
    strengths.push('Test files detected')
  } else { 
    diagnostics.push('No test files detected')
    recommendations.push('Add test files to validate your code and results')
  }

  // Dependency management (10 points)
  if (files.some(f => /package-lock\.json|poetry\.lock|pipfile\.lock|yarn\.lock/i.test(f))) { 
    score += 10
    strengths.push('Dependency versions locked')
  } else {
    recommendations.push('Lock dependency versions (package-lock.json, poetry.lock, etc.)')
  }

  // Code organization (10 points)
  const codeFiles = files.filter(f => 
    f.endsWith('.py') || f.endsWith('.js') || f.endsWith('.r') || 
    f.endsWith('.m') || f.endsWith('.ipynb') || f.endsWith('.jl')
  )
  
  if (codeFiles.length > 0) {
    score += 5
    strengths.push(`${codeFiles.length} code files included`)
    
    if (codeFiles.length > 3) {
      score += 5
      strengths.push('Well-organized codebase')
    }
  } else {
    diagnostics.push('No code files detected')
    recommendations.push('Include source code files for reproducibility')
  }

  // Determine category
  let category = 'poor'
  if (score >= 80) category = 'excellent'
  else if (score >= 65) category = 'good'  
  else if (score >= 45) category = 'fair'

  return { 
    score: Math.min(100, score), 
    confidence: 85, // Heuristic method has good confidence
    category,
    diagnostics,
    recommendations,
    strengths,
    provider: 'heuristic',
    metadata: {
      fileCount: files.length,
      hasDocumentation: has('readme') || has('.md'),
      hasCode: codeFiles.length > 0,
      hasLicense: has('license'),
      hasTests: files.some(f => f.includes('test')),
      category: manifest.category || 'unknown',
      type: manifest.type || 'unknown'
    }
  }
}

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})

export default app
