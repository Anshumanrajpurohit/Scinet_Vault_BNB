// Direct test of the ReproScoreService
import { ReproScoreService } from './src/services/ReproScoreService.js';

const testManifest = {
  title: "Machine Learning Analysis of Climate Data",
  description: "A comprehensive study examining climate patterns using machine learning algorithms. This research analyzes temperature and precipitation data from the past 50 years to identify trends and predict future climate scenarios. The methodology includes data preprocessing, feature engineering, and the implementation of various ML models including random forests and neural networks.",
  files: [
    { name: "research_paper.pdf", content: "base64content..." },
    { name: "climate_data.csv", content: "base64content..." },
    { name: "analysis_code.py", content: "base64content..." },
    { name: "README.md", content: "base64content..." },
    { name: "results_visualization.png", content: "base64content..." }
  ],
  metadata: {
    category: "research",
    type: "academic_study",
    keywords: ["climate", "machine learning", "data analysis"]
  }
};

async function testScoring() {
  console.log('Testing updated ReproScoreService...\n');
  
  try {
    const result = await ReproScoreService.analyzeManifest(testManifest);
    
    console.log('=== Reproducibility Score Result ===');
    console.log(`Score: ${result.score}/100`);
    console.log(`Provider: ${result.provider}`);
    console.log(`Category: ${result.category}`);
    console.log(`Confidence: ${result.confidence}%`);
    
    console.log('\nStrengths:');
    result.strengths?.forEach(s => console.log(`  ✓ ${s}`));
    
    console.log('\nRecommendations:');
    result.recommendations?.forEach(r => console.log(`  • ${r}`));
    
    console.log('\nDiagnostics:');
    result.diagnostics?.forEach(d => console.log(`  ⚠ ${d}`));
    
    console.log(`\n${result.score >= 60 ? '✅ PASS' : '❌ FAIL'} - Research Quality Threshold: 60/100`);
    
    console.log('\nMetadata:', JSON.stringify(result.metadata, null, 2));
    
  } catch (error) {
    console.error('Test failed:', error.message);
    console.error(error.stack);
  }
}

testScoring();
