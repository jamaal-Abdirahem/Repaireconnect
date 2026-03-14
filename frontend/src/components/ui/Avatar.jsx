/** components/ui/Avatar.jsx */
import { cls, initials } from "../../utils/helpers.js";

const SIZE_MAP = {
  xs: "w-7 h-7 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-14 h-14 text-lg",
};

const GRADIENT_MAP = {
  amber:  "from-brand-500 to-surface-950",
  brand:  "from-brand-500 to-surface-950",
  indigo: "from-brand-500 to-surface-950",
  slate:  "from-surface-700 to-surface-950",
  emerald:"from-brand-500 to-surface-950",
};

export function Avatar({ name, photo, size = "md", color = "slate" }) {
  const sz = SIZE_MAP[size] || SIZE_MAP.md;
  const grad = GRADIENT_MAP[color] || GRADIENT_MAP.slate;

  if (photo) {
    return <img src={photo} alt={name} className={cls(sz, "rounded-full object-cover shrink-0")} />;
  }
  return (
    <div className={cls(sz, `rounded-full bg-surface-950 ${grad} text-surface-50 flex items-center justify-center font-bold shrink-0`)}>
      {initials(name)}
    </div>
  );
}
