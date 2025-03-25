// Import the calendar module
import { initializeCalendar } from './js/calendar.js';

// Import the repair guide service that uses Netlify Functions
import { getRepairGuide } from './js/repair-guide-service.js';

// Global variables for the repair guide functionality
let selectedImage = null;
let repairGuide, loadingIndicator, imagePreview, toolsList, stepsList, safetyList;
let difficultyLevel, difficultyBadge, costSavings, professionalAdvice, videoLinks;

// Handler for image change (used by the inline onchange event)
function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
        selectedImage = file;
        document.getElementById('attachImage').innerHTML = `<i class="fas fa-check"></i> Image Added`;
        
        // Show image preview
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('imagePreview').innerHTML = `<img src="${e.target.result}" alt="Item preview">`;
        };
        reader.readAsDataURL(file);
    }
}

// Handler for the Get Repair Guide button (used by the inline onclick event)
async function handleGetRepairGuide() {
    const query = document.getElementById('repairQuery').value.trim();
    if (!query) {
        alert('Please describe the item you want to repair.');
        return;
    }

    try {
        // Initialize DOM elements if not already done
        if (!repairGuide) {
            repairGuide = document.getElementById('repairGuide');
            loadingIndicator = document.getElementById('loadingIndicator');
            toolsList = document.getElementById('toolsList');
            stepsList = document.getElementById('stepsList');
            safetyList = document.getElementById('safetyList');
            difficultyLevel = document.getElementById('difficultyLevel');
            difficultyBadge = document.getElementById('difficultyBadge');
            costSavings = document.getElementById('costSavings');
            professionalAdvice = document.getElementById('professionalAdvice');
            videoLinks = document.getElementById('videoLinks');
        }

        // Show loading state
        document.getElementById('getHelp').disabled = true;
        loadingIndicator.classList.remove('hidden');
        repairGuide.classList.add('hidden');

        // Get repair guide data from the Netlify Function
        const guide = await getRepairGuide(query, selectedImage);
        displayRepairGuide(guide);
    } catch (error) {
        console.error('Error:', error);
        alert('Sorry, there was an error analyzing your request. Please try again.');
    } finally {
        document.getElementById('getHelp').disabled = false;
        loadingIndicator.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the calendar from the shared module
    initializeCalendar();
    
    // Initialize DOM elements
    repairGuide = document.getElementById('repairGuide');
    loadingIndicator = document.getElementById('loadingIndicator');
    imagePreview = document.getElementById('imagePreview');
    toolsList = document.getElementById('toolsList');
    stepsList = document.getElementById('stepsList');
    safetyList = document.getElementById('safetyList');
    difficultyLevel = document.getElementById('difficultyLevel');
    difficultyBadge = document.getElementById('difficultyBadge');
    costSavings = document.getElementById('costSavings');
    professionalAdvice = document.getElementById('professionalAdvice');
    videoLinks = document.getElementById('videoLinks');

    const attachImageBtn = document.getElementById('attachImage');
    const itemImageInput = document.getElementById('itemImage');
    const getHelpBtn = document.getElementById('getHelp');

    attachImageBtn.addEventListener('click', () => {
        itemImageInput.click();
    });

    itemImageInput.addEventListener('change', handleImageChange);

    getHelpBtn.addEventListener('click', handleGetRepairGuide);
});

async function getBase64Image(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

// Display the repair guide data in the UI
function displayRepairGuide(guide) {
    if (!guide) {
        console.error('No guide data received');
        return;
    }

    // Clear previous results
    toolsList.innerHTML = '';
    stepsList.innerHTML = '';
    safetyList.innerHTML = '';
    videoLinks.innerHTML = '';

    // Populate tools list
    guide.tools.forEach(tool => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-tools"></i> ${tool}`;
        toolsList.appendChild(li);
    });

    // Populate steps list
    guide.steps.forEach((step, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="step-number">${index + 1}</span> ${step}`;
        stepsList.appendChild(li);
    });

    // Populate safety precautions
    guide.safety.forEach(safety => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${safety}`;
        safetyList.appendChild(li);
    });

    // Set difficulty level and badge color
    difficultyLevel.textContent = guide.difficulty || 'Medium';
    
    // Update difficulty badge color
    difficultyBadge.className = 'difficulty-badge'; // Reset classes
    if (guide.difficulty === 'Easy') {
        difficultyBadge.classList.add('easy');
    } else if (guide.difficulty === 'Medium') {
        difficultyBadge.classList.add('medium');
    } else if (guide.difficulty === 'Hard') {
        difficultyBadge.classList.add('hard');
    }

    // Set cost savings
    costSavings.textContent = guide.costSavings || '$50-100';

    // Set professional advice
    professionalAdvice.textContent = guide.professional || 'No';
    professionalAdvice.className = '';
    if (guide.professional === 'Yes') {
        professionalAdvice.classList.add('advised');
    } else {
        professionalAdvice.classList.add('not-advised');
    }

    // Populate video search terms
    guide.videos.forEach(video => {
        const li = document.createElement('li');
        const searchTerm = encodeURIComponent(video);
        li.innerHTML = `<a href="https://www.youtube.com/results?search_query=${searchTerm}" target="_blank">
            <i class="fab fa-youtube"></i> ${video}
        </a>`;
        videoLinks.appendChild(li);
    });

    // Show the repair guide
    loadingIndicator.classList.add('hidden');
    repairGuide.classList.remove('hidden');
}
