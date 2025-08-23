// Test with realistic research paper submission
import dotenv from 'dotenv';
import { ReproScoreService } from './src/services/ReproScoreService.js';

// Load environment variables
dotenv.config();

const realisticResearchManifest = {
  title: "Impact of Microplastics on Marine Ecosystems: A Comprehensive Meta-Analysis",
  description: "This comprehensive study presents a systematic meta-analysis of 150 research papers examining the environmental impact of microplastics on marine ecosystems. Our research methodology included data collection from peer-reviewed journals published between 2018-2024, statistical analysis using random-effects models, and correlation studies between microplastic concentrations and biodiversity indices. The study reveals significant negative correlations between microplastic density and fish population health (r=-0.73, p<0.001), impacts on phytoplankton communities, and bioaccumulation patterns in the food chain. Our findings demonstrate that microplastic pollution levels exceeding 100 particles per cubic meter result in measurable ecosystem degradation. The research includes comprehensive data visualization, statistical modeling, and policy recommendations for marine conservation. This work contributes to the understanding of anthropogenic impacts on ocean health and provides evidence-based recommendations for environmental policy makers.",
  authors: ["Dr. Sarah Chen", "Prof. Maria Rodriguez", "Dr. James Thompson"],
  category: "Environmental Science",
  type: "Research Paper",
  tags: ["microplastics", "marine ecology", "environmental impact", "meta-analysis", "ocean conservation"],
  files: [
    { 
      name: "microplastics_meta_analysis_full_paper.pdf", 
      content: "JVBERi0xLjQKJe...", // Realistic base64 prefix
      size: 2547832,
      type: "application/pdf"
    },
    { 
      name: "data_analysis_methodology.md", 
      content: "IyBEYXRhIEFuYW...", 
      size: 15420,
      type: "text/markdown"
    },
    { 
      name: "meta_analysis_dataset.csv", 
      content: "c3R1ZHlfaWQsYX...", 
      size: 89234,
      type: "text/csv"
    },
    { 
      name: "statistical_analysis_code.r", 
      content: "bGlicmFyeShkc...", 
      size: 8934,
      type: "text/x-r"
    },
    { 
      name: "visualization_plots.ipynb", 
      content: "eyJ2ZXJzaW9uI...", 
      size: 45672,
      type: "application/json"
    },
    { 
      name: "supplementary_figures.png", 
      content: "iVBORw0KGgoAA...", 
      size: 156789,
      type: "image/png"
    }
  ],
  metadata: {
    institution: "Marine Research Institute",
    grant_funding: "NSF-OCE-2024-789",
    publication_year: 2024,
    keywords: ["environmental science", "marine biology", "pollution studies"]
  }
};

async function testRealisticResearch() {
  console.log('Testing realistic research paper submission with Gemini AI...\n');
  
  try {
    console.log('Environment check:');
    console.log(`REPRO_SCORE_PROVIDER: ${process.env.REPRO_SCORE_PROVIDER}`);
    console.log(`GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET'}`);
    console.log('');

    const result = await ReproScoreService.analyzeManifest(realisticResearchManifest);
    
    console.log('=== Realistic Research Quality Score Result ===');
    console.log(`Score: ${result.score}/100`);
    console.log(`Provider: ${result.provider}`);
    console.log(`Category: ${result.category}`);
    console.log(`Confidence: ${result.confidence}%`);
    
    console.log('\nStrengths:');
    result.strengths?.forEach(s => console.log(`  ✓ ${s}`));
    
    if (result.recommendations?.length > 0) {
      console.log('\nRecommendations:');
      result.recommendations.forEach(r => console.log(`  • ${r}`));
    }
    
    if (result.diagnostics?.length > 0) {
      console.log('\nDiagnostics:');
      result.diagnostics.forEach(d => console.log(`  ⚠ ${d}`));
    }
    
    if (result.provider === 'gemini') {
      console.log('\n🤖 Using Gemini AI for intelligent research content evaluation');
    } else {
      console.log('\n📊 Using heuristic scoring (fallback)');
    }
    
    console.log(`\n${result.score >= 60 ? '✅ PASS' : '❌ FAIL'} - Research Quality Threshold: 60/100`);
    
    if (result.score >= 60) {
      console.log('Research paper meets quality standards for publication');
    } else {
      console.log('Research submission needs improvement before publication');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.stack) console.error(error.stack);
  }
}

testRealisticResearch();
