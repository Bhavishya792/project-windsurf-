// Import the calendar module
import { initializeCalendar } from './js/calendar.js';

// Configuration import
import { GOOGLE_MAPS_API_KEY } from './config.js';

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
let map = null;

// Add fallback for profile images
document.addEventListener('DOMContentLoaded', function() {
    // Set default image for profile pictures that fail to load
    const profileImages = document.querySelectorAll('.user-info img');
    profileImages.forEach(img => {
        img.onerror = function() {
            this.src = 'assets/default-profile.png';
            console.log('Profile image failed to load, using default image');
        };
    });
    
    console.log('Profile image fallback handlers added');
});

// Load Google Maps API dynamically
function loadGoogleMapsAPI() {
    // Use the actual API key from the .env file
    const apiKey = GOOGLE_MAPS_API_KEY;
    
    // Create the script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initializeGoogleMaps`;
    script.async = true;
    script.defer = true;
    
    // Add the script to the document
    document.head.appendChild(script);
}

// Callback for Google Maps API
window.initializeGoogleMaps = function() {
    // Initialize map on the homepage
    const homeMap = document.getElementById('map');
    if (homeMap) {
        map = initializeMap('map');
    }
    
    // Initialize map on the volunteer page
    const volunteerMap = document.getElementById('map');
    if (volunteerMap && window.location.href.includes('volunteer.html')) {
        map = initializeMap('map');
    }
};

