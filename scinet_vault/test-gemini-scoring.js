// Test Gemini integration with a research paper
import dotenv from 'dotenv';
import { ReproScoreService } from './src/services/ReproScoreService.js';

// Load environment variables
dotenv.config();

const researchManifest = {
  title: "Advanced Climate Modeling Research",
  description: "This research presents a novel approach to climate modeling using advanced machine learning techniques. Our methodology incorporates deep neural networks, ensemble methods, and time-series analysis to predict long-term climate patterns. The study uses 30 years of meteorological data from multiple global sources and demonstrates significant improvements in prediction accuracy compared to traditional models. Our findings suggest that incorporating satellite data and ocean temperature measurements enhances model performance by 23%.",
  files: [
    { name: "climate_research_paper.pdf", content: "base64content..." },
    { name: "methodology.md", content: "base64content..." },
    { name: "dataset_descriptions.csv", content: "base64content..." },
    { name: "neural_network_model.py", content: "base64content..." },
    { name: "data_preprocessing.r", content: "base64content..." },
    { name: "results_analysis.ipynb", content: "base64content..." },
    { name: "statistical_validation.py", content: "base64content..." },
    { name: "visualization_plots.png", content: "base64content..." }
  ],
  metadata: {
    category: "research",
    type: "academic_study",
    keywords: ["climate modeling", "machine learning", "deep learning", "prediction"]
  }
};

async function testGeminiScoring() {
  console.log('Testing ReproScoreService with research content (should use Gemini if configured)...\n');
  
  try {
    // This will test if Gemini is properly configured
    const result = await ReproScoreService.analyzeManifest(researchManifest);
    
    console.log('=== Research Quality Score Result ===');
    console.log(`Score: ${result.score}/100`);
    console.log(`Provider: ${result.provider}`); // Should show 'gemini' if properly configured
    console.log(`Category: ${result.category}`);
    console.log(`Confidence: ${result.confidence}%`);
    
    console.log('\nStrengths:');
    result.strengths?.forEach(s => console.log(`  ✓ ${s}`));
    
    if (result.recommendations?.length > 0) {
      console.log('\nRecommendations:');
      result.recommendations.forEach(r => console.log(`  • ${r}`));
    }
    
    if (result.provider === 'gemini') {
      console.log('\n🤖 Using Gemini AI for content evaluation');
    } else if (result.provider === 'heuristic') {
      console.log('\n📊 Using heuristic scoring (fallback)');
      console.log('Note: To use Gemini AI, ensure GEMINI_API_KEY is set and REPRO_SCORE_PROVIDER=gemini');
    }
    
    console.log(`\n${result.score >= 60 ? '✅ PASS' : '❌ FAIL'} - Research Quality Threshold: 60/100`);
    
  } catch (error) {
    console.error('Test failed:', error.message);
    console.error(error.stack);
  }
}

testGeminiScoring();
