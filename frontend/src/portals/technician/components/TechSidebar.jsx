/** portals/technician/components/TechSidebar.jsx */
import {
  Home,
  Briefcase,
  Clock,
  User,
  ArrowLeft,
  Wrench,
  LogOut,
} from "lucide-react";
import { SidebarShell } from "../../../components/layout/SidebarShell.jsx";
import { Avatar } from "../../../components/ui/Avatar.jsx";
import { ScrollArea } from "../../../components/ui/scroll-area.jsx";
import { Separator } from "../../../components/ui/separator.jsx";
import { cls } from "../../../utils/helpers.js";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "requests", label: "My Jobs", icon: Briefcase },
  { id: "history", label: "History", icon: Clock },
  { id: "profile", label: "Profile", icon: User },
];

export function TechSidebar({
  page,
  onNav,
  onBackToSite,
  onLogout,
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
      <div className="px-5 py-6 flex items-center gap-3">
        <img
          src="/logo.png"
          alt="RepairConnect Logo"
          className="w-auto h-12 transform hover:scale-105 transition-transform duration-300 rounded-md"
        />
        <span className="text-surface-900 font-bold text-lg tracking-tight">
          RepairConnect
        </span>
      </div>

      <Separator />

      <div className="px-4 py-5">
        <div className="flex items-center gap-3 bg-surface-50 p-3 rounded-md border border-surface-200 shadow-sm">
          {/* We assume the custom Avatar isn't fully replaced yet or shadcn Avatar is mapped. We'll use the shadcn standard or the existing one depending on what avatar.jsx export is. Let's keep existing props but use text-surface classes. */}
          <div className="h-10 w-10 shrink-0 rounded-full bg-surface-100 flex items-center justify-center text-brand-500 font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : "T"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-surface-900 truncate">
              {user?.name || "Technician"}
            </p>
            <p className="text-xs text-surface-500 font-medium tracking-wide uppercase">
              Technician
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                onNav(id);
                onClose();
              }}
              className={cls(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200 group font-medium",
                page === id || (page === "job" && id === "requests")
                  ? "bg-surface-100 text-brand-500 shadow-sm"
                  : "text-surface-700 hover:bg-surface-100 hover:text-surface-900",
              )}
            >
              <Icon
                size={18}
                className={cls(
                  "transition-transform duration-200",
                  page === id || (page === "job" && id === "requests")
                    ? "scale-110 text-brand-500"
                    : "group-hover:scale-110 text-surface-500 group-hover:text-surface-700",
                )}
              />
              {label}
            </button>
          ))}
        </nav>
      </ScrollArea>

      <Separator />

      <div className="px-3 py-4 flex flex-col gap-1 bg-surface-50">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-brand-500 hover:bg-surface-100 hover:text-brand-500 transition-all font-medium group"
        >
          <LogOut
            size={16}
            className="text-brand-500 group-hover:text-brand-500"
          />{" "}
          Sign Out
        </button>
        <button
          onClick={onBackToSite}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-surface-700 hover:bg-surface-200 hover:text-surface-900 transition-all font-medium group"
        >
          <ArrowLeft
            size={16}
            className="text-surface-500 group-hover:text-surface-700"
          />{" "}
          Back to site
        </button>
      </div>
    </SidebarShell>
  );
}
