/**
 * Patient Health Record Management System (PHRMS)
 * Ultra-fast, lightweight vanilla JavaScript application
 */

// Initial Seed Data for the Interactive Clinic Demo
const INITIAL_PATIENTS = [
  {
    id: "P-101",
    name: "Eleanor Vance",
    age: 38,
    gender: "Female",
    contact: "+1 (555) 234-5678",
    allergies: "Penicillin",
    diagnosis: "Type 2 Diabetes & Mild Hypertension",
    lastVisit: "2026-11-10",
    nextAppt: "2026-12-05",
    medication: "Metformin 500mg (8:00 AM & 8:00 PM)",
    medTime: "08:00 AM & 08:00 PM",
    notes: "A1C stable at 6.4%. Blood pressure 126/82 mmHg. Advised 30 min daily walking and scheduled standard panel check in 3 weeks."
  },
  {
    id: "P-102",
    name: "Rahul Sharma",
    age: 45,
    gender: "Male",
    contact: "+91 98765 43210",
    allergies: "Sulfa Drugs",
    diagnosis: "Seasonal Bronchitis",
    lastVisit: "2026-11-14",
    nextAppt: "2026-11-28",
    medication: "Salbutamol Inhaler (10:00 AM & 6:00 PM)",
    medTime: "10:00 AM & 06:00 PM",
    notes: "Persistent dry cough improving with bronchodilator. Lungs clear upon auscultation. Advised warm hydration."
  },
  {
    id: "P-103",
    name: "Maria Santos",
    age: 29,
    gender: "Female",
    contact: "+1 (555) 876-5432",
    allergies: "None reported",
    diagnosis: "Acute Migraine with Aura",
    lastVisit: "2026-11-16",
    nextAppt: "2026-12-14",
    medication: "Sumatriptan 50mg (As needed at onset)",
    medTime: "At symptom onset",
    notes: "Episodes triggered by screen glare. Discussed sleep hygiene and migraine diary tracking."
  },
  {
    id: "P-104",
    name: "David Kim",
    age: 62,
    gender: "Male",
    contact: "+1 (555) 432-1098",
    allergies: "Aspirin, Ibuprofen",
    diagnosis: "Osteoarthritis (Right Knee)",
    lastVisit: "2026-11-08",
    nextAppt: "2026-11-22",
    medication: "Acetaminophen 650mg (09:00 AM)",
    medTime: "09:00 AM",
    notes: "Mild joint effusion. Referred for low-impact physical therapy. Prescribed joint mobility exercises."
  },
  {
    id: "P-105",
    name: "Fatima Al-Hassan",
    age: 52,
    gender: "Female",
    contact: "+1 (555) 678-9012",
    allergies: "Latex",
    diagnosis: "Primary Hypothyroidism",
    lastVisit: "2026-11-12",
    nextAppt: "2026-12-20",
    medication: "Levothyroxine 75mcg (07:00 AM Empty stomach)",
    medTime: "07:00 AM",
    notes: "Energy levels improving steadily. Free T4 within normal reference limits. Continue present dosage."
  }
];

// App State
let patients = [];
let currentFilter = "all";
let currentSearch = "";
let currentActivePatient = null;
let currentSlideIndex = 1;
const TOTAL_SLIDES = 9;

// DOM Elements
const patientTableBody = document.getElementById("patientTableBody");
const patientSearchInput = document.getElementById("patientSearchInput");
const searchClearBtn = document.getElementById("searchClearBtn");
const noResultsMsg = document.getElementById("noResultsMsg");
const filterPills = document.querySelectorAll(".filter-pill");
const demoTabBtns = document.querySelectorAll(".demo-tab-btn");
const demoTabContents = document.querySelectorAll(".demo-tab-content");
const newPatientForm = document.getElementById("newPatientForm");
const reminderListContainer = document.getElementById("reminderListContainer");
const resetDemoBtn = document.getElementById("resetDemoBtn");

