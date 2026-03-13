/** portals/technician/pages/TechHistory.jsx */
import { CheckCircle2, XCircle, MapPin, Calendar } from "lucide-react";
import { StatusBadge } from "../../../components/ui/StatusBadge.jsx";
import { formatDate } from "../../../utils/helpers.js";

export function TechHistory({ requests }) {
  const done = requests.filter(r => ["PAID", "COMPLETED"].includes(r.status));

  if (done.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400 text-sm">No completed jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-bold text-slate-900 text-lg">Job History</h2>
        <span className="text-xs text-gray-400">{done.length} jobs</span>
      </div>
      {done.map(r => (
        <div key={r.id} className="bg-white rounded-2xl border border-gray-100 px-4 py-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-0.5">
                {r.id.slice(-8).toUpperCase()}
              </p>
              <p className="font-semibold text-slate-900 leading-snug">{r.problem}</p>
              <p className="text-sm text-gray-500">{r.clientName}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <StatusBadge status={r.status} />
              {r.payment && (
                <span className="text-sm font-bold text-emerald-700">${r.payment.amount}</span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mt-2">
            <span className="flex items-center gap-1"><MapPin size={10} />{r.location}</span>
            <span className="flex items-center gap-1"><Calendar size={10} />{formatDate(r.updatedAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
