odoo.define('gym_meliora.portal_dashboard_chart', [], function (require) {
    'use strict';
  
    console.log("📊 Chart module loaded");
  
    const observer = new MutationObserver(() => {
      const chartCanvas = document.getElementById('attendanceChart');
      if (chartCanvas && typeof Chart !== 'undefined') {
        observer.disconnect();
  
        try {
          const labels = JSON.parse(chartCanvas.dataset.labels);
          const values = JSON.parse(chartCanvas.dataset.values);
  
          new Chart(chartCanvas, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: 'Attendances',
                data: values,
                backgroundColor: '#4B00B7',
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1 }
                }
              }
            }
          });
  
          console.log("✅ Attendance Chart rendered");
  
        } catch (err) {
          console.error("❌ Error parsing chart data:", err);
        }
      }
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  });
  