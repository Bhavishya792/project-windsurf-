document.addEventListener('DOMContentLoaded', function() {
    // Toggle functionality for expandable sections
    const sectionHeaders = document.querySelectorAll('.guide-section-header');
    
    sectionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.toggle-btn i');
            
            // Toggle content visibility
            if (content.style.display === 'block') {
                content.style.display = 'none';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                content.style.display = 'block';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    });
    
    // Make the first section open by default
    if (sectionHeaders.length > 0) {
        const firstContent = sectionHeaders[0].nextElementSibling;
        const firstIcon = sectionHeaders[0].querySelector('.toggle-btn i');
        firstContent.style.display = 'block';
        firstIcon.classList.remove('fa-chevron-down');
        firstIcon.classList.add('fa-chevron-up');
    }
    
    // Smooth scrolling for all navigation links
    const allNavLinks = document.querySelectorAll('.quick-link, .sidebar-nav-link');
    
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Ensure the section is open before scrolling
                const sectionHeader = targetElement.querySelector('.guide-section-header');
                const sectionContent = targetElement.querySelector('.guide-section-content');
                const icon = sectionHeader.querySelector('.toggle-btn i');
                
                // Open the section if it's closed
                if (sectionContent.style.display !== 'block') {
                    sectionContent.style.display = 'block';
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
                
                // Scroll to the section
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
                
                // If on mobile, close the sidebar after clicking a link
                if (window.innerWidth <= 768) {
                    document.querySelector('.guide-sidebar').classList.remove('active');
                }
                
                // Update active state in sidebar
                document.querySelectorAll('.sidebar-nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                
                // Find the corresponding sidebar link and make it active
                const sidebarLink = document.querySelector(`.sidebar-nav-link[href="#${targetId}"]`);
                if (sidebarLink) {
                    sidebarLink.classList.add('active');
                }
            }
        });
    });
    
    // Mobile sidebar toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const sidebarClose = document.querySelector('.sidebar-close');
    
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            document.querySelector('.guide-sidebar').classList.add('active');
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            document.querySelector('.guide-sidebar').classList.remove('active');
        });
    }
    
    // Highlight the current section in the sidebar based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.guide-section');
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        if (currentSectionId) {
            document.querySelectorAll('.sidebar-nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`.sidebar-nav-link[href="#${currentSectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
    
    // CTA button functionality
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            window.location.href = 'volunteer.html';
        });
    }
    
    // Add scroll handling for the sidebar
    const getStartedSection = document.querySelector('.get-started');
    const guideSidebar = document.querySelector('.guide-sidebar');

    if (getStartedSection && guideSidebar) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.body.classList.add('get-started-visible');
                } else {
                    document.body.classList.remove('get-started-visible');
                }
            });
        }, {
            threshold: 0.1 // Start hiding when 10% of the get-started section is visible
        });

        observer.observe(getStartedSection);
    }
});
