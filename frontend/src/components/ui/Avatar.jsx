/** components/ui/Avatar.jsx */
import { cls, initials } from "../../utils/helpers.js";

const SIZE_MAP = {
  xs: "w-7 h-7 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-14 h-14 text-lg",
};

const GRADIENT_MAP = {
  amber:  "from-amber-500 to-amber-700",
  indigo: "from-indigo-500 to-indigo-800",
  slate:  "from-slate-600 to-slate-900",
  emerald:"from-emerald-500 to-emerald-700",
};

export function Avatar({ name, photo, size = "md", color = "slate" }) {
  const sz = SIZE_MAP[size] || SIZE_MAP.md;
  const grad = GRADIENT_MAP[color] || GRADIENT_MAP.slate;

  if (photo) {
    return <img src={photo} alt={name} className={cls(sz, "rounded-full object-cover shrink-0")} />;
  }
  return (
    <div className={cls(sz, `rounded-full bg-gradient-to-br ${grad} text-white flex items-center justify-center font-bold shrink-0`)}>
      {initials(name)}
    </div>
  );
}
