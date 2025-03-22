// Import the calendar module
import { initializeCalendar } from './js/calendar.js';

// DOM Elements
const cameraBtn = document.getElementById('cameraBtn');
const uploadModal = document.getElementById('uploadModal');
const closeButtons = document.querySelectorAll('.close-button');
const fileInput = document.getElementById('fileInput');
const uploadBox = document.getElementById('uploadBox');
const analysisResult = document.getElementById('analysisResult');
const calendarBtn = document.getElementById('calendarBtn');
const calendarModal = document.getElementById('calendarModal');
const profileBtn = document.querySelector('.profile-btn');
const profileModal = document.getElementById('profileModal');
let calendar = null;

// Modal handling
function openModal(modal) {
    if (!modal) return;
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize calendar from the shared module
    initializeCalendar();
    
    // Load profile data
    loadProfileData();
    
    // Load events
    updateEventsDisplay();
    
    // Calendar button click is now handled by the calendar module
    
    // Profile button click handler
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            openModal(profileModal);
        });
    }
    
    // Close button handlers for all modals
    document.querySelectorAll('.close-btn, .close-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Handle ESC key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="display: flex"]');
            openModals.forEach(modal => closeModal(modal));
        }
    });
    
    // Handle clicking outside modals
    window.addEventListener('click', (e) => {
        const openModals = document.querySelectorAll('.modal[style*="display: flex"]');
        openModals.forEach(modal => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Tab switching in profile
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Profile image change
    const editProfileImageBtn = document.querySelector('.edit-profile-image');
    if (editProfileImageBtn) {
        editProfileImageBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        document.getElementById('profileImage').src = event.target.result;
                        // Save to localStorage
                        const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
                        profileData.imageUrl = event.target.result;
                        localStorage.setItem('profileData', JSON.stringify(profileData));
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    }
    
    // Settings form submission
    const settingsForm = document.getElementById('profileSettingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const profileData = {
                name: document.getElementById('settingsName').value,
                email: document.getElementById('settingsEmail').value,
                location: document.getElementById('settingsLocation').value,
                bio: document.getElementById('settingsBio').value,
                imageUrl: document.getElementById('profileImage').src
            };
            localStorage.setItem('profileData', JSON.stringify(profileData));
            
            // Update profile display
            document.getElementById('profileName').textContent = profileData.name;
            document.querySelector('.profile-email').textContent = profileData.email;
            
            showNotification('Profile updated successfully!');
        });
    }
    
    // Camera button handler
    if (cameraBtn) {
        cameraBtn.addEventListener('click', () => {
            openModal(uploadModal);
        });
    }
    
    // Initialize image upload
    initializeImageUpload();
});

// Load profile data from localStorage
function loadProfileData() {
    const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.querySelector('.profile-email');
    const profileImage = document.getElementById('profileImage');
    const settingsName = document.getElementById('settingsName');
    const settingsEmail = document.getElementById('settingsEmail');
    const settingsLocation = document.getElementById('settingsLocation');
    const settingsBio = document.getElementById('settingsBio');
    
    if (Object.keys(profileData).length > 0) {
        // Update profile information
        if (profileData.name && profileName) {
            profileName.textContent = profileData.name;
            if (settingsName) settingsName.value = profileData.name;
        }
        if (profileData.email && profileEmail) {
            profileEmail.textContent = profileData.email;
            if (settingsEmail) settingsEmail.value = profileData.email;
        }
        if (profileData.location && settingsLocation) {
            settingsLocation.value = profileData.location;
        }
        if (profileData.bio && settingsBio) {
            settingsBio.value = profileData.bio;
        }
        if (profileData.imageUrl && profileImage) {
            profileImage.src = profileData.imageUrl;
        }
    }
}

// Function to create event card
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    // Format the date and time
    const eventDate = new Date(`${event.date}T${event.startTime}`);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = `${event.startTime.slice(0, -3)} - ${event.endTime.slice(0, -3)}`;
    
    card.innerHTML = `
        <img src="${event.imageData}" alt="${event.title}" class="event-image">
        <div class="event-content">
            <h3 class="event-title">${event.title}</h3>
            <div class="event-details">
                <div class="event-detail">
                    <i class="fas fa-calendar"></i>
                    <span>${formattedDate}</span>
                </div>
                <div class="event-detail">
                    <i class="fas fa-clock"></i>
                    <span>${formattedTime}</span>
                </div>
                <div class="event-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
            </div>
            <p class="event-description">${event.description}</p>
            <div class="event-actions">
                <button class="event-action-btn event-join-btn">
                    <i class="fas fa-user-plus"></i>
                    Join Event
                </button>
                <button class="event-action-btn event-share-btn">
                    <i class="fas fa-share"></i>
                    Share
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Function to update events display
function updateEventsDisplay() {
    const eventsContainer = document.getElementById('eventsContainer');
    if (!eventsContainer) return;
    
    // Clear existing events
    eventsContainer.innerHTML = '';
    
    // Get events from localStorage
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    
    // Sort events by date and time
    events.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA - dateB;
    });
    
    // Create and append event cards
    events.forEach(event => {
        const card = createEventCard(event);
        eventsContainer.appendChild(card);
    });
    
    // Update calendar if it exists
    if (calendar) {
        calendar.refetchEvents();
    }
}

function handleImageSelect(e) {
    const file = e.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const previewContainer = document.querySelector('.image-preview');
            if (previewContainer) {
                previewContainer.innerHTML = `<img src="${event.target.result}" alt="Event Image Preview">`;
                previewContainer.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
}

// Initialize image upload functionality
function initializeImageUpload() {
    const imageInput = document.getElementById('eventImage');
    const uploadContainer = document.querySelector('.image-upload-container');
    const previewContainer = document.querySelector('.image-preview');
    
    if (imageInput) {
        imageInput.addEventListener('change', handleImageSelect);
        
        uploadContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadContainer.classList.add('drag-over');
        });
        
        uploadContainer.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadContainer.classList.remove('drag-over');
        });
        
        uploadContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadContainer.classList.remove('drag-over');
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                imageInput.files = e.dataTransfer.files;
                handleImageSelect({ target: { files: [file] } });
            }
        });
    }
}
