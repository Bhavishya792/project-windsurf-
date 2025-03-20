document.addEventListener('DOMContentLoaded', function() {
    // Create sidebar navigation
    const sidebarHTML = `
        <aside class="guide-sidebar">
            <h2 class="guide-sidebar-title"><i class="fas fa-compass"></i> Quick Navigation</h2>
            <button class="sidebar-close"><i class="fas fa-times"></i></button>
            <ul class="sidebar-nav-list">
                <li class="sidebar-nav-item">
                    <a href="#introduction" class="sidebar-nav-link">
                        <i class="fas fa-info-circle"></i> Introduction
                    </a>
                </li>
                <li class="sidebar-nav-item">
                    <a href="#getting-started" class="sidebar-nav-link">
                        <i class="fas fa-leaf"></i> Getting Started
                    </a>
                </li>
                <li class="sidebar-nav-item">
                    <a href="#recycling-dos-donts" class="sidebar-nav-link">
                        <i class="fas fa-check-circle"></i> Recycling Dos & Don'ts
                    </a>
                </li>
                <li class="sidebar-nav-item">
                    <a href="#composting-dos-donts" class="sidebar-nav-link">
                        <i class="fas fa-seedling"></i> Composting Dos & Don'ts
                    </a>
                </li>
                <li class="sidebar-nav-item">
                    <a href="#myths" class="sidebar-nav-link">
                        <i class="fas fa-exclamation-triangle"></i> Common Myths
                    </a>
                </li>
                <li class="sidebar-nav-item">
                    <a href="#recyclable-items" class="sidebar-nav-link">
                        <i class="fas fa-recycle"></i> What Can Be Recycled
                    </a>
                </li>
                <li class="sidebar-nav-item">
                    <a href="#environmental-impact" class="sidebar-nav-link">
                        <i class="fas fa-globe-americas"></i> Environmental Impact
                    </a>
                </li>
                <li class="sidebar-nav-item">
                    <a href="#join-ecorise" class="sidebar-nav-link">
                        <i class="fas fa-hands-helping"></i> Join the Movement
                    </a>
                </li>
            </ul>
        </aside>
    `;

    // Create mobile toggle button
    const mobileToggleHTML = `
        <button class="mobile-nav-toggle">
            <i class="fas fa-bars"></i>
        </button>
    `;

    // Get the guide content container
    const guideContent = document.querySelector('.guide-content');
    
    if (guideContent) {
        // Create a wrapper for the existing content
        const mainContent = document.createElement('div');
        mainContent.className = 'guide-main-content';
        
        // Move all existing children of guideContent to mainContent
        while (guideContent.firstChild) {
            mainContent.appendChild(guideContent.firstChild);
        }
        
        // Insert the sidebar at the beginning of guideContent
        guideContent.innerHTML = sidebarHTML;
        
        // Add the main content back after the sidebar
        guideContent.appendChild(mainContent);
        
        // Add the mobile toggle button to the body
        document.body.insertAdjacentHTML('beforeend', mobileToggleHTML);
        
        // Remove the old quick navigation section
        const quickNavSection = document.querySelector('.guide-section:first-child');
        if (quickNavSection && quickNavSection.querySelector('.guide-section-header h2 i.fa-compass')) {
            quickNavSection.remove();
        }
        
        // Add event listeners for sidebar functionality
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
        
        // Add scroll event listener to highlight current section in sidebar
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('.guide-section');
            let currentSectionId = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                
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
        
        // Add click event listeners to sidebar links
        document.querySelectorAll('.sidebar-nav-link').forEach(link => {
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
                    
                    // Make the clicked link active
                    this.classList.add('active');
                }
            });
        });
    }
});
