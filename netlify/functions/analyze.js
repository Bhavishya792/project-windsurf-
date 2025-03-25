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

    // Parse the multipart form data (file upload)
    const formData = await multipart.parse(event);
    
    if (!formData.files || formData.files.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No image file provided' })
      };
    }

    const file = formData.files[0];
    
    // Convert file buffer to base64
    const imageBase64 = file.content.toString('base64');

    // Initialize Gemini AI
    // Get API key from environment variables
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(geminiApiKey);

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    // Prepare the prompt
    const prompt = `Analyze this product image and provide detailed recycling information in the following format:

1. Product Description: Briefly describe what you see in the image.
2. Material Analysis: List the materials you can identify.
3. Recycling Instructions:
   - Step-by-step guide on how to recycle this item
   - Any preparation needed (cleaning, disassembly, etc.)
4. Recyclability Score: Rate from 1-10 (10 being most recyclable)
5. Environmental Impact: Brief explanation of environmental impact
6. Cost-Effectiveness: Estimate the value of recycling vs. disposal
7. Alternative Uses: Suggest any potential reuse options
8. Special Notes: Any warnings or special considerations

Please be specific and practical in your recommendations.`;

    // Generate content
    const aiResult = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: file.contentType,
          data: imageBase64
        }
      }
    ]);

    const response = await aiResult.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        analysis: text
      })
    };

  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Provide more specific error messages
    let errorMessage = 'An error occurred while analyzing the image.';
    if (error.message.includes('API key')) {
      errorMessage = 'Invalid API key. Please check your configuration.';
    } else if (error.message.includes('quota')) {
      errorMessage = 'API quota exceeded. Please try again later.';
    } else if (error.message.includes('content filtered')) {
      errorMessage = 'The image content could not be processed. Please try a different image.';
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        details: error.message
      })
    };
  }
};
