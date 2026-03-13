/** portals/technician/pages/TechDashboard.jsx */
import { useState } from "react";
import { MapPin, Phone, Briefcase, CheckCircle2, Bell, Clock, X, Navigation } from "lucide-react";
import { JobTracker } from "../../../components/ui/JobTracker.jsx";
import { StatusBadge } from "../../../components/ui/StatusBadge.jsx";
import { markArrived, markComplete } from "../../../api/requests.js";

const INCOMING  = ["ASSIGNED"];
const ACTIVE    = ["IN_PROGRESS"];
const DONE      = ["COMPLETED", "PAID"];

export function TechDashboard({ requests, onRefresh, onNav, onOpenJob, onToast, user }) {
  const [declining, setDeclining] = useState(false);
  const [acting, setActing]       = useState(false);
  const [confirmDone, setConfirmDone] = useState(false);

  const incoming  = requests.find(r => INCOMING.includes(r.status));
  const activeJob = requests.find(r => ACTIVE.includes(r.status));
  const completed = requests.filter(r => DONE.includes(r.status));

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
    setTimeout(() => {
      onToast("Job declined. You'll receive the next available request.", "info");
      setDeclining(false);
      onRefresh();
    }, 600);
  };

  // ── Complete active job
  const handleComplete = async () => {
    setActing(true);
    try {
      await markComplete(activeJob.id);
      setConfirmDone(false);
      onToast("Job marked complete. Waiting for client payment.", "success");
      onRefresh();
    } catch {
      onToast("Could not complete job.", "error");
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">

      <div>
        <h2 className="text-xl font-bold text-slate-900">Hello, {user?.name?.split(" ")[0] || "there"} 👋</h2>
        <p className="text-gray-500 text-sm mt-0.5">
          {incoming ? "You have a new job request!" : activeJob ? "You have an active job." : "No active jobs right now."}
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{completed.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Completed</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{requests.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Total Jobs</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{incoming || activeJob ? 1 : 0}</p>
          <p className="text-xs text-gray-400 mt-0.5">Active Now</p>
        </div>
      </div>

      {/* ── INCOMING JOB NOTIFICATION ── */}
      {incoming && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="font-semibold text-slate-900 text-sm">New Job Request</h3>
            <Bell size={14} className="text-amber-500" />
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-amber-100 text-xs font-bold uppercase tracking-widest mb-1">
                  Incoming Job
                </p>
                <p className="font-bold text-xl leading-snug">{incoming.problem}</p>
                <p className="text-amber-100 text-sm mt-0.5">{incoming.clientName}</p>
              </div>
              <div className="bg-white/20 rounded-xl p-2.5">
                <Briefcase size={18} />
              </div>
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-amber-100 text-sm">
                <MapPin size={13} className="shrink-0" />
                <span>{incoming.location}</span>
              </div>
              <div className="flex items-center gap-2 text-amber-100 text-sm">
                <Phone size={13} className="shrink-0" />
                <span>{incoming.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-amber-100 text-sm">
                <Clock size={13} className="shrink-0" />
                <span>Waiting for response…</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDecline}
                disabled={declining || acting}
                className="py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <X size={14} /> Decline
              </button>
              <button
                onClick={handleAccept}
                disabled={acting || declining}
                className="py-3 rounded-xl bg-white text-orange-600 font-bold text-sm hover:bg-amber-50 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {acting ? "Accepting…" : <><Navigation size={14} /> Accept Job</>}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── ACTIVE JOB (on my way / working) ── */}
      {activeJob && (
        <section>
          <h3 className="font-semibold text-slate-900 mb-3 text-sm">Current Job</h3>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-0.5">
                  In Progress
                </p>
                <p className="font-bold text-lg leading-snug">{activeJob.problem}</p>
                <p className="text-slate-300 text-sm">{activeJob.clientName}</p>
              </div>
              <StatusBadge status={activeJob.status} />
            </div>

            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <MapPin size={12} className="shrink-0" />
              <span>{activeJob.location}</span>
            </div>

            <JobTracker status={activeJob.status} />

            <div className="bg-white/10 rounded-xl px-4 py-3 text-sm text-slate-300">
              ✓ You've arrived. Complete the repair then mark the job done.
            </div>

            {!confirmDone ? (
              <button
                onClick={() => setConfirmDone(true)}
                className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-emerald-400 transition-colors"
              >
                Mark Job as Complete
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-amber-300 text-center">Confirm job is fully complete?</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setConfirmDone(false)} className="py-2.5 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20">
                    Cancel
                  </button>
                  <button onClick={handleComplete} disabled={acting} className="py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 disabled:opacity-60">
                    {acting ? "Updating…" : "Yes, Done"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── IDLE ── */}
      {!incoming && !activeJob && (
        <section>
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-2">
            <Briefcase size={24} className="mx-auto text-gray-300" />
            <p className="font-semibold text-gray-500 text-sm">No active job</p>
            <p className="text-xs text-gray-400">New requests will appear here automatically.</p>
          </div>
        </section>
      )}

      {/* ── RECENT COMPLETED ── */}
      {completed.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 text-sm">Recent Completed</h3>
            <button onClick={() => onNav("history")} className="text-xs text-gray-400 hover:text-slate-900">See all →</button>
          </div>
          <div className="space-y-2">
            {completed.slice(0, 3).map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{r.clientName}</p>
                  <p className="text-xs text-gray-400 truncate">{r.problem}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
