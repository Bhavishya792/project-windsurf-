/**
 * Universal modal handling for the EcoRise project
 * This module provides consistent modal behavior across all pages
 */

// Modal management system
class ModalManager {
    constructor() {
        this.activeModal = null;
        this.initialized = false;
        this.modals = {};
        this.triggers = {};
    }

    init() {
        if (this.initialized) return;
        
        // Find all modals on the page
        document.querySelectorAll('.modal, .calendar-modal, .event-modal, .signup-modal').forEach(modal => {
            const id = modal.id;
            if (!id) return;
            
            this.modals[id] = modal;
            
            // Set up close buttons
            modal.querySelectorAll('.close-btn').forEach(btn => {
                btn.addEventListener('click', () => this.close(id));
            });
            
            // Close on click outside modal content
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.close(id);
                }
            });
        });
        
        // Set up ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.close(this.activeModal);
            }
        });
        
        // Initialize standard button triggers
        this.setupStandardTriggers();
        
        this.initialized = true;
        console.log('Modal Manager initialized with modals:', Object.keys(this.modals));
    }
    
    setupStandardTriggers() {
        // Set up calendar button
        const calendarBtns = document.querySelectorAll('#calendarBtn');
        calendarBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    this.open('calendarModal');
                });
                this.triggers['calendarBtn'] = 'calendarModal';
            }
        });
        
        // Set up profile button
        const profileBtns = document.querySelectorAll('.profile-btn, #profileBtn');
        profileBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    this.open('profileModal');
                });
                this.triggers['profileBtn'] = 'profileModal';
            }
        });
        
        // Set up notification button
        const notificationBtns = document.querySelectorAll('#notificationBtn');
        notificationBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    this.open('notificationModal');
                });
                this.triggers['notificationBtn'] = 'notificationModal';
            }
        });
        
        // Set up camera button
        const cameraBtns = document.querySelectorAll('#cameraBtn');
        cameraBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    this.open('uploadModal');
                });
                this.triggers['cameraBtn'] = 'uploadModal';
            }
        });
    }
    
    registerTrigger(triggerId, modalId) {
        const trigger = document.getElementById(triggerId);
        if (trigger && this.modals[modalId]) {
            trigger.addEventListener('click', () => this.open(modalId));
            this.triggers[triggerId] = modalId;
            return true;
        }
        return false;
    }
    
    open(modalId) {
        const modal = this.modals[modalId];
        if (!modal) {
            console.error(`Modal ${modalId} not found`);
            return;
        }
        
        // Close any active modal
        if (this.activeModal) {
            this.close(this.activeModal);
        }
        
        // Show the modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        this.activeModal = modalId;
        
        // Trigger custom event for specific modal types
        const event = new CustomEvent('modalOpened', { detail: { modalId } });
        document.dispatchEvent(event);
    }
    
    close(modalId) {
        const modal = this.modals[modalId];
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        
        if (this.activeModal === modalId) {
            this.activeModal = null;
        }
        
        // Trigger custom event for specific modal types
        const event = new CustomEvent('modalClosed', { detail: { modalId } });
        document.dispatchEvent(event);
    }
}

// Create a singleton instance
const modalManager = new ModalManager();

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    modalManager.init();
});

// Export the modal manager for use in other modules
export default modalManager;
