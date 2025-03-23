// Navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set active page in navbar
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-middle a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage.includes(linkPage)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Hamburger menu toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMiddle = document.querySelector('.nav-middle');
    
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Toggle mobile menu visibility
            if (navMiddle) {
                navMiddle.classList.toggle('show');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = event.target.closest('.main-nav');
            const isMenuOpen = document.body.classList.contains('menu-open');
            const isHamburgerClick = event.target.closest('.hamburger-menu');
            
            if (!isClickInsideNav && isMenuOpen && !isHamburgerClick) {
                hamburgerMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                
                if (navMiddle) {
                    navMiddle.classList.remove('show');
                }
            }
        });
        
        // Close mobile menu when window is resized to desktop size
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && document.body.classList.contains('menu-open')) {
                hamburgerMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                
                if (navMiddle) {
                    navMiddle.classList.remove('show');
                }
            }
        });
    }
    
    // Preserve calendar button functionality
    const calendarBtn = document.getElementById('calendarBtn');
    if (calendarBtn) {
        // The actual calendar functionality is handled in js/calendar.js
        // We just need to ensure the event doesn't close the mobile menu
        calendarBtn.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});
