odoo.define('gym_meliora.portal_calendar_init', [], function (require) {
    'use strict';
  
    console.log("✅ Calendar JS loaded");
  
    const observer = new MutationObserver(() => {
      const calendarEl = document.getElementById('gym-session-calendar');
      if (calendarEl) {
        observer.disconnect();
  
        try {
          const eventsData = JSON.parse(calendarEl.dataset.events);
          const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek',
            },
            height: 'auto',
            events: eventsData,
          });
          calendar.render();
          console.log("✅ Calendar rendered");
        } catch (e) {
          console.error("❌ Failed to parse calendar events:", e);
        }
      }
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
    return {};
  });
  
  