// Modal Elements
const patientModal = document.getElementById("patientModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalDismissBtn = document.getElementById("modalDismissBtn");
const modalUpdateBtn = document.getElementById("modalUpdateBtn");
const modalPatientId = document.getElementById("modalPatientId");
const modalPatientName = document.getElementById("modalPatientName");
const modalBodyContent = document.getElementById("modalBodyContent");

// Presentation Modal Elements
const presentationModeBtn = document.getElementById("presentationModeBtn");
const slideViewerModal = document.getElementById("slideViewerModal");
const presCloseBtn = document.getElementById("presCloseBtn");
const prevSlideBtn = document.getElementById("prevSlideBtn");
const nextSlideBtn = document.getElementById("nextSlideBtn");
const slideIndicator = document.getElementById("slideIndicator");
const slideDotsContainer = document.getElementById("slideDots");
const slideItems = document.querySelectorAll(".slide-item");

// Feedback Modal Elements
const feedbackModal = document.getElementById("feedbackModal");
const feedbackCloseBtn = document.getElementById("feedbackCloseBtn");
const feedbackCancelBtn = document.getElementById("feedbackCancelBtn");
const feedbackForm = document.getElementById("feedbackForm");
const openFeedbackFooterLink = document.getElementById("openFeedbackFooterLink");

// Theme and Navigation Elements
const themeToggleBtn = document.getElementById("themeToggleBtn");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");
const toastContainer = document.getElementById("toastContainer");

/* ==========================================================================
   Initialization
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initPatientsData();
  renderPatientTable();
  renderMedicineReminders();
  setupEventListeners();
  initSlideDots();
});

/* ==========================================================================
   Theme Management
   ========================================================================== */

function initTheme() {
  const savedTheme = localStorage.getItem("phrms_theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("phrms_theme", next);
  showToast(`Switched to ${next} mode`);
}

/* ==========================================================================
   Patient Data Management (LocalStorage + Memory)
   ========================================================================== */

function initPatientsData() {
  const saved = localStorage.getItem("phrms_patients");
  if (saved) {
    try {
      patients = JSON.parse(saved);
    } catch (e) {
      patients = [...INITIAL_PATIENTS];
    }
  } else {
    patients = [...INITIAL_PATIENTS];
  }
}

function savePatientsData() {
  localStorage.setItem("phrms_patients", JSON.stringify(patients));
}

function resetPatientsData() {
  patients = [...INITIAL_PATIENTS];
  savePatientsData();
  renderPatientTable();
  renderMedicineReminders();
  showToast("Demo data reset to default clinic records");
}

/* ==========================================================================
   Table & Search Rendering
   ========================================================================== */

function getFilteredPatients() {
  return patients.filter(p => {
    // Search query match
    const q = currentSearch.trim().toLowerCase();
    const matchesSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.diagnosis.toLowerCase().includes(q) ||
      p.allergies.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    // Category filter
    if (currentFilter === "allergies") {
      return p.allergies && p.allergies.toLowerCase() !== "none" && p.allergies.toLowerCase() !== "none reported";
    } else if (currentFilter === "recent") {
      // Just filter last 3
      return true;
    }

    return true;
  });
}

function renderPatientTable() {
  const filtered = getFilteredPatients();
  patientTableBody.innerHTML = "";

  if (filtered.length === 0) {
    noResultsMsg.classList.remove("hidden");
  } else {
    noResultsMsg.classList.add("hidden");
    filtered.forEach(p => {
      const tr = document.createElement("tr");

      const hasAllergy = p.allergies && p.allergies.toLowerCase() !== "none" && p.allergies.toLowerCase() !== "none reported";

      tr.innerHTML = `
        <td><span class="table-id-badge">${escapeHtml(p.id)}</span></td>
        <td><strong>${escapeHtml(p.name)}</strong></td>
        <td>${p.age} yrs / ${escapeHtml(p.gender)}</td>
        <td>${escapeHtml(p.lastVisit)}</td>
        <td>
          <span class="table-diag-badge ${hasAllergy ? 'table-alert-badge' : ''}" title="${hasAllergy ? 'Allergies: ' + escapeHtml(p.allergies) : 'No known allergies'}">
            ${escapeHtml(p.diagnosis)}
          </span>
        </td>
        <td><strong>${escapeHtml(p.nextAppt)}</strong></td>
        <td>
          <button class="btn btn-outline btn-xs view-patient-btn" data-id="${p.id}">
            View Details
          </button>
        </td>
      `;
      patientTableBody.appendChild(tr);
    });

    // Attach listeners to newly rendered buttons
    document.querySelectorAll(".view-patient-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        openPatientModal(id);
      });
    });
  }
}

