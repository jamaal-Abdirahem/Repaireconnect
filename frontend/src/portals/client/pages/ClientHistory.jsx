/** portals/client/pages/ClientHistory.jsx */
import { useState, useEffect, useCallback } from "react";
import { Search, Car, MapPin, CalendarDays } from "lucide-react";
import { getRequests } from "../../../api/requests.js";
import { StatusBadge } from "../../../components/ui/StatusBadge.jsx";
import { formatDate } from "../../../utils/helpers.js";
import { REQUEST_STATUS } from "../../../utils/constants.js";

const DONE_STATUSES = [REQUEST_STATUS.PAID, REQUEST_STATUS.COMPLETED];

export function ClientHistory({ onToast }) {
  const [all, setAll]         = useState([]);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const data = await getRequests();
      setAll(data);
    } catch (err) {
      onToast("Could not load requests.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = all.filter(r => {
    const q = search.toLowerCase();
    return [r.problem, r.location, r.id].some(f => f?.toLowerCase().includes(q));
  });

  if (loading) return <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search requests…"
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-800 transition"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-10">No requests found.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 px-4 py-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-0.5">
                    {r.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="font-semibold text-slate-900 leading-snug">{r.problem}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
                <span className="flex items-center gap-1"><MapPin size={11} />{r.location}</span>
                <span className="flex items-center gap-1"><CalendarDays size={11} />{formatDate(r.createdAt)}</span>
                {r.payment && (
                  <span className="font-semibold text-slate-900 ml-auto">${r.payment.amount}</span>
                )}
              </div>
              {r.technician && (
                <p className="text-xs text-gray-400 mt-1.5">
                  Technician: <span className="text-slate-600">{r.technician.user?.name}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
