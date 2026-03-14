/** portals/admin/pages/AdminFinancials.jsx */
import { useMemo } from "react";
import { CircleDollarSign, TrendingUp, Users, UserCheck } from "lucide-react";
import { Avatar } from "../../../components/ui/Avatar.jsx";
import { Card, CardContent } from "../../../components/ui/card.jsx";
import { formatDate } from "../../../utils/helpers.js";

// Lifted stat card component for reusability
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Card className="hover:shadow-sm hover:border-brand-200 transition-all duration-300 group hover:-translate-y-0.5">
      <CardContent className="p-6 text-left">
        <div className={`w-12 h-12 rounded-md flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform duration-300 ${color}`}>
          <Icon size={22} className="text-surface-50" />
        </div>
        <p className="text-3xl font-display font-bold text-surface-900 tracking-tight">{value}</p>
        <p className="text-sm text-surface-500 font-medium mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

export function AdminFinancials({ requests, technicians, users }) {
  // 1. Calculate Total Revenue
  const paidRequests = requests.filter(r => r.status === "PAID");
  const getAmount = (r) => r.payment?.amount || Number(r.budget) || 0;
  
  const totalRevenue = paidRequests.reduce((sum, r) => sum + getAmount(r), 0);

  // 2. Calculate Technician Earnings
  const techEarnings = useMemo(() => {
    const earningsMap = {};
    paidRequests.forEach(r => {
      if (!r.technicianId) return;
      if (!earningsMap[r.technicianId]) {
        earningsMap[r.technicianId] = {
          techId: r.technicianId,
          total: 0,
          jobsCnt: 0
        };
      }
      earningsMap[r.technicianId].total += getAmount(r);
      earningsMap[r.technicianId].jobsCnt += 1;
    });

    return Object.values(earningsMap)
      .map(entry => {
        const tech = technicians.find(t => t.id === entry.techId);
        return { ...entry, name: tech?.user?.name || "Unknown Tech" };
      })
      .sort((a, b) => b.total - a.total);
  }, [paidRequests, technicians]);

  // 3. Calculate Client Spending
  const clientSpending = useMemo(() => {
    const spendingMap = {};
    paidRequests.forEach(r => {
      if (!r.clientId) return;
      if (!spendingMap[r.clientId]) {
        spendingMap[r.clientId] = {
          clientId: r.clientId,
          total: 0,
          jobsCnt: 0
        };
      }
      spendingMap[r.clientId].total += getAmount(r);
      spendingMap[r.clientId].jobsCnt += 1;
    });

    return Object.values(spendingMap)
      .map(entry => {
        const client = users.find(u => u.id === entry.clientId);
        return { ...entry, name: client?.name || "Unknown Client" };
      })
      .sort((a, b) => b.total - a.total);
  }, [paidRequests, users]);

  // 4. Recent Transactions
  const recentTx = [...paidRequests]
    .sort((a, b) => {
      const dateA = new Date(a.payment?.createdAt || a.updatedAt);
      const dateB = new Date(b.payment?.createdAt || b.updatedAt);
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-display font-bold text-surface-900 tracking-tight">Financial Overview</h2>
        <p className="text-surface-700 text-lg mt-2 font-medium">Track revenue, technician payouts, and client spending.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard icon={CircleDollarSign} label="Total Revenue (All Time)" value={`$${totalRevenue.toFixed(2)}`} color="bg-brand-500 shadow-brand-500/20" />
        <StatCard icon={UserCheck}        label="Active Technicians"       value={technicians.length}                color="bg-brand-600 shadow-brand-500/20" />
        <StatCard icon={TrendingUp}       label="Completed Paid Jobs"      value={paidRequests.length}               color="bg-brand-500 shadow-brand-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Technician Earnings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-surface-900 text-lg">Top Earning Technicians</h3>
          </div>
          <Card>
            <CardContent className="p-5">
              {techEarnings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-surface-400">
                  <CircleDollarSign size={24} className="mb-2 text-surface-200" />
                  <p className="text-sm font-medium">No earnings data yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {techEarnings.slice(0, 5).map(tech => (
                    <div key={tech.techId} className="flex items-center justify-between p-3 hover:bg-surface-50 rounded-md transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar name={tech.name} size="sm" color="brand" />
                        <div>
                          <p className="text-sm font-bold text-surface-900">{tech.name}</p>
                          <p className="text-xs text-surface-500 font-medium mt-0.5">{tech.jobsCnt} {tech.jobsCnt === 1 ? 'job' : 'jobs'} completed</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-brand-500 bg-surface-50 px-2 py-1 rounded-md border border-surface-200">${tech.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Client Spending */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-surface-900 text-lg">Top Spending Clients</h3>
          </div>
          <Card>
            <CardContent className="p-5">
              {clientSpending.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-surface-400">
                   <Users size={24} className="mb-2 text-surface-200" />
                   <p className="text-sm font-medium">No spending data yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clientSpending.slice(0, 5).map(client => (
                    <div key={client.clientId} className="flex items-center justify-between p-3 hover:bg-surface-50 rounded-md transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar name={client.name} size="sm" color="brand" />
                        <div>
                          <p className="text-sm font-bold text-surface-900">{client.name}</p>
                          <p className="text-xs text-surface-500 font-medium mt-0.5">{client.jobsCnt} {client.jobsCnt === 1 ? 'job' : 'jobs'} paid</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-surface-900 bg-surface-50 px-2 py-1 rounded-md border border-surface-200">${client.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Recent Transactions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-surface-900 text-lg">Recent Transactions</h3>
        </div>
        <Card className="overflow-hidden divide-y divide-surface-100">
          <CardContent className="p-0">
            {recentTx.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-surface-400">
                <p className="text-sm font-medium">No recent transactions.</p>
              </div>
            ) : (
              recentTx.map((r) => (
                <div
                  key={r.payment?.id || r.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-surface-50 transition-colors border-b border-surface-100 last:border-b-0"
                >
                  <div className="w-10 h-10 rounded-md bg-surface-50 flex items-center justify-center shrink-0 border border-surface-200">
                    <CircleDollarSign size={18} className="text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-surface-900 text-sm truncate flex items-center gap-2">
                      <span>{r.clientName}</span>
                      <span className="text-surface-300">•</span>
                      <span className="font-normal text-surface-500">Paid to {(r.technician?.user?.name) || "Technician"}</span>
                    </p>
                    <p className="text-sm text-surface-500 truncate mt-0.5">{r.problem}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <p className="text-sm font-bold text-brand-500">+${getAmount(r).toFixed(2)}</p>
                    <p className="text-xs text-surface-400 font-medium">
                      {formatDate(r.payment?.createdAt || r.updatedAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

    </div>
  );
}
