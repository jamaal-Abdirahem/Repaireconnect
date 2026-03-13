/** portals/technician/TechPortal.jsx */
import { useState, useCallback } from "react";
import { Wrench, Phone, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { TechSidebar } from "./components/TechSidebar.jsx";
import { Topbar } from "../../components/layout/Topbar.jsx";
import { ToastContainer } from "../../components/ui/Toast.jsx";
import { TechDashboard } from "./pages/TechDashboard.jsx";
import { TechRequests } from "./pages/TechRequests.jsx";
import { TechJobPage } from "./pages/TechJobPage.jsx";
import { TechHistory } from "./pages/TechHistory.jsx";
import { TechProfile } from "./pages/TechProfile.jsx";
import { useToast } from "../../hooks/useToast.js";
import { getTechnicianRequests } from "../../api/requests.js";
import { usePolling } from "../../hooks/usePolling.js";

const TITLES = {
  dashboard: "Dashboard",
  requests:  "My Jobs",
  job:       "Current Job",
  history:   "Job History",
  profile:   "My Profile",
};

function TechAuthGate({ onEnter, onBackToSite }) {
  const [phone, setPhone]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const submit = () => {
    setError("");
    if (!phone.trim()) { setError("Please enter your phone number."); return; }
    if (!password.trim()) { setError("Please enter your password."); return; }
    setLoading(true);
    setTimeout(() => {
      // Use Roger Curtis as the demo technician regardless of what was typed
      const user = {
        id: "u003",
        name: phone.trim(),
        phone: phone.trim(),
        role: "TECHNICIAN",
      };
      localStorage.setItem("rc_user", JSON.stringify(user));
      onEnter(user);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
      <button onClick={onBackToSite} className="absolute top-5 left-5 flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
        <ArrowLeft size={15} /> Back to site
      </button>

      <div className="w-full max-w-xs">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center mb-6 mx-auto">
          <Wrench size={20} className="text-white" />
        </div>
        <h2 className="text-white font-bold text-xl text-center mb-1">Technician Portal</h2>
        <p className="text-slate-400 text-sm text-center mb-6">Sign in to your technician account</p>

        <div className="space-y-3">
          <div className="relative">
            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Phone number"
              type="tel"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
            />
          </div>

          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              type={showPass ? "text" : "password"}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-500 rounded-xl pl-10 pr-10 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
            />
            <button onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {error && <p className="text-red-400 text-xs px-1">{error}</p>}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-60 mt-1"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>

        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
          <p className="text-slate-400 text-xs text-center">
            Demo mode — enter any phone and password to sign in
          </p>
        </div>
      </div>
    </div>
  );
}

export function TechPortal({ onBackToSite }) {
  const [user, setUser]           = useState(null);
  const [page, setPage]           = useState("dashboard");
  const [activeJobId, setJobId]   = useState(null);
  const [sidebarOpen, setSidebar] = useState(false);
  const [requests, setRequests]   = useState([]);
  const { toasts, toast, dismiss } = useToast();

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    localStorage.setItem("rc_user", JSON.stringify({ ...user, id: "u003" }));
    try {
      const data = await getTechnicianRequests();
      setRequests(data);
      const active = data.find(r => ["ASSIGNED", "IN_PROGRESS", "COMPLETED"].includes(r.status));
      if (active && !activeJobId) setJobId(active.id);
    } catch {
      // silent
    }
  }, [user, activeJobId]);

  usePolling(fetchRequests, 8_000, !!user);

  const openJob = (id) => { setJobId(id); setPage("job"); };
  const handleLogout = () => { setUser(null); setPage("dashboard"); setRequests([]); setJobId(null); };

  if (!user) return <TechAuthGate onEnter={setUser} onBackToSite={onBackToSite} />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <TechSidebar
        page={page}
        onNav={setPage}
        onBackToSite={onBackToSite}
        open={sidebarOpen}
        onClose={() => setSidebar(false)}
        user={user}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          title={TITLES[page] || "Technician"}
          user={user}
          notifs={[]}
          onToggleSidebar={() => setSidebar(v => !v)}
          onNav={setPage}
          onClearNotifs={() => {}}
          showBack={page === "job"}
          onBack={() => setPage("requests")}
          avatarColor="emerald"
        />
        <main className="flex-1 overflow-y-auto">
          {page === "dashboard" && (
            <TechDashboard requests={requests} onRefresh={fetchRequests} onNav={setPage} onOpenJob={openJob} onToast={toast} user={user} />
          )}
          {page === "requests" && <TechRequests requests={requests} onOpenJob={openJob} />}
          {page === "job" && <TechJobPage jobId={activeJobId} onToast={toast} onDone={() => setPage("dashboard")} />}
          {page === "history"  && <TechHistory  requests={requests} />}
          {page === "profile"  && <TechProfile  user={user} onLogout={handleLogout} />}
        </main>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
