/** portals/technician/pages/TechRequests.jsx */
import { MapPin, Phone, Calendar, ArrowRight, Briefcase } from "lucide-react";
import { StatusBadge } from "../../../components/ui/StatusBadge.jsx";
import { Card, CardContent } from "../../../components/ui/card.jsx";
import { formatDate } from "../../../utils/helpers.js";

// Lifted to module level — prevents unnecessary remount on each parent re-render
function JobCard({ r, onOpenJob }) {
  return (
    <Card 
      onClick={() => onOpenJob(r.id)}
      className="cursor-pointer hover:shadow-sm hover:border-surface-200 transition-all duration-200 group relative overflow-hidden"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-brand-500 transition-colors" />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              {r.id.slice(-8).toUpperCase()}
            </p>
            <p className="font-bold text-surface-900 leading-snug truncate text-lg">{r.problem}</p>
            <p className="text-sm text-surface-500 mt-1 font-medium">{r.clientName}</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <StatusBadge status={r.status} />
            <div className="w-8 h-8 rounded-full bg-surface-50 flex items-center justify-center group-hover:bg-surface-100 group-hover:text-brand-500 transition-colors mt-1">
              <ArrowRight size={14} className="text-surface-500 group-hover:text-brand-500 transition-colors" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-surface-500 font-medium mt-4 pt-4 border-t border-surface-50">
          <span className="flex items-center gap-1.5"><MapPin size={12} className="text-surface-500" />{r.location}</span>
          <span className="flex items-center gap-1.5"><Phone size={12} className="text-surface-500" />{r.phone}</span>
          <span className="flex items-center gap-1.5"><Calendar size={12} className="text-surface-500" />{formatDate(r.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function TechRequests({ requests, onOpenJob }) {
  const active  = requests.filter(r => ["ASSIGNED", "ARRIVED", "ESTIMATED", "APPROVED", "IN_PROGRESS"].includes(r.status));
  const pending = requests.filter(r => r.status === "COMPLETED");
  const done    = requests.filter(r => r.status === "PAID");

  if (requests.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto mt-6 shadow-sm">
        <CardContent className="p-10 text-center">
          <Briefcase size={32} className="mx-auto text-surface-300 mb-3" />
          <p className="text-surface-500 font-medium text-base">No jobs assigned yet.</p>
          <p className="text-surface-400 text-sm mt-1">When a job is assigned to you, it will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
      {active.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
             <h3 className="text-sm font-bold text-surface-900 uppercase tracking-wider">Active Jobs</h3>
             <span className="px-2 py-0.5 rounded-full bg-surface-100 text-surface-600 text-xs font-semibold">{active.length}</span>
          </div>
          <div className="space-y-3">{active.map(r => <JobCard key={r.id} r={r} onOpenJob={onOpenJob} />)}</div>
        </section>
      )}
      {pending.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 mt-6">
             <h3 className="text-sm font-bold text-surface-900 uppercase tracking-wider">Awaiting Payment</h3>
             <span className="px-2 py-0.5 rounded-full bg-surface-100 text-surface-600 text-xs font-semibold">{pending.length}</span>
          </div>
          <div className="space-y-3">{pending.map(r => <JobCard key={r.id} r={r} onOpenJob={onOpenJob} />)}</div>
        </section>
      )}
      {done.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4 mt-6">
             <h3 className="text-sm font-bold text-surface-900 uppercase tracking-wider">Completed & Paid</h3>
             <span className="px-2 py-0.5 rounded-full bg-surface-100 text-surface-600 text-xs font-semibold">{done.length}</span>
          </div>
          <div className="space-y-3">{done.map(r => <JobCard key={r.id} r={r} onOpenJob={onOpenJob} />)}</div>
        </section>
      )}
    </div>
  );
}
