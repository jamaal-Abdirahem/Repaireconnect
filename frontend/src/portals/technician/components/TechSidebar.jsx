/** portals/technician/components/TechSidebar.jsx */
import { Home, Briefcase, Clock, User, ArrowLeft, Wrench } from "lucide-react";
import { SidebarShell } from "../../../components/layout/SidebarShell.jsx";
import { Avatar } from "../../../components/ui/Avatar.jsx";
import { cls } from "../../../utils/helpers.js";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: Home      },
  { id: "requests",  label: "My Jobs",   icon: Briefcase },
  { id: "history",   label: "History",   icon: Clock     },
  { id: "profile",   label: "Profile",   icon: User      },
];

export function TechSidebar({ page, onNav, onBackToSite, open, onClose, user }) {
  return (
    <SidebarShell open={open} onClose={onClose} bg="#0f172a">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#10b981" }}>
            <Wrench size={15} className="text-white" />
          </div>
          <span className="text-white font-bold text-base tracking-tight">RepairConnect</span>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Avatar name={user?.name || "Technician"} size="sm" color="emerald" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || "Technician"}</p>
            <p className="text-xs text-emerald-400">Technician</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { onNav(id); onClose(); }}
            className={cls(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
              page === id || (page === "job" && id === "requests")
                ? "bg-emerald-500 text-white font-semibold"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={onBackToSite}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <ArrowLeft size={14} /> Back to site
        </button>
      </div>
    </SidebarShell>
  );
}
