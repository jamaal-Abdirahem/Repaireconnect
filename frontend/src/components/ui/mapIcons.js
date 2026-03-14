import L from "leaflet";
import { getVehicleKind } from "../../utils/helpers.js";

// Emoji-based marker using Leaflet divIcon. This matches your older style.
function makeEmojiIcon(emoji, extraClass = "") {
  return L.divIcon({
    className: `rc-vehicle-marker ${extraClass}`.trim(),
    html: `<span>${emoji}</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 24],
  });
}

// Icons keyed by the legacy text-based kind helper
const KIND_ICONS = {
  car: makeEmojiIcon("🚗", "rc-vehicle-marker-car"),
  bajaj: makeEmojiIcon("🛺", "rc-vehicle-marker-bajaj"),
  lorry: makeEmojiIcon("🚚", "rc-vehicle-marker-lorry"),
  other: makeEmojiIcon("📍", "rc-vehicle-marker-other"),
};

// Icons keyed by backend VehicleType enum (per your API docs mapping)
const TYPE_ICONS = {
  CAR: makeEmojiIcon("🚗", "rc-vehicle-marker-car"),
  MOTORCYCLE: makeEmojiIcon("🏍️", "rc-vehicle-marker-motorcycle"),
  BAJAJ: makeEmojiIcon("🛺", "rc-vehicle-marker-bajaj"),
  LORRY: makeEmojiIcon("🚚", "rc-vehicle-marker-lorry"),
  BUS: makeEmojiIcon("🚌", "rc-vehicle-marker-bus"),
  OTHER: makeEmojiIcon("📍", "rc-vehicle-marker-other"),
};

// New primary helper: prefer explicit vehicleType from backend,
// fall back to best-effort detection from problem text.
export function getVehicleIcon(vehicleType, problemText) {
  if (vehicleType && TYPE_ICONS[vehicleType]) {
    return TYPE_ICONS[vehicleType];
  }
  const kind = getVehicleKind(problemText);
  return KIND_ICONS[kind] || TYPE_ICONS.OTHER;
}

// Backwards compatibility for any old code still using it
export function getVehicleIconForProblem(problemText) {
  const kind = getVehicleKind(problemText);
  return KIND_ICONS[kind] || TYPE_ICONS.OTHER;
}
