/** portals/technician/pages/TechRequests.jsx */
import { MapPin, Phone, Calendar, ArrowRight } from "lucide-react";
import { StatusBadge } from "../../../components/ui/StatusBadge.jsx";
import { formatDate } from "../../../utils/helpers.js";

export function TechRequests({ requests, onOpenJob }) {
  const active  = requests.filter(r => ["ASSIGNED", "IN_PROGRESS"].includes(r.status));
  const pending = requests.filter(r => r.status === "COMPLETED");
  const done    = requests.filter(r => r.status === "PAID");

  const Card = ({ r }) => (
    <button
      onClick={() => onOpenJob(r.id)}
      className="w-full bg-white rounded-2xl border border-gray-100 px-4 py-4 text-left hover:border-gray-300 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-0.5">
            {r.id.slice(-8).toUpperCase()}
          </p>
          <p className="font-semibold text-slate-900 leading-snug truncate">{r.problem}</p>
          <p className="text-sm text-gray-500 mt-0.5">{r.clientName}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <StatusBadge status={r.status} />
          <ArrowRight size={13} className="text-gray-300 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mt-2">
        <span className="flex items-center gap-1"><MapPin size={10} />{r.location}</span>
        <span className="flex items-center gap-1"><Phone size={10} />{r.phone}</span>
        <span className="flex items-center gap-1"><Calendar size={10} />{formatDate(r.createdAt)}</span>
      </div>
    </button>
  );

  if (requests.length === 0) {
    return <div className="p-8 text-center"><p className="text-gray-400 text-sm">No jobs assigned yet.</p></div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      {active.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Active Jobs</h3>
          <div className="space-y-2">{active.map(r => <Card key={r.id} r={r} />)}</div>
        </section>
      )}
      {pending.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Awaiting Payment</h3>
          <div className="space-y-2">{pending.map(r => <Card key={r.id} r={r} />)}</div>
        </section>
      )}
      {done.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Completed & Paid</h3>
          <div className="space-y-2">{done.map(r => <Card key={r.id} r={r} />)}</div>
        </section>
      )}
    </div>
  );
}
