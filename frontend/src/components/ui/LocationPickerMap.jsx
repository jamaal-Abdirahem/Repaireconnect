import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  useMapEvents,
} from "react-leaflet";
import { Crosshair, Navigation } from "lucide-react";

const MOGADISHU_CENTER = { lat: 2.046934, lng: 45.318161 };

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export function LocationPickerMap({ value, onChange }) {
  const [locating, setLocating] = useState(false);

  const handleMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocating(false);
        onChange(coords);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const center = value || MOGADISHU_CENTER;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-surface-600 mb-1">
        <p>
          Tap the map to drop a pin near your location. You can also use GPS
          below.
        </p>
        <button
          type="button"
          onClick={handleMyLocation}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-surface-200 text-[11px] font-semibold text-surface-700 hover:bg-surface-100"
        >
          {locating ? (
            <>
              <Navigation size={11} className="animate-spin" /> Locating…
            </>
          ) : (
            <>
              <Crosshair size={11} /> Use my GPS
            </>
          )}
        </button>
      </div>

      <div className="rounded-none overflow-hidden border border-surface-200 h-64 bg-surface-100">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <ClickHandler onSelect={onChange} />
          {value && (
            <CircleMarker
              center={[value.lat, value.lng]}
              radius={10}
              pathOptions={{
                color: "#0D0D0C",
                fillColor: "#FF5500",
                fillOpacity: 0.9,
              }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
