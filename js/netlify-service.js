/**
 * Client-side service for interacting with Netlify Functions
 */

// Service for analyzing product images using the Netlify Function
async function analyzeProductImage(imageFile) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    // Call the Netlify function endpoint
    const response = await fetch('/.netlify/functions/analyze', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze image');
    }

    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error('Error in analyzeProductImage:', error);
    throw error;
  }
}

export { analyzeProductImage };
