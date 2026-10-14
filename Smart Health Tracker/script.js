// MEDOS HOSPITAL MANAGEMENT SYSTEM - MAIN LOGIC CORE

// ==========================================
// 1. DATA MODELS & STATE INITIALIZATION
// ==========================================

const DEFAULT_DOCTORS = [
  { id: "DOC01", name: "Dr. Alice Gregory", dept: "Cardiology", status: "Active", shift: "Morning", load: 2, avatar: "AG" },
  { id: "DOC02", name: "Dr. Robert Chen", dept: "Neurology", status: "Active", shift: "Night", load: 1, avatar: "RC" },
  { id: "DOC03", name: "Dr. Sarah Jenkins", dept: "General Medicine", status: "Active", shift: "Day", load: 0, avatar: "SJ" },
  { id: "DOC04", name: "Dr. Emily Taylor", dept: "Pediatrics", status: "Active", shift: "Day", load: 1, avatar: "ET" },
  { id: "DOC05", name: "Dr. David Kovic", dept: "General Surgery", status: "On-Leave", shift: "Afternoon", load: 0, avatar: "DK" }
];

const DEFAULT_PATIENTS = [
  { id: "PAT101", name: "Jane Doe", age: 34, gender: "Female", phone: "+1 (555) 382-9012", condition: "Acute Appendicitis", status: "In Treatment", pulse: 78, bp: "120/80", ward: "General", bedIndex: 0, dateAdmitted: "2026-07-25" },
  { id: "PAT102", name: "Arthur Dent", age: 42, gender: "Male", phone: "+1 (555) 913-4050", condition: "Mild Concussion", status: "Observation", pulse: 64, bp: "130/85", ward: "Emergency", bedIndex: 1, dateAdmitted: "2026-07-27" },
  { id: "PAT103", name: "Marcus Aurelius", age: 60, gender: "Male", phone: "+1 (555) 124-7890", condition: "Chronic Hypertension", status: "Critical", pulse: 88, bp: "150/95", ward: "ICU", bedIndex: 0, dateAdmitted: "2026-07-24" },
  { id: "PAT104", name: "Clara Oswald", age: 28, gender: "Female", phone: "+1 (555) 234-5678", condition: "Pregnancy Routine Checkup", status: "Observation", pulse: 70, bp: "115/70", ward: "Pediatrics", bedIndex: 2, dateAdmitted: "2026-07-28" },
  { id: "PAT105", name: "John Watson", age: 45, gender: "Male", phone: "+1 (555) 876-5432", condition: "Routine Health Checkup", status: "Discharged", pulse: 72, bp: "120/80", ward: "none", bedIndex: null, dateAdmitted: "2026-07-26" }
];

const DEFAULT_APPOINTMENTS = [
  { id: "APT201", patientId: "PAT105", patientName: "John Watson", doctorId: "DOC03", doctorName: "Dr. Sarah Jenkins", dept: "General Medicine", date: "2026-07-28", time: "10:30", reason: "Follow-up Consultation", status: "Completed" },
  { id: "APT202", patientId: "PAT101", patientName: "Jane Doe", doctorId: "DOC05", doctorName: "Dr. David Kovic", dept: "General Surgery", date: "2026-07-28", time: "15:00", reason: "Pre-surgery briefing", status: "Scheduled" },
  { id: "APT203", patientId: "PAT103", patientName: "Marcus Aurelius", doctorId: "DOC01", doctorName: "Dr. Alice Gregory", dept: "Cardiology", date: "2026-07-28", time: "16:30", reason: "ECG Review", status: "Scheduled" },
  { id: "APT204", patientId: "PAT104", patientName: "Clara Oswald", doctorId: "DOC04", doctorName: "Dr. Emily Taylor", dept: "Pediatrics", date: "2026-07-29", time: "09:00", reason: "Fetal Ultrasound Scan", status: "Scheduled" }
];

const DEFAULT_INVOICES = [
  { id: "INV701", patientId: "PAT103", patientName: "Marcus Aurelius", desc: "ICU Admission & ECG diagnostics", amount: 4500.00, date: "2026-07-25", status: "Insured" },
  { id: "INV702", patientId: "PAT101", patientName: "Jane Doe", desc: "Emergency Appendectomy Care", amount: 2100.00, date: "2026-07-26", status: "Paid" },
  { id: "INV703", patientId: "PAT102", patientName: "Arthur Dent", desc: "General Outpatient observation charge", amount: 350.00, date: "2026-07-27", status: "Pending" }
];

const DEFAULT_INVENTORY = [
  { id: "MED01", name: "Amoxicillin", type: "Tablet", stock: 420, minStock: 100, price: 12.50 },
  { id: "MED02", name: "Ibuprofen", type: "Capsule", stock: 24, minStock: 50, price: 6.20 }, // Low stock notice trigger!
  { id: "MED03", name: "Insulin Glargine", type: "Vial", stock: 85, minStock: 25, price: 48.00 },
  { id: "MED04", name: "Paracetamol", type: "Tablet", stock: 1100, minStock: 200, price: 1.80 },
  { id: "MED05", name: "Atorvastatin", type: "Tablet", stock: 150, minStock: 50, price: 15.75 },
  { id: "MED06", name: "Salbutamol Inhaler", type: "Inhaler", stock: 12, minStock: 20, price: 22.00 } // Low stock notice!
];

const DEFAULT_NOTIFICATIONS = [
  { id: "NTF01", text: "Marcus Aurelius was admitted to ICU bed 1", type: "info", time: "3 hours ago" },
  { id: "NTF02", text: "Warning: Ibuprofen (Capsule) inventory stock is low (24 left)", type: "warning", time: "4 hours ago" },
  { id: "NTF03", text: "Invoice #INV702 for patient Jane Doe was paid", type: "success", time: "1 day ago" }
];

