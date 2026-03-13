/** portals/admin/AdminPortal.jsx */
import { useState, useCallback } from "react";
import { Shield, Phone, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { AdminSidebar } from "./components/AdminSidebar.jsx";
import { Topbar } from "../../components/layout/Topbar.jsx";
import { ToastContainer } from "../../components/ui/Toast.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { AdminRequests } from "./pages/AdminRequests.jsx";
import { AdminTechnicians } from "./pages/AdminTechnicians.jsx";
import { AdminClients } from "./pages/AdminClients.jsx";
import { useToast } from "../../hooks/useToast.js";
import { usePolling } from "../../hooks/usePolling.js";
import { getRequests } from "../../api/requests.js";
import { getTechnicians, getAllUsers } from "../../api/users.js";

const TITLES = {
  dashboard:   "Operations Overview",
  requests:    "Service Requests",
  technicians: "Technicians",
  clients:     "Clients",
};

function AdminAuthGate({ onEnter, onBackToSite }) {
  const [phone, setPhone]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const submit = () => {
    setError("");
    if (!phone.trim()) { setError("Please enter your username or phone."); return; }
    if (!password.trim()) { setError("Please enter your password."); return; }
    setLoading(true);
    setTimeout(() => {
      const user = {
        id: "u006",
        name: phone.trim(),
        phone: phone.trim(),
        role: "ADMIN",
      };
      localStorage.setItem("rc_user", JSON.stringify(user));
      onEnter(user);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 flex flex-col items-center justify-center px-4">
      <button onClick={onBackToSite} className="absolute top-5 left-5 flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
        <ArrowLeft size={15} /> Back to site
      </button>

      <div className="w-full max-w-xs">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center mb-6 mx-auto">
          <Shield size={20} className="text-white" />
        </div>
        <h2 className="text-white font-bold text-xl text-center mb-1">Staff Portal</h2>
        <p className="text-slate-400 text-sm text-center mb-6">Admin and operator access only</p>

        <div className="space-y-3">
          <div className="relative">
            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Username or phone"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition"
            />
          </div>

          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              type={showPass ? "text" : "password"}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-500 rounded-xl pl-10 pr-10 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition"
            />
            <button onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {error && <p className="text-red-400 text-xs px-1">{error}</p>}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 transition-colors disabled:opacity-60 mt-1"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>

        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
          <p className="text-slate-400 text-xs text-center">
            Demo mode — enter any credentials to sign in
          </p>
        </div>
      </div>
    </div>
  );
}

export function AdminPortal({ onBackToSite }) {
  const [user, setUser]           = useState(null);
  const [page, setPage]           = useState("dashboard");
  const [sidebarOpen, setSidebar] = useState(false);
  const [requests, setRequests]   = useState([]);
  const [technicians, setTechs]   = useState([]);
  const [users, setUsers]         = useState([]);
  const { toasts, toast, dismiss } = useToast();

  const fetchAll = useCallback(async () => {
    if (!user) return;
    localStorage.setItem("rc_user", JSON.stringify({ ...user, id: "u006" }));
    try {
      const [reqs, techs, allUsers] = await Promise.all([
        getRequests(),
        getTechnicians(),
        getAllUsers(),
      ]);
      setRequests(reqs);
      setTechs(techs);
      setUsers(allUsers);
    } catch {
      // silent
    }
  }, [user]);

  usePolling(fetchAll, 8_000, !!user);

  const handleLogout = () => { setUser(null); setPage("dashboard"); };

  if (!user) return <AdminAuthGate onEnter={setUser} onBackToSite={onBackToSite} />;

  const pendingCount = requests.filter(r => r.status === "REPORTED").length;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar
        page={page}
        onNav={setPage}
        onBackToSite={onBackToSite}
        pendingCount={pendingCount}
        open={sidebarOpen}
        onClose={() => setSidebar(false)}
        user={user}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          title={TITLES[page] || "Admin"}
          user={user}
          notifs={[]}
          onToggleSidebar={() => setSidebar(v => !v)}
          onNav={setPage}
          onClearNotifs={() => {}}
          avatarColor="indigo"
        />
        <main className="flex-1 overflow-y-auto">
          {page === "dashboard"   && <AdminDashboard   requests={requests} technicians={technicians} onNav={setPage} />}
          {page === "requests"    && <AdminRequests    requests={requests} technicians={technicians} onRefresh={fetchAll} onToast={toast} />}
          {page === "technicians" && <AdminTechnicians technicians={technicians} onRefresh={fetchAll} onToast={toast} />}
          {page === "clients"     && <AdminClients     users={users} requests={requests} />}
        </main>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
