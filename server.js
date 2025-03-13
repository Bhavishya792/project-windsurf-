const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const port = 3000;

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Configure Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyC32FW2soAQRwzQJUvuqhrsqGvR0kc_ywE');

// Serve static files
app.use(express.static(__dirname));
app.use(express.json());

// Handle image analysis
app.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Convert image buffer to base64
        const imageBase64 = req.file.buffer.toString('base64');

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
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: req.file.mimetype,
                    data: imageBase64
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        res.json({ 
            success: true,
            analysis: text
        });

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
        
        res.status(500).json({ 
            error: errorMessage,
            details: error.message
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
