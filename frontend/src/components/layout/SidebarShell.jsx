/** components/layout/SidebarShell.jsx */
import { cls } from "../../utils/helpers.js";

export function SidebarShell({
  open,
  onClose,
  children,
  className = "bg-surface-50 border-r border-surface-200",
}) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-surface-900/40 backdrop-blur-sm z-[9998] md:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}
      <aside
        className={cls(
          "fixed md:relative inset-y-0 left-0 z-[9999] w-[260px] flex flex-col transition-all duration-300 ease-in-out shrink-0 shadow-xl md:shadow-none bg-surface-50",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className,
        )}
      >
        {children}
      </aside>
    </>
  );
}
