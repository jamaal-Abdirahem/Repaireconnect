/** components/layout/Topbar.jsx */
import { useState, useRef, useEffect } from "react";
import { Bell, Menu, ArrowLeft, ChevronRight, X } from "lucide-react";
import { Avatar } from "../ui/Avatar.jsx";
import { cls } from "../../utils/helpers.js";

function NotifsPanel({ notifs, onNavigate, onClear }) {
  const unread = notifs.filter(n => !n.read).length;
  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-semibold text-slate-900 text-sm">
          Notifications
          {unread > 0 && (
            <span className="ml-1.5 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{unread}</span>
          )}
        </span>
        <button onClick={onClear} className="text-xs text-gray-400 hover:text-slate-700 transition-colors">
          Clear all
        </button>
      </div>
      {notifs.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-sm">All caught up!</div>
      ) : (
        <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
          {notifs.map(n => (
            <button
              key={n.id}
              onClick={() => onNavigate(n.route)}
              className={cls(
                "w-full text-left px-4 py-3 flex gap-3 hover:bg-gray-50 transition-colors",
                !n.read && "bg-blue-50 hover:bg-blue-100/50"
              )}
            >
              <span className={cls("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", !n.read ? "bg-blue-500" : "bg-transparent")} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 leading-snug">{n.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
              </div>
              <ChevronRight size={13} className="text-gray-300 mt-0.5 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Topbar({
  title,
  user,
  notifs = [],
  onToggleSidebar,
  onNav,
  onClearNotifs,
  showBack = false,
  onBack,
  avatarColor = "slate",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const unread = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const navigate = (route) => {
    onNav?.(route);
    setOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-100 px-4 md:px-6 h-14 flex items-center justify-between sticky top-0 z-20 shrink-0">
      <div className="flex items-center gap-2">
        <button onClick={onToggleSidebar} className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Menu size={18} />
        </button>
        {showBack && (
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
            <ArrowLeft size={16} />
          </button>
        )}
        <h1 className="font-bold text-slate-900 text-base">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(v => !v)}
            className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Bell size={17} className="text-gray-600" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>
          {open && (
            <NotifsPanel
              notifs={notifs}
              onNavigate={navigate}
              onClear={onClearNotifs}
            />
          )}
        </div>
        {user && (
          <button onClick={() => onNav?.("profile")} className="hover:opacity-80 transition-opacity">
            <Avatar name={user.name} size="sm" color={avatarColor} />
          </button>
        )}
      </div>
    </header>
  );
}
