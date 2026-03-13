/** utils/helpers.js */

export const cls = (...args) => args.filter(Boolean).join(" ");

export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    + " · "
    + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function shortId(id) {
  if (!id) return "—";
  return id.slice(-8).toUpperCase();
}

export function initials(name) {
  if (!name) return "?";
  return name.trim().split(/\s+/).map(n => n[0]).join("").toUpperCase().slice(0, 2);
}
