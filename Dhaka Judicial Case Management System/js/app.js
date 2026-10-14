document.addEventListener("DOMContentLoaded", () => {
  // Initialize App
  i18n.translatePage();
  setupLanguageToggle();
  setupThemeToggle();
  setupSidebarNavigation();
  
  // Load Default Page
  navigateTo("dashboard");

  // Re-render when language changes
  document.addEventListener("languageChanged", () => {
    // Re-render whichever view is active
    const activeViewId = document.querySelector(".nav-link.active").getAttribute("data-target");
    if (activeViewId === "dashboard") {
      initDashboard();
    } else if (activeViewId === "cases") {
      initCases();
    } else if (activeViewId === "filing") {
      initFiling();
    } else if (activeViewId === "cause-list") {
      initCauseList();
    } else if (activeViewId === "judges") {
      initJudges();
    } else if (activeViewId === "case-detail" && window.currentCaseId) {
      viewCaseDetail(window.currentCaseId);
    }
  });
});

// View Routing State
function navigateTo(viewId) {
  // Hide all views
  const views = ["dashboard-view", "cases-view", "filing-view", "cause-list-view", "judges-view", "case-detail-view"];
  views.forEach(v => {
    const el = document.getElementById(v);
    if (el) el.classList.add("hidden");
  });

  // Highlight active sidebar navigation
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("data-target") === viewId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Reveal targeted view
  const targetView = document.getElementById(`${viewId}-view`);
  if (targetView) targetView.classList.remove("hidden");

  // Trigger page-specific initializers
  if (viewId === "dashboard") {
    initDashboard();
  } else if (viewId === "cases") {
    initCases();
  } else if (viewId === "filing") {
    initFiling();
  } else if (viewId === "cause-list") {
    initCauseList();
  } else if (viewId === "judges") {
    initJudges();
  }
}

// ----------------------------------------------------
// UI INITIALIZERS
// ----------------------------------------------------

// 1. Dashboard View
function initDashboard() {
  const data = db.getDashboardData();
  const isBn = i18n.currentLanguage === 'bn';
  
  // Translate Numbers if Bangla
  const formatNum = (num) => {
    if (!isBn) return num;
    return String(num).replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);
  };

  // Populate KPIs
  document.getElementById("kpiTotalCases").textContent = formatNum(data.total);
  document.getElementById("kpiActiveCases").textContent = formatNum(data.active);
  document.getElementById("kpiDisposedCases").textContent = formatNum(data.disposed);
  document.getElementById("kpiTodayHearings").textContent = formatNum(data.todayHearings);
  document.getElementById("kpiBacklogRate").textContent = formatNum(data.backlogRate) + "%";

  // Re-draw Charts
  components.renderDashboardCharts(data);

  // Render Live Court Status Board
  const liveStatusBody = document.getElementById("liveCourtroomStatus");
  if (liveStatusBody) {
    const judges = db.getJudges();
    const cases = db.getCases();
    const todayStr = "2026-08-11"; // current system mock date
    
    let html = "";
    
    judges.forEach(j => {
      // Find hearings for this judge today
      const todayHearing = cases.find(c => c.judgeId === j.id && c.nextHearingDate === todayStr);
      const isBn = i18n.currentLanguage === 'bn';
      
      let caseDisplay = isBn ? "কোন শুনানী নেই" : "No hearings scheduled";
      let statusDot = "status-offline";
      let activeCaseId = "";
      
      if (todayHearing) {
        caseDisplay = todayHearing.caseNumber;
        statusDot = "status-live";
        activeCaseId = todayHearing.id;
      }
      
      if (j.status === 'onLeave') {
        caseDisplay = isBn ? "ছুটিতে আছেন" : "On Leave";
        statusDot = "status-leave";
      }

      html += `
        <tr ${activeCaseId ? `class="clickable-row" onclick="viewCaseDetail('${activeCaseId}')"` : ''}>
          <td>
            <div class="judge-cell">
              <span class="indicator-dot ${statusDot}"></span>
              <div>
                <strong>${isBn ? j.nameBn : j.nameEn}</strong>
                <span class="text-sub">${i18n.t(j.court)} (${isBn ? 'কক্ষ' : 'Room'} ${j.room})</span>
              </div>
            </div>
          </td>
          <td>
            <span class="active-case-text">${caseDisplay}</span>
          </td>
          <td>
            <span class="badge ${todayHearing ? 'badge-ongoing' : 'badge-idle'}">
              ${todayHearing ? (isBn ? 'শুনানি চলছে' : 'In Session') : (j.status === 'onLeave' ? (isBn ? 'অনুপস্থিত' : 'Unavailable') : (isBn ? 'অপেক্ষা করছে' : 'Idle'))}
            </span>
          </td>
        </tr>
      `;
    });

    liveStatusBody.innerHTML = html;
  }
}