function renderMedicineReminders() {
  reminderListContainer.innerHTML = "";
  patients.forEach((p, idx) => {
    if (!p.medication) return;

    const card = document.createElement("div");
    card.className = "reminder-card";
    card.innerHTML = `
      <div class="reminder-pill-icon">💊</div>
      <div class="reminder-info">
        <h4>${escapeHtml(p.name)} <span class="table-id-badge">${escapeHtml(p.id)}</span></h4>
        <div class="reminder-med-name">${escapeHtml(p.medication)}</div>
        <div class="reminder-time-badge">⏰ Time: ${escapeHtml(p.medTime || 'Scheduled daily')}</div>
        <div style="margin-top: 0.65rem;">
          <button class="btn btn-outline btn-xs mark-dose-btn" data-id="${p.id}">
            ✓ Mark Dose Administered
          </button>
        </div>
      </div>
    `;
    reminderListContainer.appendChild(card);
  });

  document.querySelectorAll(".mark-dose-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.target.textContent = "✓ Dose Recorded";
      e.target.style.backgroundColor = "var(--accent-green-bg)";
      e.target.style.color = "var(--accent-green)";
      e.target.style.borderColor = "var(--accent-green)";
      showToast("Medication dose confirmed and logged!");
    });
  });
}

/* ==========================================================================
   Patient Modal Detail & Note Update
   ========================================================================== */

function openPatientModal(id) {
  const p = patients.find(item => item.id === id);
  if (!p) return;

  currentActivePatient = p;
  modalPatientId.textContent = p.id;
  modalPatientName.textContent = p.name;

  modalBodyContent.innerHTML = `
    <div class="patient-detail-grid">
      <div class="detail-block">
        <label>Age &amp; Gender</label>
        <span>${p.age} years &bull; ${escapeHtml(p.gender)}</span>
      </div>
      <div class="detail-block">
        <label>Primary Phone</label>
        <span>${escapeHtml(p.contact)}</span>
      </div>
      <div class="detail-block">
        <label>Known Allergies</label>
        <span style="color: ${p.allergies && p.allergies.toLowerCase() !== 'none' ? 'var(--accent-red)' : 'inherit'}; font-weight: 700;">
          ${escapeHtml(p.allergies || 'None recorded')}
        </span>
      </div>
      <div class="detail-block">
        <label>Primary Diagnosis</label>
        <span>${escapeHtml(p.diagnosis)}</span>
      </div>
      <div class="detail-block">
        <label>Last Consultation</label>
        <span>${escapeHtml(p.lastVisit)}</span>
      </div>
      <div class="detail-block">
        <label>Next Doctor Appointment</label>
        <span style="color: var(--brand-teal);">${escapeHtml(p.nextAppt)}</span>
      </div>
      <div class="detail-block" style="grid-column: 1 / -1;">
        <label>Current Prescriptions &amp; Schedule</label>
        <span>${escapeHtml(p.medication || 'None assigned')}</span>
      </div>
    </div>

    <div class="clinical-notes-card">
      <h4>Doctor's Clinical Notes</h4>
      <p id="modalNotesText">${escapeHtml(p.notes || 'No recent clinical annotations recorded.')}</p>
    </div>
  `;

  patientModal.classList.add("open");
  patientModal.setAttribute("aria-hidden", "false");
}

function closePatientModal() {
  patientModal.classList.remove("open");
  patientModal.setAttribute("aria-hidden", "true");
  currentActivePatient = null;
}

