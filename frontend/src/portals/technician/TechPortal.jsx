import { useState, useCallback, useEffect } from "react";
import {
  Wrench,
  Phone,
  Mail,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validations/authSchemas.js";
import {
  loginUser,
  clearError,
  logoutUser,
} from "../../store/slices/authSlice.js";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const TITLES = {
  dashboard: "Dashboard",
  requests: "My Jobs",
  job: "Current Job",
  history: "Job History",
  profile: "My Profile",
};

function TechAuthGate() {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    dispatch(clearError());
    reset();
  }, [dispatch, reset]);

  const onSubmit = async (data) => {
    // For demo purposes, we will still mock a login if MOCK_MODE is true in API,
    // but we use the Redux flow.
    const result = await dispatch(
      loginUser({ phone: data.phone, password: data.password }),
    );
    if (loginUser.fulfilled.match(result)) {
      navigate("/technician");
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-brand-500/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1/2 h-[300px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />

      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-surface-400 hover:text-surface-50 transition-colors z-10"
      >
        <ArrowLeft size={16} /> Back to site
      </Button>

      <Card className="w-full max-w-sm bg-[#1A1A18] border-[#2A2A28] shadow-sm z-10">
        <CardHeader className="text-center pb-4">
          <img
            src="/logo.png"
            alt="RepairConnect Logo"
            className="w-auto h-24 mx-auto mb-6 transform hover:scale-105 transition-transform duration-300"
          />
          <CardTitle className="text-surface-50 font-bold text-2xl tracking-tight">
            Technician Portal
          </CardTitle>
          <CardDescription className="text-surface-500 font-medium">
            Sign in to manage your assigned jobs
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none"
              />
              <Input
                {...formRegister("phone")}
                placeholder="Phone number"
                type="tel"
                autoComplete="tel"
                className={`bg-surface-950 border-[#2A2A28] text-surface-50 placeholder-surface-500 pl-11 h-12 rounded-md transition-all duration-200 ${errors.phone ? "border-brand-500/50 focus-visible:ring-brand-500/20" : "focus-visible:ring-brand-500/20"}`}
              />
              {errors.phone && (
                <p className="text-brand-500 text-xs mt-1.5 px-1 font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="relative">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none"
              />
              <Input
                {...formRegister("password")}
                placeholder="Password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                className={`bg-surface-950 border-[#2A2A28] text-surface-50 placeholder-surface-500 pl-11 pr-11 h-12 rounded-md transition-all duration-200 ${errors.password ? "border-brand-500/50 focus-visible:ring-brand-500/20" : "focus-visible:ring-brand-500/20"}`}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-50 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.password && (
                <p className="text-brand-500 text-xs mt-1.5 px-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && typeof error === "string" && (
              <div className="bg-brand-500/10 border border-brand-500/20 rounded-md p-3 text-center">
                <p className="text-brand-500 text-sm font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-[#0D0D0C] text-surface-50 h-12 rounded-md transition-all duration-200 mt-2 shadow-sm hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin text-surface-50 h-4 w-4" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function TechPortal() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState("dashboard");
  const [activeJobId, setJobId] = useState(null);
  const [sidebarOpen, setSidebar] = useState(false);
  const [requests, setRequests] = useState([]);
  const { toasts, toast, dismiss } = useToast();

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getTechnicianRequests();
      setRequests(data);
      const active = data.find((r) =>
        [
          "ASSIGNED",
          "ARRIVED",
          "ESTIMATED",
          "APPROVED",
          "IN_PROGRESS",
          "COMPLETED",
        ].includes(r.status),
      );
      if (active) setJobId((prev) => prev || active.id);
    } catch {
      // silent — will surface errors when backend is real
    }
  }, [user]);

  usePolling(fetchRequests, 8_000, !!user);

  const openJob = (id) => {
    setJobId(id);
    setPage("job");
  };
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  if (!isAuthenticated || !user) return <TechAuthGate />;

  if (user.role !== "TECHNICIAN" && user.role !== "ADMIN") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-surface-950 px-4">
        <div className="w-16 h-16 rounded-none bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6 shadow-glow">
          <Wrench size={24} className="text-brand-500" />
        </div>
        <h2 className="text-surface-50 font-bold text-2xl mb-2 tracking-tight">
          Access Denied
        </h2>
        <p className="text-surface-400 text-sm mb-8 font-medium">
          You must be a registered Technician to view this portal.
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-md bg-surface-800 text-surface-50 hover:bg-surface-700 font-semibold text-sm transition-all shadow-subtle"
          >
            Sign Out
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-md bg-brand-500 text-surface-50 hover:bg-[#0D0D0C] font-semibold text-sm transition-all shadow-sm flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden font-sans">
      <TechSidebar
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
          title={TITLES[page] || "Technician"}
          user={user}
          notifs={[]}
          onToggleSidebar={() => setSidebar((v) => !v)}
          onNav={setPage}
          onClearNotifs={() => {}}
          showBack={page === "job"}
          onBack={() => setPage("requests")}
          avatarColor="brand"
        />
        <main className="flex-1 overflow-y-auto">
          {page === "dashboard" && (
            <TechDashboard
              requests={requests}
              onRefresh={fetchRequests}
              onNav={setPage}
              onOpenJob={openJob}
              onToast={toast}
              user={user}
            />
          )}
          {page === "requests" && (
            <TechRequests requests={requests} onOpenJob={openJob} />
          )}
          {page === "job" && (
            <TechJobPage
              jobId={activeJobId}
              onToast={toast}
              onDone={() => setPage("dashboard")}
            />
          )}
          {page === "history" && <TechHistory requests={requests} />}
          {page === "profile" && (
            <TechProfile user={user} onLogout={handleLogout} />
          )}
        </main>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
