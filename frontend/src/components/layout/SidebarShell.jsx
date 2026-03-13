/** components/layout/SidebarShell.jsx */
import { cls } from "../../utils/helpers.js";

export function SidebarShell({ open, onClose, children, bg = "#0f172a" }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cls(
          "fixed md:static inset-y-0 left-0 z-40 w-60 flex flex-col transition-transform duration-300 shrink-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        style={{ background: bg }}
      >
        {children}
      </aside>
    </>
  );
}
