/** portals/technician/pages/TechJobPage.jsx */
import { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Phone,
  User,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { JobTracker } from "../../../components/ui/JobTracker.jsx";
import { StatusBadge } from "../../../components/ui/StatusBadge.jsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../../components/ui/card.jsx";
import { Button } from "../../../components/ui/button.jsx";
import { Input } from "../../../components/ui/input.jsx";
import { Textarea } from "../../../components/ui/textarea.jsx";
import { Badge } from "../../../components/ui/badge.jsx";
import {
  markArrived,
  submitEstimate,
  startWork,
  markComplete,
  getRequest,
} from "../../../api/requests.js";
import { usePolling } from "../../../hooks/usePolling.js";
import { decodeLocation } from "../../../utils/helpers.js";
import { getVehicleIcon } from "../../../components/ui/mapIcons.js";

export function TechJobPage({ jobId, onToast, onDone }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [confirmDone, setConfirmDone] = useState(false);
  const [reportText, setReportText] = useState("");
  const [budgetVal, setBudgetVal] = useState("");

  const fetchJob = useCallback(async () => {
    if (!jobId) return;
    try {
      const data = await getRequest(jobId);
      setJob(data);
    } catch (err) {
      onToast("Could not load job details.", "error");
    } finally {
      setLoading(false);
    }
  }, [jobId, onToast]);

  usePolling(fetchJob, 8_000, !!jobId);

  const handleArrived = async () => {
    setActing(true);
    try {
      const updated = await markArrived(job.id);
      setJob(updated);
      onToast("Arrival confirmed. Start your inspection.", "success");
    } catch (err) {
      onToast(err.message || "Could not mark arrival.", "error");
    } finally {
      setActing(false);
    }
  };

  const handleComplete = async () => {
    setActing(true);
    try {
      const updated = await markComplete(job.id);
      setJob(updated);
      setConfirmDone(false);
      onToast("Job marked as complete. Awaiting client payment.", "success");
    } catch (err) {
      onToast(err.message || "Could not complete job.", "error");
    } finally {
      setActing(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-surface-500 text-sm">Loading job…</div>
    );
  if (!job)
    return (
      <div className="p-8 text-center text-surface-500 text-sm">
        Job not found.
      </div>
    );

  const {
    status,
    clientName,
    phone,
    location,
    latitude,
    longitude,
    vehicleType,
    problem,
    problemReport,
    budget,
    payment,
  } = job;
  const decodedLocation = decodeLocation(location);
  const mapLat = typeof latitude === "number" ? latitude : decodedLocation.lat;
  const mapLng =
    typeof longitude === "number" ? longitude : decodedLocation.lng;
  const label = decodedLocation.label || location;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <Card className="bg-surface-950 text-surface-50 relative overflow-hidden border-surface-800">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/20 rounded-full blur-[50px] pointer-events-none" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-1 mt-0 flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-brand-500" /> JOB {job.id.slice(-8).toUpperCase()}
              </p>
              <p className="font-bold text-2xl leading-snug tracking-tight">{problem}</p>
            </div>
            <StatusBadge status={status} />
          </div>
          <div className="space-y-2.5 text-sm text-surface-300 font-medium relative z-10 mt-6 pt-4 border-t border-surface-800">
            <div className="flex items-center gap-2.5">
              <User size={15} className="text-surface-500" />
              <span>{clientName}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={15} className="text-surface-500" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-2.5 items-start">
              <MapPin size={15} className="text-surface-500 mt-0.5 shrink-0" />
              <span className="leading-snug">{label}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracker */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <p className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-5 flex items-center gap-2">
             <span className="w-8 h-px bg-surface-200" /> Job Progress <span className="flex-1 h-px bg-surface-200" />
          </p>
          <JobTracker status={status} />
        </CardContent>
      </Card>

      {/* Map for this job */}
      {mapLat != null && mapLng != null && (
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-surface-600 mb-3 flex items-center gap-2">
              <MapPin size={14} className="text-brand-500" /> {label}
            </p>
            <div className="rounded-md overflow-hidden border border-surface-200 h-64 bg-surface-50 shadow-inner">
              <MapContainer
                center={[mapLat, mapLng]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker
                  position={[mapLat, mapLng]}
                  icon={getVehicleIcon(vehicleType, problem)}
                />
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 px-6 pt-6">
          <CardTitle className="font-bold text-surface-900 text-sm uppercase tracking-wider">
            Your Next Action
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-4">
          {status === "ASSIGNED" && (
          <>
            <p className="text-sm text-surface-500 font-medium">
              Head to the client's location and press the button when you allow.
            </p>
            <div className="bg-brand-50 border border-brand-200 rounded-md px-4 py-3 text-sm text-brand-900 font-medium shadow-inner">
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} className="text-brand-500" /> <strong>Location:</strong> {location}
              </span>
            </div>
            <Button
              onClick={handleArrived}
              disabled={acting}
              className="w-full py-6 md:py-6"
            >
              {acting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              {acting ? "Updating…" : "I've Arrived at Location"}
            </Button>
          </>
        )}

        {status === "ARRIVED" && (
          <div className="space-y-5">
            <div className="bg-surface-50 border border-surface-100 p-4 rounded-md">
              <p className="text-sm text-surface-600 font-medium leading-relaxed">
                Inspect the vehicle and provide a report and budget estimate below
                for client approval.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-surface-600 uppercase tracking-widest block mb-1.5 ml-1">
                  Diagnostics Report
                </label>
                <Textarea
                  rows={3}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="e.g. Found a short circuit in the alternator wiring..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-surface-600 uppercase tracking-widest block mb-1.5 ml-1">
                  Estimated Budget (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 font-medium">$</span>
                  <Input
                    type="number"
                    min="1"
                    value={budgetVal}
                    onChange={(e) => setBudgetVal(e.target.value)}
                    placeholder="150"
                    className="pl-8"
                  />
                </div>
              </div>
              <Button
                onClick={async () => {
                  const b = parseFloat(budgetVal);
                  if (!reportText.trim() || !b || b <= 0) {
                    onToast(
                      "Please provide a valid report and budget.",
                      "error",
                    );
                    return;
                  }
                  setActing(true);
                  try {
                    const up = await submitEstimate(job.id, reportText, b);
                    setJob(up);
                    onToast("Estimate sent to client for approval.", "success");
                  } catch (err) {
                    onToast(err.message, "error");
                  } finally {
                    setActing(false);
                  }
                }}
                disabled={acting || !reportText.trim() || !budgetVal}
                className="w-full py-6 bg-brand-500 hover:bg-surface-950 text-surface-50"
              >
                {acting ? "Submitting…" : "Submit Estimate to Client"}
              </Button>
            </div>
          </div>
        )}

        {status === "ESTIMATED" && (
            <div className="bg-brand-50 border border-brand-200 rounded-md p-5 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <p className="font-bold text-brand-900 flex items-center gap-2 text-base relative z-10">
              <Loader2 size={18} className="animate-spin text-brand-500" />{" "}
              Waiting for Approval
            </p>
            <p className="text-brand-800 text-sm font-medium relative z-10 leading-relaxed">
              Your estimate of <span className="bg-surface-50 px-1.5 py-0.5 rounded-md font-bold">${budget}</span> has been sent. Wait
              here until the client reviews and approves it.
            </p>
          </div>
        )}

        {status === "APPROVED" && (
          <div className="space-y-4">
            <div className="bg-surface-50 border border-surface-200 rounded-md px-5 py-4 flex items-start gap-3 shadow-inner">
              <CheckCircle2
                size={20}
                className="text-brand-500 mt-0.5 shrink-0"
              />
              <div>
                <p className="font-bold text-surface-950 mb-1 leading-snug">
                  Budget Approved
                </p>
                <p className="text-surface-950 text-sm font-medium">
                  The client has approved your estimate of{" "}
                  <strong className="bg-surface-50 px-1.5 py-0.5 rounded-md text-surface-950">${budget}</strong>.
                </p>
              </div>
            </div>
            <Button
              onClick={async () => {
                setActing(true);
                try {
                  const up = await startWork(job.id);
                  setJob(up);
                  onToast("Work started!", "success");
                } catch (err) {
                  onToast(err.message, "error");
                } finally {
                  setActing(false);
                }
              }}
              disabled={acting}
              className="w-full py-6"
            >
              Start Work
            </Button>
          </div>
        )}

        {status === "IN_PROGRESS" && (
          <>
            <div className="bg-surface-50 border border-surface-200 rounded-md px-5 py-4 text-sm text-surface-950 font-medium shadow-inner flex items-center gap-2">
              <CheckCircle2 size={16} className="text-brand-500 shrink-0" />
              <span>Arrival confirmed. Complete your repair then mark the job as done.</span>
            </div>
            {!confirmDone ? (
              <Button
                onClick={() => setConfirmDone(true)}
                className="w-full py-6"
              >
                Mark Job as Complete
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="bg-surface-50 border border-surface-200 rounded-md px-4 py-3.5 text-sm text-surface-950 flex items-start gap-2.5 font-medium shadow-inner">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0 text-brand-500" />
                  Confirm the job is fully complete? The client will be asked to
                  pay.
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => setConfirmDone(false)}
                    variant="outline"
                    className="py-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleComplete}
                    disabled={acting}
                    className="py-6"
                  >
                    {acting ? "Updating…" : "Yes, Complete"}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {status === "COMPLETED" && (
           <div className="bg-surface-50 border border-surface-200 rounded-md px-5 py-4 text-sm text-surface-950 font-medium shadow-inner flex items-center gap-2">
             <Loader2 size={16} className="animate-spin text-brand-500 shrink-0" />
             Job marked complete. Waiting for the client to approve and pay.
          </div>
        )}

        {status === "PAID" && (
          <div className="space-y-4">
            <div className="bg-surface-50 border border-surface-200 rounded-md px-5 py-6 text-center space-y-2 shadow-inner">
              <CheckCircle2 size={32} className="text-brand-500 mx-auto" />
              <p className="font-bold text-surface-950 text-lg tracking-tight">Job fully paid!</p>
              {payment && (
                <p className="text-sm text-surface-950 font-medium">
                  <span className="bg-surface-100 px-2 py-1 rounded-lg">${payment.amount} received</span>
                </p>
              )}
            </div>
            <Button
              onClick={onDone}
              variant="outline"
              className="w-full py-6"
            >
              Back to Dashboard
            </Button>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
