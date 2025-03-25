/**
 * Modal Injector - Injects standardized modals into all pages
 * This ensures consistent modal structure across the entire EcoRise project
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Function to inject modals
    const injectModals = async () => {
        try {
            // Fetch the modals HTML
            const response = await fetch('components/modals.html');
            if (!response.ok) {
                throw new Error(`Failed to fetch modals: ${response.status}`);
            }
            
            const modalsHtml = await response.text();
            
            // Create a container for modals if one doesn't exist
            let modalsContainer = document.getElementById('modals-container');
            
            if (!modalsContainer) {
                modalsContainer = document.createElement('div');
                modalsContainer.id = 'modals-container';
                document.body.appendChild(modalsContainer);
            }
            
            // Insert the modals into the container
            modalsContainer.innerHTML = modalsHtml;
            
            console.log('Modals injected successfully');
            
            // Initialize modal functionality
            if (typeof modalManager !== 'undefined') {
                // If using the module pattern, modal.js might already have initialized
                // We just need to make sure it reinitializes
                document.dispatchEvent(new CustomEvent('modalsInjected'));
            } else {
                // Otherwise initialize the basic modal functionality here
                initializeModals();
            }
        } catch (error) {
            console.error('Error injecting modals:', error);
        }
    };
    
    // Basic modal functionality (in case modal.js isn't loaded)
    const initializeModals = () => {
        // Find all modals on the page
        document.querySelectorAll('.modal').forEach(modal => {
            // Find close buttons
            modal.querySelectorAll('.close-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    modal.classList.remove('active');
                });
            });
            
            // Close on click outside modal content
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // Set up ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });
        
        // Set up button triggers
        setupModalTriggers();
    };
    
    // Set up standard buttons to open modals
    const setupModalTriggers = () => {
        // Profile button
        document.querySelectorAll('#profileBtn, .profile-btn').forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    const modal = document.getElementById('profileModal');
                    if (modal) modal.classList.add('active');
                });
            }
        });
        
        // Calendar button
        document.querySelectorAll('#calendarBtn, .calendar-btn').forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    const modal = document.getElementById('calendarModal');
                    if (modal) {
                        // Make sure the calendar is visible before showing
                        const calendarContent = modal.querySelector('.modal-content');
                        if (calendarContent) {
                            calendarContent.style.display = 'block';
                        }
                        modal.classList.add('active');
                    }
                });
            }
        });
        
        // Notification button
        document.querySelectorAll('#notificationBtn, .notification-btn').forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    const modal = document.getElementById('notificationModal');
                    if (modal) modal.classList.add('active');
                });
            }
        });
        
        // Camera/Upload button
        document.querySelectorAll('#cameraBtn, .camera-btn').forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    const modal = document.getElementById('uploadModal');
                    if (modal) modal.classList.add('active');
                });
            }
        });
    };
    
    // Remove existing modals to avoid duplicates
    const removeExistingModals = () => {
        // Check for existing modals
        const modals = [
            document.getElementById('profileModal'),
            document.getElementById('calendarModal'),
            document.getElementById('uploadModal'),
            document.getElementById('notificationModal')
        ];
        
        // Remove existing modals that will be replaced
        modals.forEach(modal => {
            if (modal && modal.parentElement.id !== 'modals-container') {
                modal.parentElement.removeChild(modal);
            }
        });
    };
    
    // First, remove existing modals
    removeExistingModals();
    
    // Then inject the new standardized modals
    await injectModals();
});
