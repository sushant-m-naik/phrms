/**
 * Patient Health Record Management System (PHRMS)
 * Ultra-fast, lightweight vanilla JavaScript application with Role-Based Access Control (RBAC)
 * Supports:
 * - Patient Self-Registration & Personal Health Portal
 * - Clinic Administrator with complete clinical, user, and backup oversight
 * - Guest preview with 1-click test logins
 * - Presentation Slide Viewer & Feedback
 */

// Initial Seed Data for Patients
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
    bloodGroup: "O+",
    address: "742 Evergreen Terrace, Springfield",
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
    bloodGroup: "B+",
    address: "12 Connaught Circle, New Delhi",
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
    bloodGroup: "A+",
    address: "450 Valencia St, San Francisco",
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
    bloodGroup: "AB+",
    address: "88 Willow Creek Lane, Seattle",
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
    bloodGroup: "O-",
    address: "190 Desert Bloom Way, Phoenix",
    notes: "Energy levels improving steadily. Free T4 within normal reference limits. Continue present dosage."
  }
];

// Initial Seed Users for RBAC
const INITIAL_USERS = [
  {
    id: "USR-ADM-01",
    name: "Dr. Nagaraj (Admin)",
    email: "admin@phrms.clinic",
    password: "admin123",
    role: "admin",
    roleLabel: "Chief Physician & Clinic Administrator",
    patientId: null,
    createdAt: "2026-11-01"
  },
  {
    id: "USR-PAT-01",
    name: "Eleanor Vance",
    email: "eleanor@gmail.com",
    password: "patient123",
    role: "patient",
    roleLabel: "Self-Registered Patient",
    patientId: "P-101",
    createdAt: "2026-11-02"
  }
];

// Global State
let patients = [];
let users = [];
let currentUser = null; // null = Guest, or user object with role: 'admin' | 'patient'
let currentFilter = "all";
let currentSearch = "";
let currentActivePatient = null;
let currentSlideIndex = 1;
const TOTAL_SLIDES = 9;

// DOM Cache
const authNavContainer = document.getElementById("authNavContainer");
const roleStatusDot = document.getElementById("roleStatusDot");
const roleBadgePill = document.getElementById("roleBadgePill");
const roleBannerTitle = document.getElementById("roleBannerTitle");
const roleBannerDesc = document.getElementById("roleBannerDesc");
const roleBannerActions = document.getElementById("roleBannerActions");
const clinicModePill = document.getElementById("clinicModePill");
const demoTabsContainer = document.getElementById("demoTabsContainer");

// Auth Modal Cache
const authModal = document.getElementById("authModal");
const authCloseBtn = document.getElementById("authCloseBtn");
const authLoginTabBtn = document.getElementById("authLoginTabBtn");
const authSignupTabBtn = document.getElementById("authSignupTabBtn");
const loginPanel = document.getElementById("loginPanel");
const signupPanel = document.getElementById("signupPanel");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const quickAdminLoginBtn = document.getElementById("quickAdminLoginBtn");
const quickPatientLoginBtn = document.getElementById("quickPatientLoginBtn");
const switchToSignupLink = document.getElementById("switchToSignupLink");
const switchToLoginLink = document.getElementById("switchToLoginLink");

// Hero Buttons
const heroSignupBtn = document.getElementById("heroSignupBtn");

// Patient Table & Search Cache
const patientTableBody = document.getElementById("patientTableBody");
const patientSearchInput = document.getElementById("patientSearchInput");
const searchClearBtn = document.getElementById("searchClearBtn");
const noResultsMsg = document.getElementById("noResultsMsg");
const filterPills = document.querySelectorAll(".filter-pill");
const newPatientForm = document.getElementById("newPatientForm");
const reminderListContainer = document.getElementById("reminderListContainer");
const resetDemoBtn = document.getElementById("resetDemoBtn");

// Patient Portal Containers
const patientRecordContainer = document.getElementById("patientRecordContainer");
const patientMyRemindersContainer = document.getElementById("patientMyRemindersContainer");
const patientAppointmentsContainer = document.getElementById("patientAppointmentsContainer");
const patientProfileEditForm = document.getElementById("patientProfileEditForm");

// Admin Containers
const userTableBody = document.getElementById("userTableBody");
const astatTotalPatients = document.getElementById("astatTotalPatients");
const astatTotalUsers = document.getElementById("astatTotalUsers");
const astatSelfRegistered = document.getElementById("astatSelfRegistered");
const astatActiveAdmins = document.getElementById("astatActiveAdmins");
const exportBackupBtn = document.getElementById("exportBackupBtn");

