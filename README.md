# Patient Health Record Management System (PHRMS)

> **"Store. Search. Protect."**  
> *"Know Your Health, Protect Your Future."*  
> **Authors:** Nainika • Namita • Nagaraj

---

## 🌟 Overview

A static, ultra-fast, and lightweight web application built directly from the **Patient Health Record Management System** plan.

This system features a full **Role-Based Access Control (RBAC)** architecture supporting:
1. **Patient Self-Registration & Personal Health Portal**: Patients can register themselves, manage their personal contact info, view their diagnosis and doctor visit notes, check prescribed medications, and track daily dosages.
2. **Clinic Administrator (Full Access)**: Complete clinical oversight across all patients, staff walk-in intake, visit note recording, clinic-wide medication schedules, user account audits, and encrypted JSON database backup.
3. **Guest / Public Demonstration**: Interactive showcase of the problem, 5 solution pillars, core features, 4-step workflow loop, security architecture, and future roadmap.
4. **Embedded Slide Presentation Mode**: Click **"Slides"** in the navigation bar or use arrow keys (`←` / `→`) to present all 9 slides from the deck.

---

## 🔐 Authentication & Roles

### 1. Pre-Configured Test Accounts (1-Click Login)
You can log in instantly using the quick buttons in the modal or using these credentials:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Clinic Admin** | `admin@phrms.clinic` | `admin123` | **Full Authority**: View all records, add doctor notes, staff intake, user directory, export backups |
| **Patient Demo** | `eleanor@gmail.com` | `patient123` | **Private Access**: View own record (`P-101`), medicine reminders, appointments, edit personal profile |

### 2. Patient Self-Registration
- Click **"Patient Self-Register"** on the hero banner or navbar.
- Fill out full name, email, password, age, gender, phone, known allergies, and primary health concern.
- The system automatically:
  - Generates a unique Health Record ID (e.g. `P-106`).
  - Sets up the patient dossier.
  - Links the new user account and immediately opens their **Personal Health Portal**.

---

## ⚡ Highlights & Performance

- **Zero External Dependencies**: Pure HTML5, modern CSS3, and vanilla JavaScript. No heavy npm modules, build chains, or third-party tracking scripts.
- **Instant Load Time**: Loads in milliseconds with minimal bandwidth overhead.
- **Responsive & Accessible**: Fully adaptive across mobile phones, tablets, laptops, and desktop screens.
- **Dark / Light Mode**: Built-in toggle with automatic system preference detection.
- **Interactive Simulator**:
  - Live search by patient name, unique ID (e.g. `P-101`), diagnosis, or allergies.
  - Patient self-registration with automated ID assignment.
  - Clinical encounter log updater with timestamped doctor notes.
  - Daily medicine reminder tracker with administered dose acknowledgments.
  - Admin cloud backup exporter (1-click JSON snapshot).
  - Suggestion box for clinic stakeholder feedback.

---

## 📂 Project Structure

```text
sj/
├── index.html     # Semantic, accessible HTML5 structure, Auth modal & slide deck
├── style.css      # Modern responsive styling, color palette & theme variables
├── app.js         # Interactive demo simulator, RBAC state management & slide carousel
└── README.md      # Documentation and deployment guide
```

---

## 🚀 How to Run

Because this is a completely static lightweight website, you can view it immediately using any of the following methods:

### Method 1: Direct File Opening
Double-click [`index.html`](file:///c:/Users/Lenovo/Downloads/sj/index.html) or drag it into any web browser (Chrome, Edge, Firefox, Safari).

### Method 2: Local HTTP Server (Python)
If you prefer running a local development server:
```powershell
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

### Method 3: Instant Deployment
Deploy for free in seconds to:
- **GitHub Pages**: Push this directory to a GitHub repo and enable Pages in repository settings.
- **Netlify / Vercel**: Drag and drop this folder onto the Netlify or Vercel dashboard.

---

## 🏥 Key Concepts from the Plan

| Section | Key Takeaway |
| :--- | :--- |
| **The Problem** | Paper records are hard to manage, slow to find, easy to lose, cause missed appointments, and lead to forgotten medicines. |
| **Our Solution** | **Store** (unified digital place), **Search** (instant retrieval), **Protect** (role-based login), **Appointments** (automatic notifications), **Medicine Reminders** (timely dosage schedule). |
| **Main Features** | Patient Details, Medical History, Visit Records, Search & Update, Role-based Login & Access. |
| **How It Works** | 1. Register &rarr; 2. Save Record &rarr; 3. Search &rarr; 4. Update *(Steps 3 &amp; 4 repeat continuously at every visit)*. |
| **Security & Privacy** | Authorized user logins, confidentiality by design, least-privilege access, and automated record backups. |
| **Future Improvements** | Dedicated patient/doctor portals, self-service online booking, digital lab reports/e-prescriptions, cloud replication. |
| **Ultimate Goal** | **"One connected, paperless clinic."** |

---

&copy; 2026 Patient Health Record Management System. Built for modern, connected clinics.
