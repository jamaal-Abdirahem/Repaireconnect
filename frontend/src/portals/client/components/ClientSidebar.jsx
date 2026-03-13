/** portals/client/components/ClientSidebar.jsx */
import { Home, List, User, ArrowLeft, Wrench } from "lucide-react";
import { SidebarShell } from "../../../components/layout/SidebarShell.jsx";
import { Avatar } from "../../../components/ui/Avatar.jsx";
import { cls } from "../../../utils/helpers.js";

const NAV = [
  { id: "dashboard", label: "Dashboard",   icon: Home },
  { id: "history",   label: "My Requests", icon: List },
  { id: "profile",   label: "Profile",     icon: User },
];

export function ClientSidebar({ page, onNav, onBackToSite, open, onClose, user }) {
  return (
    <SidebarShell open={open} onClose={onClose} bg="#0f172a">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#f59e0b" }}>
            <Wrench size={15} className="text-slate-900" />
          </div>
          <span className="text-white font-bold text-base tracking-tight">RepairConnect</span>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Avatar name={user?.name || "Client"} size="sm" color="amber" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || "Client"}</p>
            <p className="text-xs text-amber-400">Client</p>
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
              page === id
                ? "bg-amber-400 text-slate-900 font-semibold"
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
