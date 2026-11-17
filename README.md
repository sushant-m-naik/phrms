# Patient Health Record Management System (PHRMS)

> **"Store. Search. Protect."**  
> *"Know Your Health, Protect Your Future."*  
> **Authors:** Nainika • Namita • Nagaraj

---

## 🌟 Overview

A static, ultra-fast, and lightweight web application built directly from the **Patient Health Record Management System** plan.

This website serves both as:
1. **An Interactive Clinic Showcase**: Demonstrating the problem, 5 solution pillars, core features, 4-step workflow loop, security model, and future roadmap.
2. **A Live In-Browser Prototype**: An interactive demo allowing visitors to search patient records, register new patients, view clinical encounter notes, and test medication reminders using client-side `localStorage`.
3. **An Embedded Slide Presentation Mode**: Click **"Slides"** in the top navigation or press the arrow keys to review the 9 slides from the original deck.

---

## ⚡ Highlights & Performance

- **Zero External Dependencies**: Pure HTML5, modern CSS3, and vanilla JavaScript. No heavy npm modules, build chains, or third-party tracking scripts.
- **Instant Load Time**: Loads in milliseconds with minimal bandwidth overhead.
- **Responsive & Accessible**: Fully adaptive across mobile phones, tablets, laptops, and desktop screens.
- **Dark / Light Mode**: Built-in toggle with automatic system preference detection.
- **Interactive Simulator**:
  - Live search by patient name, unique ID (e.g. `P-101`), diagnosis, or allergies.
  - New patient registration with automatic ID generation.
  - Clinical encounter log updater with timestamped doctor notes.
  - Daily medicine reminder tracker with administered dose acknowledgments.
  - Suggestion box for clinic stakeholder feedback.

---

## 📂 Project Structure

```text
sj/
├── index.html     # Semantic, accessible HTML5 structure & slide deck markup
├── style.css      # Modern responsive styling, color palette & theme variables
├── app.js         # Interactive demo simulator, state management & slide carousel
└── README.md      # Documentation and deployment guide
```

---

## 🚀 How to Run

Because this is a completely static lightweight website, you can view it immediately using any of the following methods:

### Method 1: Direct File Opening
Double-click `index.html` or drag it into any web browser (Chrome, Edge, Firefox, Safari).

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
