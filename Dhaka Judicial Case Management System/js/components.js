let statusChartInstance = null;
let courtChartInstance = null;

const components = {
  // Renders the two dashboard charts
  renderDashboardCharts(dashboardData) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#E2E8F0' : '#1E293B';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    
    const isBn = window.i18n.currentLanguage === 'bn';

    // Status mapping for chart labels
    const statusLabels = [
      window.i18n.t('pending'),
      window.i18n.t('underTrial'),
      window.i18n.t('disposed'),
      window.i18n.t('stayed'),
      window.i18n.t('appealed')
    ];

    const statusValues = [
      dashboardData.statusCounts.pending,
      dashboardData.statusCounts.underTrial,
      dashboardData.statusCounts.disposed,
      dashboardData.statusCounts.stayed,
      dashboardData.statusCounts.appealed
    ];

    // Destroy existing charts to reload with new configuration
    if (statusChartInstance) statusChartInstance.destroy();
    if (courtChartInstance) courtChartInstance.destroy();

    // 1. Status Chart (Doughnut)
    const ctxStatus = document.getElementById('statusChart').getContext('2d');
    statusChartInstance = new Chart(ctxStatus, {
      type: 'doughnut',
      data: {
        labels: statusLabels,
        datasets: [{
          data: statusValues,
          backgroundColor: [
            'rgba(245, 158, 11, 0.85)', // Warning Amber for Pending
            'rgba(37, 99, 235, 0.85)',  // Primary Blue for Trial
            'rgba(16, 185, 129, 0.85)', // Success Emerald for Disposed
            'rgba(100, 116, 139, 0.85)',// Slate for Stayed
            'rgba(225, 29, 72, 0.85)'   // Rose for Appealed
          ],
          borderColor: isDark ? '#1e293b' : '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              font: {
                family: isBn ? 'Hind Siliguri' : 'Outfit',
                size: 13
              }
            }
          },
          tooltip: {
            titleFont: { family: isBn ? 'Hind Siliguri' : 'Outfit' },
            bodyFont: { family: isBn ? 'Hind Siliguri' : 'Outfit' }
          }
        },
        cutout: '70%'
      }
    });

    // 2. Court Chart (Bar)
    const courtLabels = [
      window.i18n.t('courtDistrict'),
      window.i18n.t('courtMetropolitan'),
      window.i18n.t('courtCMM'),
      window.i18n.t('courtCJM')
    ];

    const courtValues = [
      dashboardData.courtCounts.courtDistrict,
      dashboardData.courtCounts.courtMetropolitan,
      dashboardData.courtCounts.courtCMM,
      dashboardData.courtCounts.courtCJM
    ];

    const ctxCourt = document.getElementById('courtChart').getContext('2d');
    courtChartInstance = new Chart(ctxCourt, {
      type: 'bar',
      data: {
        labels: courtLabels,
        datasets: [{
          label: isBn ? 'মামলার সংখ্যা' : 'No. of Cases',
          data: courtValues,
          backgroundColor: 'rgba(99, 102, 241, 0.8)', // Indigo
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            titleFont: { family: isBn ? 'Hind Siliguri' : 'Outfit' },
            bodyFont: { family: isBn ? 'Hind Siliguri' : 'Outfit' }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: textColor,
              font: {
                family: isBn ? 'Hind Siliguri' : 'Outfit',
                size: 11
              }
            }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              stepSize: 1,
              font: {
                family: isBn ? 'Hind Siliguri' : 'Outfit'
              }
            }
          }
        }
      }
    });
  },

  // Renders a beautiful visual vertical timeline for case history
  renderCaseTimeline(caseObj) {
    const isBn = window.i18n.currentLanguage === 'bn';
    const container = document.getElementById('caseHistoryTimeline');
    if (!container) return;

    if (!caseObj.history || caseObj.history.length === 0) {
      container.innerHTML = `<p class="no-history-text">${isBn ? 'কোনো ইতিহাস পাওয়া যায়নি।' : 'No case milestone history found.'}</p>`;
      return;
    }

    // Sort history by date descending or ascending. Ascending (chronological) is better for timeline.
    const sortedHistory = [...caseObj.history].sort((a, b) => new Date(a.date) - new Date(b.date));

    let html = '<div class="timeline-container">';
    sortedHistory.forEach((h, index) => {
      const purpose = isBn ? h.purposeBn : h.purposeEn;
      const outcome = isBn ? h.outcomeBn : h.outcomeEn;
      const dateFormatted = new Date(h.date).toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const isLast = index === sortedHistory.length - 1;
      const pulseClass = isLast && caseObj.status !== 'disposed' ? 'timeline-dot-active' : '';

      html += `
        <div class="timeline-item">
          <div class="timeline-dot ${pulseClass}"></div>
          <div class="timeline-content">
            <span class="timeline-date">${dateFormatted}</span>
            <h4 class="timeline-purpose">${purpose}</h4>
            <p class="timeline-outcome">${outcome}</p>
          </div>
        </div>
      `;
    });
    html += '</div>';

    container.innerHTML = html;
  }
};

window.components = components;
