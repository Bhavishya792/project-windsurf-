import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeImage(base64Image) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        
        const prompt = `Analyze this product image and provide the following information:
        1. Step by step recycling procedure for this product
        2. Whether it is recyclable or not
        3. Whether it is cost effective to recycle it

        Format the response in clear sections with appropriate headings.`;

        // Convert base64 to parts array for Gemini
        const parts = [
            { text: prompt },
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Image
                }
            }
        ];

        const result = await model.generateContent(parts);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error analyzing image:', error);
        if (error.message.includes('API key')) {
            throw new Error('Invalid API key. Please check your configuration.');
        } else if (error.message.includes('model')) {
            throw new Error('Model configuration error. Please try again.');
        }
        throw new Error('Failed to analyze image. Please try again later.');
    }
}

export { analyzeImage };
