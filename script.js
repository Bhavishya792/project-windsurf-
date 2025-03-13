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
        analysisResult.style.display = 'block';
        analysisResult.classList.add('loading');
        const resultContent = analysisResult.querySelector('.result-content');
        resultContent.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Analyzing your product...</p>
        `;
        
        // Create form data
        const formData = new FormData();
        formData.append('image', file);
        
        // Send request to server
        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to analyze image');
        }
        
        // Format and display results
        analysisResult.classList.remove('loading');
        resultContent.innerHTML = formatAnalysisResults(data.analysis);
        showStatus('Analysis complete!', 'success');
        
    } catch (error) {
        console.error('Error:', error);
        analysisResult.classList.remove('loading');
        const resultContent = analysisResult.querySelector('.result-content');
        resultContent.innerHTML = `
            <div class="error-message">
                <p><strong>Error:</strong> ${error.message}</p>
                <p>Please try again with a different image or check your internet connection.</p>
            </div>
        `;
        showStatus('Analysis failed. Please try again.', 'error');
    }
}

function formatAnalysisResults(analysis) {
    // Split the analysis into sections based on numbered points
    const sections = analysis.split(/\d+\.\s+/).filter(Boolean);
    
    let html = '<div class="analysis-content">';
    
    // Map known section titles
    const sectionTitles = [
        'Product Description',
        'Material Analysis',
        'Recycling Instructions',
        'Recyclability Score',
        'Environmental Impact',
        'Cost-Effectiveness',
        'Alternative Uses',
        'Special Notes'
    ];
    
    sections.forEach((section, index) => {
        if (index < sectionTitles.length) {
            html += `
                <div class="result-section">
                    <h4 class="result-heading">${sectionTitles[index]}</h4>
                    <div class="result-text">${formatSection(section)}</div>
                </div>
            `;
        }
    });
    
    html += '</div>';
    return html;
}

function formatSection(text) {
    // Convert bullet points to HTML list
    text = text.replace(/\n\s*-\s+/g, '</li><li>');
    if (text.includes('<li>')) {
        text = '<ul><li>' + text.substring(text.indexOf('<li>') + 4) + '</li></ul>';
    }
    
    // Convert newlines to paragraphs
    text = text.split('\n')
        .filter(line => line.trim())
        .map(line => `<p>${line}</p>`)
        .join('');
    
    return text;
}

function showStatus(message, type = 'info') {
    const statusDiv = document.createElement('div');
    statusDiv.className = `status-message ${type}`;
    statusDiv.textContent = message;
    document.body.appendChild(statusDiv);
    
    setTimeout(() => {
        statusDiv.classList.add('fade-out');
        setTimeout(() => statusDiv.remove(), 500);
    }, 3000);
}
