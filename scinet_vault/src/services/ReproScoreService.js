// Enhanced reproducibility scoring with Gemini AI intelligence
export const ReproScoreService = {
  async analyzeManifest(manifest = {}) {
    // Try Gemini AI-powered analysis first, fall back to heuristic
    if (process.env.REPRO_SCORE_PROVIDER === 'gemini' && process.env.GEMINI_API_KEY) {
      try {
        return await this.geminiAnalyzeManifest(manifest);
      } catch (error) {
        console.warn('Gemini analysis failed, falling back to heuristic:', error.message);
      }
    }
    
    return this.heuristicAnalyzeManifest(manifest);
  },

  async geminiAnalyzeManifest(manifest = {}) {
    const { title, description, authors, category, type, tags, files = [] } = manifest;
    
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
        type: this.inferFileType(f.name || '')
      }))
    };

    const prompt = this.buildGeminiPrompt(researchContext);
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!result) {
      throw new Error('Empty response from Gemini');
    }

    return this.parseGeminiResponse(result, researchContext);
  },

  buildGeminiPrompt(context) {
    return `You are a RIGOROUS peer-review editor for a top-tier academic journal. Your standards are EXTREMELY HIGH and you reject 85% of submissions. Only accept EXCEPTIONAL research that would be suitable for Nature, Science, or Cell-level publications.

Research Details:
- Title: ${context.title}
- Description: ${context.description}
- Category: ${context.category}
- Type: ${context.type}
- Authors: ${context.authors.join(', ') || 'None specified'}
- Tags: ${context.tags.join(', ') || 'None'}

Files Included:
${context.fileList.map(f => `- ${f.name} (${f.size} bytes, type: ${f.type})`).join('\n')}

STRICT EVALUATION CRITERIA (EXTREMELY RIGOROUS):

1. Research Significance & Innovation (30 points) - VERY STRICT
   - MUST be groundbreaking, paradigm-shifting research
   - REQUIRES clear evidence of major scientific advancement
   - MUST address critical unsolved problems with novel approaches
   - REJECT: Incremental improvements, replicated studies, minor variations
   - PASS ONLY: Revolutionary findings, first-of-kind discoveries, major breakthroughs

2. Methodological Excellence & Rigor (25 points) - NO COMPROMISE
   - MUST demonstrate sophisticated, cutting-edge methodologies
   - REQUIRES comprehensive statistical analysis with proper controls
   - MUST include detailed experimental design and validation
   - REJECT: Simple analyses, insufficient controls, questionable methods
   - PASS ONLY: Gold-standard protocols, innovative techniques, bulletproof design

3. Content Depth & Scientific Writing (20 points) - PUBLICATION QUALITY
   - MUST demonstrate deep domain expertise and comprehensive literature review
   - REQUIRES crystal-clear articulation of complex concepts
   - MUST show mastery of the field with original insights
   - REJECT: Superficial descriptions, basic summaries, unclear writing
   - PASS ONLY: PhD-level depth, exceptional clarity, original thinking

4. Data Quality & Evidence (15 points) - UNCOMPROMISING STANDARDS
   - MUST provide robust, comprehensive datasets with proper documentation
   - REQUIRES multiple validation approaches and reproducible results
   - MUST include appropriate sample sizes and statistical power
   - REJECT: Limited data, poor documentation, unreproducible claims
   - PASS ONLY: Extensive datasets, multiple validations, bulletproof evidence

5. Impact & Reproducibility (10 points) - FUTURE-PROOF RESEARCH
   - MUST demonstrate clear pathway to real-world impact
   - REQUIRES complete documentation for reproducibility
   - MUST include all necessary code, data, and protocols
   - REJECT: Theoretical-only work, incomplete documentation
   - PASS ONLY: Immediately applicable, fully reproducible, game-changing

EXTREMELY STRICT SCORING GUIDELINES:
- Default assumption: REJECT (start with 0 points)
- Only award points for EXCEPTIONAL quality that exceeds expectations
- 90-100: Revolutionary, Nature/Science-level breakthroughs (extremely rare)
- 80-89: Outstanding research with major impact potential (very rare)
- 70-79: Solid high-quality research with clear contributions (rare)
- 60-69: Above-average research with some merit (uncommon)
- Below 60: REJECT - Not suitable for premium academic platform
- BE HARSH: Most submissions should score 20-40 points
- MINIMUM THRESHOLD: 75 points for acceptance (only top 15% of research)

Respond in this exact JSON format:
{
  "score": [0-100 integer],
  "confidence": [0-100 integer],
  "category": "excellent|good|fair|poor",
  "diagnostics": [
    "specific content-based finding 1",
    "specific content-based finding 2"
  ],
  "recommendations": [
    "actionable content improvement 1", 
    "actionable content improvement 2"
  ],
  "strengths": [
    "positive research aspect 1",
    "positive research aspect 2"
  ]
}`;
  },

  parseGeminiResponse(response, context) {
    try {
      // Extract JSON from response (handle cases where Gemini adds extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const analysis = JSON.parse(jsonMatch[0]);
      
      // Validate and sanitize the response
      const score = Math.max(0, Math.min(100, parseInt(analysis.score) || 0));
      const confidence = Math.max(0, Math.min(100, parseInt(analysis.confidence) || 75));
      
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
      };
    } catch (error) {
      throw new Error(`Failed to parse Gemini response: ${error.message}`);
    }
  },

  inferFileType(filename) {
    const name = filename.toLowerCase();
    
    // Documentation
    if (name.includes('readme') || name.endsWith('.md') || name.endsWith('.txt') || name.endsWith('.rst')) {
      return 'documentation';
    }
    
    // Code files
    if (name.endsWith('.py') || name.endsWith('.js') || name.endsWith('.java') || 
        name.endsWith('.cpp') || name.endsWith('.c') || name.endsWith('.go') || 
        name.endsWith('.rs') || name.endsWith('.r') || name.endsWith('.m') ||
        name.endsWith('.ipynb') || name.endsWith('.jl')) {
      return 'code';
    }
    
    // Data files
    if (name.endsWith('.csv') || name.endsWith('.json') || name.endsWith('.xlsx') || 
        name.endsWith('.parquet') || name.endsWith('.h5') || name.endsWith('.hdf5') ||
        name.endsWith('.pkl') || name.endsWith('.npy')) {
      return 'data';
    }
    
    // Environment files
    if (name.includes('requirements') || name.includes('environment') || 
        name.endsWith('package.json') || name.endsWith('pipfile') || 
        name.endsWith('.yml') || name.endsWith('.yaml') || name.endsWith('dockerfile')) {
      return 'environment';
    }
    
    // Test files
    if (name.includes('test') || name.includes('spec') || name.includes('__test__')) {
      return 'test';
    }
    
    // License
    if (name.includes('license') || name.includes('licence') || name.includes('copying')) {
      return 'license';
    }
    
    // Configuration
    if (name.endsWith('.config') || name.endsWith('.cfg') || name.endsWith('.ini') || 
        name.endsWith('.toml') || name.includes('config')) {
      return 'config';
    }
    
    // Academic papers
    if (name.endsWith('.pdf') || name.endsWith('.tex') || name.endsWith('.bib')) {
      return 'academic';
    }
    
    return 'other';
  },

  heuristicAnalyzeManifest(manifest = {}) {
    // Strict heuristic scoring for premium research platform
    let score = 20; // Lower base score - must earn points
    const diagnostics = [];
    const recommendations = [];
    const strengths = [];
    const files = (manifest.files || []).map(f => f.name?.toLowerCase?.() || '');
    const has = (pattern) => files.some((f) => f.includes(pattern));

    // Research content evaluation - more demanding (25 points possible)
    if (has('readme') || has('.md') || has('.pdf') || has('.doc')) { 
      score += 15; // Reduced from 25
      strengths.push('Research documentation detected');
      
      // Additional scrutiny for quality indicators
      if (has('.pdf') && has('.md')) {
        score += 5;
        strengths.push('Multiple documentation formats');
      }
    } else { 
      diagnostics.push('No research documentation found'); 
      recommendations.push('Must include comprehensive research documentation (PDF, README, etc.)');
    }
    
    // Description quality - stricter evaluation (15 points possible)
    if (manifest.description && manifest.description.length > 200) {
      score += 10;
      strengths.push('Detailed research description provided');
      
      // Check for academic keywords and depth indicators
      const academicKeywords = ['methodology', 'analysis', 'results', 'conclusion', 'significant', 'novel', 'framework', 'algorithm', 'statistical', 'experimental'];
      const keywordCount = academicKeywords.filter(keyword => 
        manifest.description.toLowerCase().includes(keyword)
      ).length;
      
      if (keywordCount >= 3) {
        score += 5;
        strengths.push('Academic depth indicators present');
      } else {
        diagnostics.push('Description lacks academic rigor indicators');
      }
    } else if (manifest.description && manifest.description.length > 100) {
      score += 5; // Basic description credit
      recommendations.push('Expand description with methodology, results, and significance details');
    } else {
      diagnostics.push('Insufficient research description');
      recommendations.push('Provide comprehensive description (200+ chars) with academic details');
    }

    // Content quality assessment - stricter file evaluation (20 points possible)
    const researchFiles = files.filter(f => 
      f.includes('.pdf') || f.includes('.doc') || f.includes('.tex')
    );
    const dataFiles = files.filter(f =>
      f.includes('.csv') || f.includes('.json') || f.includes('.xlsx') || 
      f.includes('.xml') || f.includes('.h5') || f.includes('.mat')
    );
    const codeFiles = files.filter(f => 
      f.endsWith('.py') || f.endsWith('.r') || f.endsWith('.m') || 
      f.endsWith('.ipynb') || f.endsWith('.jl') || f.endsWith('.scala')
    );
    
    if (researchFiles.length > 0) {
      score += 8;
      strengths.push(`${researchFiles.length} research document(s) found`);
    } else {
      diagnostics.push('No research papers found');
      recommendations.push('Must include research papers (PDF, DOC, TEX)');
    }
    
    if (dataFiles.length > 0) {
      score += 8;
      strengths.push(`${dataFiles.length} data file(s) enhance reproducibility`);
    } else {
      diagnostics.push('No data files detected');
      recommendations.push('Include datasets or supplementary data files');
    }
    
    if (codeFiles.length > 0) {
      score += 4;
      strengths.push(`${codeFiles.length} code file(s) support reproducibility`);
    } else {
      recommendations.push('Consider including analysis code or computational notebooks');
    }

    // Author credibility check (10 points possible)
    const authors = manifest.authors || [];
    if (authors.length > 0) {
      score += 5;
      strengths.push(`${authors.length} author(s) specified`);
      
      if (authors.length >= 3) {
        score += 3;
        strengths.push('Multi-author collaboration');
      }
      
      // Check for academic titles/affiliations
      const hasAcademicTitles = authors.some(author => 
        typeof author === 'string' && 
        (author.includes('Dr.') || author.includes('Prof.') || author.includes('PhD'))
      );
      if (hasAcademicTitles) {
        score += 2;
        strengths.push('Academic credentials detected');
      }
    } else {
      diagnostics.push('No authors specified');
      recommendations.push('Provide author information with credentials');
    }

    // Keywords and categorization (5 points possible)
    if (manifest.tags && manifest.tags.length >= 3) {
      score += 3;
      strengths.push('Comprehensive tagging');
    } else if (manifest.tags && manifest.tags.length > 0) {
      score += 1;
      recommendations.push('Add more specific research keywords');
    }

    if (manifest.category && manifest.category !== 'unknown') {
      score += 2;
      strengths.push('Research category specified');
    }

    // Determine category with much stricter thresholds
    let category = 'poor'; // Default to poor
    if (score >= 85) category = 'exceptional';      // Top 5%
    else if (score >= 75) category = 'excellent';   // Top 15%
    else if (score >= 65) category = 'good';        // Top 30%
    else if (score >= 55) category = 'fair';        // Top 50%
    else if (score >= 45) category = 'below_average'; // Bottom 50%
    else category = 'poor';                          // Reject

    // Add final quality gate recommendations
    if (score < 75) {
      recommendations.push('Research quality must meet premium academic standards');
      recommendations.push('Consider major revisions before resubmission');
    }

    return { 
      score: Math.min(100, score), 
      confidence: 85, // High confidence in strict evaluation
      category,
      diagnostics,
      recommendations,
      strengths,
      provider: 'heuristic',
      metadata: {
        fileCount: files.length,
        hasDocumentation: has('readme') || has('.md') || has('.pdf'),
        hasCode: codeFiles.length > 0,
        hasData: dataFiles.length > 0,
        hasLicense: has('license'),
        hasTests: files.some(f => f.includes('test')),
        category: manifest.category || 'unknown',
        type: manifest.type || 'unknown',
        qualityThreshold: 75,
        passingGrade: score >= 75
      }
    };
  }
};
