/** portals/client/ClientPortal.jsx */
import { useState } from "react";
import { Wrench, User, Phone, Mail, ArrowLeft, Car, Eye, EyeOff } from "lucide-react";
import { ClientSidebar } from "./components/ClientSidebar.jsx";
import { Topbar } from "../../components/layout/Topbar.jsx";
import { ToastContainer } from "../../components/ui/Toast.jsx";
import { ClientDashboard } from "./pages/ClientDashboard.jsx";
import { ClientHistory } from "./pages/ClientHistory.jsx";
import { ClientProfile } from "./pages/ClientProfile.jsx";
import { useToast } from "../../hooks/useToast.js";

const TITLES = {
  dashboard: "Dashboard",
  history:   "My Requests",
  profile:   "My Profile",
};

function ClientAuthGate({ onEnter, onBackToSite }) {
  const [mode, setMode]         = useState(null); // null | "login" | "create"
  const [name, setName]         = useState("");
  const [phone, setPhone]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const submit = () => {
    setError("");
    if (mode === "create" && !name.trim()) { setError("Please enter your name."); return; }
    if (!phone.trim()) { setError("Please enter your phone number."); return; }
    if (!password.trim()) { setError("Please enter a password."); return; }
    setLoading(true);
    setTimeout(() => {
      const user = {
        id: "u_" + Date.now(),
        name: name.trim() || phone.trim(),
        phone: phone.trim(),
        role: "CLIENT",
      };
      localStorage.setItem("rc_user", JSON.stringify(user));
      onEnter(user);
    }, 700);
  };

  // ── Landing choice ──
  if (!mode) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
      <button onClick={onBackToSite} className="absolute top-5 left-5 flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
        <ArrowLeft size={15} /> Back to site
      </button>

      <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center mb-6">
        <Car size={22} className="text-slate-900" />
      </div>
      <h1 className="text-white font-bold text-2xl mb-1">Client Portal</h1>
      <p className="text-slate-400 text-sm mb-8">Roadside assistance, 24/7</p>

      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={() => setMode("create")}
          className="w-full py-3.5 rounded-2xl bg-amber-400 text-slate-900 font-bold text-sm hover:bg-amber-300 transition-colors"
        >
          Create Account
        </button>
        <button
          onClick={() => setMode("login")}
          className="w-full py-3.5 rounded-2xl border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  );

  // ── Form ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
      <button onClick={() => { setMode(null); setError(""); }} className="absolute top-5 left-5 flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="w-full max-w-xs">
        <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center mb-6 mx-auto">
          <Car size={22} className="text-slate-900" />
        </div>
        <h2 className="text-white font-bold text-xl text-center mb-1">
          {mode === "create" ? "Create your account" : "Welcome back"}
        </h2>
        <p className="text-slate-400 text-sm text-center mb-6">
          {mode === "create" ? "Fill in your details to get started" : "Sign in to your account"}
        </p>

        <div className="space-y-3">
          {mode === "create" && (
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full name"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
              />
            </div>
          )}

          <div className="relative">
            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Phone number"
              type="tel"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
            />
          </div>

          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              type={showPass ? "text" : "password"}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-500 rounded-xl pl-10 pr-10 py-3 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
            />
            <button onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {error && <p className="text-red-400 text-xs px-1">{error}</p>}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-amber-400 text-slate-900 font-bold text-sm hover:bg-amber-300 transition-colors disabled:opacity-60 mt-1"
          >
            {loading ? "Loading…" : mode === "create" ? "Create Account" : "Sign In"}
          </button>
        </div>

        <p className="text-slate-500 text-xs text-center mt-5">
          {mode === "create" ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => { setMode(mode === "create" ? "login" : "create"); setError(""); }}
            className="text-amber-400 hover:text-amber-300 font-semibold"
          >
            {mode === "create" ? "Sign In" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}

export function ClientPortal({ onBackToSite }) {
  const [user, setUser]           = useState(null);
  const [page, setPage]           = useState("dashboard");
  const [sidebarOpen, setSidebar] = useState(false);
  const { toasts, toast, dismiss } = useToast();

  if (!user) return <ClientAuthGate onEnter={setUser} onBackToSite={onBackToSite} />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ClientSidebar
        page={page}
        onNav={setPage}
        onBackToSite={onBackToSite}
        open={sidebarOpen}
        onClose={() => setSidebar(false)}
        user={user}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          title={TITLES[page] || "Client"}
          user={user}
          notifs={[]}
          onToggleSidebar={() => setSidebar(v => !v)}
          onNav={setPage}
          onClearNotifs={() => {}}
          avatarColor="amber"
        />
        <main className="flex-1 overflow-y-auto">
          {page === "dashboard" && <ClientDashboard onToast={toast} user={user} />}
          {page === "history"   && <ClientHistory   onToast={toast} />}
          {page === "profile"   && <ClientProfile   user={user} onToast={toast} onLogout={() => setUser(null)} />}
        </main>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
