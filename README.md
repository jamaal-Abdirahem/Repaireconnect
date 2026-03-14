# RepairConnect 🚗🔧

**Product Requirements Document (PRD) & Official Documentation**

## 1. Executive Summary
**RepairConnect** is a modern, on-demand roadside assistance platform designed to connect stranded drivers with certified, available mechanics in real-time. By providing a transparent, three-sided marketplace (Clients, Technicians, Administrators), RepairConnect transforms the stressful experience of a vehicle breakdown into a seamless, trackable, and safe process.

---

## 2. Problem Statement
* **For Drivers:** Breaking down is highly stressful. Traditional roadside assistance involves long wait times, lack of transparency regarding technician arrival, and unpredictable pricing.
* **For Mechanics:** Independent technicians struggle with dispatch efficiency, finding consistent jobs, and managing trusted payment workflows.
* **For Operators/Admins:** Dispatching the right mechanic to the right location manually is inefficient and prone to human error.

---

## 3. Product Vision & Solution
The platform functions like "Uber for Mechanics," providing real-time location mapping, direct job assignment, step-by-step progress tracking, and integrated payments. 

The ecosystem is divided into **Three Portals**:
1. **Client Portal:** For drivers to report issues, track their mechanic, and pay.
2. **Technician Portal:** For mechanics to receive jobs, navigate to clients, submit estimates, and update statuses.
3. **Admin/Staff Portal:** For platform operators to monitor all ongoing jobs, review financials, and manage users.

---

## 4. User Personas & Key Journeys

### Persona 1: The Stranded Driver (Client)
* **Profile:** Needs immediate help. High stress. Using a mobile device.
* **Key Journey:**
  1. Signs up / Logs in via mobile.
  2. Submits a location, vehicle details, and the apparent problem.
  3. Tracks the assigned technician's approach on a map.
  4. Reviews and approves the pricing estimate.
  5. Pays securely once the job is completed.

### Persona 2: The Service Auto-Technician (Mechanic)
* **Profile:** On the road, needs quick information, uses the app between jobs.
* **Key Journey:**
  1. Toggles "Available" status to receive requests.
  2. Accepts incoming jobs with details (location, issue).
  3. Marks "Arrived" upon reaching the driver.
  4. Inspects the vehicle and submits a repair estimate.
  5. Performs the work upon approval and marks the job as "Complete."

### Persona 3: Platform Administrator (Dispatcher/Operator)
* **Profile:** Sitting at a desk, needs a macro view of platform health.
* **Key Journey:**
  1. Views the global map of active requests and technician locations.
  2. Manually assigns/re-assigns jobs if the automated system needs overrides.
  3. Reviews financial dashboards, total requests, and system analytics.
  4. Manages the roster of registered technicians and clients.

---

## 5. Core Features & Scope

### Global Features
* **Role-Based Access Control (RBAC):** Secure routing based on user type.
* **Real-Time Job Tracker:** Shared state tracking: `REPORTED` ➔ `ASSIGNED` ➔ `ARRIVED` ➔ `ESTIMATED` ➔ `APPROVED` ➔ `IN_PROGRESS` ➔ `COMPLETED` ➔ `PAID`.
* **Responsive Design:** Mobile-first approach for clients and technicians, desktop-optimized for admins.

### Client Portal
* **New Request Form:** Intuitive submission with problem categorization.
* **Live Job View:** Status progress bar, technician profile, and map.
* **History:** Historic overview of past services.

### Technician Portal
* **Incoming Ping:** Notification/Alert for new job assignments.
* **Job Control Panel:** Status updater and estimate entry.
* **Stats Dashboard:** Earnings and completed job metrics.

### Admin Portal
* **Command Center:** Grid statistics for Total Requests, Active Jobs, and Available Techs.
* **Interactive Map:** Live tracking of all nodes (clients and mechanics).
* **Financials:** Revenue tracking, top earners, and client spending history.
* **User Management:** Onboarding and suspending technicians.

---

## 6. Technical Architecture & Stack

### Frontend Subsystem
* **Framework:** React 18, Vite
* **Styling:** Tailwind CSS, PostCSS
* **UI Components:** Customized Shadcn-like components (Lucide React for icons)
* **Mapping:** `react-leaflet` & `leaflet` for interactive maps
* **State Management:** `@reduxjs/toolkit` and `react-redux` (Authentication & Session)
* **Routing:** `react-router-dom`

### API Architecture (Mock / Ready for Production)
* Currently driven by an internal mock backend (`src/api/mockData.js`) allowing immediate demo capability without backend dependencies.
* The `src/api/client.js` is fully structured to swap out mock latency for real `fetch`/`axios` REST calls using a simple `MOCK_MODE` toggle.

---

## 7. Future Roadmap / v2.0 Scope
* **Backend Integration:** Replace the mock adapter with a Node.js/Express or NextJS API connected to PostgreSQL/MongoDB.
* **Socket Connections:** Implement WebSocket (e.g., Socket.io) for genuine real-time location mapping instead of manual/interval polling.
* **Real Payment Gateway:** Integrate Stripe or PayPal API for actual credit card captures.
* **Algorithmic Dispatching:** Automated closest-driver assignment using geospatial algorithms.

---

## 8. Directory Structure
```text
repair-connect/
├── frontend/
│   ├── public/              # Static assets & branding (logo.png)
│   ├── src/
│   │   ├── api/             # Mock DB, REST handlers, Auth flow
│   │   ├── components/      # Reusable UI (Cards, Badges, Modals, Topbar)
│   │   ├── hooks/           # Custom hooks (e.g. usePolling, useToast)
│   │   ├── portals/         # The 3 core applications
│   │   │   ├── admin/       # Dispatch, Financials, Tech management
│   │   │   ├── client/      # Request creation, Job live-tracking
│   │   │   ├── landing/     # Marketing site and entry point
│   │   │   └── technician/  # Job accept/decline, Status updates
│   │   ├── store/           # Redux setup
│   │   └── utils/           # Formatters, Constants (statuses)
│   ├── index.html           # Meta & Favicon
│   └── package.json         # Dependencies
└── next-app/                # Reserved for backend/SSR future expansion
```

---

## 9. Setup & Development Guide

### Prerequisites
* Node.js (v16+)
* npm or yarn

### Installation
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```
2. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
3. **Install Dependencies:**
   ```bash
   npm install
   ```
4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
5. **Access the application** at `http://localhost:5173`

### Demo Credentials (Mock Setup)
Because the app runs a mock simulated database, you can test all sides of the marketplace:
* **Client Login:** Choose "Sign In" from the Client Portal with Phone: `555-0001`, Password: `password` (or just create a new fictional account on the spot).
* **Technician Login:** Navigate to Tech Portal, use Phone: `555-1001`, Password: `password`.
* **Admin Login:** Navigate to Admin Portal via footer link (Staff Portal), use Phone: `admin`, Password: `admin`.

---

*Built for drivers, designed for efficiency. Welcome to the future of roadside assistance.*