// Map initialization
function initializeMap(mapId) {
    const mapElement = document.getElementById(mapId);
    if (!mapElement) return null;

    // Map styling to match the website theme
    const mapStyle = [
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#4CAF50"}]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{"color": "#e8f5e9"}]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{"color": "#c8e6c9"}]
        }
    ];

    // Delhi, India as default fallback location
    const delhiLocation = { lat: 28.6139, lng: 77.2090 };
    const defaultLocation = { lat: 20.5937, lng: 78.9629 }; // Center of India
    
    const mapOptions = {
        zoom: 5,
        center: defaultLocation,
        styles: mapStyle,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'cooperative'
    };

    const googleMap = new google.maps.Map(mapElement, mapOptions);
    const service = new google.maps.places.PlacesService(googleMap);
    const locationStatus = document.querySelector('.location-status');
    
    // Create markers array to track all markers
    const markers = [];
    
    // Track if a search is in progress
    let searchInProgress = false;

    // Get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Add marker for user's location
                const userMarker = new google.maps.Marker({
                    position: userLocation,
                    map: googleMap,
                    title: 'Your Location',
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: '#4CAF50',
                        fillOpacity: 1,
                        strokeColor: '#fff',
                        strokeWeight: 2
                    }
                });
                
                markers.push(userMarker);

                googleMap.setCenter(userLocation);
                googleMap.setZoom(12);

                if (locationStatus) {
                    locationStatus.textContent = 'Location found successfully!';
                    locationStatus.classList.remove('error');
                    locationStatus.classList.add('success');
                }
                
                // Find recycling centers in 10km radius
                if (!searchInProgress) {
                    searchInProgress = true;
                    findRecyclingCenters(googleMap, service, userLocation, 10000, markers, () => {
                        searchInProgress = false;
                    });
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                if (locationStatus) {
                    locationStatus.textContent = 'Could not get your location. Using Delhi, India as default.';
                    locationStatus.classList.add('error');
                }
                
                // Use Delhi as fallback and mark it
                googleMap.setCenter(delhiLocation);
                googleMap.setZoom(11);
                
                // Add marker for Delhi
                const delhiMarker = new google.maps.Marker({
                    position: delhiLocation,
                    map: googleMap,
                    title: 'Delhi, India',
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: '#4CAF50',
                        fillOpacity: 1,
                        strokeColor: '#fff',
                        strokeWeight: 2
                    }
                });
                
                markers.push(delhiMarker);
                
                // Search for recycling centers in Delhi
                if (!searchInProgress) {
                    searchInProgress = true;
                    findRecyclingCenters(googleMap, service, delhiLocation, 10000, markers, () => {
                        searchInProgress = false;
                    });
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 7000,
                maximumAge: 0
            }
        );
    } else {
        if (locationStatus) {
            locationStatus.textContent = 'Geolocation is not supported by your browser. Using Delhi, India as default.';
            locationStatus.classList.add('error');
        }
        
        // Use Delhi as fallback
        googleMap.setCenter(delhiLocation);
        googleMap.setZoom(11);
        
        // Add marker for Delhi
        const delhiMarker = new google.maps.Marker({
            position: delhiLocation,
            map: googleMap,
            title: 'Delhi, India',
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#4CAF50',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2
            }
        });
        
        markers.push(delhiMarker);
        
        // Search for recycling centers in Delhi
        searchInProgress = true;
        findRecyclingCenters(googleMap, service, delhiLocation, 10000, markers, () => {
            searchInProgress = false;
        });
    }
    
    // Connect click handlers for the buttons if they exist
    const recyclingBtn = document.getElementById('recyclingBtn');
    const compostingBtn = document.getElementById('compostingBtn');
    
    // Set up radius slider
    const radiusSlider = document.getElementById('radiusSlider');
    const radiusValue = document.getElementById('radiusValue');
    
    if (radiusSlider && radiusValue) {
        let searchRadius = 10; // Default 10km
        radiusValue.textContent = `${searchRadius} km`;
        
        radiusSlider.addEventListener('input', function() {
            searchRadius = parseInt(this.value);
            radiusValue.textContent = `${searchRadius} km`;
        });
    }
    
    if (recyclingBtn) {
        recyclingBtn.addEventListener('click', () => {
            if (!searchInProgress) {
                recyclingBtn.classList.add('loading');
                const buttonText = recyclingBtn.querySelector('.button-text');
                if (buttonText) buttonText.textContent = 'Searching...';
                
                // Get search location (user's location or Delhi fallback)
                let searchLocation = delhiLocation; // Default to Delhi
                
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            searchLocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            performSearch();
                        },
                        (error) => {
                            console.error('Geolocation error:', error);
                            performSearch(); // Will use Delhi as fallback
                        }
                    );
                } else {
                    performSearch(); // Will use Delhi as fallback
                }
                
                function performSearch() {
                    // Clear existing markers except user/delhi location
                    clearMarkers(markers, 1);
                    // Get radius from slider if available
                    const radius = radiusSlider ? parseInt(radiusSlider.value) * 1000 : 10000;
                    
                    // Find recycling centers
                    searchInProgress = true;
                    findRecyclingCenters(googleMap, service, searchLocation, radius, markers, () => {
                        searchInProgress = false;
                        recyclingBtn.classList.remove('loading');
                        if (buttonText) buttonText.textContent = 'Find Recycling Centers';
                    });
                }
            }
        });
    }
    
    if (compostingBtn) {
        compostingBtn.addEventListener('click', () => {
            if (!searchInProgress) {
                compostingBtn.classList.add('loading');
                const buttonText = compostingBtn.querySelector('.button-text');
                if (buttonText) buttonText.textContent = 'Searching...';
                
                // Get search location (user's location or Delhi fallback)
                let searchLocation = delhiLocation; // Default to Delhi
                
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            searchLocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            performSearch();
                        },
                        (error) => {
                            console.error('Geolocation error:', error);
                            performSearch(); // Will use Delhi as fallback
                        }
                    );
                } else {
                    performSearch(); // Will use Delhi as fallback
                }
                
                function performSearch() {
                    // Clear existing markers except user/delhi location
                    clearMarkers(markers, 1);
                    // Get radius from slider if available
                    const radius = radiusSlider ? parseInt(radiusSlider.value) * 1000 : 10000;
                    
                    // Find composting centers
                    searchInProgress = true;
                    findCompostingCenters(googleMap, service, searchLocation, radius, markers, () => {
                        searchInProgress = false;
                        compostingBtn.classList.remove('loading');
                        if (buttonText) buttonText.textContent = 'Find Composting Centers';
                    });
                }
            }
        });
    }

    return { map: googleMap, service, markers };
}