// Initialize empty bed rosters for 4 wards (ICU, General, Pediatrics, Emergency). Each has 5 beds.
const WARD_NAMES = ["ICU", "General", "Pediatrics", "Emergency"];
function initDefaultBeds() {
  const beds = {};
  WARD_NAMES.forEach(ward => {
    beds[ward] = Array.from({ length: 5 }, (_, i) => ({
      index: i,
      status: "vacant", // vacant, occupied, maintenance
      patientId: null,
      patientName: null
    }));
  });
  
  // Link preloaded patients to beds
  beds["ICU"][0] = { index: 0, status: "occupied", patientId: "PAT103", patientName: "Marcus Aurelius" };
  beds["General"][0] = { index: 0, status: "occupied", patientId: "PAT101", patientName: "Jane Doe" };
  beds["Emergency"][1] = { index: 1, status: "occupied", patientId: "PAT102", patientName: "Arthur Dent" };
  beds["Pediatrics"][2] = { index: 2, status: "occupied", patientId: "PAT104", patientName: "Clara Oswald" };
  // Add a maintenance bed for demonstration
  beds["ICU"][2] = { index: 2, status: "maintenance", patientId: null, patientName: null };
  beds["General"][4] = { index: 4, status: "maintenance", patientId: null, patientName: null };

  return beds;
}

// Global Application State Object
let state = {
  theme: "light",
  patients: [],
  doctors: [],
  appointments: [],
  invoices: [],
  inventory: [],
  notifications: [],
  beds: {}
};

// Load state from localStorage or load defaults
function loadAppState() {
  state.theme = localStorage.getItem("hms_theme") || "light";
  state.patients = JSON.parse(localStorage.getItem("hms_patients")) || DEFAULT_PATIENTS;
  state.doctors = JSON.parse(localStorage.getItem("hms_doctors")) || DEFAULT_DOCTORS;
  state.appointments = JSON.parse(localStorage.getItem("hms_appointments")) || DEFAULT_APPOINTMENTS;
  state.invoices = JSON.parse(localStorage.getItem("hms_invoices")) || DEFAULT_INVOICES;
  state.inventory = JSON.parse(localStorage.getItem("hms_inventory")) || DEFAULT_INVENTORY;
  state.notifications = JSON.parse(localStorage.getItem("hms_notifications")) || DEFAULT_NOTIFICATIONS;
  
  const storedBeds = localStorage.getItem("hms_beds");
  if (storedBeds) {
    state.beds = JSON.parse(storedBeds);
  } else {
    state.beds = initDefaultBeds();
  }

  // Set Theme
  document.documentElement.setAttribute("data-theme", state.theme);
  updateThemeIcon();
}

function saveAppState() {
  localStorage.setItem("hms_theme", state.theme);
  localStorage.setItem("hms_patients", JSON.stringify(state.patients));
  localStorage.setItem("hms_doctors", JSON.stringify(state.doctors));
  localStorage.setItem("hms_appointments", JSON.stringify(state.appointments));
  localStorage.setItem("hms_invoices", JSON.stringify(state.invoices));
  localStorage.setItem("hms_inventory", JSON.stringify(state.inventory));
  localStorage.setItem("hms_notifications", JSON.stringify(state.notifications));
  localStorage.setItem("hms_beds", JSON.stringify(state.beds));
}

// ==========================================
// 2. THEMING & NOTIFICATION LOGGING
// ==========================================

function toggleTheme() {
  state.theme = state.theme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", state.theme);
  updateThemeIcon();
  saveAppState();
  
  // Re-render chart since grid colors / text colors might change
  renderAdmissionsChart();
}

function updateThemeIcon() {
  const icon = document.getElementById("themeToggleIcon");
  if (state.theme === "dark") {
    icon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
  } else {
    icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
  }
}

function addSystemNotification(text, type = "info") {
  const newNotif = {
    id: "NTF" + Date.now(),
    text: text,
    type: type,
    time: "Just now"
  };
  state.notifications.unshift(newNotif);
  if (state.notifications.length > 8) {
    state.notifications.pop(); // Keep max 8 notifications in listing
  }
  saveAppState();
  renderSystemNotifications();
}

function clearSystemNotifications() {
  state.notifications = [];
  saveAppState();
  renderSystemNotifications();
}

function renderSystemNotifications() {
  const list = document.getElementById("systemNotificationsList");
  const badge = document.getElementById("alertNotificationBadge");
  list.innerHTML = "";
  
  if (state.notifications.length === 0) {
    list.innerHTML = `<li style="text-align: center; font-size: 13px; color: var(--text-muted); padding: 20px;">No alerts at this time.</li>`;
    badge.style.display = "none";
    return;
  }
  
  badge.style.display = "block";
  state.notifications.forEach(item => {
    let colorClass = "primary";
    if (item.type === "warning") colorClass = "warning";
    if (item.type === "success") colorClass = "success";
    if (item.type === "danger") colorClass = "danger";
    
    const li = document.createElement("li");
    li.className = "activity-item";
    li.innerHTML = `
      <div class="activity-marker ${colorClass}"></div>
      <div class="activity-info">
        <span class="activity-text">${item.text}</span>
        <span class="activity-time">${item.time}</span>
      </div>
    `;
    list.appendChild(li);
  });
}

function toggleAlertsList() {
  // Alert logs are displayed directly in the dashboard card, so we route the user to Dashboard
  const dashboardBtn = document.querySelectorAll(".menu-item")[0];
  switchView("dashboard", dashboardBtn);
}

// ==========================================
// 3. ROUTING & VIEW CONTROLLER
// ==========================================

function switchView(viewId, element) {
  // Hide all sections
  const sections = document.querySelectorAll(".view-section");
  sections.forEach(sec => sec.classList.remove("active-view"));
  
  // Show target section
  const targetSec = document.getElementById("view-" + viewId);
  if (targetSec) {
    targetSec.classList.add("active-view");
  }
  
  // Highlight active sidebar item
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach(item => item.classList.remove("active"));
  if (element) {
    element.classList.add("active");
  }
  
  // Trigger specific view renders to populate stats/tables
  if (viewId === "dashboard") {
    renderDashboard();
  } else if (viewId === "patients") {
    renderPatientsList();
  } else if (viewId === "appointments") {
    renderAppointmentsList();
  } else if (viewId === "doctors") {
    renderDoctorsList();
  } else if (viewId === "wards") {
    renderWardsLayout();
  } else if (viewId === "billing") {
    renderBillingList();
  } else if (viewId === "pharmacy") {
    renderPharmacyList();
  }
}

