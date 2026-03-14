/** portals/technician/pages/TechHistory.jsx */
import { CheckCircle2, MapPin, Calendar, Clock } from "lucide-react";
import { StatusBadge } from "../../../components/ui/StatusBadge.jsx";
import { formatDate } from "../../../utils/helpers.js";
import { Card, CardContent } from "../../../components/ui/card.jsx";

export function TechHistory({ requests }) {
  const done = requests.filter(r => ["PAID", "COMPLETED"].includes(r.status));

  if (done.length === 0) {
    return (
      <Card className="text-center max-w-2xl mx-auto mt-6 shadow-sm">
        <CardContent className="p-10">
          <Clock size={32} className="mx-auto text-surface-500 mb-3" />
          <p className="text-surface-500 font-medium">No completed jobs yet.</p>
          <p className="text-surface-400 text-sm mt-1">Your detailed job history will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-surface-900 text-xl tracking-tight">Job History</h2>
        <span className="text-xs font-semibold px-2.5 py-1 bg-surface-100 text-surface-600 rounded-full">{done.length} jobs</span>
      </div>
      {done.map(r => (
        <Card key={r.id} className="shadow-sm">
          <CardContent className="px-5 py-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  {r.id.slice(-8).toUpperCase()}
                </p>
                <p className="font-bold text-surface-900 leading-snug text-lg">{r.problem}</p>
                <p className="text-sm text-surface-500 font-medium mt-0.5">{r.clientName}</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <StatusBadge status={r.status} />
                {r.payment && (
                  <span className="text-base font-bold text-brand-500 px-2 py-0.5 bg-surface-100 rounded-lg">${r.payment.amount}</span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-surface-500 font-medium mt-4 pt-3 border-t border-surface-100">
              <span className="flex items-center gap-1.5"><MapPin size={12} className="text-surface-500" />{r.location}</span>
              <span className="flex items-center gap-1.5"><Calendar size={12} className="text-surface-500" />{formatDate(r.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
