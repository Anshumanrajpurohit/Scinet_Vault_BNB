// Quick validation test
const testPayload = {
  sourceType: 'text',
  data: 'Blockchain technology enables reproducible science through immutable records. Smart contracts automate peer review. IPFS provides decentralized storage. The system achieves 94% reproducibility improvement.',
  options: { summaryStyle: 'bullets', maxPoints: 3 }
};

fetch('http://localhost:8787/api/analyze/summarize-base64', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testPayload)
})
.then(r => r.json())
.then(data => {
  console.log('✅ API Test Success!');
  console.log('Summary:', data.summary);
  console.log('Tokens:', data.tokensEstimated);
  console.log('Meta:', data.meta);
})
.catch(err => {
  console.log('❌ API Test Failed:', err.message);
});