// Global search bar handler
function triggerGlobalSearch() {
  const query = document.getElementById("globalSearchInput").value.toLowerCase().trim();
  if (!query) return;
  
  // Route to the most appropriate section and apply localized filter
  if (query.startsWith("inv") || query.startsWith("bill") || !isNaN(query.replace("$", ""))) {
    switchView("billing", document.querySelectorAll(".menu-item")[5]);
    document.getElementById("billingTableBody").innerHTML = "";
    const filtered = state.invoices.filter(i => 
      i.id.toLowerCase().includes(query) || 
      i.patientName.toLowerCase().includes(query) || 
      i.desc.toLowerCase().includes(query)
    );
    renderInvoicesTable(filtered);
  } else if (query.includes("tablet") || query.includes("capsule") || query.includes("vial") || query.includes("medicine")) {
    switchView("pharmacy", document.querySelectorAll(".menu-item")[6]);
    // highlight matching drugs on page
  } else {
    // Default search in Patients
    switchView("patients", document.querySelectorAll(".menu-item")[1]);
    document.getElementById("patientSearchInput").value = query;
    renderPatientsList();
  }
}

// ==========================================
// 4. MODALS HELPER
// ==========================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    
    // Perform dynamic bindings on open
    if (modalId === "modalAppointment") {
      populateAppointmentSelectors();
    } else if (modalId === "modalBilling") {
      populateBillingSelectors();
    } else if (modalId === "modalPharmacyDispense") {
      populatePharmacySelectors();
    } else if (modalId === "modalPatient") {
      document.getElementById("patientForm").reset();
      document.getElementById("patientFormId").value = "";
      document.getElementById("patientModalTitle").innerText = "Admit Patient";
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
  }
}

// ==========================================
// 5. DASHBOARD SUB-ENGINE
// ==========================================

let admissionsChart = null;
function renderAdmissionsChart() {
  const ctx = document.getElementById("admissionsChart");
  if (!ctx) return;
  
  // Calculate admissions per weekday based on patient dates
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const admissionsCount = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat count
  
  state.patients.forEach(p => {
    if (p.dateAdmitted) {
      const dayIndex = new Date(p.dateAdmitted).getDay();
      if (!isNaN(dayIndex)) {
        admissionsCount[dayIndex]++;
      }
    }
  });

  // Shift to represent Mon-Sun
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dataset = [
    admissionsCount[1], // Mon
    admissionsCount[2], // Tue
    admissionsCount[3], // Wed
    admissionsCount[4], // Thu
    admissionsCount[5], // Fri
    admissionsCount[6], // Sat
    admissionsCount[0]  // Sun
  ];

  if (admissionsChart) {
    admissionsChart.destroy();
  }

  const isDark = state.theme === "dark";
  const gridColor = isDark ? "#2e3c51" : "#e2e8f0";
  const textColor = isDark ? "#cbd5e1" : "#475569";

  admissionsChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Patient Admissions",
        data: dataset,
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointBackgroundColor: "#4f46e5",
        pointBorderColor: isDark ? "#131c2e" : "#ffffff",
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { family: "Plus Jakarta Sans" } }
        },
        y: {
          grid: { color: gridColor },
          ticks: { 
            color: textColor, 
            stepSize: 1, 
            precision: 0,
            font: { family: "Plus Jakarta Sans" } 
          }
        }
      }
    }
  });
}

function renderDashboard() {
  // Update Welcome Title depending on time
  const hour = new Date().getHours();
  let greeting = "Good evening, Administrator";
  if (hour < 12) greeting = "Good morning, Administrator";
  else if (hour < 17) greeting = "Good afternoon, Administrator";
  document.getElementById("dashboard-welcome").innerText = greeting;

  // Stat Indicators
  // 1. Total Patients Admitted
  const activePatients = state.patients.filter(p => p.status !== "Discharged");
  document.getElementById("stat-total-patients").innerText = activePatients.length;
  
  // 2. Today's Appointments count
  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppts = state.appointments.filter(a => a.date === todayStr);
  document.getElementById("stat-appointments").innerText = todayAppts.length;
  
  // 3. Bed Occupancy Rate
  let occupiedBeds = 0;
  let totalBeds = 0;
  Object.keys(state.beds).forEach(ward => {
    state.beds[ward].forEach(bed => {
      totalBeds++;
      if (bed.status === "occupied") occupiedBeds++;
    });
  });
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  document.getElementById("stat-bed-occupancy").innerText = occupancyRate + "%";
  
  // 4. Pending Billing Invoice total
  const pendingTotal = state.invoices
    .filter(inv => inv.status === "Pending")
    .reduce((sum, inv) => sum + inv.amount, 0);
  document.getElementById("stat-revenue").innerText = "$" + pendingTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Render recent notification alerts
  renderSystemNotifications();
  
  // Render analytical admissions graph
  renderAdmissionsChart();

  // Populate Dashboard Table (Latest 4 admissions)
  const dashboardTable = document.getElementById("dashboardRecentAdmissions");
  dashboardTable.innerHTML = "";
  
  const sortedPatients = [...state.patients]
    .filter(p => p.status !== "Discharged")
    .sort((a,b) => new Date(b.dateAdmitted) - new Date(a.dateAdmitted))
    .slice(0, 4);
    
  if (sortedPatients.length === 0) {
    dashboardTable.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No active patients admitted.</td></tr>`;
    return;
  }
  
  sortedPatients.forEach(p => {
    let badgeClass = "info";
    if (p.status === "Critical") badgeClass = "danger";
    else if (p.status === "In Treatment") badgeClass = "success";
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 600;">${p.name}</td>
      <td>${p.age} y/o / ${p.gender}</td>
      <td>${p.condition}</td>
      <td>${p.dateAdmitted}</td>
      <td><span class="badge ${badgeClass}">${p.status}</span></td>
    `;
    dashboardTable.appendChild(tr);
  });
}

