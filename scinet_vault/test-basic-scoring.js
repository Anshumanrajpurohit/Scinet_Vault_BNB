// Test with very basic content
import { ReproScoreService } from './src/services/ReproScoreService.js';

const basicTestManifest = {
  title: "Basic Upload",
  description: "Test", // Very short description
  files: [
    { name: "file.txt", content: "base64content..." }
  ],
  metadata: {
    category: "other",
    type: "unknown"
  }
};

async function testBasicScoring() {
  console.log('Testing very basic content scoring...\n');
  
  try {
    const result = await ReproScoreService.analyzeManifest(basicTestManifest);
    
    console.log('=== Basic Content Score Result ===');
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

testBasicScoring();
