// Volunteer page functionality
import { GOOGLE_MAPS_API_KEY } from './config.js';
import { initializeCalendar } from './js/calendar.js';

// Initialize distance slider
function initializeDistanceSlider() {
    const distanceRange = document.getElementById('distanceRange');
    const distanceValue = document.getElementById('distanceValue');
    
    if (distanceRange && distanceValue) {
        distanceRange.addEventListener('input', function() {
            distanceValue.textContent = this.value + ' km';
        });
    }
}

// Initialize the page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize calendar
    initializeCalendar();
    
    // Initialize map
    initVolunteerMap();
    
    // Initialize distance slider
    initializeDistanceSlider();
    
    // Other existing initialization code...
    // Set up range slider for distance
    const distanceRange = document.getElementById('distanceRange');
    const distanceValue = document.getElementById('distanceValue');
    
    if (distanceRange && distanceValue) {
        distanceRange.addEventListener('input', function() {
            distanceValue.textContent = this.value + ' km';
        });
    }
    
    // Set up current date as default for date inputs
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (startDateInput && endDateInput) {
        const today = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(today.getMonth() + 1);
        
        startDateInput.valueAsDate = today;
        endDateInput.valueAsDate = nextMonth;
    }
    
    // Set up join buttons
    const joinButtons = document.querySelectorAll('.join-btn');
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the event name from the parent element
            const card = this.closest('.volunteer-card');
            const eventName = card.querySelector('h3').textContent;
            
            // Show confirmation message
            alert(`Thanks for your interest in "${eventName}"! Sign-up functionality will be available soon.`);
        });
    });
    
    // Set up action buttons in the get-started section
    const actionButtons = document.querySelectorAll('.action-buttons button');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('This feature is coming soon! Thank you for your interest.');
        });
    });
    
    // Event data
    const eventData = {
        'Beach Clean-up Drive': {
            requirements: [
                'Water bottle',
                'Comfortable shoes',
                'Sun protection (hat, sunscreen)',
                'Work gloves (will be provided if needed)'
            ],
            coordinator: {
                name: 'Sarah Green',
                image: 'assets/coordinator1.jpg',
                contact: 'sarah.g@ecorise.org'
            },
            additionalInfo: `
                <h4>Safety Guidelines</h4>
                <ul>
                    <li>Always work in pairs</li>
                    <li>Stay within designated areas</li>
                    <li>Report any hazardous items to coordinators</li>
                </ul>
                <h4>Transportation</h4>
                <p>Free shuttle service available from Andheri Station at 6:30 AM</p>
            `
        },
        'Urban Forest Initiative': {
            requirements: [
                'Sturdy shoes',
                'Work gloves',
                'Water bottle',
                'Long-sleeved shirt and pants'
            ],
            coordinator: {
                name: 'Raj Kumar',
                image: 'assets/coordinator2.jpg',
                contact: 'raj.k@ecorise.org'
            },
            additionalInfo: `
                <h4>What You'll Learn</h4>
                <ul>
                    <li>Native tree species identification</li>
                    <li>Proper planting techniques</li>
                    <li>Basic forest ecology</li>
                </ul>
                <h4>Physical Requirements</h4>
                <p>Moderate physical activity involved - ability to bend, dig, and lift up to 10kg</p>
            `
        },
        'Eco-Education Workshop': {
            requirements: [
                'Laptop (optional)',
                'Notebook and pen',
                'Teaching materials (if any)'
            ],
            coordinator: {
                name: 'Priya Shah',
                image: 'assets/coordinator3.jpg',
                contact: 'priya.s@ecorise.org'
            },
            additionalInfo: `
                <h4>Workshop Topics</h4>
                <ul>
                    <li>Climate change basics</li>
                    <li>Sustainable living practices</li>
                    <li>Waste management</li>
                    <li>Conservation techniques</li>
                </ul>
                <h4>Experience Level</h4>
                <p>Prior teaching experience preferred but not required. Training provided.</p>
            `
        },
        'Community Garden Project': {
            requirements: [
                'Gardening gloves',
                'Water bottle',
                'Sun protection',
                'Comfortable work clothes'
            ],
            coordinator: {
                name: 'Amit Patel',
                image: 'assets/coordinator4.jpg',
                contact: 'amit.p@ecorise.org'
            },
            additionalInfo: `
                <h4>Garden Schedule</h4>
                <ul>
                    <li>Morning shift: 7:00 AM - 11:00 AM</li>
                    <li>Evening shift: 3:00 PM - 5:00 PM</li>
                </ul>
                <h4>Activities Include</h4>
                <ul>
                    <li>Planting and maintaining vegetables</li>
                    <li>Composting</li>
                    <li>Irrigation system maintenance</li>
                    <li>Harvest distribution</li>
                </ul>
            `
        }
    };

    // Modal elements
    const modal = document.getElementById('eventModal');
    const closeBtn = modal.querySelector('.close-btn');
    const modalImage = modal.querySelector('.event-image');
    const modalTitle = modal.querySelector('.event-title');
    const modalTags = modal.querySelector('.tag-container');
    const modalLocation = modal.querySelector('.event-location');
    const modalDate = modal.querySelector('.event-date');
    const modalTime = modal.querySelector('.event-time');
    const modalSpots = modal.querySelector('.event-spots');
    const modalDescription = modal.querySelector('.event-description');
    const modalRequirements = modal.querySelector('.event-requirements');
    const coordinatorImage = modal.querySelector('.coordinator-image');
    const coordinatorName = modal.querySelector('.coordinator-name');
    const coordinatorContact = modal.querySelector('.coordinator-contact');
    const additionalInfo = modal.querySelector('.additional-info');

    // Event card click handler
    function openEventModal(card) {
        const title = card.querySelector('h3').textContent;
        const image = card.querySelector('.card-image').style.backgroundImage;
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.outerHTML).join('');
        const location = card.querySelector('.detail-item:nth-child(1) span').textContent;
        const date = card.querySelector('.detail-item:nth-child(2) span').textContent;
        const time = card.querySelector('.detail-item:nth-child(3) span').textContent;
        const spots = card.querySelector('.spots-left span').textContent;
        const description = card.querySelector('.description').textContent;

        // Store event data for sign-up modal
        card.eventData = {
            title,
            description,
            tags,
            location,
            date,
            time,
            spots,
            organizer: {
                name: "Sarah Johnson",
                role: "Environmental Project Coordinator",
                image: "images/organizer1.jpg",
                email: "sarah.johnson@ecorise.org",
                phone: "+1 (555) 123-4567",
                organization: "EcoRise Foundation"
            }
        };

        // Update modal content
        modalImage.style.backgroundImage = image;
        modalTitle.textContent = title;
        modalTags.innerHTML = tags;
        modalLocation.textContent = location;
        modalDate.textContent = date;
        modalTime.textContent = time;
        modalSpots.textContent = spots;
        modalDescription.textContent = description;

        // Get additional data from eventData
        const eventInfo = eventData[title];
        if (eventInfo) {
            // Requirements
            modalRequirements.innerHTML = eventInfo.requirements
                .map(req => `<li>${req}</li>`)
                .join('');

            // Coordinator
            coordinatorImage.src = eventInfo.coordinator.image;
            coordinatorName.textContent = eventInfo.coordinator.name;
            coordinatorContact.textContent = eventInfo.coordinator.contact;

            // Additional Info
            additionalInfo.innerHTML = eventInfo.additionalInfo;
        }

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Sign Up Modal Functionality
    const signupModal = document.getElementById('signupModal');
    let currentEventData = null;

    function openSignupModal(eventData) {
        currentEventData = eventData;
        
        // Update event title
        signupModal.querySelector('.event-title').textContent = eventData.title;
        
        // Update organizer information
        const organizer = eventData.organizer;
        signupModal.querySelector('.organizer-image').src = organizer.image;
        signupModal.querySelector('.organizer-name').textContent = organizer.name;
        signupModal.querySelector('.organizer-role').textContent = organizer.role;
        signupModal.querySelector('.organizer-email').textContent = organizer.email;
        signupModal.querySelector('.organizer-phone').textContent = organizer.phone;
        signupModal.querySelector('.organizer-organization').textContent = organizer.organization;

        // Show the modal
        signupModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSignupModal() {
        signupModal.classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('registrationForm').reset();
    }

    // Update sign up button click handler
    document.querySelectorAll('.sign-up-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isSignedUp = btn.getAttribute('data-signed-up') === 'true';
            const card = e.target.closest('.volunteer-card');
            const spotsElement = card.querySelector('.spots-left span');
            
            if (isSignedUp) {
                // Handle unsign directly
                toggleSignUpState(btn, spotsElement);
            } else {
                // Only show sign up modal if not already signed up
                if (card && card.eventData) {
                    closeEventModal();
                    openSignupModal(card.eventData);
                }
            }
        });
    });

    // Handle registration form submission
    document.getElementById('registrationForm').addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            eventTitle: currentEventData.title,
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            age: document.getElementById('age').value,
            experience: document.getElementById('experience').value,
            requirements: document.getElementById('requirements').value
        };

        // Here you would typically send this data to your backend
        console.log('Registration submitted:', formData);
        
        // Update the sign-up button state
        const eventCard = findEventCardByTitle(currentEventData.title);
        if (eventCard) {
            const signUpBtn = eventCard.querySelector('.sign-up-btn');
            const spotsElement = eventCard.querySelector('.spots-left span');
            toggleSignUpState(signUpBtn, spotsElement, true);
        }
        
        // Show success message
        alert(`Thank you for registering for ${currentEventData.title}!\n\nThe event coordinator (${currentEventData.organizer.name}) will contact you at ${formData.email} with further details.`);
        
        // Close the modal
        closeSignupModal();
    });

    // Helper function to find event card by title
    function findEventCardByTitle(title) {
        return Array.from(document.querySelectorAll('.volunteer-card'))
            .find(card => card.querySelector('h3').textContent === title);
    }

    // Function to toggle sign-up state
    function toggleSignUpState(button, spotsElement, skipConfirmation = false) {
        const isSignedUp = button.getAttribute('data-signed-up') === 'true';
        
        if (isSignedUp) {
            // Confirm before unsigning
            if (!skipConfirmation && !confirm('Are you sure you want to unsign from this event?')) {
                return;
            }
            
            // Update button state
            button.setAttribute('data-signed-up', 'false');
            button.querySelector('.btn-text').textContent = 'Sign Up';
            
            // Increase available spots
            const currentSpots = parseInt(spotsElement.textContent);
            spotsElement.textContent = `${currentSpots + 1} spots left`;
            
            // Show unsign message
            alert('You have been removed from this event.');
        } else {
            // Update button state
            button.setAttribute('data-signed-up', 'true');
            button.querySelector('.btn-text').textContent = 'Unsign';
            
            // Decrease available spots
            const currentSpots = parseInt(spotsElement.textContent);
            if (currentSpots > 0) {
                spotsElement.textContent = `${currentSpots - 1} spots left`;
            }
        }
    }

    // Store signed up events in localStorage
    function saveSignUpState() {
        const signedUpEvents = {};
        document.querySelectorAll('.sign-up-btn').forEach(btn => {
            const card = btn.closest('.volunteer-card');
            const title = card.querySelector('h3').textContent;
            signedUpEvents[title] = btn.getAttribute('data-signed-up') === 'true';
        });
        localStorage.setItem('signedUpEvents', JSON.stringify(signedUpEvents));
    }

    // Load signed up events from localStorage
    function loadSignUpState() {
        const signedUpEvents = JSON.parse(localStorage.getItem('signedUpEvents') || '{}');
        document.querySelectorAll('.volunteer-card').forEach(card => {
            const title = card.querySelector('h3').textContent;
            const btn = card.querySelector('.sign-up-btn');
            const spotsElement = card.querySelector('.spots-left span');
            
            if (signedUpEvents[title]) {
                toggleSignUpState(btn, spotsElement, true);
            }
        });
    }

    // Load saved states when page loads
    loadSignUpState();

    // Save state when changes are made
    window.addEventListener('beforeunload', saveSignUpState);

    // Event card click handler
    document.querySelectorAll('.volunteer-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't open modal if clicking the sign-up button
            if (e.target.classList.contains('join-btn')) return;

            openEventModal(card);
        });
    });

    // Close modal handlers
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Share button functionality
    const shareBtn = modal.querySelector('.share-btn');
    shareBtn.addEventListener('click', async function() {
        const title = modalTitle.textContent;
        const text = `Check out this volunteer opportunity: ${title} at EcoRise!`;
        const url = window.location.href;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'EcoRise Volunteer Opportunity',
                    text: text,
                    url: url
                });
            } else {
                // Fallback to copying to clipboard
                await navigator.clipboard.writeText(`${text}\n${url}`);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    });

    // Register button functionality
    const registerBtn = modal.querySelector('.register-btn');
    registerBtn.addEventListener('click', function() {
        // This can be expanded to handle actual registration
        alert('Thank you for your interest! Registration system coming soon.');
    });

    // Pagination configuration
    const ITEMS_PER_PAGE = 6;
    let currentPage = 1;
    const volunteerCards = document.querySelectorAll('.volunteer-card');
    const totalPages = Math.ceil(volunteerCards.length / ITEMS_PER_PAGE);

    // Pagination elements
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const pageNumbers = document.querySelector('.page-numbers');

    // Initialize pagination
    function initializePagination() {
        // Clear existing page numbers
        pageNumbers.innerHTML = '';
        
        // Create page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => goToPage(i));
            pageNumbers.appendChild(pageBtn);
        }

        // Update button states
        updatePaginationControls();
        showCurrentPageItems();
    }

    // Go to specific page
    function goToPage(pageNum) {
        currentPage = pageNum;
        updatePaginationControls();
        showCurrentPageItems();
        
        // Scroll to top of volunteer section
        document.querySelector('.volunteer-options').scrollIntoView({ behavior: 'smooth' });
    }

    // Show items for current page
    function showCurrentPageItems() {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;

        volunteerCards.forEach((card, index) => {
            if (index >= startIndex && index < endIndex) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Update pagination controls
    function updatePaginationControls() {
        // Update Previous/Next buttons
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        // Update page number buttons
        document.querySelectorAll('.page-number').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.textContent) === currentPage);
        });
    }

    // Event listeners for Previous/Next buttons
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    });

    // Initialize pagination
    initializePagination();

    // Set up volunteer opportunity search feature
    const searchInput = document.getElementById('volunteerSearch');
    const searchBtn = document.getElementById('searchBtn');

    // Modify search function to work with pagination
    function searchOpportunities() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCards = 0;
        
        volunteerCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('.description').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag'))
                .map(tag => tag.textContent.toLowerCase());
            const location = card.querySelector('.detail-item:nth-child(1) span').textContent.toLowerCase();
            const date = card.querySelector('.detail-item:nth-child(2) span').textContent.toLowerCase();
            const time = card.querySelector('.detail-item:nth-child(3) span').textContent.toLowerCase();

            const matchesSearch = title.includes(searchTerm) || 
                                description.includes(searchTerm) ||
                                tags.some(tag => tag.includes(searchTerm)) ||
                                location.includes(searchTerm) ||
                                date.includes(searchTerm) ||
                                time.includes(searchTerm);

            if (matchesSearch) {
                card.classList.remove('hidden');
                visibleCards++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Reset to first page and reinitialize pagination for visible cards
        currentPage = 1;
        const newTotalPages = Math.ceil(visibleCards / ITEMS_PER_PAGE);
        if (newTotalPages !== totalPages) {
            totalPages = newTotalPages;
            initializePagination();
        } else {
            showCurrentPageItems();
        }
    }

    searchBtn.addEventListener('click', searchOpportunities);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchOpportunities();
        }
    });

    // Modal handling functions
    function openModal(modal) {
        console.log(`Opening modal: ${modal?.id}`);
        if (!modal) return;
        modal.style.display = 'flex';
        setTimeout(() => {
            console.log(`Modal visible: ${modal.style.display}, classList: ${modal.classList}`);
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
    
    // Multi-step form variables
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step-indicator');
    let currentStep = 0;
    const formNextBtn = document.getElementById('nextBtn');
    const formPrevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Multi-step form functions
    function updateFormSteps() {
        console.log(`Updating steps to: ${currentStep}`);
        steps.forEach((step, index) => {
            console.log(`Step ${index} display: ${step.style.display}`);
            step.style.display = index === currentStep ? 'block' : 'none';
        });
        
        progressSteps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        
        if (currentStep === 0) {
            formPrevBtn.style.display = 'none';
        } else {
            formPrevBtn.style.display = 'block';
        }
        
        if (currentStep === steps.length - 1) {
            formNextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            formNextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }
    
    function validateStep(step) {
        const inputs = step.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('invalid');
                
                // Add error message if it doesn't exist
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'This field is required';
                    input.parentNode.insertBefore(errorMessage, input.nextSibling);
                }
            } else {
                input.classList.remove('invalid');
                
                // Remove error message if exists
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-message')) {
                    input.parentNode.removeChild(input.nextElementSibling);
                }
            }
        });
        
        return isValid;
    }

    // Create Event Modal Functionality
    const createEventModal = document.getElementById('createEventModal');
    const createEventBtn = document.getElementById('createEventBtn');
    const createEventForm = document.getElementById('createEventForm');

    // Open create event modal
    createEventBtn.addEventListener('click', () => {
        console.log('Create Event button clicked');
        openModal(createEventModal);
        currentStep = 0;
        updateFormSteps();
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('eventDate').min = today;
    });

    // Close create event modal
    createEventModal.querySelector('.close-btn').addEventListener('click', () => {
        console.log('Closing modal');
        closeModal(createEventModal);
    });

    createEventModal.querySelector('.cancel-btn').addEventListener('click', () => {
        closeModal(createEventModal);
    });

    // Handle form submission
    createEventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const title = document.getElementById('eventTitle').value;
        const category = document.getElementById('eventCategory').value;
        const difficulty = document.getElementById('eventDifficulty').value;
        const type = document.getElementById('eventType').value;
        const commitment = document.getElementById('eventCommitment').value;
        const location = document.getElementById('eventLocation').value;
        const date = document.getElementById('eventDate').value;
        const startTime = document.getElementById('eventStartTime').value;
        const endTime = document.getElementById('eventEndTime').value;
        const description = document.getElementById('eventDescription').value;
        const spots = document.getElementById('eventSpots').value;
        const imageUrl = document.getElementById('eventImage').value;

        // Create new event card
        const newEventCard = document.createElement('div');
        newEventCard.className = 'volunteer-card';
        newEventCard.innerHTML = `
            <div class="card-image" style="background-image: url('${imageUrl}')"></div>
            <div class="card-content">
                <h3>${title}</h3>
                <div class="tag-container">
                    <span class="tag category">${category}</span>
                    <span class="tag difficulty">${difficulty}</span>
                    <span class="tag type">${type}</span>
                    <span class="tag commitment">${commitment}</span>
                </div>
                <div class="event-details">
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${location}</span>
                    </div>
                    <div class="detail-item">
                        <i class="far fa-calendar-alt"></i>
                        <span>${date}</span>
                    </div>
                    <div class="detail-item">
                        <i class="far fa-clock"></i>
                        <span>${startTime} - ${endTime}</span>
                    </div>
                </div>
                <p class="description">${description}</p>
                <div class="card-footer">
                    <div class="spots-left">
                        <i class="fas fa-users"></i>
                        <span>${spots} spots left</span>
                    </div>
                    <button class="sign-up-btn" data-signed-up="false">
                        <i class="fas fa-hand-paper"></i>
                        <span class="btn-text">Sign Up</span>
                    </button>
                </div>
            </div>
        `;

        // Add event data to eventData object
        eventData[title] = {
            requirements: [],
            coordinator: {
                name: 'Event Organizer',
                image: 'assets/default-coordinator.jpg',
                contact: 'organizer@ecorise.org'
            },
            additionalInfo: `
                <h4>Event Details</h4>
                <p>${description}</p>
                <h4>Location</h4>
                <p>${location}</p>
            `
        };

        // Add click event listener to the new card
        newEventCard.addEventListener('click', () => {
            openEventModal(newEventCard);
        });

        // Add sign-up button click handler
        const signUpBtn = newEventCard.querySelector('.sign-up-btn');
        signUpBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const spotsElement = newEventCard.querySelector('.spots-left span');
            toggleSignUpState(signUpBtn, spotsElement);
        });

        // Add the new card to the volunteer-cards container
        const cardsContainer = document.querySelector('.volunteer-cards');
        cardsContainer.insertBefore(newEventCard, cardsContainer.firstChild);

        // Close modal and reset form
        closeModal(createEventModal);
        createEventForm.reset();

        // Show success message
        alert('Event created successfully!');
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === createEventModal) {
            closeModal(createEventModal);
        }
    });

    // Add event listeners for next and previous buttons
    formNextBtn.addEventListener('click', () => {
        const currentStepElement = steps[currentStep];
        if (validateStep(currentStepElement)) {
            currentStep++;
            updateFormSteps();
        }
    });

    formPrevBtn.addEventListener('click', () => {
        currentStep--;
        updateFormSteps();
    });

    // Initialize form steps
    updateFormSteps();
});