// Function to find recycling centers
function findRecyclingCenters(map, service, location, radius, markers, callback, autoExpandSearch = true) {
    const request = {
        location: location,
        radius: radius,
        keyword: 'waste management recycling'
    };
    
    const resultsSummary = document.querySelector('.results-summary');
    
    if (resultsSummary) resultsSummary.textContent = 'Searching for recycling centers...';
    
    service.nearbySearch(request, (results, status) => {
        // Handle all possible status results
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            // No filtering - show all results to ensure we get something
            const filteredResults = results;
            
            if (filteredResults.length > 0) {
                if (resultsSummary) {
                    resultsSummary.textContent = `Found ${filteredResults.length} recycling centers within ${radius/1000}km of location`;
                }
                
                filteredResults.forEach((place, i) => {
                    // Create marker for each place
                    const marker = new google.maps.Marker({
                        position: place.geometry.location,
                        map: map,
                        title: place.name,
                        animation: google.maps.Animation.DROP,
                        icon: {
                            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                        }
                    });
                    
                    markers.push(marker);
                    
                    // Create info window
                    const infoWindow = new google.maps.InfoWindow({
                        content: `
                            <div class="info-window">
                                <h3>${place.name}</h3>
                                <div>${place.vicinity || ''}</div>
                                <div>Rating: ${place.rating ? place.rating + '/5' : 'N/A'}</div>
                            </div>
                        `
                    });
                    
                    // Add click listener to marker
                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });
                });
            } else {
                tryExpandRadius();
            }
        } else {
            console.error('Places search error or no results found:', status);
            tryExpandRadius();
        }
        
        // Function to expand radius and search again
        function tryExpandRadius() {
            if (autoExpandSearch && radius < 50000) {
                // Increment radius by 10km and try again
                const newRadius = Math.min(radius + 10000, 50000);
                if (resultsSummary) {
                    resultsSummary.textContent = `No centers found within ${radius/1000}km. Expanding search to ${newRadius/1000}km...`;
                }
                
                // Update the radius slider if it exists
                const radiusSlider = document.getElementById('radiusSlider');
                const radiusValue = document.getElementById('radiusValue');
                if (radiusSlider && radiusValue) {
                    radiusSlider.value = newRadius / 1000;
                    radiusValue.textContent = `${newRadius / 1000} km`;
                }
                
                // Try again with increased radius
                findRecyclingCenters(map, service, location, newRadius, markers, callback, true);
            } else {
                if (resultsSummary) {
                    resultsSummary.textContent = `No recycling centers found within 50km. Try a different location.`;
                }
                if (callback) callback();
            }
        }
        
        // If we found results, we're done
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            if (callback) callback();
        }
    });
}

// Function to find composting centers
function findCompostingCenters(map, service, location, radius, markers, callback, autoExpandSearch = true) {
    const request = {
        location: location,
        radius: radius,
        keyword: 'compost facility garden waste'
    };
    
    const resultsSummary = document.querySelector('.results-summary');
    
    if (resultsSummary) resultsSummary.textContent = 'Searching for composting centers...';
    
    service.nearbySearch(request, (results, status) => {
        // Handle all possible status results
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            // No filtering - show all results to ensure we get something
            const filteredResults = results;
            
            if (filteredResults.length > 0) {
                if (resultsSummary) {
                    resultsSummary.textContent = `Found ${filteredResults.length} composting centers within ${radius/1000}km of location`;
                }
                
                filteredResults.forEach((place, i) => {
                    // Create marker for each place
                    const marker = new google.maps.Marker({
                        position: place.geometry.location,
                        map: map,
                        title: place.name,
                        animation: google.maps.Animation.DROP,
                        icon: {
                            url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                        }
                    });
                    
                    markers.push(marker);
                    
                    // Create info window
                    const infoWindow = new google.maps.InfoWindow({
                        content: `
                            <div class="info-window">
                                <h3>${place.name}</h3>
                                <div>${place.vicinity || ''}</div>
                                <div>Rating: ${place.rating ? place.rating + '/5' : 'N/A'}</div>
                            </div>
                        `
                    });
                    
                    // Add click listener to marker
                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });
                });
            } else {
                tryExpandRadius();
            }
        } else {
            console.error('Places search error or no results found:', status);
            tryExpandRadius();
        }
        
        // Function to expand radius and search again
        function tryExpandRadius() {
            if (autoExpandSearch && radius < 50000) {
                // Increment radius by 10km and try again
                const newRadius = Math.min(radius + 10000, 50000);
                if (resultsSummary) {
                    resultsSummary.textContent = `No centers found within ${radius/1000}km. Expanding search to ${newRadius/1000}km...`;
                }
                
                // Update the radius slider if it exists
                const radiusSlider = document.getElementById('radiusSlider');
                const radiusValue = document.getElementById('radiusValue');
                if (radiusSlider && radiusValue) {
                    radiusSlider.value = newRadius / 1000;
                    radiusValue.textContent = `${newRadius / 1000} km`;
                }
                
                // Try again with increased radius
                findCompostingCenters(map, service, location, newRadius, markers, callback, true);
            } else {
                if (resultsSummary) {
                    resultsSummary.textContent = `No composting centers found within 50km. Try a different location.`;
                }
                if (callback) callback();
            }
        }
        
        // If we found results, we're done
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
            if (callback) callback();
        }
    });
}

// Function to clear markers
function clearMarkers(markers, keepCount = 0) {
    if (markers && markers.length > keepCount) {
        for (let i = keepCount; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers.splice(keepCount);
    }
}

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
    
    // Load Google Maps API
    loadGoogleMapsAPI();
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
