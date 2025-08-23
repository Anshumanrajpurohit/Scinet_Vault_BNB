// Test with minimal research content
import { ReproScoreService } from './src/services/ReproScoreService.js';

const minimalTestManifest = {
  title: "Basic Research Study",
  description: "A simple research analysis with limited documentation",
  files: [
    { name: "paper.pdf", content: "base64content..." },
    { name: "data.csv", content: "base64content..." }
  ],
  metadata: {
    category: "research",
    type: "study"
  }
};

async function testMinimalScoring() {
  console.log('Testing minimal research content scoring...\n');
  
  try {
    const result = await ReproScoreService.analyzeManifest(minimalTestManifest);
    
    console.log('=== Minimal Research Score Result ===');
    console.log(`Score: ${result.score}/100`);
    console.log(`Provider: ${result.provider}`);
    console.log(`Category: ${result.category}`);
    console.log(`Confidence: ${result.confidence}%`);
    
    console.log('\nStrengths:');
    result.strengths?.forEach(s => console.log(`  ✓ ${s}`));
    
    console.log('\nRecommendations:');
    result.recommendations?.forEach(r => console.log(`  • ${r}`));
    
    console.log(`\n${result.score >= 60 ? '✅ PASS' : '❌ FAIL'} - Research Quality Threshold: 60/100`);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testMinimalScoring();
