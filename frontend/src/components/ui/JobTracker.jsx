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
          done   ? "bg-brand-500 border-brand-500 text-surface-50" :
          active ? "bg-surface-950 border-surface-950 text-surface-50 shadow-md" :
                   "bg-surface-50 border-surface-200 text-surface-500"
        )}
      >
        {done ? <Check size={12} strokeWidth={3} /> : index + 1}
      </div>
      <span
        className={cls(
          "text-xs text-center mt-1.5 leading-tight px-0.5",
          active ? "text-surface-950 font-display font-bold track-tighter font-semibold" :
          done   ? "text-brand-500 font-medium"  :
                   "text-surface-500"
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
      <div style={{ position: "absolute", top: 16, left: 16, right: 16, height: 2, background: "#0D0D0C", zIndex: 0 }} />
      {/* emerald fill */}
      <div style={{
        position: "absolute", top: 16, left: 16,
        width: `calc((100% - 32px) * ${pct} / 100)`,
        height: 2, background: "#FF5500", zIndex: 1,
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
