/** portals/client/pages/ClientHistory.jsx */
import { useState, useEffect, useCallback } from "react";
import { Search, Car, MapPin, CalendarDays } from "lucide-react";
import { getRequests } from "../../../api/requests.js";
import { StatusBadge } from "../../../components/ui/StatusBadge.jsx";
import { formatDate } from "../../../utils/helpers.js";
import { REQUEST_STATUS } from "../../../utils/constants.js";
import { Card, CardContent } from "../../../components/ui/card.jsx";
import { Input } from "../../../components/ui/input.jsx";

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
  }, [onToast]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = all.filter(r => {
    const q = search.toLowerCase();
    return [r.problem, r.location, r.id].some(f => f?.toLowerCase().includes(q));
  });

  if (loading) return (
    <div className="p-8 space-y-4 max-w-3xl mx-auto">
      {[1, 2, 3].map(i => <div key={i} className="h-28 bg-surface-200 rounded-none animate-pulse" />)}
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="relative group">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 group-focus-within:text-brand-500 transition-colors z-10" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search your service history…"
          className="w-full pl-12 pr-6 py-6 bg-surface-50 rounded-none text-sm font-medium text-surface-900 placeholder:text-surface-400 shadow-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center bg-surface-50 border-dashed shadow-sm">
          <CardContent className="py-16 px-4">
            <Car size={32} className="mx-auto text-surface-500 mb-3" />
             <p className="text-surface-500 text-base font-medium">No service history found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(r => (
            <Card key={r.id} className="shadow-sm hover:shadow-md hover:border-surface-200 transition-all duration-200 group">
              <CardContent className="px-6 py-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full"></span>
                      {r.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="font-bold text-surface-900 leading-snug text-lg group-hover:text-brand-500 transition-colors">{r.problem}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-surface-500 mt-4 pt-4 border-t border-surface-100 font-medium">
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-surface-500" />{r.location}</span>
                  <span className="flex items-center gap-1.5"><CalendarDays size={14} className="text-surface-500" />{formatDate(r.createdAt)}</span>
                  {r.payment && (
                    <span className="font-bold text-surface-900 ml-auto flex items-center gap-0.5 bg-surface-100 text-brand-500 px-2 py-0.5 rounded-lg border border-surface-200">
                      <span className="text-brand-500 font-medium">$</span>{r.payment.amount}
                    </span>
                  )}
                </div>
                {r.technician && (
                  <div className="flex items-center gap-2 text-xs font-medium text-surface-500 mt-3 bg-surface-50 w-fit px-3 py-1.5 rounded-lg border border-surface-100">
                    <div className="w-4 h-4 bg-surface-100 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-brand-500 rounded-full"></div>
                    </div>
                    Technician: <span className="text-surface-700 font-bold">{r.technician.user?.name}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