function handleAddVisitNote() {
  if (!currentActivePatient) return;
  const newNote = prompt("Enter additional doctor note / visit observation for " + currentActivePatient.name + ":");
  if (newNote && newNote.trim()) {
    const today = new Date().toISOString().split("T")[0];
    currentActivePatient.lastVisit = today;
    currentActivePatient.notes = `${currentActivePatient.notes} [Updated ${today}]: ${newNote.trim()}`;
    savePatientsData();
    renderPatientTable();
    openPatientModal(currentActivePatient.id);
    showToast("Visit record updated successfully!");
  }
}

/* ==========================================================================
   Form Handling (Register New Patient)
   ========================================================================== */

function handleRegisterPatient(e) {
  e.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const age = parseInt(document.getElementById("regAge").value, 10);
  const gender = document.getElementById("regGender").value;
  const contact = document.getElementById("regContact").value.trim();
  const allergies = document.getElementById("regAllergies").value.trim() || "None";
  const diagnosis = document.getElementById("regDiagnosis").value.trim();
  const medication = document.getElementById("regMedication").value.trim() || "None prescribed";
  const notes = document.getElementById("regNotes").value.trim() || "Initial patient intake completed.";

  const nextId = "P-" + (100 + patients.length + 1);
  const today = new Date().toISOString().split("T")[0];

  // Schedule follow up in 2 weeks
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 14);
  const nextApptStr = nextDate.toISOString().split("T")[0];

  const newPatient = {
    id: nextId,
    name,
    age,
    gender,
    contact,
    allergies,
    diagnosis,
    lastVisit: today,
    nextAppt: nextApptStr,
    medication,
    medTime: "08:00 AM & 08:00 PM",
    notes
  };

  patients.unshift(newPatient);
  savePatientsData();
  renderPatientTable();
  renderMedicineReminders();
  newPatientForm.reset();

  // Switch to search tab
  switchDemoTab("searchTab");

  showToast(`Registered patient ${name} (${nextId}) successfully!`);
}

/* ==========================================================================
   Presentation Slides Carousel Modal
   ========================================================================== */

function initSlideDots() {
  slideDotsContainer.innerHTML = "";
  for (let i = 1; i <= TOTAL_SLIDES; i++) {
    const dot = document.createElement("div");
    dot.className = `slide-dot ${i === currentSlideIndex ? 'active' : ''}`;
    dot.setAttribute("data-slide-target", i);
    dot.addEventListener("click", () => goToSlide(i));
    slideDotsContainer.appendChild(dot);
  }
}

