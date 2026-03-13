/** components/ui/JobTracker.jsx */
import { Check } from "lucide-react";
import { cls } from "../../utils/helpers.js";
import { TRACKER_STEPS } from "../../utils/constants.js";

function stepIndex(status) {
  const i = TRACKER_STEPS.findIndex(s => s.key === status);
  return i < 0 ? 0 : i;
}

function Dot({ active, done, label, index }) {
  return (
    <div className="flex flex-col items-center" style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{ position: "relative", zIndex: 2 }}
        className={cls(
          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
          done   ? "bg-emerald-500 border-emerald-500 text-white" :
          active ? "bg-slate-900 border-slate-900 text-white shadow-md" :
                   "bg-white border-gray-200 text-gray-400"
        )}
      >
        {done ? <Check size={12} strokeWidth={3} /> : index + 1}
      </div>
      <span
        className={cls(
          "text-xs text-center mt-1.5 leading-tight px-0.5",
          active ? "text-slate-900 font-semibold" :
          done   ? "text-emerald-600 font-medium"  :
                   "text-gray-400"
        )}
        style={{ maxWidth: 72 }}
      >
        {label}
      </span>
    </div>
  );
}

export function JobTracker({ status }) {
  const idx = stepIndex(status);
  const pct = idx <= 0 ? 0 : (idx / (TRACKER_STEPS.length - 1)) * 100;

  return (
    <div style={{ position: "relative", paddingBottom: 4 }}>
      {/* grey track */}
      <div style={{ position: "absolute", top: 16, left: 16, right: 16, height: 2, background: "#e5e7eb", zIndex: 0 }} />
      {/* emerald fill */}
      <div style={{
        position: "absolute", top: 16, left: 16,
        width: `calc((100% - 32px) * ${pct} / 100)`,
        height: 2, background: "#10b981", zIndex: 1,
        transition: "width 0.5s ease",
      }} />
      {/* dots */}
      <div style={{ position: "relative", zIndex: 2, display: "flex" }}>
        {TRACKER_STEPS.map((s, i) => (
          <Dot key={s.key} index={i} label={s.label} active={i === idx} done={i < idx} />
        ))}
      </div>
    </div>
  );
}
