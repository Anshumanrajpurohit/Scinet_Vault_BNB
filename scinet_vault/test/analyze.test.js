import assert from 'assert'
import { test, describe, before } from 'node:test'

const API_BASE = 'http://localhost:8787/api'

// Test data
const SAMPLE_TEXT = `
Blockchain technology has emerged as a revolutionary approach to distributed computing and data storage.
This research explores the implementation of reproducible science frameworks using blockchain infrastructure.

Methods:
Our methodology involves creating immutable research records on the BNB Smart Chain.
We implement smart contracts for bounty systems and peer review mechanisms.
The system ensures data integrity through cryptographic hashing and distributed consensus.

Results:
Initial testing shows 99.2% uptime and sub-second transaction confirmations.
Gas costs remain within acceptable bounds for scientific applications.
The peer review system successfully validates research authenticity.

Conclusion:
Blockchain-based scientific publishing offers significant advantages over traditional centralized systems.
Future work will explore integration with IPFS for large dataset storage.
`

const createTestPDF = () => {
  // Minimal PDF structure for testing
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Test PDF content) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000125 00000 n 
0000000185 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
279
%%EOF`
  return Buffer.from(pdfContent).toString('base64')
}

describe('Summarize API Integration Tests', () => {
  test('Health check should respond correctly', async () => {
    const response = await fetch(`${API_BASE}/health`)
    const data = await response.json()
    
    assert.strictEqual(response.status, 200)
    assert.strictEqual(data.ok, true)
  })

  test('Should summarize text content successfully', async () => {
    const payload = {
      sourceType: 'text',
      data: SAMPLE_TEXT,
      options: {
        summaryStyle: 'bullets',
        maxPoints: 4
      }
    }

    const response = await fetch(`${API_BASE}/analyze/summarize-base64`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    
    assert.strictEqual(response.status, 200)
    assert.ok(data.summary)
    assert.ok(data.summary.length > 0)
    assert.strictEqual(data.meta.sourceType, 'text')
    assert.ok(data.meta.charsProcessed > 0)
    assert.ok(typeof data.tokensEstimated === 'number')
  })

  test('Should handle paragraph style summaries', async () => {
    const payload = {
      sourceType: 'text',
      data: SAMPLE_TEXT,
      options: {
        summaryStyle: 'paragraph',
        maxPoints: 6
      }
    }

    const response = await fetch(`${API_BASE}/analyze/summarize-base64`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    
    assert.strictEqual(response.status, 200)
    assert.ok(data.summary)
    assert.ok(!data.summary.includes('- ')) // Should not have bullet points
  })

  test('Should validate required fields', async () => {
    const response = await fetch(`${API_BASE}/analyze/summarize-base64`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })

    const data = await response.json()
    
    assert.strictEqual(response.status, 400)
    assert.strictEqual(data.error.code, 'INVALID_INPUT')
  })

  test('Should validate sourceType', async () => {
    const payload = {
      sourceType: 'invalid',
      data: 'test',
      options: {}
    }

    const response = await fetch(`${API_BASE}/analyze/summarize-base64`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    
    assert.strictEqual(response.status, 400)
    assert.strictEqual(data.error.code, 'INVALID_INPUT')
  })

  test('Should reject empty data', async () => {
    const payload = {
      sourceType: 'text',
      data: '',
      options: {}
    }

    const response = await fetch(`${API_BASE}/analyze/summarize-base64`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    
    assert.strictEqual(response.status, 400)
    assert.strictEqual(data.error.code, 'INVALID_INPUT')
  })

  test('Should reject non-PDF files', async () => {
    const textAsBase64 = Buffer.from('This is not a PDF file').toString('base64')
    const payload = {
      sourceType: 'pdf',
      data: textAsBase64,
      options: {}
    }

    const response = await fetch(`${API_BASE}/analyze/summarize-base64`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    
    assert.strictEqual(response.status, 400)
    assert.strictEqual(data.error.code, 'INVALID_INPUT')
    assert.ok(data.error.message.includes('PDF header'))
  })

  test('Should work with Upload component workflow', async () => {
    const researchSummary = `
    Research Title: Blockchain-Based Reproducible Science Framework
    
    This study implements a decentralized platform for scientific research validation.
    Methods include smart contract development, peer review mechanisms, and IPFS integration.
    Results demonstrate improved transparency and reproducibility compared to traditional systems.
    
    The framework includes:
    - Immutable research records
    - Decentralized peer review  
    - Bounty-based incentives
    - Version control for datasets
    `

    const payload = {
      sourceType: 'text',
      data: researchSummary,
      options: {
        summaryStyle: 'bullets',
        maxPoints: 5
      }
    }

    const response = await fetch(`${API_BASE}/analyze/summarize-base64`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    
    assert.strictEqual(response.status, 200)
    assert.ok(data.summary.includes('-') || data.summary.includes('•'))
    assert.ok(data.tokensEstimated > 0)
    
    // Verify the summary captures key concepts
    const summaryLower = data.summary.toLowerCase()
    assert.ok(summaryLower.includes('blockchain') || summaryLower.includes('research') || summaryLower.includes('science'))
  })

  test('Should analyze reproducibility scores with enhanced intelligence', async () => {
    // Test manifest with good reproducibility practices
    const goodManifest = {
      title: "Blockchain-Based Reproducible Science Platform",
      description: "A comprehensive framework for ensuring reproducibility in scientific research using blockchain technology, smart contracts, and decentralized storage systems.",
      category: "Computer Science",
      type: "paper",
      authors: ["Dr. Jane Smith", "Prof. Bob Johnson"],
      tags: ["blockchain", "reproducibility", "science", "decentralization"],
      files: [
        { name: "README.md", size: 5000 },
        { name: "requirements.txt", size: 500 },
        { name: "test_analysis.py", size: 2000 },
        { name: "LICENSE", size: 1000 },
        { name: "main.py", size: 15000 },
        { name: "data_processor.py", size: 8000 },
        { name: "package-lock.json", size: 50000 }
      ]
    }

    const response = await fetch(`${API_BASE}/analyze/reproducibility-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manifest: goodManifest })
    })

    const data = await response.json()
    
    assert.strictEqual(response.status, 200)
    assert.ok(data.score >= 60, 'Good manifest should have score >= 60')
    assert.ok(data.confidence > 0, 'Should have confidence score')
    assert.ok(['excellent', 'good', 'fair', 'poor'].includes(data.category))
    assert.ok(data.provider === 'gemini' || data.provider === 'heuristic')
    assert.ok(Array.isArray(data.diagnostics))
    assert.ok(Array.isArray(data.recommendations))
    assert.ok(Array.isArray(data.strengths))
    assert.ok(typeof data.metadata === 'object')
  })

  test('Should reject low-quality research with detailed feedback', async () => {
    // Test manifest with poor reproducibility practices
    const poorManifest = {
      title: "My Research",
      description: "A study.",
      files: [
        { name: "paper.pdf", size: 1024000 }
      ]
    }

    const response = await fetch(`${API_BASE}/analyze/reproducibility-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manifest: poorManifest })
    })

    const data = await response.json()
    
    assert.strictEqual(response.status, 200)
    assert.ok(data.score <= 60, 'Poor manifest should have low score')
    assert.ok(data.recommendations.length > 0, 'Should provide recommendations')
    assert.ok(data.diagnostics.length > 0, 'Should identify issues')
    assert.strictEqual(data.category, 'poor')
  })
})
