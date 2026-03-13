/** portals/admin/pages/AdminTechnicians.jsx */
import { Phone, MapPin, Briefcase, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Avatar } from "../../../components/ui/Avatar.jsx";
import { Badge } from "../../../components/ui/Badge.jsx";
import { setTechnicianAvailability } from "../../../api/users.js";
import { cls } from "../../../utils/helpers.js";

export function AdminTechnicians({ technicians, onRefresh, onToast }) {
  const [toggling, setToggling] = useState(null);

  const handleToggle = async (tech) => {
    setToggling(tech.id);
    try {
      await setTechnicianAvailability(tech.id, !tech.available);
      onToast(
        `${tech.user?.name} marked as ${!tech.available ? "available" : "unavailable"}.`,
        "success"
      );
      onRefresh();
    } catch (err) {
      onToast(err.message || "Could not update availability.", "error");
    } finally {
      setToggling(null);
    }
  };

  if (technicians.length === 0) {
    return <p className="text-center text-gray-400 text-sm py-10">No technicians registered.</p>;
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-bold text-slate-900 text-lg">Technicians</h2>
        <div className="flex gap-2 text-xs text-gray-500">
          <span className="text-emerald-600 font-semibold">
            {technicians.filter(t => t.available).length} available
          </span>
          <span>·</span>
          <span>{technicians.filter(t => !t.available).length} busy</span>
        </div>
      </div>

      {technicians.map(t => (
        <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
          <div className="relative">
            <Avatar name={t.user?.name} size="md" color="emerald" />
            <span
              className={cls(
                "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                t.available ? "bg-emerald-500" : "bg-amber-400"
              )}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900">{t.user?.name}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <Phone size={10} /> {t.user?.phone}
            </p>
            {t.location && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <MapPin size={10} /> {t.location}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge color={t.available ? "green" : "yellow"}>
              {t.available ? "Available" : "On Job"}
            </Badge>
            <button
              onClick={() => handleToggle(t)}
              disabled={!!toggling}
              className={cls(
                "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors",
                t.available
                  ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
                  : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
              )}
            >
              {toggling === t.id
                ? <Loader2 size={11} className="animate-spin" />
                : t.available
                  ? <ToggleRight size={13} />
                  : <ToggleLeft size={13} />
              }
              {t.available ? "Set Busy" : "Set Free"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