function updateSlideView() {
  slideItems.forEach(item => {
    const slideNum = parseInt(item.getAttribute("data-slide"), 10);
    if (slideNum === currentSlideIndex) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  slideIndicator.textContent = `Slide ${currentSlideIndex} of ${TOTAL_SLIDES}`;

  // Update dots
  const dots = document.querySelectorAll(".slide-dot");
  dots.forEach((dot, idx) => {
    if (idx + 1 === currentSlideIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });

  prevSlideBtn.disabled = currentSlideIndex === 1;
  nextSlideBtn.disabled = currentSlideIndex === TOTAL_SLIDES;
}

function goToSlide(n) {
  if (n < 1) n = 1;
  if (n > TOTAL_SLIDES) n = TOTAL_SLIDES;
  currentSlideIndex = n;
  updateSlideView();
}

function openSlideViewer() {
  slideViewerModal.classList.add("open");
  slideViewerModal.setAttribute("aria-hidden", "false");
  updateSlideView();
}

function closeSlideViewer() {
  slideViewerModal.classList.remove("open");
  slideViewerModal.setAttribute("aria-hidden", "true");
}

/* ==========================================================================
   Suggestion / Feedback Modal
   ========================================================================== */

function openFeedback() {
  feedbackModal.classList.add("open");
  feedbackModal.setAttribute("aria-hidden", "false");
}

function closeFeedback() {
  feedbackModal.classList.remove("open");
  feedbackModal.setAttribute("aria-hidden", "true");
}

function handleFeedbackSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("fbName").value;
  const role = document.getElementById("fbRole").value;
  const text = document.getElementById("fbText").value;

  const suggestions = JSON.parse(localStorage.getItem("phrms_suggestions") || "[]");
  suggestions.push({
    name,
    role,
    text,
    date: new Date().toISOString()
  });
  localStorage.setItem("phrms_suggestions", JSON.stringify(suggestions));

  feedbackForm.reset();
  closeFeedback();
  showToast("Thank you! Your suggestions were submitted to the team.");
}

/* ==========================================================================
   Tab Navigation Helper
   ========================================================================== */

function switchDemoTab(targetTabId) {
  demoTabBtns.forEach(b => {
    if (b.getAttribute("data-tab") === targetTabId) {
      b.classList.add("active");
    } else {
      b.classList.remove("active");
    }
  });

  demoTabContents.forEach(c => {
    if (c.id === targetTabId) {
      c.classList.add("active");
    } else {
      c.classList.remove("active");
    }
  });
}

/* ==========================================================================
   Event Listeners Setup
   ========================================================================== */

function setupEventListeners() {
  // Theme Toggle
  themeToggleBtn.addEventListener("click", toggleTheme);

  // Mobile Menu Toggle
  mobileMenuBtn.addEventListener("click", () => {
    const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
    mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);
    navLinks.classList.toggle("mobile-open");
  });

  // Close mobile nav when clicking a link
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("mobile-open");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
    });
  });

  // Search Input
  patientSearchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    renderPatientTable();
  });

  searchClearBtn.addEventListener("click", () => {
    patientSearchInput.value = "";
    currentSearch = "";
    renderPatientTable();
    patientSearchInput.focus();
  });

  // Filter Pills
  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      filterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentFilter = pill.getAttribute("data-filter");
      renderPatientTable();
    });
  });

  // Demo Tabs
  demoTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      switchDemoTab(target);
    });
  });

  // Register Form
  newPatientForm.addEventListener("submit", handleRegisterPatient);

  // Reset Demo
  resetDemoBtn.addEventListener("click", resetPatientsData);

  // Modal Closures
  modalCloseBtn.addEventListener("click", closePatientModal);
  modalDismissBtn.addEventListener("click", closePatientModal);
  modalUpdateBtn.addEventListener("click", handleAddVisitNote);

  patientModal.addEventListener("click", (e) => {
    if (e.target === patientModal) closePatientModal();
  });

  // Presentation Mode
  presentationModeBtn.addEventListener("click", openSlideViewer);
  presCloseBtn.addEventListener("click", closeSlideViewer);
  prevSlideBtn.addEventListener("click", () => goToSlide(currentSlideIndex - 1));
  nextSlideBtn.addEventListener("click", () => goToSlide(currentSlideIndex + 1));

  slideViewerModal.addEventListener("click", (e) => {
    if (e.target === slideViewerModal) closeSlideViewer();
  });

  // Feedback Modal
  openFeedbackFooterLink.addEventListener("click", openFeedback);
  feedbackCloseBtn.addEventListener("click", closeFeedback);
  feedbackCancelBtn.addEventListener("click", closeFeedback);
  feedbackForm.addEventListener("submit", handleFeedbackSubmit);

  feedbackModal.addEventListener("click", (e) => {
    if (e.target === feedbackModal) closeFeedback();
  });

  // Keyboard navigation for slides & modal escape
  window.addEventListener("keydown", (e) => {
    if (slideViewerModal.classList.contains("open")) {
      if (e.key === "ArrowLeft") goToSlide(currentSlideIndex - 1);
      if (e.key === "ArrowRight") goToSlide(currentSlideIndex + 1);
      if (e.key === "Escape") closeSlideViewer();
    } else if (patientModal.classList.contains("open")) {
      if (e.key === "Escape") closePatientModal();
    } else if (feedbackModal.classList.contains("open")) {
      if (e.key === "Escape") closeFeedback();
    }
  });
}

/* ==========================================================================
   Utilities
   ========================================================================== */

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>🔔</span> <span>${escapeHtml(message)}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.25s ease-out";
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}
