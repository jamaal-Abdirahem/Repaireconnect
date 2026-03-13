/** portals/admin/pages/AdminClients.jsx */
import { Phone, CalendarDays, Briefcase } from "lucide-react";
import { Avatar } from "../../../components/ui/Avatar.jsx";
import { Badge } from "../../../components/ui/Badge.jsx";
import { formatDate } from "../../../utils/helpers.js";
import { ROLES } from "../../../utils/constants.js";

export function AdminClients({ users, requests }) {
  const clients = users.filter(u => u.role === ROLES.CLIENT);

  const requestCountFor = (userId) =>
    requests.filter(r => r.clientId === userId).length;

  const activeRequestFor = (userId) =>
    requests.find(r => r.clientId === userId && ["REPORTED","ASSIGNED","IN_PROGRESS","COMPLETED"].includes(r.status));

  if (clients.length === 0) {
    return <p className="text-center text-gray-400 text-sm py-10">No clients registered.</p>;
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-bold text-slate-900 text-lg">Clients</h2>
        <span className="text-xs text-gray-400">{clients.length} registered</span>
      </div>

      {clients.map(u => {
        const count  = requestCountFor(u.id);
        const active = activeRequestFor(u.id);
        return (
          <div key={u.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
            <Avatar name={u.name} size="md" color="amber" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900">{u.name}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Phone size={10} /> {u.phone}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <CalendarDays size={10} /> Joined {formatDate(u.createdAt)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              {active && <Badge color="yellow">Active job</Badge>}
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Briefcase size={10} /> {count} {count === 1 ? "request" : "requests"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
