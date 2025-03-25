/**
 * Calendar Manager - Handles calendar functionality for the EcoRise project
 * Ensures the calendar modal works consistently across all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait for modals to be injected before initializing
    document.addEventListener('modalsInjected', initCalendar);
    
    // Also try to initialize immediately in case modals are already loaded
    initCalendar();
    
    function initCalendar() {
        const calendarModal = document.getElementById('calendarModal');
        if (!calendarModal) return; // Exit if calendar modal doesn't exist

        const calendarGrid = document.getElementById('calendarGrid');
        const currentMonthEl = document.getElementById('currentMonth');
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');
        const selectedDateEl = document.getElementById('selectedDate');
        const eventsContainer = document.getElementById('eventsContainer');
        
        // Current date tracking
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        
        // Sample events data - in a real app, this would come from an API or database
        const events = [
            {
                date: '2025-03-26',
                time: '10:00 AM - 12:00 PM',
                title: 'Community Cleanup',
                location: 'Lincoln Park'
            },
            {
                date: '2025-03-26',
                time: '2:00 PM - 4:00 PM',
                title: 'Recycling Workshop',
                location: 'Community Center'
            },
            {
                date: '2025-03-28',
                time: '9:00 AM - 11:00 AM',
                title: 'Tree Planting Event',
                location: 'Riverside Park'
            },
            {
                date: '2025-04-02',
                time: '1:00 PM - 3:00 PM',
                title: 'Sustainable Gardening',
                location: 'Botanical Gardens'
            },
            {
                date: '2025-04-05',
                time: '10:00 AM - 12:00 PM',
                title: 'Beach Cleanup',
                location: 'East Coast Beach'
            }
        ];
        
        // Initialize calendar
        generateCalendar(currentMonth, currentYear);
        
        // Event listeners for month navigation
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                generateCalendar(currentMonth, currentYear);
            });
        }
        
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
                generateCalendar(currentMonth, currentYear);
            });
        }
        
        // Generate calendar for month/year
        function generateCalendar(month, year) {
            // Skip if elements don't exist
            if (!calendarGrid || !currentMonthEl) return;
            
            // Update month/year display
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            currentMonthEl.textContent = `${monthNames[month]} ${year}`;
            
            // Clear existing grid (except headers)
            const headers = Array.from(calendarGrid.querySelectorAll('.calendar-day-header'));
            calendarGrid.innerHTML = '';
            
            // Add headers back
            headers.forEach(header => {
                calendarGrid.appendChild(header);
            });
            
            // Calculate first day of month and total days
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            // Create empty cells for days before start of month
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day empty';
                calendarGrid.appendChild(emptyDay);
            }
            
            // Create cells for each day of the month
            const today = new Date();
            
            for (let day = 1; day <= daysInMonth; day++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'calendar-day';
                dayCell.textContent = day;
                
                // Check if this day is today
                if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    dayCell.classList.add('today');
                }
                
                // Check if this day has events
                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasEvents = events.some(event => event.date === dateString);
                if (hasEvents) {
                    dayCell.classList.add('has-event');
                }
                
                // Add click handler
                dayCell.addEventListener('click', () => {
                    // Remove active class from all days
                    document.querySelectorAll('.calendar-day').forEach(day => {
                        day.classList.remove('active');
                    });
                    
                    // Add active class to clicked day
                    dayCell.classList.add('active');
                    
                    // Update selected date display
                    const selectedDate = new Date(year, month, day);
                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    selectedDateEl.textContent = selectedDate.toLocaleDateString('en-US', options);
                    
                    // Show events for this day
                    showEvents(dateString);
                });
                
                calendarGrid.appendChild(dayCell);
            }
            
            // Show events for current day
            const todayString = `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            showEvents(todayString);
        }
        
        // Show events for a specific date
        function showEvents(dateString) {
            if (!eventsContainer) return;
            
            // Clear existing events
            eventsContainer.innerHTML = '';
            
            // Filter events for this date
            const todayEvents = events.filter(event => event.date === dateString);
            
            if (todayEvents.length === 0) {
                // No events for this day
                const noEvents = document.createElement('p');
                noEvents.textContent = 'No events scheduled for this day.';
                eventsContainer.appendChild(noEvents);
            } else {
                // Create event items
                todayEvents.forEach(event => {
                    const eventItem = document.createElement('div');
                    eventItem.className = 'event-item';
                    
                    const eventTime = document.createElement('div');
                    eventTime.className = 'event-time';
                    eventTime.textContent = event.time;
                    
                    const eventTitle = document.createElement('div');
                    eventTitle.className = 'event-title';
                    eventTitle.textContent = event.title;
                    
                    const eventLocation = document.createElement('div');
                    eventLocation.className = 'event-location';
                    eventLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${event.location}`;
                    
                    eventItem.appendChild(eventTime);
                    eventItem.appendChild(eventTitle);
                    eventItem.appendChild(eventLocation);
                    
                    eventsContainer.appendChild(eventItem);
                });
            }
        }
    }
});
