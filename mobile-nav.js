document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Menu Toggle
    const hamburgerBtn = document.getElementById('hamburgerMenu');
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-items a');
    
    // Function to toggle mobile menu
    function toggleMobileMenu() {
        if(mobileNavMenu.classList.contains('show')) {
            mobileNavMenu.classList.remove('show');
            document.body.style.overflow = '';
            setTimeout(() => {
                mobileNavMenu.style.display = 'none';
            }, 300);
        } else {
            mobileNavMenu.style.display = 'block';
            // Forces reflow to allow transition to work
            void mobileNavMenu.offsetWidth;
            mobileNavMenu.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling behind the menu
        }
    }
    
    // Event listeners for mobile menu
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMobileMenu);
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileNavMenu || !hamburgerBtn) return;
        
        const clickedOutside = !mobileNavMenu.contains(e.target) && e.target !== hamburgerBtn && !hamburgerBtn.contains(e.target);
        if(mobileNavMenu.classList.contains('show') && clickedOutside) {
            toggleMobileMenu();
        }
    });
    
    // Close menu when a link is clicked
    if (mobileMenuLinks) {
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                if(mobileNavMenu.classList.contains('show')) {
                    toggleMobileMenu();
                }
            });
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (mobileNavMenu && window.innerWidth > 768 && mobileNavMenu.classList.contains('show')) {
            toggleMobileMenu();
        }
    });
});
