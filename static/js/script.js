// DOM Elements
const cameraBtn = document.getElementById('cameraBtn');
const uploadModal = document.getElementById('uploadModal');
const closeButtons = document.querySelectorAll('.close-button');
const fileInput = document.getElementById('fileInput');
const uploadBox = document.getElementById('uploadBox');
const analysisResult = document.getElementById('analysisResult');

// Modal handling
function openModal(modal) {
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        // Reset the analysis result when closing
        analysisResult.style.display = 'none';
        analysisResult.classList.remove('loading');
    }, 300);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Camera button click handler (opens upload modal)
    if (cameraBtn) {
        cameraBtn.addEventListener('click', () => {
            openModal(uploadModal);
        });
    }
    
    // Close button handlers
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Handle ESC key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.active');
            if (openModal) closeModal(openModal);
        }
    });
    
    // Handle clicking outside modal
    window.addEventListener('click', (e) => {
        const openModal = document.querySelector('.modal.active');
        if (e.target === openModal) {
            closeModal(openModal);
        }
    });
    
    // File input change handler
    fileInput.addEventListener('change', handleFileUpload);
    
    // Drag and drop handlers
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.style.borderStyle = 'solid';
    });
    
    uploadBox.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadBox.style.borderStyle = 'dashed';
    });
    
    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.style.borderStyle = 'dashed';
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload({ target: { files: [file] } });
        }
    });
});

// File upload and analysis
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showStatus('Please select an image file.', 'error');
        return;
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        showStatus('Image size should be less than 10MB.', 'error');
        return;
    }
    
    try {
        // Show loading state
        const analysisResult = document.getElementById('analysisResult');
        analysisResult.style.display = 'block';
        analysisResult.classList.add('loading');
        const resultContent = analysisResult.querySelector('.result-content');
        resultContent.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Analyzing your product...</p>
        `;
        
        // Convert image to base64
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                // Send image to server for analysis
                const response = await fetch('/api/analyze-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        image: e.target.result
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to analyze image');
                }
                
                const data = await response.json();
                
                if (data.error) {
                    throw new Error(data.error);
                }
                
                // Format and display results
                analysisResult.classList.remove('loading');
                resultContent.innerHTML = formatAnalysisResults(data.analysis);
                showStatus('Analysis complete!', 'success');
                
            } catch (error) {
                handleAnalysisError(error);
            }
        };
        
        reader.onerror = function() {
            handleAnalysisError(new Error('Failed to read the image file'));
        };
        
        reader.readAsDataURL(file);
        
    } catch (error) {
        handleAnalysisError(error);
    }
}

function handleAnalysisError(error) {
    console.error('Error:', error);
    const analysisResult = document.getElementById('analysisResult');
    analysisResult.classList.remove('loading');
    const resultContent = analysisResult.querySelector('.result-content');
    resultContent.innerHTML = `
        <div class="error-message">
            <p><strong>Error:</strong> ${error.message || 'Failed to analyze image'}</p>
            <p>Please try again with a different image or check your internet connection.</p>
        </div>
    `;
    showStatus('Analysis failed. Please try again.', 'error');
}

function formatAnalysisResults(analysis) {
    // Split the analysis into sections based on numbered points
    const sections = analysis.split(/\d+\.\s+/).filter(Boolean);
    
    // Create HTML for each section
    return `
        <div class="analysis-content">
            ${sections.map((section, index) => {
                const [title, ...content] = section.split(':');
                return `
                    <div class="result-section">
                        <h4 class="result-heading">${title.trim()}</h4>
                        <div class="result-text">
                            ${formatContent(content.join(':').trim())}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function formatContent(content) {
    // Convert bullet points to HTML list
    if (content.includes('-')) {
        const items = content.split('-').filter(Boolean);
        return `<ul>${items.map(item => `<li>${item.trim()}</li>`).join('')}</ul>`;
    }
    
    // Handle regular paragraphs
    return content.split('\n').map(line => `<p>${line.trim()}</p>`).join('');
}

function showStatus(message, type = 'info') {
    const status = document.querySelector('.status-message');
    if (status) {
        status.textContent = message;
        status.className = `status-message ${type}`;
        status.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    }
}
