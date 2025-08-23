// Test the updated reproducibility scoring system
import fetch from 'node-fetch';

const testBase64Content = Buffer.from(JSON.stringify({
  "title": "Machine Learning Analysis of Climate Data",
  "description": "A comprehensive study examining climate patterns using machine learning algorithms. This research analyzes temperature and precipitation data from the past 50 years to identify trends and predict future climate scenarios. The methodology includes data preprocessing, feature engineering, and the implementation of various ML models including random forests and neural networks.",
  "files": [
    { "name": "research_paper.pdf", "content": "base64content..." },
    { "name": "climate_data.csv", "content": "base64content..." },
    { "name": "analysis_code.py", "content": "base64content..." },
    { "name": "README.md", "content": "base64content..." },
    { "name": "results_visualization.png", "content": "base64content..." }
  ],
  "metadata": {
    "category": "research",
    "type": "academic_study",
    "keywords": ["climate", "machine learning", "data analysis"]
  }
})).toString('base64');

async function testScoring() {
  try {
    console.log('Testing updated reproducibility scoring...\n');
    
    const response = await fetch('http://localhost:8787/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Content: testBase64Content,
        filename: 'climate_research.json'
      })
    });

    const result = await response.json();
    console.log('=== API Response ===');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.reproScore) {
      console.log('\n=== Reproducibility Score Details ===');
      console.log(`Score: ${result.reproScore.score}/100`);
      console.log(`Provider: ${result.reproScore.provider}`);
      console.log(`Category: ${result.reproScore.category}`);
      console.log(`Confidence: ${result.reproScore.confidence}%`);
      
      if (result.reproScore.strengths) {
        console.log('\nStrengths:');
        result.reproScore.strengths.forEach(s => console.log(`  ✓ ${s}`));
      }
      
      if (result.reproScore.recommendations) {
        console.log('\nRecommendations:');
        result.reproScore.recommendations.forEach(r => console.log(`  • ${r}`));
      }
      
      console.log(`\n${result.reproScore.score >= 60 ? '✅ PASS' : '❌ FAIL'} - Threshold: 60/100`);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testScoring();
