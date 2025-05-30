// Volunteer page functionality
// Variables for Google Maps API and calendar initialization can be defined globally if needed

// Function to handle form submission from the button click
function submitEventForm() {
    console.log('Submit button clicked from volunteer.js submitEventForm function');
    
    try {
        // Get form values
        const title = document.getElementById('eventTitle').value || 'New Event';
        const category = document.getElementById('eventCategory').value || 'Environmental';
        const difficulty = document.getElementById('eventDifficulty').value || 'Beginner-Friendly';
        const type = document.getElementById('eventType').value || 'Outdoor';
        const commitment = document.getElementById('eventCommitment').value || 'One-time';
        const location = document.getElementById('eventLocation').value || 'Local Area';
        const date = document.getElementById('eventDate').value || 'Upcoming';
        const startTime = document.getElementById('eventStartTime').value || '9:00 AM';
        const endTime = document.getElementById('eventEndTime').value || '5:00 PM';
        const description = document.getElementById('eventDescription').value || 'Join this exciting environmental event.';
        const spots = document.getElementById('eventSpots').value || '10';
        
        // Find the volunteer cards container
        const cardsContainer = document.querySelector('.volunteer-cards');
        if (!cardsContainer) {
            console.error('Cannot find .volunteer-cards container');
            alert('Error: Cannot find the volunteer cards container');
            return;
        }
        
        // Generate a unique title with timestamp
        const timestamp = new Date().toLocaleTimeString();
        const uniqueTitle = title + " (" + timestamp + ")";
        
        // Create the new card HTML
        const newCardHTML = `
            <div class="volunteer-card">
                <div class="card-image" style="background-image: url('assets/default-event.jpg')"></div>
                <div class="card-content">
                    <h3>${uniqueTitle}</h3>
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
            </div>
        `;
        
        // Insert the new card at the beginning
        cardsContainer.insertAdjacentHTML('afterbegin', newCardHTML);
        console.log('Card added successfully via submitEventForm');
        
        // Get the newly added card
        const newCard = cardsContainer.firstElementChild;
        
        // Add event handlers to the new card
        if (newCard) {
            // Modal event handler
            newCard.addEventListener('click', function() {
                if (typeof openEventModal === 'function') {
                    openEventModal(newCard);
                }
            });
            
            // Sign up button handler
            const signUpBtn = newCard.querySelector('.sign-up-btn');
            if (signUpBtn) {
                signUpBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const spotsElement = newCard.querySelector('.spots-left span');
                    if (typeof toggleSignUpState === 'function') {
                        toggleSignUpState(signUpBtn, spotsElement);
                    }
                });
            }
        }
        
        // Close the modal
        const modal = document.getElementById('createEventModal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Reset the form
        const form = document.getElementById('createEventForm');
        if (form) {
            form.reset();
        }
        
        // Reset image preview if present
        const previewImg = document.getElementById('previewImg');
        const previewText = document.querySelector('.preview-text');
        if (previewImg) {
            previewImg.style.display = 'none';
            previewImg.src = '#';
        }
        if (previewText) {
            previewText.style.display = 'block';
        }
        
        // Show success message
        alert('Event successfully added to the volunteer page!');
    } catch (error) {
        console.error('Error in submitEventForm:', error);
        alert('There was an error adding your event. Please try again.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Volunteer page functionality
    // Function to directly display the modal - adding this at the top level
    function showCreateEventModal() {
        console.log('showCreateEventModal called');
        const modal = document.getElementById('createEventModal');
        if (modal) {
            console.log('Modal found, displaying');
            modal.style.display = 'flex';
            modal.classList.add('active');
        } else {
            console.error('Could not find createEventModal');
        }
    }

    // Expose this function globally
    window.showCreateEventModal = showCreateEventModal;

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
    // Initialize calendar
    if (typeof initializeCalendar === 'function') {
        initializeCalendar();
    }
    
    // Initialize distance slider
    initializeDistanceSlider();
    
    // Initialize map
    if (typeof initVolunteerMap === 'function') {
        initVolunteerMap();
    }

    // Get DOM elements - do this only once
    const createEventBtn = document.getElementById('createEventBtn');
    const createEventModal = document.getElementById('createEventModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitBtn = document.getElementById('submitBtn');
    const createEventForm = document.getElementById('createEventForm');
    
    // Show modal when Create Event button is clicked
    if (createEventBtn && createEventModal) {
        createEventBtn.addEventListener('click', function() {
            console.log('Create Event button clicked');
            showCreateEventModal();
        });
    }

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

    // Set minimum date to today for the event date input
    const today = new Date().toISOString().split('T')[0];
    const eventDateInput = document.getElementById('eventDate');
    if (eventDateInput) {
        eventDateInput.min = today;
    }

    // Create Event Modal Functionality
    // Handle cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            const modal = document.getElementById('createEventModal');
            if (modal) {
                modal.style.display = 'none';
            }
            
            // Reset the form
            const form = document.getElementById('createEventForm');
            if (form) {
                form.reset();
            }
            
            // Reset image preview if present
            const previewImg = document.getElementById('previewImg');
            const previewText = document.querySelector('.preview-text');
            if (previewImg) {
                previewImg.style.display = 'none';
                previewImg.src = '#';
            }
            if (previewText) {
                previewText.style.display = 'block';
            }
        });
    }

    // Helper function for creating event cards from the form
    function createFormEventCard(container, imageUrl, title, category, difficulty, type, commitment, location, date, startTime, endTime, description, spots) {
        // Create card HTML
        const cardHTML = `
            <div class="volunteer-card">
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
            </div>
        `;
        
        // Insert at the beginning of the container
        container.insertAdjacentHTML('afterbegin', cardHTML);
        console.log('Card added from form submission');
        
        // Add event data to global eventData object if it exists
        if (typeof window.eventData !== 'undefined') {
            window.eventData[title] = {
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
        }
        
        // Add event handlers to the new card
        const newCard = container.firstElementChild;
        if (newCard) {
            // Add click event for card details
            newCard.addEventListener('click', function() {
                // Find the openEventModal function 
                if (typeof window.openEventModal === 'function') {
                    window.openEventModal(newCard);
                } else if (typeof openEventModal === 'function') {
                    openEventModal(newCard);
                }
            });
            
            // Add sign-up button handler
            const signUpBtn = newCard.querySelector('.sign-up-btn');
            if (signUpBtn) {
                signUpBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const spotsElement = newCard.querySelector('.spots-left span');
                    
                    // Find the toggleSignUpState function
                    if (typeof window.toggleSignUpState === 'function') {
                        window.toggleSignUpState(signUpBtn, spotsElement);
                    } else if (typeof toggleSignUpState === 'function') {
                        toggleSignUpState(signUpBtn, spotsElement);
                    }
                });
            }
        }
        
        // Show success message
        alert('Event successfully added to the volunteer page!');
        
        // Make sure the card is visible if pagination is active
        if (typeof window.goToPage === 'function') {
            window.goToPage(1);
        } else if (typeof goToPage === 'function') {
            goToPage(1);
        }
    }

    // Function to create event card
    function createEventCard(eventData) {
        const cardsContainer = document.querySelector('.volunteer-cards');
        const newEventCard = document.createElement('div');
        newEventCard.className = 'volunteer-card';
        
        newEventCard.innerHTML = `
            <div class="card-image" style="background-image: url('${eventData.imageUrl}')"></div>
            <div class="card-content">
                <h3>${eventData.eventTitle}</h3>
                <p class="description">${eventData.eventDescription}</p>
                <div class="card-footer">
                    <button class="sign-up-btn">
                        <i class="fas fa-hand-paper"></i>
                        <span class="btn-text">Sign Up</span>
                    </button>
                </div>
            </div>
        `;

        // Add the new card to the container
        if (cardsContainer.firstChild) {
            cardsContainer.insertBefore(newEventCard, cardsContainer.firstChild);
        } else {
            cardsContainer.appendChild(newEventCard);
        }
    }

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

    // Get DOM elements
    const addTestEventBtn = document.getElementById('addTestEventBtn');
    
    // Event data for modal
    const eventDataForTest = {
        "Beach Clean-up Drive": {
            requirements: [
                "Wear comfortable clothes and shoes",
                "Bring water and sunscreen",
                "Gloves will be provided"
            ],
            coordinator: {
                name: "Maria Rodriguez",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200",
                contact: "maria@ecorise.org"
            },
            additionalInfo: `
                <h4>What to Expect</h4>
                <p>Join us for a 3-hour beach clean-up to remove plastic waste and debris from our local shoreline. This event is suitable for all ages and abilities. We'll provide all necessary equipment including trash bags, gloves, and grabbers.</p>
                <h4>Meeting Point</h4>
                <p>We'll meet at the north entrance of Sunset Beach, near the parking lot. Look for our EcoRise banner!</p>
            `
        },
        "Eco-Education Workshop": {
            requirements: [
                "No prior experience needed",
                "Bring a notebook if desired",
                "Laptop optional for resources"
            ],
            coordinator: {
                name: "David Chen",
                image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200",
                contact: "david@ecorise.org"
            },
            additionalInfo: `
                <h4>Workshop Details</h4>
                <p>This workshop will cover fundamental environmental topics including waste reduction, recycling best practices, and how to effectively communicate environmental issues in your community. The session includes both presentation and interactive activities.</p>
                <h4>Location Information</h4>
                <p>The workshop will be held in the Community Room at the Central Library. Materials will be provided, but feel free to bring a notebook for additional notes.</p>
            `
        }
    };

    // Add test event button handler
    if (addTestEventBtn) {
        addTestEventBtn.addEventListener('click', function() {
            addTestEventCard();
        });
    }

    // Function to add a test event card directly to the DOM
    function addTestEventCard() {
        const cardsContainer = document.querySelector('.volunteer-cards');
        if (!cardsContainer) {
            console.error('Could not find .volunteer-cards container');
            alert('Error: Could not find the volunteer cards container');
            return;
        }
        
        // Create test event data with timestamp to make it unique
        const timestamp = new Date().toLocaleTimeString();
        const testTitle = `Test Event (${timestamp})`;
        
        // Create test event card
        const testCardHTML = `
            <div class="volunteer-card">
                <div class="card-image" style="background-image: url('assets/default-event.jpg')"></div>
                <div class="card-content">
                    <h3>${testTitle}</h3>
                    <div class="tag-container">
                        <span class="tag category">Environmental</span>
                        <span class="tag difficulty">Beginner-Friendly</span>
                        <span class="tag type">Outdoor</span>
                        <span class="tag commitment">One-time</span>
                    </div>
                    <div class="event-details">
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Test Location</span>
                        </div>
                        <div class="detail-item">
                            <i class="far fa-calendar-alt"></i>
                            <span>2025-03-30</span>
                        </div>
                        <div class="detail-item">
                            <i class="far fa-clock"></i>
                            <span>10:00 AM - 2:00 PM</span>
                        </div>
                    </div>
                    <p class="description">This is a test event card created to verify the card display functionality.</p>
                    <div class="card-footer">
                        <div class="spots-left">
                            <i class="fas fa-users"></i>
                            <span>10 spots left</span>
                        </div>
                        <button class="sign-up-btn" data-signed-up="false">
                            <i class="fas fa-hand-paper"></i>
                            <span class="btn-text">Sign Up</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Insert at the beginning of the container
        cardsContainer.insertAdjacentHTML('afterbegin', testCardHTML);
        
        // Add event data to eventData object
        eventDataForTest[testTitle] = {
            requirements: ["No requirements for test event"],
            coordinator: {
                name: "Test Coordinator",
                image: "assets/default-coordinator.jpg",
                contact: "test@ecorise.org"
            },
            additionalInfo: `
                <h4>Test Event Details</h4>
                <p>This is a test event created to verify the card display functionality.</p>
                <h4>Location</h4>
                <p>Test Location</p>
            `
        };
        
        // Add event handlers to the new card
        const newCard = cardsContainer.firstElementChild;
        if (newCard) {
            // Add click event for card details
            newCard.addEventListener('click', function() {
                openEventModal(newCard);
            });
            
            // Add sign-up button handler
            const signUpBtn = newCard.querySelector('.sign-up-btn');
            if (signUpBtn) {
                signUpBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const spotsElement = newCard.querySelector('.spots-left span');
                    toggleSignUpState(signUpBtn, spotsElement);
                });
            }
        }
        
        // Confirm success
        alert('Test event card successfully added!');
        
        // Make sure it's visible (in case pagination is active)
        if (typeof goToPage === 'function') {
            goToPage(1);
        }
    }

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
});

// Removed map initialization code since it's now handled in volunteer.html
