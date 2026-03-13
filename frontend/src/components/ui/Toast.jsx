/** components/ui/Toast.jsx */
import { Bell, X, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { cls } from "../../utils/helpers.js";

const TYPE_MAP = {
  success: { icon: CheckCircle2, color: "text-emerald-400" },
  error:   { icon: AlertTriangle, color: "text-red-400" },
  info:    { icon: Bell,          color: "text-amber-400" },
};

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-5 right-5 z-[999] flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      {toasts.map(t => {
        const { icon: Icon, color } = TYPE_MAP[t.type] || TYPE_MAP.info;
        return (
          <div
            key={t.id}
            className="bg-slate-900 text-white rounded-2xl px-4 py-3 flex gap-3 shadow-2xl pointer-events-auto"
            style={{ animation: "slideUp 0.3s ease" }}
          >
            <Icon size={15} className={cls("mt-0.5 shrink-0", color)} />
            <p className="flex-1 text-sm leading-snug">{t.message}</p>
            <button onClick={() => onDismiss(t.id)} className="text-slate-500 hover:text-white shrink-0 mt-0.5">
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
