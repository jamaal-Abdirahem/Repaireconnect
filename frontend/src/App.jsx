import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Redux
import { hydrateAuth } from "./store/slices/authSlice.js";

// Portals
import { LandingPage } from "./portals/landing/LandingPage.jsx";
import { GenericPage } from "./portals/landing/GenericPage.jsx";
import { ClientPortal } from "./portals/client/ClientPortal.jsx";
import { TechPortal } from "./portals/technician/TechPortal.jsx";
import { AdminPortal } from "./portals/admin/AdminPortal.jsx";

export default function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-surface-950 text-white">Loading App...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Marketing Pages */}
        <Route path="/features" element={<GenericPage />} />
        <Route path="/pricing" element={<GenericPage />} />
        <Route path="/coverage" element={<GenericPage />} />
        <Route path="/about" element={<GenericPage />} />
        <Route path="/careers" element={<GenericPage />} />
        <Route path="/contact" element={<GenericPage />} />
        <Route path="/privacy" element={<GenericPage />} />
        <Route path="/terms" element={<GenericPage />} />

        {/* Portals handle their own AuthGates */}
        <Route path="/client/*" element={<ClientPortal />} />
        
        <Route path="/technician/*" element={<TechPortal />} />
        
        <Route path="/admin/*" element={<AdminPortal />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
