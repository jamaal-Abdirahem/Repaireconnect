/** portals/admin/pages/AdminClients.jsx */
import { Phone, CalendarDays, Briefcase, Users } from "lucide-react";
import { Avatar } from "../../../components/ui/Avatar.jsx";
import { Badge } from "../../../components/ui/Badge.jsx";
import { Card, CardContent } from "../../../components/ui/card.jsx";
import { formatDate } from "../../../utils/helpers.js";
import { ROLES } from "../../../utils/constants.js";

export function AdminClients({ users, requests }) {
  const clients = users.filter(u => u.role === ROLES.CLIENT);

  const requestCountFor = (userId) =>
    requests.filter(r => r.clientId === userId).length;

  const activeRequestFor = (userId) =>
    requests.find(r => r.clientId === userId && ["REPORTED", "ASSIGNED", "ARRIVED", "ESTIMATED", "APPROVED", "IN_PROGRESS", "COMPLETED"].includes(r.status));

  if (clients.length === 0) {
    return (
      <Card className="mx-4 md:mx-auto max-w-3xl mt-8 shadow-sm">
        <CardContent className="text-center py-12">
          <Users size={32} className="mx-auto text-surface-200 mb-3" />
          <p className="text-surface-500 text-sm font-medium">No clients registered.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-end justify-between border-b border-surface-200 pb-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-surface-900 tracking-tight">Clients</h2>
          <p className="text-surface-700 text-lg mt-2 font-medium">Manage and view registered customer accounts</p>
        </div>
        <span className="text-sm font-medium bg-surface-100 text-surface-600 px-3 py-1 rounded-lg border border-surface-200 shadow-sm">{clients.length} registered</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clients.map(u => {
          const count = requestCountFor(u.id);
          const active = activeRequestFor(u.id);
          return (
            <Card key={u.id} className="hover:shadow-sm transition-all duration-200 group">
              <CardContent className="p-5 flex items-center gap-4">
                <Avatar name={u.name} size="md" color="amber" className="shadow-sm group-hover:scale-105 transition-transform" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-surface-900 text-lg tracking-tight truncate">{u.name}</p>
                  <div className="space-y-1 mt-1.5 font-medium">
                    <p className="text-sm text-surface-500 flex items-center gap-1.5">
                      <Phone size={14} className="text-surface-400" /> {u.phone}
                    </p>
                    <p className="text-xs text-surface-400 flex items-center gap-1.5">
                      <CalendarDays size={14} className="text-surface-300" /> Joined {formatDate(u.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {active && <Badge color="yellow" className="animate-pulse shadow-sm">Active job</Badge>}
                  <span className="text-sm font-semibold text-brand-600 flex items-center gap-1.5 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-100">
                    <Briefcase size={14} /> {count} {count === 1 ? "request" : "requests"}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
