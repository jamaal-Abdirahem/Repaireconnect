import { useState, useCallback, useEffect } from "react";
import {
  Shield,
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
import { AdminSidebar } from "./components/AdminSidebar.jsx";
import { Topbar } from "../../components/layout/Topbar.jsx";
import { ToastContainer } from "../../components/ui/Toast.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { AdminRequests } from "./pages/AdminRequests.jsx";
import { AdminTechnicians } from "./pages/AdminTechnicians.jsx";
import { AdminClients } from "./pages/AdminClients.jsx";
import { AdminFinancials } from "./pages/AdminFinancials.jsx";
import { useToast } from "../../hooks/useToast.js";
import { usePolling } from "../../hooks/usePolling.js";
import { getRequests } from "../../api/requests.js";
import { getTechnicians, getAllUsers } from "../../api/users.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const TITLES = {
  dashboard: "Operations Overview",
  requests: "Service Requests",
  technicians: "Technicians",
  clients: "Clients",
  financials: "Financial Overview",
};

function AdminAuthGate() {
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
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center px-4">
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 flex items-center gap-2 text-surface-400 hover:text-surface-50 transition-colors"
      >
        <ArrowLeft size={16} /> Back to site
      </Button>

      <Card className="w-full max-w-sm bg-surface-900/70 border-surface-800 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <img
            src="/logo.png"
            alt="RepairConnect Logo"
            className="w-auto h-24 mx-auto mb-6 transform hover:scale-105 transition-transform duration-300"
          />
          <CardTitle className="text-surface-50 font-bold text-2xl tracking-tight">
            Staff Portal
          </CardTitle>
          <CardDescription className="text-surface-400 font-medium">
            Admin and operator access only
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
              />
              <Input
                {...formRegister("phone")}
                placeholder="Username or phone"
                autoComplete="username"
                className={`bg-surface-950/50 border-surface-700 text-surface-50 placeholder-surface-500 pl-11 h-12 rounded-md transition-all ${errors.phone ? "border-brand-500/50 focus-visible:ring-brand-500/20" : "focus-visible:ring-brand-500/20 focus-visible:border-brand-500"}`}
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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
              />
              <Input
                {...formRegister("password")}
                placeholder="Password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                className={`bg-surface-950/50 border-surface-700 text-surface-50 placeholder-surface-500 pl-11 pr-11 h-12 rounded-md transition-all ${errors.password ? "border-brand-500/50 focus-visible:ring-brand-500/20" : "focus-visible:ring-brand-500/20 focus-visible:border-brand-500"}`}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-50 transition-colors"
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
              className="w-full bg-brand-500 hover:bg-surface-950 text-surface-50 h-12 rounded-md transition-all duration-200 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Signing in…
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

export function AdminPortal() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebar] = useState(false);
  const [requests, setRequests] = useState([]);
  const [technicians, setTechs] = useState([]);
  const [users, setUsers] = useState([]);
  const { toasts, toast, dismiss } = useToast();

  const fetchAll = useCallback(async () => {
    if (!user) return;
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
      // silent — will surface errors when backend is real
    }
  }, [user]);

  usePolling(fetchAll, 8_000, !!user);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  if (!isAuthenticated || !user) return <AdminAuthGate />;

  if (user.role !== "ADMIN" && user.role !== "OPERATOR") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-surface-950 px-4">
        <div className="w-12 h-12 rounded-none bg-brand-500/20 flex items-center justify-center mb-4">
          <Shield size={20} className="text-brand-500" />
        </div>
        <h2 className="text-surface-50 font-bold text-xl mb-2">
          Access Denied
        </h2>
        <p className="text-surface-400 text-sm mb-6">
          Staff portal access is restricted to Administrators and Operators.
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-md bg-surface-950/10 text-surface-50 hover:bg-surface-950/20 font-semibold text-sm transition-colors"
          >
            Sign Out
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded-md bg-brand-500 text-surface-50 hover:bg-surface-950 font-semibold text-sm transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const pendingCount = requests.filter((r) => r.status === "REPORTED").length;

  return (
    <div className="flex h-screen bg-surface-100 overflow-hidden">
      <AdminSidebar
        page={page}
        onNav={setPage}
        onBackToSite={() => navigate("/")}
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
          onToggleSidebar={() => setSidebar((v) => !v)}
          onNav={setPage}
          onClearNotifs={() => {}}
          avatarColor="brand"
        />
        <main className="flex-1 overflow-y-auto">
          {page === "dashboard" && (
            <AdminDashboard
              requests={requests}
              technicians={technicians}
              onNav={setPage}
            />
          )}
          {page === "requests" && (
            <AdminRequests
              requests={requests}
              technicians={technicians}
              onRefresh={fetchAll}
              onToast={toast}
            />
          )}
          {page === "technicians" && (
            <AdminTechnicians
              technicians={technicians}
              onRefresh={fetchAll}
              onToast={toast}
            />
          )}
          {page === "clients" && (
            <AdminClients users={users} requests={requests} />
          )}
          {page === "financials" && (
            <AdminFinancials
              requests={requests}
              technicians={technicians}
              users={users}
            />
          )}
        </main>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
