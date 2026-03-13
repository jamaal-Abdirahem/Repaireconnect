/** components/ui/Badge.jsx */
import { cls } from "../../utils/helpers.js";

const COLOR_MAP = {
  green:  "bg-emerald-100 text-emerald-700",
  red:    "bg-red-100 text-red-700",
  blue:   "bg-blue-100 text-blue-700",
  yellow: "bg-amber-100 text-amber-700",
  indigo: "bg-indigo-100 text-indigo-700",
  orange: "bg-orange-100 text-orange-700",
  gray:   "bg-gray-100 text-gray-600",
};

export function Badge({ children, color = "gray", size = "sm" }) {
  return (
    <span className={cls(
      "font-semibold rounded-full whitespace-nowrap",
      COLOR_MAP[color] || COLOR_MAP.gray,
      size === "xs" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1"
    )}>
      {children}
    </span>
  );
}
