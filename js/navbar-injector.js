// Navbar injector - loads the navbar component into each page
document.addEventListener('DOMContentLoaded', function() {
    // Function to inject navbar
    const injectNavbar = async () => {
        try {
            // Fetch the navbar HTML
            const response = await fetch('components/navbar.html');
            if (!response.ok) {
                throw new Error(`Failed to fetch navbar: ${response.status}`);
            }
            
            const navbarHtml = await response.text();
            
            // First, check for a navbar container
            const navbarContainer = document.getElementById('navbar-container');
            
            if (navbarContainer) {
                // Insert the navbar into the container
                navbarContainer.innerHTML = navbarHtml;
            } else {
                // Find the existing nav element to replace
                const existingNav = document.querySelector('nav');
                if (existingNav) {
                    // Create a temporary container
                    const tempContainer = document.createElement('div');
                    tempContainer.innerHTML = navbarHtml;
                    
                    // Replace the existing nav with the new one
                    existingNav.parentNode.replaceChild(tempContainer.firstElementChild, existingNav);
                } else {
                    console.error('No navbar container or existing nav element found');
                    // As a fallback, insert at the beginning of the body
                    const tempContainer = document.createElement('div');
                    tempContainer.innerHTML = navbarHtml;
                    document.body.insertBefore(tempContainer.firstElementChild, document.body.firstChild);
                }
            }
            
            // Initialize navbar functionality
            initializeNavbar();
        } catch (error) {
            console.error('Error injecting navbar:', error);
        }
    };
    
    // Function to initialize navbar functionality
    const initializeNavbar = () => {
        // Set active page in navbar
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-middle a');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (currentPage.includes(linkPage)) {
                link.classList.add('active');
            }
        });
        
        // Hamburger menu toggle
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const navMiddle = document.querySelector('.nav-middle');
        const navRight = document.querySelector('.nav-right');
        
        if (hamburgerMenu) {
            hamburgerMenu.addEventListener('click', function() {
                this.classList.toggle('active');
                document.body.classList.toggle('menu-open');
                
                // Toggle mobile menu visibility
                if (navMiddle) {
                    navMiddle.classList.toggle('show');
                }
                
                if (navRight) {
                    navRight.classList.toggle('show');
                }
            });
        }
        
        // Initialize calendar button
        const calendarBtn = document.getElementById('calendarBtn');
        const calendarModal = document.getElementById('calendarModal');
        
        if (calendarBtn && calendarModal) {
            calendarBtn.addEventListener('click', function() {
                calendarModal.classList.toggle('show');
            });
            
            // Close calendar when clicking outside
            window.addEventListener('click', function(event) {
                if (event.target === calendarModal) {
                    calendarModal.classList.remove('show');
                }
            });
        }
    };
    
    // Inject the navbar
    injectNavbar();
});