// Modal Elements
const patientModal = document.getElementById("patientModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalDismissBtn = document.getElementById("modalDismissBtn");
const modalUpdateBtn = document.getElementById("modalUpdateBtn");
const modalPatientId = document.getElementById("modalPatientId");
const modalPatientName = document.getElementById("modalPatientName");
const modalBodyContent = document.getElementById("modalBodyContent");

// Presentation & Feedback
const presentationModeBtn = document.getElementById("presentationModeBtn");
const slideViewerModal = document.getElementById("slideViewerModal");
const presCloseBtn = document.getElementById("presCloseBtn");
const prevSlideBtn = document.getElementById("prevSlideBtn");
const nextSlideBtn = document.getElementById("nextSlideBtn");
const slideIndicator = document.getElementById("slideIndicator");
const slideDotsContainer = document.getElementById("slideDots");
const slideItems = document.querySelectorAll(".slide-item");

const feedbackModal = document.getElementById("feedbackModal");
const feedbackCloseBtn = document.getElementById("feedbackCloseBtn");
const feedbackCancelBtn = document.getElementById("feedbackCancelBtn");
const feedbackForm = document.getElementById("feedbackForm");
const openFeedbackFooterLink = document.getElementById("openFeedbackFooterLink");

const themeToggleBtn = document.getElementById("themeToggleBtn");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");
const toastContainer = document.getElementById("toastContainer");

/* ==========================================================================
   Initialization
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initStorage();
  renderApp();
  setupEventListeners();
  initSlideDots();
});

function initStorage() {
  // Patients
  const savedPatients = localStorage.getItem("phrms_patients");
  if (savedPatients) {
    try {
      patients = JSON.parse(savedPatients);
    } catch (e) {
      patients = [...INITIAL_PATIENTS];
    }
  } else {
    patients = [...INITIAL_PATIENTS];
    savePatients();
  }

  // Users
  const savedUsers = localStorage.getItem("phrms_users");
  if (savedUsers) {
    try {
      users = JSON.parse(savedUsers);
    } catch (e) {
      users = [...INITIAL_USERS];
    }
  } else {
    users = [...INITIAL_USERS];
    saveUsers();
  }

  // Current User Session
  const savedSession = localStorage.getItem("phrms_current_user");
  if (savedSession) {
    try {
      currentUser = JSON.parse(savedSession);
    } catch (e) {
      currentUser = null;
    }
  } else {
    currentUser = null; // Default to Guest Preview
  }
}

function savePatients() {
  localStorage.setItem("phrms_patients", JSON.stringify(patients));
}

function saveUsers() {
  localStorage.setItem("phrms_users", JSON.stringify(users));
}

function saveSession() {
  if (currentUser) {
    localStorage.setItem("phrms_current_user", JSON.stringify(currentUser));
  } else {
    localStorage.removeItem("phrms_current_user");
  }
}

function renderApp() {
  renderNavbarAuth();
  renderRoleBanner();
  renderDemoTabs();
  renderPatientTable();
  renderMedicineReminders();
  renderAdminPanel();
  renderPatientPortal();
}

/* ==========================================================================
   Authentication & Session Handling
   ========================================================================== */

function login(email, password) {
  const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
  if (!user) {
    showToast("Invalid email or password. Please try again.");
    return false;
  }

  currentUser = user;
  saveSession();
  closeAuthModal();
  renderApp();

  if (user.role === "admin") {
    showToast(`Welcome back, ${user.name}! (Admin Access Granted)`);
  } else {
    showToast(`Welcome, ${user.name}! Your Personal Health Portal is ready.`);
  }

  // Smooth scroll to demo section
  document.getElementById("demo").scrollIntoView({ behavior: "smooth" });
  return true;
}

function logout() {
  const prevName = currentUser ? currentUser.name : "User";
  currentUser = null;
  saveSession();
  renderApp();
  showToast(`Signed out successfully. Now in Guest Preview Mode.`);
}

function quickLoginAs(role) {
  if (role === "admin") {
    login("admin@phrms.clinic", "admin123");
  } else if (role === "patient") {
    login("eleanor@gmail.com", "patient123");
  }
}

function handlePatientSignup(e) {
  e.preventDefault();

  const name = document.getElementById("signName").value.trim();
  const email = document.getElementById("signEmail").value.trim().toLowerCase();
  const password = document.getElementById("signPassword").value;
  const phone = document.getElementById("signPhone").value.trim();
  const age = parseInt(document.getElementById("signAge").value, 10);
  const gender = document.getElementById("signGender").value;
  const allergies = document.getElementById("signAllergies").value.trim() || "None reported";
  const concern = document.getElementById("signConcern").value.trim();
  const adminCode = document.getElementById("signAdminCode").value.trim();

  // Check if email already registered
  if (users.some(u => u.email.toLowerCase() === email)) {
    showToast("This email address is already registered. Please sign in.");
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  const nextVisitDate = new Date();
  nextVisitDate.setDate(nextVisitDate.getDate() + 14);
  const nextApptStr = nextVisitDate.toISOString().split("T")[0];

  // Check if staff code provided
  const isAdmin = (adminCode === "CLINIC2026");

  if (isAdmin) {
    const newAdminUser = {
      id: `USR-ADM-${users.length + 1}`,
      name: name + " (Admin)",
      email,
      password,
      role: "admin",
      roleLabel: "Clinic Administrator",
      patientId: null,
      createdAt: today
    };
    users.unshift(newAdminUser);
    saveUsers();
    currentUser = newAdminUser;
    saveSession();
    closeAuthModal();
    renderApp();
    showToast(`Admin account registered! Welcome to the clinic control center.`);
    document.getElementById("demo").scrollIntoView({ behavior: "smooth" });
    return;
  }

  // Otherwise, patient self-registration
  const newPatientId = `P-${100 + patients.length + 1}`;
  const newPatientRecord = {
    id: newPatientId,
    name,
    age,
    gender,
    contact: phone,
    allergies,
    diagnosis: concern,
    lastVisit: today,
    nextAppt: nextApptStr,
    medication: "Daily Multivitamin 1 tablet (08:00 AM)",
    medTime: "08:00 AM",
    bloodGroup: "O+",
    address: "Registered Online",
    notes: `Self-registered by patient on ${today}. Chief complaint / concern: ${concern}. Pending initial doctor consultation.`
  };

  const newPatientUser = {
    id: `USR-PAT-${users.length + 1}`,
    name,
    email,
    password,
    role: "patient",
    roleLabel: "Self-Registered Patient",
    patientId: newPatientId,
    createdAt: today
  };

  patients.unshift(newPatientRecord);
  users.unshift(newPatientUser);
  savePatients();
  saveUsers();

  currentUser = newPatientUser;
  saveSession();
  closeAuthModal();
  signupForm.reset();
  renderApp();

  showToast(`Registration complete! Patient ID ${newPatientId} assigned to ${name}.`);
  document.getElementById("demo").scrollIntoView({ behavior: "smooth" });
}

/* ==========================================================================
   Navigation Bar & Role Banner Rendering
   ========================================================================== */

function renderNavbarAuth() {
  if (!authNavContainer) return;

  if (currentUser) {
    const isAdm = currentUser.role === "admin";
    authNavContainer.innerHTML = `
      <div class="user-profile-pill">
        <span class="user-avatar-badge ${isAdm ? 'admin-avatar' : 'patient-avatar'}">
          ${isAdm ? '🛡️' : '👤'}
        </span>
        <span class="user-name-text" title="${escapeHtml(currentUser.name)}">${escapeHtml(currentUser.name)}</span>
        <span class="user-role-tag ${isAdm ? 'role-admin' : 'role-patient'}">
          ${isAdm ? 'Admin' : 'Patient'}
        </span>
        <button class="btn btn-outline btn-xs" id="navLogoutBtn" title="Sign Out">Sign Out</button>
      </div>
    `;

    document.getElementById("navLogoutBtn").addEventListener("click", logout);
  } else {
    authNavContainer.innerHTML = `
      <div class="auth-btn-group">
        <button class="btn btn-secondary btn-sm" id="navLoginBtn">Log In</button>
        <button class="btn btn-primary btn-sm" id="navSignupBtn">Patient Sign Up</button>
      </div>
    `;

    document.getElementById("navLoginBtn").addEventListener("click", () => openAuthModal("login"));
    document.getElementById("navSignupBtn").addEventListener("click", () => openAuthModal("signup"));
  }
}

function renderRoleBanner() {
  if (!roleStatusDot) return;

  if (currentUser && currentUser.role === "admin") {
    roleStatusDot.className = "role-status-dot dot-admin";
    roleBadgePill.className = "role-badge-pill pill-admin";
    roleBadgePill.textContent = "🛡️ Clinic Administrator";
    roleBannerTitle.textContent = `${currentUser.name} - Full Clinical Oversight`;
    roleBannerDesc.textContent = "You have complete authority: view & edit all patient records, log visit notes, manage medication schedules, inspect user directory, and backup clinic data.";
    clinicModePill.textContent = "Role: Clinic Admin (Full Access)";

    roleBannerActions.innerHTML = `
      <button class="btn btn-primary btn-xs" id="rbExportBtn">💾 Download Backup</button>
      <button class="btn btn-outline btn-xs" id="rbSwitchToPat">👤 Switch to Patient View</button>
      <button class="btn btn-secondary btn-xs" id="rbLogout">Sign Out</button>
    `;

    document.getElementById("rbExportBtn").addEventListener("click", exportSystemBackup);
    document.getElementById("rbSwitchToPat").addEventListener("click", () => quickLoginAs("patient"));
    document.getElementById("rbLogout").addEventListener("click", logout);
  } else if (currentUser && currentUser.role === "patient") {
    const myRecord = patients.find(p => p.id === currentUser.patientId);
    const patIdStr = myRecord ? myRecord.id : currentUser.patientId;

    roleStatusDot.className = "role-status-dot dot-patient";
    roleBadgePill.className = "role-badge-pill pill-patient";
    roleBadgePill.textContent = "👤 Patient Self-Service Portal";
    roleBannerTitle.textContent = `${currentUser.name} (Health ID: ${patIdStr})`;
    roleBannerDesc.textContent = "Your private health record: review your consultation history, check your daily medication dose schedule, and update your personal contact info.";
    clinicModePill.textContent = `Patient: ${patIdStr}`;

    roleBannerActions.innerHTML = `
      <button class="btn btn-outline btn-xs" id="rbSwitchToAdm">🛡️ Switch to Admin View</button>
      <button class="btn btn-secondary btn-xs" id="rbLogout">Sign Out</button>
    `;

    document.getElementById("rbSwitchToAdm").addEventListener("click", () => quickLoginAs("admin"));
    document.getElementById("rbLogout").addEventListener("click", logout);
  } else {
    // Guest
    roleStatusDot.className = "role-status-dot dot-guest";
    roleBadgePill.className = "role-badge-pill pill-guest";
    roleBadgePill.textContent = "Guest Preview Mode";
    roleBannerTitle.textContent = "Public System Demonstration";
    roleBannerDesc.textContent = "Experience the role-based system: Log in as Clinic Admin for full records access, or Sign Up as a Patient to test self-registration.";
    clinicModePill.textContent = "Mode: Guest Preview";

    roleBannerActions.innerHTML = `
      <button class="btn btn-primary btn-xs" id="rbLoginAdmin">🛡️ Login as Admin</button>
      <button class="btn btn-outline btn-xs" id="rbLoginPatient">👤 Login as Patient</button>
      <button class="btn btn-secondary btn-xs" id="rbSignUp">📝 Patient Sign Up</button>
    `;

    document.getElementById("rbLoginAdmin").addEventListener("click", () => quickLoginAs("admin"));
    document.getElementById("rbLoginPatient").addEventListener("click", () => quickLoginAs("patient"));
    document.getElementById("rbSignUp").addEventListener("click", () => openAuthModal("signup"));
  }
}

/* ==========================================================================
   Demo Tabs & Views Management
   ========================================================================== */

function renderDemoTabs() {
  if (!demoTabsContainer) return;

  if (currentUser && currentUser.role === "patient") {
    // PATIENT ROLE TABS
    demoTabsContainer.innerHTML = `
      <button class="demo-tab-btn active" data-tab="patientRecordTab">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        My Health Dossier
      </button>
      <button class="demo-tab-btn" data-tab="patientRemindersTab">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
        My Medicine Reminders
      </button>
      <button class="demo-tab-btn" data-tab="patientAppointmentsTab">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        My Appointments
      </button>
      <button class="demo-tab-btn" data-tab="patientProfileTab">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        Update My Profile
      </button>
    `;
    switchDemoTab("patientRecordTab");
  } else {
    // ADMIN OR GUEST TABS
    const isAdmin = currentUser && currentUser.role === "admin";
    demoTabsContainer.innerHTML = `
      <button class="demo-tab-btn active" data-tab="searchTab">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        Find &amp; View Records
      </button>
      <button class="demo-tab-btn" data-tab="registerTab">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
        Staff Intake
      </button>
      <button class="demo-tab-btn" data-tab="reminderTab">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
        Med Reminders
      </button>
      ${isAdmin ? `
      <button class="demo-tab-btn" data-tab="adminUsersTab">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        User Directory &amp; Backup
      </button>
      ` : ''}
    `;
    switchDemoTab("searchTab");
  }

  // Re-bind tab clicks
  demoTabsContainer.querySelectorAll(".demo-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      switchDemoTab(tabId);
    });
  });
}

