/** portals/technician/pages/TechDashboard.jsx */
import { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Phone,
  Briefcase,
  CheckCircle2,
  Bell,
  Clock,
  X,
  Navigation,
  Hand,
  ArrowRight,
} from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { JobTracker } from "../../../components/ui/JobTracker.jsx";
import { StatusBadge } from "../../../components/ui/StatusBadge.jsx";
import { Card, CardContent } from "../../../components/ui/card.jsx";
import { Button } from "../../../components/ui/button.jsx";
import { markArrived, markComplete } from "../../../api/requests.js";
import { decodeLocation } from "../../../utils/helpers.js";
import { getVehicleIcon } from "../../../components/ui/mapIcons.js";

const INCOMING = ["ASSIGNED"];
const ACTIVE = ["ARRIVED", "ESTIMATED", "APPROVED", "IN_PROGRESS"];
const DONE = ["COMPLETED", "PAID"];

export function TechDashboard({
  requests,
  onRefresh,
  onNav,
  onOpenJob,
  onToast,
  user,
}) {
  const [declining, setDeclining] = useState(false);
  const [acting, setActing] = useState(false);
  const [confirmDone, setConfirmDone] = useState(false);
  const declineTimer = useRef(null);

  // Clean up decline timer on unmount
  useEffect(() => () => clearTimeout(declineTimer.current), []);

  const incoming = requests.find((r) => INCOMING.includes(r.status));
  const activeJob = requests.find((r) => ACTIVE.includes(r.status));
  const completed = requests.filter((r) => DONE.includes(r.status));
  const mapJob = incoming || activeJob || null;

  // ── Accept: mark arrived immediately (simulates "on my way" → "arrived")
  const handleAccept = async () => {
    setActing(true);
    try {
      await markArrived(incoming.id);
      onToast("Job accepted! Head to the location.", "success");
      onRefresh();
    } catch {
      onToast("Could not accept job.", "error");
    } finally {
      setActing(false);
    }
  };

  // ── Decline: just removes from this demo view
  const handleDecline = () => {
    setDeclining(true);
    declineTimer.current = setTimeout(() => {
      onToast(
        "Job declined. You'll receive the next available request.",
        "info",
      );
      setDeclining(false);
      onRefresh();
    }, 600);
  };

  // Complete active job logic removed from dashboard;
  // technicians must open the Job details page to follow the steps properly.

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight text-surface-900 tracking-tight">
          Hello, {user?.name?.split(" ")[0] || "there"}{" "}
          <Hand size={22} className="text-brand-500" />
        </h2>
        <p className="text-surface-700 text-lg mt-2 font-medium font-medium">
          {incoming
            ? "You have a new job request!"
            : activeJob
              ? "You have an active job."
              : "No active jobs right now."}
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-4xl md:text-5xl font-display font-bold tracking-tighter text-surface-900 tracking-tight">
              {completed.length}
            </p>
            <p className="text-xs text-surface-500 mt-1 uppercase tracking-wider font-semibold">
              Completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-4xl md:text-5xl font-display font-bold tracking-tighter text-surface-900 tracking-tight">
              {requests.length}
            </p>
            <p className="text-xs text-surface-500 mt-1 uppercase tracking-wider font-semibold">
              Total Jobs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-4xl md:text-5xl font-display font-bold tracking-tighter text-brand-600 tracking-tight">
              {incoming || activeJob ? 1 : 0}
            </p>
            <p className="text-xs text-brand-500 mt-1 uppercase tracking-wider font-semibold">
              Active Now
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── INCOMING JOB NOTIFICATION ── */}
      {incoming && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse shadow-sm" />
            <h3 className="font-semibold text-surface-900 text-sm uppercase tracking-wide">
              New Job Request
            </h3>
            <Bell size={16} className="text-brand-500" />
          </div>

          <div className="bg-surface-950 rounded-none p-6 text-surface-50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-surface-50/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="flex items-start justify-between mb-5 relative z-10">
              <div>
                <p className="text-surface-50 text-xs font-bold uppercase tracking-widest mb-1.5">
                  Incoming Job
                </p>
                <p className="font-bold text-2xl leading-snug tracking-tight">
                  {incoming.problem}
                </p>
                <p className="text-surface-50 text-sm mt-1 font-medium">
                  {incoming.clientName}
                </p>
              </div>
              <div className="bg-surface-50 border border-surface-200 rounded-md p-3 shadow-inner">
                <Briefcase size={20} className="text-surface-950" />
              </div>
            </div>

            <div className="space-y-2.5 mb-6 relative z-10">
              <div className="flex items-center gap-2.5 text-surface-50 text-sm font-medium">
                <MapPin size={15} className="shrink-0 text-surface-50" />
                <span>
                  {decodeLocation(incoming.location).label || incoming.location}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-surface-50 text-sm font-medium">
                <Phone size={15} className="shrink-0 text-surface-50" />
                <span>{incoming.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-surface-50 text-sm font-medium">
                <Clock size={15} className="shrink-0 text-surface-50" />
                <span>Waiting for response…</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <Button
                variant="outline"
                onClick={handleDecline}
                disabled={declining || acting}
                className="bg-surface-950/40 hover:bg-surface-950/60 border-surface-950/40 text-surface-50 backdrop-blur-sm"
              >
                <X size={16} /> Decline
              </Button>
              <Button
                variant="default"
                onClick={handleAccept}
                disabled={acting || declining}
                className="bg-surface-50 hover:bg-surface-100 text-brand-500 shadow-sm hover:-translate-y-1"
              >
                {acting ? (
                  "Accepting…"
                ) : (
                  <>
                    <Navigation size={16} className="text-brand-500" /> Accept
                    Job
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── ACTIVE JOB (on my way / working) ── */}
      {activeJob && (
        <section>
          <h3 className="font-semibold text-surface-900 mb-3 text-sm uppercase tracking-wide">
            Current Job
          </h3>
          <Card className="bg-surface-950 text-surface-50 space-y-5 relative overflow-hidden border-surface-800">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/20 rounded-full blur-[40px] pointer-events-none" />
            <CardContent className="p-6 relative z-10 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-1.5 mt-0">
                    Active Job
                  </p>
                  <p className="font-bold text-xl leading-snug tracking-tight">
                    {activeJob.problem}
                  </p>
                  <p className="text-surface-400 text-sm mt-1 font-medium">
                    {activeJob.clientName}
                  </p>
                </div>
                <StatusBadge status={activeJob.status} />
              </div>

              <div className="flex items-center gap-2.5 text-surface-300 text-sm font-medium">
                <MapPin size={15} className="shrink-0 text-surface-500" />
                <span>
                  {decodeLocation(activeJob.location).label ||
                    activeJob.location}
                </span>
              </div>

              <div>
                <JobTracker status={activeJob.status} />
              </div>

              <div className="bg-surface-900/80 border border-surface-800 rounded-md px-5 py-4 text-sm text-surface-300 font-medium shadow-inner">
                {activeJob.status === "ARRIVED"
                  ? "You've arrived. Inspect the problem to provide a budget."
                  : activeJob.status === "ESTIMATED"
                    ? "Waiting for the client to approve your estimate."
                    : activeJob.status === "APPROVED"
                      ? "Client approved the budget. You can start the work."
                      : "You are currently working on this repair."}
              </div>

              <Button
                onClick={() => onOpenJob(activeJob.id)}
                className="w-full"
              >
                Open Job Details
              </Button>
            </CardContent>
          </Card>
        </section>
      )}

      {/* ── IDLE ── */}
      {!incoming && !activeJob && (
        <section>
          <Card className="p-10 text-center space-y-3 shadow-subtle border-dashed">
            <div className="w-16 h-16 bg-surface-50 rounded-none flex items-center justify-center mx-auto mb-2">
              <Briefcase size={28} className="text-surface-400" />
            </div>
            <p className="font-semibold text-surface-600 text-base">
              No active job
            </p>
            <p className="text-sm text-surface-400 max-w-[200px] mx-auto leading-relaxed">
              New requests will appear here automatically when assigned.
            </p>
          </Card>
        </section>
      )}

      {/* ── RECENT COMPLETED ── */}
      {completed.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-surface-900 text-sm uppercase tracking-wide">
              Recent Completed
            </h3>
            <button
              onClick={() => onNav("history")}
              className="text-xs font-semibold text-brand-500 hover:text-brand-500 transition-colors flex items-center gap-1"
            >
              See all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {completed.slice(0, 3).map((r) => (
              <Card key={r.id} className="shadow-sm">
                <CardContent className="px-5 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-surface-50 border border-surface-200 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} className="text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-surface-900 truncate">
                      {r.clientName}
                    </p>
                    <p className="text-xs text-surface-500 truncate font-medium mt-0.5">
                      {r.problem}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ── MAP FOR CURRENT JOB ─ */}
      {mapJob &&
        (() => {
          const legacy = decodeLocation(mapJob.location);
          const lat =
            typeof mapJob.latitude === "number" ? mapJob.latitude : legacy.lat;
          const lng =
            typeof mapJob.longitude === "number"
              ? mapJob.longitude
              : legacy.lng;
          const label = legacy.label || mapJob.location;
          if (lat == null || lng == null) return null;
          return (
            <section>
              <h3 className="font-semibold text-surface-900 mb-3 text-sm uppercase tracking-wide">
                Job Location
              </h3>
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-surface-600 flex items-center gap-1.5">
                      <MapPin size={14} className="text-brand-500" /> {label}
                    </p>
                  </div>
                  <div className="rounded-md overflow-hidden border border-surface-200 h-64 bg-surface-50 shadow-inner">
                    <MapContainer
                      center={[lat, lng]}
                      zoom={14}
                      scrollWheelZoom={false}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution="&copy; OpenStreetMap contributors"
                      />
                      <Marker
                        position={[lat, lng]}
                        icon={getVehicleIcon(
                          mapJob.vehicleType,
                          mapJob.problem,
                        )}
                      />
                    </MapContainer>
                  </div>
                </CardContent>
              </Card>
            </section>
          );
        })()}
    </div>
  );
}
