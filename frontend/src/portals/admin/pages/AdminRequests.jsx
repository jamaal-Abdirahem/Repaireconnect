/** portals/admin/pages/AdminRequests.jsx */
import { useState } from "react";
import { Search, X, UserCheck, MapPin, Phone, Calendar } from "lucide-react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { StatusBadge } from "../../../components/ui/StatusBadge.jsx";
import { Avatar } from "../../../components/ui/avatar.jsx";
import { assignRequest } from "../../../api/requests.js";
import { formatDate, cls, decodeLocation } from "../../../utils/helpers.js";
import { getVehicleIcon } from "../../../components/ui/mapIcons.js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card.jsx";
import { Input } from "../../../components/ui/input.jsx";
import { Button } from "../../../components/ui/button.jsx";

const FILTERS = [
  "ALL",
  "REPORTED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "PAID",
];

export function AdminRequests({ requests, technicians, onRefresh, onToast }) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [assigning, setAssigning] = useState(null); // requestId being assigned
  const [loading, setLoading] = useState(false);

  const filtered = requests.filter((r) => {
    const matchStatus = filter === "ALL" || r.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      [r.clientName, r.location, r.problem, r.id].some((f) =>
        f?.toLowerCase().includes(q),
      );
    return matchStatus && matchSearch;
  });

  const handleAssign = async (requestId, technicianId) => {
    setLoading(true);
    try {
      await assignRequest(requestId, technicianId);
      onToast("Technician assigned successfully.", "success");
      setAssigning(null);
      onRefresh();
    } catch (err) {
      onToast(err.message || "Could not assign technician.", "error");
    } finally {
      setLoading(false);
    }
  };

  const availableTechs = technicians.filter((t) => t.available);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header and Search */}
      <div className="flex flex-col space-y-4">
        <div>
           <h2 className="text-2xl font-display font-bold text-surface-900 tracking-tight">Manage Requests</h2>
           <p className="text-surface-700 text-lg mt-2 font-medium">Review, monitor, and assign active service requests.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client, location, problem…"
              className="pl-11 pr-4 py-6 w-full text-base rounded-md"
            />
          </div>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
            {FILTERS.map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
                className="rounded-md px-4 whitespace-nowrap hidden sm:block"
              >
                {f === "ALL" ? "All" : f.replace("_", " ")}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Map overview of filtered requests */}
      <Card>
        <CardHeader className="pb-3 border-b border-surface-100 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">Requests Map — Mogadishu</CardTitle>
            <CardDescription className="text-xs">Live locations</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="rounded-md overflow-hidden border border-surface-200 h-[300px] bg-surface-50 shadow-inner">
            <MapContainer
              center={[2.046934, 45.318161]}
              zoom={12}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {filtered.map((r) => {
                if (r.status === "COMPLETED" || r.status === "PAID") return null;
                const legacy = decodeLocation(r.location);
                const lat =
                  typeof r.latitude === "number" ? r.latitude : legacy.lat;
                const lng =
                  typeof r.longitude === "number" ? r.longitude : legacy.lng;
                const label = legacy.label || r.location;
                if (lat == null || lng == null) return null;
                return (
                  <Marker
                    key={r.id}
                    position={[lat, lng]}
                    icon={getVehicleIcon(r.vehicleType, r.problem)}
                  >
                    <Tooltip direction="top" offset={[0, -4]} opacity={0.95} className="!bg-surface-50 !border-surface-200 !text-surface-900 !shadow-md !rounded-md !p-3">
                      <div className="text-xs font-sans">
                        <p className="font-bold text-surface-900 mb-0.5">{r.clientName}</p>
                        <p className="text-surface-600 font-medium mb-1.5">{label}</p>
                        <span className="inline-flex bg-brand-50 text-brand-700 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border border-brand-100">{r.status}</span>
                      </div>
                    </Tooltip>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 && (
        <Card className="py-12 border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center p-0">
            <Search size={32} className="mx-auto text-surface-200 mb-3" />
            <p className="text-surface-500 text-sm font-medium">No requests match the current filter.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filtered.map((r) => (
          <Card key={r.id} className="transition-all duration-200 hover:shadow-md border-surface-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-brand-600 uppercase tracking-widest mb-1.5">
                    {r.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-lg font-bold text-surface-900 leading-snug tracking-tight">
                    {r.problem}
                  </p>
                  <p className="text-sm font-medium text-surface-500 mt-1">{r.clientName}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-surface-500 mt-4 mb-4 font-medium">
                {(() => {
                  const loc = decodeLocation(r.location);
                  const label = loc.label || r.location;
                  return (
                    <span className="flex items-center gap-1.5 bg-surface-50 px-2.5 py-1 rounded-lg border border-surface-100">
                      <MapPin size={14} className="text-surface-400" />
                      {label}
                    </span>
                  );
                })()}
                <span className="flex items-center gap-1.5 bg-surface-50 px-2.5 py-1 rounded-lg border border-surface-100">
                  <Phone size={14} className="text-surface-400" />
                  {r.phone}
                </span>
                <span className="flex items-center gap-1.5 bg-surface-50 px-2.5 py-1 rounded-lg border border-surface-100">
                  <Calendar size={14} className="text-surface-400" />
                  {formatDate(r.createdAt)}
                </span>
              </div>

              {r.technician && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-surface-100 text-sm">
                  <div className="w-6 h-6 rounded-full bg-surface-50 border border-surface-200 flex items-center justify-center">
                    <UserCheck size={12} className="text-brand-500" />
                  </div>
                  <span className="text-surface-500 font-medium">
                    Assigned to{" "}
                    <strong className="text-surface-900 font-bold">
                      {r.technician.user?.name}
                    </strong>
                  </span>
                </div>
              )}

              {r.status === "REPORTED" && (
                <div className="mt-4 pt-4 border-t border-surface-100">
                  {assigning === r.id ? (
                    <div className="border border-brand-200 bg-brand-50/50 rounded-md p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-brand-700">
                          Select a technician
                        </p>
                        <Button variant="ghost" size="icon" onClick={() => setAssigning(null)} className="h-8 w-8 text-brand-500 hover:text-brand-700 hover:bg-brand-100">
                          <X size={16} />
                        </Button>
                      </div>
                      {availableTechs.length === 0 ? (
                        <p className="text-sm text-surface-500 bg-surface-50 px-4 py-3 rounded-lg border border-surface-200">
                          No technicians available right now.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {availableTechs.map((t) => (
                            <button
                              key={t.id}
                              disabled={loading}
                              onClick={() => handleAssign(r.id, t.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-md bg-surface-50 border border-surface-200 hover:border-surface-200 hover:shadow-subtle transition-all text-left group"
                            >
                              <div className="h-8 w-8 rounded-full bg-surface-100 flex items-center justify-center text-brand-500 font-bold text-xs shrink-0">
                                {t.user?.name ? t.user.name.charAt(0).toUpperCase() : "T"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-surface-900 group-hover:text-brand-700 transition-colors">
                                  {t.user?.name}
                                </p>
                                {t.location && (
                                  <p className="text-xs text-surface-400 truncate mt-0.5 font-medium">
                                    {t.location}
                                  </p>
                                )}
                              </div>
                              <span className="bg-surface-50 text-brand-500 border border-surface-200 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-sm">
                                Available
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button
                      onClick={() => setAssigning(r.id)}
                      className="gap-2 shadow-sm"
                    >
                      <UserCheck size={16} /> Assign Technician
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