// ==========================================
// 6. PATIENT REGISTRY ENGINE
// ==========================================

function renderPatientsList() {
  const searchVal = document.getElementById("patientSearchInput").value.toLowerCase().trim();
  const sortBy = document.getElementById("patientSortSelect").value;
  const tbody = document.getElementById("patientsTableBody");
  tbody.innerHTML = "";
  
  let list = [...state.patients];
  
  // Filter search
  if (searchVal) {
    list = list.filter(p => 
      p.name.toLowerCase().includes(searchVal) ||
      p.id.toLowerCase().includes(searchVal) ||
      p.condition.toLowerCase().includes(searchVal)
    );
  }
  
  // Sort listings
  if (sortBy === "name") {
    list.sort((a,b) => a.name.localeCompare(b.name));
  } else if (sortBy === "age") {
    list.sort((a,b) => b.age - a.age);
  } else {
    // default recent date
    list.sort((a,b) => new Date(b.dateAdmitted) - new Date(a.dateAdmitted));
  }
  
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">No patients match search.</td></tr>`;
    return;
  }
  
  list.forEach(p => {
    let statusClass = "info";
    if (p.status === "Critical") statusClass = "danger";
    else if (p.status === "In Treatment") statusClass = "success";
    else if (p.status === "Discharged") statusClass = "warning";
    
    const wardBedStr = p.ward !== "none" ? `${p.ward} - Bed ${p.bedIndex + 1}` : `<span style="color: var(--text-muted)">Outpatient</span>`;
    const vitalsStr = (p.pulse && p.bp) ? `${p.pulse} bpm / ${p.bp}` : `<span style="color: var(--text-muted)">Not logged</span>`;
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 700; color: var(--primary);">${p.id}</td>
      <td style="font-weight: 600;">${p.name}</td>
      <td>${p.age} yrs / ${p.gender}</td>
      <td>${p.phone}</td>
      <td>${wardBedStr}</td>
      <td>${vitalsStr}</td>
      <td><span class="badge ${statusClass}">${p.status}</span></td>
      <td style="text-align: right;">
        <button class="btn btn-secondary" onclick="editPatient('${p.id}')" style="padding: 4px 8px; font-size: 11px;">Edit</button>
        <button class="btn btn-danger" onclick="dischargePatient('${p.id}')" style="padding: 4px 8px; font-size: 11px;" ${p.status === 'Discharged' ? 'disabled' : ''}>Discharge</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function savePatient(e) {
  e.preventDefault();
  const idField = document.getElementById("patientFormId").value;
  const name = document.getElementById("pName").value.trim();
  const age = parseInt(document.getElementById("pAge").value);
  const gender = document.getElementById("pGender").value;
  const phone = document.getElementById("pPhone").value.trim();
  const status = document.getElementById("pStatus").value;
  const condition = document.getElementById("pCondition").value.trim();
  const pulse = parseInt(document.getElementById("pPulse").value) || null;
  const bp = document.getElementById("pBP").value.trim() || null;
  const ward = document.getElementById("pWard").value;
  
  let patient;
  
  if (idField) {
    // Edit existing patient
    patient = state.patients.find(p => p.id === idField);
    const oldWard = patient.ward;
    const oldBedIndex = patient.bedIndex;
    
    patient.name = name;
    patient.age = age;
    patient.gender = gender;
    patient.phone = phone;
    patient.status = status;
    patient.condition = condition;
    patient.pulse = pulse;
    patient.bp = bp;
    
    // Check if ward allocation changed
    if (oldWard !== ward) {
      // release old bed allocation
      if (oldWard !== "none" && oldBedIndex !== null) {
        state.beds[oldWard][oldBedIndex] = { index: oldBedIndex, status: "vacant", patientId: null, patientName: null };
      }
      
      // allocate new bed if available
      if (ward !== "none") {
        const availableBedIdx = state.beds[ward].findIndex(b => b.status === "vacant");
        if (availableBedIdx !== -1) {
          patient.ward = ward;
          patient.bedIndex = availableBedIdx;
          state.beds[ward][availableBedIdx] = { index: availableBedIdx, status: "occupied", patientId: patient.id, patientName: name };
          addSystemNotification(`Bed ${ward}-${availableBedIdx + 1} assigned to patient ${name}`, "info");
        } else {
          // No bed available
          patient.ward = "none";
          patient.bedIndex = null;
          alert(`Selected Ward room: ${ward} is fully occupied! Patient set to outpatient.`);
        }
      } else {
        patient.ward = "none";
        patient.bedIndex = null;
      }
    }
    
    addSystemNotification(`Updated records for patient ${name}`, "success");
  } else {
    // Admit brand new patient
    const newId = "PAT" + (100 + state.patients.length + 1);
    const today = new Date().toISOString().split("T")[0];
    
    patient = {
      id: newId,
      name, age, gender, phone, status, condition, pulse, bp,
      ward: "none",
      bedIndex: null,
      dateAdmitted: today
    };
    
    if (ward !== "none") {
      const availableBedIdx = state.beds[ward].findIndex(b => b.status === "vacant");
      if (availableBedIdx !== -1) {
        patient.ward = ward;
        patient.bedIndex = availableBedIdx;
        state.beds[ward][availableBedIdx] = { index: availableBedIdx, status: "occupied", patientId: newId, patientName: name };
        addSystemNotification(`Patient ${name} admitted. Bed ${ward}-${availableBedIdx + 1} allocated.`, "success");
      } else {
        alert(`No beds available in ${ward} ward room. Patient created as Outpatient.`);
      }
    } else {
      addSystemNotification(`Patient ${name} admitted as Outpatient.`, "success");
    }
    
    state.patients.push(patient);
  }
  
  saveAppState();
  closeModal("modalPatient");
  renderPatientsList();
}

function editPatient(patientId) {
  const patient = state.patients.find(p => p.id === patientId);
  if (!patient) return;
  
  document.getElementById("patientFormId").value = patient.id;
  document.getElementById("pName").value = patient.name;
  document.getElementById("pAge").value = patient.age;
  document.getElementById("pGender").value = patient.gender;
  document.getElementById("pPhone").value = patient.phone;
  document.getElementById("pStatus").value = patient.status;
  document.getElementById("pCondition").value = patient.condition;
  document.getElementById("pPulse").value = patient.pulse || "";
  document.getElementById("pBP").value = patient.bp || "";
  document.getElementById("pWard").value = patient.ward;
  
  document.getElementById("patientModalTitle").innerText = "Edit Patient Records";
  openModal("modalPatient");
}

function dischargePatient(patientId) {
  const patient = state.patients.find(p => p.id === patientId);
  if (!patient) return;
  
  if (confirm(`Discharge patient ${patient.name}? This will free their assigned bed and update status to Discharged.`)) {
    patient.status = "Discharged";
    
    // Free bed
    if (patient.ward !== "none" && patient.bedIndex !== null) {
      const w = patient.ward;
      const bIdx = patient.bedIndex;
      state.beds[w][bIdx] = { index: bIdx, status: "vacant", patientId: null, patientName: null };
      
      patient.ward = "none";
      patient.bedIndex = null;
    }
    
    addSystemNotification(`Patient ${patient.name} discharged successfully`, "warning");
    saveAppState();
    renderPatientsList();
  }
}

// ==========================================
// 7. APPOINTMENT SCHEDULER ENGINE
// ==========================================

function populateAppointmentSelectors() {
  // Populate Patients dropdown
  const patSelect = document.getElementById("aPatient");
  patSelect.innerHTML = "";
  state.patients.forEach(p => {
    if (p.status !== "Discharged") {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.innerText = `${p.name} (${p.id})`;
      patSelect.appendChild(opt);
    }
  });
  
  // Populate Doctors dropdown
  const docSelect = document.getElementById("aDoctor");
  docSelect.innerHTML = "";
  state.doctors.forEach(d => {
    if (d.status === "Active") {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.innerText = `${d.name} - ${d.dept} (${d.shift} shift)`;
      docSelect.appendChild(opt);
    }
  });
}

function renderAppointmentsList() {
  const docFilter = document.getElementById("appointmentDoctorFilter").value;
  const dateFilter = document.getElementById("appointmentDateFilter").value;
  const tbody = document.getElementById("appointmentsTableBody");
  tbody.innerHTML = "";
  
  // Also sync the Doctor dropdown filter
  const filterSelect = document.getElementById("appointmentDoctorFilter");
  if (filterSelect.options.length <= 1) {
    state.doctors.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.innerText = d.name;
      filterSelect.appendChild(opt);
    });
  }
  
  let list = [...state.appointments];
  
  if (docFilter !== "all") {
    list = list.filter(a => a.doctorId === docFilter);
  }
  if (dateFilter) {
    list = list.filter(a => a.date === dateFilter);
  }
  
  // Sort chronologically
  list.sort((a,b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">No appointments found.</td></tr>`;
    return;
  }
  
  list.forEach(a => {
    let badgeClass = "info";
    if (a.status === "Completed") badgeClass = "success";
    else if (a.status === "Cancelled") badgeClass = "danger";
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 700; color: var(--primary);">${a.id}</td>
      <td style="font-weight: 600;">${a.patientName}</td>
      <td>${a.doctorName}</td>
      <td><span class="badge info">${a.dept}</span></td>
      <td><strong>${a.date}</strong> at ${a.time}</td>
      <td>${a.reason}</td>
      <td><span class="badge ${badgeClass}">${a.status}</span></td>
      <td style="text-align: right;">
        <button class="btn btn-secondary" onclick="markAppointmentDone('${a.id}')" style="padding: 4px 8px; font-size: 11px;" ${a.status !== 'Scheduled' ? 'disabled' : ''}>Done</button>
        <button class="btn btn-danger" onclick="cancelAppointment('${a.id}')" style="padding: 4px 8px; font-size: 11px;" ${a.status !== 'Scheduled' ? 'disabled' : ''}>Cancel</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function saveAppointment(e) {
  e.preventDefault();
  const patientId = document.getElementById("aPatient").value;
  const doctorId = document.getElementById("aDoctor").value;
  const date = document.getElementById("aDate").value;
  const time = document.getElementById("aTime").value;
  const reason = document.getElementById("aReason").value.trim();
  
  const patient = state.patients.find(p => p.id === patientId);
  const doctor = state.doctors.find(d => d.id === doctorId);
  
  // Conflict verification check (Double booking check)
  const conflict = state.appointments.find(a => 
    a.doctorId === doctorId && 
    a.date === date && 
    a.time === time &&
    a.status === "Scheduled"
  );
  
  if (conflict) {
    alert(`Conflict Alert: ${doctor.name} is already booked at ${time} on ${date}. Please choose another time.`);
    return;
  }
  
  const newId = "APT" + (200 + state.appointments.length + 1);
  const newAppt = {
    id: newId,
    patientId,
    patientName: patient.name,
    doctorId,
    doctorName: doctor.name,
    dept: doctor.dept,
    date,
    time,
    reason,
    status: "Scheduled"
  };
  
  state.appointments.push(newAppt);
  
  // Increment doctor's load
  doctor.load = (doctor.load || 0) + 1;
  
  addSystemNotification(`Appointment ${newId} booked for ${patient.name} with ${doctor.name}`, "success");
  saveAppState();
  closeModal("modalAppointment");
  renderAppointmentsList();
}

function markAppointmentDone(apptId) {
  const appt = state.appointments.find(a => a.id === apptId);
  if (!appt) return;
  
  appt.status = "Completed";
  
  // Decrement doctor's active patient load
  const doctor = state.doctors.find(d => d.id === appt.doctorId);
  if (doctor && doctor.load > 0) {
    doctor.load--;
  }
  
  addSystemNotification(`Appointment ${appt.id} completed.`, "success");
  saveAppState();
  renderAppointmentsList();
}

function cancelAppointment(apptId) {
  const appt = state.appointments.find(a => a.id === apptId);
  if (!appt) return;
  
  appt.status = "Cancelled";
  
  // Decrement doctor's active patient load
  const doctor = state.doctors.find(d => d.id === appt.doctorId);
  if (doctor && doctor.load > 0) {
    doctor.load--;
  }
  
  addSystemNotification(`Appointment ${appt.id} was cancelled.`, "danger");
  saveAppState();
  renderAppointmentsList();
}

function resetAppointmentFilters() {
  document.getElementById("appointmentDoctorFilter").value = "all";
  document.getElementById("appointmentDateFilter").value = "";
  renderAppointmentsList();
}

// ==========================================
// 8. DOCTORS DIRECTORY SUB-ENGINE
// ==========================================

function renderDoctorsList() {
  const grid = document.getElementById("doctorsCardsGrid");
  grid.innerHTML = "";
  
  state.doctors.forEach(d => {
    const isLeave = d.status === "On-Leave";
    const badgeClass = isLeave ? "danger" : "success";
    
    const card = document.createElement("div");
    card.className = "card";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "16px";
    
    card.innerHTML = `
      <div style="display: flex; align-items: center; gap: 16px;">
        <div class="avatar" style="background: linear-gradient(135deg, #818cf8, #4f46e5); color: white;">${d.avatar}</div>
        <div>
          <h3 style="font-size: 16px; font-weight: 700;">${d.name}</h3>
          <span style="font-size: 12px; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">${d.dept}</span>
        </div>
      </div>
      
      <div style="border-top: 1px solid var(--border-color); padding-top: 12px; display: flex; flex-direction: column; gap: 6px; font-size: 13px;">
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-secondary)">Shift Time:</span>
          <strong>${d.shift} Shift</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-secondary)">Active Load:</span>
          <strong>${d.load} patients</strong>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
          <span style="color: var(--text-secondary)">Duty Status:</span>
          <span class="badge ${badgeClass}">${d.status}</span>
        </div>
      </div>
      
      <button class="btn btn-secondary" onclick="toggleDoctorStatus('${d.id}')" style="width: 100%; font-size: 12px; padding: 6px;">
        Toggle Leave Status
      </button>
    `;
    grid.appendChild(card);
  });
}

function toggleDoctorStatus(docId) {
  const doc = state.doctors.find(d => d.id === docId);
  if (!doc) return;
  
  doc.status = doc.status === "Active" ? "On-Leave" : "Active";
  addSystemNotification(`${doc.name} status updated to ${doc.status}`, "info");
  saveAppState();
  renderDoctorsList();
}

// ==========================================
// 9. WARD & BEDS MODULE SUB-ENGINE
// ==========================================

function renderWardsLayout() {
  const container = document.getElementById("wardInteractiveContainers");
  container.innerHTML = "";
  
  Object.keys(state.beds).forEach(ward => {
    const card = document.createElement("div");
    card.className = "card ward-card";
    
    // Header details
    const bedList = state.beds[ward];
    const occupiedCount = bedList.filter(b => b.status === "occupied").length;
    
    let header = document.createElement("div");
    header.className = "ward-header";
    header.innerHTML = `
      <h3>${ward} Room</h3>
      <span style="font-size: 12px; font-weight: 700; color: var(--text-secondary);">${occupiedCount}/5 Beds Occupied</span>
    `;
    card.appendChild(header);
    
    // Beds grid
    let grid = document.createElement("div");
    grid.className = "ward-beds";
    
    bedList.forEach((bed, index) => {
      let box = document.createElement("div");
      box.className = `bed-box ${bed.status}`;
      
      // Bed SVG
      box.innerHTML = `
        <svg viewBox="0 0 24 24"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v8M2 12h20M2 18v2h20v-2"></path></svg>
        <span>B-${index + 1}</span>
      `;
      
      // Tooltip
      let tooltip = document.createElement("span");
      tooltip.className = "tooltip";
      if (bed.status === "occupied") {
        tooltip.innerText = `Occupied: ${bed.patientName}`;
      } else if (bed.status === "maintenance") {
        tooltip.innerText = `Out of service`;
      } else {
        tooltip.innerText = `Available`;
      }
      box.appendChild(tooltip);
      
      // Click handler
      box.onclick = () => openBedDetails(ward, index);
      grid.appendChild(box);
    });
    
    card.appendChild(grid);
    container.appendChild(card);
  });
}

function openBedDetails(ward, bedIndex) {
  const bed = state.beds[ward][bedIndex];
  
  document.getElementById("bedActionWardId").value = ward;
  document.getElementById("bedActionIndex").value = bedIndex;
  
  document.getElementById("bedActionDetailsTitle").innerText = `${ward} Ward - Bed #${bedIndex + 1}`;
  
  let desc = `Status: ${bed.status.toUpperCase()}`;
  if (bed.status === "occupied") {
    desc += ` (Patient: ${bed.patientName})`;
  }
  document.getElementById("bedActionDetailsStatus").innerText = desc;
  document.getElementById("bedStatusDropdown").value = bed.status;
  
  // Populate patient select dropdown
  const patSelect = document.getElementById("bedPatientSelect");
  patSelect.innerHTML = "";
  
  // Only show patients not currently allocated to beds
  const unassigned = state.patients.filter(p => p.status !== "Discharged" && p.ward === "none");
  
  if (unassigned.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.innerText = "No unallocated active patients";
    patSelect.appendChild(opt);
  } else {
    unassigned.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.innerText = `${p.name} (${p.id})`;
      patSelect.appendChild(opt);
    });
  }
  
  toggleBedAssignDropdown();
  openModal("modalBedAction");
}

function toggleBedAssignDropdown() {
  const mode = document.getElementById("bedStatusDropdown").value;
  const group = document.getElementById("bedPatientAssignGroup");
  if (mode === "occupied") {
    group.style.display = "block";
  } else {
    group.style.display = "none";
  }
}

function saveBedAction() {
  const ward = document.getElementById("bedActionWardId").value;
  const index = parseInt(document.getElementById("bedActionIndex").value);
  const status = document.getElementById("bedStatusDropdown").value;
  
  const bed = state.beds[ward][index];
  const oldStatus = bed.status;
  const oldPatientId = bed.patientId;
  
  // If bed was occupied, release that patient first
  if (oldStatus === "occupied" && oldPatientId) {
    const oldPat = state.patients.find(p => p.id === oldPatientId);
    if (oldPat) {
      oldPat.ward = "none";
      oldPat.bedIndex = null;
    }
  }
  
  if (status === "occupied") {
    const patId = document.getElementById("bedPatientSelect").value;
    if (!patId) {
      alert("Please select a patient to allocate to this bed.");
      return;
    }
    const patient = state.patients.find(p => p.id === patId);
    if (patient) {
      bed.status = "occupied";
      bed.patientId = patId;
      bed.patientName = patient.name;
      
      patient.ward = ward;
      patient.bedIndex = index;
      
      addSystemNotification(`Bed ${ward}-${index + 1} assigned to ${patient.name}`, "info");
    }
  } else if (status === "maintenance") {
    bed.status = "maintenance";
    bed.patientId = null;
    bed.patientName = null;
    addSystemNotification(`Bed ${ward}-${index + 1} placed in maintenance mode`, "warning");
  } else {
    // vacant
    bed.status = "vacant";
    bed.patientId = null;
    bed.patientName = null;
    addSystemNotification(`Bed ${ward}-${index + 1} is now vacant`, "success");
  }
  
  saveAppState();
  closeModal("modalBedAction");
  renderWardsLayout();
}

// ==========================================
// 10. BILLING & INVOICING SUB-ENGINE
// ==========================================

function populateBillingSelectors() {
  const select = document.getElementById("bPatient");
  select.innerHTML = "";
  
  state.patients.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.innerText = `${p.name} (${p.id})`;
    select.appendChild(opt);
  });
}