function switchDemoTab(targetTabId) {
  if (!demoTabsContainer) return;

  demoTabsContainer.querySelectorAll(".demo-tab-btn").forEach(btn => {
    if (btn.getAttribute("data-tab") === targetTabId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  document.querySelectorAll(".demo-tab-content").forEach(c => {
    if (c.id === targetTabId) {
      c.classList.add("active");
    } else {
      c.classList.remove("active");
    }
  });
}

/* ==========================================================================
   Patient Personal Portal Rendering
   ========================================================================== */

function renderPatientPortal() {
  if (!currentUser || currentUser.role !== "patient") return;

  const p = patients.find(item => item.id === currentUser.patientId) || {
    id: currentUser.patientId || "P-NEW",
    name: currentUser.name,
    age: 30,
    gender: "Not specified",
    contact: "+1 (555) 000-0000",
    allergies: "None reported",
    diagnosis: "General Wellness",
    lastVisit: "2026-11-17",
    nextAppt: "2026-12-01",
    medication: "Daily Multivitamin (08:00 AM)",
    medTime: "08:00 AM",
    bloodGroup: "O+",
    address: "Registered Online",
    notes: "Patient profile created via self-registration."
  };

  // 1. My Health Dossier
  if (patientRecordContainer) {
    const hasAllergy = p.allergies && p.allergies.toLowerCase() !== "none" && p.allergies.toLowerCase() !== "none reported";

    patientRecordContainer.innerHTML = `
      <div class="patient-portal-hero">
        <div class="patient-hero-text">
          <h3>Welcome, ${escapeHtml(p.name)}!</h3>
          <p>Assigned Health ID: <strong style="color: var(--brand-teal); font-family: monospace;">${escapeHtml(p.id)}</strong> &bull; Blood Group: <strong>${escapeHtml(p.bloodGroup || 'O+')}</strong></p>
        </div>
        <div>
          <button class="btn btn-primary btn-sm" id="ptSwitchToEdit">✏️ Edit My Contact Info</button>
        </div>
      </div>

      <div class="patient-portal-grid">
        <div class="portal-box-card">
          <h4>👤 Demographic &amp; Contact Details</h4>
          <div class="patient-detail-grid">
            <div class="detail-block"><label>Age &amp; Gender</label><span>${p.age} years &bull; ${escapeHtml(p.gender)}</span></div>
            <div class="detail-block"><label>Primary Phone</label><span>${escapeHtml(p.contact)}</span></div>
            <div class="detail-block" style="grid-column: 1 / -1;"><label>Home Address</label><span>${escapeHtml(p.address || 'Address on file')}</span></div>
            <div class="detail-block" style="grid-column: 1 / -1;">
              <label>Allergy Warning</label>
              <span style="color: ${hasAllergy ? 'var(--accent-red)' : 'var(--accent-green)'}; font-weight: 700;">
                ${hasAllergy ? '⚠️ ' + escapeHtml(p.allergies) : '✓ No Adverse Allergies Reported'}
              </span>
            </div>
          </div>
        </div>

        <div class="portal-box-card">
          <h4>📋 Clinical Vitals &amp; Diagnosis</h4>
          <div class="patient-vitals-row">
            <div class="vital-metric"><span class="v-label">Heart Rate</span><span class="v-value">72 bpm</span></div>
            <div class="vital-metric"><span class="v-label">Blood Pressure</span><span class="v-value">120/80</span></div>
            <div class="vital-metric"><span class="v-label">Status</span><span class="v-value" style="color: var(--accent-green);">Stable</span></div>
          </div>
          <div class="clinical-notes-card">
            <h4>Primary Diagnosis / Care Focus</h4>
            <p style="font-weight: 700; color: var(--brand-teal); margin-bottom: 0.5rem;">${escapeHtml(p.diagnosis)}</p>
            <h4>Attending Doctor's Latest Visit Notes</h4>
            <p>${escapeHtml(p.notes)}</p>
          </div>
        </div>
      </div>
    `;

    document.getElementById("ptSwitchToEdit").addEventListener("click", () => switchDemoTab("patientProfileTab"));
  }

  // 2. My Medicine Reminders
  if (patientMyRemindersContainer) {
    patientMyRemindersContainer.innerHTML = `
      <div class="tab-intro-box">
        <h3>My Daily Prescribed Medications</h3>
        <p>Stay on track with your doctor's dosage regimen. Check off doses as you take them today.</p>
      </div>
      <div class="reminder-card" style="margin-bottom: 1.25rem;">
        <div class="reminder-pill-icon">💊</div>
        <div class="reminder-info" style="flex: 1;">
          <h4>${escapeHtml(p.medication || 'No prescription assigned')}</h4>
          <div class="reminder-time-badge">⏰ Scheduled Timing: ${escapeHtml(p.medTime || 'Scheduled daily')}</div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.4rem;">
            Prescribed for your diagnosis: <strong>${escapeHtml(p.diagnosis)}</strong>. Take with water as instructed.
          </p>
          <div style="margin-top: 0.85rem;">
            <button class="btn btn-primary btn-sm" id="ptMarkDoseBtn">
              ✓ I Have Taken My Dose Today
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("ptMarkDoseBtn").addEventListener("click", (e) => {
      e.target.textContent = "✓ Dose Confirmed Taken at " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      e.target.style.backgroundColor = "var(--accent-green)";
      e.target.style.borderColor = "var(--accent-green)";
      showToast("Great job! Your dosage adherence is logged.");
    });
  }

  // 3. My Appointments
  if (patientAppointmentsContainer) {
    patientAppointmentsContainer.innerHTML = `
      <div class="tab-intro-box">
        <h3>My Clinic Consultations</h3>
        <p>Upcoming scheduled visits with your physician.</p>
      </div>
      <div class="portal-box-card" style="max-width: 600px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <span class="role-badge-pill pill-patient">Confirmed Appointment</span>
          <span style="font-size: 0.82rem; color: var(--text-muted);">Doctor: Dr. Nagaraj</span>
        </div>
        <h3 style="font-size: 1.4rem; color: var(--brand-teal); margin-bottom: 0.35rem;">
          📅 ${escapeHtml(p.nextAppt)}
        </h3>
        <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1rem;">
          Routine Follow-up &amp; Evaluation Consultation at PHRMS Main Clinic.
        </p>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-primary btn-xs" id="ptSetReminderBtn">🔔 Set SMS / Notification Alert</button>
          <button class="btn btn-outline btn-xs" id="ptRequestResched">Request Reschedule</button>
        </div>
      </div>
    `;

    document.getElementById("ptSetReminderBtn").addEventListener("click", () => {
      showToast(`Reminder active! You will receive notification on ${p.nextAppt}.`);
    });
    document.getElementById("ptRequestResched").addEventListener("click", () => {
      alert("To reschedule your appointment, please contact the clinic reception at +1 (555) 019-2831.");
    });
  }

  // 4. Update Profile Form Pre-fill
  if (patientProfileEditForm) {
    document.getElementById("profName").value = p.name;
    document.getElementById("profId").value = p.id;
    document.getElementById("profContact").value = p.contact;
    document.getElementById("profAllergies").value = p.allergies;
    document.getElementById("profAddress").value = p.address || "";
  }
}

function handlePatientProfileUpdate(e) {
  e.preventDefault();
  if (!currentUser || currentUser.role !== "patient") return;

  const p = patients.find(item => item.id === currentUser.patientId);
  if (!p) return;

  p.contact = document.getElementById("profContact").value.trim();
  p.allergies = document.getElementById("profAllergies").value.trim();
  p.address = document.getElementById("profAddress").value.trim();

  savePatients();
  renderPatientPortal();
  renderPatientTable();
  showToast("Your personal profile details were updated successfully!");
  switchDemoTab("patientRecordTab");
}

/* ==========================================================================
   Admin Console & User Management
   ========================================================================== */

function renderAdminPanel() {
  if (astatTotalPatients) astatTotalPatients.textContent = patients.length;
  if (astatTotalUsers) astatTotalUsers.textContent = users.length;
  if (astatSelfRegistered) astatSelfRegistered.textContent = users.filter(u => u.role === "patient").length;
  if (astatActiveAdmins) astatActiveAdmins.textContent = users.filter(u => u.role === "admin").length;

  if (userTableBody) {
    userTableBody.innerHTML = "";
    users.forEach(u => {
      const tr = document.createElement("tr");
      const isAdm = u.role === "admin";
      tr.innerHTML = `
        <td><span class="table-id-badge">${escapeHtml(u.id)}</span></td>
        <td><strong>${escapeHtml(u.name)}</strong></td>
        <td>${escapeHtml(u.email)}</td>
        <td>
          <span class="user-role-tag ${isAdm ? 'role-admin' : 'role-patient'}">
            ${escapeHtml(u.role)}
          </span>
        </td>
        <td>${u.patientId ? `<span class="table-id-badge">${escapeHtml(u.patientId)}</span>` : '<span style="color:var(--text-muted)">N/A (Staff)</span>'}</td>
        <td>
          <span class="table-diag-badge ${isAdm ? 'table-alert-badge' : ''}">
            ${isAdm ? 'Full Access' : 'Private Patient Dossier'}
          </span>
        </td>
      `;
      userTableBody.appendChild(tr);
    });
  }
}

function exportSystemBackup() {
  const exportPayload = {
    system: "Patient Health Record Management System (PHRMS)",
    exportedAt: new Date().toISOString(),
    organization: "PHRMS Paperless Health Clinic",
    statistics: {
      totalPatients: patients.length,
      totalUsers: users.length
    },
    patients,
    users
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `phrms-clinic-backup-${new Date().toISOString().split("T")[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast("Encrypted cloud backup exported as JSON file!");
}

/* ==========================================================================
   Patient Table & Clinic Search
   ========================================================================== */

function getFilteredPatients() {
  return patients.filter(p => {
    const q = currentSearch.trim().toLowerCase();
    const matchesSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.diagnosis.toLowerCase().includes(q) ||
      p.allergies.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (currentFilter === "allergies") {
      return p.allergies && p.allergies.toLowerCase() !== "none" && p.allergies.toLowerCase() !== "none reported";
    }

    return true;
  });
}

function renderPatientTable() {
  if (!patientTableBody) return;
  const filtered = getFilteredPatients();
  patientTableBody.innerHTML = "";

  if (filtered.length === 0) {
    if (noResultsMsg) noResultsMsg.classList.remove("hidden");
  } else {
    if (noResultsMsg) noResultsMsg.classList.add("hidden");
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

    document.querySelectorAll(".view-patient-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        openPatientModal(id);
      });
    });
  }
}

function renderMedicineReminders() {
  if (!reminderListContainer) return;
  reminderListContainer.innerHTML = "";
  patients.forEach(p => {
    if (!p.medication) return;

    const card = document.createElement("div");
    card.className = "reminder-card";
    card.innerHTML = `
      <div class="reminder-pill-icon">💊</div>
      <div class="reminder-info" style="flex: 1;">
        <h4>${escapeHtml(p.name)} <span class="table-id-badge">${escapeHtml(p.id)}</span></h4>
        <div class="reminder-med-name">${escapeHtml(p.medication)}</div>
        <div class="reminder-time-badge">⏰ Scheduled: ${escapeHtml(p.medTime || 'Scheduled daily')}</div>
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
      e.target.textContent = "✓ Administered";
      e.target.style.backgroundColor = "var(--accent-green-bg)";
      e.target.style.color = "var(--accent-green)";
      e.target.style.borderColor = "var(--accent-green)";
      showToast("Medication dose verified and logged into clinic encounter stream!");
    });
  });
}

/* ==========================================================================
   Patient Modal Details (Admin & Staff View)
   ========================================================================== */

function openPatientModal(id) {
  const p = patients.find(item => item.id === id);
  if (!p) return;

  currentActivePatient = p;
  modalPatientId.textContent = p.id;
  modalPatientName.textContent = p.name;

  modalBodyContent.innerHTML = `
    <div class="patient-detail-grid">
      <div class="detail-block"><label>Age &amp; Gender</label><span>${p.age} years &bull; ${escapeHtml(p.gender)}</span></div>
      <div class="detail-block"><label>Primary Phone</label><span>${escapeHtml(p.contact)}</span></div>
      <div class="detail-block">
        <label>Known Allergies</label>
        <span style="color: ${p.allergies && p.allergies.toLowerCase() !== 'none' ? 'var(--accent-red)' : 'inherit'}; font-weight: 700;">
          ${escapeHtml(p.allergies || 'None recorded')}
        </span>
      </div>
      <div class="detail-block"><label>Blood Group</label><span>${escapeHtml(p.bloodGroup || 'O+')}</span></div>
      <div class="detail-block"><label>Primary Diagnosis</label><span>${escapeHtml(p.diagnosis)}</span></div>
      <div class="detail-block"><label>Last Visit</label><span>${escapeHtml(p.lastVisit)}</span></div>
      <div class="detail-block"><label>Next Appointment</label><span style="color: var(--brand-teal); font-weight:700;">${escapeHtml(p.nextAppt)}</span></div>
      <div class="detail-block" style="grid-column: 1 / -1;"><label>Prescribed Medicines</label><span>${escapeHtml(p.medication || 'None assigned')}</span></div>
    </div>

    <div class="clinical-notes-card">
      <h4>Doctor's Clinical Notes</h4>
      <p id="modalNotesText">${escapeHtml(p.notes || 'No notes on file.')}</p>
    </div>
  `;

  // Enable visit note button only if admin
  if (modalUpdateBtn) {
    if (currentUser && currentUser.role === "patient") {
      modalUpdateBtn.style.display = "none";
    } else {
      modalUpdateBtn.style.display = "inline-flex";
    }
  }

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
  const newNote = prompt(`Enter clinical consultation observation for ${currentActivePatient.name}:`);
  if (newNote && newNote.trim()) {
    const today = new Date().toISOString().split("T")[0];
    currentActivePatient.lastVisit = today;
    currentActivePatient.notes = `${currentActivePatient.notes} [Updated ${today} by Dr. Nagaraj]: ${newNote.trim()}`;
    savePatients();
    renderPatientTable();
    openPatientModal(currentActivePatient.id);
    showToast("Visit observation saved to patient file!");
  }
}

/* ==========================================================================
   Staff Patient Intake (Admin Tab 2)
   ========================================================================== */

function handleStaffIntake(e) {
  e.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const age = parseInt(document.getElementById("regAge").value, 10);
  const gender = document.getElementById("regGender").value;
  const contact = document.getElementById("regContact").value.trim();
  const allergies = document.getElementById("regAllergies").value.trim() || "None";
  const diagnosis = document.getElementById("regDiagnosis").value.trim();
  const medication = document.getElementById("regMedication").value.trim() || "None prescribed";
  const notes = document.getElementById("regNotes").value.trim() || "Intake completed by clinic staff.";

  const nextId = "P-" + (100 + patients.length + 1);
  const today = new Date().toISOString().split("T")[0];
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
    bloodGroup: "O+",
    address: "Registered In-Clinic",
    notes
  };

  patients.unshift(newPatient);
  savePatients();
  renderPatientTable();
  renderMedicineReminders();
  renderAdminPanel();
  newPatientForm.reset();

  switchDemoTab("searchTab");
  showToast(`Registered patient ${name} (${nextId}) into clinic database!`);
}

/* ==========================================================================
   Auth Modal Controller
   ========================================================================== */

function openAuthModal(mode = "login") {
  if (mode === "signup") {
    authLoginTabBtn.classList.remove("active");
    authSignupTabBtn.classList.add("active");
    loginPanel.classList.remove("active");
    signupPanel.classList.add("active");
  } else {
    authSignupTabBtn.classList.remove("active");
    authLoginTabBtn.classList.add("active");
    signupPanel.classList.remove("active");
    loginPanel.classList.add("active");
  }

  authModal.classList.add("open");
  authModal.setAttribute("aria-hidden", "false");
}

function closeAuthModal() {
  authModal.classList.remove("open");
  authModal.setAttribute("aria-hidden", "true");
}

/* ==========================================================================
   Presentation Slide Viewer Modal
   ========================================================================== */

function initSlideDots() {
  if (!slideDotsContainer) return;
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

  if (slideIndicator) slideIndicator.textContent = `Slide ${currentSlideIndex} of ${TOTAL_SLIDES}`;

  const dots = document.querySelectorAll(".slide-dot");
  dots.forEach((dot, idx) => {
    if (idx + 1 === currentSlideIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });

  if (prevSlideBtn) prevSlideBtn.disabled = currentSlideIndex === 1;
  if (nextSlideBtn) nextSlideBtn.disabled = currentSlideIndex === TOTAL_SLIDES;
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
   Feedback Modal
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
  showToast("Thank you! Your suggestions were submitted to Nainika, Namita, and Nagaraj.");
}

/* ==========================================================================
   Theme & Data Reset
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

function resetPatientsData() {
  if (confirm("Reset clinic records to initial factory seed data?")) {
    patients = [...INITIAL_PATIENTS];
    users = [...INITIAL_USERS];
    currentUser = null;
    savePatients();
    saveUsers();
    saveSession();
    renderApp();
    showToast("Data restored to factory clinic defaults.");
  }
}

/* ==========================================================================
   Event Listeners Setup
   ========================================================================== */

function setupEventListeners() {
  // Theme Toggle
  if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);

  // Mobile Menu
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
      mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);
      navLinks.classList.toggle("mobile-open");
    });
  }

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      if (navLinks) navLinks.classList.remove("mobile-open");
      if (mobileMenuBtn) mobileMenuBtn.setAttribute("aria-expanded", "false");
    });
  });

  // Hero Patient Sign Up button
  if (heroSignupBtn) {
    heroSignupBtn.addEventListener("click", () => openAuthModal("signup"));
  }

  // Auth Modal Tab Buttons
  if (authLoginTabBtn) {
    authLoginTabBtn.addEventListener("click", () => openAuthModal("login"));
  }
  if (authSignupTabBtn) {
    authSignupTabBtn.addEventListener("click", () => openAuthModal("signup"));
  }
  if (authCloseBtn) authCloseBtn.addEventListener("click", closeAuthModal);
  if (authModal) {
    authModal.addEventListener("click", (e) => {
      if (e.target === authModal) closeAuthModal();
    });
  }

  // Quick 1-Click Login buttons
  if (quickAdminLoginBtn) {
    quickAdminLoginBtn.addEventListener("click", () => quickLoginAs("admin"));
  }
  if (quickPatientLoginBtn) {
    quickPatientLoginBtn.addEventListener("click", () => quickLoginAs("patient"));
  }

  // Switch Links inside auth modal
  if (switchToSignupLink) {
    switchToSignupLink.addEventListener("click", () => openAuthModal("signup"));
  }
  if (switchToLoginLink) {
    switchToLoginLink.addEventListener("click", () => openAuthModal("login"));
  }

  // Form Submissions
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const pass = document.getElementById("loginPassword").value;
      login(email, pass);
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", handlePatientSignup);
  }

  if (patientProfileEditForm) {
    patientProfileEditForm.addEventListener("submit", handlePatientProfileUpdate);
  }

  if (exportBackupBtn) {
    exportBackupBtn.addEventListener("click", exportSystemBackup);
  }

  // Search Input
  if (patientSearchInput) {
    patientSearchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value;
      renderPatientTable();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener("click", () => {
      patientSearchInput.value = "";
      currentSearch = "";
      renderPatientTable();
      patientSearchInput.focus();
    });
  }

  // Filter Pills
  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      filterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentFilter = pill.getAttribute("data-filter");
      renderPatientTable();
    });
  });

  // Staff Patient Intake Form
  if (newPatientForm) {
    newPatientForm.addEventListener("submit", handleStaffIntake);
  }

  // Reset Demo
  if (resetDemoBtn) resetDemoBtn.addEventListener("click", resetPatientsData);

  // Patient Detail Modal
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closePatientModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener("click", closePatientModal);
  if (modalUpdateBtn) modalUpdateBtn.addEventListener("click", handleAddVisitNote);
  if (patientModal) {
    patientModal.addEventListener("click", (e) => {
      if (e.target === patientModal) closePatientModal();
    });
  }

  // Presentation Mode
  if (presentationModeBtn) presentationModeBtn.addEventListener("click", openSlideViewer);
  if (presCloseBtn) presCloseBtn.addEventListener("click", closeSlideViewer);
  if (prevSlideBtn) prevSlideBtn.addEventListener("click", () => goToSlide(currentSlideIndex - 1));
  if (nextSlideBtn) nextSlideBtn.addEventListener("click", () => goToSlide(currentSlideIndex + 1));
  if (slideViewerModal) {
    slideViewerModal.addEventListener("click", (e) => {
      if (e.target === slideViewerModal) closeSlideViewer();
    });
  }

  // Feedback Modal
  if (openFeedbackFooterLink) openFeedbackFooterLink.addEventListener("click", openFeedback);
  if (feedbackCloseBtn) feedbackCloseBtn.addEventListener("click", closeFeedback);
  if (feedbackCancelBtn) feedbackCancelBtn.addEventListener("click", closeFeedback);
  if (feedbackForm) feedbackForm.addEventListener("submit", handleFeedbackSubmit);
  if (feedbackModal) {
    feedbackModal.addEventListener("click", (e) => {
      if (e.target === feedbackModal) closeFeedback();
    });
  }

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (slideViewerModal && slideViewerModal.classList.contains("open")) {
      if (e.key === "ArrowLeft") goToSlide(currentSlideIndex - 1);
      if (e.key === "ArrowRight") goToSlide(currentSlideIndex + 1);
      if (e.key === "Escape") closeSlideViewer();
    } else if (patientModal && patientModal.classList.contains("open")) {
      if (e.key === "Escape") closePatientModal();
    } else if (authModal && authModal.classList.contains("open")) {
      if (e.key === "Escape") closeAuthModal();
    } else if (feedbackModal && feedbackModal.classList.contains("open")) {
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
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>🔔</span> <span>${escapeHtml(message)}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.25s ease-out";
    setTimeout(() => toast.remove(), 250);
  }, 3400);
}
