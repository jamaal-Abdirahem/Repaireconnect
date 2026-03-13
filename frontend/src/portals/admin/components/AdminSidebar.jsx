/** portals/admin/components/AdminSidebar.jsx */
import { LayoutDashboard, List, Users, UserCheck, ArrowLeft, Shield } from "lucide-react";
import { SidebarShell } from "../../../components/layout/SidebarShell.jsx";
import { Avatar } from "../../../components/ui/Avatar.jsx";
import { cls } from "../../../utils/helpers.js";

const NAV = [
  { id: "dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { id: "requests",    label: "Requests",    icon: List            },
  { id: "technicians", label: "Technicians", icon: UserCheck       },
  { id: "clients",     label: "Clients",     icon: Users           },
];

export function AdminSidebar({ page, onNav, onBackToSite, pendingCount, open, onClose, user }) {
  return (
    <SidebarShell open={open} onClose={onClose} bg="#1e1b4b">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-indigo-500">
            <Shield size={15} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-tight">RepairConnect</p>
            <p className="text-indigo-300 text-xs">Admin Portal</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Avatar name={user?.name || "Admin"} size="sm" color="indigo" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || "Admin"}</p>
            <p className="text-xs text-indigo-300">Administrator</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { onNav(id); onClose(); }}
            className={cls(
              "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all",
              page === id
                ? "bg-indigo-500 text-white font-semibold"
                : "text-indigo-200 hover:bg-white/10 hover:text-white"
            )}
          >
            <span className="flex items-center gap-3"><Icon size={15} />{label}</span>
            {id === "requests" && pendingCount > 0 && (
              <span className="bg-amber-400 text-slate-900 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={onBackToSite}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-indigo-300 hover:bg-white/10 hover:text-white transition-all"
        >
          <ArrowLeft size={14} /> Back to site
        </button>
      </div>
    </SidebarShell>
  );
}
