/**
 * Product Analysis functionality using Netlify Functions
 */

// Function to submit an image for analysis
async function analyzeProduct(imageFile) {
  try {
    // Show loading state
    const analysisResult = document.getElementById('analysisResult');
    const resultContent = analysisResult.querySelector('.result-content');
    
    if (resultContent) {
      resultContent.innerHTML = '<div class="loading"><div class="spinner"></div><p>Analyzing product...</p></div>';
      analysisResult.style.display = 'block';
    }

    // Create form data for the API call
    const formData = new FormData();
    formData.append('image', imageFile);

    // Call the Netlify function
    const response = await fetch('/.netlify/functions/analyze', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to analyze image. Please try again later.');
    }

    const data = await response.json();
    
    if (resultContent) {
      // Format and display the analysis result
      resultContent.innerHTML = formatAnalysisResult(data.analysis);
    }
    
    return data.analysis;
  } catch (error) {
    console.error('Error analyzing product:', error);
    
    const analysisResult = document.getElementById('analysisResult');
    const resultContent = analysisResult.querySelector('.result-content');
    
    if (resultContent) {
      resultContent.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <p>${error.message || 'An error occurred while analyzing the image.'}</p>
          <button id="tryAgainBtn" class="btn">Try Again</button>
        </div>
      `;
      
      // Add event listener for the Try Again button
      document.getElementById('tryAgainBtn').addEventListener('click', () => {
        analysisResult.style.display = 'none';
        document.getElementById('uploadBox').style.display = 'block';
      });
    }
    
    throw error;
  }
}

// Format the raw analysis text into HTML
function formatAnalysisResult(analysisText) {
  // Replace newlines with HTML breaks for proper formatting
  const formattedText = analysisText
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/\d+\.\s/g, '<strong>$&</strong>');
  
  return `
    <div class="analysis-card">
      <p>${formattedText}</p>
      <div class="actions">
        <button id="backToUpload" class="btn"><i class="fas fa-arrow-left"></i> New Analysis</button>
        <button id="downloadAnalysis" class="btn"><i class="fas fa-download"></i> Download PDF</button>
      </div>
    </div>
  `;
}

// Initialize product analysis event listeners
function initProductAnalysis() {
  const uploadBox = document.getElementById('uploadBox');
  const fileInput = document.getElementById('fileInput');
  const analysisResult = document.getElementById('analysisResult');
  
  if (!uploadBox || !fileInput || !analysisResult) return;
  
  // Handle file selection
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    // Hide upload box and show loading
    uploadBox.style.display = 'none';
    
    try {
      await analyzeProduct(file);
      
      // Add event listeners for result actions
      document.getElementById('backToUpload').addEventListener('click', () => {
        analysisResult.style.display = 'none';
        uploadBox.style.display = 'block';
        fileInput.value = '';
      });
      
      document.getElementById('downloadAnalysis').addEventListener('click', () => {
        // Implement PDF download functionality here
        alert('PDF download feature will be available soon!');
      });
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  });
  
  // Handle drag and drop
  uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('dragover');
  });
  
  uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('dragover');
  });
  
  uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      fileInput.dispatchEvent(new Event('change'));
    }
  });
  
  // Handle click to upload
  uploadBox.addEventListener('click', () => {
    fileInput.click();
  });
}

// Execute initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initProductAnalysis);

export { analyzeProduct, initProductAnalysis };
