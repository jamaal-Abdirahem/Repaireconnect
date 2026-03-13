/** portals/client/components/ClientJobView.jsx */
import { useState } from "react";
import {
  CheckCircle2, XCircle, Receipt, UserCheck,
  MapPin, AlertTriangle, Loader2
} from "lucide-react";
import { JobTracker } from "../../../components/ui/JobTracker.jsx";
import { StatusBadge } from "../../../components/ui/StatusBadge.jsx";
import { approveRequest, payRequest } from "../../../api/requests.js";
import { cls } from "../../../utils/helpers.js";

export function ClientJobView({ request, onRefresh, onToast }) {
  const [payAmount, setPayAmount] = useState("");
  const [payConfirm, setPayConfirm]   = useState(false);
  const [approving, setApproving]     = useState(false);
  const [paying, setPaying]           = useState(false);
  const [approved, setApproved]       = useState(false);

  const { id, status, problem, location, technician, payment, createdAt } = request;

  const handleApprove = async () => {
    setApproving(true);
    try {
      await approveRequest(id);
      setApproved(true);
      onToast("Work approved. You can now complete payment.", "success");
      onRefresh();
    } catch (err) {
      onToast(err.message || "Could not approve.", "error");
    } finally {
      setApproving(false);
    }
  };

  const handlePay = async () => {
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0) { onToast("Enter a valid payment amount.", "error"); return; }
    setPaying(true);
    try {
      await payRequest(id, amt);
      onToast("Payment confirmed! Thank you for using RepairConnect.", "success");
      onRefresh();
    } catch (err) {
      onToast(err.message || "Payment failed.", "error");
    } finally {
      setPaying(false);
      setPayConfirm(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Status header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-0.5">
              {id.slice(-8).toUpperCase()}
            </p>
            <p className="font-bold text-lg leading-snug">{problem}</p>
            <p className="text-slate-300 text-sm mt-0.5 flex items-center gap-1.5">
              <MapPin size={12} className="shrink-0" />{location}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>
        {technician && (
          <div className="flex items-center gap-2 text-slate-300 text-sm mt-3 pt-3 border-t border-white/10">
            <UserCheck size={14} className="text-emerald-400 shrink-0" />
            <span>Technician: <strong className="text-white">{technician.user?.name}</strong></span>
          </div>
        )}
      </div>

      {/* Tracker */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Live Progress</p>
        <JobTracker status={status} />
      </div>

      {/* Reported — waiting for assignment */}
      {status === "REPORTED" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <div className="flex items-center gap-2.5 mb-1.5">
            <Loader2 size={16} className="text-amber-600 animate-spin" />
            <p className="font-semibold text-amber-800">Request received!</p>
          </div>
          <p className="text-amber-700 text-sm leading-relaxed">
            We've got your request and are finding the nearest available technician.
            You'll be notified as soon as one is assigned — typically within <strong>20–30 minutes</strong>.
            Sit tight, help is on the way! 🚗🔧
          </p>
        </div>
      )}

      {/* Assigned — tech on the way */}
      {status === "ASSIGNED" && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4">
          <p className="font-semibold text-blue-900 mb-1">Technician assigned & on their way</p>
          <p className="text-blue-700 text-sm">
            <strong>{technician?.user?.name}</strong> has been assigned to your request and is heading to your location.
          </p>
        </div>
      )}

      {/* In progress */}
      {status === "IN_PROGRESS" && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-5 py-4">
          <p className="font-semibold text-indigo-900 mb-1">Technician is on-site working</p>
          <p className="text-indigo-700 text-sm">
            <strong>{technician?.user?.name}</strong> has arrived and is currently working on your vehicle.
          </p>
        </div>
      )}

      {/* Completed — approve + pay */}
      {status === "COMPLETED" && (
        <div className="space-y-3">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4">
            <p className="font-semibold text-orange-900 mb-1">Work completed!</p>
            <p className="text-orange-700 text-sm">
              The technician has finished. Please approve the work and complete payment to close the job.
            </p>
          </div>

          {/* Approve gate */}
          {!approved ? (
            <button
              onClick={handleApprove}
              disabled={approving}
              className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              {approving ? "Approving…" : "✓ Approve Completed Work"}
            </button>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-sm flex items-center gap-2 text-emerald-700">
              <CheckCircle2 size={14} /> Work approved. Complete your payment below.
            </div>
          )}

          {/* Payment */}
          {approved && (
            <div className="bg-white rounded-2xl border border-amber-200 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 font-semibold">
                <Receipt size={15} /> Complete Payment
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Payment Amount (USD)</label>
                <input
                  type="number"
                  min="1"
                  value={payAmount}
                  onChange={e => setPayAmount(e.target.value)}
                  placeholder="Enter amount agreed with technician"
                  className="w-full pl-3.5 pr-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-800 transition"
                />
              </div>
              {!payConfirm ? (
                <button
                  onClick={() => setPayConfirm(true)}
                  disabled={!payAmount || parseFloat(payAmount) <= 0}
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-40"
                >
                  Pay ${payAmount || "0.00"}
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 text-center">Confirm payment of <strong>${payAmount}</strong>?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setPayConfirm(false)} className="py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                      Cancel
                    </button>
                    <button onClick={handlePay} disabled={paying} className="py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60">
                      {paying ? "Processing…" : "Confirm"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Paid / Done */}
      {status === "PAID" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-2">
          <CheckCircle2 size={32} className="text-emerald-500 mx-auto" />
          <p className="font-bold text-emerald-800">Job Complete — Payment Received</p>
          <p className="text-sm text-emerald-700">
            Thank you for using RepairConnect. Your vehicle has been serviced.
            {payment && <span className="block mt-1 font-semibold">${payment.amount} paid successfully</span>}
          </p>
        </div>
      )}
    </div>
  );
}
