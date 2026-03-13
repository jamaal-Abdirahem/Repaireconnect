# RepairConnect — Frontend

Roadside assistance platform. Three-portal frontend (Client, Technician, Admin) built with React + Vite + Tailwind CSS. Fully functional demo with mock data. Designed to plug into a real backend with a single config change.

---

## Project Structure

```
repairconnect/
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── App.jsx                         ← Root router
        ├── main.jsx
        ├── index.css
        │
        ├── api/                            ← All API calls live here
        │   ├── client.js                   ← Base HTTP client + MOCK_MODE flag
        │   ├── auth.js                     ← Login, register, logout
        │   ├── requests.js                 ← Full request lifecycle
        │   ├── users.js                    ← Users and technicians
        │   └── mockData.js                 ← In-memory mock database (demo only)
        │
        ├── components/
        │   ├── layout/
        │   │   ├── SidebarShell.jsx        ← Reusable sidebar wrapper
        │   │   └── Topbar.jsx              ← Top navigation bar
        │   └── ui/
        │       ├── Avatar.jsx              ← User avatar with initials
        │       ├── Badge.jsx               ← Generic label badge
        │       ├── StatusBadge.jsx         ← Request status badge
        │       ├── InputField.jsx          ← Form input with icon
        │       ├── JobTracker.jsx          ← Step-by-step progress tracker
        │       └── Toast.jsx               ← Notification toasts
        │
        ├── hooks/
        │   ├── usePolling.js               ← Auto-refresh on interval
        │   └── useToast.js                 ← Toast state management
        │
        ├── utils/
        │   ├── constants.js                ← Roles, statuses, tracker steps
        │   └── helpers.js                  ← cls(), formatDate(), shortId(), initials()
        │
        └── portals/
            ├── landing/
            │   └── LandingPage.jsx         ← Public homepage
            │
            ├── client/
            │   ├── ClientPortal.jsx        ← Portal root + layout
            │   ├── components/
            │   │   ├── ClientSidebar.jsx
            │   │   ├── NewRequestForm.jsx   ← Submit a new request
            │   │   └── ClientJobView.jsx    ← Track active job + approve + pay
            │   └── pages/
            │       ├── ClientDashboard.jsx
            │       ├── ClientHistory.jsx
            │       └── ClientProfile.jsx
            │
            ├── technician/
            │   ├── TechPortal.jsx          ← Portal root + layout
            │   ├── components/
            │   │   └── TechSidebar.jsx
            │   └── pages/
            │       ├── TechDashboard.jsx   ← Incoming job card + active job actions
            │       ├── TechRequests.jsx    ← All assigned jobs list
            │       ├── TechJobPage.jsx     ← Single job: arrive → complete
            │       ├── TechHistory.jsx
            │       └── TechProfile.jsx
            │
            └── admin/
                ├── AdminPortal.jsx         ← Portal root + layout
                ├── components/
                │   └── AdminSidebar.jsx
                └── pages/
                    ├── AdminDashboard.jsx  ← Stats overview
                    ├── AdminRequests.jsx   ← Assign technicians to requests
                    ├── AdminTechnicians.jsx← Toggle availability
                    └── AdminClients.jsx    ← Client list
```

---

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:3000**

---

## Accessing the Portals

No login is required in demo mode. All portals open directly from the landing page.

| Portal | How to reach | Demo user |
|---|---|---|
| Client | "Get Help Now" or "Sign In" on the landing page | Anonymous |
| Technician | Footer → "Technician login" → modal | Roger Curtis |
| Admin | Footer → "Staff portal" | Admin User |

---

## Demo Walkthrough — Full End-to-End Flow

Open three browser tabs to simulate all three roles at once.

### Step 1 — Client submits a request
1. Open the **Client portal**
2. Click **"Request a Technician"**
3. Fill in name, phone, location, vehicle, problem type
4. Click **Submit Request**
5. Dashboard now shows the request with status **REPORTED** and the live job tracker

### Step 2 — Admin assigns a technician
1. Open the **Admin portal**
2. Go to **Requests** — the new request appears with a yellow "Reported" badge
3. Click on the request → click **"Assign Technician"**
4. Select a technician from the dropdown → confirm
5. Request status updates to **ASSIGNED**

### Step 3 — Technician accepts the job
1. Open the **Technician portal** (Roger Curtis)
2. Dashboard shows an orange **"New Job Request"** notification card
3. Review client name, location, phone, and problem
4. Click **Accept Job** — status updates to **IN_PROGRESS**
5. Or click **Decline** to remove it from view

### Step 4 — Technician completes the work
1. On the technician dashboard the job card turns dark with "In Progress" state
2. The job tracker shows current position in the flow
3. After completing the repair, click **"Mark Job as Complete"**
4. Confirm the dialog → status updates to **COMPLETED**

### Step 5 — Client approves and pays
1. Back in the **Client portal**, the dashboard shows **"Work completed!"**
2. Click **"Approve Completed Work"**
3. Enter the agreed payment amount
4. Click **Pay** → confirm → status updates to **PAID**
5. Both portals show the job as fully closed