// Map functionality
import { GOOGLE_MAPS_API_KEY } from './config.js';

const mapScript = document.querySelector('script[src*="maps.googleapis.com"]');
if (mapScript) {
    mapScript.src = mapScript.src.replace('GOOGLE_MAPS_API_KEY', GOOGLE_MAPS_API_KEY);
}

window.addEventListener('google-maps-loaded', initVolunteerMap);

function initVolunteerMap() {
    const mapElement = document.getElementById('volunteerMap');
    
    if (!mapElement) return;
    
    // Sample volunteer event locations
    const volunteerLocations = [
        { lat: 40.7128, lng: -74.0060, title: 'NYC Community Garden', type: 'Community' },
        { lat: 34.0522, lng: -118.2437, title: 'LA Beach Clean-up', type: 'Clean-up' },
        { lat: 41.8781, lng: -87.6298, title: 'Chicago Tree Planting', type: 'Planting' },
        { lat: 29.7604, lng: -95.3698, title: 'Houston Conservation Project', type: 'Conservation' },
        { lat: 33.4484, lng: -112.0740, title: 'Phoenix Environmental Education', type: 'Education' },
        { lat: 39.9526, lng: -75.1652, title: 'Philadelphia Park Clean-up', type: 'Clean-up' },
        { lat: 32.7157, lng: -117.1611, title: 'San Diego Coastal Restoration', type: 'Conservation' },
        { lat: 37.7749, lng: -122.4194, title: 'San Francisco Urban Garden', type: 'Community' }
    ];
    
    // Initialize the map
    const map = new google.maps.Map(mapElement, {
        center: { lat: 39.8283, lng: -98.5795 }, // Center of US
        zoom: 4,
        styles: [
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#444444"}]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{"color": "#f2f2f2"}]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{"saturation": -100}, {"lightness": 45}]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{"color": "#c1e0e0"}, {"visibility": "on"}]
            }
        ]
    });
    
    // Add markers for each volunteer location
    const markers = volunteerLocations.map(location => {
        const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.title,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: getMarkerColor(location.type),
                fillOpacity: 0.9,
                strokeWeight: 2,
                strokeColor: '#ffffff'
            }
        });
        
        // Add info window for each marker
        const infoContent = `
            <div class="map-info-window">
                <h3>${location.title}</h3>
                <p><strong>Type:</strong> ${location.type}</p>
                <p><strong>Date:</strong> Next event on ${getRandomFutureDate()}</p>
                <button class="map-info-btn">View Details</button>
            </div>
        `;
        
        const infoWindow = new google.maps.InfoWindow({
            content: infoContent
        });
        
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
        
        return marker;
    });
    
    // Try to get user's current location for a more personalized map view
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Center map on user's location
                map.setCenter(userLocation);
                map.setZoom(9);
                
                // Add marker for user's location
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: 'Your Location',
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 12,
                        fillColor: '#4285F4',
                        fillOpacity: 0.8,
                        strokeWeight: 2,
                        strokeColor: '#ffffff'
                    }
                });
            },
            () => {
                // Handle geolocation error (keep default map center)
                console.log('Error: The Geolocation service failed or permission denied.');
            }
        );
    }
    
    // Set up filter button
    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            alert('Filters applied! This feature will be fully implemented soon.');
        });
    }
}

// Helper function to get a random future date for event demonstrations
function getRandomFutureDate() {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + Math.floor(Math.random() * 30) + 1);
    
    return futureDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Helper function to get marker color based on event type
function getMarkerColor(type) {
    switch (type) {
        case 'Clean-up':
            return '#4CAF50';
        case 'Planting':
            return '#8BC34A';
        case 'Education':
            return '#2196F3';
        case 'Conservation':
            return '#FF9800';
        case 'Community':
            return '#9C27B0';
        default:
            return '#757575';
    }
}
