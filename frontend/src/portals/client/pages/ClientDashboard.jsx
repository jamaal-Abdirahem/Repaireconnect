/** portals/client/pages/ClientDashboard.jsx */
import { useState, useEffect, useCallback } from "react";
import { Car, Plus, Hand } from "lucide-react";
import { NewRequestForm } from "../components/NewRequestForm.jsx";
import { ClientJobView } from "../components/ClientJobView.jsx";
import { getRequests } from "../../../api/requests.js";
import { Card, CardContent } from "../../../components/ui/card.jsx";
import { Button } from "../../../components/ui/button.jsx";

const ACTIVE   = ["REPORTED", "ASSIGNED", "ARRIVED", "ESTIMATED", "APPROVED", "IN_PROGRESS", "COMPLETED"];
const DONE     = ["PAID"];

export function ClientDashboard({ onToast, user }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Load client's existing requests from the backend on mount
  const fetchRequests = useCallback(async () => {
    try {
      const data = await getRequests();
      setRequests(data);
    } catch (err) {
      onToast("Could not load your requests.", "error");
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const activeJob = requests.find(r => ACTIVE.includes(r.status));

  const handleSuccess = (newReq) => {
    setShowForm(false);
    setRequests(prev => [newReq, ...prev]);
    onToast("Request submitted! We'll assign a technician shortly.", "success");
  };

  const handleRefresh = () => fetchRequests();

  const firstName = user?.name?.split(" ")[0] || "there";

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-6 max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-200 rounded-md w-64" />
          <div className="h-5 bg-surface-200 rounded-md w-48" />
          <div className="h-64 bg-surface-200 rounded-none w-full mt-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto relative bg-surface-50 min-h-screen">
      <div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-surface-950 tracking-tighter flex items-center gap-3">
          Hello, {firstName} <Hand size={28} className="text-brand-500 animate-bounce origin-bottom" />
        </h2>
        <p className="text-surface-700 font-medium text-lg mt-2">
          {activeJob ? "Tracking your active service request." : showForm ? "Fill in the details below." : "Need roadside help? We're here 24/7."}
        </p>
      </div>

      <div className="relative z-10 space-y-6">
      {showForm ? (
        <Card className="rounded-none border border-surface-200">
          <CardContent className="p-6 md:p-10">
            <NewRequestForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} defaultName={user?.name} defaultPhone={user?.phone} />
          </CardContent>
        </Card>
      ) : activeJob ? (
        <div className="space-y-6">
          <ClientJobView request={activeJob} onRefresh={handleRefresh} onToast={onToast} />
          <Button
            variant="outline"
            onClick={() => setShowForm(true)}
            className="w-full py-6 rounded-full border border-dashed border-surface-200 text-surface-700 font-semibold text-sm hover:border-brand-500 hover:text-brand-500 hover:bg-surface-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Submit another request
          </Button>
        </div>
      ) : (
        <div className="bg-surface-50 border border-surface-200 p-10 md:p-16 text-center space-y-8 group relative overflow-hidden">
          {/* Hover Fill Animation */}
          <div className="absolute inset-0 bg-surface-950 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1] z-0" />
          
          <div className="w-20 h-20 bg-surface-100 group-hover:bg-brand-500 rounded-md flex items-center justify-center mx-auto transition-colors duration-500 relative z-10">
            <Car size={36} className="text-surface-950 group-hover:text-surface-50 transition-colors duration-500" />
          </div>
          <div className="space-y-4 relative z-10">
            <h3 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-surface-950 group-hover:text-surface-50 transition-colors duration-500">
              No active request
            </h3>
            <p className="text-surface-700 group-hover:text-surface-500 text-lg leading-relaxed max-w-md mx-auto transition-colors duration-500">
              Our certified technicians are standing by, ready to help you get back on the road safely and quickly.
            </p>
          </div>
          <div className="relative z-10 pt-4">
            <Button
              size="lg"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold bg-surface-950 group-hover:bg-brand-500 text-surface-50 transition-all text-lg hover:scale-105"
            >
              <Plus size={20} /> Request a Technician
            </Button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