---

## Request Status Lifecycle

```
REPORTED → ASSIGNED → IN_PROGRESS → COMPLETED → PAID
```

| Status | Meaning | Who triggers it |
|---|---|---|
| REPORTED | Client submitted, not yet assigned | Client |
| ASSIGNED | Technician assigned, heading to location | Admin |
| IN_PROGRESS | Technician accepted and is on-site | Technician |
| COMPLETED | Work finished, awaiting client approval | Technician |
| PAID | Client approved and paid | Client |

---

## Mock Data

All demo data lives in `src/api/mockData.js`. Edit this file to change the demo state.

### Default users

| Name | Role | ID |
|---|---|---|
| Jane Smith | CLIENT | u001 |
| David Park | CLIENT | u002 |
| Roger Curtis | TECHNICIAN | u003 (t001) |
| Maria Santos | TECHNICIAN | u004 (t002) |
| James Okafor | TECHNICIAN | u005 (t003) |
| Admin User | ADMIN | u006 |

### Default requests on startup

| ID | Client | Problem | Status | Assigned to |
|---|---|---|---|---|
| req004 | Sara Ahmed | Battery dead — Ford Focus 2019 | ASSIGNED | Roger Curtis |
| req003 | Jane Smith | Engine overheating — Toyota Camry 2021 | PAID | Roger Curtis |

### Adding more test data
Open `src/api/mockData.js` and add entries to the `MOCK_REQUESTS` array following the same object shape. The `technicianId` must match an `id` in `MOCK_TECHNICIANS` (e.g. `"t001"`).

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| Vite | 5.4 | Build tool and dev server |
| Tailwind CSS | 3.4 | Utility-first styling |
| Lucide React | 0.383 | Icons |
| PostCSS + Autoprefixer | — | CSS processing |

No router library is used. Navigation is handled by React state (`useState`) in each portal root and in `App.jsx`.

---

## Key Patterns

### MOCK_MODE
Every API function in `src/api/` checks `MOCK_MODE` before deciding whether to hit the real backend or return mock data:

```js
// src/api/client.js
export const MOCK_MODE = true; // ← change to false to use real backend
export const BASE_URL  = "http://localhost:5000/api";
```

### usePolling
Portals refresh their data automatically every 8 seconds using the `usePolling` hook:

```js
usePolling(fetchRequests, 8_000, enabled);
```

In mock mode this re-reads from the shared in-memory store, so changes made in one portal are visible in another after the next poll.

### Toast notifications
Every portal uses `useToast` for feedback messages:

```js
const { toasts, toast, dismiss } = useToast();
toast("Message here", "success"); // types: success | error | info | warning
```

---

## Connecting the Real Backend

The frontend is pre-wired to the backend API. To switch from mock to real:

**1. Open `src/api/client.js` and change one line:**
```js
// Before
export const MOCK_MODE = true;

// After
export const MOCK_MODE = false;
```

**2. Make sure `BASE_URL` points to your running backend:**
```js
export const BASE_URL = "http://localhost:5000/api";
```

**3. Add login forms back to each portal.** Currently each portal sets a hardcoded mock user. Replace those constants with real login flows using the functions already available in `src/api/auth.js`:
```js
import { login, logout, getStoredSession } from "../../api/auth.js";
```

**4. Delete `src/api/mockData.js`** — it is no longer needed.

Everything else — API calls, request lifecycle, status updates, role-based filtering — is already wired correctly and will work without any other changes.

---

## Backend API Reference

All endpoints the frontend calls. Base path: `/api`

### Auth
| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/auth/register` | `{ name, phone, password, role }` | Register a new user |
| POST | `/auth/login` | `{ phone, password }` | Login → returns `{ token, user }` |

### Requests
| Method | Endpoint | Body | Who calls it |
|---|---|---|---|
| GET | `/requests` | — | Client (own requests), Admin (all) |
| POST | `/requests` | `{ clientName, phone, location, problem }` | Client |
| GET | `/requests/technician` | — | Technician (assigned to them) |
| GET | `/requests/:id` | — | Any authenticated user |
| POST | `/requests/:id/assign` | `{ technicianId }` | Admin |
| POST | `/requests/:id/arrived` | — | Technician |
| POST | `/requests/:id/complete` | — | Technician |
| POST | `/requests/:id/approve` | — | Client |
| POST | `/requests/:id/pay` | `{ amount }` | Client |

### Users
| Method | Endpoint | Body | Who calls it |
|---|---|---|---|
| GET | `/users/me` | — | Any authenticated user |
| GET | `/users` | — | Admin |
| GET | `/users/technicians` | — | Admin |
| PATCH | `/users/technicians/:id/availability` | `{ available }` | Admin |

### Authentication
All protected endpoints expect a Bearer token in the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```
The token is stored in `localStorage` under the key `rc_token` and is automatically attached by `src/api/client.js`.

---

## Scripts

```bash
npm run dev       # Start dev server on http://localhost:3000
npm run build     # Production build → dist/
npm run preview   # Preview the production build locally
```