// 2. Case Registry View
function initCases() {
  const isBn = i18n.currentLanguage === 'bn';
  const tableBody = document.getElementById("caseRegistryTableBody");
  if (!tableBody) return;

  const cases = db.getCases();
  
  // Render function that processes search and filters
  const renderList = () => {
    const searchVal = document.getElementById("caseSearchInput").value.toLowerCase();
    const courtFilter = document.getElementById("filterCourt").value;
    const categoryFilter = document.getElementById("filterCategory").value;
    const statusFilter = document.getElementById("filterStatus").value;

    let filtered = cases.filter(c => {
      const matchSearch = c.caseNumber.toLowerCase().includes(searchVal) ||
                          (isBn ? c.complainantBn : c.complainantEn).toLowerCase().includes(searchVal) ||
                          (isBn ? c.accusedBn : c.accusedEn).toLowerCase().includes(searchVal) ||
                          db.getJudgeById(c.judgeId).nameEn.toLowerCase().includes(searchVal) ||
                          db.getJudgeById(c.judgeId).nameBn.toLowerCase().includes(searchVal);
      
      const matchCourt = courtFilter === "all" || c.court === courtFilter;
      const matchCategory = categoryFilter === "all" || c.category === categoryFilter;
      const matchStatus = statusFilter === "all" || c.status === statusFilter;

      return matchSearch && matchCourt && matchCategory && matchStatus;
    });

    let html = "";
    if (filtered.length === 0) {
      html = `
        <tr>
          <td colspan="7" class="empty-state-cell">
            <i class="fas fa-folder-open empty-icon"></i>
            <p>${isBn ? 'কোনো মামলা পাওয়া যায়নি।' : 'No cases matching your criteria.'}</p>
          </td>
        </tr>
      `;
    } else {
      filtered.forEach(c => {
        const judge = db.getJudgeById(c.judgeId);
        const judgeName = judge ? (isBn ? judge.nameBn : judge.nameEn) : "Unassigned";
        
        const complainant = isBn ? c.complainantBn : c.complainantEn;
        const accused = isBn ? c.accusedBn : c.accusedEn;
        
        const nextHearing = c.nextHearingDate ? 
          new Date(c.nextHearingDate).toLocaleDateString(isBn ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 
          (isBn ? 'ধার্য করা হয়নি' : 'Not Scheduled');
          
        html += `
          <tr class="clickable-row" onclick="viewCaseDetail('${c.id}')">
            <td><strong>${c.caseNumber}</strong></td>
            <td>
              <div class="party-info">
                <span><strong>P:</strong> ${complainant}</span>
                <span><strong>D:</strong> ${accused}</span>
              </div>
            </td>
            <td><span class="court-label">${i18n.t(c.court)}</span></td>
            <td><span class="category-tag tag-${c.category}">${i18n.t(c.category)}</span></td>
            <td><span class="text-sub font-sm">${judgeName}</span></td>
            <td><span class="hearing-date-badge">${nextHearing}</span></td>
            <td><span class="status-badge status-${c.status}">${i18n.t(c.status)}</span></td>
          </tr>
        `;
      });
    }

    tableBody.innerHTML = html;
  };

  // Wire up event listeners
  document.getElementById("caseSearchInput").addEventListener("input", renderList);
  document.getElementById("filterCourt").addEventListener("change", renderList);
  document.getElementById("filterCategory").addEventListener("change", renderList);
  document.getElementById("filterStatus").addEventListener("change", renderList);

  renderList();
}

// 3. New Case Filing View
function initFiling() {
  const isBn = i18n.currentLanguage === 'bn';
  const judgeSelect = document.getElementById("fileJudge");
  if (!judgeSelect) return;

  // Populating Judge Dropdown
  const judges = db.getJudges();
  let html = `<option value="">-- ${isBn ? 'বিচারক নির্বাচন করুন' : 'Select Assigned Judge'} --</option>`;
  judges.forEach(j => {
    html += `<option value="${j.id}">${isBn ? j.nameBn : j.nameEn} (${i18n.t(j.court)})</option>`;
  });
  judgeSelect.innerHTML = html;

  // Reset form and errors
  const form = document.getElementById("fileCaseForm");
  form.reset();

  // Handling Form Submission
  form.onsubmit = (e) => {
    e.preventDefault();

    const category = document.getElementById("fileCategory").value;
    const court = document.getElementById("fileCourt").value;
    const judgeId = document.getElementById("fileJudge").value;
    const complainantEn = document.getElementById("fileCompEn").value;
    const complainantBn = document.getElementById("fileCompBn").value;
    const accusedEn = document.getElementById("fileAccEn").value;
    const accusedBn = document.getElementById("fileAccBn").value;
    const filingDate = document.getElementById("fileDate").value;
    const nextHearingDate = document.getElementById("fileHearingDate").value;
    const descriptionEn = document.getElementById("fileDescEn").value;
    const descriptionBn = document.getElementById("fileDescBn").value;
    const lawyerPlEn = document.getElementById("fileLawyerPEn").value;
    const lawyerPlBn = document.getElementById("fileLawyerPBn").value;
    const lawyerDefEn = document.getElementById("fileLawyerDEn").value;
    const lawyerDefBn = document.getElementById("fileLawyerDBn").value;

    // Build unique Case Number
    const year = new Date(filingDate).getFullYear();
    const courtCount = db.getCases().filter(c => c.court === court).length + 101;
    let typeCode = "Misc. Case";
    if (category === "civil") typeCode = "Title Suit";
    else if (category === "family") typeCode = "Family Suit";
    else if (category === "criminal") typeCode = "C.R. Case";

    const caseNumber = `${typeCode} No. ${courtCount}/${year}`;

    const newCase = {
      caseNumber,
      court,
      category,
      complainantEn,
      complainantBn,
      accusedEn,
      accusedBn,
      filingDate,
      nextHearingDate,
      status: "underTrial",
      judgeId,
      lawyerPlaintiffEn: lawyerPlEn,
      lawyerPlaintiffBn: lawyerPlBn,
      lawyerDefendantEn: lawyerDefEn,
      lawyerDefendantBn: lawyerDefBn,
      detailsEn: descriptionEn,
      detailsBn: descriptionBn
    };

    db.addCase(newCase);
    showToast(i18n.t("successFiling"));
    navigateTo("cases");
  };
}

// 4. Daily Cause List View
function initCauseList() {
  const isBn = i18n.currentLanguage === 'bn';
  const causeListBody = document.getElementById("causeListTableBody");
  if (!causeListBody) return;

  // Default date to today
  const dateInput = document.getElementById("causeListDatePicker");
  if (!dateInput.value) {
    dateInput.value = "2026-08-11"; // Default mockup date matching current system time
  }

  const renderCauseList = () => {
    const selectedDate = dateInput.value;
    const courtFilter = document.getElementById("causeListCourtFilter").value;

    const hearings = db.getCauseList(selectedDate, courtFilter);

    let html = "";
    if (hearings.length === 0) {
      html = `
        <tr>
          <td colspan="6" class="empty-state-cell">
            <i class="far fa-calendar-times empty-icon"></i>
            <p>${isBn ? 'এই তারিখে কোনো শুনানির সময়সূচি নেই।' : 'No hearings scheduled for this date.'}</p>
          </td>
        </tr>
      `;
    } else {
      hearings.forEach((h, index) => {
        const judge = db.getJudgeById(h.judgeId);
        const lastMilestone = h.history[h.history.length - 1];
        
        const serialNo = isBn ? String(index + 1).replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]) : (index + 1);
        const complainant = isBn ? h.complainantBn : h.complainantEn;
        const accused = isBn ? h.accusedBn : h.accusedEn;
        const judgeName = judge ? (isBn ? judge.nameBn : judge.nameEn) : "Unassigned";
        const courtroom = judge ? judge.room : "N/A";
        
        const purpose = lastMilestone ? (isBn ? lastMilestone.purposeBn : lastMilestone.purposeEn) : (isBn ? 'শুনানি' : 'Hearing');

        html += `
          <tr class="clickable-row" onclick="viewCaseDetail('${h.id}')">
            <td><strong class="serial-no">${serialNo}</strong></td>
            <td><strong>${h.caseNumber}</strong></td>
            <td>
              <div class="party-info">
                <span>P: ${complainant}</span>
                <span>D: ${accused}</span>
              </div>
            </td>
            <td>
              <div class="judge-col">
                <strong>${judgeName}</strong>
                <span class="text-sub font-sm">${i18n.t(h.court)}</span>
              </div>
            </td>
            <td><span class="room-tag">${isBn ? 'কক্ষ ' + courtroom : 'Room ' + courtroom}</span></td>
            <td><span class="purpose-tag">${purpose}</span></td>
          </tr>
        `;
      });
    }

    causeListBody.innerHTML = html;
  };

  // Wire events
  dateInput.addEventListener("change", renderCauseList);
  document.getElementById("causeListCourtFilter").addEventListener("change", renderCauseList);

  renderCauseList();
}

