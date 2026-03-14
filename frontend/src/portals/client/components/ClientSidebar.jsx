/** portals/client/components/ClientSidebar.jsx */
import { Home, List, User, ArrowLeft, Wrench, LogOut } from "lucide-react";
import { SidebarShell } from "../../../components/layout/SidebarShell.jsx";
import { Avatar } from "../../../components/ui/Avatar.jsx";
import { ScrollArea } from "../../../components/ui/scroll-area.jsx";
import { Separator } from "../../../components/ui/separator.jsx";
import { cls } from "../../../utils/helpers.js";

const NAV = [
  { id: "dashboard", label: "Dashboard",   icon: Home },
  { id: "history",   label: "My Requests", icon: List },
  { id: "profile",   label: "Profile",     icon: User },
];

export function ClientSidebar({ page, onNav, onBackToSite, onLogout, open, onClose, user }) {
  return (
    <SidebarShell open={open} onClose={onClose} className="bg-surface-50 border-r border-surface-200">
      <div className="px-6 py-6 flex items-center gap-3">
        <img src="/logo.png" alt="RepairConnect Logo" className="w-auto h-14 transform hover:scale-105 transition-transform duration-300 rounded-md"  />
        <span className="text-surface-900 font-bold tracking-tight text-lg">Client Portal</span>
      </div>

      <Separator />

      <div className="px-6 py-6 flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-surface-100 flex items-center justify-center text-brand-500 font-bold shadow-sm">
          {user?.name ? user.name.charAt(0).toUpperCase() : "C"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-surface-900 truncate">{user?.name || "Client"}</p>
          <p className="text-xs text-surface-500 font-medium tracking-wide uppercase">Client</p>
        </div>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-1.5">
          {NAV.map(({ id, label, icon: Icon }) => {
            const isActive = page === id;
            return (
              <button
                key={id}
                onClick={() => { onNav(id); onClose(); }}
                className={cls(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-surface-100 text-brand-500 shadow-sm"
                    : "text-surface-700 hover:bg-surface-100 hover:text-surface-900"
                )}
              >
                <Icon size={18} className={isActive ? "text-brand-500 scale-110" : "text-surface-500 group-hover:text-surface-700 group-hover:scale-110 transition-transform duration-200"} />
                {label}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      <div className="px-4 py-6 space-y-1.5 bg-surface-50">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium text-brand-500 hover:bg-surface-100 hover:text-brand-500 transition-all duration-200 group"
        >
          <LogOut size={16} className="text-brand-500 group-hover:text-brand-500 group-hover:scale-110 transition-all" />
          <span>Sign Out</span>
        </button>
        <button
          onClick={onBackToSite}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium text-surface-700 hover:bg-surface-200 hover:text-surface-900 transition-all duration-200 group"
        >
          <ArrowLeft size={16} className="text-surface-500 group-hover:text-surface-700 group-hover:-translate-x-1 transition-all" />
          <span>Back to Site</span>
        </button>
      </div>
    </SidebarShell>
  );
}
