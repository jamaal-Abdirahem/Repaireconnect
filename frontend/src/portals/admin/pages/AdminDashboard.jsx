/** portals/admin/pages/AdminDashboard.jsx */
import { MapPin, UserCheck, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { StatusBadge } from "../../../components/ui/StatusBadge.jsx";
import { formatDate } from "../../../utils/helpers.js";

export function AdminDashboard({ requests, technicians, onNav }) {
  const total    = requests.length;
  const reported = requests.filter(r => r.status === "REPORTED").length;
  const active   = requests.filter(r => ["ASSIGNED","IN_PROGRESS"].includes(r.status)).length;
  const paid     = requests.filter(r => r.status === "PAID").length;
  const availTech = technicians.filter(t => t.available).length;

  const recent = [...requests].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const StatCard = ({ icon: Icon, label, value, color, onClick }) => (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 p-5 text-left hover:shadow-md transition-all group"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </button>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Operations Overview</h2>
        <p className="text-gray-500 text-sm mt-0.5">
          {reported > 0
            ? `${reported} request${reported > 1 ? "s" : ""} pending assignment.`
            : "All requests are assigned."}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Clock}       label="Total Requests"     value={total}     color="bg-slate-700"  onClick={() => onNav("requests")} />
        <StatCard icon={Clock}       label="Awaiting Assignment" value={reported}  color="bg-amber-500"  onClick={() => onNav("requests")} />
        <StatCard icon={CheckCircle2} label="Active Jobs"         value={active}    color="bg-emerald-500" onClick={() => onNav("requests")} />
        <StatCard icon={UserCheck}   label="Available Techs"    value={availTech} color="bg-indigo-500" onClick={() => onNav("technicians")} />
      </div>

      {/* Recent requests */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900 text-sm">Recent Requests</h3>
          <button
            onClick={() => onNav("requests")}
            className="text-xs text-gray-400 hover:text-slate-900 flex items-center gap-1"
          >
            View all <ArrowRight size={11} />
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {recent.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No requests yet.</p>
          )}
          {recent.map((r, i) => (
            <div
              key={r.id}
              className={`flex items-center gap-4 px-4 py-3.5 ${i < recent.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{r.clientName}</p>
                <p className="text-xs text-gray-400 truncate">{r.problem}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <p className="text-xs text-gray-400 hidden md:block">{formatDate(r.createdAt)}</p>
                <StatusBadge status={r.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
