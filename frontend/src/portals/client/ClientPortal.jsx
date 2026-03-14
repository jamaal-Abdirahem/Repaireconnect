import { useState, useEffect } from "react";
import { User, Phone, Mail, ArrowLeft, Car, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema } from "../../validations/authSchemas.js";
import { loginUser, clearError, logoutUser } from "../../store/slices/authSlice.js";
import { register } from "../../api/auth.js";
import { ClientSidebar } from "./components/ClientSidebar.jsx";
import { Topbar } from "../../components/layout/Topbar.jsx";
import { ToastContainer } from "../../components/ui/Toast.jsx";
import { ClientDashboard } from "./pages/ClientDashboard.jsx";
import { ClientHistory } from "./pages/ClientHistory.jsx";
import { ClientProfile } from "./pages/ClientProfile.jsx";
import { useToast } from "../../hooks/useToast.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const TITLES = {
  dashboard: "Dashboard",
  history:   "My Requests",
  profile:   "My Profile",
};

function ClientAuthGate() {
  const [mode, setMode] = useState(null); // null | "login" | "create"
  const [showPass, setShowPass] = useState(false);
  const [regError, setRegError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(mode === "create" ? registerSchema : loginSchema),
  });

  // Clear errors when switching modes
  useEffect(() => {
    dispatch(clearError());
    setRegError("");
    reset();
  }, [mode, dispatch, reset]);

  const onSubmit = async (data) => {
    setRegError("");
    if (mode === "login") {
      const result = await dispatch(loginUser({ phone: data.phone, password: data.password }));
      if (loginUser.fulfilled.match(result)) {
        navigate("/client");
      }
    } else {
      try {
        await register({ ...data, role: "CLIENT" });
        // After successful registration, log them in
        const result = await dispatch(loginUser({ phone: data.phone, password: data.password }));
        if (loginUser.fulfilled.match(result)) {
          navigate("/client");
        }
      } catch (err) {
        setRegError(err.message || "Registration failed. Please try a different phone number.");
      }
    }
  };

  // ── Landing choice ──
  if (!mode) return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-brand-500/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1/2 h-[300px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />

      <Button variant="ghost" onClick={() => navigate("/")} className="absolute top-6 left-6 flex items-center gap-2 text-surface-400 hover:text-surface-50 transition-colors z-10">
        <ArrowLeft size={16} /> Back to site
      </Button>

      <img src="/logo.png" alt="RepairConnect Logo" className="w-auto h-28 mb-6 z-10 transform hover:scale-105 transition-transform duration-300" />
      <h1 className="text-surface-50 font-bold text-3xl mb-2 tracking-tight z-10">Client Portal</h1>
      <p className="text-surface-400 text-sm mb-10 font-medium z-10">Roadside assistance, 24/7</p>

      <div className="w-full max-w-sm space-y-4 z-10">
        <Button
          onClick={() => setMode("create")}
          className="w-full bg-brand-500 hover:bg-surface-950 text-surface-50 font-bold transition-all duration-200 shadow-sm hover:-translate-y-1"
          size="lg"
        >
          Create Account
        </Button>
        <Button
          variant="outline"
          onClick={() => setMode("login")}
          className="w-full border-surface-800 bg-surface-900/50 backdrop-blur-sm text-surface-50 hover:bg-surface-800 transition-all duration-200"
          size="lg"
        >
          Sign In
        </Button>
      </div>
    </div>
  );

  // ── Form ──
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
       {/* Decorative gradients */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-brand-500/20 blur-[100px] rounded-full pointer-events-none" />
       
      <Button variant="ghost" onClick={() => setMode(null)} className="absolute top-6 left-6 flex items-center gap-2 text-surface-400 hover:text-surface-50 transition-colors z-10">
        <ArrowLeft size={16} /> Back
      </Button>

      <Card className="w-full max-w-sm bg-surface-900 border-surface-800 shadow-sm z-10">
        <CardHeader className="text-center pb-2">
          <img src="/logo.png" alt="RepairConnect Logo" className="w-auto h-24 mx-auto mb-6 transform hover:scale-105 transition-transform duration-300" />
          <CardTitle className="text-surface-50 font-bold text-2xl tracking-tight">
            {mode === "create" ? "Create your account" : "Welcome back"}
          </CardTitle>
          <CardDescription className="text-surface-400 font-medium">
            {mode === "create" ? "Fill in your details to get started" : "Sign in to your account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {mode === "create" && (
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none" />
                <Input
                  {...formRegister("name")}
                  placeholder="Full name"
                  autoComplete="name"
                  className={`bg-surface-950 border-surface-800 text-surface-50 placeholder-surface-500 pl-11 h-12 rounded-md transition-all duration-200 ${errors.name ? 'border-brand-500/40 focus-visible:ring-brand-500/30' : 'focus-visible:ring-brand-500/20'}`}
                />
                {errors.name && <p className="text-brand-500 text-xs mt-1.5 px-1 font-medium">{errors.name.message}</p>}
              </div>
            )}

            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none" />
              <Input
                {...formRegister("phone")}
                placeholder="Phone number"
                type="tel"
                autoComplete="tel"
                className={`bg-surface-950 border-surface-800 text-surface-50 placeholder-surface-500 pl-11 h-12 rounded-md transition-all duration-200 ${errors.phone ? 'border-brand-500/40 focus-visible:ring-brand-500/30' : 'focus-visible:ring-brand-500/20'}`}
              />
              {errors.phone && <p className="text-brand-500 text-xs mt-1.5 px-1 font-medium">{errors.phone.message}</p>}
            </div>

            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none" />
              <Input
                {...formRegister("password")}
                placeholder="Password"
                type={showPass ? "text" : "password"}
                autoComplete={mode === "create" ? "new-password" : "current-password"}
                className={`bg-surface-950 border-surface-800 text-surface-50 placeholder-surface-500 pl-11 pr-11 h-12 rounded-md transition-all duration-200 ${errors.password ? 'border-brand-500/40 focus-visible:ring-brand-500/30' : 'focus-visible:ring-brand-500/20'}`}
              />
              <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-50 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.password && <p className="text-brand-500 text-xs mt-1.5 px-1 font-medium">{errors.password.message}</p>}
            </div>

            {(error && typeof error === 'string') && (
              <div className="bg-brand-500/10 border border-brand-500/30 rounded-md p-3 text-center">
                <p className="text-brand-500 text-sm font-medium">{error}</p>
              </div>
            )}
            {regError && (
              <div className="bg-brand-500/10 border border-brand-500/30 rounded-md p-3 text-center">
                <p className="text-brand-500 text-sm font-medium">{regError}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-surface-950 text-surface-50 h-12 rounded-md transition-all duration-200 mt-4 shadow-sm hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 text-surface-50" />
                  Processing...
                </>
              ) : mode === "create" ? "Create Account" : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center pb-8 border-t border-surface-800/50 pt-6 mt-2">
          <p className="text-surface-500 text-sm text-center font-medium">
            {mode === "create" ? "Already have an account? " : "Don't have an account? "}
            <button
            onClick={() => setMode(mode === "create" ? "login" : "create")}
              className="text-brand-500 hover:text-brand-400 font-bold transition-colors"
            >
              {mode === "create" ? "Sign In" : "Create one"}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export function ClientPortal() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage]           = useState("dashboard");
  const [sidebarOpen, setSidebar] = useState(false);
  const { toasts, toast, dismiss } = useToast();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  if (!isAuthenticated || !user) return <ClientAuthGate />;

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden font-sans">
      <ClientSidebar
        page={page}
        onNav={setPage}
        onBackToSite={() => navigate("/")}
        onLogout={handleLogout}
        open={sidebarOpen}
        onClose={() => setSidebar(false)}
        user={user}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-surface-50">
        <Topbar
          title={TITLES[page] || "Client"}
          user={user}
          notifs={[]}
          onToggleSidebar={() => setSidebar(v => !v)}
          onNav={setPage}
          onClearNotifs={() => {}}
          avatarColor="brand"
        />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {page === "dashboard" && <ClientDashboard onToast={toast} user={user} />}
          {page === "history"   && <ClientHistory   onToast={toast} />}
          {page === "profile"   && <ClientProfile   user={user} onToast={toast} />}
        </main>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
