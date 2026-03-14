/** utils/helpers.js */

export const cls = (...args) => args.filter(Boolean).join(" ");
export const cn = cls;

export function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
}

export function shortId(id) {
  if (!id) return "—";
  return id.slice(-8).toUpperCase();
}

export function initials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Location helpers
// Backwards-compatible parser for older encoded location strings of the form
// "<lat>,<lng>::<label>" (e.g. "2.0469,45.3182::KM4, Mogadishu").
// New backend fields use separate latitude/longitude numbers; for those,
// you should prefer the numeric fields and only use this to clean the label
// or to extract coordinates from legacy data.

export function decodeLocation(raw) {
  if (!raw || typeof raw !== "string") {
    return { lat: null, lng: null, label: "" };
  }
  const [coordsPart, labelPart] = raw.split("::");
  const label = (labelPart || raw).trim();

  const parts = coordsPart.split(",");
  if (parts.length === 2) {
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      return { lat, lng, label };
    }
  }

  return { lat: null, lng: null, label: raw.trim() };
}

// Vehicle helpers — best-effort detection from free-text problem / vehicle description
export function getVehicleKind(text) {
  if (!text) return "other";
  const t = String(text).toLowerCase();

  if (t.includes("bajaj") || t.includes("tuk") || t.includes("rickshaw"))
    return "bajaj";
  if (t.includes("lorry") || t.includes("truck")) return "lorry";
  if (t.includes("car") || t.includes("sedan") || t.includes("suv"))
    return "car";

  return "other";
}
