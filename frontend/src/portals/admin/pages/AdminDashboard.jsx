/** portals/admin/pages/AdminDashboard.jsx */
import { UserCheck, Clock, CheckCircle2, ArrowRight, AlertTriangle } from "lucide-react";
import { StatusBadge } from "../../../components/ui/StatusBadge.jsx";
import { formatDate } from "../../../utils/helpers.js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card.jsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table.jsx";
import { Button } from "../../../components/ui/button.jsx";

// Lifted to module level — prevents unnecessary unmount/remount on parent re-renders
function StatCard({ icon: Icon, label, value, color, onClick }) {
  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border-surface-200">
      <CardContent className="p-6">
        <div className={`w-12 h-12 rounded-md flex items-center justify-center mb-4 shadow-sm ${color}`}>
          <Icon size={22} className="text-surface-50" />
        </div>
        <p className="text-3xl font-display font-bold text-surface-900 tracking-tight">{value}</p>
        <p className="text-sm text-surface-500 font-medium mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

export function AdminDashboard({ requests, technicians, onNav }) {
  const total    = requests.length;
  const reported = requests.filter(r => r.status === "REPORTED").length;
  const active   = requests.filter(r => ["ASSIGNED", "ARRIVED", "ESTIMATED", "APPROVED", "IN_PROGRESS"].includes(r.status)).length;
  const availTech = technicians.filter(t => t.available).length;

  const recent = [...requests].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-display font-bold text-surface-900 tracking-tight">Operations Overview</h2>
        <p className="text-surface-700 text-lg mt-2 font-medium">
          {reported > 0
            ? `${reported} request${reported > 1 ? "s" : ""} pending assignment.`
            : "All requests are assigned."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={Clock}         label="Total Requests"      value={total}     color="bg-brand-500 shadow-brand-500/20"   onClick={() => onNav("requests")} />
        <StatCard icon={AlertTriangle} label="Awaiting Assignment" value={reported}  color="bg-brand-500 shadow-brand-500/20"   onClick={() => onNav("requests")} />
        <StatCard icon={CheckCircle2}  label="Active Jobs"         value={active}    color="bg-brand-500 shadow-brand-500/20"   onClick={() => onNav("requests")} />
        <StatCard icon={UserCheck}     label="Available Techs"     value={availTech} color="bg-brand-500 shadow-brand-500/20"  onClick={() => onNav("technicians")} />
      </div>

      {/* Recent requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-surface-100">
          <div className="space-y-1">
            <CardTitle className="text-lg">Recent Requests</CardTitle>
            <CardDescription>The latest jobs reported by clients.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNav("requests")} className="gap-1.5 text-brand-600">
            View all <ArrowRight size={14} />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-surface-400">
              <Clock size={32} className="mb-3 text-surface-200" />
              <p className="text-sm font-medium">No requests yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Client</TableHead>
                  <TableHead>Problem</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.clientName}</TableCell>
                    <TableCell className="text-surface-600">{r.problem}</TableCell>
                    <TableCell className="hidden md:table-cell text-surface-500 text-xs">
                      {formatDate(r.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusBadge status={r.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
