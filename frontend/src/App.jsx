/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────
 * Root router — controls which portal is shown.
 * No authentication gate. All portals are directly accessible.
 *
 * TO ADD AUTH when backend is ready:
 *   - Wrap each portal with an auth check
 *   - Read the user role from the JWT token
 *   - Redirect to correct portal based on role
 * ─────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { LandingPage } from "./portals/landing/LandingPage.jsx";
import { ClientPortal } from "./portals/client/ClientPortal.jsx";
import { TechPortal } from "./portals/technician/TechPortal.jsx";
import { AdminPortal } from "./portals/admin/AdminPortal.jsx";

export default function App() {
  const [view, setView] = useState("landing"); // "landing" | "client" | "technician" | "admin"

  const goBack = () => setView("landing");

  if (view === "client")     return <ClientPortal     onBackToSite={goBack} />;
  if (view === "technician") return <TechPortal       onBackToSite={goBack} />;
  if (view === "admin")      return <AdminPortal      onBackToSite={goBack} />;

  return (
    <LandingPage
      onClientEnter={() => setView("client")}
      onTechEnter={() => setView("technician")}
      onAdminEnter={() => setView("admin")}
    />
  );
}
