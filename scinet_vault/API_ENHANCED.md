# Enhanced Scinet Vault API Documentation

## Overview
This document outlines the enhanced API endpoints for Scinet Vault, including base64 ingestion/summarization and AI-powered reproducibility scoring features.

## Environment Configuration

### Required Environment Variables
```bash
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
REPRO_SCORE_PROVIDER=gemini  # Options: gemini, heuristic

# Server Configuration
PORT=3000
NODE_ENV=development
```

## API Endpoints

### 1. Base64 Summarization Endpoint

**POST** `/api/analyze/summarize-base64`

Analyzes and summarizes content from various sources (PDF, text, images) encoded in base64 format.

#### Request Body
```json
{
  "sourceType": "string",    // Required: "pdf", "text", "image"
  "data": "string",          // Required: base64 encoded data or plain text
  "options": {               // Optional
    "summaryStyle": "string", // "bullets" or "paragraph" (default: "paragraph")
    "maxPoints": number       // Max bullet points for bullets style (default: 8)
  }
}
```

#### Response
```json
{
  "success": true,
  "summary": "string",           // Generated summary
  "tokensEstimated": number,     // Estimated token count
  "sourceType": "string",        // Processed source type
  "metadata": {
    "style": "string",           // Applied summary style
    "originalSize": number,      // Original content size
    "processingTime": number     // Processing time in ms
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": "string",          // Error message
  "details": "string"         // Additional error details (optional)
}
```

### 2. AI-Powered Reproducibility Scoring

**POST** `/api/analyze/reproducibility-score`

Analyzes research manifest using AI (Gemini) or heuristic methods to provide comprehensive reproducibility scoring.

#### Request Body
```json
{
  "manifest": {
    "title": "string",        // Research title
    "description": "string",  // Research description
    "category": "string",     // Research category
    "type": "string",         // Research type
    "authors": ["string"],    // Author names
    "tags": ["string"],       // Research tags
    "files": [                // File manifest
      {
        "name": "string",     // File name
        "size": number        // File size in bytes
      }
    ]
  }
}
```

#### Response
```json
{
  "score": number,            // Reproducibility score (0-100)
  "category": "string",       // "excellent", "good", "fair", "poor"
  "confidence": number,       // AI confidence in scoring (0-1)
  "provider": "string",       // "gemini" or "heuristic"
  "strengths": ["string"],    // Identified strengths
  "diagnostics": ["string"],  // Identified issues
  "recommendations": ["string"], // Improvement suggestions
  "metadata": {
    "fileTypes": {            // File type analysis
      "documentation": number,
      "code": number,
      "data": number,
      "environment": number,
      "test": number,
      "license": number
    },
    "analysisDepth": "string", // Analysis method used
    "processingTime": number   // Processing time in ms
  }
}
```

## File Type Intelligence

The AI system categorizes files into the following types for reproducibility analysis:

- **Documentation**: README.md, docs/, *.txt, *.md
- **Code**: *.py, *.js, *.ts, *.cpp, *.java, *.r, *.m
- **Data**: *.csv, *.json, *.xml, data/, datasets/
- **Environment**: requirements.txt, package.json, environment.yml, Dockerfile
- **Test**: test/, tests/, *.test.*, *_test.*, test_*
- **License**: LICENSE, COPYING, legal/

## Scoring Criteria (AI Analysis)

When using Gemini AI, the system evaluates research based on these 8 key factors:

1. **Documentation Quality** - Clear README, methodology explanation
2. **Code Availability** - Presence and organization of source code
3. **Data Accessibility** - Dataset availability and documentation
4. **Environment Specification** - Dependency and environment files
5. **Test Coverage** - Presence of validation and test files
6. **Licensing** - Proper open-source licensing
7. **Reproducibility Instructions** - Step-by-step reproduction guide
8. **Metadata Completeness** - Comprehensive research information

## Score Categories

- **Excellent (90-100)**: Comprehensive reproducibility package
- **Good (75-89)**: Well-documented with minor gaps
- **Fair (60-74)**: Basic reproducibility features present
- **Poor (0-59)**: Significant reproducibility issues

## Error Handling

### Common Error Codes

- `400 Bad Request`: Invalid request format or missing required fields
- `413 Payload Too Large`: Content exceeds size limits
- `422 Unprocessable Entity`: Content cannot be processed
- `500 Internal Server Error`: Server-side processing error
- `503 Service Unavailable`: External API (Gemini) unavailable

### Fallback Behavior

When Gemini API is unavailable or not configured:
- System automatically falls back to enhanced heuristic scoring
- Response includes `"provider": "heuristic"` indicator
- Maintains full functionality with rule-based analysis

## Usage Examples

### Summarizing PDF Content
```javascript
const base64Pdf = 'JVBERi0xLjQKMSAwIG9iag...'; // Your PDF in base64

const response = await fetch('/api/analyze/summarize-base64', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sourceType: 'pdf',
    data: base64Pdf,
    options: {
      summaryStyle: 'bullets',
      maxPoints: 5
    }
  })
});

const result = await response.json();
console.log(result.summary);
```

### Analyzing Research Reproducibility
```javascript
const manifest = {
  title: "Machine Learning Model for Climate Prediction",
  description: "A comprehensive study using neural networks to predict climate patterns",
  category: "Environmental Science",
  authors: ["Dr. Sarah Chen", "Prof. Michael Rodriguez"],
  files: [
    { name: "README.md", size: 5000 },
    { name: "requirements.txt", size: 800 },
    { name: "main.py", size: 15000 },
    { name: "test_model.py", size: 3000 },
    { name: "LICENSE", size: 1000 }
  ]
};

const response = await fetch('/api/analyze/reproducibility-score', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ manifest })
});

const analysis = await response.json();
console.log(`Reproducibility Score: ${analysis.score}/100`);
console.log(`Category: ${analysis.category}`);
console.log('Recommendations:', analysis.recommendations);
```

## Rate Limits and Performance

- **Gemini API**: Subject to Google's API rate limits
- **Local Processing**: PDF parsing limited to 50MB files
- **Response Times**: 
  - Text summarization: 1-3 seconds
  - PDF processing: 2-10 seconds
  - AI scoring: 3-8 seconds
  - Heuristic scoring: <1 second

## Security Considerations

- All uploaded content is processed in memory and not stored permanently
- Base64 content is validated and sanitized
- API key management follows secure environment variable practices
- Rate limiting recommended for production deployment

## Testing

Run comprehensive tests with:
```bash
npm test
```

Tests cover:
- Base64 PDF summarization
- Text content analysis
- AI-powered reproducibility scoring
- Fallback mechanisms
- Error handling scenarios
- Integration workflows