// 5. Judges & Courtrooms View
function initJudges() {
  const isBn = i18n.currentLanguage === 'bn';
  const container = document.getElementById("judgesGridContainer");
  if (!container) return;

  const judges = db.getJudges();
  let html = "";

  judges.forEach(j => {
    // Count active cases assigned to this judge
    const cases = db.getCases();
    const activeCasesCount = cases.filter(c => c.judgeId === j.id && c.status !== 'disposed').length;

    // Workload color coding
    let workloadClass = "workload-low";
    let workloadText = isBn ? "স্বাভাবিক" : "Normal";
    if (activeCasesCount > 3) {
      workloadClass = "workload-high";
      workloadText = isBn ? "উচ্চ" : "High Workload";
    } else if (activeCasesCount > 1) {
      workloadClass = "workload-medium";
      workloadText = isBn ? "মাঝারি" : "Medium Workload";
    }

    const countText = isBn ? 
      String(activeCasesCount).replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]) + "টি চলমান মামলা" : 
      `${activeCasesCount} Active Cases`;

    const statusBadge = j.status === "active" ? 
      `<span class="judge-status-badge status-active"><i class="fas fa-circle-notch fa-spin"></i> ${isBn ? 'কর্মরত' : 'In Office'}</span>` : 
      `<span class="judge-status-badge status-leave"><i class="fas fa-plane-departure"></i> ${isBn ? 'ছুটিতে' : 'On Leave'}</span>`;

    html += `
      <div class="judge-card glass-panel animate-scale">
        <div class="judge-card-header">
          <div class="judge-avatar">
            <i class="fas fa-user-tie"></i>
          </div>
          <div>
            <h3 class="judge-card-name">${isBn ? j.nameBn : j.nameEn}</h3>
            <p class="judge-card-court">${i18n.t(j.court)}</p>
          </div>
        </div>
        <div class="judge-card-body">
          <div class="info-row">
            <span class="label"><i class="fas fa-door-open icon-dim"></i> ${isBn ? 'কক্ষ নম্বর' : 'Room Number'}:</span>
            <span class="value font-semibold">${j.room}</span>
          </div>
          <div class="info-row">
            <span class="label"><i class="fas fa-hands-helping icon-dim"></i> ${isBn ? 'পেশকার' : 'Bench Assistant'}:</span>
            <span class="value">${isBn ? j.peshkarBn : j.peshkarEn}</span>
          </div>
          <div class="info-row">
            <span class="label"><i class="fas fa-envelope icon-dim"></i> ${isBn ? 'ইমেইল' : 'Email'}:</span>
            <span class="value font-sm">${j.email}</span>
          </div>
          <div class="info-row">
            <span class="label"><i class="fas fa-chart-line icon-dim"></i> ${isBn ? 'কাজের চাপ' : 'Workload'}:</span>
            <span class="value"><span class="workload-tag ${workloadClass}">${workloadText}</span> (${countText})</span>
          </div>
        </div>
        <div class="judge-card-footer">
          ${statusBadge}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ----------------------------------------------------
// CASE DETAILS & MILESTONE UPDATE
// ----------------------------------------------------

function viewCaseDetail(caseId) {
  window.currentCaseId = caseId;
  navigateTo("case-detail");

  const cObj = db.getCaseById(caseId);
  if (!cObj) return;

  const isBn = i18n.currentLanguage === 'bn';
  const judge = db.getJudgeById(cObj.judgeId);

  // Populate textual info
  document.getElementById("detailCaseNumber").textContent = cObj.caseNumber;
  document.getElementById("detailComplainant").textContent = isBn ? cObj.complainantBn : cObj.complainantEn;
  document.getElementById("detailAccused").textContent = isBn ? cObj.accusedBn : cObj.accusedEn;
  document.getElementById("detailCourt").textContent = i18n.t(cObj.court);
  document.getElementById("detailCategory").innerHTML = `<span class="category-tag tag-${cObj.category}">${i18n.t(cObj.category)}</span>`;
  
  const statusBadge = document.getElementById("detailStatus");
  statusBadge.className = `status-badge status-${cObj.status}`;
  statusBadge.textContent = i18n.t(cObj.status);
  
  document.getElementById("detailFilingDate").textContent = new Date(cObj.filingDate).toLocaleDateString(isBn ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const nextHearing = cObj.nextHearingDate ? 
    new Date(cObj.nextHearingDate).toLocaleDateString(isBn ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 
    (isBn ? 'ধার্য করা হয়নি' : 'Not Scheduled');
  document.getElementById("detailNextHearing").textContent = nextHearing;

  document.getElementById("detailJudgeName").textContent = judge ? (isBn ? judge.nameBn : judge.nameEn) : "Unassigned";
  document.getElementById("detailJudgeRoom").textContent = judge ? (isBn ? `কক্ষ নং ` + judge.room : `Room No. ` + judge.room) : "N/A";
  
  document.getElementById("detailLawyerP").textContent = isBn ? cObj.lawyerPlaintiffBn : cObj.lawyerPlaintiffEn;
  document.getElementById("detailLawyerD").textContent = isBn ? cObj.lawyerDefendantBn : cObj.lawyerDefendantEn;
  document.getElementById("detailDescription").textContent = isBn ? cObj.detailsBn : cObj.detailsEn;

  // Render History Timeline
  components.renderCaseTimeline(cObj);

  // Configure Form Submission for Adding Hearings / Updating Milestones
  const hearingForm = document.getElementById("addHearingForm");
  hearingForm.reset();
  
  // Set default hearing date input to today + 1 month
  const nextDateInput = document.getElementById("hearingNextDate");
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextDateInput.value = nextMonth.toISOString().split('T')[0];

  hearingForm.onsubmit = (e) => {
    e.preventDefault();

    const purposeEn = document.getElementById("hearingPurposeEn").value;
    const purposeBn = document.getElementById("hearingPurposeBn").value;
    const outcomeEn = document.getElementById("hearingOutcomeEn").value;
    const outcomeBn = document.getElementById("hearingOutcomeBn").value;
    const nextDate = document.getElementById("hearingNextDate").value;
    const newStatus = document.getElementById("hearingStatusUpdate").value;

    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Add hearing milestone to history
    cObj.history.push({
      date: todayStr,
      purposeEn,
      purposeBn,
      outcomeEn,
      outcomeBn
    });

    // 2. Update Case status and next scheduled hearing
    cObj.status = newStatus;
    cObj.nextHearingDate = newStatus === "disposed" ? "" : nextDate;

    // 3. Save Case updates
    db.updateCase(cObj);
    showToast(i18n.t("successUpdate"));

    // 4. Reload page components
    viewCaseDetail(caseId);
  };
}

// Helper to switch status within Details view
function updateCaseStatusDirect(newStatus) {
  const cObj = db.getCaseById(window.currentCaseId);
  if (!cObj) return;
  cObj.status = newStatus;
  if (newStatus === "disposed") {
    cObj.nextHearingDate = "";
  }
  db.updateCase(cObj);
  showToast(i18n.t("successUpdate"));
  viewCaseDetail(window.currentCaseId);
}

// ----------------------------------------------------
// SETTINGS, THEME & SYSTEM PREFERENCES
// ----------------------------------------------------

function setupLanguageToggle() {
  const toggleBtn = document.getElementById("languageToggleBtn");
  if (!toggleBtn) return;

  const updateToggleUI = () => {
    toggleBtn.textContent = i18n.currentLanguage === 'en' ? 'বাংলা' : 'English';
  };

  updateToggleUI();

  toggleBtn.onclick = () => {
    const nextLang = i18n.currentLanguage === 'en' ? 'bn' : 'en';
    i18n.setLanguage(nextLang);
    updateToggleUI();
  };
}

function setupThemeToggle() {
  const toggleBtn = document.getElementById("themeToggleBtn");
  if (!toggleBtn) return;

  const getSavedTheme = () => localStorage.getItem("theme") || "dark";
  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    
    // Toggle class on toggle button icon
    const icon = toggleBtn.querySelector("i");
    if (theme === 'dark') {
      icon.className = "fas fa-sun";
    } else {
      icon.className = "fas fa-moon";
    }
    
    // Refresh charts to match theme grid lines
    if (document.getElementById("dashboard-view") && !document.getElementById("dashboard-view").classList.contains("hidden")) {
      initDashboard();
    }
  };

  // Set Initial Theme
  setTheme(getSavedTheme());

  toggleBtn.onclick = () => {
    const activeTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };
}

function setupSidebarNavigation() {
  document.querySelectorAll(".nav-link").forEach(link => {
    link.onclick = (e) => {
      e.preventDefault();
      const target = link.getAttribute("data-target");
      navigateTo(target);
    };
  });
}

// Beautiful Toast Notifications
function showToast(message) {
  const existing = document.querySelector(".toast-notification");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast-notification glass-panel animate-slide-in";
  toast.innerHTML = `
    <i class="fas fa-check-circle toast-icon"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-fade-out");
    toast.addEventListener("transitionend", () => toast.remove());
  }, 3500);
}

// Bind direct helpers to window
window.viewCaseDetail = viewCaseDetail;
window.updateCaseStatusDirect = updateCaseStatusDirect;
window.navigateTo = navigateTo;
