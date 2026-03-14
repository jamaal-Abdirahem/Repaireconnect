/** portals/client/components/ClientJobView.jsx */
import { useState } from "react";
import {
  CheckCircle2, XCircle, Receipt, UserCheck,
  MapPin, AlertTriangle, Loader2, Car, Wrench
} from "lucide-react";
import { JobTracker } from "../../../components/ui/JobTracker.jsx";
import { StatusBadge } from "../../../components/ui/StatusBadge.jsx";
import { approveRequest, approveEstimate, payRequest } from "../../../api/requests.js";
import { cls } from "../../../utils/helpers.js";
import { Card, CardContent } from "../../../components/ui/card.jsx";
import { Button } from "../../../components/ui/button.jsx";

export function ClientJobView({ request, onRefresh, onToast }) {
  const [payConfirm, setPayConfirm]   = useState(false);
  const [approving, setApproving]     = useState(false);
  const [paying, setPaying]           = useState(false);
  const [approved, setApproved]       = useState(false);

  const { id, status, problem, location, technician, problemReport, budget, payment, createdAt } = request;

  const handleApproveEstimate = async () => {
    setApproving(true);
    try {
      await approveEstimate(id);
      onToast("Budget approved. Technician will now start the work.", "success");
      onRefresh();
    } catch (err) {
      onToast(err.message || "Could not approve budget.", "error");
    } finally {
      setApproving(false);
    }
  };

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
    const amt = parseFloat(budget);
    if (!amt || amt <= 0) { onToast("Invalid payment amount.", "error"); return; }
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
      <div className="bg-surface-950  rounded-none p-6 text-surface-50 shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-brand-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div>
            <p className="text-brand-400 text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse"></span>
              {id.slice(-8).toUpperCase()}
            </p>
            <p className="font-bold text-xl leading-snug tracking-tight">{problem}</p>
            <p className="text-surface-400 text-sm mt-1 flex items-center gap-1.5 font-medium">
              <MapPin size={14} className="shrink-0 text-brand-500/70" />{location}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>
        {technician && (
          <div className="flex items-center gap-3 text-surface-300 text-sm mt-4 pt-4 border-t border-surface-800 relative z-10 bg-surface-900/50 -mx-6 -mb-6 px-6 pb-6 rounded-b-3xl">
            <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center border border-brand-500/20 shrink-0">
              <UserCheck size={14} className="text-brand-400" />
            </div>
            <span>Technician: <strong className="text-surface-50 ml-0.5">{technician.user?.name}</strong></span>
          </div>
        )}
      </div>

      {/* Tracker */}
      <div className="bg-surface-50 rounded-none border border-surface-200 p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-surface-100 rounded-full blur-3xl pointer-events-none -z-10" />
        <p className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-5 flex items-center gap-2">
          <span className="w-1 h-1 bg-surface-400 rounded-full"></span> Live Progress
        </p>
        <JobTracker status={status} />
      </div>

      {/* Reported — waiting for assignment */}
      {status === "REPORTED" && (
        <div className="bg-brand-500/10 border border-brand-500/20 rounded-none px-6 py-5 shadow-inner">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-brand-500/20 rounded-md flex items-center justify-center shrink-0">
              <Loader2 size={16} className="text-brand-600 animate-spin" />
            </div>
            <p className="font-semibold text-brand-900 text-base">Request received!</p>
          </div>
          <p className="text-brand-800 text-sm leading-relaxed pl-11">
            We've got your request and are finding the nearest available technician.
            You'll be notified as soon as one is assigned — typically within <strong className="font-bold">20–30 minutes</strong>.
            <span className="inline-flex items-center gap-2">
              Sit tight, help is on the way!
              <Car size={14} className="text-brand-500" />
              <Wrench size={14} className="text-brand-500" />
            </span>
          </p>
        </div>
      )}

      {/* Assigned — tech on the way */}
      {status === "ASSIGNED" && (
        <div className="bg-brand-500/10 border border-brand-500/20 rounded-none px-6 py-5 shadow-inner">
          <p className="font-semibold text-brand-900 mb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse"></span>
            Technician assigned & on their way
          </p>
          <p className="text-brand-800 text-sm leading-relaxed pl-3.5 border-l-2 border-brand-500/30 ml-0.5">
            <strong className="font-bold">{technician?.user?.name}</strong> has been assigned and is heading to your location.
          </p>
        </div>
      )}

      {/* Arrived — inspecting */}
      {status === "ARRIVED" && (
        <div className="bg-brand-500/10 border border-brand-500/20 rounded-none px-6 py-5 shadow-inner">
          <p className="font-semibold text-brand-900 mb-1.5 flex items-center gap-2">
            <MapPin size={16} className="text-brand-600" />
            Technician has arrived
          </p>
          <p className="text-brand-800 text-sm leading-relaxed pl-6">
            <strong className="font-bold">{technician?.user?.name}</strong> is currently inspecting the problem to provide a budget estimate.
          </p>
        </div>
      )}

      {/* Estimated — client approval needed */}
      {status === "ESTIMATED" && (
        <div className="bg-brand-50/80 border border-brand-200 rounded-none p-6 shadow-sm space-y-5">
          <div>
            <p className="font-bold text-brand-900 mb-1.5 flex items-center gap-2.5 text-lg">
              <span className="w-8 h-8 rounded-md bg-brand-100 flex items-center justify-center">
                <AlertTriangle size={16} className="text-brand-600" />
              </span>
              Budget Approval Required
            </p>
            <p className="text-brand-800 text-sm font-medium pl-10.5">
              The technician has inspected the issue. Please review the report and approve the budget to start work.
            </p>
          </div>
          
          <div className="bg-surface-50 rounded-none p-5 border border-brand-100 shadow-sm space-y-4">
            <div>
              <p className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-1.5">Technician Report</p>
              <p className="text-surface-800 text-sm leading-relaxed font-medium bg-surface-50 p-3.5 rounded-md border border-surface-100">{problemReport || "No report provided."}</p>
            </div>
            <div className="pt-4 border-t border-surface-100 flex items-center justify-between gap-4 bg-brand-50/30 -mx-5 -mb-5 px-5 py-4 rounded-b-2xl mt-2">
              <p className="text-xs font-bold text-surface-500 uppercase tracking-widest">Estimated Budget</p>
              <p className="text-2xl font-black text-brand-600 tracking-tight">${budget || "0.00"}</p>
            </div>
          </div>

          <Button
            onClick={handleApproveEstimate}
            disabled={approving}
            className="w-full mt-2"
            size="lg"
          >
            {approving ? (
              <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Approving...</span>
            ) : `Approve & Start Work ($${budget})`}
          </Button>
        </div>
      )}

      {/* Approved — waiting for tech to start */}
      {status === "APPROVED" && (
        <div className="bg-brand-50 border border-brand-200 rounded-none px-6 py-5 flex items-start gap-3 shadow-inner">
          <CheckCircle2 size={20} className="text-brand-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-brand-900 mb-0.5 text-base">Budget Approved</p>
            <p className="text-brand-800 text-sm font-medium">
              You have approved the budget. The technician is preparing to start the repair.
            </p>
          </div>
        </div>
      )}

      {/* In progress */}
      {status === "IN_PROGRESS" && (
        <div className="bg-brand-50 border border-brand-200 rounded-none px-6 py-5 shadow-inner">
          <p className="font-semibold text-brand-900 mb-1.5 flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
            </span>
            Technician is on-site working
          </p>
          <p className="text-brand-800 text-sm pl-5.5 font-medium">
            <strong className="font-bold">{technician?.user?.name}</strong> has arrived and is currently working on your vehicle.
          </p>
        </div>
      )}

      {/* Completed — approve + pay */}
      {status === "COMPLETED" && (
        <div className="space-y-4">
          <div className="bg-brand-50 border border-brand-200 rounded-none px-6 py-5 shadow-inner flex items-start gap-3">
            <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center shrink-0">
               <CheckCircle2 size={16} className="text-brand-600" />
            </div>
            <div>
              <p className="font-semibold text-brand-900 mb-0.5 mt-1 text-base">Work completed!</p>
              <p className="text-brand-800 text-sm font-medium">
                The technician has finished. Please approve the work and complete payment to close the job.
              </p>
            </div>
          </div>

          {/* Approve gate */}
          {!approved ? (
            <Button
              onClick={handleApprove}
              disabled={approving}
              className="w-full gap-2"
              size="lg"
            >
              {approving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={18} className="text-brand-400" />}
              {approving ? "Approving…" : "Approve Completed Work"}
            </Button>
          ) : (
            <div className="bg-brand-500/10 border border-brand-500/20 rounded-none px-5 py-3.5 text-sm font-medium flex items-center gap-2.5 text-brand-800">
              <CheckCircle2 size={16} className="text-brand-600" /> 
              Work approved. Please complete your payment below.
            </div>
          )}

          {/* Payment */}
          {approved && (
            <Card className="shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2.5 text-surface-900 font-bold text-lg">
                  <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-surface-600">
                    <Receipt size={16} />
                  </div>
                  Complete Payment
                </div>
                <div className="bg-surface-50 rounded-none p-4 border border-surface-100">
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-widest block mb-2">Payment Amount</label>
                  <div className="text-3xl font-black text-surface-900 tracking-tight flex items-center gap-1">
                    <span className="text-surface-400 text-2xl font-display font-bold tracking-tight border-r border-surface-300 pr-2 mr-1">$</span>{budget || "0.00"}
                  </div>
                </div>
                {!payConfirm ? (
                  <Button
                    onClick={() => setPayConfirm(true)}
                    disabled={!budget || parseFloat(budget) <= 0}
                    className="w-full"
                    size="lg"
                  >
                    Pay ${budget || "0.00"}
                  </Button>
                ) : (
                  <div className="space-y-3 bg-surface-100/80 rounded-none p-4 border border-surface-200">
                    <p className="text-sm text-surface-600 font-medium text-center">Confirm payment of <strong className="text-surface-900 font-bold tracking-tight">${budget}</strong>?</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" onClick={() => setPayConfirm(false)} className="bg-surface-50">
                        Cancel
                      </Button>
                      <Button onClick={handlePay} disabled={paying} className="gap-2">
                         {paying && <Loader2 size={16} className="animate-spin" />}
                        {paying ? "Processing…" : "Confirm Payment"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Paid / Done */}
      {status === "PAID" && (
        <div className="bg-brand-50 border border-brand-200 rounded-none p-8 text-center space-y-3 shadow-inner">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-2 ring-8 ring-brand-500/5">
             <CheckCircle2 size={32} className="text-brand-500" />
          </div>
          <p className="font-bold text-brand-800">Job Complete — Payment Received</p>
          <p className="text-sm text-brand-700">
            Thank you for using RepairConnect. Your vehicle has been serviced.
            {payment && <span className="block mt-1 font-semibold">${payment.amount} paid successfully</span>}
          </p>
        </div>
      )}
    </div>
  );
}
