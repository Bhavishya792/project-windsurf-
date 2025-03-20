// Calendar functionality
export function initializeCalendar() {
    console.log('Initializing calendar...');
    
    const calendarBtn = document.getElementById('calendarBtn');
    const calendarModal = document.getElementById('calendarModal');
    
    if (!calendarBtn) {
        console.error('Calendar button not found');
        return;
    }
    
    if (!calendarModal) {
        console.error('Calendar modal not found');
        return;
    }
    
    const calendarContainer = calendarModal.querySelector('.calendar-container');
    const closeCalendarBtn = calendarModal.querySelector('.close-btn');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthElement = document.getElementById('currentMonth');
    const calendarDaysElement = document.getElementById('calendarDays');
    const eventItemsElement = document.querySelector('.event-items');

    if (!calendarContainer || !closeCalendarBtn || !prevMonthBtn || 
        !nextMonthBtn || !currentMonthElement || !calendarDaysElement || !eventItemsElement) {
        console.error('One or more calendar elements not found');
        return;
    }

    let currentDate = new Date();
    let selectedDate = null;

    // Sample events data
    const events = [
        {
            title: 'Beach Clean-up Drive',
            date: '2025-03-23',
            time: '7:00 AM - 11:00 AM',
            location: 'Juhu Beach, Mumbai'
        },
        {
            title: 'Urban Forest Initiative',
            date: '2025-03-20',
            time: '6:30 AM - 10:30 AM',
            location: 'Aarey Colony, Mumbai'
        },
        {
            title: 'Eco-Education Workshop',
            date: '2025-03-27',
            time: '4:00 PM - 6:00 PM',
            location: 'Green Earth Center, Powai'
        }
    ];

    // Calendar button click handler - toggle calendar visibility
    calendarBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Calendar button clicked');
        
        // Toggle calendar visibility
        if (calendarModal.style.display === 'block') {
            calendarModal.style.display = 'none';
        } else {
            calendarModal.style.display = 'block';
            renderCalendar(currentDate);
        }
    });

    // Close button functionality
    closeCalendarBtn.addEventListener('click', function(e) {
        e.preventDefault();
        calendarModal.style.display = 'none';
    });

    // Month navigation
    prevMonthBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    // Close when clicking outside the calendar
    document.addEventListener('click', function(event) {
        if (calendarModal.style.display === 'block' && 
            !calendarContainer.contains(event.target) && 
            event.target !== calendarBtn) {
            calendarModal.style.display = 'none';
        }
    });

    // Render calendar
    function renderCalendar(date) {
        console.log('Rendering calendar for date:', date);
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const startingDay = firstDay.getDay();
        const monthLength = lastDay.getDate();
        
        // Update month/year display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthElement.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        
        // Clear previous calendar
        calendarDaysElement.innerHTML = '';
        
        // Add empty cells for days before start of month
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            calendarDaysElement.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= monthLength; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            const currentDateString = formatDate(new Date(date.getFullYear(), date.getMonth(), day));
            const dayEvents = events.filter(event => event.date === currentDateString);
            
            if (dayEvents.length > 0) {
                dayElement.classList.add('has-events');
                const eventDot = document.createElement('span');
                eventDot.className = 'event-dot';
                dayElement.appendChild(eventDot);
            }
            
            // Check if this is today
            const today = new Date();
            if (date.getFullYear() === today.getFullYear() && 
                date.getMonth() === today.getMonth() && 
                day === today.getDate()) {
                dayElement.classList.add('today');
            }
            
            // Check if this is the selected date
            if (selectedDate && 
                date.getFullYear() === selectedDate.getFullYear() && 
                date.getMonth() === selectedDate.getMonth() && 
                day === selectedDate.getDate()) {
                dayElement.classList.add('selected');
            }
            
            const dayNumber = document.createElement('span');
            dayNumber.textContent = day;
            dayElement.appendChild(dayNumber);
            
            // Add click event to show events for this day
            dayElement.addEventListener('click', () => {
                // Remove selected class from all days
                document.querySelectorAll('.calendar-day').forEach(day => {
                    day.classList.remove('selected');
                });
                
                // Add selected class to clicked day
                dayElement.classList.add('selected');
                
                // Update selected date
                selectedDate = new Date(date.getFullYear(), date.getMonth(), day);
                
                // Show events for this day
                showEvents(currentDateString);
            });
            
            calendarDaysElement.appendChild(dayElement);
        }
    }
    
    // Show events for a specific date
    function showEvents(dateString) {
        const dayEvents = events.filter(event => event.date === dateString);
        
        if (dayEvents.length === 0) {
            eventItemsElement.innerHTML = '<p>No events scheduled for this date</p>';
            return;
        }
        
        eventItemsElement.innerHTML = '';
        
        dayEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            
            eventElement.innerHTML = `
                <h4>${event.title}</h4>
                <p><i class="fas fa-clock"></i> ${event.time}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            `;
            
            eventItemsElement.appendChild(eventElement);
        });
    }
    
    // Helper function to format date as YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Initialize calendar
    console.log('Calendar setup complete, rendering initial view');
    renderCalendar(currentDate);
}
