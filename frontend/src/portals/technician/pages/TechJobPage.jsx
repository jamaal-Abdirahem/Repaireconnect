/** portals/technician/pages/TechJobPage.jsx */
import { useState, useEffect, useCallback } from "react";
import { MapPin, Phone, User, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { JobTracker } from "../../../components/ui/JobTracker.jsx";
import { StatusBadge } from "../../../components/ui/StatusBadge.jsx";
import { markArrived, markComplete, getRequest } from "../../../api/requests.js";
import { usePolling } from "../../../hooks/usePolling.js";

export function TechJobPage({ jobId, onToast, onDone }) {
  const [job, setJob]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [acting, setActing]     = useState(false);
  const [confirmDone, setConfirmDone] = useState(false);

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
  }, [jobId]);

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

  if (loading) return <div className="p-8 text-center text-gray-400 text-sm">Loading job…</div>;
  if (!job)    return <div className="p-8 text-center text-gray-400 text-sm">Job not found.</div>;

  const { status, clientName, phone, location, problem, payment } = job;

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-0.5">
              {job.id.slice(-8).toUpperCase()}
            </p>
            <p className="font-bold text-xl leading-snug">{problem}</p>
          </div>
          <StatusBadge status={status} />
        </div>
        <div className="space-y-1.5 text-sm text-slate-300">
          <div className="flex items-center gap-2"><User size={13} /><span>{clientName}</span></div>
          <div className="flex items-center gap-2"><Phone size={13} /><span>{phone}</span></div>
          <div className="flex items-center gap-2"><MapPin size={13} /><span>{location}</span></div>
        </div>
      </div>

      {/* Tracker */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Job Progress</p>
        <JobTracker status={status} />
      </div>

      {/* Action card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <h3 className="font-semibold text-slate-900 text-sm">Your Next Action</h3>

        {status === "ASSIGNED" && (
          <>
            <p className="text-sm text-gray-500">Head to the client's location and press the button when you arrive.</p>
            <div className="bg-blue-50 rounded-xl px-4 py-3 text-sm text-blue-800">
              📍 <strong>Location:</strong> {location}
            </div>
            <button
              onClick={handleArrived}
              disabled={acting}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {acting ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
              {acting ? "Updating…" : "I've Arrived at Location"}
            </button>
          </>
        )}

        {status === "IN_PROGRESS" && (
          <>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-800">
              ✓ Arrival confirmed. Complete your repair then mark the job as done.
            </div>
            {!confirmDone ? (
              <button
                onClick={() => setConfirmDone(true)}
                className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
              >
                Mark Job as Complete
              </button>
            ) : (
              <div className="space-y-2">
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  Confirm the job is fully complete? The client will be asked to pay.
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setConfirmDone(false)} className="py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button onClick={handleComplete} disabled={acting} className="py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60">
                    {acting ? "Updating…" : "Yes, Complete"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {status === "COMPLETED" && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-800">
            Job marked complete. Waiting for the client to approve and pay.
          </div>
        )}

        {status === "PAID" && (
          <div className="space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-4 text-center space-y-1">
              <CheckCircle2 size={28} className="text-emerald-500 mx-auto" />
              <p className="font-bold text-emerald-800">Job fully paid!</p>
              {payment && <p className="text-sm text-emerald-700">${payment.amount} received</p>}
            </div>
            <button
              onClick={onDone}
              className="w-full py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
