/** portals/admin/components/AdminSidebar.jsx */
import {
  LayoutDashboard,
  List,
  Users,
  UserCheck,
  ArrowLeft,
  Shield,
  LogOut,
  CircleDollarSign,
} from "lucide-react";
import { SidebarShell } from "../../../components/layout/SidebarShell.jsx";
import { Avatar } from "../../../components/ui/Avatar.jsx";
import { ScrollArea } from "../../../components/ui/scroll-area.jsx";
import { Separator } from "../../../components/ui/separator.jsx";
import { cls } from "../../../utils/helpers.js";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "requests", label: "Requests", icon: List },
  { id: "technicians", label: "Technicians", icon: UserCheck },
  { id: "clients", label: "Clients", icon: Users },
  { id: "financials", label: "Financials", icon: CircleDollarSign },
];

export function AdminSidebar({
  page,
  onNav,
  onBackToSite,
  onLogout,
  pendingCount,
  open,
  onClose,
  user,
}) {
  return (
    <SidebarShell
      open={open}
      onClose={onClose}
      className="bg-surface-50 border-r border-surface-200"
    >
      <div className="px-6 py-6 shrink-0 ">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="RepairConnect Logo"
            className="w-auto h-16 transform hover:scale-105 transition-transform duration-300 rounded-md"
          />
          <div>
            <p className="text-surface-900 font-display font-bold text-base tracking-tight leading-tight">
              RepairConnect
            </p>
            <p className="text-brand-500 text-xs font-medium">Admin Portal</p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="px-5 py-5 shrink-0 bg-surface-50/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-surface-100 flex items-center justify-center text-brand-500 font-bold shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-surface-900 truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-surface-700">Administrator</p>
          </div>
        </div>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-1.5">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                onNav(id);
                onClose();
              }}
              className={cls(
                "w-full flex items-center justify-between px-3 py-3 rounded-md text-sm transition-all duration-200 group font-medium",
                page === id
                  ? "bg-surface-100 text-brand-500 shadow-sm"
                  : "text-surface-700 hover:bg-surface-100 hover:text-surface-900",
              )}
            >
              <span className="flex items-center gap-3">
                <Icon
                  size={18}
                  className={cls(
                    "transition-colors",
                    page === id
                      ? "text-brand-500"
                      : "text-surface-500 group-hover:text-surface-700",
                  )}
                />
                {label}
              </span>
              {id === "requests" && pendingCount > 0 && (
                <span className="bg-brand-500 text-surface-50 text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </ScrollArea>

      <Separator />

      <div className="px-4 py-6 shrink-0 flex flex-col gap-2 bg-surface-50 border-t border-surface-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-brand-500 hover:bg-surface-100 hover:text-brand-500 transition-all duration-200 group"
        >
          <LogOut
            size={16}
            className="text-brand-500 group-hover:text-brand-500 transition-colors"
          />{" "}
          Sign Out
        </button>
        <button
          onClick={onBackToSite}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-surface-700 hover:bg-surface-200 hover:text-surface-900 transition-all duration-200 group"
        >
          <ArrowLeft
            size={16}
            className="text-surface-500 group-hover:text-surface-700 transition-colors"
          />{" "}
          Back to site
        </button>
      </div>
    </SidebarShell>
  );
}
