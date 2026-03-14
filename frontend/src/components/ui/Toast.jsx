/** components/ui/Toast.jsx */
import { Bell, X, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { cls } from "../../utils/helpers.js";

const TYPE_MAP = {
  success: { icon: CheckCircle2, color: "text-brand-500" },
  error:   { icon: AlertTriangle, color: "text-brand-500" },
  info:    { icon: Bell,          color: "text-surface-50" },
};

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-5 right-5 z-[999] flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      {toasts.map(t => {
        const { icon: Icon, color } = TYPE_MAP[t.type] || TYPE_MAP.info;
        return (
          <div
            key={t.id}
            className="bg-surface-950 text-surface-50 rounded-none px-4 py-3 flex gap-3 shadow-2xl pointer-events-auto animate-slide-up"
          >
            <Icon size={15} className={cls("mt-0.5 shrink-0", color)} />
            <p className="flex-1 text-sm leading-snug">{t.message}</p>
            <button onClick={() => onDismiss(t.id)} className="text-surface-50 hover:text-surface-50 shrink-0 mt-0.5">
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
