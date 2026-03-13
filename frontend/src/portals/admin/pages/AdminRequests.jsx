/** portals/admin/pages/AdminRequests.jsx */
import { useState, useEffect } from "react";
import { Search, X, UserCheck, MapPin, Phone, Calendar, ChevronDown } from "lucide-react";
import { StatusBadge } from "../../../components/ui/StatusBadge.jsx";
import { Badge } from "../../../components/ui/Badge.jsx";
import { Avatar } from "../../../components/ui/Avatar.jsx";
import { assignRequest } from "../../../api/requests.js";
import { formatDate, cls } from "../../../utils/helpers.js";

const FILTERS = ["ALL", "REPORTED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "PAID"];

export function AdminRequests({ requests, technicians, onRefresh, onToast }) {
  const [filter, setFilter]   = useState("ALL");
  const [search, setSearch]   = useState("");
  const [assigning, setAssigning] = useState(null); // requestId being assigned
  const [loading, setLoading] = useState(false);

  const filtered = requests.filter(r => {
    const matchStatus = filter === "ALL" || r.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || [r.clientName, r.location, r.problem, r.id]
      .some(f => f?.toLowerCase().includes(q));
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

  const availableTechs = technicians.filter(t => t.available);

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by client, location, problem…"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cls(
                "px-3 py-2 rounded-xl text-xs font-semibold transition-all",
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              )}
            >
              {f === "ALL" ? "All" : f.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-8">No requests match the current filter.</p>
      )}

      <div className="space-y-2">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-0.5">
                    {r.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="font-semibold text-slate-900 leading-snug">{r.problem}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{r.clientName}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MapPin size={10} />{r.location}</span>
                <span className="flex items-center gap-1"><Phone size={10} />{r.phone}</span>
                <span className="flex items-center gap-1"><Calendar size={10} />{formatDate(r.createdAt)}</span>
              </div>

              {r.technician && (
                <div className="flex items-center gap-2 mt-2.5 text-sm text-gray-500">
                  <UserCheck size={12} className="text-emerald-500" />
                  <span>Assigned to <strong className="text-slate-700">{r.technician.user?.name}</strong></span>
                </div>
              )}

              {r.status === "REPORTED" && (
                <div className="mt-3">
                  {assigning === r.id ? (
                    <div className="border border-indigo-100 bg-indigo-50 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-indigo-700">Select a technician</p>
                        <button onClick={() => setAssigning(null)}><X size={13} className="text-gray-400" /></button>
                      </div>
                      {availableTechs.length === 0 ? (
                        <p className="text-xs text-gray-500">No technicians available right now.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {availableTechs.map(t => (
                            <button
                              key={t.id}
                              disabled={loading}
                              onClick={() => handleAssign(r.id, t.id)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white border border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left"
                            >
                              <Avatar name={t.user?.name} size="xs" color="emerald" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900">{t.user?.name}</p>
                                {t.location && <p className="text-xs text-gray-400 truncate">{t.location}</p>}
                              </div>
                              <Badge color="green">Available</Badge>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setAssigning(r.id)}
                      className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
                    >
                      <UserCheck size={13} /> Assign Technician
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