function renderBillingList() {
  // Paid and unpaid calculators
  const paidTotal = state.invoices
    .filter(inv => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  
  const pendingTotal = state.invoices
    .filter(inv => inv.status === "Pending")
    .reduce((sum, inv) => sum + inv.amount, 0);
    
  document.getElementById("billing-paid-total").innerText = "$" + paidTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById("billing-pending-total").innerText = "$" + pendingTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  renderInvoicesTable(state.invoices);
}

function renderInvoicesTable(list) {
  const tbody = document.getElementById("billingTableBody");
  tbody.innerHTML = "";
  
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No billing invoices found.</td></tr>`;
    return;
  }
  
  list.forEach(i => {
    let badgeClass = "warning";
    if (i.status === "Paid") badgeClass = "success";
    else if (i.status === "Insured") badgeClass = "info";
    
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 700; color: var(--primary);">${i.id}</td>
      <td style="font-weight: 600;">${i.patientName}</td>
      <td>${i.desc}</td>
      <td>${i.date}</td>
      <td style="font-weight: 600;">$${i.amount.toFixed(2)}</td>
      <td><span class="badge ${badgeClass}">${i.status}</span></td>
      <td style="text-align: right;">
        <button class="btn btn-secondary" onclick="viewReceipt('${i.id}')" style="padding: 4px 8px; font-size: 11px;">Receipt</button>
        <button class="btn btn-primary" onclick="markPaid('${i.id}')" style="padding: 4px 8px; font-size: 11px;" ${i.status === 'Paid' ? 'disabled' : ''}>Pay</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function saveInvoice(e) {
  e.preventDefault();
  const patientId = document.getElementById("bPatient").value;
  const desc = document.getElementById("bDesc").value.trim();
  const amount = parseFloat(document.getElementById("bAmount").value);
  const status = document.getElementById("bStatus").value;
  
  const patient = state.patients.find(p => p.id === patientId);
  const newId = "INV" + (700 + state.invoices.length + 1);
  const today = new Date().toISOString().split("T")[0];
  
  const newInvoice = {
    id: newId,
    patientId,
    patientName: patient.name,
    desc,
    amount,
    date: today,
    status
  };
  
  state.invoices.push(newInvoice);
  
  addSystemNotification(`Invoice ${newId} ($${amount}) generated for ${patient.name}`, "success");
  saveAppState();
  closeModal("modalBilling");
  renderBillingList();
}

function markPaid(invId) {
  const inv = state.invoices.find(i => i.id === invId);
  if (!inv) return;
  
  inv.status = "Paid";
  addSystemNotification(`Invoice ${inv.id} marked as Paid`, "success");
  saveAppState();
  renderBillingList();
}

function viewReceipt(invId) {
  const inv = state.invoices.find(i => i.id === invId);
  if (!inv) return;
  
  const receiptHTML = `
    <div class="invoice-print-container">
      <div class="invoice-print-header">
        <h4>MEDOS CLINIC CENTER</h4>
        <div style="font-size: 10px;">100 Health Science Blvd, Metropolis</div>
        <div style="font-size: 10px;">Tel: +1 (555) MED-HELP</div>
      </div>
      <div class="invoice-print-details">
        <div>
          <div><strong>Receipt ID:</strong> ${inv.id}</div>
          <div><strong>Date:</strong> ${inv.date}</div>
        </div>
        <div style="text-align: right;">
          <div><strong>Patient:</strong> ${inv.patientName}</div>
          <div><strong>ID:</strong> ${inv.patientId}</div>
        </div>
      </div>
      <table class="invoice-print-items">
        <thead>
          <tr style="border-bottom: 1px dashed #000;">
            <th style="text-align: left;">Treatment/Service</th>
            <th style="text-align: right;">Total Charge</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${inv.desc}</td>
            <td style="text-align: right;">$${inv.amount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <div class="invoice-print-total">
        TOTAL PAID (${inv.status.toUpperCase()}): $${inv.amount.toFixed(2)}
      </div>
      <div style="margin-top: 16px; text-align: center; font-size: 9px; color: var(--text-muted);">
        Thank you for choosing MedOS Health Service.<br>Get Well Soon!
      </div>
    </div>
  `;
  
  document.getElementById("receiptContainer").innerHTML = receiptHTML;
  openModal("modalReceipt");
}

function printReceiptContent() {
  const content = document.getElementById("receiptContainer").innerHTML;
  // Standard simple print simulation window
  const printWin = window.open("", "", "width=500,height=600");
  printWin.document.write("<html><head><title>Print Receipt</title>");
  printWin.document.write("<style>body{font-family: monospace; padding: 20px;} .invoice-print-container{border:1px dashed #000; padding:15px;} .invoice-print-header{text-align:center;} .invoice-print-details{display:flex; justify-content:space-between; margin-bottom:10px;} .invoice-print-items{width:100%; border-collapse:collapse; margin:10px 0;} .invoice-print-total{text-align:right; font-weight:bold;}</style>");
  printWin.document.write("</head><body>");
  printWin.document.write(content);
  printWin.document.write("</body></html>");
  printWin.document.close();
  printWin.focus();
  printWin.print();
  printWin.close();
}

// ==========================================
// 11. PHARMACY INVENTORY SUB-ENGINE
// ==========================================

function populatePharmacySelectors() {
  // Populate medicine options
  const medSelect = document.getElementById("dDrug");
  medSelect.innerHTML = "";
  state.inventory.forEach(med => {
    if (med.stock > 0) {
      const opt = document.createElement("option");
      opt.value = med.id;
      opt.innerText = `${med.name} - Stock: ${med.stock} (${med.type})`;
      medSelect.appendChild(opt);
    }
  });
  
  // Populate Patient select options
  const patSelect = document.getElementById("dPatient");
  patSelect.innerHTML = "";
  state.patients.forEach(p => {
    if (p.status !== "Discharged") {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.innerText = `${p.name} (${p.id})`;
      patSelect.appendChild(opt);
    }
  });
}

function renderPharmacyList() {
  const grid = document.getElementById("pharmacyInventoryCards");
  grid.innerHTML = "";
  
  state.inventory.forEach(med => {
    const isLow = med.stock <= med.minStock;
    const stockClass = isLow ? "low-stock" : "";
    const badgeText = isLow ? "Low Stock Alert" : "Available";
    const badgeClass = isLow ? "danger" : "success";
    
    const card = document.createElement("div");
    card.className = "card pharmacy-card";
    card.innerHTML = `
      <div class="pharmacy-card-header">
        <div>
          <span class="drug-name">${med.name}</span>
          <div class="drug-type">${med.type}</div>
        </div>
        <span class="badge ${badgeClass}">${badgeText}</span>
      </div>
      
      <div class="drug-stock-info">
        <div>
          <div class="stock-count ${stockClass}">${med.stock}</div>
          <span style="font-size: 11px; color: var(--text-muted)">Units Remaining</span>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 700; font-size: 15px;">$${med.price.toFixed(2)}</div>
          <span style="font-size: 11px; color: var(--text-muted)">Unit Cost</span>
        </div>
      </div>
      
      <div style="display: flex; gap: 8px; margin-top: 10px;">
        <button class="btn btn-secondary" onclick="restockMedicine('${med.id}')" style="flex-grow: 1; padding: 6px; font-size: 11px;">Restock (+50)</button>
        <button class="btn btn-primary" onclick="triggerDispenseFor('${med.id}')" style="padding: 6px; font-size: 11px;">Dispense</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function restockMedicine(medId) {
  const med = state.inventory.find(m => m.id === medId);
  if (!med) return;
  
  med.stock += 50;
  addSystemNotification(`Restocked 50 units of ${med.name}`, "success");
  saveAppState();
  renderPharmacyList();
}

function triggerDispenseFor(medId) {
  openModal("modalPharmacyDispense");
  document.getElementById("dDrug").value = medId;
}

function saveDispense(e) {
  e.preventDefault();
  const medId = document.getElementById("dDrug").value;
  const patId = document.getElementById("dPatient").value;
  const qty = parseInt(document.getElementById("dQty").value);
  const instructions = document.getElementById("dInstructions").value.trim();
  
  const med = state.inventory.find(m => m.id === medId);
  const patient = state.patients.find(p => p.id === patId);
  
  if (qty > med.stock) {
    alert(`Insufficient Stock! Only ${med.stock} units of ${med.name} are available.`);
    return;
  }
  
  // Deduct stock
  med.stock -= qty;
  
  addSystemNotification(`Dispensed ${qty} units of ${med.name} to patient ${patient.name}`, "info");
  
  // Check if now low stock
  if (med.stock <= med.minStock) {
    addSystemNotification(`Critical Stock Alert: ${med.name} has dropped below min levels (${med.stock} left)!`, "warning");
  }
  
  // Log a billing invoice charge automatically for this drug!
  const chargeAmount = med.price * qty;
  const newInvoiceId = "INV" + (700 + state.invoices.length + 1);
  const today = new Date().toISOString().split("T")[0];
  
  const drugInvoice = {
    id: newInvoiceId,
    patientId: patId,
    patientName: patient.name,
    desc: `Pharmacy Charge: ${med.name} x${qty} (${instructions})`,
    amount: chargeAmount,
    date: today,
    status: "Pending"
  };
  state.invoices.push(drugInvoice);
  addSystemNotification(`Auto-logged pharmacy charge: invoice ${newInvoiceId} created`, "info");
  
  saveAppState();
  closeModal("modalPharmacyDispense");
  renderPharmacyList();
}

// ==========================================
// 12. INITIALIZATION ON PAGE LOAD
// ==========================================

window.addEventListener("DOMContentLoaded", () => {
  loadAppState();
  renderDashboard();
});