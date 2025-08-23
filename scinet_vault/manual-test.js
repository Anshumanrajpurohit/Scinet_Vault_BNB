// Manual API test script
import fetch from 'node-fetch'

const API_BASE = 'http://localhost:8787'

async function testAPI() {
  try {
    console.log('Testing health endpoint...')
    const healthResponse = await fetch(`${API_BASE}/health`)
    const healthData = await healthResponse.text()
    console.log('Health check:', healthData)
    
    console.log('\nTesting summarize endpoint...')
    const summarizeResponse = await fetch(`${API_BASE}/api/analyze/summarize-base64`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceType: 'text',
        data: 'This is a test research summary about blockchain technology.',
        options: { summaryStyle: 'bullets', maxPoints: 3 }
      })
    })
    
    const summarizeData = await summarizeResponse.json()
    console.log('Summarize result:', JSON.stringify(summarizeData, null, 2))
    
    console.log('\nTesting reproducibility scoring...')
    const scoreResponse = await fetch(`${API_BASE}/api/analyze/reproducibility-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        manifest: {
          title: "Test Research",
          description: "A comprehensive blockchain study",
          files: [
            { name: "README.md", size: 2000 },
            { name: "requirements.txt", size: 500 },
            { name: "main.py", size: 10000 }
          ]
        }
      })
    })
    
    const scoreData = await scoreResponse.json()
    console.log('Reproducibility score:', JSON.stringify(scoreData, null, 2))
    
  } catch (error) {
    console.error('Test failed:', error.message)
  }
}

testAPI()
