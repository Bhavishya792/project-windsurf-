const { GoogleGenerativeAI } = require('@google/generative-ai');
const multipart = require('lambda-multipart-parser');

// Netlify function handler
exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Parse the multipart form data
    const formData = await multipart.parse(event);
    const query = formData.query || '';
    let imageContent = null;
    
    // Check for image file
    if (formData.files && formData.files.length > 0) {
      const file = formData.files[0];
      imageContent = file.content.toString('base64');
    }

    if (!query) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Query is required' })
      };
    }

    // Initialize Gemini AI
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(geminiApiKey);

    // Decide which model to use
    const modelName = imageContent ? 'gemini-pro-vision' : 'gemini-pro';
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `You are a repair expert. I need help fixing: ${query}

Please provide a detailed repair guide in this EXACT format (keep the exact headings and structure):

TOOLS:
- [List each required tool, one per line]

STEPS:
1. [Detailed first step]
2. [Detailed second step]
[Continue with numbered steps]

SAFETY:
- [List each safety precaution, one per line]

DIFFICULTY: [Easy/Medium/Hard]

COST_SAVINGS: [Estimated amount saved in USD]

PROFESSIONAL: [Yes/No - Answer Yes if professional help is recommended]

VIDEOS:
- [Specific search terms for helpful repair videos]`;

    // Prepare the parts array for the API request
    let parts = [{ text: prompt }];
    
    // Add image if present
    if (imageContent) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageContent
        }
      });
    }

    // Generate content
    const aiResult = await model.generateContent(parts);
    const response = await aiResult.response;
    const text = response.text();

    // Parse the results
    const result = parseGeminiResponse(text);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error generating repair guide:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate repair guide',
        details: error.message
      })
    };
  }
};

// Parse the Gemini response into structured data
function parseGeminiResponse(response) {
  try {
    const result = {
      tools: [],
      steps: [],
      safety: [],
      difficulty: '',
      costSavings: '',
      professional: '',
      videos: []
    };

    // Parse tools section
    const toolsMatch = response.match(/TOOLS:\s*\n([\s\S]*?)(?=\n\s*STEPS:)/i);
    if (toolsMatch && toolsMatch[1]) {
      result.tools = toolsMatch[1].split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => line.substring(1).trim())
        .filter(Boolean);
    }

    // Parse steps section
    const stepsMatch = response.match(/STEPS:\s*\n([\s\S]*?)(?=\n\s*SAFETY:)/i);
    if (stepsMatch && stepsMatch[1]) {
      result.steps = stepsMatch[1].split('\n')
        .map(line => line.trim())
        .filter(line => /^\d+\./.test(line))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(Boolean);
    }

    // Parse safety section
    const safetyMatch = response.match(/SAFETY:\s*\n([\s\S]*?)(?=\n\s*DIFFICULTY:)/i);
    if (safetyMatch && safetyMatch[1]) {
      result.safety = safetyMatch[1].split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => line.substring(1).trim())
        .filter(Boolean);
    }

    // Parse difficulty
    const difficultyMatch = response.match(/DIFFICULTY:\s*([^\n]+)/i);
    if (difficultyMatch && difficultyMatch[1]) {
      result.difficulty = difficultyMatch[1].trim();
    }

    // Parse cost savings
    const costMatch = response.match(/COST_SAVINGS:\s*([^\n]+)/i);
    if (costMatch && costMatch[1]) {
      result.costSavings = costMatch[1].trim();
    }

    // Parse professional advice
    const proMatch = response.match(/PROFESSIONAL:\s*([^\n]+)/i);
    if (proMatch && proMatch[1]) {
      result.professional = proMatch[1].trim();
    }

    // Parse videos
    const videosMatch = response.match(/VIDEOS:\s*\n([\s\S]*)/i);
    if (videosMatch && videosMatch[1]) {
      result.videos = videosMatch[1].split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => line.substring(1).trim())
        .filter(Boolean);
    }

    return result;
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return {
      error: 'Failed to parse response',
      rawResponse: response
    };
  }
}
