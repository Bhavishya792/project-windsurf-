import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeImage(base64Image) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        
        const prompt = `Analyze this product image and provide the following information in clearly labeled sections using these EXACT headings:

Product Description:
Provide a brief but informative description of what the product is, its apparent purpose, and any notable features visible in the image.

Materials:
List and describe the main materials that compose this product based on visual analysis.

Recycling Guide:
1. Provide a numbered, step-by-step guide on how to properly recycle this product. Include any disassembly steps if needed.
2. Mention if specific parts should be recycled differently.
3. Include information about local recycling facilities or programs that might accept this type of item.

Energy Savings:
Quantify the estimated energy savings by recycling this product instead of producing a new one. Present this in symbolic terms like "equivalent to X hours of light bulb usage" or "X kilometers of car travel."

Cost Savings:
Estimate the cost savings in Indian Rupees (INR) from recycling or reusing this product rather than buying a new one.

Environmental Impact:
Describe the positive environmental impact of properly recycling this item instead of sending it to a landfill. Mention specifics like reduced CO2 emissions, water savings, or reduction in raw material extraction.

Your response should be factual, educational, and formatted for easy reading. Be specific to the actual product in the image, not generic responses.`;

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
